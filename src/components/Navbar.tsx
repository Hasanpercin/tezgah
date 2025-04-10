
import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext'; 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Restore original background colors and ensure text visibility
  const navbarClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isScrolled 
      ? 'bg-white shadow-md py-2' 
      : 'bg-black/50 py-4'
  }`;

  const linkClasses = `text-sm font-medium transition-colors hover:text-primary ${
    isScrolled ? 'text-foreground' : 'text-white'
  }`;
  
  const activeLinkClasses = `${linkClasses} ${
    isScrolled ? 'text-primary' : 'text-primary-foreground font-semibold'
  }`;
  
  const logoClasses = `font-playfair font-bold text-xl ${
    isScrolled ? 'text-foreground' : 'text-white'
  }`;
  
  const mobileMenuClasses = `fixed inset-0 flex flex-col bg-black/95 z-50 p-6 space-y-6 ${
    isMenuOpen ? 'translate-x-0' : 'translate-x-full'
  } transition-transform duration-300 ease-in-out lg:hidden`;
  
  const mobileLinkClasses = "text-white/90 text-lg font-medium hover:text-white";
  const mobileActiveLinkClasses = "text-white font-semibold";

  return (
    <>
      <header className={navbarClasses}>
        <div className="container-custom mx-auto flex items-center justify-between">
          <Link to="/" className={logoClasses}>Tezgah Alaçatı</Link>
          
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
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className={`${isScrolled ? 'text-foreground' : 'text-white'} p-0`}
                  >
                    {user?.email?.split('@')[0] || 'Hesabım'}
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link to="/my-reservations">Rezervasyonlarım</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profilim</Link>
                  </DropdownMenuItem>
                  {user?.email === "admin@example.com" && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">Yönetim Paneli</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={logout}>
                    Çıkış Yap
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="ghost" 
                className={`${isScrolled ? '' : 'text-white'}`} 
                asChild
              >
                <Link to="/login">Profil</Link>
              </Button>
            )}
          </nav>
          
          {/* Mobile menu button */}
          <button 
            onClick={toggleMenu} 
            className={`lg:hidden p-2 ${isScrolled ? 'text-foreground' : 'text-white'}`}
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>
      
      {/* Mobile menu */}
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
    </>
  );
};

export default Navbar;
