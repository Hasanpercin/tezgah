
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext'; 
import DesktopNav from './navbar/DesktopNav';
import MobileMenu from './navbar/MobileMenu';
import MobileMenuButton from './navbar/MobileMenuButton';

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

  // Navbar styling based on scroll position
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

  return (
    <>
      <header className={navbarClasses}>
        <div className="container-custom mx-auto flex items-center justify-between">
          <Link to="/" className={logoClasses}>Tezgah Alaçatı</Link>
          
          <DesktopNav 
            isScrolled={isScrolled}
            linkClasses={linkClasses}
            activeLinkClasses={activeLinkClasses}
            isAuthenticated={isAuthenticated}
            user={user}
            logout={logout}
          />
          
          <MobileMenuButton 
            toggleMenu={toggleMenu}
            isScrolled={isScrolled}
          />
        </div>
      </header>
      
      <MobileMenu 
        isMenuOpen={isMenuOpen}
        toggleMenu={toggleMenu}
        isAuthenticated={isAuthenticated}
        user={user}
        logout={logout}
      />
    </>
  );
};

export default Navbar;
