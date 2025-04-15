
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { STEPS } from './types/reservationTypes';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavigationButtonsProps {
  currentStep: number;
  onNext: () => void;
  onPrev: () => void;
  canProceed: boolean;
  menuSelectionType?: 'fixed_menu' | 'a_la_carte' | 'at_restaurant';
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentStep,
  onNext,
  onPrev,
  canProceed,
  menuSelectionType
}) => {
  const isMobile = useIsMobile();
  const isLastStep = currentStep === STEPS.length - 2; // Payment is the last interactive step
  const isSkippingPayment = menuSelectionType === 'at_restaurant' && currentStep === 2;
  
  const getNextButtonText = () => {
    if (isLastStep) return "Tamamla";
    if (currentStep === 0) return isMobile ? "Masa" : "Masa Seç";
    if (currentStep === 1) return isMobile ? "Menü" : "Menü Seç";
    if (currentStep === 2) {
      return isSkippingPayment ? "Tamamla" : (isMobile ? "Ödeme" : "Ödemeye Geç");
    }
    return "İleri";
  };
  
  return (
    <div className="flex justify-between mt-6 md:mt-8">
      {currentStep > 0 ? (
        <Button 
          type="button"
          variant="outline" 
          onClick={onPrev}
          className="flex items-center"
          size={isMobile ? "sm" : "default"}
        >
          <ChevronLeft className="mr-1 md:mr-2 h-4 w-4" />
          Geri
        </Button>
      ) : (
        <div /> // Empty div to maintain layout with flex justify-between
      )}
      
      <Button 
        type="button" 
        onClick={onNext}
        disabled={!canProceed}
        size={isMobile ? "sm" : "default"}
      >
        {getNextButtonText()}
        <ChevronRight className="ml-1 md:ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default NavigationButtons;
