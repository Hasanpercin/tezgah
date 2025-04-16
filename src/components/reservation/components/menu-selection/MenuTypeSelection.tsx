
import { ChefHat, CakeSlice, FileText } from 'lucide-react';
import SelectionCard from './SelectionCard';
import { useEffect } from 'react';

interface MenuTypeSelectionProps {
  selectedMenuTypes: ('fixed_menu' | 'a_la_carte' | 'at_restaurant')[];
  onMenuTypeChange: (type: string, checked: boolean) => void;
}

const MenuTypeSelection = ({ selectedMenuTypes, onMenuTypeChange }: MenuTypeSelectionProps) => {
  // Eğer hiç bir seçenek seçilmemişse, varsayılan olarak restoranda seçimi aktif et
  useEffect(() => {
    if (selectedMenuTypes.length === 0) {
      onMenuTypeChange('at_restaurant', true);
    }
  }, [selectedMenuTypes.length, onMenuTypeChange]);

  return (
    <div className="grid grid-cols-1 gap-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SelectionCard
          id="fixed_menu"
          icon={<ChefHat size={24} />}
          title="Fix Menü"
          discount="%10 İndirim"
          description="Şefimizin özel olarak hazırladığı fix menülerden seçebilirsiniz."
          isSelected={selectedMenuTypes.includes('fixed_menu')}
          onChange={(checked) => onMenuTypeChange('fixed_menu', checked)}
        />
        
        <SelectionCard
          id="a_la_carte"
          icon={<CakeSlice size={24} />}
          title="A La Carte"
          discount="%10 İndirim"
          description="Menümüzden dilediğiniz yemekleri seçerek kişiselleştirilmiş bir deneyim yaşayabilirsiniz."
          isSelected={selectedMenuTypes.includes('a_la_carte')}
          onChange={(checked) => onMenuTypeChange('a_la_carte', checked)}
        />
        
        <SelectionCard
          id="at_restaurant"
          icon={<FileText size={24} />}
          title="Restoranda Seçim"
          description="Siparişinizi restoranda vermeyi tercih edebilirsiniz. Bu durumda önden indirim uygulanmaz."
          isSelected={selectedMenuTypes.includes('at_restaurant')}
          onChange={(checked) => onMenuTypeChange('at_restaurant', checked)}
        />
      </div>
    </div>
  );
};

export default MenuTypeSelection;
