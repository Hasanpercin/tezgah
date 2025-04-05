
import { useState, useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
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
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Initialize state
  const [state, setState] = useState<ReservationState>({
    selectedTable: null,
    selectedFixMenu: null,
    selectedALaCarteItems: [],
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
      setState(prevState => ({
        ...prevState,
        basicFormCompleted: true,
        formData: {
          ...prevState.formData,
          ...(event.detail?.formData || {})
        }
      }));
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
  }, []);
  
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
  const handlePaymentComplete = (txId: string) => {
    setState({
      ...state,
      transactionId: txId
    });
    // Move to confirmation step
    setCurrentStep(4);
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
        return state.selectedFixMenu !== null || state.selectedALaCarteItems.length > 0;
      case 3: // Payment & summary
        return !state.isPrePayment || state.transactionId !== null; // If not pre-paying, can proceed without transaction
      default:
        return true;
    }
  };
  
  // Go to next step
  const handleNextStep = () => {
    if (currentStep < 4 && canProceed()) {
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
    setCurrentStep(4); // Skip to confirmation
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
      selectedFixMenu: menu
    });
  };

  const setSelectedALaCarteItems = (items: { item: MenuItem, quantity: number }[]) => {
    setState({
      ...state,
      selectedALaCarteItems: items
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
    calculateTotal,
    handlePaymentComplete,
    canProceed,
    handleNextStep,
    handlePrevStep,
    handleSkipPayment,
    setSelectedTable,
    setSelectedFixMenu,
    setSelectedALaCarteItems,
    setIsPrePayment
  };
};
