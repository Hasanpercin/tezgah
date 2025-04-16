import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { User, Settings, Award, LogOut } from 'lucide-react';

const Profile = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [loyaltyLevel, setLoyaltyLevel] = useState('');
  
  // Grab user profile data on load
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        try {
          // Get profile info
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (error) throw error;
          
          if (profileData) {
            setProfile({
              name: profileData.name || '',
              email: profileData.email || '',
              phone: profileData.phone || '',
              address: profileData.address || ''
            });
          }
          
          // Get loyalty info
          const { data: loyaltyData, error: loyaltyError } = await supabase
            .from('loyalty_points')
            .select('points, level')
            .eq('user_id', user.id)
            .single();
            
          if (loyaltyError) throw loyaltyError;
          
          if (loyaltyData) {
            setLoyaltyPoints(loyaltyData.points);
            setLoyaltyLevel(loyaltyData.level);
          }
          
        } catch (error) {
          console.error('Error loading profile:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadProfile();
  }, [user]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value
    });
  };
  
  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          address: profile.address,
          updated_at: new Date().toISOString() // Convert Date to ISO string format
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast({
        title: 'Profil Güncellendi',
        description: 'Profil bilgileriniz başarıyla güncellendi.',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Hata',
        description: 'Profil güncellenirken bir hata oluştu.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Profile Content - No Hero Section */}
      <section className="section-padding pt-32 bg-white">
        <div className="container-custom max-w-5xl">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-playfair">Hesabım</h1>
            <p className="text-xl text-muted-foreground">
              Profil bilgilerinizi düzenleyin
            </p>
          </div>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="profile" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                Profil Bilgileri
              </TabsTrigger>
              <TabsTrigger value="loyalty" className="flex items-center">
                <Award className="mr-2 h-4 w-4" />
                Sadakat Programı
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="mr-2 h-5 w-5" />
                    Profil Bilgileri
                  </CardTitle>
                  <CardDescription>
                    Kişisel bilgilerinizi güncelleyin
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Ad Soyad</Label>
                      <Input
                        id="name"
                        name="name"
                        value={profile.name}
                        onChange={handleInputChange}
                        placeholder="Ad Soyad"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">E-posta</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profile.email}
                        onChange={handleInputChange}
                        placeholder="E-posta adresiniz"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={profile.phone}
                        onChange={handleInputChange}
                        placeholder="Telefon numaranız"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Adres</Label>
                      <Input
                        id="address"
                        name="address"
                        value={profile.address}
                        onChange={handleInputChange}
                        placeholder="Adresiniz"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-5">
                  <Button 
                    variant="outline" 
                    onClick={handleLogout}
                    className="flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Çıkış Yap
                  </Button>
                  <Button 
                    onClick={handleSaveProfile} 
                    disabled={isSaving}
                  >
                    {isSaving ? 'Kaydediliyor...' : 'Bilgileri Güncelle'}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="loyalty">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="mr-2 h-5 w-5" />
                    Sadakat Programı
                  </CardTitle>
                  <CardDescription>
                    Sadakat puanlarınız ve ödülleriniz
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row items-center gap-8 mb-6">
                    <div className="bg-primary/10 p-6 rounded-lg text-center w-full md:w-auto">
                      <p className="text-sm text-muted-foreground mb-1">Toplam Puanınız</p>
                      <p className="text-4xl font-bold text-primary mb-1">{loyaltyPoints}</p>
                      <p className="text-sm font-medium">{loyaltyLevel} Seviyesi</p>
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="text-lg font-medium mb-2">Sadakat Programı Avantajları</h4>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Her 100₺ harcama için 10 puan</li>
                        <li>Online rezervasyon için 50 bonus puan</li>
                        <li>Özel etkinliklere katılım için 25 puan</li>
                        <li>Doğum gününüzde puanları 2 katı kazanma</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <Button 
                      onClick={() => navigate('/loyalty')}
                      variant="outline"
                      className="gap-2"
                    >
                      <Award className="h-4 w-4" />
                      Sadakat Sayfasına Git
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default Profile;
