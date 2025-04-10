
import React from 'react';
import { CheckCircle, Circle, Calendar, Users, Utensils, CreditCard, CheckSquare } from 'lucide-react';
import { StepIndicatorProps } from '../types/reservationTypes';

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, steps, skipStep }) => {
  const getIcon = (iconName: string, isActive: boolean, isCompleted: boolean) => {
    const commonProps = { 
      className: `h-5 w-5 ${isActive ? 'text-primary' : isCompleted ? 'text-muted-foreground' : 'text-muted'}`,
    };
    
    if (isCompleted) {
      return <CheckCircle {...commonProps} />;
    }
    
    switch (iconName) {
      case 'Calendar': return <Calendar {...commonProps} />;
      case 'Users': return <Users {...commonProps} />;
      case 'Utensils': return <Utensils {...commonProps} />;
      case 'CreditCard': return <CreditCard {...commonProps} />;
      case 'CheckCircle': return <CheckSquare {...commonProps} />;
      default: return <Circle {...commonProps} />;
    }
  };
  
  return (
    <div className="mb-8">
      <div className="flex justify-between">
        {steps.map((step, index) => {
          // Skip displaying a step if skipStep is set to this index
          if (skipStep === index) {
            return null;
          }
          
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          
          // Adjust step count based on skipped steps
          let displayNumber = index + 1;
          if (skipStep !== undefined && index > skipStep) {
            displayNumber--;
          }
          
          return (
            <div 
              key={step.id}
              className={`flex flex-col items-center ${
                index < steps.length - 1 ? 'flex-1' : ''
              }`}
            >
              <div className="relative flex items-center justify-center">
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    ${isActive ? 'bg-primary text-primary-foreground' : 
                       isCompleted ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}
                  `}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    displayNumber
                  )}
                </div>
                
                {index < steps.length - 1 && skipStep !== index + 1 && (
                  <div 
                    className={`absolute top-4 w-full h-0.5 left-1/2 
                      ${index < currentStep ? 'bg-primary' : 'bg-muted'}`
                    }
                  />
                )}
              </div>
              
              <div className="mt-2 text-center">
                <div className="flex items-center justify-center">
                  {getIcon(step.icon, isActive, isCompleted)}
                  <span 
                    className={`ml-1 text-sm font-medium
                      ${isActive ? 'text-primary' : isCompleted ? 'text-muted-foreground' : 'text-muted'}
                    `}
                  >
                    {step.name}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
