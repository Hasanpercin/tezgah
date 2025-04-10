
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Utensils, UtensilsCrossed, ChefHat, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MenuSelection as MenuSelectionType, FixMenuOption } from './types/reservationTypes';
import { useToast } from "@/hooks/use-toast";
import { fetchFixedMenus } from "@/services/fixedMenuService";

interface MenuSelectionProps {
  value: MenuSelectionType;
  onChange: (selection: MenuSelectionType) => void;
  guestCount: string;
}

const MenuSelection: React.FC<MenuSelectionProps> = ({ value, onChange, guestCount }) => {
  const [activeTab, setActiveTab] = useState<string>(value.type || "fixed_menu");
  const [fixedMenus, setFixedMenus] = useState<FixMenuOption[]>([]);
  const [selectedFixedMenu, setSelectedFixedMenu] = useState<FixMenuOption | null>(value.selectedFixedMenu || null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const loadFixedMenus = async () => {
      setLoading(true);
      try {
        const menus = await fetchFixedMenus();
        setFixedMenus(menus);
      } catch (error) {
        console.error("Error fetching fixed menus:", error);
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
    
    // Reset selections when changing tabs
    if (value === "fixed_menu") {
      onChange({ type: "fixed_menu", selectedFixedMenu });
    } else if (value === "a_la_carte") {
      onChange({ type: "a_la_carte", selectedMenuItems: [] });
    } else {
      onChange({ type: "at_restaurant" });
    }
  };
  
  const handleFixedMenuSelect = (menu: FixMenuOption) => {
    setSelectedFixedMenu(menu);
    onChange({ type: "fixed_menu", selectedFixedMenu: menu });
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
            <TabsTrigger value="at_restaurant" className="flex items-center gap-2">
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
            <div className="p-6 border rounded-md bg-card">
              <div className="text-center py-12">
                <Utensils className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h4 className="text-xl font-semibold mb-2">A La Carte Menüsü</h4>
                <p className="text-muted-foreground mb-6">
                  A La Carte menümüz için rezervasyon yapıyorsunuz. 
                  Yemek seçimlerinizi restoranda detaylı inceleyebilirsiniz.
                </p>
                <Button 
                  onClick={() => onChange({ type: "a_la_carte" })}
                  className="bg-primary/10 hover:bg-primary/20 text-primary font-medium"
                >
                  A La Carte Rezervasyon
                </Button>
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
                  onClick={() => onChange({ type: "at_restaurant" })}
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
    </div>
  );
};

export default MenuSelection;
