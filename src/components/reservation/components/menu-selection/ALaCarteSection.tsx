
import { CakeSlice } from 'lucide-react';
import ALaCarteMenu from '@/components/reservation/components/ALaCarteMenu';
import { MenuItem } from '@/services/menuService';

interface ALaCarteSectionProps {
  onMenuItemsSelect: (items: MenuItem[]) => void;
  guestCount: number | string;
}

const ALaCarteSection = ({ onMenuItemsSelect, guestCount }: ALaCarteSectionProps) => {
  const handleMenuItemsChange = (items: MenuItem[]) => {
    if (typeof onMenuItemsSelect === 'function') {
      onMenuItemsSelect(items);
    } else {
      console.error('onMenuItemsSelect is not a function:', onMenuItemsSelect);
    }
  };

  return (
    <div className="mt-4 space-y-6" data-testid="a-la-carte-section">
      <div className="flex items-center gap-2 border-b pb-4">
        <CakeSlice className="h-5 w-5 text-amber-600" />
        <h4 className="text-xl font-medium">A La Carte Menü</h4>
      </div>
      <ALaCarteMenu onChange={handleMenuItemsChange} guestCount={guestCount} />
    </div>
  );
};

export default ALaCarteSection;
