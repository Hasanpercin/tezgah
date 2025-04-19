
import { Utensils } from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import { getFixedMenus } from '@/services/menuService';
import { FixedMenuItem, FixedMenu } from '@/components/reservation/types/reservationTypes';
import FixedMenuList from './FixedMenuList';

interface FixedMenuSectionProps {
  selectedFixedMenus: { menu: FixedMenuItem; quantity: number }[];
  onSelectMenu: (menu: FixedMenuItem) => void;
  onRemoveMenu: (menuId: string) => void;
  onQuantityChange: (menuId: string, change: number) => void;
}

const FixedMenuSection = ({
  selectedFixedMenus,
  onSelectMenu,
  onRemoveMenu,
  onQuantityChange
}: FixedMenuSectionProps) => {
  const { data: fixedMenus, isLoading, isError } = useQuery({
    queryKey: ['fixedMenus'],
    queryFn: getFixedMenus,
  });

  // Convert the selected fixed menu items for the FixedMenuList component
  const selectedMenuId = selectedFixedMenus.length > 0 ? selectedFixedMenus[0].menu.id : null;
  const quantity = selectedFixedMenus.length > 0 ? selectedFixedMenus[0].quantity : 1;
  
  // Handle menu selection from the list
  const handleSelectMenu = (menu: FixedMenu | null) => {
    if (menu) {
      // Convert FixedMenu to FixedMenuItem for compatibility
      const menuItem: FixedMenuItem = {
        id: menu.id,
        name: menu.name,
        description: menu.description,
        price: menu.price,
        image_path: menu.image_path
      };
      onSelectMenu(menuItem);
    } else {
      // If null is passed, remove the currently selected menu
      if (selectedMenuId) {
        onRemoveMenu(selectedMenuId);
      }
    }
  };

  // Handle quantity change
  const handleChangeQuantity = (newQuantity: number) => {
    if (selectedMenuId) {
      const change = newQuantity - quantity;
      onQuantityChange(selectedMenuId, change);
    }
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center gap-2 border-b pb-4">
        <Utensils className="h-5 w-5 text-primary" />
        <h4 className="text-xl font-medium">Fix Menü Seçenekleri</h4>
      </div>
      
      <FixedMenuList
        menus={fixedMenus || []}
        selectedMenuId={selectedMenuId}
        quantity={quantity}
        guestCount={selectedFixedMenus.length > 0 ? 4 : 2} // Default guest count
        onSelectMenu={handleSelectMenu}
        onChangeQuantity={handleChangeQuantity}
      />
    </div>
  );
};

export default FixedMenuSection;
