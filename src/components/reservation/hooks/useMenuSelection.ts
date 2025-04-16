
import { useState, useEffect } from 'react';
import { MenuSelectionData, FixedMenuItem } from '../types/reservationTypes';
import { MenuItem } from '@/services/menuService';

type MenuType = 'fixed_menu' | 'a_la_carte' | 'at_restaurant';

export const useMenuSelection = (
  initialValue: MenuSelectionData | undefined,
  onChange: (value: MenuSelectionData) => void,
) => {
  const [selectedMenuTypes, setSelectedMenuTypes] = useState<MenuType[]>(
    initialValue?.type ? (
      initialValue.type === 'mixed' 
        ? ['fixed_menu', 'a_la_carte'] 
        : [initialValue.type as MenuType]
    ) : ['at_restaurant']
  );
  
  const [selectedFixedMenus, setSelectedFixedMenus] = useState<{ menu: FixedMenuItem; quantity: number }[]>(
    initialValue?.selectedFixedMenus || []
  );

  // Initialize with default values if needed
  useEffect(() => {
    if (!initialValue || typeof initialValue !== 'object') {
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
    
    // Initialize menu types
    let types: MenuType[] = [];
    if (initialValue.type === 'at_restaurant') {
      types = ['at_restaurant'];
    } 
    else if (initialValue.type === 'mixed') {
      types = [];
      if (initialValue.selectedFixedMenus && initialValue.selectedFixedMenus.length > 0) {
        types.push('fixed_menu');
      }
      if (initialValue.selectedMenuItems && initialValue.selectedMenuItems.length > 0) {
        types.push('a_la_carte');
      }
      if (types.length === 0) {
        types = ['at_restaurant'];
      }
    }
    else if (initialValue.type) {
      types = [initialValue.type as MenuType];
    } else {
      types = ['at_restaurant'];
    }
    
    setSelectedMenuTypes(types);
    
    // Initialize fixed menu selections
    if (initialValue.selectedFixedMenus && initialValue.selectedFixedMenus.length > 0) {
      setSelectedFixedMenus(initialValue.selectedFixedMenus);
    } else {
      setSelectedFixedMenus([]);
    }
  }, [initialValue]);

  const handleMenuTypeChange = (type: string, checked: boolean) => {
    let newTypes = [...selectedMenuTypes];
    
    if (checked) {
      if (type === 'at_restaurant') {
        newTypes = ['at_restaurant' as MenuType];
        handleClearSelections();
      } else {
        newTypes = newTypes.filter(t => t !== 'at_restaurant');
        
        if (!newTypes.includes(type as MenuType)) {
          newTypes.push(type as MenuType);
        }
      }
    } else {
      newTypes = newTypes.filter(t => t !== type);
      
      // If no type is selected, default to restaurant option
      if (newTypes.length === 0) {
        newTypes = ['at_restaurant' as MenuType];
        handleClearSelections();
      }
    }
    
    setSelectedMenuTypes(newTypes as MenuType[]);
    
    if (typeof onChange === 'function') {
      updateParentWithCurrentSelections(newTypes as MenuType[]);
    }
  };
  
  const handleClearSelections = () => {
    setSelectedFixedMenus([]);
  };
  
  const updateParentWithCurrentSelections = (types: MenuType[]) => {
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
    
    // If fixed menu and a la carte are both selected, set as mixed
    const menuType = types.length > 1 ? 'mixed' : types[0];
    
    onChange({
      type: menuType,
      selectedFixedMenus: selectedFixedMenus,
      selectedMenuItems: initialValue?.selectedMenuItems || []
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
      const newTypes = selectedMenuTypes.includes('fixed_menu') 
        ? selectedMenuTypes 
        : [...selectedMenuTypes.filter(t => t !== 'at_restaurant'), 'fixed_menu' as MenuType];
      
      setSelectedMenuTypes(newTypes);
      updateParentWithCurrentSelections(newTypes);
    }
  };
  
  const handleFixedMenuRemove = (menuId: string) => {
    const newSelectedMenus = selectedFixedMenus.filter(item => item.menu.id !== menuId);
    setSelectedFixedMenus(newSelectedMenus);
    
    if (typeof onChange === 'function') {
      // If no fixed menu remains and a la carte is not selected, select restaurant option
      let newTypes = [...selectedMenuTypes];
      if (newSelectedMenus.length === 0 && !selectedMenuTypes.includes('a_la_carte')) {
        newTypes = ['at_restaurant' as MenuType];
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
      // Add a la carte to menu types if not already included
      let newTypes = selectedMenuTypes;
      if (!selectedMenuTypes.includes('a_la_carte')) {
        newTypes = [...selectedMenuTypes.filter(t => t !== 'at_restaurant'), 'a_la_carte' as MenuType];
        setSelectedMenuTypes(newTypes);
      }
      
      onChange({
        type: newTypes.length > 1 ? 'mixed' : 'a_la_carte',
        selectedFixedMenus: selectedFixedMenus,
        selectedMenuItems: items
      });
    }
  };

  return {
    selectedMenuTypes,
    selectedFixedMenus,
    handleMenuTypeChange,
    handleFixedMenuSelect,
    handleFixedMenuRemove,
    handleFixedMenuQuantityChange,
    handleALaCarteMenuSelect,
  };
};
