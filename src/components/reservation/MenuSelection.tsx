
import React, { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check, ChefHat, CakeSlice, Utensils, FileText } from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import { getFixedMenus, FixedMenuItem } from '@/services/menuService';
import { MenuSelectionData } from './types/reservationTypes';
import ALaCarteMenu from './components/ALaCarteMenu';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MenuSelectionProps {
  value: MenuSelectionData;
  onChange: (value: MenuSelectionData) => void;
  guestCount: number | string;
}

const MenuSelection: React.FC<MenuSelectionProps> = ({ value, onChange, guestCount }) => {
  const [selectedFixedMenu, setSelectedFixedMenu] = useState<FixedMenuItem | null>(null);
  
  const { data: fixedMenus, isLoading, isError } = useQuery({
    queryKey: ['fixedMenus'],
    queryFn: getFixedMenus,
  });
  
  useEffect(() => {
    if (value.type === 'fixed_menu' && value.selectedFixedMenu) {
      setSelectedFixedMenu(value.selectedFixedMenu);
    }
  }, [value.type, value.selectedFixedMenu]);

  const handleTypeChange = (type: string) => {
    onChange({ 
      ...value,
      type: type as 'fixed_menu' | 'a_la_carte' | 'at_restaurant',
      selectedFixedMenu: null,
      selectedMenuItems: []
    });
  };
  
  const handleFixedMenuSelect = (menu: FixedMenuItem) => {
    setSelectedFixedMenu(menu);
    onChange({
      type: 'fixed_menu',
      selectedFixedMenu: menu,
      selectedMenuItems: []
    });
  };
  
  const handleALaCarteMenuSelect = (items: any) => {
    onChange({
      ...value,
      type: 'a_la_carte',
      selectedMenuItems: items
    });
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
        <RadioGroup 
          value={value.type} 
          onValueChange={handleTypeChange}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {/* Fixed Menu Option */}
          <div className="relative">
            <RadioGroupItem 
              value="fixed_menu" 
              id="fixed_menu" 
              className="peer sr-only" 
            />
            <Label 
              htmlFor="fixed_menu" 
              className={`
                h-full flex flex-col
                rounded-xl border-2 p-5
                ${value.type === 'fixed_menu' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'}
                cursor-pointer transition-all duration-200
              `}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <ChefHat size={24} />
                </div>
                {value.type === 'fixed_menu' && (
                  <span className="absolute top-3 right-3 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </span>
                )}
              </div>
              
              <div>
                <h4 className="text-lg font-medium">Fix Menü</h4>
                <p className="text-sm text-green-600 font-medium my-1">%10 İndirim</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Şefimizin özel olarak hazırladığı fix menülerden birini seçebilirsiniz.
                </p>
              </div>
            </Label>
          </div>
          
          {/* A La Carte Option */}
          <div className="relative">
            <RadioGroupItem 
              value="a_la_carte" 
              id="a_la_carte" 
              className="peer sr-only" 
            />
            <Label 
              htmlFor="a_la_carte" 
              className={`
                h-full flex flex-col
                rounded-xl border-2 p-5
                ${value.type === 'a_la_carte' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'}
                cursor-pointer transition-all duration-200
              `}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <CakeSlice size={24} />
                </div>
                {value.type === 'a_la_carte' && (
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
          
          {/* At Restaurant Option */}
          <div className="relative">
            <RadioGroupItem 
              value="at_restaurant" 
              id="at_restaurant" 
              className="peer sr-only" 
            />
            <Label 
              htmlFor="at_restaurant" 
              className={`
                h-full flex flex-col
                rounded-xl border-2 p-5
                ${value.type === 'at_restaurant' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'}
                cursor-pointer transition-all duration-200
              `}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <FileText size={24} />
                </div>
                {value.type === 'at_restaurant' && (
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
        </RadioGroup>
      </div>

      {value.type === 'fixed_menu' && (
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
            <ScrollArea className="max-h-[450px] pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fixedMenus && fixedMenus.map((menu) => (
                  <Card 
                    key={menu.id}
                    className={`overflow-hidden transition-all duration-200 cursor-pointer hover:shadow-md ${
                      selectedFixedMenu?.id === menu.id 
                        ? 'ring-2 ring-primary ring-offset-2' 
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => handleFixedMenuSelect(menu)}
                  >
                    <div className="relative">
                      {menu.image && (
                        <div 
                          className="h-40 w-full bg-cover bg-center" 
                          style={{ backgroundImage: `url(${menu.image})` }}
                        />
                      )}
                      {!menu.image && (
                        <div className="h-40 w-full bg-muted/50 flex items-center justify-center">
                          <ChefHat size={48} className="text-muted-foreground/40" />
                        </div>
                      )}
                      {selectedFixedMenu?.id === menu.id && (
                        <div className="absolute top-2 right-2 bg-primary text-white p-1 rounded-full">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    
                    <CardContent className="p-4">
                      <h5 className="text-lg font-medium mb-1">{menu.name}</h5>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{menu.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-primary">{menu.price} ₺</span>
                        <Button 
                          variant={selectedFixedMenu?.id === menu.id ? "default" : "outline"}
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFixedMenuSelect(menu);
                          }}
                        >
                          {selectedFixedMenu?.id === menu.id ? 'Seçildi' : 'Seç'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      )}

      {value.type === 'a_la_carte' && (
        <div className="mt-8 space-y-6">
          <div className="flex items-center gap-2 border-b pb-4">
            <CakeSlice className="h-5 w-5 text-primary" />
            <h4 className="text-xl font-medium">A La Carte Menü</h4>
          </div>
          <ALaCarteMenu onChange={handleALaCarteMenuSelect} guestCount={guestCount} />
        </div>
      )}
      
      {value.type === 'at_restaurant' && (
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
