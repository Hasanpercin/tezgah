
import { NavLink } from 'react-router-dom';
import UserMenu from './UserMenu';
import { UserType } from '@/context/AuthContext';

interface DesktopNavProps {
  isScrolled: boolean;
  linkClasses: string;
  activeLinkClasses: string;
  isAuthenticated: boolean;
  user: UserType | null;
  logout: () => void;
}

const DesktopNav = ({ 
  isScrolled, 
  linkClasses, 
  activeLinkClasses, 
  isAuthenticated, 
  user, 
  logout 
}: DesktopNavProps) => {
  return (
    <nav className="hidden lg:flex items-center space-x-8">
      <NavLink 
        to="/" 
        className={({ isActive }) => 
          isActive ? activeLinkClasses : linkClasses
        }
        end
      >
        Anasayfa
      </NavLink>
      <NavLink 
        to="/menu" 
        className={({ isActive }) => 
          isActive ? activeLinkClasses : linkClasses
        }
      >
        Menü
      </NavLink>
      <NavLink 
        to="/about" 
        className={({ isActive }) => 
          isActive ? activeLinkClasses : linkClasses
        }
      >
        Hakkımızda
      </NavLink>
      <NavLink 
        to="/gallery" 
        className={({ isActive }) => 
          isActive ? activeLinkClasses : linkClasses
        }
      >
        Galeri
      </NavLink>
      <NavLink 
        to="/contact" 
        className={({ isActive }) => 
          isActive ? activeLinkClasses : linkClasses
        }
      >
        İletişim
      </NavLink>
      
      <UserMenu 
        isAuthenticated={isAuthenticated} 
        user={user} 
        logout={logout}
        isScrolled={isScrolled}
      />
    </nav>
  );
};

export default DesktopNav;
