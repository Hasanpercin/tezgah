
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { MenuItem } from '../../types/reservationTypes';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

type MenuCategory = {
  id: string;
  name: string;
  description?: string;
};

type GroupedMenuItems = {
  [key: string]: {
    category: MenuCategory;
    items: MenuItem[];
  }
};

interface ALaCarteSectionProps {
  menuItems: MenuItem[];
  selectedItems: MenuItem[];
  onAddItem: (item: MenuItem) => void;
  onRemoveItem: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onMenuItemsSelect?: (items: MenuItem[]) => void;
  guestCount?: number | string;
}

const ALaCarteSection: React.FC<ALaCarteSectionProps> = ({
  menuItems,
  selectedItems,
  onAddItem,
  onRemoveItem,
  onUpdateQuantity
}) => {
  const isMobile = useIsMobile();
  
  // Group menu items by category
  const groupedItems: GroupedMenuItems = menuItems.reduce((acc, item) => {
    const categoryId = item.category_id;
    
    if (!acc[categoryId]) {
      acc[categoryId] = {
        category: {
          id: categoryId,
          name: item.menu_categories?.name || 'Diğer',
          description: item.menu_categories?.description
        },
        items: []
      };
    }
    
    acc[categoryId].items.push(item);
    return acc;
  }, {} as GroupedMenuItems);
  
  const isItemSelected = (itemId: string) => {
    return selectedItems.some(item => item.id === itemId);
  };
  
  const getItemQuantity = (itemId: string) => {
    const item = selectedItems.find(item => item.id === itemId);
    return item ? item.quantity || 1 : 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">A La Carte Menü</h3>
        <Badge variant="outline" className="flex items-center gap-1">
          <ShoppingCart size={14} />
          <span>{selectedItems.reduce((total, item) => total + (item.quantity || 1), 0)} Ürün</span>
        </Badge>
      </div>
      
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-[1fr_250px]'} gap-6`}>
        {/* Menu Categories and Items Section */}
        <ScrollArea className="pr-4" style={{ height: isMobile ? '400px' : '500px' }}>
          <div className="space-y-8">
            {Object.values(groupedItems).map(({ category, items }) => (
              <div key={category.id} className="space-y-4">
                <div>
                  <h4 className="text-lg font-medium">{category.name}</h4>
                  {category.description && (
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  )}
                </div>
                
                <div className="space-y-3">
                  {items.map(item => (
                    <div 
                      key={item.id} 
                      className={cn(
                        "p-3 border rounded-md hover:bg-accent transition-colors",
                        isItemSelected(item.id) && "border-primary bg-primary/5"
                      )}
                    >
                      <div className="flex justify-between">
                        <div>
                          <h5 className="font-medium">{item.name}</h5>
                          {item.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                          )}
                          <p className="mt-1 font-medium">{item.price?.toLocaleString('tr-TR')} ₺</p>
                        </div>
                        
                        <div className="flex flex-col items-center gap-2">
                          {isItemSelected(item.id) ? (
                            <div className="flex items-center gap-2">
                              <Button 
                                type="button"
                                variant="outline" 
                                size="icon" 
                                className="size-8"
                                onClick={() => onUpdateQuantity(item.id, Math.max(1, getItemQuantity(item.id) - 1))}
                              >
                                <Minus size={14} />
                              </Button>
                              <span className="w-6 text-center">{getItemQuantity(item.id)}</span>
                              <Button 
                                type="button"
                                variant="outline" 
                                size="icon" 
                                className="size-8"
                                onClick={() => onUpdateQuantity(item.id, getItemQuantity(item.id) + 1)}
                              >
                                <Plus size={14} />
                              </Button>
                            </div>
                          ) : (
                            <Button 
                              type="button"
                              variant="outline" 
                              onClick={() => onAddItem(item)}
                            >
                              Ekle
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator />
              </div>
            ))}
          </div>
        </ScrollArea>
        
        {/* Selected Items Section */}
        {!isMobile && (
          <div className="border rounded-md p-4">
            <h4 className="font-medium mb-3">Seçilen Ürünler</h4>
            
            {selectedItems.length === 0 ? (
              <p className="text-sm text-muted-foreground">Henüz ürün seçilmedi.</p>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {selectedItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-2 border-b">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <div className="flex items-center gap-2 text-sm mt-1">
                          <span>{item.price?.toLocaleString('tr-TR')} ₺</span> 
                          <span>x</span> 
                          <span>{item.quantity || 1}</span>
                          <span>=</span>
                          <span className="font-medium">
                            {((item.price || 0) * (item.quantity || 1)).toLocaleString('tr-TR')} ₺
                          </span>
                        </div>
                      </div>
                      
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => onRemoveItem(item.id)}
                      >
                        Sil
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
            
            {selectedItems.length > 0 && (
              <div className="mt-4 pt-3 border-t">
                <div className="flex justify-between font-medium">
                  <span>Toplam</span>
                  <span>
                    {selectedItems
                      .reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0)
                      .toLocaleString('tr-TR')} ₺
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Mobile Selected Items Summary */}
      {isMobile && selectedItems.length > 0 && (
        <div className="border rounded-md p-4">
          <h4 className="font-medium mb-3">Seçilen Ürünler</h4>
          <ScrollArea className="h-[200px]">
            <div className="space-y-3">
              {selectedItems.map(item => (
                <div key={item.id} className="flex items-center justify-between p-2 border-b">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <div className="flex items-center gap-2 text-sm mt-1">
                      <span>{item.price?.toLocaleString('tr-TR')} ₺</span> 
                      <span>x</span> 
                      <span>{item.quantity || 1}</span>
                      <span>=</span>
                      <span className="font-medium">
                        {((item.price || 0) * (item.quantity || 1)).toLocaleString('tr-TR')} ₺
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    Sil
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="mt-4 pt-3 border-t">
            <div className="flex justify-between font-medium">
              <span>Toplam</span>
              <span>
                {selectedItems
                  .reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0)
                  .toLocaleString('tr-TR')} ₺
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ALaCarteSection;
