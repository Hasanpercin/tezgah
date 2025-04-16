import { useState, useRef, useCallback, useEffect } from 'react';
import { FormData } from '../types';
import { MenuSelectionType } from '../types';
import { 
  Table, 
  ReservationFormData, 
  MenuSelectionData,
  PaymentInfo 
} from '../types/reservationTypes';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

export const useReservationState = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);

  // State for the current step in the reservation process
  const [currentStep, setCurrentStep] = useState(0);

  // State for the form data, selected table, etc.
  const [state, setState] = useState({
    formData: {
      name: '',
      email: '',
      phone: '',
      date: null,
      time: '',
      guests: '',
      notes: '',
      occasion: '',
    } as ReservationFormData,
    selectedTable: null as Table | null,
    basicFormCompleted: false,
    menuSelection: {
      type: 'at_restaurant' as MenuSelectionType,
      selectedFixedMenu: null,
      selectedFixedMenus: [],
      selectedMenuItems: []
    } as MenuSelectionData,
    payment: undefined as PaymentInfo | undefined,
  });

  // Function to handle scrolling to the next step
  const scrollToNextStep = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, []);

  // Function to handle moving to the next step
  const handleNextStep = useCallback(() => {
    setCurrentStep((prevStep) => prevStep + 1);
    scrollToNextStep();
  }, [scrollToNextStep]);

  // Function to handle moving to the previous step
  const handlePrevStep = useCallback(() => {
    setCurrentStep((prevStep) => prevStep - 1);
    scrollToNextStep();
  }, [scrollToNextStep]);

  const setFormData = useCallback((data: Partial<FormData>) => {
    setState((prevState) => ({
      ...prevState,
      formData: {
        ...prevState.formData,
        ...data
      }
    }));
  }, []);

  const setBasicFormCompleted = useCallback((completed: boolean) => {
    setState((prevState) => ({
      ...prevState,
      basicFormCompleted: completed
    }));
  }, []);

  // Set the selected table
  const setSelectedTable = useCallback((table: Table | null) => {
    setState((prevState) => ({
      ...prevState,
      selectedTable: table,
    }));
  }, []);

  // Set the menu selection
  const setMenuSelection = useCallback((menuSelection: MenuSelectionData) => {
    setState((prevState) => ({
      ...prevState,
      menuSelection,
    }));
  }, []);

  // Set payment complete
  const setPaymentComplete = useCallback((paymentInfo: PaymentInfo) => {
    setState((prevState) => ({
      ...prevState,
      payment: paymentInfo,
    }));

    // Move to the next step when payment is complete
    setCurrentStep(4);
  }, []);

  // For skipping payment step when menu selection is at_restaurant
  const skipPaymentStep = useCallback(() => {
    setCurrentStep(4);
  }, []);

  // Check if the current step can proceed to the next
  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 0:
        return state.basicFormCompleted;
      case 1:
        return !!state.selectedTable;
      case 2:
        return true; // Always allow proceeding from menu selection
      case 3:
        return state.payment?.isPaid;
      default:
        return true;
    }
  }, [currentStep, state.basicFormCompleted, state.selectedTable, state.payment?.isPaid]);

  // Function to handle submitting the reservation
  const submitReservation = useCallback(async () => {
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Generate a unique ID for the reservation
      const reservationId = uuidv4();

      // Prepare reservation data
      const reservationData = {
        id: reservationId,
        user_id: user.id,
        name: state.formData.name,
        email: state.formData.email,
        phone: state.formData.phone,
        date: state.formData.date?.toISOString(),
        time: state.formData.time,
        guests: parseInt(state.formData.guests),
        notes: state.formData.notes,
        occasion: state.formData.occasion,
        status: "Beklemede",
        selected_table: state.selectedTable ? { id: state.selectedTable.id } : null,
        selected_items: {
          menuSelectionType: state.menuSelection.type,
          fixedMenuId: state.menuSelection.selectedFixedMenus && state.menuSelection.selectedFixedMenus.length > 0 ? state.menuSelection.selectedFixedMenus[0].menu.id : null,
          items: state.menuSelection.selectedMenuItems ? state.menuSelection.selectedMenuItems.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity || 1
          })) : null
        },
        has_prepayment: state.payment?.isPaid || false,
        total_amount: state.payment?.amount || 0,
      };

      // Insert reservation data into Supabase
      const { error } = await supabase
        .from("reservations")
        .insert([reservationData]);

      if (error) {
        throw error;
      }

      // If a fixed menu is selected, save it to the reservation_fixed_menus table
      if (state.menuSelection.type === 'fixed_menu' && state.menuSelection.selectedFixedMenus && state.menuSelection.selectedFixedMenus.length > 0) {
        await Promise.all(state.menuSelection.selectedFixedMenus.map(async (fixedMenu) => {
          await supabase
            .from('reservation_fixed_menus')
            .insert({
              reservation_id: reservationId,
              fixed_menu_id: fixedMenu.menu.id,
              quantity: fixedMenu.quantity
            });
        }));
      }

      // Show success message
      toast({
        title: "Rezervasyon Başarılı!",
        description: "Rezervasyonunuz başarıyla oluşturuldu. Onay için lütfen bekleyiniz.",
      });

      // Reset the state
      setState({
        formData: {
          name: '',
          email: '',
          phone: '',
          date: null,
          time: '',
          guests: '',
          notes: '',
          occasion: '',
        } as ReservationFormData,
        selectedTable: null as Table | null,
        basicFormCompleted: false,
        menuSelection: {
          type: 'at_restaurant' as MenuSelectionType,
          selectedFixedMenu: null,
          selectedFixedMenus: [],
          selectedMenuItems: []
        } as MenuSelectionData,
        payment: undefined as PaymentInfo | undefined,
      });
      setCurrentStep(0);
    } catch (error: any) {
      // Show error message
      toast({
        title: "Rezervasyon Hatası",
        description: error.message || "Rezervasyon oluşturulurken bir hata oluştu.",
        variant: "destructive",
      });
    }
  }, [state, user, toast]);

  return {
    currentStep,
    containerRef,
    state,
    setFormData,
    setBasicFormCompleted,
    canProceed,
    handleNextStep,
    handlePrevStep,
    setSelectedTable,
    setMenuSelection,
    setPaymentComplete,
    skipPaymentStep,
    submitReservation
  };
};
