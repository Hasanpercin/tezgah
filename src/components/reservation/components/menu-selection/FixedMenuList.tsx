
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { FixedMenu } from '../../types/reservationTypes';
import { Check, Info } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from '@/hooks/use-mobile';

interface FixedMenuListProps {
  menus: FixedMenu[];
  selectedMenuId: string | null;
  quantity: number;
  guestCount: number | string;
  onSelectMenu: (menu: FixedMenu | null) => void;
  onChangeQuantity: (quantity: number) => void;
}

const FixedMenuList: React.FC<FixedMenuListProps> = ({
  menus,
  selectedMenuId,
  quantity,
  guestCount,
  onSelectMenu,
  onChangeQuantity,
}) => {
  const isMobile = useIsMobile();
  const numericGuestCount = typeof guestCount === 'string' ? parseInt(guestCount) || 1 : guestCount || 1;
  
  // Generate quantity options based on guest count
  const quantityOptions = Array.from({ length: Math.max(10, numericGuestCount * 2) }, (_, i) => i + 1);
  
  const handleMenuClick = (menu: FixedMenu) => {
    if (selectedMenuId === menu.id) {
      onSelectMenu(null); // Deselect if already selected
    } else {
      onSelectMenu(menu); // Select this menu
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Hazır Menüler</h3>
        
        {selectedMenuId && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Adet:</span>
            <Select 
              value={quantity.toString()} 
              onValueChange={(value) => onChangeQuantity(parseInt(value))}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder={quantity.toString()} />
              </SelectTrigger>
              <SelectContent>
                {quantityOptions.map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Use ScrollArea for better mobile experience */}
      <ScrollArea className={isMobile ? "h-[450px]" : "h-[550px]"}>
        <div className="grid grid-cols-1 gap-4 pr-4">
          {menus.map((menu) => (
            <Card 
              key={menu.id}
              className={`cursor-pointer transition-all ${
                selectedMenuId === menu.id 
                  ? 'border-primary bg-primary/5' 
                  : 'hover:border-muted-foreground/30'
              }`}
              onClick={() => handleMenuClick(menu)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle className="flex items-center">
                    {menu.name}
                    {selectedMenuId === menu.id && (
                      <Check className="ml-2 h-4 w-4 text-primary" />
                    )}
                  </CardTitle>
                  <span className="text-lg font-bold">{menu.price.toLocaleString('tr-TR')} ₺</span>
                </div>
                <CardDescription>{menu.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="pb-2">
                {menu.details && (
                  <div className="text-sm space-y-2">
                    {menu.details.split('\n').map((detail, idx) => (
                      <p key={idx}>{detail}</p>
                    ))}
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-between pt-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Info className="h-3.5 w-3.5 mr-1" />
                  <span>{numericGuestCount} kişi için önerilir</span>
                </div>
                
                <Button 
                  type="button" 
                  variant={selectedMenuId === menu.id ? "default" : "outline"}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuClick(menu);
                  }}
                >
                  {selectedMenuId === menu.id ? 'Seçildi' : 'Seç'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </ScrollArea>
      
      {selectedMenuId && (
        <div className="mt-4 pt-3 border-t">
          <div className="flex justify-between font-medium">
            <span>Toplam</span>
            <span>
              {(menus.find(m => m.id === selectedMenuId)?.price || 0) * quantity} ₺
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FixedMenuList;
