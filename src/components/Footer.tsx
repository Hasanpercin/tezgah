
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Clock } from 'lucide-react';
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
          {/* Column 1: About */}
          <div className="space-y-4">
            <h3 className="text-2xl font-playfair font-semibold">Tezgah Alaçatı</h3>
            <p className="text-sm opacity-80 max-w-xs">Eşsiz lezzetleriyle yıllardır hizmet veren Tezgah Alaçatı, geleneksel tatları modern sunumlarla buluşturuyor.</p>
            <div className="flex space-x-4 pt-2">
              <a href="#" aria-label="Facebook" className="hover:text-secondary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-secondary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-secondary transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          {/* Column 2: Contact Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-playfair font-semibold">İletişim</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <MapPin size={16} />
                <span className="text-sm">11001. Sokak No:13, Alaçatı Çeşme İzmir</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={16} />
                <span className="text-sm">+90 554 434 6068</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={16} />
                <span className="text-sm">tezgah@tezgahalacati.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <Clock size={16} />
                <span className="text-sm">Her Gün: 11:00 - 01:00</span>
              </li>
            </ul>
          </div>
          
          {/* Column 3: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-playfair font-semibold">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-secondary transition-colors">Anasayfa</Link>
              </li>
              <li>
                <Link to="/menu" className="text-sm hover:text-secondary transition-colors">Menü</Link>
              </li>
              <li>
                <Link to="/reservation" className="text-sm hover:text-secondary transition-colors">Rezervasyon</Link>
              </li>
              <li>
                <Link to="/about" className="text-sm hover:text-secondary transition-colors">Hakkımızda</Link>
              </li>
              <li>
                <Link to="/gallery" className="text-sm hover:text-secondary transition-colors">Galeri</Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm hover:text-secondary transition-colors">İletişim</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 py-6 text-center text-sm opacity-70">
          <p className="">&copy; {currentYear} Tezgah Alaçatı. Tüm Hakları Saklıdır.</p>
        </div>
      </div>
    </footer>;
};
export default Footer;
