
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { MenuItemOption, MenuItemVariant } from "@/services/menuService";

type MenuItemProps = {
  name: string;
  description: string;
  price: string;
  image?: string;
  id?: string;
  isInStock?: boolean;
  options?: MenuItemOption[];
  variants?: MenuItemVariant[];
  onSelectionChange?: (selection: {
    optionIds: string[];
    variantId?: string;
  }) => void;
}

const MenuItem = ({ 
  name, 
  description, 
  price, 
  image, 
  id, 
  isInStock = true,
  options = [],
  variants = [],
  onSelectionChange
}: MenuItemProps) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<string>();

  const handleOptionChange = (optionId: string, checked: boolean) => {
    const newSelection = checked 
      ? [...selectedOptions, optionId]
      : selectedOptions.filter(id => id !== optionId);
    
    setSelectedOptions(newSelection);
    onSelectionChange?.({ optionIds: newSelection, variantId: selectedVariant });
  };

  const handleVariantChange = (variantId: string) => {
    setSelectedVariant(variantId);
    onSelectionChange?.({ optionIds: selectedOptions, variantId });
  };

  return (
    <Card className="overflow-hidden h-full">
      <CardContent className="p-0">
        <div className={`flex ${image ? 'flex-col md:flex-row' : ''} h-full relative`}>
          {!isInStock && (
            <div className="absolute top-0 right-0 m-2 z-10">
              <Badge variant="destructive" className="font-medium">Stokta Yok</Badge>
            </div>
          )}
          
          {image && (
            <div className={`${image ? 'md:w-1/3' : 'hidden'} overflow-hidden relative`}>
              <img 
                src={image} 
                alt={name} 
                className={`w-full h-full object-cover aspect-square md:aspect-auto ${!isInStock ? 'opacity-50' : ''}`}
              />
            </div>
          )}
          
          <div className={`flex-1 p-4 ${!image ? 'w-full' : ''}`}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-playfair font-semibold">{name}</h3>
              <span className="text-lg font-semibold text-primary ml-4 whitespace-nowrap">{price}</span>
            </div>
            {description && <p className="text-muted-foreground mb-4">{description}</p>}

            {/* Always display variants section if available */}
            {variants && variants.length > 0 && (
              <div className="mt-3 mb-2">
                <h4 className="text-sm font-medium mb-1 text-muted-foreground">Çeşitler:</h4>
                <ul className="text-sm space-y-1">
                  {variants.map((variant) => (
                    <li key={variant.id} className="flex justify-between">
                      <span>{variant.name}</span>
                      {variant.price_adjustment > 0 && (
                        <span className="text-primary font-medium">
                          +{variant.price_adjustment} ₺
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Always display options section if available */}
            {options && options.length > 0 && (
              <div className="mt-2">
                <h4 className="text-sm font-medium mb-1 text-muted-foreground">Opsiyonlar:</h4>
                <ul className="text-sm space-y-1">
                  {options.map((option) => (
                    <li key={option.id} className="flex justify-between">
                      <span>{option.name}</span>
                      {option.price_adjustment > 0 && (
                        <span className="text-primary font-medium">
                          +{option.price_adjustment} ₺
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Interactive Selection UI - Only show when onSelectionChange is provided */}
            {onSelectionChange && (
              <>
                {/* Variants Section with radio selection */}
                {variants && variants.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Seçenekler</h4>
                    <RadioGroup
                      onValueChange={handleVariantChange}
                      value={selectedVariant}
                      className="flex flex-col gap-2"
                    >
                      {variants.map((variant) => (
                        <div key={variant.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={variant.id} id={`variant-${variant.id}`} />
                          <Label htmlFor={`variant-${variant.id}`} className="flex justify-between w-full">
                            <span>{variant.name}</span>
                            {variant.price_adjustment > 0 && (
                              <span className="text-sm text-muted-foreground">
                                +{variant.price_adjustment} ₺
                              </span>
                            )}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}

                {/* Options Section with checkbox selection */}
                {options && options.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Ekstra Seçimler</h4>
                    <div className="space-y-2">
                      {options.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`option-${option.id}`}
                            checked={selectedOptions.includes(option.id)}
                            onCheckedChange={(checked) => 
                              handleOptionChange(option.id, checked as boolean)
                            }
                          />
                          <Label htmlFor={`option-${option.id}`} className="flex justify-between w-full">
                            <span>{option.name}</span>
                            {option.price_adjustment > 0 && (
                              <span className="text-sm text-muted-foreground">
                                +{option.price_adjustment} ₺
                              </span>
                            )}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuItem;
