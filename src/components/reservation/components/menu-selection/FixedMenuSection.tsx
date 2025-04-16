
import { Utensils } from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import { getFixedMenus } from '@/services/menuService';
import { FixedMenuItem } from '@/components/reservation/types/reservationTypes';
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

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center gap-2 border-b pb-4">
        <Utensils className="h-5 w-5 text-primary" />
        <h4 className="text-xl font-medium">Fix Menü Seçenekleri</h4>
      </div>
      
      <FixedMenuList
        fixedMenus={fixedMenus || null}
        selectedFixedMenus={selectedFixedMenus}
        onSelectMenu={onSelectMenu}
        onRemoveMenu={onRemoveMenu}
        onQuantityChange={onQuantityChange}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
};

export default FixedMenuSection;
