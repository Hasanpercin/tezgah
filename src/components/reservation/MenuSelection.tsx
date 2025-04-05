
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Minus, Check } from "lucide-react";

// Types
type FixMenuOption = {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
};

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'starter' | 'main' | 'dessert';
  image?: string;
};

type MenuSelectionProps = {
  onFixMenuSelected: (menu: FixMenuOption | null) => void;
  onALaCarteItemsSelected: (items: { item: MenuItem, quantity: number }[]) => void;
  selectedFixMenu: FixMenuOption | null;
  selectedALaCarteItems: { item: MenuItem, quantity: number }[];
  guests: string;
};

const MenuSelection = ({ 
  onFixMenuSelected, 
  onALaCarteItemsSelected, 
  selectedFixMenu, 
  selectedALaCarteItems,
  guests 
}: MenuSelectionProps) => {
  const [menuType, setMenuType] = useState<'fix' | 'alacarte'>(selectedFixMenu ? 'fix' : 'alacarte');
  
  // Sample fix menu options
  const fixMenuOptions: FixMenuOption[] = [
    {
      id: 'fix-1',
      name: 'Fix Menü 1 - Kırmızı Et',
      description: 'Çorba, Mevsim Salatası, Antrikot veya Lokum, Tatlı, Sıcak İçecek',
      price: 450,
      image: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=300'
    },
    {
      id: 'fix-2',
      name: 'Fix Menü 2 - Beyaz Et',
      description: 'Çorba, Mevsim Salatası, Tavuk veya Balık, Tatlı, Sıcak İçecek',
      price: 380,
      image: 'https://images.unsplash.com/photo-1518492104633-130d0cc84637?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=300'
    },
    {
      id: 'fix-3',
      name: 'Fix Menü 3 - Vejetaryen',
      description: 'Çorba, Mevsim Salatası, Sebzeli Risotto veya Makarna, Tatlı, Sıcak İçecek',
      price: 350,
      image: 'https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=300'
    }
  ];
  
  // Sample a la carte items
  const menuItems: MenuItem[] = [
    // Starters
    {
      id: 'starter-1',
      name: 'Mevsim Salatası',
      description: 'Taze mevsim sebzeleri ile',
      price: 75,
      category: 'starter',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=300'
    },
    {
      id: 'starter-2',
      name: 'Deniz Mahsulleri Salatası',
      description: 'Karışık deniz mahsulleri, taze yeşillikler ve özel sos ile',
      price: 95,
      category: 'starter'
    },
    {
      id: 'starter-3',
      name: 'Günün Çorbası',
      description: 'Şefin özel tarifi ile hazırlanmış günün çorbası',
      price: 55,
      category: 'starter'
    },
    
    // Main dishes
    {
      id: 'main-1',
      name: 'Lokum Bonfile',
      description: '200gr bonfile, mantar sosu ve patates püresi ile',
      price: 280,
      category: 'main',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=300'
    },
    {
      id: 'main-2',
      name: 'Tavuk Şinitzel',
      description: 'Panelenmiş tavuk göğsü, patates kızartması ve özel sos ile',
      price: 190,
      category: 'main'
    },
    {
      id: 'main-3',
      name: 'Levrek Fileto',
      description: 'Izgarada pişirilmiş levrek fileto, sebzeli pilav ile',
      price: 220,
      category: 'main',
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=300'
    },
    
    // Desserts
    {
      id: 'dessert-1',
      name: 'Çikolatalı Sufle',
      description: 'Sıcak çikolatalı sufle, vanilyalı dondurma ile',
      price: 85,
      category: 'dessert',
      image: 'https://images.unsplash.com/photo-1579306194872-64d3b7bac4c2?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=300'
    },
    {
      id: 'dessert-2',
      name: 'Cheesecake',
      description: 'Frambuaz soslu ev yapımı cheesecake',
      price: 75,
      category: 'dessert'
    }
  ];
  
  // Filtered by category
  const starters = menuItems.filter(item => item.category === 'starter');
  const mains = menuItems.filter(item => item.category === 'main');
  const desserts = menuItems.filter(item => item.category === 'dessert');
  
  // Handle fix menu selection
  const handleFixMenuSelect = (menuId: string) => {
    const selected = fixMenuOptions.find(menu => menu.id === menuId) || null;
    onFixMenuSelected(selected);
    
    // Clear a la carte selections if switching to fix menu
    if (selected && selectedALaCarteItems.length > 0) {
      onALaCarteItemsSelected([]);
    }
  };
  
  // Handle a la carte item quantity change
  const handleQuantityChange = (item: MenuItem, change: number) => {
    const existingItem = selectedALaCarteItems.find(i => i.item.id === item.id);
    
    if (existingItem) {
      // If item exists, update quantity or remove if becomes 0
      const newQuantity = Math.max(0, existingItem.quantity + change);
      
      if (newQuantity === 0) {
        // Remove item if quantity is 0
        onALaCarteItemsSelected(selectedALaCarteItems.filter(i => i.item.id !== item.id));
      } else {
        // Update quantity
        onALaCarteItemsSelected(
          selectedALaCarteItems.map(i => 
            i.item.id === item.id ? { ...i, quantity: newQuantity } : i
          )
        );
      }
    } else if (change > 0) {
      // Add new item with quantity 1
      onALaCarteItemsSelected([...selectedALaCarteItems, { item, quantity: 1 }]);
    }
    
    // Clear fix menu selection if adding a la carte items
    if (change > 0 && selectedFixMenu) {
      onFixMenuSelected(null);
    }
  };
  
  // Get quantity of an item
  const getQuantity = (itemId: string) => {
    const item = selectedALaCarteItems.find(i => i.item.id === itemId);
    return item ? item.quantity : 0;
  };
  
  // Calculate subtotal
  const calculateSubtotal = () => {
    if (menuType === 'fix' && selectedFixMenu) {
      return selectedFixMenu.price * parseInt(guests);
    } else {
      return selectedALaCarteItems.reduce(
        (sum, { item, quantity }) => sum + (item.price * quantity),
        0
      );
    }
  };

  return (
    <div className="py-6">
      <div className="pb-6">
        <h3 className="text-lg font-semibold mb-2">Menü Seçimi</h3>
        <p className="text-muted-foreground mb-6">
          Fix menü veya alakart sipariş seçeneğinden birini tercih edebilirsiniz.
        </p>
        
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 mb-8">
          <Button
            variant={menuType === 'fix' ? "default" : "outline"}
            className="flex-1 h-auto py-3"
            onClick={() => setMenuType('fix')}
          >
            <div className="text-left">
              <div className="font-medium">Fix Menü</div>
              <div className="text-sm text-muted-foreground mt-1">
                Kişi başı tek fiyat, önceden belirlenmiş menüler
              </div>
            </div>
          </Button>
          
          <Button
            variant={menuType === 'alacarte' ? "default" : "outline"}
            className="flex-1 h-auto py-3"
            onClick={() => setMenuType('alacarte')}
          >
            <div className="text-left">
              <div className="font-medium">Alakart Sipariş</div>
              <div className="text-sm text-muted-foreground mt-1">
                İstediğiniz yemekleri seçin, porsiyon bazında ödeme yapın
              </div>
            </div>
          </Button>
        </div>
      </div>

      {/* Fix Menu Options */}
      {menuType === 'fix' && (
        <div className="space-y-6">
          <RadioGroup 
            value={selectedFixMenu?.id || ''} 
            onValueChange={handleFixMenuSelect}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fixMenuOptions.map((menu) => (
                <div key={menu.id} className="relative">
                  <RadioGroupItem
                    value={menu.id}
                    id={menu.id}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={menu.id}
                    className="flex flex-col md:flex-row gap-4 border rounded-lg p-4 cursor-pointer hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:ring-1 peer-data-[state=checked]:ring-primary"
                  >
                    {menu.image && (
                      <div className="w-full md:w-1/3 h-40 md:h-auto overflow-hidden rounded-md">
                        <img src={menu.image} alt={menu.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-lg">{menu.name}</h4>
                        <span className="font-semibold text-primary">{menu.price} ₺</span>
                      </div>
                      <p className="text-muted-foreground mt-2">{menu.description}</p>
                      <div className="mt-4 text-sm">
                        <span className="text-muted-foreground">Kişi başı fiyat</span>
                      </div>
                    </div>
                  </Label>
                  {selectedFixMenu?.id === menu.id && (
                    <div className="absolute top-4 right-4 h-6 w-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                      <Check size={14} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </RadioGroup>
          
          {selectedFixMenu && (
            <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{selectedFixMenu.name}</h4>
                  <p className="text-sm text-muted-foreground">{guests} kişi</p>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{calculateSubtotal()} ₺</div>
                  <div className="text-xs text-muted-foreground">
                    Toplam ({selectedFixMenu.price} ₺ x {guests} kişi)
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* A La Carte Options */}
      {menuType === 'alacarte' && (
        <div className="space-y-8">
          {/* Starters */}
          <div>
            <h4 className="text-lg font-medium mb-3">Başlangıçlar</h4>
            <div className="space-y-4">
              {starters.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      {item.image && (
                        <div className="h-16 w-16 mr-4 rounded-md overflow-hidden flex-shrink-0">
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h5 className="font-medium">{item.name}</h5>
                          <span className="font-medium">{item.price} ₺</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <div className="ml-4 flex items-center">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => handleQuantityChange(item, -1)}
                          disabled={getQuantity(item.id) === 0}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{getQuantity(item.id)}</span>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => handleQuantityChange(item, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Main Courses */}
          <div>
            <h4 className="text-lg font-medium mb-3">Ana Yemekler</h4>
            <div className="space-y-4">
              {mains.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      {item.image && (
                        <div className="h-16 w-16 mr-4 rounded-md overflow-hidden flex-shrink-0">
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h5 className="font-medium">{item.name}</h5>
                          <span className="font-medium">{item.price} ₺</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <div className="ml-4 flex items-center">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => handleQuantityChange(item, -1)}
                          disabled={getQuantity(item.id) === 0}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{getQuantity(item.id)}</span>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => handleQuantityChange(item, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Desserts */}
          <div>
            <h4 className="text-lg font-medium mb-3">Tatlılar</h4>
            <div className="space-y-4">
              {desserts.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      {item.image && (
                        <div className="h-16 w-16 mr-4 rounded-md overflow-hidden flex-shrink-0">
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h5 className="font-medium">{item.name}</h5>
                          <span className="font-medium">{item.price} ₺</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <div className="ml-4 flex items-center">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => handleQuantityChange(item, -1)}
                          disabled={getQuantity(item.id) === 0}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{getQuantity(item.id)}</span>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => handleQuantityChange(item, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Summary */}
          {selectedALaCarteItems.length > 0 && (
            <div className="mt-8 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <h4 className="font-medium mb-2">Seçilen Ürünler</h4>
              <div className="space-y-2">
                {selectedALaCarteItems.map(({ item, quantity }) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{quantity}x {item.name}</span>
                    <span>{item.price * quantity} ₺</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-4 flex justify-between font-medium">
                  <span>Toplam</span>
                  <span>{calculateSubtotal()} ₺</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MenuSelection;
