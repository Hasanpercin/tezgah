
import Hero from '@/components/Hero';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Settings, History, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { toast } = useToast();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // Example user data
  const [userData, setUserData] = useState({
    name: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    phone: '0532 123 4567',
    address: 'Atatürk Mah. Örnek Sok. No:123 İstanbul',
  });

  // Example reservation history
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
    
    // Simulating API call
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

  const heroImage = "/lovable-uploads/ea00899c-1323-4ef2-b182-0836dd3edf42.png";

  if (!isAuthenticated) {
    return null; // Return null since useEffect will redirect
  }

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
            {/* Sidebar */}
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
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="mr-2 h-4 w-4" />
                    Profilim
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <History className="mr-2 h-4 w-4" />
                    Rezervasyonlarım
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    Ayarlar
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-destructive" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Çıkış Yap
                  </Button>
                </nav>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="profile">
                <TabsList className="mb-6">
                  <TabsTrigger value="profile">Profil Bilgileri</TabsTrigger>
                  <TabsTrigger value="reservations">Rezervasyonlarım</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile">
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
                </TabsContent>
                
                <TabsContent value="reservations">
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
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
