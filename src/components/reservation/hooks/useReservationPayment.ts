
import { useCallback } from 'react';
import { PaymentInfo } from '../types/reservationTypes';

export const useReservationPayment = (setState: Function, setCurrentStep: Function) => {
  // Set payment complete
  const setPaymentComplete = useCallback((paymentInfo: PaymentInfo) => {
    setState((prevState: any) => ({
      ...prevState,
      payment: paymentInfo,
    }));

    // Move to the next step when payment is complete
    setCurrentStep(4);
  }, [setState, setCurrentStep]);

  // For skipping payment step when menu selection is at_restaurant
  const skipPaymentStep = useCallback(() => {
    setCurrentStep(4);
  }, [setCurrentStep]);

  return {
    setPaymentComplete,
    skipPaymentStep
  };
};
