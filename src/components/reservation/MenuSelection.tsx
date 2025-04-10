
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";
import { Check, ShoppingBag, X, MinusCircle, PlusCircle, Utensils, Plus, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { FixMenuOption, MenuItem } from './types/reservationTypes';
import { cn } from '@/lib/utils';

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
        
        console.log("Fixed menus loaded:", fixedMenuData);
        console.log("A La Carte items loaded:", menuItemsData);
        
        // Add quantity 0 to each menu item for tracking
        const menuItemsWithQuantity = menuItemsData.map((item: MenuItem) => ({
          ...item,
          quantity: 0
        }));
        
        setFixedMenus(fixedMenuData as FixMenuOption[]);
        setMenuItems(menuItemsWithQuantity as MenuItem[]);
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
  const handleSelectFixedMenu = (menu: FixMenuOption, quantity: number = 1) => {
    console.log("Fixed menu selected:", menu);
    // Add default quantity based on guest count
    const guestsCount = parseInt(guests) || 1;
    const menuWithQuantity: FixMenuOption = {
      ...menu,
      quantity: quantity || guestsCount
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

  // Handle incrementing/decrementing fixed menu quantity
  const handleFixMenuQuantityAdjust = (increment: boolean) => {
    if (!selectedFixMenu) return;
    
    const currentQuantity = selectedFixMenu.quantity || 1;
    const newQuantity = increment ? currentQuantity + 1 : Math.max(1, currentQuantity - 1);
    
    const updatedMenu: FixMenuOption = {
      ...selectedFixMenu,
      quantity: newQuantity
    };
    
    onFixMenuSelected(updatedMenu);
  };
  
  // Handle selecting an a la carte item
  const handleAddALaCarteItem = (item: MenuItem) => {
    console.log("A La Carte item added:", item);
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
    console.log("Selected: Choose at restaurant");
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

  // Handle tab change
  const handleTabChange = (value: string) => {
    console.log("Tab changing to:", value);
    setActiveTab(value);
  };

  // Check if an item is selected
  const isItemInCart = (itemId: string): boolean => {
    return selectedALaCarteItems.some(item => item.item.id === itemId);
  };

  // Get quantity of an item
  const getItemQuantity = (itemId: string): number => {
    const item = selectedALaCarteItems.find(item => item.item.id === itemId);
    return item ? item.quantity : 0;
  };

  // Check if a fixed menu is selected
  const isFixMenuSelected = (menuId: string): boolean => {
    return selectedFixMenu?.id === menuId;
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
        onValueChange={handleTabChange}
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
                <Card className="shadow-md border-primary/20">
                  <CardHeader className="bg-primary/5 border-b">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg text-primary">{selectedFixMenu.name}</CardTitle>
                        <CardDescription>{selectedFixMenu.description || 'Fix menü'}</CardDescription>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onFixMenuSelected(null)}
                        className="rounded-full hover:bg-primary/10"
                      >
                        <X size={18} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <span>Kişi Başı Fiyat:</span>
                        <span className="font-semibold text-primary">₺{selectedFixMenu.price.toLocaleString()}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Kişi Sayısı</Label>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleFixMenuQuantityAdjust(false)}
                            disabled={selectedFixMenu.quantity === 1}
                          >
                            <Minus size={16} />
                          </Button>
                          <Input 
                            id="quantity" 
                            type="number" 
                            min="1"
                            className="text-center w-20" 
                            value={selectedFixMenu.quantity || 1} 
                            onChange={(e) => handleFixMenuQuantityChange(e.target.value)}
                          />
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleFixMenuQuantityAdjust(true)}
                          >
                            <Plus size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4 bg-muted/30">
                    <span className="font-medium">Toplam:</span>
                    <span className="text-lg font-bold text-primary">₺{calculateFixedMenuTotal().toLocaleString()}</span>
                  </CardFooter>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fixedMenus.length > 0 ? (
                    fixedMenus.map((menu) => (
                      <Card 
                        key={menu.id} 
                        className={cn(
                          "border transition-all hover:shadow-md cursor-pointer",
                          isFixMenuSelected(menu.id as string) ? "border-primary/40 shadow-md bg-primary/5" : ""
                        )}
                      >
                        <CardHeader>
                          <CardTitle className="text-lg">{menu.name}</CardTitle>
                          <CardDescription>{menu.description || 'Fix menü paketi'}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-xl font-bold text-primary">₺{menu.price.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground mt-2">kişi başı</div>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center">
                          <div className="text-sm text-muted-foreground">
                            Min. {parseInt(guests) || 1} kişilik
                          </div>
                          <div className="flex items-center space-x-2">
                            {isFixMenuSelected(menu.id as string) ? (
                              <>
                                <Button 
                                  variant="outline" 
                                  size="icon"
                                  onClick={() => handleFixMenuQuantityAdjust(false)}
                                  disabled={(selectedFixMenu?.quantity || 1) <= 1}
                                  className="h-8 w-8"
                                >
                                  <Minus size={14} />
                                </Button>
                                <span className="w-6 text-center font-medium">
                                  {selectedFixMenu?.quantity || 1}
                                </span>
                                <Button 
                                  variant="outline" 
                                  size="icon"
                                  onClick={() => handleFixMenuQuantityAdjust(true)}
                                  className="h-8 w-8"
                                >
                                  <Plus size={14} />
                                </Button>
                              </>
                            ) : (
                              <Button 
                                variant="default"
                                size="sm"
                                onClick={() => handleSelectFixedMenu(menu)}
                                className="flex items-center gap-1 rounded-full px-4"
                              >
                                Seç
                              </Button>
                            )}
                          </div>
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
              <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                {menuItems.length > 0 ? (
                  <div className="divide-y">
                    {menuItems.map((item) => {
                      const isSelected = isItemInCart(item.id);
                      const quantity = getItemQuantity(item.id);
                      
                      return (
                        <div key={item.id} className={cn(
                          "p-4 flex justify-between items-center hover:bg-muted/30 transition-colors",
                          isSelected ? "bg-primary/5" : ""
                        )}>
                          <div className="flex-1">
                            <div className="font-medium">{item.name}</div>
                            {item.description && (
                              <div className="text-sm text-muted-foreground mt-0.5">{item.description}</div>
                            )}
                            <div className="text-primary font-medium mt-1">₺{item.price.toLocaleString()}</div>
                          </div>
                          
                          <div className="ml-4">
                            {isSelected ? (
                              <div className="flex items-center space-x-3 bg-background rounded-full border px-2 py-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-7 w-7 rounded-full hover:bg-muted"
                                  onClick={() => handleALaCarteQuantityChange(item.id, quantity - 1)}
                                >
                                  <Minus size={14} />
                                </Button>
                                <span className="w-5 text-center font-medium">{quantity}</span>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="h-7 w-7 rounded-full hover:bg-muted"
                                  onClick={() => handleALaCarteQuantityChange(item.id, quantity + 1)}
                                >
                                  <Plus size={14} />
                                </Button>
                              </div>
                            ) : (
                              <Button 
                                variant="outline"
                                size="sm"
                                onClick={() => handleAddALaCarteItem(item)}
                                className="rounded-full"
                              >
                                <Plus size={14} className="mr-1" />
                                Ekle
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Şu anda aktif menü öğesi bulunmamaktadır.
                  </div>
                )}
              </div>
              
              {selectedALaCarteItems.length > 0 && (
                <Card className="shadow-md border-primary/20 mt-8">
                  <CardHeader className="bg-primary/5 border-b">
                    <CardTitle className="text-lg text-primary">Seçilen Ürünler</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ul className="divide-y">
                      {selectedALaCarteItems.map(({ item, quantity }) => (
                        <li key={item.id} className="py-4 px-6 flex justify-between items-center">
                          <div>
                            <span className="font-medium">{item.name}</span>
                            <div className="flex items-center space-x-3 mt-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 rounded-full hover:bg-muted"
                                onClick={() => handleALaCarteQuantityChange(item.id, quantity - 1)}
                              >
                                <Minus size={12} />
                              </Button>
                              <span className="text-sm font-medium">{quantity} adet</span>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-6 w-6 rounded-full hover:bg-muted"
                                onClick={() => handleALaCarteQuantityChange(item.id, quantity + 1)}
                              >
                                <Plus size={12} />
                              </Button>
                            </div>
                          </div>
                          <div className="font-medium">₺{(item.price * quantity).toLocaleString()}</div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t py-4 bg-muted/30">
                    <span className="font-medium">Toplam:</span>
                    <span className="text-lg font-bold text-primary">₺{calculateALaCarteTotal().toLocaleString()}</span>
                  </CardFooter>
                </Card>
              )}
            </>
          )}
        </TabsContent>
        
        {/* Choose at Restaurant Tab */}
        <TabsContent value="later" className="space-y-6">
          <Card className={cn(
            "border shadow-md transition-all", 
            selectAtRestaurant ? "border-primary bg-primary/5" : ""
          )}>
            <CardHeader className="bg-muted/50">
              <CardTitle className="flex items-center gap-2">
                <Utensils className="h-5 w-5" />
                Menüyü Restoranda Seçmek İstiyorum
              </CardTitle>
              <CardDescription>
                Menü seçimini daha sonra restoranda yapmayı tercih ederseniz bu seçeneği kullanabilirsiniz.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <RadioGroup 
                value={selectAtRestaurant ? "yes" : "no"} 
                onValueChange={(value) => value === "yes" && handleSelectAtRestaurant()}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 rounded-md border p-3 bg-card shadow-sm">
                  <RadioGroupItem value="yes" id="at-restaurant" />
                  <Label htmlFor="at-restaurant" className="flex-1 cursor-pointer">Menü seçimimi restoranda yapmak istiyorum</Label>
                </div>
              </RadioGroup>
              
              <div className="bg-muted/50 p-4 rounded-md mt-6 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Check size={16} className="text-primary" />
                  Bu seçeneği işaretlerseniz, rezervasyonunuz onaylanacak ve masanız ayrılacaktır. 
                </p>
                <p className="flex items-center gap-2 mt-2">
                  <Check size={16} className="text-primary" />
                  Menü seçiminizi restoranda yapabilirsiniz.
                </p>
              </div>
            </CardContent>
            {!selectAtRestaurant && (
              <CardFooter className="flex justify-end pt-4 border-t">
                <Button
                  variant="primary"
                  onClick={handleSelectAtRestaurant}
                  className="rounded-full px-6"
                >
                  <Check size={16} className="mr-2" />
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
