import React, { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check, ChefHat, CakeSlice, Utensils, FileText, Trash2, Plus, Minus } from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import { getFixedMenus } from '@/services/menuService';
import { MenuSelectionData, FixedMenuItem } from './types/reservationTypes';
import ALaCarteMenu from './components/ALaCarteMenu';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface MenuSelectionProps {
  value: MenuSelectionData;
  onChange: (value: MenuSelectionData) => void;
  guestCount: number | string;
}

const MenuSelection: React.FC<MenuSelectionProps> = ({ value, onChange, guestCount }) => {
  const [selectedMenuTypes, setSelectedMenuTypes] = useState<('fixed_menu' | 'a_la_carte' | 'at_restaurant')[]>([]);
  const [selectedFixedMenus, setSelectedFixedMenus] = useState<{ menu: FixedMenuItem; quantity: number }[]>([]);
  
  const { data: fixedMenus, isLoading, isError } = useQuery({
    queryKey: ['fixedMenus'],
    queryFn: getFixedMenus,
  });
  
  useEffect(() => {
    const types: ('fixed_menu' | 'a_la_carte' | 'at_restaurant')[] = [];
    if (value.type === 'at_restaurant') {
      types.push('at_restaurant');
    } else {
      if (value.selectedFixedMenus && value.selectedFixedMenus.length > 0) {
        types.push('fixed_menu');
      }
      if (value.selectedMenuItems && value.selectedMenuItems.length > 0) {
        types.push('a_la_carte');
      }
    }
    setSelectedMenuTypes(types);
    
    if (value.selectedFixedMenus && value.selectedFixedMenus.length > 0) {
      setSelectedFixedMenus(value.selectedFixedMenus.map(item => ({
        menu: item.menu,
        quantity: item.quantity || 1
      })));
    } else {
      setSelectedFixedMenus([]);
    }
  }, [value]);

  const handleMenuTypeChange = (type: string, checked: boolean) => {
    let newTypes = [...selectedMenuTypes];
    
    if (checked) {
      if (type === 'at_restaurant') {
        newTypes = ['at_restaurant'];
        handleClearSelections();
      } else {
        newTypes = newTypes.filter(t => t !== 'at_restaurant');
        
        if (!newTypes.includes(type as any)) {
          newTypes.push(type as any);
        }
      }
    } else {
      newTypes = newTypes.filter(t => t !== type);
    }
    
    setSelectedMenuTypes(newTypes);
    
    updateParentWithCurrentSelections(newTypes);
  };
  
  const handleClearSelections = () => {
    setSelectedFixedMenus([]);
  };
  
  const updateParentWithCurrentSelections = (types: ('fixed_menu' | 'a_la_carte' | 'at_restaurant')[]) => {
    if (types.includes('at_restaurant')) {
      onChange({
        type: 'at_restaurant',
        selectedFixedMenus: [],
        selectedMenuItems: []
      });
      return;
    }
    
    onChange({
      type: types.length === 0 ? 'at_restaurant' : types.length === 1 ? types[0] : 'mixed',
      selectedFixedMenus: selectedFixedMenus,
      selectedMenuItems: value.selectedMenuItems || []
    });
  };
  
  const handleFixedMenuSelect = (menu: FixedMenuItem) => {
    const existingIndex = selectedFixedMenus.findIndex(item => item.menu.id === menu.id);
    
    if (existingIndex >= 0) {
      const newSelectedMenus = [...selectedFixedMenus];
      newSelectedMenus[existingIndex].quantity += 1;
      setSelectedFixedMenus(newSelectedMenus);
    } else {
      setSelectedFixedMenus([...selectedFixedMenus, { menu, quantity: 1 }]);
    }
    
    updateParentWithCurrentSelections(selectedMenuTypes);
  };
  
  const handleFixedMenuRemove = (menuId: string) => {
    const newSelectedMenus = selectedFixedMenus.filter(item => item.menu.id !== menuId);
    setSelectedFixedMenus(newSelectedMenus);
    
    updateParentWithCurrentSelections(selectedMenuTypes);
  };
  
  const handleFixedMenuQuantityChange = (menuId: string, change: number) => {
    const newSelectedMenus = [...selectedFixedMenus];
    const index = newSelectedMenus.findIndex(item => item.menu.id === menuId);
    
    if (index >= 0) {
      const newQuantity = newSelectedMenus[index].quantity + change;
      if (newQuantity > 0) {
        newSelectedMenus[index].quantity = newQuantity;
      } else {
        newSelectedMenus.splice(index, 1);
      }
      setSelectedFixedMenus(newSelectedMenus);
      
      updateParentWithCurrentSelections(selectedMenuTypes);
    }
  };
  
  const handleALaCarteMenuSelect = (items: any) => {
    onChange({
      type: selectedMenuTypes.includes('fixed_menu') ? 'mixed' : 'a_la_carte',
      selectedFixedMenus: selectedFixedMenus,
      selectedMenuItems: items
    });
  };

  const calculateFixedMenuTotal = () => {
    return selectedFixedMenus.reduce((total, item) => {
      const price = parseFloat(String(item.menu.price)) || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h3 className="text-2xl font-semibold mb-2 font-playfair">Menü Seçimi</h3>
        <p className="text-muted-foreground">
          Önceden menü seçimi yaparak hem hazırlıklarımıza yardımcı olabilir hem de %10 indirim kazanabilirsiniz.
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <input 
              type="checkbox" 
              id="fixed_menu" 
              className="peer sr-only" 
              checked={selectedMenuTypes.includes('fixed_menu')}
              onChange={(e) => handleMenuTypeChange('fixed_menu', e.target.checked)}
            />
            <Label 
              htmlFor="fixed_menu" 
              className={`
                h-full flex flex-col
                rounded-xl border-2 p-5
                ${selectedMenuTypes.includes('fixed_menu') 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'}
                cursor-pointer transition-all duration-200
              `}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <ChefHat size={24} />
                </div>
                {selectedMenuTypes.includes('fixed_menu') && (
                  <span className="absolute top-3 right-3 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </span>
                )}
              </div>
              
              <div>
                <h4 className="text-lg font-medium">Fix Menü</h4>
                <p className="text-sm text-green-600 font-medium my-1">%10 İndirim</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Şefimizin özel olarak hazırladığı fix menülerden seçebilirsiniz.
                </p>
              </div>
            </Label>
          </div>
          
          <div className="relative">
            <input 
              type="checkbox" 
              id="a_la_carte" 
              className="peer sr-only" 
              checked={selectedMenuTypes.includes('a_la_carte')}
              onChange={(e) => handleMenuTypeChange('a_la_carte', e.target.checked)}
            />
            <Label 
              htmlFor="a_la_carte" 
              className={`
                h-full flex flex-col
                rounded-xl border-2 p-5
                ${selectedMenuTypes.includes('a_la_carte') 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'}
                cursor-pointer transition-all duration-200
              `}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <CakeSlice size={24} />
                </div>
                {selectedMenuTypes.includes('a_la_carte') && (
                  <span className="absolute top-3 right-3 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </span>
                )}
              </div>
              
              <div>
                <h4 className="text-lg font-medium">A La Carte</h4>
                <p className="text-sm text-green-600 font-medium my-1">%10 İndirim</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Menümüzden dilediğiniz yemekleri seçerek kişiselleştirilmiş bir deneyim yaşayabilirsiniz.
                </p>
              </div>
            </Label>
          </div>
          
          <div className="relative">
            <input 
              type="checkbox" 
              id="at_restaurant" 
              className="peer sr-only" 
              checked={selectedMenuTypes.includes('at_restaurant')}
              onChange={(e) => handleMenuTypeChange('at_restaurant', e.target.checked)}
            />
            <Label 
              htmlFor="at_restaurant" 
              className={`
                h-full flex flex-col
                rounded-xl border-2 p-5
                ${selectedMenuTypes.includes('at_restaurant') 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'}
                cursor-pointer transition-all duration-200
              `}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <FileText size={24} />
                </div>
                {selectedMenuTypes.includes('at_restaurant') && (
                  <span className="absolute top-3 right-3 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </span>
                )}
              </div>
              
              <div>
                <h4 className="text-lg font-medium">Restoranda Seçim</h4>
                <p className="text-sm text-muted-foreground mt-1">İndirim Uygulanmaz</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Siparişinizi restoranda vermeyi tercih edebilirsiniz. Bu durumda önden indirim uygulanmaz.
                </p>
              </div>
            </Label>
          </div>
        </div>
      </div>

      {selectedMenuTypes.includes('fixed_menu') && (
        <div className="mt-8 space-y-6">
          <div className="flex items-center gap-2 border-b pb-4">
            <Utensils className="h-5 w-5 text-primary" />
            <h4 className="text-xl font-medium">Fix Menü Seçenekleri</h4>
          </div>
          
          {isLoading ? (
            <div className="text-center p-8">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Menüler yükleniyor...</p>
            </div>
          ) : isError ? (
            <div className="text-center p-8 text-destructive">
              <p>Menüler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.</p>
            </div>
          ) : (
            <>
              {selectedFixedMenus.length > 0 && (
                <div className="mb-6 bg-muted/30 rounded-lg p-4">
                  <h5 className="font-medium text-lg mb-3">Seçilen Fix Menüler</h5>
                  <div className="space-y-3">
                    {selectedFixedMenus.map((item, index) => (
                      <div key={`${item.menu.id}-${index}`} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                        <div className="flex-1">
                          <p className="font-medium">{item.menu.name}</p>
                          <p className="text-sm text-muted-foreground">{item.menu.price} ₺ × {item.quantity}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8" 
                            onClick={() => handleFixedMenuQuantityChange(item.menu.id, -1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8" 
                            onClick={() => handleFixedMenuQuantityChange(item.menu.id, 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:text-destructive" 
                            onClick={() => handleFixedMenuRemove(item.menu.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-end pt-3 font-semibold">
                      <span>Toplam: {calculateFixedMenuTotal().toFixed(2)} ₺</span>
                    </div>
                  </div>
                </div>
              )}
              
              <ScrollArea className="max-h-[450px] pr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fixedMenus && fixedMenus.map((menu) => (
                    <Card 
                      key={menu.id}
                      className={`overflow-hidden transition-all duration-200 cursor-pointer hover:shadow-md ${
                        selectedFixedMenus.some(item => item.menu.id === menu.id)
                          ? 'ring-2 ring-primary ring-offset-2' 
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => handleFixedMenuSelect(menu)}
                    >
                      <div className="relative">
                        {menu.image_path && (
                          <div 
                            className="h-40 w-full bg-cover bg-center" 
                            style={{ backgroundImage: `url(${menu.image_path})` }}
                          />
                        )}
                        {!menu.image_path && (
                          <div className="h-40 w-full bg-muted/50 flex items-center justify-center">
                            <ChefHat size={48} className="text-muted-foreground/40" />
                          </div>
                        )}
                        {selectedFixedMenus.some(item => item.menu.id === menu.id) && (
                          <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-full text-xs font-medium">
                            {selectedFixedMenus.find(item => item.menu.id === menu.id)?.quantity || 0} adet
                          </div>
                        )}
                      </div>
                      
                      <CardContent className="p-4">
                        <h5 className="text-lg font-medium mb-1">{menu.name}</h5>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{menu.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-primary">{menu.price} ₺</span>
                          <Button 
                            variant={selectedFixedMenus.some(item => item.menu.id === menu.id) ? "default" : "outline"}
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFixedMenuSelect(menu);
                            }}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            {selectedFixedMenus.some(item => item.menu.id === menu.id) ? 'Ekle' : 'Seç'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </>
          )}
        </div>
      )}

      {selectedMenuTypes.includes('a_la_carte') && (
        <div className="mt-8 space-y-6">
          <div className="flex items-center gap-2 border-b pb-4">
            <CakeSlice className="h-5 w-5 text-primary" />
            <h4 className="text-xl font-medium">A La Carte Menü</h4>
          </div>
          <ALaCarteMenu onChange={handleALaCarteMenuSelect} guestCount={guestCount} />
        </div>
      )}
      
      {selectedMenuTypes.includes('at_restaurant') && (
        <div className="mt-8 p-6 bg-muted/30 rounded-xl text-center max-w-3xl mx-auto">
          <FileText className="h-12 w-12 mx-auto text-primary/60 mb-4" />
          <h4 className="text-xl font-medium mb-3">Menü Seçiminizi Restoranda Yapacaksınız</h4>
          <p className="text-muted-foreground mb-4">
            Rezervasyonunuz onaylandı. Menü seçiminizi restoranımıza geldiğinizde yapabilirsiniz. 
            Şefimiz ve ekibimiz size özel bir deneyim için hazır olacak.
          </p>
          <p className="text-sm text-amber-600">
            Not: Önceden menü seçimi yapmazsanız %10 indirim hakkınızı kullanamayacaksınız.
          </p>
        </div>
      )}
    </div>
  );
};

export default MenuSelection;
