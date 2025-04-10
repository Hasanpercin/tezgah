
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ShoppingBag, Utensils, Plus, Minus, Star, ClipboardList } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { FixMenuOption, MenuItem } from './types/reservationTypes';
import { cn } from '@/lib/utils';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
  
  // Debug logging to track state changes
  useEffect(() => {
    console.log("MenuSelection state update:", {
      activeTab,
      selectedFixMenu: selectedFixMenu?.id,
      selectedALaCarteItems: selectedALaCarteItems.length,
      selectAtRestaurant
    });
  }, [activeTab, selectedFixMenu, selectedALaCarteItems, selectAtRestaurant]);
  
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
            <ClipboardList className="mr-2 h-4 w-4" />
            Restoranda Seçim
          </TabsTrigger>
        </TabsList>
        
        {/* Fixed Menu Tab Content */}
        <TabsContent value="fixed" className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Menüler yükleniyor...</p>
            </div>
          ) : (
            <>
              {selectedFixMenu ? (
                <Card className="shadow-md border-primary/20 overflow-hidden">
                  <CardHeader className="bg-primary/5 border-b pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl font-playfair">{selectedFixMenu.name}</CardTitle>
                        <CardDescription className="mt-1">{selectedFixMenu.description || 'Fix menü'}</CardDescription>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onFixMenuSelected(null)}
                        className="rounded-full hover:bg-primary/10"
                      >
                        <Minus size={18} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Kişi Başı:</span>
                        <span className="font-semibold text-primary">₺{selectedFixMenu.price.toLocaleString()}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Kişi Sayısı</Label>
                        <div className="flex items-center justify-center space-x-4 bg-muted/30 rounded-full p-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleFixMenuQuantityChange(false)}
                            disabled={selectedFixMenu.quantity === 1}
                            className="rounded-full h-9 w-9 bg-white"
                          >
                            <Minus size={16} />
                          </Button>
                          <span className="text-xl font-semibold w-10 text-center">{selectedFixMenu.quantity || 1}</span>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleFixMenuQuantityChange(true)}
                            className="rounded-full h-9 w-9 bg-white"
                          >
                            <Plus size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t p-6 bg-muted/10">
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
                          "border transition-all hover:shadow-md cursor-pointer overflow-hidden",
                          isFixMenuSelected(menu.id as string) ? "border-primary/40 shadow-lg bg-primary/5" : "hover:border-primary/20"
                        )}
                        onClick={() => handleSelectFixedMenu(menu)}
                      >
                        {menu.image_path && (
                          <div className="h-48 overflow-hidden">
                            <img 
                              src={menu.image_path} 
                              alt={menu.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg font-playfair">{menu.name}</CardTitle>
                          <CardDescription>{menu.description || 'Fix menü paketi'}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="text-2xl font-bold text-primary">₺{menu.price.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground mt-1">kişi başı</div>
                        </CardContent>
                        <CardFooter className="border-t bg-muted/5 flex justify-between items-center pt-3">
                          <div className="text-sm text-muted-foreground">
                            Min. {parseInt(guests) || 1} kişilik
                          </div>
                          <Button 
                            variant="secondary"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectFixedMenu(menu);
                            }}
                            className="rounded-full px-4 font-medium"
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
        
        {/* A La Carte Tab Content */}
        <TabsContent value="alacarte" className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Menü öğeleri yükleniyor...</p>
            </div>
          ) : (
            <>
              {/* Category selection */}
              <div className="mb-4">
                <ScrollArea className="whitespace-nowrap pb-2">
                  <div className="flex space-x-2">
                    {menuCategories.map(category => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category.id)}
                        className={cn(
                          "rounded-full px-4",
                          selectedCategory === category.id ? "" : "border-primary/20 text-primary"
                        )}
                      >
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              
              {/* Menu items list */}
              <div className="space-y-2">
                {getFilteredMenuItems().length > 0 ? (
                  getFilteredMenuItems().map((item) => {
                    const isSelected = isItemInCart(item.id);
                    const quantity = getItemQuantity(item.id);
                    
                    return (
                      <Card 
                        key={item.id} 
                        className={cn(
                          "overflow-hidden transition-colors",
                          isSelected ? "border-primary bg-primary/5" : ""
                        )}
                      >
                        <div className="flex items-center p-4">
                          <div className="flex-1">
                            <h3 className="font-medium text-lg">{item.name}</h3>
                            {item.description && (
                              <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                            )}
                            <div className="text-primary font-semibold mt-2">₺{item.price.toLocaleString()}</div>
                          </div>
                          
                          <div className="ml-4">
                            {isSelected ? (
                              <div className="flex items-center space-x-2 bg-muted/30 rounded-full p-1">
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  className="h-8 w-8 rounded-full bg-white"
                                  onClick={() => handleALaCarteQuantityChange(item.id, quantity - 1)}
                                >
                                  <Minus size={14} />
                                </Button>
                                <span className="w-6 text-center font-semibold">{quantity}</span>
                                <Button 
                                  variant="outline" 
                                  size="icon"
                                  className="h-8 w-8 rounded-full bg-white"
                                  onClick={() => handleALaCarteQuantityChange(item.id, quantity + 1)}
                                >
                                  <Plus size={14} />
                                </Button>
                              </div>
                            ) : (
                              <Button 
                                variant="secondary"
                                size="sm"
                                onClick={() => handleAddALaCarteItem(item)}
                                className="rounded-full"
                              >
                                Ekle
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Bu kategoride aktif menü öğesi bulunmamaktadır.
                  </div>
                )}
              </div>
            </>
          )}
          
          {/* Floating basket button */}
          {selectedALaCarteItems.length > 0 && (
            <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-10">
              <Button 
                onClick={() => setIsBasketOpen(true)}
                className="rounded-full h-14 w-14 bg-primary hover:bg-primary/90 shadow-lg flex items-center justify-center"
              >
                <ShoppingBag className="h-6 w-6" />
                <Badge variant="secondary" className="absolute -top-2 -right-2 bg-white text-primary h-6 w-6 flex items-center justify-center p-0 rounded-full">
                  {getTotalItems()}
                </Badge>
              </Button>
            </div>
          )}
        </TabsContent>
        
        {/* Restaurant Selection Tab Content */}
        <TabsContent value="later" className="space-y-6">
          <Card className={cn(
            "overflow-hidden transition-all", 
            selectAtRestaurant ? "border-primary bg-primary/5" : ""
          )}>
            <CardHeader className={cn(
              "pb-4",
              selectAtRestaurant ? "border-b border-primary/20" : ""
            )}>
              <CardTitle className="flex items-center gap-2 font-playfair">
                <ClipboardList className="h-5 w-5" />
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
                <div className={cn(
                  "flex items-center space-x-3 rounded-md border p-4 bg-card shadow-sm cursor-pointer",
                  selectAtRestaurant ? "border-primary/50 bg-primary/5" : ""
                )}
                onClick={() => handleSelectAtRestaurant()}>
                  <RadioGroupItem value="yes" id="at-restaurant" checked={selectAtRestaurant} />
                  <Label htmlFor="at-restaurant" className="flex-1 cursor-pointer font-medium">
                    Menü seçimimi restoranda yapmak istiyorum
                  </Label>
                </div>
              </RadioGroup>
              
              {selectAtRestaurant && (
                <div className="mt-6 p-4 rounded-lg bg-muted/20 border border-primary/10">
                  <div className="flex items-center gap-2">
                    <Check size={20} className="text-green-600 flex-shrink-0" />
                    <p className="text-sm">Seçiminiz kaydedildi. Rezervasyonunuz onaylandığında, masanız belirtilen saatte hazır olacaktır.</p>
                  </div>
                </div>
              )}
              
              {!selectAtRestaurant && (
                <div className="bg-muted/20 p-4 rounded-md mt-6 text-sm text-muted-foreground">
                  <p className="flex items-start gap-2">
                    <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Bu seçeneği işaretlerseniz, rezervasyonunuz onaylanacak ve masanız ayrılacaktır.</span>
                  </p>
                  <p className="flex items-start gap-2 mt-2">
                    <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Menü seçiminizi restoranda yapabilirsiniz.</span>
                  </p>
                </div>
              )}
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

      {/* Shopping Cart Sheet */}
      <Sheet open={isBasketOpen} onOpenChange={setIsBasketOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Seçilen Ürünler
            </SheetTitle>
          </SheetHeader>
          
          {selectedALaCarteItems.length > 0 ? (
            <div className="mt-6 flex flex-col h-[calc(100vh-120px)]">
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-3">
                  {selectedALaCarteItems.map(({ item, quantity }) => (
                    <Card key={item.id} className="overflow-hidden">
                      <div className="p-3 flex justify-between items-center">
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-primary font-semibold mt-1">₺{item.price.toLocaleString()}</div>
                        </div>
                        <div className="flex items-center space-x-2 bg-muted/30 rounded-full p-1">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-7 w-7 rounded-full bg-white"
                            onClick={() => handleALaCarteQuantityChange(item.id, quantity - 1)}
                          >
                            <Minus size={14} />
                          </Button>
                          <span className="w-5 text-center font-semibold">{quantity}</span>
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="h-7 w-7 rounded-full bg-white"
                            onClick={() => handleALaCarteQuantityChange(item.id, quantity + 1)}
                          >
                            <Plus size={14} />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="pt-4 mt-4 border-t">
                <div className="flex justify-between items-center font-medium text-lg mb-6">
                  <span>Toplam:</span>
                  <span className="text-primary text-xl font-bold">₺{calculateALaCarteTotal().toLocaleString()}</span>
                </div>
                
                <Button 
                  className="w-full rounded-full"
                  onClick={() => setIsBasketOpen(false)}
                >
                  Seçimi Tamamla
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[50vh]">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/40 mb-4" />
              <p className="text-muted-foreground">Henüz ürün seçilmedi.</p>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MenuSelection;
