
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { MenuSelectionType } from './types';

interface NavigationButtonsProps {
  currentStep: number;
  onNext: () => void;
  onPrev: () => void;
  canProceed: boolean;
  menuSelectionType?: MenuSelectionType;
}

const NavigationButtons = ({
  currentStep,
  onNext,
  onPrev,
  canProceed,
  menuSelectionType,
}: NavigationButtonsProps) => {
  return (
    <div className="flex justify-between mt-8">
      <Button
        variant="outline"
        onClick={onPrev}
        disabled={currentStep === 0}
        className="flex items-center gap-2"
      >
        <ArrowLeft size={16} />
        Geri
      </Button>

      <Button
        variant="default"
        onClick={onNext}
        disabled={!canProceed}
        className="flex items-center gap-2"
      >
        {currentStep === 2 && menuSelectionType === 'at_restaurant' ? 'Onayla' : 'Devam Et'}
        <ArrowRight size={16} />
      </Button>
    </div>
  );
};

export default NavigationButtons;
