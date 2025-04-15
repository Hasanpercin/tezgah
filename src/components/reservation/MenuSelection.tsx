
import React, { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check } from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import { getFixedMenus, FixedMenuItem } from '@/services/menuService';
import { MenuSelectionData } from './types/reservationTypes';
import ALaCarteMenu from './components/ALaCarteMenu';

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
      ...value,
      type: 'fixed_menu',
      selectedFixedMenu: menu
    });
  };
  
  const handleALaCarteMenuSelect = (items: any) => {
    onChange({
      ...value,
      type: 'a_la_carte',
      selectedMenuItems: items
    });
  };

  const getMenuOptionClasses = (menuType: string) => {
    return `
      peer-checked:bg-accent
      peer-checked:text-accent-foreground
      relative border p-4 rounded-md cursor-pointer
      hover:bg-accent transition-colors
      ${value.type === menuType ? 'bg-accent text-accent-foreground' : ''}
    `;
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-2">Menü Seçimi</h3>
        <p className="text-muted-foreground mb-4">
          Lütfen menü tercihinizi seçiniz. Rezervasyon öncesi menü seçimi yaparak %10 indirim kazanabilirsiniz.
        </p>
        
        <RadioGroup 
          value={value.type} 
          onValueChange={handleTypeChange}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div>
            <RadioGroupItem 
              value="fixed_menu" 
              id="fixed_menu" 
              className="peer sr-only" 
            />
            <Label 
              htmlFor="fixed_menu" 
              className={getMenuOptionClasses('fixed_menu')}
            >
              <div className="flex justify-between">
                <div>
                  <div className="font-medium mb-1">Fix Menü</div>
                  <div className="text-sm text-muted-foreground">
                    %10 indirim
                  </div>
                </div>
                <Check className={value.type === 'fixed_menu' ? 'opacity-100' : 'opacity-0'} />
              </div>
              <div className="text-sm leading-relaxed mt-2">
                Fix menü seçeneklerinden birini seçebilirsiniz. Her menü, özel olarak hazırlanmış yemeklerden oluşur.
              </div>
            </Label>
          </div>
          
          <div>
            <RadioGroupItem 
              value="a_la_carte" 
              id="a_la_carte" 
              className="peer sr-only" 
            />
            <Label 
              htmlFor="a_la_carte" 
              className={getMenuOptionClasses('a_la_carte')}
            >
              <div className="flex justify-between">
                <div>
                  <div className="font-medium mb-1">A La Carte</div>
                  <div className="text-sm text-muted-foreground">
                    %10 indirim
                  </div>
                </div>
                <Check className={value.type === 'a_la_carte' ? 'opacity-100' : 'opacity-0'} />
              </div>
              <div className="text-sm leading-relaxed mt-2">
                Geniş menümüzden dilediğiniz yemekleri seçerek kendi menünüzü oluşturabilirsiniz.
              </div>
            </Label>
          </div>
          
          <div>
            <RadioGroupItem 
              value="at_restaurant" 
              id="at_restaurant" 
              className="peer sr-only" 
            />
            <Label 
              htmlFor="at_restaurant" 
              className={getMenuOptionClasses('at_restaurant')}
            >
              <div className="flex justify-between">
                <div>
                  <div className="font-medium mb-1">Restoranda Seçim</div>
                  <div className="text-sm text-muted-foreground">
                    İndirim Yok
                  </div>
                </div>
                <Check className={value.type === 'at_restaurant' ? 'opacity-100' : 'opacity-0'} />
              </div>
              <div className="text-sm leading-relaxed mt-2">
                Menü seçiminizi restorana geldiğinizde yapabilirsiniz.
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {value.type === 'fixed_menu' && (
        <div className="space-y-4">
          <h4 className="text-md font-medium">Fix Menü Seçenekleri</h4>
          
          {isLoading ? (
            <p>Menüler yükleniyor...</p>
          ) : isError ? (
            <p>Menüler yüklenirken bir hata oluştu.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fixedMenus && fixedMenus.map((menu) => (
                <div 
                  key={menu.id}
                  className={`border rounded-md p-3 cursor-pointer hover:bg-accent transition-colors ${selectedFixedMenu?.id === menu.id ? 'bg-accent text-accent-foreground' : ''}`}
                  onClick={() => handleFixedMenuSelect(menu)}
                >
                  <div className="font-medium">{menu.name}</div>
                  <div className="text-sm text-muted-foreground">{menu.description}</div>
                  <div className="mt-2 text-primary font-semibold">{menu.price} ₺</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {value.type === 'a_la_carte' && (
        <div className="space-y-4">
          <h4 className="text-md font-medium">A La Carte Menü</h4>
          <ALaCarteMenu onChange={handleALaCarteMenuSelect} guestCount={guestCount} />
        </div>
      )}
      
    </div>
  );
};

export default MenuSelection;
