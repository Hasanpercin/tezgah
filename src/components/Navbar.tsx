
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User, Menu as MenuIcon, X, Calendar, Crown } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
interface LoyaltyInfo {
  points: number;
  level: string;
}
const Navbar = () => {
  const location = useLocation();
  const {
    user,
    isLoading,
    logout
  } = useAuth();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [loyaltyInfo, setLoyaltyInfo] = useState<LoyaltyInfo | null>(null);
  const [isLoadingLoyalty, setIsLoadingLoyalty] = useState(false);
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);
  useEffect(() => {
    const fetchLoyaltyPoints = async () => {
      if (!user) return;
      setIsLoadingLoyalty(true);
      try {
        const {
          data,
          error
        } = await supabase.from('loyalty_points').select('points, level').eq('user_id', user.id).single();
        if (error) {
          console.error('Error fetching loyalty points:', error);
          return;
        }
        if (data) {
          setLoyaltyInfo({
            points: data.points,
            level: data.level
          });
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoadingLoyalty(false);
      }
    };
    fetchLoyaltyPoints();
  }, [user]);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  // Reordered menu items - moved Reservation between Menu and About
  const menuItems = [{
    path: '/',
    label: 'Anasayfa'
  }, {
    path: '/menu',
    label: 'Menü'
  }, {
    path: '/reservation',
    label: 'Rezervasyon'
  }, {
    path: '/about',
    label: 'Hakkımızda'
  }, {
    path: '/gallery',
    label: 'Galeri'
  }, {
    path: '/contact',
    label: 'İletişim'
  }];
  
  const userMenuItems = [{
    path: '/profile',
    label: 'Profil',
    icon: <User className="h-4 w-4 mr-2" />
  }, {
    path: '/my-reservations',
    label: 'Rezervasyonlarım',
    icon: <Calendar className="h-4 w-4 mr-2" />
  }, {
    path: '/loyalty',
    label: 'Sadakat Programı',
    icon: <Crown className="h-4 w-4 mr-2" />
  }];
  const isActive = (path: string) => location.pathname === path;
  return <nav className="bg-white border-b z-50 sticky top-0 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex justify-between w-full">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold">
                Tezgah<span className="text-primary">Alaçatı</span>
              </Link>
            </div>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8 items-center">
              {menuItems.map(item => <Link key={item.path} to={item.path} className={`${isActive(item.path) ? 'border-primary text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                  {item.label}
                </Link>)}
              
              <div className="ml-4 flex items-center">
                {isLoading ? <Skeleton className="h-9 w-20" /> : user ? <div className="relative group">
                    <Button variant="outline" className="flex items-center gap-2">
                      <span className="max-w-[100px] truncate">{user.user_metadata?.name || user.email}</span>
                    </Button>
                    <div className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                      <div className="px-4 py-3">
                        <p className="text-sm">Hoş geldiniz</p>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.email}
                        </p>
                        {loyaltyInfo && <div className="mt-2 flex items-center">
                            <Crown className="h-4 w-4 text-amber-500 mr-1" />
                            <span className="text-xs font-medium text-amber-700">
                              {loyaltyInfo.level}: {loyaltyInfo.points} Puan
                            </span>
                          </div>}
                      </div>
                      <div className="py-1">
                        {userMenuItems.map(item => <Link key={item.path} to={item.path} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            {item.icon}
                            {item.label}
                          </Link>)}
                      </div>
                      <div className="py-1">
                        <button onClick={logout} className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <LogOut className="h-4 w-4 mr-2" />
                          Çıkış Yap
                        </button>
                      </div>
                    </div>
                  </div> : <Button asChild>
                    <Link to="/login">
                      <LogIn className="h-4 w-4 mr-2" />
                      Giriş Yap
                    </Link>
                  </Button>}
              </div>
            </div>
            
            <div className="flex items-center sm:hidden">
              <button type="button" className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary" aria-expanded="false" onClick={toggleMenu}>
                <span className="sr-only">Open main menu</span>
                {isOpen ? <X className="block h-6 w-6" aria-hidden="true" /> : <MenuIcon className="block h-6 w-6" aria-hidden="true" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isOpen && <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {menuItems.map(item => <Link key={item.path} to={item.path} className={`${isActive(item.path) ? 'bg-primary bg-opacity-10 border-primary text-primary' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
                {item.label}
              </Link>)}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isLoading ? <div className="px-4">
                <Skeleton className="h-5 w-28 mb-3" />
                <Skeleton className="h-8 w-full" />
              </div> : user ? <div>
                <div className="px-4 py-3 space-y-1">
                  <div className="flex items-center">
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">{user.user_metadata?.name || 'Kullanıcı'}</div>
                      <div className="text-sm font-medium text-gray-500">{user.email}</div>
                      {loyaltyInfo && <div className="mt-1 flex items-center">
                          <Crown className="h-4 w-4 text-amber-500 mr-1" />
                          <span className="text-xs font-medium text-amber-700">
                            {loyaltyInfo.level}: {loyaltyInfo.points} Puan
                          </span>
                        </div>}
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  {userMenuItems.map(item => <Link key={item.path} to={item.path} className="flex items-center px-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-100">
                      {item.icon}
                      {item.label}
                    </Link>)}
                  <button onClick={logout} className="flex w-full items-center px-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-100">
                    <LogOut className="h-4 w-4 mr-2" />
                    Çıkış Yap
                  </button>
                </div>
              </div> : <div className="px-4 py-3">
                <Button asChild className="w-full">
                  <Link to="/login">
                    <LogIn className="h-4 w-4 mr-2" />
                    Giriş Yap
                  </Link>
                </Button>
              </div>}
          </div>
        </div>}
    </nav>;
};
export default Navbar;
