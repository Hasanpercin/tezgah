
import React from 'react';
import { Calendar, Users, Utensils, CreditCard, CheckCircle } from 'lucide-react';
import { StepIndicatorProps } from '../types/reservationTypes';

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, steps, skipStep }) => {
  // Map of icon names to Lucide components
  const iconComponents = {
    Calendar: Calendar,
    Users: Users,
    Utensils: Utensils,
    CreditCard: CreditCard,
    CheckCircle: CheckCircle,
  };
  
  return (
    <div className="py-6">
      <div className="flex justify-between items-center">
        <div className="flex-1 relative">
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-gray-200">
            <div 
              className="absolute top-0 left-0 h-full bg-primary transition-all"
              style={{ 
                width: `${Math.min(100, (currentStep / (steps.length - 1)) * 100)}%` 
              }}
            ></div>
          </div>
          
          <div className="flex justify-between relative z-10">
            {steps.map((step, index) => {
              // Don't render the payment step if it should be skipped
              if (skipStep !== undefined && index === skipStep) {
                return null;
              }
              
              // Get the icon component for this step
              const IconComponent = iconComponents[step.icon as keyof typeof iconComponents] || CheckCircle;
              
              // Determine if this step is active, completed, or upcoming
              const isActive = index === currentStep;
              const isCompleted = index < currentStep || (skipStep !== undefined && index > skipStep && index <= currentStep);
              const isUpcoming = !isActive && !isCompleted;
              
              return (
                <div 
                  key={step.id}
                  className={`flex flex-col items-center`}
                >
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isActive ? 'bg-primary text-white' : 
                      isCompleted ? 'bg-green-100 text-green-600 border border-green-600' : 
                      'bg-gray-100 text-gray-400'
                    } transition-colors`}
                  >
                    <IconComponent className="h-5 w-5" />
                  </div>
                  
                  <p 
                    className={`text-xs md:text-sm mt-1 text-center ${
                      isActive ? 'text-primary font-medium' : 
                      isCompleted ? 'text-green-600' : 
                      'text-gray-500'
                    }`}
                  >
                    {step.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
