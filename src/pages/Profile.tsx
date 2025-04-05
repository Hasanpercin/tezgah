import Hero from '@/components/Hero';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { User, History, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { toast } = useToast();
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [activeSidebar, setActiveSidebar] = useState('profile');
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  const [userData, setUserData] = useState({
    name: user?.name || 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    phone: '0532 123 4567',
    address: 'Atatürk Mah. Örnek Sok. No:123 İstanbul',
  });

  const reservations = [
    {
      id: '1',
      date: '23 Nisan 2025',
      time: '19:30',
      guests: '4 Kişi',
      status: 'Onaylandı'
    },
    {
      id: '2',
      date: '15 Mart 2025',
      time: '20:00',
      guests: '2 Kişi',
      status: 'Tamamlandı'
    }
  ];

  const updateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Profil güncellendi",
        description: "Bilgileriniz başarıyla güncellendi.",
        variant: "default",
      });
    }, 1500);
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Çıkış yapıldı",
      description: "Başarıyla çıkış yaptınız.",
      variant: "default",
    });
    navigate('/login');
  };

  const handleSidebarClick = (tab: string) => {
    setActiveSidebar(tab);
    setActiveTab(tab);
  };

  // New heroImage using the uploaded image
  const heroImage = "/lovable-uploads/2c59c482-2fad-4bfb-b382-09d5e7c92c20.png";

  if (!isAuthenticated) {
    return null; // Return null since useEffect will redirect
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <Card>
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Profil Bilgileri</h2>
              
              <form onSubmit={updateProfile} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Ad Soyad</label>
                  <Input 
                    id="name" 
                    value={userData.name}
                    onChange={(e) => setUserData({...userData, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">E-posta</label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={userData.email}
                    onChange={(e) => setUserData({...userData, email: e.target.value})}
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1">Telefon</label>
                  <Input 
                    id="phone" 
                    value={userData.phone}
                    onChange={(e) => setUserData({...userData, phone: e.target.value})}
                  />
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium mb-1">Adres</label>
                  <Input 
                    id="address" 
                    value={userData.address}
                    onChange={(e) => setUserData({...userData, address: e.target.value})}
                  />
                </div>
                
                <Button type="submit" disabled={isLoading} className="mt-4">
                  {isLoading ? 'Güncelleniyor...' : 'Profili Güncelle'}
                </Button>
              </form>
            </div>
          </Card>
        );
      case 'reservations':
        return (
          <Card>
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Rezervasyonlarım</h2>
              
              {reservations.length > 0 ? (
                <div className="space-y-4">
                  {reservations.map(reservation => (
                    <Card key={reservation.id} className="p-4 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{reservation.date} - {reservation.time}</p>
                          <p className="text-sm text-muted-foreground">{reservation.guests}</p>
                        </div>
                        <div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            reservation.status === 'Onaylandı' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {reservation.status}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Henüz rezervasyonunuz bulunmuyor.
                </div>
              )}
            </div>
          </Card>
        );
      case 'settings':
        return (
          <Card>
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Ayarlar</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Bildirim Tercihleri</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>E-posta bildirimleri</span>
                      <Button variant="outline" size="sm">Açık</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>SMS bildirimleri</span>
                      <Button variant="outline" size="sm">Kapalı</Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Şifre Değiştir</h3>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="current-password" className="block text-sm font-medium mb-1">Mevcut Şifre</label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div>
                      <label htmlFor="new-password" className="block text-sm font-medium mb-1">Yeni Şifre</label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div>
                      <label htmlFor="confirm-password" className="block text-sm font-medium mb-1">Yeni Şifre Tekrar</label>
                      <Input id="confirm-password" type="password" />
                    </div>
                    <Button variant="default" size="default">
                      Şifreyi Güncelle
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <Hero 
        backgroundImage={heroImage}
        title="Kullanıcı Profili"
        subtitle="Hesabınızı yönetin ve sadakat puanlarınızı görüntüleyin"
        showButtons={false}
        overlayColor="green-600/70"
      />
      
      <section className="section-padding bg-white">
        <div className="container-custom max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <Card className="p-4">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                    <User size={40} className="text-primary" />
                  </div>
                  <h3 className="font-medium text-xl">{userData.name}</h3>
                  <p className="text-muted-foreground text-sm">150 Sadakat Puanı</p>
                </div>
                
                <nav className="space-y-1">
                  <Button 
                    variant={activeSidebar === 'profile' ? 'default' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => handleSidebarClick('profile')}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profilim
                  </Button>
                  <Button 
                    variant={activeSidebar === 'reservations' ? 'default' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => handleSidebarClick('reservations')}
                  >
                    <History className="mr-2 h-4 w-4" />
                    Rezervasyonlarım
                  </Button>
                  <Button 
                    variant={activeSidebar === 'settings' ? 'default' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => handleSidebarClick('settings')}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Ayarlar
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-destructive" 
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Çıkış Yap
                  </Button>
                </nav>
              </Card>
            </div>
            
            <div className="lg:col-span-3">
              {renderContent()}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
