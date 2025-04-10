
import { useState, useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Table, 
  ReservationFormData, 
  ReservationState,
  MenuSelection 
} from '../types/reservationTypes';
import { MenuItem } from '@/services/menuService';

export const useReservationState = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [reservationId, setReservationId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
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
      default:
        return true;
    }
  };
  
  const handleNextStep = async () => {
    if (currentStep < 3 && canProceed()) {
      if (currentStep === 2) {
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
                  quantity: parseInt(state.formData.guests)
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
              selected_items: { 
                menuSelectionType: state.menuSelection.type,
                fixedMenuId: state.menuSelection.selectedFixedMenu?.id,
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
      const webhookUrl = 'https://k2vqd09z.rpcd.app/webhook-test/eecc6166-3b73-4d10-bccb-b4a14ed51a6e';
      
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
        selectedFixedMenu: state.menuSelection?.selectedFixedMenu?.name || ''
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

  return {
    currentStep,
    containerRef,
    state,
    reservationId,
    canProceed,
    handleNextStep,
    handlePrevStep,
    setSelectedTable,
    setMenuSelection
  };
};
