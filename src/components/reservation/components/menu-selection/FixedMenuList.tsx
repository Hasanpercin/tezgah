
import { useState } from 'react';
import { FixedMenuItem } from '@/components/reservation/types/reservationTypes';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChefHat, Plus, Minus, Trash2 } from 'lucide-react';

interface FixedMenuListProps {
  fixedMenus: FixedMenuItem[] | null;
  selectedFixedMenus: { menu: FixedMenuItem; quantity: number }[];
  onSelectMenu: (menu: FixedMenuItem) => void;
  onRemoveMenu: (menuId: string) => void;
  onQuantityChange: (menuId: string, change: number) => void;
  isLoading: boolean;
  isError: boolean;
}

const FixedMenuList = ({
  fixedMenus,
  selectedFixedMenus,
  onSelectMenu,
  onRemoveMenu,
  onQuantityChange,
  isLoading,
  isError
}: FixedMenuListProps) => {
  const calculateTotal = () => {
    return selectedFixedMenus.reduce((total, item) => {
      const price = parseFloat(String(item.menu.price)) || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  if (isLoading) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-muted-foreground">Menüler yükleniyor...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center p-8 text-destructive">
        <p>Menüler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.</p>
      </div>
    );
  }

  return (
    <>
      {selectedFixedMenus.length > 0 && (
        <div className="mb-6 bg-muted/30 rounded-lg p-4">
          <h5 className="font-medium text-lg mb-3">Seçilen Fix Menüler</h5>
          <div className="space-y-3">
            {selectedFixedMenus.map((item, index) => (
              <div key={`${item.menu.id}-${index}`} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                <div className="flex-1">
                  <p className="font-medium">{item.menu.name}</p>
                  <p className="text-sm text-muted-foreground">{item.menu.price} ₺ × {item.quantity}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={() => onQuantityChange(item.menu.id, -1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={() => onQuantityChange(item.menu.id, 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 text-destructive hover:text-destructive" 
                    onClick={() => onRemoveMenu(item.menu.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <div className="flex justify-end pt-3 font-semibold">
              <span>Toplam: {calculateTotal().toFixed(2)} ₺</span>
            </div>
          </div>
        </div>
      )}
      
      <ScrollArea className="max-h-[450px] pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fixedMenus && fixedMenus.length > 0 ? (
            fixedMenus.map((menu) => (
              <Card 
                key={menu.id}
                className={`overflow-hidden transition-all duration-200 cursor-pointer hover:shadow-md ${
                  selectedFixedMenus.some(item => item.menu.id === menu.id)
                    ? 'ring-2 ring-primary ring-offset-2' 
                    : 'hover:border-primary/50'
                }`}
                onClick={() => onSelectMenu(menu)}
              >
                <div className="relative">
                  {menu.image_path && (
                    <div 
                      className="h-40 w-full bg-cover bg-center" 
                      style={{ backgroundImage: `url(${menu.image_path})` }}
                    />
                  )}
                  {!menu.image_path && (
                    <div className="h-40 w-full bg-muted/50 flex items-center justify-center">
                      <ChefHat size={48} className="text-muted-foreground/40" />
                    </div>
                  )}
                  {selectedFixedMenus.some(item => item.menu.id === menu.id) && (
                    <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-full text-xs font-medium">
                      {selectedFixedMenus.find(item => item.menu.id === menu.id)?.quantity || 0} adet
                    </div>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <h5 className="text-lg font-medium mb-1">{menu.name}</h5>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{menu.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-primary">{menu.price} ₺</span>
                    <Button 
                      variant={selectedFixedMenus.some(item => item.menu.id === menu.id) ? "default" : "outline"}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectMenu(menu);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      {selectedFixedMenus.some(item => item.menu.id === menu.id) ? 'Ekle' : 'Seç'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-2 text-center p-8">
              <p className="text-muted-foreground">Hiç fix menü bulunamadı.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </>
  );
};

export default FixedMenuList;
