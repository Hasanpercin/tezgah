
import { CakeSlice } from 'lucide-react';
import ALaCarteMenu from '@/components/reservation/components/ALaCarteMenu';
import { MenuItem } from '@/services/menuService';

interface ALaCarteSectionProps {
  onMenuItemsSelect: (items: MenuItem[]) => void;
  guestCount: number | string;
}

const ALaCarteSection = ({ onMenuItemsSelect, guestCount }: ALaCarteSectionProps) => {
  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center gap-2 border-b pb-4">
        <CakeSlice className="h-5 w-5 text-primary" />
        <h4 className="text-xl font-medium">A La Carte Menü</h4>
      </div>
      <ALaCarteMenu onChange={onMenuItemsSelect} guestCount={guestCount} />
    </div>
  );
};

export default ALaCarteSection;
