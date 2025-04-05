
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Anasayfa', path: '/' },
    { name: 'Menü', path: '/menu' },
    { name: 'Rezervasyon', path: '/reservation' },
    { name: 'Hakkımızda', path: '/about' },
    { name: 'Galeri', path: '/gallery' },
    { name: 'İletişim', path: '/contact' }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-background/95 backdrop-blur-sm py-2 shadow-md' : 'bg-primary/60 backdrop-blur-sm py-4'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <h1 className="text-2xl md:text-3xl font-playfair font-bold text-secondary">
            Lezzet Durağı
          </h1>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                to={link.path}
                className={`hover-link font-medium transition-all ${
                  isActive(link.path)
                    ? 'text-secondary after:w-full'
                    : 'text-white'
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden focus:outline-none"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className="text-white" />
          ) : (
            <Menu className="text-white" />
          )}
        </button>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden fixed top-[60px] right-0 left-0 bottom-0 bg-primary/95 backdrop-blur-sm z-40">
            <ul className="flex flex-col items-center pt-8 space-y-6">
              {navLinks.map((link) => (
                <li key={link.name} className="w-full text-center">
                  <Link
                    to={link.path}
                    className={`block py-2 px-4 text-lg ${
                      isActive(link.path) ? 'text-secondary font-medium' : 'text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
