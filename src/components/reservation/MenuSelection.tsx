
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Button } from "@/components/ui/button";
import { Check, ShoppingBag, X, Utensils, Plus, Minus, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { FixMenuOption, MenuItem } from './types/reservationTypes';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

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
  const [activeTab, setActiveTab] = useState<string>(
    selectAtRestaurant ? "later" : 
    selectedFixMenu ? "fixed" : 
    selectedALaCarteItems.length > 0 ? "alacarte" : "fixed"
  );
  const [fixedMenus, setFixedMenus] = useState<FixMenuOption[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuCategories, setMenuCategories] = useState<{id: string; name: string}[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isBasketOpen, setIsBasketOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchMenuData = async () => {
      setLoading(true);
      try {
        const { data: fixedMenuData, error: fixedMenuError } = await supabase
          .from('fixed_menu_packages')
          .select('*')
          .eq('is_active', true);
        
        if (fixedMenuError) throw fixedMenuError;
        
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('menu_categories')
          .select('id, name')
          .order('display_order', { ascending: true });
          
        if (categoriesError) throw categoriesError;
        
        const { data: menuItemsData, error: menuItemsError } = await supabase
          .from('menu_items')
          .select('*')
          .eq('is_in_stock', true)
          .order('name', { ascending: true });
        
        if (menuItemsError) throw menuItemsError;
        
        console.log("Fixed menus loaded:", fixedMenuData);
        console.log("Menu categories loaded:", categoriesData);
        console.log("A La Carte items loaded:", menuItemsData);
        
        if (categoriesData && categoriesData.length > 0) {
          setMenuCategories(categoriesData);
          setSelectedCategory(categoriesData[0].id);
        }
        
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

  // Handle tab changes and set initial tab based on selections
  useEffect(() => {
    // Set the appropriate tab based on what's selected
    if (selectAtRestaurant) {
      setActiveTab("later");
    } else if (selectedFixMenu) {
      setActiveTab("fixed"); 
    } else if (selectedALaCarteItems.length > 0) {
      setActiveTab("alacarte");
    }
  }, [selectAtRestaurant, selectedFixMenu, selectedALaCarteItems]);
  
  const handleSelectFixedMenu = (menu: FixMenuOption) => {
    console.log("Fixed menu selected:", menu);
    const guestsCount = parseInt(guests) || 1;
    const menuWithQuantity: FixMenuOption = {
      ...menu,
      quantity: guestsCount
    };
    
    onFixMenuSelected(menuWithQuantity);
    onSelectAtRestaurant(false);
    
    toast({
      title: "Menü seçildi",
      description: `${menu.name} menüsünü seçtiniz.`
    });
  };
  
  const handleFixMenuQuantityChange = (increment: boolean) => {
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

  // Get filtered menu items for the current category
  const getFilteredMenuItems = () => {
    if (!selectedCategory) return menuItems;
    return menuItems.filter(item => item.category_id === selectedCategory);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold font-playfair">Menü Seçimi</h3>
        <div className="flex items-center gap-3">
          {selectedALaCarteItems.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1 border-primary/40 bg-primary/5 hover:bg-primary/10"
              onClick={() => setIsBasketOpen(true)}
            >
              <ShoppingBag className="h-4 w-4 text-primary" />
              <Badge variant="secondary" className="ml-1 bg-primary/20">{getTotalItems()}</Badge>
            </Button>
          )}
          <Badge variant="outline" className="text-sm font-medium">
            {guests} kişi
          </Badge>
        </div>
      </div>
      
      <Tabs 
        defaultValue={activeTab} 
        value={activeTab} 
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="fixed" className="flex items-center">
            <Star className="mr-2 h-4 w-4" />
            Fix Menüler
          </TabsTrigger>
          <TabsTrigger value="alacarte" className="flex items-center">
            <Utensils className="mr-2 h-4 w-4" />
            À La Carte
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
                <Card className="shadow-lg border-primary/40 overflow-hidden">
                  <CardHeader className="bg-primary/10 border-b">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-primary font-playfair">{selectedFixMenu.name}</CardTitle>
                        <CardDescription className="mt-1">{selectedFixMenu.description || 'Fix menü'}</CardDescription>
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
                        <span className="text-muted-foreground">Kişi Başı Fiyat:</span>
                        <span className="font-semibold text-primary">₺{selectedFixMenu.price.toLocaleString()}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Kişi Sayısı</Label>
                        <div className="flex items-center justify-center space-x-4">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleFixMenuQuantityChange(false)}
                            disabled={selectedFixMenu.quantity === 1}
                            className="rounded-full h-9 w-9"
                          >
                            <Minus size={16} />
                          </Button>
                          <span className="text-xl font-semibold w-10 text-center">{selectedFixMenu.quantity || 1}</span>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleFixMenuQuantityChange(true)}
                            className="rounded-full h-9 w-9"
                          >
                            <Plus size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t p-6 bg-muted/30">
                    <span className="font-medium text-muted-foreground">Toplam:</span>
                    <span className="text-xl font-bold text-primary">₺{calculateFixedMenuTotal().toLocaleString()}</span>
                  </CardFooter>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {fixedMenus.length > 0 ? (
                    fixedMenus.map((menu) => (
                      <Card 
                        key={menu.id} 
                        className={cn(
                          "border transition-all hover:shadow-lg cursor-pointer",
                          isFixMenuSelected(menu.id as string) ? "border-primary/40 shadow-lg bg-primary/5" : ""
                        )}
                        onClick={() => handleSelectFixedMenu(menu)}
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg font-playfair">{menu.name}</CardTitle>
                          <CardDescription>{menu.description || 'Fix menü paketi'}</CardDescription>
                        </CardHeader>
                        {menu.image_path && (
                          <div className="px-6 pb-2">
                            <div className="w-full h-40 rounded-md overflow-hidden">
                              <img 
                                src={menu.image_path} 
                                alt={menu.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        )}
                        <CardContent className="pb-2">
                          <div className="text-2xl font-bold text-primary">₺{menu.price.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground mt-1">kişi başı</div>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center">
                          <div className="text-sm text-muted-foreground">
                            Min. {parseInt(guests) || 1} kişilik
                          </div>
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectFixedMenu(menu);
                            }}
                            className="rounded-full px-4 bg-primary/10 hover:bg-primary/20 border-primary/30 text-primary font-medium"
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
            <>
              {/* Category tabs */}
              <div className="mb-4 border-b">
                <ScrollArea className="whitespace-nowrap pb-2">
                  <div className="flex space-x-2">
                    {menuCategories.map(category => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setSelectedCategory(category.id)}
                        className={cn(
                          "rounded-full px-4",
                          selectedCategory === category.id ? "bg-primary text-white" : "text-muted-foreground"
                        )}
                      >
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {getFilteredMenuItems().length > 0 ? (
                  <div className="divide-y">
                    {getFilteredMenuItems().map((item) => {
                      const isSelected = isItemInCart(item.id);
                      const quantity = getItemQuantity(item.id);
                      
                      return (
                        <div key={item.id} className={cn(
                          "p-4 hover:bg-muted/30 transition-colors",
                          isSelected ? "bg-primary/5" : ""
                        )}>
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <div className="font-medium text-lg">{item.name}</div>
                              {item.description && (
                                <div className="text-sm text-muted-foreground mt-1">{item.description}</div>
                              )}
                              <div className="text-primary font-semibold mt-2">₺{item.price.toLocaleString()}</div>
                            </div>
                            
                            <div className="ml-4">
                              {isSelected ? (
                                <div className="flex items-center space-x-3">
                                  <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-8 w-8 rounded-full border-primary/40"
                                    onClick={() => handleALaCarteQuantityChange(item.id, quantity - 1)}
                                  >
                                    <Minus size={14} className="text-primary" />
                                  </Button>
                                  <span className="w-5 text-center font-semibold">{quantity}</span>
                                  <Button 
                                    variant="outline" 
                                    size="icon"
                                    className="h-8 w-8 rounded-full border-primary/40"
                                    onClick={() => handleALaCarteQuantityChange(item.id, quantity + 1)}
                                  >
                                    <Plus size={14} className="text-primary" />
                                  </Button>
                                </div>
                              ) : (
                                <Button 
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleAddALaCarteItem(item)}
                                  className="rounded-full h-9 w-9 p-0 border-primary/40"
                                >
                                  <Plus size={18} className="text-primary" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Bu kategoride aktif menü öğesi bulunmamaktadır.
                  </div>
                )}
              </div>
            </>
          )}
          
          {selectedALaCarteItems.length > 0 && (
            <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8">
              <Button 
                onClick={() => setIsBasketOpen(true)}
                className="rounded-full h-12 w-12 bg-primary hover:bg-primary/90 shadow-lg flex items-center justify-center"
              >
                <ShoppingBag className="h-5 w-5" />
                <Badge variant="secondary" className="absolute -top-2 -right-2 bg-white text-primary h-6 w-6 flex items-center justify-center p-0 rounded-full">
                  {getTotalItems()}
                </Badge>
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="later" className="space-y-6">
          <Card className={cn(
            "border shadow-md transition-all", 
            selectAtRestaurant ? "border-primary bg-primary/5" : ""
          )}>
            <CardHeader className="bg-muted/50">
              <CardTitle className="flex items-center gap-2 font-playfair">
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
                  "flex items-center space-x-3 rounded-md border p-4 bg-card shadow-sm cursor-pointer",
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

      {/* Basket Sheet */}
      <Sheet open={isBasketOpen} onOpenChange={setIsBasketOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Seçilen Ürünler
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            {selectedALaCarteItems.length > 0 ? (
              <div className="space-y-6">
                <ScrollArea className="h-[calc(100vh-220px)] pr-4">
                  <div className="space-y-2">
                    {selectedALaCarteItems.map(({ item, quantity }) => (
                      <div key={item.id} className="p-3 flex justify-between items-center bg-muted/30 rounded-lg">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-primary font-semibold mt-1">₺{item.price.toLocaleString()}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-7 w-7 rounded-full border-primary/40"
                            onClick={() => handleALaCarteQuantityChange(item.id, quantity - 1)}
                          >
                            <Minus size={14} className="text-primary" />
                          </Button>
                          <span className="w-5 text-center font-semibold">{quantity}</span>
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="h-7 w-7 rounded-full border-primary/40"
                            onClick={() => handleALaCarteQuantityChange(item.id, quantity + 1)}
                          >
                            <Plus size={14} className="text-primary" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                <div className="pt-4 mt-4">
                  <Separator className="my-4" />
                  <div className="flex justify-between items-center font-medium text-lg">
                    <span>Toplam:</span>
                    <span className="text-primary text-xl font-bold">₺{calculateALaCarteTotal().toLocaleString()}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full rounded-full"
                  onClick={() => setIsBasketOpen(false)}
                >
                  Seçimi Tamamla
                </Button>
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
