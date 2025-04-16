
import React, { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { getFixedMenus } from '@/services/menuService';
import { MenuSelectionData, FixedMenuItem } from './types/reservationTypes';
import { MenuItem } from '@/services/menuService';
import { toast } from '@/hooks/use-toast';
import MenuTypeSelection from './components/menu-selection/MenuTypeSelection';
import FixedMenuSection from './components/menu-selection/FixedMenuSection';
import ALaCarteSection from './components/menu-selection/ALaCarteSection';
import RestaurantSelection from './components/menu-selection/RestaurantSelection';

interface MenuSelectionProps {
  value: MenuSelectionData;
  onChange: (value: MenuSelectionData) => void;
  guestCount: number | string;
}

const MenuSelection: React.FC<MenuSelectionProps> = ({ value, onChange, guestCount }) => {
  const [selectedMenuTypes, setSelectedMenuTypes] = useState<('fixed_menu' | 'a_la_carte' | 'at_restaurant')[]>([]);
  const [selectedFixedMenus, setSelectedFixedMenus] = useState<{ menu: FixedMenuItem; quantity: number }[]>([]);
  
  const { isError } = useQuery({
    queryKey: ['fixedMenus'],
    queryFn: getFixedMenus,
  });
  
  useEffect(() => {
    console.log('MenuSelection mounted, fetching fixed menus...');
    console.log('Current value:', value);
    
    if (isError) {
      console.error('Error fetching fixed menus');
      toast({
        title: "Menü Seçenekleri Yüklenemedi",
        description: "Menü seçeneklerini yüklerken bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive"
      });
    }
  }, [isError]);

  useEffect(() => {
    // Initialize selectedMenuTypes based on the current value
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
    
    // If no type is selected, default to at_restaurant
    if (types.length === 0 && !value.type) {
      types.push('at_restaurant');
    }
    
    setSelectedMenuTypes(types);
    
    // Initialize selectedFixedMenus
    if (value.selectedFixedMenus && value.selectedFixedMenus.length > 0) {
      setSelectedFixedMenus(value.selectedFixedMenus.map(item => ({
        menu: item.menu,
        quantity: item.quantity || 1
      })));
    } else {
      setSelectedFixedMenus([]);
    }
    
    console.log('Initialized selectedMenuTypes:', types);
    console.log('Initialized selectedFixedMenus:', selectedFixedMenus);
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
    
    console.log('Menu type change:', type, checked, 'New types:', newTypes);
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
  
  const handleALaCarteMenuSelect = (items: MenuItem[]) => {
    onChange({
      type: selectedMenuTypes.includes('fixed_menu') ? 'mixed' : 'a_la_carte',
      selectedFixedMenus: selectedFixedMenus,
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
      
      <MenuTypeSelection 
        selectedMenuTypes={selectedMenuTypes} 
        onMenuTypeChange={handleMenuTypeChange} 
      />

      {selectedMenuTypes.includes('fixed_menu') && (
        <FixedMenuSection
          selectedFixedMenus={selectedFixedMenus}
          onSelectMenu={handleFixedMenuSelect}
          onRemoveMenu={handleFixedMenuRemove}
          onQuantityChange={handleFixedMenuQuantityChange}
        />
      )}

      {selectedMenuTypes.includes('a_la_carte') && (
        <ALaCarteSection 
          onMenuItemsSelect={handleALaCarteMenuSelect}
          guestCount={guestCount}
        />
      )}
      
      {selectedMenuTypes.includes('at_restaurant') && (
        <RestaurantSelection />
      )}
    </div>
  );
};

export default MenuSelection;
