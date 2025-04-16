
import { useState } from 'react';
import { FixedMenuItem } from '@/components/reservation/types/reservationTypes';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChefHat, Plus, Minus, Trash2, Star, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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

  // Toplam fiyattan %10 indirim uygula
  const calculateDiscountedTotal = () => {
    const total = calculateTotal();
    return total * 0.9;
  };

  if (isLoading) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full mx-auto mb-4"></div>
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
        <div className="mb-6 bg-amber-50/70 rounded-lg border border-amber-100/80 p-5 shadow-sm">
          <h5 className="font-medium text-lg mb-4 flex items-center">
            <Star className="h-5 w-5 text-amber-500 mr-2" />
            Seçilen Fix Menüler
          </h5>
          <div className="space-y-4">
            {selectedFixedMenus.map((item, index) => (
              <div key={`${item.menu.id}-${index}`} className="flex items-center justify-between border-b border-amber-100 pb-4 last:border-0">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{item.menu.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    <span className="font-semibold text-amber-600">{item.menu.price} ₺</span> × {item.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 border-amber-200 hover:bg-amber-50" 
                    onClick={() => onQuantityChange(item.menu.id, -1)}
                  >
                    <Minus className="h-4 w-4 text-amber-700" />
                  </Button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 border-amber-200 hover:bg-amber-50" 
                    onClick={() => onQuantityChange(item.menu.id, 1)}
                  >
                    <Plus className="h-4 w-4 text-amber-700" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 border-red-200 hover:bg-red-50 text-red-500 hover:text-red-600" 
                    onClick={() => onRemoveMenu(item.menu.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <div className="flex flex-col gap-1 pt-4">
              <div className="flex justify-between text-muted-foreground">
                <span>Toplam:</span>
                <span>{calculateTotal().toFixed(2)} ₺</span>
              </div>
              <div className="flex justify-between text-green-700 font-medium">
                <span>%10 İndirim:</span>
                <span>-{(calculateTotal() * 0.1).toFixed(2)} ₺</span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-amber-800 pt-2 border-t border-amber-100">
                <span>Ödenecek Tutar:</span>
                <span>{calculateDiscountedTotal().toFixed(2)} ₺</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <ScrollArea className="max-h-[550px] pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fixedMenus && fixedMenus.length > 0 ? (
            fixedMenus.map((menu) => (
              <Card 
                key={menu.id}
                className={`overflow-hidden transition-all duration-200 cursor-pointer hover:shadow-lg ${
                  selectedFixedMenus.some(item => item.menu.id === menu.id)
                    ? 'ring-2 ring-amber-500 ring-offset-2' 
                    : 'hover:border-amber-300'
                }`}
                onClick={() => onSelectMenu(menu)}
              >
                <div className="relative">
                  {menu.image_path && (
                    <div 
                      className="h-48 w-full bg-cover bg-center" 
                      style={{ backgroundImage: `url(${menu.image_path})` }}
                    />
                  )}
                  {!menu.image_path && (
                    <div className="h-48 w-full bg-gradient-to-r from-amber-50 to-amber-100 flex items-center justify-center">
                      <ChefHat size={48} className="text-amber-400" />
                    </div>
                  )}
                  <Badge className="absolute top-3 right-3 bg-amber-500 hover:bg-amber-600">
                    Fix Menü
                  </Badge>
                  {selectedFixedMenus.some(item => item.menu.id === menu.id) && (
                    <div className="absolute bottom-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-md">
                      {selectedFixedMenus.find(item => item.menu.id === menu.id)?.quantity || 0} adet seçildi
                    </div>
                  )}
                </div>
                
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="text-xl font-medium font-playfair">{menu.name}</h5>
                    <div className="flex items-center gap-1.5">
                      <Clock size={16} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">40-50 dk</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4 min-h-[40px]">
                    {menu.description || "Şefimizin özel olarak hazırladığı seçkin lezzetlerden oluşan fix menü."}
                  </p>
                  
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <div>
                      <span className="text-lg font-semibold text-amber-700">{menu.price} ₺</span>
                      <span className="text-xs text-muted-foreground ml-2">kişi başı</span>
                    </div>
                    <Button 
                      variant={selectedFixedMenus.some(item => item.menu.id === menu.id) ? "default" : "outline"}
                      size="sm"
                      className={selectedFixedMenus.some(item => item.menu.id === menu.id) 
                        ? "bg-amber-600 hover:bg-amber-700 text-white" 
                        : "border-amber-300 text-amber-700 hover:bg-amber-50"
                      }
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
            <div className="col-span-2 text-center p-8 bg-amber-50/50 rounded-lg border border-amber-100">
              <p className="text-muted-foreground">Maalesef hiç fix menü bulunamadı.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </>
  );
};

export default FixedMenuList;
