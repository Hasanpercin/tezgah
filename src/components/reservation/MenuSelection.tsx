
import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { getFixedMenus } from '@/services/menuService';
import { MenuSelectionData } from './types/reservationTypes';
import { useToast } from '@/hooks/use-toast';
import MenuTypeSelection from './components/menu-selection/MenuTypeSelection';
import FixedMenuSection from './components/menu-selection/FixedMenuSection';
import ALaCarteSection from './components/menu-selection/ALaCarteSection';
import RestaurantSelection from './components/menu-selection/RestaurantSelection';
import { ChevronDown } from 'lucide-react';
import { useMenuSelection } from './hooks/useMenuSelection';

interface MenuSelectionProps {
  value: MenuSelectionData;
  onChange: (value: MenuSelectionData) => void;
  guestCount: number | string;
}

const MenuSelection: React.FC<MenuSelectionProps> = ({ value, onChange, guestCount }) => {
  const { toast } = useToast();
  const {
    selectedMenuTypes,
    selectedFixedMenus,
    handleMenuTypeChange,
    handleFixedMenuSelect,
    handleFixedMenuRemove,
    handleFixedMenuQuantityChange,
    handleALaCarteMenuSelect
  } = useMenuSelection(value, onChange);
  
  const { isError } = useQuery({
    queryKey: ['fixedMenus'],
    queryFn: getFixedMenus,
  });

  // Check for error loading fixed menus
  React.useEffect(() => {
    if (isError) {
      console.error('Error fetching fixed menus');
      toast({
        title: "Menü Seçenekleri Yüklenemedi",
        description: "Menü seçeneklerini yüklerken bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive"
      });
    }
  }, [isError, toast]);

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
