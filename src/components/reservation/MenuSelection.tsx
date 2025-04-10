
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Utensils, UtensilsCrossed, ChefHat, Store, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MenuSelection as MenuSelectionType, FixMenuOption } from './types/reservationTypes';
import { MenuItem } from '@/services/menuService';
import { useToast } from "@/hooks/use-toast";
import { fetchFixedMenus } from "@/services/fixedMenuService";
import { fetchMenuItems } from "@/services/menuService";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MenuSelectionProps {
  value: MenuSelectionType;
  onChange: (selection: MenuSelectionType) => void;
  guestCount: string;
}

const MenuSelection: React.FC<MenuSelectionProps> = ({ value, onChange, guestCount }) => {
  const [activeTab, setActiveTab] = useState<string>(value.type || "fixed_menu");
  const [fixedMenus, setFixedMenus] = useState<FixMenuOption[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedFixedMenu, setSelectedFixedMenu] = useState<FixMenuOption | null>(value.selectedFixedMenu || null);
  const [selectedMenuItems, setSelectedMenuItems] = useState<MenuItem[]>(value.selectedMenuItems || []);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const loadFixedMenus = async () => {
      setLoading(true);
      try {
        const menus = await fetchFixedMenus();
        setFixedMenus(menus);
        
        const items = await fetchMenuItems();
        setMenuItems(items);
      } catch (error) {
        console.error("Error fetching menus:", error);
        toast({
          title: "Menü Yükleme Hatası",
          description: "Menüler yüklenirken bir hata oluştu.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadFixedMenus();
  }, [toast]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    if (value === "fixed_menu") {
      onChange({ type: "fixed_menu", selectedFixedMenu, selectedMenuItems: [] });
    } else if (value === "a_la_carte") {
      onChange({ type: "a_la_carte", selectedMenuItems, selectedFixedMenu: null });
    } else {
      onChange({ type: "at_restaurant", selectedMenuItems: [], selectedFixedMenu: null });
    }
  };
  
  const handleFixedMenuSelect = (menu: FixMenuOption) => {
    setSelectedFixedMenu(menu);
    onChange({ type: "fixed_menu", selectedFixedMenu: menu, selectedMenuItems: [] });
  };
  
  const handleMenuItemSelect = (item: MenuItem) => {
    const existingItemIndex = selectedMenuItems.findIndex(
      selectedItem => selectedItem.id === item.id
    );
    
    let updatedItems;
    
    if (existingItemIndex >= 0) {
      updatedItems = [...selectedMenuItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: (updatedItems[existingItemIndex].quantity || 1) + 1
      };
    } else {
      updatedItems = [...selectedMenuItems, { ...item, quantity: 1 }];
    }
    
    setSelectedMenuItems(updatedItems);
    onChange({ type: "a_la_carte", selectedMenuItems: updatedItems, selectedFixedMenu: null });
  };
  
  const handleRemoveMenuItem = (itemId: string) => {
    const updatedItems = selectedMenuItems.filter(item => item.id !== itemId);
    setSelectedMenuItems(updatedItems);
    onChange({ type: "a_la_carte", selectedMenuItems: updatedItems, selectedFixedMenu: null });
  };
  
  const handleUpdateItemQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedItems = selectedMenuItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    
    setSelectedMenuItems(updatedItems);
    onChange({ type: "a_la_carte", selectedMenuItems: updatedItems, selectedFixedMenu: null });
  };
  
  const calculateTotalPrice = () => {
    return selectedMenuItems.reduce((total, item) => {
      const quantity = item.quantity || 1;
      const price = typeof item.price === 'number' ? item.price : parseFloat(item.price || '0');
      return total + (price * quantity);
    }, 0);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Menü Seçimi</h3>
        <p className="text-muted-foreground mb-6">
          Rezervasyonunuz için menü seçiminizi yapın veya restoranımızda seçim yapmayı tercih edin.
        </p>
        
        <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="fixed_menu" className="flex items-center gap-2">
              <ChefHat className="h-4 w-4" />
              <span className="hidden md:inline">Fix Menüler</span>
              <span className="md:hidden">Fix</span>
            </TabsTrigger>
            <TabsTrigger value="a_la_carte" className="flex items-center gap-2">
              <Utensils className="h-4 w-4" />
              <span className="hidden md:inline">A La Carte</span>
              <span className="md:hidden">Kart</span>
            </TabsTrigger>
            <TabsTrigger 
              value="at_restaurant" 
              className="flex items-center gap-2"
              disabled={selectedFixedMenu !== null || selectedMenuItems.length > 0}
            >
              <Store className="h-4 w-4" />
              <span className="hidden md:inline">Restoranda Seçim</span>
              <span className="md:hidden">Restoran</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="fixed_menu">
            <div className="space-y-4">
              <h4 className="text-md font-medium">Fix Menü Seçenekleri</h4>
              
              {loading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-pulse">Menüler yükleniyor...</div>
                </div>
              ) : fixedMenus.length === 0 ? (
                <div className="text-center p-8 border rounded-md bg-muted/30">
                  <UtensilsCrossed className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="mt-2">Henüz fix menü seçeneği bulunmamaktadır.</p>
                </div>
              ) : (
                <RadioGroup 
                  value={selectedFixedMenu?.id?.toString()} 
                  onValueChange={(value) => {
                    const selected = fixedMenus.find(menu => menu.id.toString() === value);
                    if (selected) handleFixedMenuSelect(selected);
                  }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {fixedMenus.map((menu) => (
                    <div key={menu.id} className="relative">
                      <RadioGroupItem
                        value={menu.id.toString()}
                        id={`menu-${menu.id}`}
                        className="peer absolute top-4 right-4 h-5 w-5"
                      />
                      <Label
                        htmlFor={`menu-${menu.id}`}
                        className="block cursor-pointer peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary rounded-lg overflow-hidden"
                      >
                        <Card className="h-full border-none">
                          {menu.image_path && (
                            <div className="aspect-video w-full overflow-hidden">
                              <img 
                                src={menu.image_path} 
                                alt={menu.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <CardHeader>
                            <CardTitle className="flex justify-between items-start">
                              <span>{menu.name}</span>
                              <span className="text-primary font-bold">
                                {typeof menu.price === 'number' ? `${menu.price.toLocaleString('tr-TR')} ₺` : ''}
                              </span>
                            </CardTitle>
                            {menu.description && (
                              <CardDescription>{menu.description}</CardDescription>
                            )}
                          </CardHeader>
                          <CardFooter className="pt-0">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full"
                              onClick={() => handleFixedMenuSelect(menu)}
                            >
                              Seç
                            </Button>
                          </CardFooter>
                        </Card>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="a_la_carte">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <h4 className="text-md font-medium mb-4">A La Carte Menüsü</h4>
                
                {loading ? (
                  <div className="flex justify-center p-8">
                    <div className="animate-pulse">Menüler yükleniyor...</div>
                  </div>
                ) : menuItems.length === 0 ? (
                  <div className="text-center p-8 border rounded-md bg-muted/30">
                    <UtensilsCrossed className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="mt-2">Menü öğeleri bulunamadı.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {menuItems.map((item) => (
                      <Card key={item.id} className="h-full overflow-hidden">
                        {item.image_path && (
                          <div className="aspect-video w-full overflow-hidden">
                            <img 
                              src={item.image_path} 
                              alt={item.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <CardHeader>
                          <CardTitle className="flex justify-between items-start">
                            <span>{item.name}</span>
                            <span className="text-primary font-bold">
                              {typeof item.price === 'number' ? `${item.price.toLocaleString('tr-TR')} ₺` : ''}
                            </span>
                          </CardTitle>
                          {item.description && (
                            <CardDescription>{item.description}</CardDescription>
                          )}
                        </CardHeader>
                        <CardFooter>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => handleMenuItemSelect(item)}
                          >
                            Ekle
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="lg:col-span-1">
                <div className="border rounded-lg p-4 sticky top-4">
                  <h4 className="font-semibold mb-4 flex items-center justify-between">
                    <span>Seçilen Ürünler</span>
                    <Badge variant="outline" className="ml-2">
                      {selectedMenuItems.reduce((total, item) => total + (item.quantity || 1), 0)} ürün
                    </Badge>
                  </h4>
                  
                  {selectedMenuItems.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <UtensilsCrossed className="h-6 w-6 mx-auto mb-2" />
                      <p>Henüz ürün seçilmedi</p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[300px] pr-4">
                      <div className="space-y-3">
                        {selectedMenuItems.map((item) => (
                          <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-0">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <div className="flex items-center mt-1">
                                <button 
                                  onClick={() => handleUpdateItemQuantity(item.id, (item.quantity || 1) - 1)}
                                  className="w-6 h-6 flex items-center justify-center bg-muted rounded-md"
                                >
                                  -
                                </button>
                                <span className="mx-2 min-w-[20px] text-center">{item.quantity || 1}</span>
                                <button 
                                  onClick={() => handleUpdateItemQuantity(item.id, (item.quantity || 1) + 1)}
                                  className="w-6 h-6 flex items-center justify-center bg-muted rounded-md"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-primary">
                                {typeof item.price === 'number' ? 
                                  `${((item.quantity || 1) * item.price).toLocaleString('tr-TR')} ₺` : ''}
                              </p>
                              <button 
                                onClick={() => handleRemoveMenuItem(item.id)}
                                className="text-destructive text-xs mt-1 hover:underline"
                              >
                                Kaldır
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                  
                  {selectedMenuItems.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between font-semibold">
                        <span>Toplam</span>
                        <span className="text-primary">{calculateTotalPrice().toLocaleString('tr-TR')} ₺</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="at_restaurant">
            <div className="p-6 border rounded-md bg-card">
              <div className="text-center py-12">
                <Store className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h4 className="text-xl font-semibold mb-2">Restoranda Menü Seçimi</h4>
                <p className="text-muted-foreground mb-6">
                  Menü seçiminizi restoranda yapmayı tercih ediyorsanız, 
                  uzman şeflerimiz ve servis ekibimiz size yardımcı olacaktır.
                </p>
                <Button 
                  onClick={() => onChange({ type: "at_restaurant", selectedMenuItems: [], selectedFixedMenu: null })}
                  className="bg-primary/10 hover:bg-primary/20 text-primary font-medium"
                >
                  Restoranda Seçim
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {selectedFixedMenu && activeTab === "fixed_menu" && (
        <div className="p-4 bg-primary/10 rounded-lg">
          <p className="font-medium">Seçilen Menü: {selectedFixedMenu.name}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {parseInt(guestCount) > 1 ? 
              `${guestCount} kişi için toplam: ${(parseInt(guestCount) * (selectedFixedMenu.price || 0)).toLocaleString('tr-TR')} ₺` : 
              `Fiyat: ${selectedFixedMenu.price?.toLocaleString('tr-TR')} ₺`}
          </p>
        </div>
      )}
      
      {(activeTab === "fixed_menu" && !selectedFixedMenu) || 
       (activeTab === "a_la_carte" && selectedMenuItems.length === 0) ? (
        <div className="flex items-center p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-md text-yellow-700">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p className="text-sm">
            {activeTab === "fixed_menu" 
              ? "Lütfen rezervasyonunuz için bir fix menü seçin." 
              : "Lütfen en az bir menü öğesi seçin."}
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default MenuSelection;
