
import React from 'react';
import { Label } from "@/components/ui/label";
import { Check } from 'lucide-react';

interface SelectionCardProps {
  id: string;
  icon: React.ReactNode;
  title: string;
  discount?: string;
  description: string;
  isSelected: boolean;
  onChange: (checked: boolean) => void;
}

const SelectionCard = ({
  id,
  icon,
  title,
  discount,
  description,
  isSelected,
  onChange
}: SelectionCardProps) => {
  return (
    <div className="relative">
      <input 
        type="checkbox" 
        id={id} 
        className="peer sr-only" 
        checked={isSelected}
        onChange={(e) => onChange(e.target.checked)}
      />
      <Label 
        htmlFor={id} 
        className={`
          h-full flex flex-col
          rounded-xl border-2 p-5
          ${isSelected 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover:border-primary/50 hover:bg-muted/50'}
          cursor-pointer transition-all duration-200
        `}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            {icon}
          </div>
          {isSelected && (
            <span className="absolute top-3 right-3 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
              <Check className="h-3 w-3 text-white" />
            </span>
          )}
        </div>
        
        <div>
          <h4 className="text-lg font-medium">{title}</h4>
          {discount && (
            <p className="text-sm text-green-600 font-medium my-1">{discount}</p>
          )}
          <p className="text-sm text-muted-foreground mt-2">
            {description}
          </p>
        </div>
      </Label>
    </div>
  );
};

export default SelectionCard;
