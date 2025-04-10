
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
import { Input } from "@/components/ui/input";

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
  
  // Fixed menu quantity
  const [fixedMenuQuantity, setFixedMenuQuantity] = useState<number>(
    value.selectedFixedMenu?.quantity || parseInt(guestCount) || 1
  );
  
  // Selection type
  const [selectionType, setSelectionType] = useState<'fixed_menu' | 'a_la_carte' | 'at_restaurant'>(value.type);
  
  // Filter menu items by category and create category map
  const [menuByCategory, setMenuByCategory] = useState<Record<string, ServiceMenuItem[]>>({});
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    if (menuItems && menuItems.length > 0) {
      const categorized: Record<string, ServiceMenuItem[]> = {};
      const uniqueCategories = new Set<string>();
      const categoryNames: {id: string, name: string}[] = [];
      
      menuItems.forEach(item => {
        // Handle category information safely
        let categoryId = 'uncategorized';
        let categoryName = 'Diğer';
        
        // Check if the item has category information
        if (item.category_id) {
          categoryId = item.category_id;
          
          // Try to get category name from menu_categories if available
          // Using type assertion since we know this property exists but TypeScript doesn't
          const itemAny = item as any;
          if (itemAny.menu_categories && typeof itemAny.menu_categories === 'object' && itemAny.menu_categories?.name) {
            categoryName = String(itemAny.menu_categories.name);
          }
          
          if (!uniqueCategories.has(categoryId)) {
            uniqueCategories.add(categoryId);
            categoryNames.push({
              id: categoryId,
              name: categoryName
            });
          }
        }
        
        if (!categorized[categoryId]) {
          categorized[categoryId] = [];
        }
        
        categorized[categoryId].push(item);
      });
      
      setMenuByCategory(categorized);
      setCategories(categoryNames);
    }
  }, [menuItems]);
  
  // Calculate subtotal
  const subtotal = selectedMenuItems.reduce((sum, item) => {
    return sum + (item.price * (item.quantity || 1));
  }, 0);
  
  // Fixed menu subtotal - now using the local fixedMenuQuantity state
  const fixedMenuSubtotal = selectedFixedMenu ? (selectedFixedMenu.price * fixedMenuQuantity) : 0;
  
  // Calculate total based on selection type
  const calculateTotal = () => {
    if (selectionType === 'fixed_menu' && selectedFixedMenu) {
      return fixedMenuSubtotal;
    } else if (selectionType === 'a_la_carte') {
      return subtotal;
    }
    return 0;
  };

  // Update parent component with changes when selection changes
  useEffect(() => {
    onChange({
      type: selectionType,
      selectedFixedMenu: selectionType === 'fixed_menu' && selectedFixedMenu ? {
        ...selectedFixedMenu,
        quantity: fixedMenuQuantity
      } : null,
      selectedMenuItems: selectionType === 'a_la_carte' ? selectedMenuItems : undefined
    });
  }, [selectionType, selectedFixedMenu, selectedMenuItems, fixedMenuQuantity]);
  
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

  // Handle fixed menu quantity change
  const handleFixedMenuQuantityChange = (operation: 'increase' | 'decrease') => {
    setFixedMenuQuantity(prev => {
      if (operation === 'decrease' && prev > 1) {
        return prev - 1;
      } else if (operation === 'increase') {
        return prev + 1;
      }
      return prev;
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
                  
                  <div className="mt-2 flex items-center">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleFixedMenuQuantityChange('decrease')}
                      disabled={fixedMenuQuantity <= 1}
                      className="h-8 w-8 rounded-r-none"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      value={fixedMenuQuantity}
                      onChange={(e) => setFixedMenuQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="h-8 w-16 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleFixedMenuQuantityChange('increase')}
                      className="h-8 w-8 rounded-l-none"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <span className="ml-2">adet</span>
                  </div>

                  <p className="mt-2">
                    {fixedMenuQuantity} adet × {selectedFixedMenu.price.toLocaleString('tr-TR')} ₺ = {fixedMenuSubtotal.toLocaleString('tr-TR')} ₺
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
                  {categories.length > 0 ? (
                    categories.map((category) => {
                      const categoryItems = menuByCategory[category.id] || [];
                      
                      return (
                        <div key={category.id} className="space-y-4">
                          <h4 className="font-medium text-lg border-b pb-2">
                            {category.name}
                          </h4>
                          <div className="grid grid-cols-1 gap-4">
                            {categoryItems.map((item) => (
                              <div key={item.id} className="flex justify-between items-center p-3 hover:bg-accent rounded-md transition-colors">
                                <div className="flex-1">
                                  <div className="font-medium">{item.name}</div>
                                  {item.description && (
                                    <div className="text-sm text-muted-foreground">{item.description}</div>
                                  )}
                                </div>
                                <div className="flex items-center">
                                  <div className="mr-4 font-semibold">
                                    {item.price.toLocaleString('tr-TR')} ₺
                                  </div>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => addToCart(item)}
                                    disabled={!item.is_in_stock}
                                  >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Ekle
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p>Menü kategorileri yüklenemedi.</p>
                  )}
                </div>
                
                <div>
                  <div className="bg-muted p-4 rounded-lg sticky top-4">
                    <h4 className="font-medium text-lg mb-4">Siparişiniz</h4>
                    
                    {selectedMenuItems.length === 0 ? (
                      <div className="text-center py-6 text-muted-foreground">
                        <ShoppingCart className="h-10 w-10 mx-auto mb-2 opacity-20" />
                        <p>Henüz bir ürün seçmediniz</p>
                      </div>
                    ) : (
                      <>
                        <ScrollArea className="h-[300px] pr-4">
                          <div className="space-y-3">
                            {selectedMenuItems.map((item) => (
                              <div key={item.id} className="flex justify-between items-center bg-background p-2 rounded-md">
                                <div className="flex-1">
                                  <div className="font-medium">{item.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {item.price.toLocaleString('tr-TR')} ₺
                                  </div>
                                </div>
                                
                                <div className="flex items-center">
                                  <div className="flex items-center mr-2">
                                    <Button 
                                      variant="outline" 
                                      size="icon"
                                      className="h-6 w-6 rounded-full"
                                      onClick={() => decrementOrRemove(item.id)}
                                    >
                                      <Minus className="h-3 w-3" />
                                    </Button>
                                    <span className="w-8 text-center">{item.quantity || 1}</span>
                                    <Button 
                                      variant="outline" 
                                      size="icon"
                                      className="h-6 w-6 rounded-full"
                                      onClick={() => addToCart(item)}
                                    >
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                  </div>
                                  
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-destructive"
                                    onClick={() => removeFromCart(item.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                        
                        <Separator className="my-4" />
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Toplam</span>
                            <span className="font-bold">{subtotal.toLocaleString('tr-TR')} ₺</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </RadioGroup>
    </div>
  );
};

export default MenuSelectionComponent;
