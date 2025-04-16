
import React from 'react';
import { Check } from 'lucide-react';

interface SelectionCardProps {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  isSelected: boolean;
  onChange: (checked: boolean) => void;
  discount?: string;
}

const SelectionCard = ({
  id,
  icon,
  title,
  description,
  isSelected,
  onChange,
  discount
}: SelectionCardProps) => {
  const handleClick = () => {
    if (typeof onChange === 'function') {
      onChange(!isSelected);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`
        relative cursor-pointer flex flex-col rounded-xl border p-4 transition-all
        ${isSelected 
          ? 'border-amber-600 bg-amber-50/70 shadow-md' 
          : 'border-gray-200 bg-white hover:border-amber-300 hover:bg-amber-50/30'
        }
      `}
    >
      {discount && (
        <div className="absolute -top-3 -right-2">
          <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-medium shadow-sm">
            {discount}
          </span>
        </div>
      )}
      
      <div className="flex items-start gap-3 mb-2">
        <div className={`
          p-2 rounded-lg
          ${isSelected ? 'bg-amber-100' : 'bg-gray-100'} 
        `}>
          {icon}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">{title}</h3>
            <div className={`
              w-5 h-5 rounded-full border flex items-center justify-center
              ${isSelected 
                ? 'bg-amber-600 border-amber-600' 
                : 'border-gray-300'
              }
            `}>
              {isSelected && <Check size={14} className="text-white" />}
            </div>
          </div>
          <p className="text-muted-foreground text-sm mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default SelectionCard;
