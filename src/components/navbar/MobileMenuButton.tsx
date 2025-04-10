
import { Menu } from 'lucide-react';

interface MobileMenuButtonProps {
  toggleMenu: () => void;
  isScrolled: boolean;
}

const MobileMenuButton = ({ toggleMenu, isScrolled }: MobileMenuButtonProps) => {
  return (
    <button 
      onClick={toggleMenu} 
      className={`lg:hidden p-2 ${isScrolled ? 'text-foreground' : 'text-white'}`}
      aria-label="Toggle menu"
    >
      <Menu size={24} />
    </button>
  );
};

export default MobileMenuButton;
