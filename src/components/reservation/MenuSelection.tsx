
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";
import { Check, ShoppingBag, X, MinusCircle, PlusCircle, Utensils, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { FixMenuOption, MenuItem } from './types/reservationTypes';

interface MenuSelectionProps {
  onFixMenuSelected: (menu: FixMenuOption | null) => void;
  onALaCarteItemsSelected: (items: { item: MenuItem, quantity: number }[]) => void;
  onSelectAtRestaurant: (select: boolean) => void;
  selectedFixMenu: FixMenuOption | null;
  selectedALaCarteItems: { item: MenuItem, quantity: number }[];
  selectAtRestaurant: boolean;
  guests: string;
}

const MenuSelection = ({
  onFixMenuSelected,
  onALaCarteItemsSelected,
  onSelectAtRestaurant,
  selectedFixMenu,
  selectedALaCarteItems,
  selectAtRestaurant,
  guests
}: MenuSelectionProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("fixed");
  const [fixedMenus, setFixedMenus] = useState<FixMenuOption[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Fetch fixed menus and a la carte items
  useEffect(() => {
    const fetchMenuData = async () => {
      setLoading(true);
      try {
        // Fetch fixed menu packages
        const { data: fixedMenuData, error: fixedMenuError } = await supabase
          .from('fixed_menu_packages')
          .select('*')
          .eq('is_active', true);
        
        if (fixedMenuError) throw fixedMenuError;
        
        // Fetch a la carte menu items
        const { data: menuItemsData, error: menuItemsError } = await supabase
          .from('menu_items')
          .select('*')
          .eq('is_in_stock', true)
          .order('name', { ascending: true });
        
        if (menuItemsError) throw menuItemsError;
        
        setFixedMenus(fixedMenuData as FixMenuOption[]);
        setMenuItems(menuItemsData as MenuItem[]);
      } catch (error: any) {
        console.error('Error fetching menu data:', error.message);
        toast({
          title: "Hata",
          description: "Menü bilgileri yüklenirken bir sorun oluştu.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchMenuData();
  }, [toast]);
  
  // Handle selecting a fixed menu
  const handleSelectFixedMenu = (menu: FixMenuOption) => {
    // Add default quantity based on guest count
    const guestsCount = parseInt(guests) || 1;
    const menuWithQuantity: FixMenuOption = {
      ...menu,
      quantity: guestsCount
    };
    
    onFixMenuSelected(menuWithQuantity);
    onSelectAtRestaurant(false);
    setActiveTab("fixed");
  };
  
  // Handle changing fixed menu quantity
  const handleFixMenuQuantityChange = (value: string) => {
    if (!selectedFixMenu) return;
    
    const quantity = parseInt(value);
    if (isNaN(quantity) || quantity < 1) return;
    
    const updatedMenu: FixMenuOption = {
      ...selectedFixMenu,
      quantity
    };
    
    onFixMenuSelected(updatedMenu);
  };
  
  // Handle selecting an a la carte item
  const handleAddALaCarteItem = (item: MenuItem) => {
    const existingItemIndex = selectedALaCarteItems.findIndex(
      selected => selected.item.id === item.id
    );
    
    let updatedItems;
    
    if (existingItemIndex >= 0) {
      // Item already exists, increase quantity
      updatedItems = [...selectedALaCarteItems];
      updatedItems[existingItemIndex] = {
        item: updatedItems[existingItemIndex].item,
        quantity: updatedItems[existingItemIndex].quantity + 1
      };
    } else {
      // Add new item with quantity 1
      updatedItems = [...selectedALaCarteItems, { item, quantity: 1 }];
    }
    
    onALaCarteItemsSelected(updatedItems);
    onSelectAtRestaurant(false);
    setActiveTab("alacarte");
  };
  
  // Handle changing a la carte item quantity
  const handleALaCarteQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 0) return;
    
    let updatedItems;
    
    if (newQuantity === 0) {
      // Remove item if quantity is 0
      updatedItems = selectedALaCarteItems.filter(
        selected => selected.item.id !== itemId
      );
    } else {
      // Update item quantity
      updatedItems = selectedALaCarteItems.map(selected => 
        selected.item.id === itemId
          ? { ...selected, quantity: newQuantity }
          : selected
      );
    }
    
    onALaCarteItemsSelected(updatedItems);
  };
  
  // Handle selecting "choose at restaurant"
  const handleSelectAtRestaurant = () => {
    onSelectAtRestaurant(true);
    onFixMenuSelected(null);
    onALaCarteItemsSelected([]);
    setActiveTab("later");
  };
  
  // Calculate total for fixed menu
  const calculateFixedMenuTotal = () => {
    if (!selectedFixMenu) return 0;
    const quantity = selectedFixMenu.quantity || 1;
    return selectedFixMenu.price * quantity;
  };
  
  // Calculate total for a la carte items
  const calculateALaCarteTotal = () => {
    return selectedALaCarteItems.reduce(
      (total, { item, quantity }) => total + (item.price * quantity),
      0
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Menü Seçimi</h3>
        <Badge variant="outline" className="text-sm">
          {guests} kişi
        </Badge>
      </div>
      
      <Tabs 
        defaultValue="fixed" 
        value={activeTab} 
        onValueChange={(value) => {
          console.log("Tab changed to:", value);
          setActiveTab(value);
        }}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="fixed" className="flex items-center">
            <Utensils className="mr-2 h-4 w-4" />
            Fix Menüler
          </TabsTrigger>
          <TabsTrigger value="alacarte" className="flex items-center">
            <ShoppingBag className="mr-2 h-4 w-4" />
            A La Carte
          </TabsTrigger>
          <TabsTrigger value="later" className="flex items-center">
            <Check className="mr-2 h-4 w-4" />
            Restoranda Seçim
          </TabsTrigger>
        </TabsList>
        
        {/* Fixed Menu Tab */}
        <TabsContent value="fixed" className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Menüler yükleniyor...</p>
            </div>
          ) : (
            <>
              {selectedFixMenu ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex justify-between">
                      <span>{selectedFixMenu.name}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onFixMenuSelected(null)}
                      >
                        <X size={18} />
                      </Button>
                    </CardTitle>
                    <CardDescription>{selectedFixMenu.description || 'Fix menü'}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Kişi Başı Fiyat:</span>
                        <span className="font-semibold">₺{selectedFixMenu.price.toLocaleString()}</span>
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor="quantity">Kişi Sayısı</Label>
                        <Input 
                          id="quantity" 
                          type="number" 
                          min="1" 
                          value={selectedFixMenu.quantity || parseInt(guests)} 
                          onChange={(e) => handleFixMenuQuantityChange(e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <span className="font-medium">Toplam:</span>
                    <span className="text-lg font-bold">₺{calculateFixedMenuTotal().toLocaleString()}</span>
                  </CardFooter>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fixedMenus.length > 0 ? (
                    fixedMenus.map((menu) => (
                      <Card 
                        key={menu.id} 
                        className="border transition-all"
                      >
                        <CardHeader>
                          <CardTitle className="text-lg">{menu.name}</CardTitle>
                          <CardDescription>{menu.description || 'Fix menü paketi'}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-xl font-bold">₺{menu.price.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground mt-2">kişi başı</div>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                          <Button 
                            variant="default"
                            onClick={() => handleSelectFixedMenu(menu)}
                            className="flex items-center gap-1"
                          >
                            <Plus size={16} />
                            Ekle
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8 text-muted-foreground">
                      Şu anda aktif fix menü bulunmamaktadır.
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </TabsContent>
        
        {/* A La Carte Tab */}
        <TabsContent value="alacarte" className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Menü öğeleri yükleniyor...</p>
            </div>
          ) : (
            <>
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full divide-y">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Ürün</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Fiyat</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="bg-background divide-y">
                    {menuItems.length > 0 ? (
                      menuItems.map((item) => {
                        const selectedItem = selectedALaCarteItems.find(
                          selected => selected.item.id === item.id
                        );
                        
                        return (
                          <tr key={item.id} className="hover:bg-muted/30">
                            <td className="px-4 py-3">
                              <div className="font-medium">{item.name}</div>
                              {item.description && (
                                <div className="text-xs text-muted-foreground mt-1">{item.description}</div>
                              )}
                            </td>
                            <td className="px-4 py-3">₺{item.price.toLocaleString()}</td>
                            <td className="px-4 py-3 text-right">
                              {selectedItem ? (
                                <div className="inline-flex items-center space-x-2">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => handleALaCarteQuantityChange(item.id, selectedItem.quantity - 1)}
                                  >
                                    <MinusCircle size={18} />
                                  </Button>
                                  <span className="w-6 text-center">{selectedItem.quantity}</span>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => handleALaCarteQuantityChange(item.id, selectedItem.quantity + 1)}
                                  >
                                    <PlusCircle size={18} />
                                  </Button>
                                </div>
                              ) : (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleAddALaCarteItem(item)}
                                >
                                  Ekle
                                </Button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={3} className="text-center py-8 text-muted-foreground">
                          Şu anda aktif menü öğesi bulunmamaktadır.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {selectedALaCarteItems.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Seçilen Ürünler</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="divide-y">
                      {selectedALaCarteItems.map(({ item, quantity }) => (
                        <li key={item.id} className="py-2 flex justify-between">
                          <div>
                            <span className="font-medium">{item.name}</span>
                            <span className="text-muted-foreground ml-2">x {quantity}</span>
                          </div>
                          <div className="font-medium">₺{(item.price * quantity).toLocaleString()}</div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <span className="font-medium">Toplam:</span>
                    <span className="text-lg font-bold">₺{calculateALaCarteTotal().toLocaleString()}</span>
                  </CardFooter>
                </Card>
              )}
            </>
          )}
        </TabsContent>
        
        {/* Choose at Restaurant Tab */}
        <TabsContent value="later" className="space-y-6">
          <Card className={`border ${selectAtRestaurant ? 'border-primary' : ''}`}>
            <CardHeader>
              <CardTitle>Menüyü Restoranda Seçmek İstiyorum</CardTitle>
              <CardDescription>
                Menü seçimini daha sonra restoranda yapmayı tercih ederseniz bu seçeneği kullanabilirsiniz.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={selectAtRestaurant ? "yes" : "no"} 
                onValueChange={(value) => value === "yes" && handleSelectAtRestaurant()}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="at-restaurant" />
                  <Label htmlFor="at-restaurant">Menü seçimimi restoranda yapmak istiyorum</Label>
                </div>
              </RadioGroup>
              
              <p className="text-sm text-muted-foreground mt-4">
                Bu seçeneği işaretlerseniz, rezervasyonunuz onaylanacak ve masanız ayrılacaktır. 
                Menü seçiminizi restoranda yapabilirsiniz.
              </p>
            </CardContent>
            {!selectAtRestaurant && (
              <CardFooter className="flex justify-end">
                <Button
                  onClick={handleSelectAtRestaurant}
                  className="flex items-center gap-1"
                >
                  <Check size={16} />
                  Seçimi Onayla
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MenuSelection;
