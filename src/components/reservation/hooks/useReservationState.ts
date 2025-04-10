
import { useState, useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Table, 
  ReservationFormData, 
  ReservationState,
  MenuSelection,
  PaymentInfo
} from '../types/reservationTypes';
import { MenuItem } from '@/services/menuService';

interface DiscountSettings {
  standard_discount_percentage: number;
  high_amount_discount_percentage: number;
  high_amount_threshold: number;
}

export const useReservationState = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [reservationId, setReservationId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [discountSettings, setDiscountSettings] = useState<DiscountSettings>({
    standard_discount_percentage: 10,
    high_amount_discount_percentage: 15,
    high_amount_threshold: 3000,
  });
  
  const [state, setState] = useState<ReservationState>({
    selectedTable: null,
    basicFormCompleted: false,
    formData: {
      name: '',
      email: '',
      phone: '',
      date: null,
      time: '',
      guests: '2',
      notes: '',
    },
    menuSelection: {
      type: 'at_restaurant'
    }
  });
  
  // Fetch discount settings from database
  useEffect(() => {
    const fetchDiscountSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('website_content')
          .select('value')
          .eq('section', 'payment')
          .eq('key', 'discount_settings')
          .single();
          
        if (error) {
          console.error("Error fetching discount settings:", error);
          return;
        }
        
        if (data && data.value) {
          try {
            const settings = JSON.parse(data.value);
            setDiscountSettings(settings);
          } catch (parseError) {
            console.error("Error parsing discount settings:", parseError);
          }
        }
      } catch (error) {
        console.error("Error fetching discount settings:", error);
      }
    };
    
    fetchDiscountSettings();
  }, []);
  
  const handleFormDataChange = (data: Partial<ReservationFormData>) => {
    setState({
      ...state,
      formData: {
        ...state.formData,
        ...data,
      }
    });
  };

  useEffect(() => {
    const handleReservationCompleted = (event: CustomEvent) => {
      const newReservationId = event.detail?.reservationId;
      
      setState(prevState => ({
        ...prevState,
        basicFormCompleted: true,
        formData: {
          ...prevState.formData,
          ...(event.detail?.formData || {})
        }
      }));
      
      if (newReservationId) {
        setReservationId(newReservationId);
      }
      
      if (currentStep === 0) {
        setCurrentStep(1);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('reservationCompleted', 
        handleReservationCompleted as EventListener);

      return () => {
        container.removeEventListener('reservationCompleted', 
          handleReservationCompleted as EventListener);
      };
    }
  }, [currentStep]);

  // Calculate the total based on selection type for payment
  const calculateSubtotal = () => {
    if (state.menuSelection.type === 'fixed_menu' && state.menuSelection.selectedFixedMenu) {
      const quantity = state.menuSelection.selectedFixedMenu.quantity || parseInt(state.formData.guests);
      return state.menuSelection.selectedFixedMenu.price * quantity;
    } else if (state.menuSelection.type === 'a_la_carte' && state.menuSelection.selectedMenuItems) {
      return state.menuSelection.selectedMenuItems.reduce((sum, item) => {
        return sum + (item.price * (item.quantity || 1));
      }, 0);
    }
    return 0;
  };
  
  // Calculate discount using settings from the database
  const calculateDiscount = (subtotal: number) => {
    if (subtotal >= discountSettings.high_amount_threshold) {
      // High amount discount
      return {
        percentage: discountSettings.high_amount_discount_percentage,
        amount: subtotal * (discountSettings.high_amount_discount_percentage / 100)
      };
    } else if (subtotal > 0) {
      // Standard discount
      return {
        percentage: discountSettings.standard_discount_percentage,
        amount: subtotal * (discountSettings.standard_discount_percentage / 100)
      };
    }
    return {
      percentage: 0,
      amount: 0
    };
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: // Basic details
        return state.basicFormCompleted || (
          state.formData.name && 
          state.formData.email && 
          state.formData.phone && 
          state.formData.date && 
          state.formData.time && 
          state.formData.guests
        );
      case 1: // Table selection
        return state.selectedTable !== null;
      case 2: // Menu selection
        // Check if menu selection type exists and is not empty
        return state.menuSelection && 
               state.menuSelection.type !== undefined && 
               state.menuSelection.type.length > 0;  
      case 3: // Payment
        // Can only proceed if payment is completed
        return state.payment?.isPaid === true;
      default:
        return true;
    }
  };

  // Function to skip the payment step for at_restaurant selection
  const skipPaymentStep = async () => {
    if (state.menuSelection.type === 'at_restaurant' && currentStep === 2 && canProceed()) {
      try {
        if (reservationId && state.selectedTable) {
          // Save the table selection
          await supabase
            .from('reservation_tables')
            .insert({
              reservation_id: reservationId,
              table_id: state.selectedTable.id.toString()
            });
          
          // Update reservation status for 'at_restaurant' selection
          await supabase
            .from('reservations')
            .update({
              status: 'Onaylandı',
              selected_items: { 
                menuSelectionType: state.menuSelection.type
              }
            })
            .eq('id', reservationId);
            
          // Send webhook notification
          const webhookSuccess = await sendReservationToWebhook();
          if (webhookSuccess) {
            toast({
              title: "Rezervasyon Tamamlandı",
              description: "Rezervasyon bilgileri başarıyla kaydedildi.",
              variant: "default",
            });
          }
        }
        
        setCurrentStep(4); // Skip to confirmation step
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
      } catch (error: any) {
        console.error("Reservation update error:", error);
        toast({
          title: "Hata",
          description: "Rezervasyon bilgileri güncellenirken bir hata oluştu: " + error.message,
          variant: "destructive",
        });
      }
    }
  };
  
  const handleNextStep = async () => {
    if (currentStep < 4 && canProceed()) {
      // If it's the menu selection step and the user has selected "at_restaurant"
      // Skip the payment step and go directly to the confirmation step
      if (currentStep === 2 && state.menuSelection.type === 'at_restaurant') {
        await skipPaymentStep();
        return; // Exit early since skipPaymentStep takes care of the navigation
      }
      
      if (currentStep === 2) {
        // Moving from menu selection to payment step - no saving yet
        setCurrentStep(currentStep + 1);
      }
      else if (currentStep === 3) {
        try {
          if (reservationId && state.selectedTable) {
            // Save the table selection
            await supabase
              .from('reservation_tables')
              .insert({
                reservation_id: reservationId,
                table_id: state.selectedTable.id.toString()
              });
            
            // Save menu selection if it's a fixed menu
            if (state.menuSelection.type === 'fixed_menu' && state.menuSelection.selectedFixedMenu) {
              await supabase
                .from('reservation_fixed_menus')
                .insert({
                  reservation_id: reservationId,
                  fixed_menu_id: state.menuSelection.selectedFixedMenu.id.toString(),
                  quantity: state.menuSelection.selectedFixedMenu.quantity || parseInt(state.formData.guests)
                });
            }

            // Save selected menu items if a_la_carte
            if (state.menuSelection.type === 'a_la_carte' && state.menuSelection.selectedMenuItems?.length) {
              const menuItemEntries = state.menuSelection.selectedMenuItems.map(item => ({
                reservation_id: reservationId,
                menu_item_id: item.id,
                quantity: item.quantity || 1
              }));

              if (menuItemEntries.length > 0) {
                await supabase
                  .from('reservation_menu_items')
                  .insert(menuItemEntries);
              }
            }
          }
          
          // Calculate payment amounts
          const subtotal = calculateSubtotal();
          const discount = calculateDiscount(subtotal);
          const total = subtotal - discount.amount;
          
          // Add payment record
          if (reservationId && state.payment?.transactionId) {
            await supabase
              .from('reservation_payments')
              .insert({
                reservation_id: reservationId,
                amount: total,
                is_prepayment: true,
                payment_status: 'completed',
                transaction_id: state.payment.transactionId
              });
          }
          
          // Convert menu items to a simpler structure for JSON storage
          const simplifiedMenuItems = state.menuSelection.selectedMenuItems?.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity || 1
          }));
          
          // Update reservation status and menu selection type
          await supabase
            .from('reservations')
            .update({
              status: 'Onaylandı',
              total_amount: total,
              has_prepayment: true,
              selected_items: { 
                menuSelectionType: state.menuSelection.type,
                fixedMenuId: state.menuSelection.selectedFixedMenu?.id,
                fixedMenuQuantity: state.menuSelection.selectedFixedMenu?.quantity,
                items: simplifiedMenuItems || []
              }
            })
            .eq('id', reservationId);
            
          // Send webhook notification
          const webhookSuccess = await sendReservationToWebhook();
          if (webhookSuccess) {
            toast({
              title: "Rezervasyon Tamamlandı",
              description: "Rezervasyon bilgileri başarıyla kaydedildi ve iletildi.",
              variant: "default",
            });
          }
        } catch (error: any) {
          console.error("Reservation update error:", error);
          toast({
            title: "Hata",
            description: "Rezervasyon bilgileri güncellenirken bir hata oluştu: " + error.message,
            variant: "destructive",
          });
        }
      }
      
      setCurrentStep(currentStep + 1);
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      console.log("Can't proceed to next step", { 
        currentStep, 
        canProceed: canProceed(),
        state: {
          selectedTable: !!state.selectedTable,
          menuSelection: state.menuSelection
        }
      });
      
      toast({
        title: "Lütfen Tüm Gerekli Bilgileri Doldurun",
        description: "Devam etmek için gerekli tüm alanları doldurduğunuzdan emin olun.",
        variant: "destructive",
      });
    }
  };
  
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const sendReservationToWebhook = async () => {
    try {
      const webhookUrl = 'https://k2vqd09z.rpcd.app/webhook/eecc6166-3b73-4d10-bccb-b4a14ed51a6e';
      
      // Enhanced webhook data with menu selection details
      const menuSelectionDetails = state.menuSelection.type === 'at_restaurant' 
        ? 'Restoranda seçim yapılacak' 
        : state.menuSelection.type === 'fixed_menu' && state.menuSelection.selectedFixedMenu 
          ? `Sabit Menü: ${state.menuSelection.selectedFixedMenu.name}`
          : `A La Carte: ${state.menuSelection.selectedMenuItems?.map(item => `${item.name} (${item.quantity || 1})`).join(', ')}`;
      
      const webhookData = {
        name: state.formData.name,
        email: state.formData.email,
        phone: state.formData.phone,
        reservationId: reservationId,
        date: state.formData.date ? state.formData.date.toISOString().split('T')[0] : null,
        time: state.formData.time,
        guests: state.formData.guests,
        notes: state.formData.notes || '',
        occasion: state.formData.occasion || '',
        tableName: state.selectedTable?.name || state.selectedTable?.label || '',
        tableType: state.selectedTable?.type || '',
        tableSize: state.selectedTable?.size || 0,
        menuSelectionType: state.menuSelection?.type || 'at_restaurant',
        menuDetails: menuSelectionDetails,
        selectedFixedMenu: state.menuSelection?.selectedFixedMenu?.name || '',
        paymentAmount: state.payment?.amount || 0,
        paymentTransactionId: state.payment?.transactionId || ''
      };
      
      console.log("Sending reservation data to webhook:", JSON.stringify(webhookData, null, 2));
      
      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          mode: 'no-cors',
          body: JSON.stringify(webhookData)
        });
        
        console.log("Webhook notification attempted, no response expected due to no-cors mode");
      } catch (fetchError) {
        console.error("Fetch error in webhook:", fetchError);
      }
      
      toast({
        title: "Rezervasyon Bilgileri Gönderildi",
        description: "Rezervasyon bilgileri başarıyla sistem yöneticisine iletildi.",
        duration: 3000,
      });
      
      return true;
    } catch (error: any) {
      console.error("Webhook error:", error.message);
      toast({
        title: "Bildirim Hatası",
        description: "Rezervasyon bilgileri gönderilemedi, ancak rezervasyonunuz başarıyla kaydedildi.",
        variant: "destructive",
      });
      
      return false;
    }
  };

  const setSelectedTable = (table: Table | null) => {
    setState({
      ...state,
      selectedTable: table
    });
  };
  
  const setMenuSelection = (menuSelection: MenuSelection) => {
    setState({
      ...state,
      menuSelection
    });
  };
  
  const setPaymentComplete = (transactionId: string) => {
    // Calculate payment amounts
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount(subtotal);
    const total = subtotal - discount.amount;
    
    setState({
      ...state,
      payment: {
        transactionId,
        isPaid: true,
        amount: total,
        discountPercentage: discount.percentage,
        discountAmount: discount.amount
      }
    });
  };

  return {
    currentStep,
    containerRef,
    state,
    reservationId,
    canProceed,
    handleNextStep,
    handlePrevStep,
    setSelectedTable,
    setMenuSelection,
    setPaymentComplete,
    skipPaymentStep
  };
};
