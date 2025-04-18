
import { RefObject, useState, useCallback } from 'react';

export const useReservationNavigation = (
  containerRef: RefObject<HTMLDivElement>,
  currentStep: number,
  setCurrentStep: (step: number) => void
) => {
  // Function to handle scrolling to the next step
  const scrollToNextStep = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [containerRef]);

  // Function to handle moving to the next step
  const handleNextStep = useCallback(() => {
    setCurrentStep(currentStep + 1);
    scrollToNextStep();
  }, [scrollToNextStep, setCurrentStep, currentStep]);

  // Function to handle moving to the previous step
  const handlePrevStep = useCallback(() => {
    setCurrentStep(currentStep - 1);
    scrollToNextStep();
  }, [scrollToNextStep, setCurrentStep, currentStep]);

  return {
    scrollToNextStep,
    handleNextStep,
    handlePrevStep
  };
};
