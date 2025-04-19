
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserType } from './types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface UserMenuProps {
  isAuthenticated: boolean;
  user: UserType | null;
  logout: () => void;
  isScrolled: boolean;
}

const UserMenu = ({ isAuthenticated, user, logout, isScrolled }: UserMenuProps) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    // localStorage'dan admin durumunu kontrol et ve değişiklikleri izle
    const checkAdminStatus = () => {
      const adminStatus = localStorage.getItem('isAdmin') === 'true';
      setIsAdmin(adminStatus);
    };

    checkAdminStatus();
    
    // localStorage değişikliklerini dinle
    window.addEventListener('storage', checkAdminStatus);
    
    return () => {
      window.removeEventListener('storage', checkAdminStatus);
    };
  }, []);

  const handleLogout = () => {
    // Admin çıkış yaparken localStorage'dan admin durumunu temizle
    localStorage.removeItem('isAdmin');
    logout();
  };

  if (isAuthenticated) {
    return (
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
          {isAdmin && (
            <DropdownMenuItem asChild>
              <Link to="/admin">Yönetim Paneli</Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={handleLogout}>
            Çıkış Yap
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button 
      variant="ghost" 
      className={`${isScrolled ? '' : 'text-white'}`} 
      asChild
    >
      <Link to="/login">Profil</Link>
    </Button>
  );
};

export default UserMenu;

