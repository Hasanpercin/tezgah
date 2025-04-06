
import Hero from '@/components/Hero';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { User, History, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

// Rezervasyon tipi
type Reservation = {
  id: string;
  date: string;
  time: string;
  guests: string;
  status: string;
};

const Profile = () => {
  const { toast } = useToast();
  const { isAuthenticated, logout, user, profile, updateProfile, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [activeSidebar, setActiveSidebar] = useState('profile');
  const [loyaltyPoints, setLoyaltyPoints] = useState({ points: 0, level: 'Bronz' });
  const [reservations, setReservations] = useState<Reservation[]>([]);
  
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  
  // Profil bilgilerini güncelle
  useEffect(() => {
    if (profile) {
      setUserData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
      });
    }
  }, [profile]);

  // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { state: { from: '/profile' } });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Sadakat puanlarını yükle
  useEffect(() => {
    const fetchLoyaltyPoints = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('loyalty_points')
            .select('points, level')
            .eq('user_id', user.id)
            .single();

          if (error) throw error;
          
          if (data) {
            setLoyaltyPoints({
              points: data.points,
              level: data.level
            });
          }
        } catch (error) {
          console.error('Sadakat puanları yüklenirken hata:', error);
        }
      }
    };

    fetchLoyaltyPoints();
  }, [user]);

  // Rezervasyonları yükle
  useEffect(() => {
    const fetchReservations = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('reservations')
            .select('id, date, time, guests, status')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) throw error;
          
          if (data) {
            const formattedReservations = data.map(res => ({
              ...res,
              date: new Date(res.date).toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              }),
              guests: `${res.guests} Kişi`
            }));
            
            setReservations(formattedReservations);
          }
        } catch (error) {
          console.error('Rezervasyonlar yüklenirken hata:', error);
        }
      }
    };

    if (activeTab === 'reservations') {
      fetchReservations();
    }
  }, [user, activeTab]);

  const updateUserProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      const result = await updateProfile({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        address: userData.address
      });
      
      if (result.success) {
        toast({
          title: "Profil güncellendi",
          description: "Bilgileriniz başarıyla güncellendi.",
          variant: "default",
        });
      } else {
        toast({
          title: "Güncelleme başarısız",
          description: result.error || "Profil güncellenirken bir hata oluştu.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Profil güncellenirken hata:', error);
      toast({
        title: "Güncelleme başarısız",
        description: "Beklenmeyen bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    await logout();
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

  const heroImage = "/lovable-uploads/2c59c482-2fad-4bfb-b382-09d5e7c92c20.png";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // useEffect içinde yönlendirme yapılacak
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <Card>
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Profil Bilgileri</h2>
              
              <form onSubmit={updateUserProfile} className="space-y-4">
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
                    value={userData.phone || ''}
                    onChange={(e) => setUserData({...userData, phone: e.target.value})}
                  />
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium mb-1">Adres</label>
                  <Input 
                    id="address" 
                    value={userData.address || ''}
                    onChange={(e) => setUserData({...userData, address: e.target.value})}
                  />
                </div>
                
                <Button type="submit" disabled={isUpdating} className="mt-4">
                  {isUpdating ? 'Güncelleniyor...' : 'Profili Güncelle'}
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
                              : reservation.status === 'Tamamlandı'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
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
                  <p className="text-muted-foreground text-sm">{loyaltyPoints.points} Sadakat Puanı</p>
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
