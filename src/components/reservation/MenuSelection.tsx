import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Trash2, Plus, Minus, UtensilsCrossed, Menu, ShoppingCart } from "lucide-react";
import { fetchFixedMenus } from "@/services/fixedMenuService";
import { fetchMenuItems } from "@/services/menuService";
import { MenuSelection, MenuItem as ReservationMenuItem } from './types/reservationTypes';
import { FixedMenuPackage } from '@/services/fixedMenuService';
import { MenuItem as ServiceMenuItem } from '@/services/menuService';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";

interface MenuSelectionProps {
  value: MenuSelection;
  onChange: (value: MenuSelection) => void;
  guestCount: string;
}

const MenuSelectionComponent: React.FC<MenuSelectionProps> = ({ value, onChange, guestCount }) => {
  // Fetch fixed menus
  const { data: fixedMenus = [], isLoading: isLoadingFixedMenus } = useQuery({
    queryKey: ['fixedMenus'],
    queryFn: fetchFixedMenus
  });
  
  // Fetch menu items
  const { data: menuItems = [], isLoading: isLoadingMenuItems } = useQuery({
    queryKey: ['menuItems'],
    queryFn: fetchMenuItems
  });
  
  // Local state for selected menu items - convert from service type to reservation type if needed
  const [selectedMenuItems, setSelectedMenuItems] = useState<ReservationMenuItem[]>(
    value.selectedMenuItems || []
  );
  
  // Selected fixed menu
  const [selectedFixedMenu, setSelectedFixedMenu] = useState<FixedMenuPackage | null>(
    value.selectedFixedMenu ? fixedMenus.find(menu => menu.id === value.selectedFixedMenu?.id) || null : null
  );
  
  // Selection type
  const [selectionType, setSelectionType] = useState<'fixed_menu' | 'a_la_carte' | 'at_restaurant'>(value.type);
  
  // Filter menu items by category
  const menuByCategory = menuItems.reduce((acc, item) => {
    if (!acc[item.category_id]) {
      acc[item.category_id] = [];
    }
    acc[item.category_id].push(item);
    return acc;
  }, {} as Record<string, ServiceMenuItem[]>);
  
  // Calculate subtotal
  const subtotal = selectedMenuItems.reduce((sum, item) => {
    return sum + (item.price * (item.quantity || 1));
  }, 0);
  
  // Fixed menu subtotal
  const fixedMenuSubtotal = selectedFixedMenu ? (selectedFixedMenu.price * parseInt(guestCount || "1")) : 0;
  
  // Calculate total based on selection type
  const calculateTotal = () => {
    if (selectionType === 'fixed_menu' && selectedFixedMenu) {
      return fixedMenuSubtotal;
    } else if (selectionType === 'a_la_carte') {
      return subtotal;
    }
    return 0;
  };
  
  // Update parent component with changes
  useEffect(() => {
    onChange({
      type: selectionType,
      selectedFixedMenu: selectionType === 'fixed_menu' ? selectedFixedMenu : null,
      selectedMenuItems: selectionType === 'a_la_carte' ? selectedMenuItems : undefined
    });
  }, [selectionType, selectedFixedMenu, selectedMenuItems, onChange]);

  // Set selection type to 'at_restaurant' if all cart items are removed
  useEffect(() => {
    if (selectionType === 'a_la_carte' && selectedMenuItems.length === 0) {
      setSelectionType('at_restaurant');
    }
  }, [selectedMenuItems, selectionType]);
  
  // Handle changing selection type
  const handleSelectionTypeChange = (type: 'fixed_menu' | 'a_la_carte' | 'at_restaurant') => {
    setSelectionType(type);
  };
  
  // Handle selecting fixed menu
  const handleFixedMenuSelect = (menu: FixedMenuPackage) => {
    setSelectedFixedMenu(menu);
    setSelectionType('fixed_menu');
  };
  
  // Handle canceling fixed menu selection
  const handleCancelFixedMenu = () => {
    setSelectedFixedMenu(null);
    setSelectionType('at_restaurant');
    
    toast({
      title: "Sabit Menü İptal Edildi",
      description: "Sabit menü seçiminiz iptal edildi.",
    });
  };
  
  // Add item to cart - convert from service type to reservation type
  const addToCart = (item: ServiceMenuItem) => {
    // Convert service menu item to reservation menu item type
    const reservationItem: ReservationMenuItem = {
      ...item,
      quantity: 1
    };
    
    const existingItem = selectedMenuItems.find(i => i.id === item.id);
    
    if (existingItem) {
      // Increment quantity
      const updatedItems = selectedMenuItems.map(i => 
        i.id === item.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i
      );
      setSelectedMenuItems(updatedItems);
    } else {
      // Add new item
      setSelectedMenuItems([...selectedMenuItems, reservationItem]);
    }
    
    if (selectionType !== 'a_la_carte') {
      setSelectionType('a_la_carte');
    }
    
    toast({
      title: "Sepete Eklendi",
      description: `${item.name} sepete eklendi.`,
    });
  };
  
  // Decrement quantity or remove item
  const decrementOrRemove = (itemId: string) => {
    const item = selectedMenuItems.find(i => i.id === itemId);
    
    if (item && (item.quantity || 1) > 1) {
      // Decrement quantity
      const updatedItems = selectedMenuItems.map(i => 
        i.id === itemId ? { ...i, quantity: (i.quantity || 1) - 1 } : i
      );
      setSelectedMenuItems(updatedItems);
    } else {
      // Remove item
      setSelectedMenuItems(selectedMenuItems.filter(i => i.id !== itemId));
    }
  };
  
  // Remove item from cart
  const removeFromCart = (itemId: string) => {
    setSelectedMenuItems(selectedMenuItems.filter(i => i.id !== itemId));
  };
  
  // Loading state
  if (isLoadingFixedMenus || isLoadingMenuItems) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-semibold">Menü Seçimi</h3>
      
      <RadioGroup 
        value={selectionType} 
        onValueChange={(v) => handleSelectionTypeChange(v as 'fixed_menu' | 'a_la_carte' | 'at_restaurant')}
        className="space-y-4"
      >
        <div className={`border p-4 rounded-lg transition-all ${selectionType === 'at_restaurant' ? 'bg-primary/5 border-primary' : 'hover:bg-accent'}`}>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="at_restaurant" id="at_restaurant" />
            <Label htmlFor="at_restaurant" className="font-medium flex items-center">
              <UtensilsCrossed className="h-4 w-4 mr-2" />
              Restoranda Seçim Yapacağım
            </Label>
          </div>
          {selectionType === 'at_restaurant' && (
            <p className="mt-2 text-sm text-muted-foreground ml-7">
              Menü seçimini rezervasyonunuza geldiğinizde yapabilirsiniz.
            </p>
          )}
        </div>
        
        <div className={`border p-4 rounded-lg transition-all ${selectionType === 'fixed_menu' ? 'bg-primary/5 border-primary' : 'hover:bg-accent'}`}>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="fixed_menu" id="fixed_menu" />
            <Label htmlFor="fixed_menu" className="font-medium flex items-center">
              <Menu className="h-4 w-4 mr-2" />
              Sabit Menü Seçimi
            </Label>
          </div>
          
          {selectionType === 'fixed_menu' && (
            <div className="mt-4 space-y-4 ml-7">
              {fixedMenus.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fixedMenus.map((menu) => (
                    <Card 
                      key={menu.id}
                      className={`cursor-pointer transition-all ${selectedFixedMenu?.id === menu.id ? 'ring-2 ring-primary' : 'hover:bg-accent'}`}
                      onClick={() => handleFixedMenuSelect(menu)}
                    >
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg">{menu.name}</CardTitle>
                        <CardDescription>{menu.description}</CardDescription>
                      </CardHeader>
                      <CardFooter className="p-4 pt-0 flex justify-between">
                        <p className="font-semibold">{menu.price.toLocaleString('tr-TR')} ₺</p>
                        {selectedFixedMenu?.id === menu.id && (
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelFixedMenu();
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> İptal
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <p>Sabit menü seçeneği bulunmuyor.</p>
              )}
              
              {selectedFixedMenu && (
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <p className="font-medium">Seçilen Menü: {selectedFixedMenu.name}</p>
                  <p className="mt-2">
                    {guestCount} kişi × {selectedFixedMenu.price.toLocaleString('tr-TR')} ₺ = {fixedMenuSubtotal.toLocaleString('tr-TR')} ₺
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className={`border p-4 rounded-lg transition-all ${selectionType === 'a_la_carte' ? 'bg-primary/5 border-primary' : 'hover:bg-accent'}`}>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="a_la_carte" id="a_la_carte" />
            <Label htmlFor="a_la_carte" className="font-medium flex items-center">
              <ShoppingCart className="h-4 w-4 mr-2" />
              A La Carte Menü
            </Label>
          </div>
          
          {selectionType === 'a_la_carte' && (
            <div className="mt-4 ml-7">
              <div className="grid md:grid-cols-[1fr_300px] gap-6">
                <div className="space-y-8">
                  {Object.keys(menuByCategory).length > 0 ? (
                    Object.keys(menuByCategory).map((categoryId) => {
                      const firstItem = menuByCategory[categoryId][0];
                      const categoryName = firstItem && 
                        'menu_categories' in firstItem && 
                        firstItem.menu_categories ? 
                        firstItem.menu_categories.name : 'Kategori';
                      
                      return (
                        <div key={categoryId} className="space-y-4">
                          <h4 className="font-medium text-lg border-b pb-2">
                            {categoryName}
                          </h4>
                          <div className="grid grid-cols-1 gap-4">
                            {menuByCategory[categoryId].map((item) => (
                              <div key={item.id} className="flex justify-between items-center p-3 hover:bg-accent rounded-md transition-colors">
                                <div className="flex-1">
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                                  <p className="mt-1 font-semibold">{item.price.toLocaleString('tr-TR')} ₺</p>
                                  <div className="flex gap-2 mt-1">
                                    {item.is_vegetarian && <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">Vejetaryen</Badge>}
                                    {item.is_vegan && <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">Vegan</Badge>}
                                    {item.is_gluten_free && <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-100">Glutensiz</Badge>}
                                    {item.is_spicy && <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-100">Acılı</Badge>}
                                  </div>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => addToCart(item)}
                                  className="ml-2 h-8 w-8 rounded-full"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p>Menü öğeleri bulunamadı.</p>
                  )}
                </div>
                
                <div className="bg-card border rounded-lg p-4 h-fit sticky top-4">
                  <h4 className="font-medium border-b pb-2 mb-4 flex items-center">
                    <ShoppingCart className="h-4 w-4 mr-2" /> Sipariş Özeti
                  </h4>
                  
                  {selectedMenuItems.length > 0 ? (
                    <div className="space-y-4">
                      <ScrollArea className="max-h-80">
                        <div className="space-y-3">
                          {selectedMenuItems.map((item) => (
                            <div key={item.id} className="flex justify-between items-center border-b pb-2">
                              <div className="flex-1">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {item.quantity || 1} × {item.price.toLocaleString('tr-TR')} ₺
                                </p>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => decrementOrRemove(item.id)}
                                  className="h-7 w-7"
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                
                                <span className="w-6 text-center">{item.quantity || 1}</span>
                                
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => addToCart(item as any)}
                                  className="h-7 w-7"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                                
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => removeFromCart(item.id)}
                                  className="h-7 w-7 text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                      
                      <Separator />
                      
                      <div className="flex justify-between font-medium">
                        <span>Toplam:</span>
                        <span>{subtotal.toLocaleString('tr-TR')} ₺</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <ShoppingCart className="h-10 w-10 mx-auto mb-2 opacity-20" />
                      <p>Sepetiniz boş</p>
                      <p className="text-sm mt-2">Sipariş vermek için menüden ürün ekleyebilirsiniz.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </RadioGroup>
      
      <div className="mt-8 p-4 border rounded-lg bg-muted">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">Toplam Tutar</p>
            <p className="text-xl font-semibold">{calculateTotal().toLocaleString('tr-TR')} ₺</p>
          </div>
          
          {selectionType !== 'at_restaurant' && (
            <div>
              {selectionType === 'fixed_menu' && selectedFixedMenu && (
                <p className="text-sm text-muted-foreground">
                  {guestCount} kişi × {selectedFixedMenu.price.toLocaleString('tr-TR')} ₺
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuSelectionComponent;
