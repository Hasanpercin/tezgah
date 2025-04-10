
import React from 'react';
import { CheckIcon, ChevronRightIcon } from 'lucide-react';
import { StepIndicatorProps } from '../types/reservationTypes';
import { Calendar, Users, Utensils, CreditCard, CheckCircle } from 'lucide-react';

// Map of icon names to Lucide components
const iconMap: Record<string, React.ElementType> = {
  Calendar,
  Users,
  Utensils,
  CreditCard,
  CheckCircle
};

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, steps }) => {
  return (
    <div className="py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = iconMap[step.icon] || Calendar;
          
          // Determine step status
          const isCompleted = currentStep > index;
          const isCurrent = currentStep === index;
          const isPending = currentStep < index;
          
          return (
            <React.Fragment key={step.id}>
              {/* Step indicator */}
              <div className="flex flex-col items-center">
                <div 
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                    isCompleted ? 'bg-primary text-primary-foreground' : 
                    isCurrent ? 'bg-primary text-primary-foreground ring-4 ring-primary/30' : 
                    'bg-muted text-muted-foreground'
                  }`}
                >
                  {isCompleted ? (
                    <CheckIcon className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <span className={`mt-2 text-xs font-medium ${
                  isCurrent ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {step.name}
                </span>
              </div>
              
              {/* Connector line (except for the last item) */}
              {index < steps.length - 1 && (
                <div className={`flex-1 mx-2 h-0.5 ${
                  isCompleted ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
