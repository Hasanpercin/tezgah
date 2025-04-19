
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { MenuItemOption, MenuItemVariant } from '@/services/menuService';

type MenuItemProps = {
  name: string;
  description: string;
  price: string;
  image?: string;
  id?: string;
  isInStock?: boolean;
  options?: MenuItemOption[];
  variants?: MenuItemVariant[];
}

const MenuItem = ({ 
  name, 
  description, 
  price, 
  image,
  isInStock = true,
  options = [],
  variants = []
}: MenuItemProps) => {
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-200 hover:shadow-lg",
      !isInStock && "opacity-60"
    )}>
      <CardContent className="p-0">
        <div className="flex flex-col h-full">
          {image && (
            <div className="relative h-48 overflow-hidden">
              <img 
                src={image} 
                alt={name} 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              {!isInStock && (
                <div className="absolute top-2 right-2">
                  <Badge variant="destructive">Tükendi</Badge>
                </div>
              )}
            </div>
          )}
          
          <div className="p-5 space-y-4 flex-1 bg-card">
            <div>
              <div className="flex justify-between items-start gap-2">
                <h3 className="font-playfair text-lg font-medium leading-tight">{name}</h3>
                <span className="font-medium text-primary whitespace-nowrap">
                  {price}
                </span>
              </div>
              
              {description && (
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            {(options?.length > 0 || variants?.length > 0) && (
              <>
                <Separator className="my-3" />
                <div className="space-y-3">
                  {variants?.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground">Çeşitler</h4>
                      <div className="grid gap-1.5">
                        {variants.map((variant) => (
                          <div key={variant.id} className="flex justify-between text-sm">
                            <span>{variant.name}</span>
                            {variant.price_adjustment > 0 && (
                              <span className="text-primary font-medium">
                                +{variant.price_adjustment} ₺
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {options?.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground">Seçenekler</h4>
                      <div className="grid gap-1.5">
                        {options.map((option) => (
                          <div key={option.id} className="flex justify-between text-sm">
                            <span>{option.name}</span>
                            {option.price_adjustment > 0 && (
                              <span className="text-primary font-medium">
                                +{option.price_adjustment} ₺
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuItem;
