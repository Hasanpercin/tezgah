
import { ChefHat, CakeSlice, FileText } from 'lucide-react';
import SelectionCard from './SelectionCard';
import { useEffect } from 'react';

interface MenuTypeSelectionProps {
  selectedMenuTypes: ('fixed_menu' | 'a_la_carte' | 'at_restaurant')[];
  onMenuTypeChange: (type: string, checked: boolean) => void;
}

const MenuTypeSelection = ({ selectedMenuTypes, onMenuTypeChange }: MenuTypeSelectionProps) => {
  // Ensure we have a valid onMenuTypeChange function before using it
  useEffect(() => {
    if (selectedMenuTypes.length === 0 && typeof onMenuTypeChange === 'function') {
      console.log('No menu type selected, defaulting to restaurant');
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
          onChange={(checked) => {
            if (typeof onMenuTypeChange === 'function') {
              onMenuTypeChange('fixed_menu', checked);
            }
          }}
        />
        
        <SelectionCard
          id="a_la_carte"
          icon={<CakeSlice size={24} />}
          title="A La Carte"
          discount="%10 İndirim"
          description="Menümüzden dilediğiniz yemekleri seçerek kişiselleştirilmiş bir deneyim yaşayabilirsiniz."
          isSelected={selectedMenuTypes.includes('a_la_carte')}
          onChange={(checked) => {
            if (typeof onMenuTypeChange === 'function') {
              onMenuTypeChange('a_la_carte', checked);
            }
          }}
        />
        
        <SelectionCard
          id="at_restaurant"
          icon={<FileText size={24} />}
          title="Restoranda Seçim"
          description="Siparişinizi restoranda vermeyi tercih edebilirsiniz. Bu durumda önden indirim uygulanmaz."
          isSelected={selectedMenuTypes.includes('at_restaurant')}
          onChange={(checked) => {
            if (typeof onMenuTypeChange === 'function') {
              onMenuTypeChange('at_restaurant', checked);
            }
          }}
        />
      </div>
    </div>
  );
};

export default MenuTypeSelection;
