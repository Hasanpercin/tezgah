
import { useState, useRef, useCallback } from 'react';
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
import { useReservationForm } from './useReservationForm';
import { useReservationSubmission } from './useReservationSubmission';
import { useReservationNavigation } from './useReservationNavigation';
import { useReservationPayment } from './useReservationPayment';

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
      type: 'at_restaurant',
      selectedFixedMenu: null,
      selectedFixedMenus: [],
      selectedMenuItems: []
    } as MenuSelectionData,
    payment: undefined as PaymentInfo | undefined,
  });

  // Navigation logic
  const {
    scrollToNextStep,
    handleNextStep,
    handlePrevStep
  } = useReservationNavigation(containerRef, currentStep, setCurrentStep);

  // Form handling logic
  const { setFormData, setBasicFormCompleted } = useReservationForm(setState);

  // Payment handling
  const {
    setPaymentComplete,
    skipPaymentStep
  } = useReservationPayment(setState, setCurrentStep);

  // Table selection
  const setSelectedTable = useCallback((table: Table | null) => {
    setState((prevState) => ({
      ...prevState,
      selectedTable: table,
    }));
  }, []);

  // Menu selection
  const setMenuSelection = useCallback((menuSelection: MenuSelectionData) => {
    setState((prevState) => ({
      ...prevState,
      menuSelection,
    }));
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

  // Submission logic
  const submitReservation = useReservationSubmission(user, state, toast, setCurrentStep);

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
