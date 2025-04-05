
import React from 'react';
import { Check, Calendar, Users, Utensils, CreditCard, CheckCircle } from 'lucide-react';
import { STEPS } from '../types/reservationTypes';

interface StepIndicatorProps {
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  // Get the correct icon component based on name
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calendar': return <Calendar className="h-5 w-5" />;
      case 'Users': return <Users className="h-5 w-5" />;
      case 'Utensils': return <Utensils className="h-5 w-5" />;
      case 'CreditCard': return <CreditCard className="h-5 w-5" />;
      case 'CheckCircle': return <CheckCircle className="h-5 w-5" />;
      default: return null;
    }
  };

  return (
    <div className="mb-10">
      <div className="hidden md:flex justify-between">
        {STEPS.map((step, idx) => (
          <div 
            key={step.id}
            className={`flex flex-col items-center ${
              idx <= currentStep ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            <div className={`
              flex items-center justify-center w-10 h-10 rounded-full 
              ${idx < currentStep ? "bg-primary text-primary-foreground" : 
                idx === currentStep ? "bg-primary/20 border border-primary" : 
                "bg-muted border border-border"}
            `}>
              {idx < currentStep ? (
                <Check className="h-5 w-5" />
              ) : (
                getIcon(step.icon)
              )}
            </div>
            <span className="mt-2 text-sm font-medium">{step.name}</span>
          </div>
        ))}
      </div>
      
      {/* Mobile Step Indicator */}
      <div className="block md:hidden mb-6">
        <h2 className="text-xl font-semibold">
          {STEPS[currentStep].name}
        </h2>
        <div className="text-sm text-muted-foreground mt-1">
          Adım {currentStep + 1} / {STEPS.length}
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
