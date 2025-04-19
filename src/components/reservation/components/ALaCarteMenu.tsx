import { useState, useEffect } from 'react';
import { fetchMenuItems, MenuItem } from '@/services/menuService';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Plus, Minus } from 'lucide-react';

interface ALaCarteMenuProps {
  onChange: (items: MenuItem[]) => void;
  guestCount: number | string;
}

const ALaCarteMenu = ({ onChange, guestCount }: ALaCarteMenuProps) => {
  const { toast } = useToast();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<{[key: string]: string}>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItems, setSelectedItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        setIsLoading(true);
        const items = await fetchMenuItems();
        console.log("Fetched menu items:", items);
        
        if (!items || items.length === 0) {
          console.log("No menu items found");
          toast({
            title: "Menü Bulunamadı",
            description: "Menü öğeleri yüklenirken bir sorun oluştu.",
            variant: "destructive"
          });
          return;
        }
        
        setMenuItems(items);
        
        const cats: {[key: string]: string} = {};
        items.forEach(item => {
          if (item.menu_categories && item.category_id) {
            cats[item.category_id] = item.menu_categories.name;
          }
        });
        setCategories(cats);
        
      } catch (error) {
        console.error('Error loading menu items:', error);
        toast({
          title: "Menü Yüklenemedi",
          description: "Menü öğeleri yüklenirken bir hata oluştu.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMenuItems();
  }, [toast]);

  const handleItemSelect = (item: MenuItem) => {
    const existingItemIndex = selectedItems.findIndex(i => i.id === item.id);
    
    if (existingItemIndex >= 0) {
      const updatedItems = [...selectedItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: (updatedItems[existingItemIndex].quantity || 1) + 1
      };
      setSelectedItems(updatedItems);
    } else {
      setSelectedItems([...selectedItems, { ...item, quantity: 1 }]);
    }
    
    onChange([...selectedItems, { ...item, quantity: 1 }]);
  };

  const handleItemQuantityChange = (itemId: string, change: number) => {
    const updatedItems = selectedItems.map(item => {
      if (item.id === itemId) {
        const newQuantity = (item.quantity || 1) + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
      }
      return item;
    }).filter(Boolean) as MenuItem[];
    
    setSelectedItems(updatedItems);
    onChange(updatedItems);
  };

  const handleItemRemove = (itemId: string) => {
    const updatedItems = selectedItems.filter(item => item.id !== itemId);
    setSelectedItems(updatedItems);
    onChange(updatedItems);
  };

  const filterMenuItems = () => {
    if (selectedCategory === 'all') {
      return menuItems.filter(item => item.is_in_stock);
    }
    return menuItems.filter(item => 
      item.category_id === selectedCategory && item.is_in_stock
    );
  };

  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => {
      return total + (item.price * (item.quantity || 1));
    }, 0);
  };

  const filteredItems = filterMenuItems();

  if (isLoading) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-muted-foreground">Menü öğeleri yükleniyor...</p>
      </div>
    );
  }

  if (menuItems.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">A la carte menü bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Selected Items Summary */}
      {selectedItems.length > 0 && (
        <div className="bg-muted/30 rounded-lg p-4 mb-6">
          <h5 className="font-medium text-lg mb-3">Seçilen Yemekler</h5>
          <div className="space-y-3">
            {selectedItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.price} ₺ × {item.quantity}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={() => handleItemQuantityChange(item.id, -1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={() => handleItemQuantityChange(item.id, 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 text-destructive hover:text-destructive" 
                    onClick={() => handleItemRemove(item.id)}
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

      {/* Category Filter */}
      <ScrollArea className="w-full overflow-x-auto pb-2">
        <div className="flex gap-2 mb-6">
          <Button
            variant={selectedCategory === 'all' ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory('all')}
          >
            Tümü
          </Button>
          {Object.entries(categories).map(([id, name]) => (
            <Button
              key={id}
              variant={selectedCategory === id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(id)}
            >
              {name}
            </Button>
          ))}
        </div>
      </ScrollArea>

      <Separator className="my-6" />

      {/* Menu Items */}
      <ScrollArea className="h-[60vh] w-full pr-4 overflow-y-auto -mx-2 px-2">
        <div className="pb-6">
          {filteredItems.length === 0 ? (
            <p className="text-center p-4 text-muted-foreground">Bu kategoride ürün bulunamadı.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden cursor-pointer hover:shadow-md"
                  onClick={() => handleItemSelect(item)}
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col">
                      {item.image_path && (
                        <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${item.image_path})` }}></div>
                      )}
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">{item.name}</h3>
                          <span className="text-primary font-medium">{item.price} ₺</span>
                        </div>
                        {item.description && (
                          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        )}
                        <div className="mt-3 flex justify-end">
                          <Button 
                            variant={selectedItems.some(i => i.id === item.id) ? "default" : "outline"}
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleItemSelect(item);
                            }}
                          >
                            <Plus className="h-4 w-4 mr-1" /> Ekle
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ALaCarteMenu;
