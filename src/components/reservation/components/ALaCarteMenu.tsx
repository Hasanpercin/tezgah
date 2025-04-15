
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMenuItems } from '@/services/menuService';
import { MenuItem } from '@/services/menuService';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from 'lucide-react';
import { Separator } from "@/components/ui/separator";

interface ALaCarteMenuProps {
  onChange: (items: MenuItem[]) => void;
  guestCount: number | string;
}

const ALaCarteMenu: React.FC<ALaCarteMenuProps> = ({ onChange, guestCount }) => {
  const [selectedItems, setSelectedItems] = useState<MenuItem[]>([]);
  const numGuests = typeof guestCount === 'string' ? parseInt(guestCount) : guestCount;
  
  const { data: menuItems, isLoading } = useQuery({
    queryKey: ['menuItems'],
    queryFn: fetchMenuItems
  });
  
  // Group menu items by category
  const getMenuItemsByCategory = () => {
    if (!menuItems) return {};
    
    return menuItems.reduce((acc: {[key: string]: MenuItem[]}, item) => {
      const categoryId = item.category_id;
      if (!acc[categoryId]) {
        acc[categoryId] = [];
      }
      acc[categoryId].push(item);
      return acc;
    }, {});
  };
  
  const handleAddItem = (item: MenuItem) => {
    const existingItem = selectedItems.find(selected => selected.id === item.id);
    
    if (existingItem) {
      // Update quantity if item already exists
      const updatedItems = selectedItems.map(selected => 
        selected.id === item.id 
          ? { ...selected, quantity: (selected.quantity || 1) + 1 }
          : selected
      );
      setSelectedItems(updatedItems);
    } else {
      // Add new item with quantity 1
      setSelectedItems([...selectedItems, { ...item, quantity: 1 }]);
    }
  };
  
  const handleRemoveItem = (item: MenuItem) => {
    const existingItem = selectedItems.find(selected => selected.id === item.id);
    
    if (existingItem && existingItem.quantity && existingItem.quantity > 1) {
      // Decrease quantity if more than 1
      const updatedItems = selectedItems.map(selected => 
        selected.id === item.id 
          ? { ...selected, quantity: (selected.quantity || 1) - 1 }
          : selected
      );
      setSelectedItems(updatedItems);
    } else {
      // Remove item if quantity is 1
      setSelectedItems(selectedItems.filter(selected => selected.id !== item.id));
    }
  };
  
  useEffect(() => {
    onChange(selectedItems);
  }, [selectedItems, onChange]);
  
  const getItemQuantity = (itemId: string) => {
    const item = selectedItems.find(selected => selected.id === itemId);
    return item ? item.quantity || 0 : 0;
  };
  
  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => {
      return total + (item.price * (item.quantity || 1));
    }, 0);
  };
  
  if (isLoading) return <p>Menü yükleniyor...</p>;
  
  const groupedItems = getMenuItemsByCategory();
  
  return (
    <div className="space-y-6">
      {/* Selected Items Summary */}
      <div className="p-4 border rounded-md bg-accent/10">
        <h4 className="font-medium mb-3">Seçilen Ürünler</h4>
        
        {selectedItems.length === 0 ? (
          <p className="text-muted-foreground text-sm">Henüz ürün seçmediniz.</p>
        ) : (
          <div className="space-y-2">
            {selectedItems.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <span className="font-medium">{item.name}</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    x{item.quantity}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">{item.price * (item.quantity || 1)} ₺</span>
                  <div className="flex items-center space-x-1">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-7 w-7 p-0" 
                      onClick={() => handleRemoveItem(item)}
                    >
                      <Minus size={14} />
                    </Button>
                    <span className="w-5 text-center">{item.quantity}</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-7 w-7 p-0" 
                      onClick={() => handleAddItem(item)}
                    >
                      <Plus size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            <Separator className="my-2" />
            
            <div className="flex justify-between font-medium">
              <span>Toplam</span>
              <span>{calculateTotal()} ₺</span>
            </div>
            
            {numGuests > 0 && (
              <div className="text-xs text-muted-foreground text-right">
                Kişi başı yaklaşık {(calculateTotal() / numGuests).toFixed(2)} ₺
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Menu Items */}
      <div className="space-y-6">
        {Object.entries(groupedItems).map(([categoryId, items]) => (
          <div key={categoryId} className="space-y-2">
            <h5 className="font-medium">{items[0]?.menu_categories?.name || 'Kategori'}</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {items.map(item => (
                <div key={item.id} className="flex justify-between border p-3 rounded-md">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    {item.description && (
                      <div className="text-sm text-muted-foreground">{item.description}</div>
                    )}
                    <div className="mt-1 text-primary font-medium">{item.price} ₺</div>
                  </div>
                  <div className="flex items-center">
                    {getItemQuantity(item.id) > 0 && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0" 
                          onClick={() => handleRemoveItem(item)}
                        >
                          <Minus size={16} />
                        </Button>
                        <span className="w-8 text-center">{getItemQuantity(item.id)}</span>
                      </>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 w-8 p-0" 
                      onClick={() => handleAddItem(item)}
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ALaCarteMenu;
