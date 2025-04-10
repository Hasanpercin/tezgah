
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { STEPS } from './types/reservationTypes';

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
  const isLastStep = currentStep === STEPS.length - 2; // Payment is the last interactive step
  const isRestaurantSelection = menuSelectionType === 'at_restaurant' && currentStep === 2;
  
  const getNextButtonText = () => {
    if (isLastStep) return "Tamamla";
    if (currentStep === 0) return "Masa Seç";
    if (currentStep === 1) return "Menü Seç";
    if (currentStep === 2) {
      return isRestaurantSelection ? "Tamamla" : "Ödemeye Geç";
    }
    return "İleri";
  };
  
  return (
    <div className="flex justify-between mt-8">
      {currentStep > 0 ? (
        <Button 
          type="button"
          variant="outline" 
          onClick={onPrev}
          className="flex items-center"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Geri
        </Button>
      ) : (
        <div /> // Empty div to maintain layout with flex justify-between
      )}
      
      <Button 
        type="button" 
        onClick={onNext}
        disabled={!canProceed}
      >
        {getNextButtonText()}
        <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default NavigationButtons;
