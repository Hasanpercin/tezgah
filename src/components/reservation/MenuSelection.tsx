
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
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

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
  const [isBasketOpen, setIsBasketOpen] = useState<boolean>(false);
  
  useEffect(() => {
    const fetchMenuData = async () => {
      setLoading(true);
      try {
        const { data: fixedMenuData, error: fixedMenuError } = await supabase
          .from('fixed_menu_packages')
          .select('*')
          .eq('is_active', true);
        
        if (fixedMenuError) throw fixedMenuError;
        
        const { data: menuItemsData, error: menuItemsError } = await supabase
          .from('menu_items')
          .select('*')
          .eq('is_in_stock', true)
          .order('name', { ascending: true });
        
        if (menuItemsError) throw menuItemsError;
        
        console.log("Fixed menus loaded:", fixedMenuData);
        console.log("A La Carte items loaded:", menuItemsData);
        
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
  
  const handleSelectFixedMenu = (menu: FixMenuOption, quantity: number = 1) => {
    console.log("Fixed menu selected:", menu);
    const guestsCount = parseInt(guests) || 1;
    const menuWithQuantity: FixMenuOption = {
      ...menu,
      quantity: quantity || guestsCount
    };
    
    onFixMenuSelected(menuWithQuantity);
    onSelectAtRestaurant(false);
    setActiveTab("fixed");
    
    toast({
      title: "Menü seçildi",
      description: `${menu.name} menüsünü seçtiniz.`
    });
  };
  
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
  
  const handleAddALaCarteItem = (item: MenuItem) => {
    console.log("A La Carte item added:", item);
    const existingItemIndex = selectedALaCarteItems.findIndex(
      selected => selected.item.id === item.id
    );
    
    let updatedItems;
    
    if (existingItemIndex >= 0) {
      updatedItems = [...selectedALaCarteItems];
      updatedItems[existingItemIndex] = {
        item: updatedItems[existingItemIndex].item,
        quantity: updatedItems[existingItemIndex].quantity + 1
      };
    } else {
      updatedItems = [...selectedALaCarteItems, { item, quantity: 1 }];
    }
    
    onALaCarteItemsSelected(updatedItems);
    onSelectAtRestaurant(false);
    setActiveTab("alacarte");
    
    toast({
      title: "Ürün sepete eklendi",
      description: `${item.name} sepete eklendi.`
    });
  };
  
  const handleALaCarteQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 0) return;
    
    let updatedItems;
    
    if (newQuantity === 0) {
      updatedItems = selectedALaCarteItems.filter(
        selected => selected.item.id !== itemId
      );
    } else {
      updatedItems = selectedALaCarteItems.map(selected => 
        selected.item.id === itemId
          ? { ...selected, quantity: newQuantity }
          : selected
      );
    }
    
    onALaCarteItemsSelected(updatedItems);
  };
  
  const handleSelectAtRestaurant = () => {
    console.log("Selected: Choose at restaurant");
    onSelectAtRestaurant(true);
    onFixMenuSelected(null);
    onALaCarteItemsSelected([]);
    setActiveTab("later");
    
    toast({
      title: "Tercih kaydedildi",
      description: "Menü seçiminizi restoranda yapacaksınız."
    });
  };
  
  const calculateFixedMenuTotal = () => {
    if (!selectedFixMenu) return 0;
    const quantity = selectedFixMenu.quantity || 1;
    return selectedFixMenu.price * quantity;
  };
  
  const calculateALaCarteTotal = () => {
    return selectedALaCarteItems.reduce(
      (total, { item, quantity }) => total + (item.price * quantity),
      0
    );
  };

  const handleTabChange = (value: string) => {
    console.log("Tab changing to:", value);
    setActiveTab(value);
  };

  const isItemInCart = (itemId: string): boolean => {
    return selectedALaCarteItems.some(item => item.item.id === itemId);
  };

  const getItemQuantity = (itemId: string): number => {
    const item = selectedALaCarteItems.find(item => item.item.id === itemId);
    return item ? item.quantity : 0;
  };

  const isFixMenuSelected = (menuId: string): boolean => {
    return selectedFixMenu?.id === menuId;
  };

  const getTotalItems = () => {
    return selectedALaCarteItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Menü Seçimi</h3>
        <div className="flex items-center gap-3">
          {selectedALaCarteItems.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => setIsBasketOpen(true)}
            >
              <ShoppingBag className="h-4 w-4" />
              <Badge variant="secondary" className="ml-1">{getTotalItems()}</Badge>
            </Button>
          )}
          <Badge variant="outline" className="text-sm">
            {guests} kişi
          </Badge>
        </div>
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
                          "border transition-all hover:shadow-md",
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
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => handleSelectFixedMenu(menu)}
                            className="rounded-full px-4 bg-green-100 hover:bg-green-200 border-green-300 text-green-800"
                          >
                            Seç
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
        
        <TabsContent value="alacarte" className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Menü öğeleri yükleniyor...</p>
            </div>
          ) : (
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
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8 rounded-full"
                                onClick={() => handleALaCarteQuantityChange(item.id, quantity - 1)}
                              >
                                <Minus size={14} />
                              </Button>
                              <span className="w-5 text-center font-medium">{quantity}</span>
                              <Button 
                                variant="outline" 
                                size="icon"
                                className="h-8 w-8 rounded-full"
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
                              className="rounded-full h-8 w-8 p-0"
                            >
                              <Plus size={16} />
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
          )}
        </TabsContent>
        
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
                defaultValue={selectAtRestaurant ? "yes" : "no"}
                value={selectAtRestaurant ? "yes" : "no"} 
                onValueChange={(value) => value === "yes" && handleSelectAtRestaurant()}
                className="space-y-3"
              >
                <div className={cn(
                  "flex items-center space-x-3 rounded-md border p-3 bg-card shadow-sm cursor-pointer",
                  selectAtRestaurant ? "border-primary/50 bg-primary/5" : ""
                )}
                onClick={() => handleSelectAtRestaurant()}>
                  <RadioGroupItem value="yes" id="at-restaurant" checked={selectAtRestaurant} />
                  <Label htmlFor="at-restaurant" className="flex-1 cursor-pointer">Menü seçimimi restoranda yapmak istiyorum</Label>
                </div>
              </RadioGroup>
              
              <div className="bg-muted/50 p-4 rounded-md mt-6 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Check size={16} className="text-green-600" />
                  Bu seçeneği işaretlerseniz, rezervasyonunuz onaylanacak ve masanız ayrılacaktır. 
                </p>
                <p className="flex items-center gap-2 mt-2">
                  <Check size={16} className="text-green-600" />
                  Menü seçiminizi restoranda yapabilirsiniz.
                </p>
              </div>
            </CardContent>
            {!selectAtRestaurant && (
              <CardFooter className="flex justify-end pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={handleSelectAtRestaurant}
                  className="rounded-full px-6 bg-green-100 hover:bg-green-200 border-green-300 text-green-800"
                >
                  <Check size={16} className="mr-2" />
                  Seçimi Onayla
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {/* Basket Drawer */}
      <Sheet open={isBasketOpen} onOpenChange={setIsBasketOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Seçilen Ürünler</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            {selectedALaCarteItems.length > 0 ? (
              <div className="space-y-6">
                <div className="divide-y border rounded-md overflow-hidden">
                  {selectedALaCarteItems.map(({ item, quantity }) => (
                    <div key={item.id} className="p-3 flex justify-between items-center">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-primary font-medium">₺{item.price.toLocaleString()}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-7 w-7 rounded-full"
                          onClick={() => handleALaCarteQuantityChange(item.id, quantity - 1)}
                        >
                          <Minus size={14} />
                        </Button>
                        <span className="w-5 text-center font-medium">{quantity}</span>
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="h-7 w-7 rounded-full"
                          onClick={() => handleALaCarteQuantityChange(item.id, quantity + 1)}
                        >
                          <Plus size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center font-medium text-lg">
                    <span>Toplam:</span>
                    <span className="text-primary">₺{calculateALaCarteTotal().toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Henüz ürün seçilmedi.
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MenuSelection;
