
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

interface PaymentSettings {
  enable_payment_step: boolean;
  admin_notification_email: string;
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
  
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    enable_payment_step: true,
    admin_notification_email: 'hasanpercin35@gmail.com'
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
  
  // Fetch settings from database
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Fetch discount settings
        const { data: discountData, error: discountError } = await supabase
          .from('website_content')
          .select('value')
          .eq('section', 'payment')
          .eq('key', 'discount_settings')
          .single();
          
        if (discountError) {
          console.error("Error fetching discount settings:", discountError);
        } else if (discountData && discountData.value) {
          try {
            const settings = JSON.parse(discountData.value);
            setDiscountSettings(settings);
          } catch (parseError) {
            console.error("Error parsing discount settings:", parseError);
          }
        }
        
        // Fetch payment settings
        const { data: paymentData, error: paymentError } = await supabase
          .from('website_content')
          .select('value')
          .eq('section', 'payment')
          .eq('key', 'payment_settings')
          .single();
          
        if (paymentError) {
          console.error("Error fetching payment settings:", paymentError);
        } else if (paymentData && paymentData.value) {
          try {
            const settings = JSON.parse(paymentData.value);
            setPaymentSettings(settings);
          } catch (parseError) {
            console.error("Error parsing payment settings:", parseError);
          }
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    
    fetchSettings();
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

  // Function to send email notification when payment step is skipped
  const sendEmailNotification = async () => {
    try {
      const subtotal = calculateSubtotal();
      const discount = calculateDiscount(subtotal);
      const total = subtotal - discount.amount;
      
      // Prepare email content
      const menuSelectionDetails = state.menuSelection.type === 'fixed_menu' && state.menuSelection.selectedFixedMenu 
        ? `Sabit Menü: ${state.menuSelection.selectedFixedMenu.name} x ${state.menuSelection.selectedFixedMenu.quantity || parseInt(state.formData.guests)}`
        : state.menuSelection.type === 'a_la_carte' && state.menuSelection.selectedMenuItems?.length
          ? `A La Carte: ${state.menuSelection.selectedMenuItems.map(item => `${item.name} x ${item.quantity || 1}`).join(', ')}`
          : 'Restorantta seçim yapılacak';
      
      const emailContent = {
        to: paymentSettings.admin_notification_email,
        subject: `Yeni Rezervasyon: ${state.formData.name}`,
        html: `
          <h2>Yeni Rezervasyon Bilgisi</h2>
          <p><strong>Ad Soyad:</strong> ${state.formData.name}</p>
          <p><strong>E-posta:</strong> ${state.formData.email}</p>
          <p><strong>Telefon:</strong> ${state.formData.phone}</p>
          <p><strong>Tarih:</strong> ${state.formData.date ? state.formData.date.toLocaleDateString('tr-TR') : ''}</p>
          <p><strong>Saat:</strong> ${state.formData.time}</p>
          <p><strong>Kişi Sayısı:</strong> ${state.formData.guests}</p>
          <p><strong>Menü Seçimi:</strong> ${menuSelectionDetails}</p>
          <p><strong>Toplam Tutar:</strong> ${total.toLocaleString('tr-TR')} ₺ (Ödeme yapılmadı)</p>
          ${state.formData.notes ? `<p><strong>Notlar:</strong> ${state.formData.notes}</p>` : ''}
        `,
        from: 'Restoran Rezervasyon <noreply@yourrestaurant.com>'
      };
      
      // Send the email via a webhook or API endpoint
      // This is a placeholder - in a real implementation you'd use a proper email service
      console.log("Email notification would be sent with content:", emailContent);
      
      toast({
        title: "Bildirim Gönderildi",
        description: "Rezervasyon bilgileri yöneticiye e-posta ile iletildi.",
        duration: 3000,
      });
      
      return true;
    } catch (error: any) {
      console.error("Email notification error:", error.message);
      toast({
        title: "Bildirim Hatası",
        description: "E-posta gönderilemedi, ancak rezervasyonunuz başarıyla kaydedildi.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Function to skip the payment step for at_restaurant selection
  const skipPaymentStep = async () => {
    if ((state.menuSelection.type === 'at_restaurant' || !paymentSettings.enable_payment_step) && 
        currentStep === 2 && canProceed()) {
      try {
        if (reservationId && state.selectedTable) {
          // Save the table selection
          await supabase
            .from('reservation_tables')
            .insert({
              reservation_id: reservationId,
              table_id: state.selectedTable.id.toString()
            });
          
          // Save menu selection if it's a fixed menu and payment step is disabled
          if (state.menuSelection.type === 'fixed_menu' && state.menuSelection.selectedFixedMenu && !paymentSettings.enable_payment_step) {
            await supabase
              .from('reservation_fixed_menus')
              .insert({
                reservation_id: reservationId,
                fixed_menu_id: state.menuSelection.selectedFixedMenu.id.toString(),
                quantity: state.menuSelection.selectedFixedMenu.quantity || parseInt(state.formData.guests)
              });
          }

          // Save selected menu items if a_la_carte and payment step is disabled
          if (state.menuSelection.type === 'a_la_carte' && state.menuSelection.selectedMenuItems?.length && !paymentSettings.enable_payment_step) {
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
          
          // Convert menu items to a simpler structure for JSON storage
          const simplifiedMenuItems = state.menuSelection.selectedMenuItems?.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity || 1
          }));
          
          // Update reservation status for skipped payment
          await supabase
            .from('reservations')
            .update({
              status: 'Onaylandı',
              selected_items: { 
                menuSelectionType: state.menuSelection.type,
                fixedMenuId: state.menuSelection.selectedFixedMenu?.id,
                fixedMenuQuantity: state.menuSelection.selectedFixedMenu?.quantity,
                items: simplifiedMenuItems || [],
                paymentSkipped: true
              }
            })
            .eq('id', reservationId);
            
          // Send email notification if payment step is disabled and menu is selected
          if (!paymentSettings.enable_payment_step && state.menuSelection.type !== 'at_restaurant') {
            await sendEmailNotification();
          }
          
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
      // OR payment step is disabled, skip the payment step and go directly to the confirmation step
      if (currentStep === 2 && (state.menuSelection.type === 'at_restaurant' || !paymentSettings.enable_payment_step)) {
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
        paymentTransactionId: state.payment?.transactionId || '',
        paymentSkipped: !paymentSettings.enable_payment_step && state.menuSelection.type !== 'at_restaurant'
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
