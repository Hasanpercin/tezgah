
import { useState, useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Table, 
  FixMenuOption, 
  MenuItem, 
  ReservationFormData, 
  ReservationState 
} from '../types/reservationTypes';

export const useReservationState = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [reservationId, setReservationId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Initialize state
  const [state, setState] = useState<ReservationState>({
    selectedTable: null,
    selectedFixMenu: null,
    selectedALaCarteItems: [],
    selectAtRestaurant: false,
    isPrePayment: true,
    transactionId: null,
    basicFormCompleted: false,
    formData: {
      name: '',
      email: '',
      phone: '',
      date: null,
      time: '',
      guests: '2',
      notes: '',
    }
  });
  
  // Handle form data changes from the basic reservation form
  const handleFormDataChange = (data: Partial<ReservationFormData>) => {
    setState({
      ...state,
      formData: {
        ...state.formData,
        ...data,
      }
    });
  };

  // Handle the custom event from the ReservationForm component
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
      
      // İlk adım tamamlandığında bir sonraki adıma geç
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

  // Calculate total payment amount
  const calculateTotal = () => {
    let subtotal = 0;
    
    if (state.selectedFixMenu) {
      subtotal = state.selectedFixMenu.price * parseInt(state.formData.guests);
    } else {
      subtotal = state.selectedALaCarteItems.reduce(
        (sum, { item, quantity }) => sum + (item.price * quantity),
        0
      );
    }
    
    // Apply 10% discount for pre-payment
    if (state.isPrePayment) {
      return subtotal - Math.round(subtotal * 0.1);
    }
    
    return subtotal;
  };
  
  // Handle payment completion
  const handlePaymentComplete = async (txId: string) => {
    try {
      // Ödeme bilgilerini kaydet
      if (reservationId) {
        const { error } = await supabase
          .from('reservation_payments')
          .insert({
            reservation_id: reservationId,
            amount: calculateTotal(),
            is_prepayment: true,
            payment_status: 'completed',
            transaction_id: txId
          } as any);
        
        if (error) throw error;
        
        // Rezervasyon durumunu güncelle
        await supabase
          .from('reservations')
          .update({
            status: 'confirmed',
            has_prepayment: true,
            total_amount: calculateTotal()
          })
          .eq('id', reservationId);
          
        // Seçilen masayı kaydet
        if (state.selectedTable) {
          await supabase
            .from('reservation_tables')
            .insert({
              reservation_id: reservationId,
              table_id: state.selectedTable.id
            } as any);
        }
        
        // Seçilen menüyü kaydet
        if (state.selectedFixMenu) {
          await supabase
            .from('reservation_fixed_menus')
            .insert({
              reservation_id: reservationId,
              fixed_menu_id: state.selectedFixMenu.id,
              quantity: parseInt(state.formData.guests)
            } as any);
        } else if (state.selectedALaCarteItems.length > 0) {
          const menuItemInserts = state.selectedALaCarteItems.map(({ item, quantity }) => ({
            reservation_id: reservationId,
            menu_item_id: item.id,
            quantity
          }));
          
          await supabase
            .from('reservation_menu_items')
            .insert(menuItemInserts as any[]);
        }
      }

      setState({
        ...state,
        transactionId: txId
      });
      
      // Move to confirmation step
      setCurrentStep(4);
      
    } catch (error: any) {
      console.error("Payment completion error:", error.message);
      toast({
        title: "Hata",
        description: "Ödeme bilgileri kaydedilirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };
  
  // Check if current step is valid to move to next
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
        // Allow proceeding if either a fixed menu is selected OR at least one a la carte item is selected OR select at restaurant is true
        return state.selectedFixMenu !== null || 
               state.selectedALaCarteItems.length > 0 || 
               state.selectAtRestaurant;
      case 3: // Payment & summary
        return !state.isPrePayment || state.transactionId !== null; // If not pre-paying, can proceed without transaction
      default:
        return true;
    }
  };
  
  // Go to next step
  const handleNextStep = async () => {
    if (currentStep < 4 && canProceed()) {
      // Eğer 3. adımda ön ödeme yapmadan devam ediyorsak
      if (currentStep === 3 && !state.isPrePayment) {
        try {
          // Seçilen masayı kaydet
          if (reservationId && state.selectedTable) {
            await supabase
              .from('reservation_tables')
              .insert({
                reservation_id: reservationId,
                table_id: state.selectedTable.id
              } as any);
          }
          
          // Seçilen menüyü kaydet
          if (reservationId) {
            if (state.selectedFixMenu) {
              await supabase
                .from('reservation_fixed_menus')
                .insert({
                  reservation_id: reservationId,
                  fixed_menu_id: state.selectedFixMenu.id,
                  quantity: parseInt(state.formData.guests)
                } as any);
            } else if (state.selectedALaCarteItems.length > 0) {
              const menuItemInserts = state.selectedALaCarteItems.map(({ item, quantity }) => ({
                reservation_id: reservationId,
                menu_item_id: item.id,
                quantity
              }));
              
              await supabase
                .from('reservation_menu_items')
                .insert(menuItemInserts as any[]);
            }
            
            // Rezervasyon durumunu güncelle
            await supabase
              .from('reservations')
              .update({
                status: 'confirmed',
                total_amount: calculateTotal()
              })
              .eq('id', reservationId);
          }
        } catch (error: any) {
          console.error("Reservation update error:", error.message);
          toast({
            title: "Hata",
            description: "Rezervasyon bilgileri güncellenirken bir hata oluştu.",
            variant: "destructive",
          });
        }
      }
      
      setCurrentStep(currentStep + 1);
      
      // Scroll to top when changing steps
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Go to previous step
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      
      // Scroll to top when changing steps
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Skip payment if not pre-paying
  const handleSkipPayment = () => {
    setState({
      ...state,
      isPrePayment: false
    });
    handleNextStep();
  };

  // Handlers for state updates
  const setSelectedTable = (table: Table | null) => {
    setState({
      ...state,
      selectedTable: table
    });
  };

  const setSelectedFixMenu = (menu: FixMenuOption | null) => {
    setState({
      ...state,
      selectedFixMenu: menu,
      selectedALaCarteItems: [],
      selectAtRestaurant: false
    });
  };

  const setSelectedALaCarteItems = (items: { item: MenuItem, quantity: number }[]) => {
    setState({
      ...state,
      selectedALaCarteItems: items,
      selectedFixMenu: null,
      selectAtRestaurant: false
    });
  };

  const setSelectAtRestaurant = (select: boolean) => {
    setState({
      ...state,
      selectAtRestaurant: select,
      selectedFixMenu: null,
      selectedALaCarteItems: []
    });
  };

  const setIsPrePayment = (isPre: boolean) => {
    setState({
      ...state,
      isPrePayment: isPre
    });
  };

  return {
    currentStep,
    containerRef,
    state,
    reservationId,
    calculateTotal,
    handlePaymentComplete,
    canProceed,
    handleNextStep,
    handlePrevStep,
    handleSkipPayment,
    setSelectedTable,
    setSelectedFixMenu,
    setSelectedALaCarteItems,
    setSelectAtRestaurant,
    setIsPrePayment
  };
};
