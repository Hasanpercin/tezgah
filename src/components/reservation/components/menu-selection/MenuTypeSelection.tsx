
import { ChefHat, CakeSlice, FileText } from 'lucide-react';
import SelectionCard from './SelectionCard';
import { useEffect } from 'react';

type MenuType = 'fixed_menu' | 'a_la_carte' | 'at_restaurant';

interface MenuTypeSelectionProps {
  selectedMenuTypes: MenuType[];
  onMenuTypeChange: (type: string, checked: boolean) => void;
}

const MenuTypeSelection = ({ selectedMenuTypes, onMenuTypeChange }: MenuTypeSelectionProps) => {
  // Başlangıçta bir seçenek seçili değilse restoran seçeneğini otomatik seç
  useEffect(() => {
    if (selectedMenuTypes.length === 0 && typeof onMenuTypeChange === 'function') {
      console.log('No menu type selected, defaulting to restaurant');
      onMenuTypeChange('at_restaurant', true);
    }
  }, []);

  // Menü tipi seçimini işleyen fonksiyon
  const handleMenuTypeChange = (type: string, checked: boolean) => {
    if (typeof onMenuTypeChange === 'function') {
      // At_restaurant seçilirse diğerlerini temizle
      if (type === 'at_restaurant' && checked) {
        onMenuTypeChange('fixed_menu', false);
        onMenuTypeChange('a_la_carte', false);
        onMenuTypeChange('at_restaurant', true);
      } 
      // Diğer seçenekler seçilirse at_restaurant'ı kaldır
      else if (type !== 'at_restaurant' && checked) {
        onMenuTypeChange('at_restaurant', false);
        onMenuTypeChange(type, checked);
      }
      // Seçenek kaldırıldığında ve hiç seçenek kalmazsa at_restaurant'ı seç
      else if (!checked && selectedMenuTypes.filter(t => t !== type).length === 0) {
        onMenuTypeChange('at_restaurant', true);
      }
      // Normal durumlarda seçimi değiştir
      else {
        onMenuTypeChange(type, checked);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SelectionCard
          id="fixed_menu"
          icon={<ChefHat size={24} className="text-amber-600" />}
          title="Fix Menü"
          discount="%10 İndirim"
          description="Şefimizin özel olarak hazırladığı fix menülerden seçebilirsiniz."
          isSelected={selectedMenuTypes.includes('fixed_menu')}
          onChange={(checked) => handleMenuTypeChange('fixed_menu', checked)}
        />
        
        <SelectionCard
          id="a_la_carte"
          icon={<CakeSlice size={24} className="text-amber-600" />}
          title="A La Carte"
          discount="%10 İndirim"
          description="Menümüzden dilediğiniz yemekleri seçerek kişiselleştirilmiş bir deneyim yaşayabilirsiniz."
          isSelected={selectedMenuTypes.includes('a_la_carte')}
          onChange={(checked) => handleMenuTypeChange('a_la_carte', checked)}
        />
        
        <SelectionCard
          id="at_restaurant"
          icon={<FileText size={24} className="text-amber-600" />}
          title="Restoranda Seçim"
          description="Siparişinizi restoranda vermeyi tercih edebilirsiniz. Bu durumda önden indirim uygulanmaz."
          isSelected={selectedMenuTypes.includes('at_restaurant')}
          onChange={(checked) => handleMenuTypeChange('at_restaurant', checked)}
        />
      </div>
    </div>
  );
};

export default MenuTypeSelection;
