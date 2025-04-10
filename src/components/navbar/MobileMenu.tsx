import { Link, NavLink } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserType } from './types';

interface MobileMenuProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  isAuthenticated: boolean;
  user: UserType | null;
  logout: () => void;
}

const MobileMenu = ({ isMenuOpen, toggleMenu, isAuthenticated, user, logout }: MobileMenuProps) => {
  const mobileMenuClasses = `fixed inset-0 flex flex-col bg-black/95 z-50 p-6 space-y-6 ${
    isMenuOpen ? 'translate-x-0' : 'translate-x-full'
  } transition-transform duration-300 ease-in-out lg:hidden`;
  
  const mobileLinkClasses = "text-white/90 text-lg font-medium hover:text-white";
  const mobileActiveLinkClasses = "text-white font-semibold";

  return (
    <div className={mobileMenuClasses}>
      <div className="flex justify-end">
        <button 
          onClick={toggleMenu} 
          className="p-2 text-white" 
          aria-label="Close menu"
        >
          <X size={24} />
        </button>
      </div>
      
      <nav className="flex flex-col space-y-6 items-center pt-16">
        <NavLink 
          to="/"
          onClick={toggleMenu}
          className={({ isActive }) => 
            isActive ? mobileActiveLinkClasses : mobileLinkClasses
          }
          end
        >
          Anasayfa
        </NavLink>
        <NavLink 
          to="/menu"
          onClick={toggleMenu}
          className={({ isActive }) => 
            isActive ? mobileActiveLinkClasses : mobileLinkClasses
          }
        >
          Menü
        </NavLink>
        <NavLink 
          to="/about"
          onClick={toggleMenu}
          className={({ isActive }) => 
            isActive ? mobileActiveLinkClasses : mobileLinkClasses
          }
        >
          Hakkımızda
        </NavLink>
        <NavLink 
          to="/gallery"
          onClick={toggleMenu}
          className={({ isActive }) => 
            isActive ? mobileActiveLinkClasses : mobileLinkClasses
          }
        >
          Galeri
        </NavLink>
        <NavLink 
          to="/contact"
          onClick={toggleMenu}
          className={({ isActive }) => 
            isActive ? mobileActiveLinkClasses : mobileLinkClasses
          }
        >
          İletişim
        </NavLink>
        
        <div className="pt-4">
          {isAuthenticated ? (
            <div className="flex flex-col items-center space-y-4">
              <Link 
                to="/my-reservations" 
                className={mobileLinkClasses}
                onClick={toggleMenu}
              >
                Rezervasyonlarım
              </Link>
              <Link 
                to="/profile" 
                className={mobileLinkClasses}
                onClick={toggleMenu}
              >
                Profilim
              </Link>
              {user?.email === "admin@example.com" && (
                <Link 
                  to="/admin" 
                  className={mobileLinkClasses}
                  onClick={toggleMenu}
                >
                  Yönetim Paneli
                </Link>
              )}
              <Button 
                onClick={logout} 
                variant="destructive"
                className="mt-2"
              >
                Çıkış Yap
              </Button>
            </div>
          ) : (
            <Button asChild>
              <Link to="/login">Profil</Link>
            </Button>
          )}
        </div>
      </nav>
    </div>
  );
};

export default MobileMenu;
