
import React, { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { getFixedMenus } from '@/services/menuService';
import { MenuSelectionData, FixedMenuItem } from './types/reservationTypes';
import { MenuItem } from '@/services/menuService';
import { useToast } from '@/hooks/use-toast';
import MenuTypeSelection from './components/menu-selection/MenuTypeSelection';
import FixedMenuSection from './components/menu-selection/FixedMenuSection';
import ALaCarteSection from './components/menu-selection/ALaCarteSection';
import RestaurantSelection from './components/menu-selection/RestaurantSelection';
import { Separator } from '@/components/ui/separator';
import { ChevronDown } from 'lucide-react';

interface MenuSelectionProps {
  value: MenuSelectionData;
  onChange: (value: MenuSelectionData) => void;
  guestCount: number | string;
}

const MenuSelection: React.FC<MenuSelectionProps> = ({ value, onChange, guestCount }) => {
  const { toast } = useToast();
  const [selectedMenuTypes, setSelectedMenuTypes] = useState<('fixed_menu' | 'a_la_carte' | 'at_restaurant')[]>(
    value?.type ? (
      value.type === 'mixed' 
        ? ['fixed_menu', 'a_la_carte'] 
        : [value.type]
    ) : ['at_restaurant']
  );
  
  const [selectedFixedMenus, setSelectedFixedMenus] = useState<{ menu: FixedMenuItem; quantity: number }[]>([]);
  
  const { isError } = useQuery({
    queryKey: ['fixedMenus'],
    queryFn: getFixedMenus,
  });
  
  // Başlangıç değerleri ayarla
  useEffect(() => {
    if (!value || typeof value !== 'object') {
      console.log('Value is not defined, initializing with defaults');
      if (typeof onChange === 'function') {
        onChange({
          type: 'at_restaurant',
          selectedFixedMenus: [],
          selectedMenuItems: []
        });
      }
      setSelectedMenuTypes(['at_restaurant']);
      setSelectedFixedMenus([]);
      return;
    }
    
    // Menü tiplerini başlat
    let types: ('fixed_menu' | 'a_la_carte' | 'at_restaurant')[] = [];
    if (value.type === 'at_restaurant') {
      types = ['at_restaurant'];
    } 
    else if (value.type === 'mixed') {
      types = [];
      if (value.selectedFixedMenus && value.selectedFixedMenus.length > 0) {
        types.push('fixed_menu');
      }
      if (value.selectedMenuItems && value.selectedMenuItems.length > 0) {
        types.push('a_la_carte');
      }
      if (types.length === 0) {
        types = ['at_restaurant'];
      }
    }
    else {
      types = [value.type];
    }
    
    setSelectedMenuTypes(types);
    
    // Fix menü seçimlerini başlat
    if (value.selectedFixedMenus && value.selectedFixedMenus.length > 0) {
      setSelectedFixedMenus(value.selectedFixedMenus);
    } else {
      setSelectedFixedMenus([]);
    }

  }, []);

  // Hata durumunu kontrol et
  useEffect(() => {
    if (isError) {
      console.error('Error fetching fixed menus');
      toast({
        title: "Menü Seçenekleri Yüklenemedi",
        description: "Menü seçeneklerini yüklerken bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive"
      });
    }
  }, [isError, toast]);

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
      
      // Eğer hiç tip seçili değilse, restoran seçeneğini varsayılan olarak ayarla
      if (newTypes.length === 0) {
        newTypes = ['at_restaurant'];
        handleClearSelections();
      }
    }
    
    console.log('Menu type change:', type, checked, 'New types:', newTypes);
    setSelectedMenuTypes(newTypes);
    
    // onChange prop'u bir fonksiyon ise updateParentWithCurrentSelections'ı çağır
    if (typeof onChange === 'function') {
      updateParentWithCurrentSelections(newTypes);
    } else {
      console.error('onChange prop is not a function:', onChange);
    }
  };
  
  const handleClearSelections = () => {
    setSelectedFixedMenus([]);
  };
  
  const updateParentWithCurrentSelections = (types: ('fixed_menu' | 'a_la_carte' | 'at_restaurant')[]) => {
    if (!onChange || typeof onChange !== 'function') {
      console.error('onChange is not a function in updateParentWithCurrentSelections');
      return;
    }
    
    if (types.includes('at_restaurant')) {
      onChange({
        type: 'at_restaurant',
        selectedFixedMenus: [],
        selectedMenuItems: []
      });
      return;
    }
    
    // Fixed menu ve a la carte birlikte seçilmişse mixed olarak ayarla
    const menuType = types.length > 1 ? 'mixed' : types[0];
    
    onChange({
      type: menuType,
      selectedFixedMenus: selectedFixedMenus,
      selectedMenuItems: value && value.selectedMenuItems ? value.selectedMenuItems : []
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
    
    if (typeof onChange === 'function') {
      const newTypes = selectedMenuTypes.includes('fixed_menu') ? selectedMenuTypes : [...selectedMenuTypes, 'fixed_menu'];
      setSelectedMenuTypes(newTypes);
      updateParentWithCurrentSelections(newTypes);
    }
  };
  
  const handleFixedMenuRemove = (menuId: string) => {
    const newSelectedMenus = selectedFixedMenus.filter(item => item.menu.id !== menuId);
    setSelectedFixedMenus(newSelectedMenus);
    
    if (typeof onChange === 'function') {
      // Eğer hiç fix menü kalmadıysa ve a la carte de seçili değilse, restoran seçeneğini seç
      let newTypes = [...selectedMenuTypes];
      if (newSelectedMenus.length === 0 && !selectedMenuTypes.includes('a_la_carte')) {
        newTypes = ['at_restaurant'];
      }
      updateParentWithCurrentSelections(newTypes);
    }
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
      
      if (typeof onChange === 'function') {
        updateParentWithCurrentSelections(selectedMenuTypes);
      }
    }
  };
  
  const handleALaCarteMenuSelect = (items: MenuItem[]) => {
    if (typeof onChange === 'function') {
      // A La Carte seçildiğinde menü tipi olarak eklenmemişse ekle
      let newTypes = selectedMenuTypes;
      if (!selectedMenuTypes.includes('a_la_carte')) {
        newTypes = [...selectedMenuTypes.filter(t => t !== 'at_restaurant'), 'a_la_carte'];
        setSelectedMenuTypes(newTypes);
      }
      
      onChange({
        type: newTypes.length > 1 ? 'mixed' : 'a_la_carte',
        selectedFixedMenus: selectedFixedMenus,
        selectedMenuItems: items
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h3 className="text-2xl font-semibold mb-2 font-playfair">Menü Seçimi</h3>
        <p className="text-muted-foreground">
          Önceden menü seçimi yaparak hem hazırlıklarımıza yardımcı olabilir hem de %10 indirim kazanabilirsiniz.
        </p>
      </div>
      
      <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-6 shadow-sm">
        <MenuTypeSelection 
          selectedMenuTypes={selectedMenuTypes} 
          onMenuTypeChange={handleMenuTypeChange} 
        />
      </div>

      {selectedMenuTypes.includes('fixed_menu') && (
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-md animate-fade-in">
          <FixedMenuSection
            selectedFixedMenus={selectedFixedMenus}
            onSelectMenu={handleFixedMenuSelect}
            onRemoveMenu={handleFixedMenuRemove}
            onQuantityChange={handleFixedMenuQuantityChange}
          />
        </div>
      )}

      {selectedMenuTypes.includes('a_la_carte') && (
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-md animate-fade-in">
          <ALaCarteSection 
            onMenuItemsSelect={handleALaCarteMenuSelect}
            guestCount={guestCount}
          />
        </div>
      )}
      
      {selectedMenuTypes.includes('at_restaurant') && (
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-md animate-fade-in">
          <RestaurantSelection />
        </div>
      )}
      
      <div className="text-center pt-4">
        <p className="text-sm text-muted-foreground">
          <span className="inline-flex items-center">
            <ChevronDown size={16} className="mr-1" />
            Lütfen bir sonraki adıma devam ederek masa rezervasyonunuzu tamamlayın
          </span>
        </p>
      </div>
    </div>
  );
};

export default MenuSelection;
