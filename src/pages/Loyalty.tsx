
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Gift, Coffee, Award, Info } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useWebsiteContent } from '@/hooks/useWebsiteContent';
import { Skeleton } from '@/components/ui/skeleton';

// Puan geçmişi tipi
type PointHistory = {
  id: string;
  date: string;
  description: string;
  points: number;
};

// Ödül tipi
type Reward = {
  id: number;
  name: string;
  points: number;
  icon: JSX.Element;
  available: boolean;
};

const Loyalty = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [loyaltyData, setLoyaltyData] = useState({
    points: 0,
    level: 'Bronz',
    nextLevel: 'Gümüş',
    pointsToNextLevel: 100,
    totalPointsForNextLevel: 250,
    progress: 60, // yüzde
  });

  const [pointHistory, setPointHistory] = useState<PointHistory[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { state: { from: '/loyalty' } });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Sadakat puanları ve seviye bilgilerini yükle
  useEffect(() => {
    const fetchLoyaltyData = async () => {
      if (user) {
        try {
          const { data: loyaltyPoints, error: loyaltyError } = await supabase
            .from('loyalty_points')
            .select('points, level')
            .eq('user_id', user.id)
            .single();

          if (loyaltyError) throw loyaltyError;
          
          if (loyaltyPoints) {
            // Seviye ve puanlara göre bir sonraki seviyeyi belirle
            let nextLevel = 'Gümüş';
            let pointsToNextLevel = 250 - loyaltyPoints.points;
            let totalPointsForNextLevel = 250;
            
            if (loyaltyPoints.level === 'Bronz') {
              nextLevel = 'Gümüş';
              pointsToNextLevel = 250 - loyaltyPoints.points;
              totalPointsForNextLevel = 250;
            } else if (loyaltyPoints.level === 'Gümüş') {
              nextLevel = 'Altın';
              pointsToNextLevel = 500 - loyaltyPoints.points;
              totalPointsForNextLevel = 500;
            } else if (loyaltyPoints.level === 'Altın') {
              nextLevel = 'Platin';
              pointsToNextLevel = 1000 - loyaltyPoints.points;
              totalPointsForNextLevel = 1000;
            } else {
              nextLevel = 'VIP';
              pointsToNextLevel = 2000 - loyaltyPoints.points;
              totalPointsForNextLevel = 2000;
            }
            
            // İlerleme yüzdesini hesapla
            const progress = Math.min(
              Math.round((loyaltyPoints.points / totalPointsForNextLevel) * 100), 
              100
            );
            
            setLoyaltyData({
              points: loyaltyPoints.points,
              level: loyaltyPoints.level,
              nextLevel,
              pointsToNextLevel: Math.max(0, pointsToNextLevel),
              totalPointsForNextLevel,
              progress,
            });
          }
          
          // Puan geçmişini yükle
          const { data: historyData, error: historyError } = await supabase
            .from('point_history')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5);
            
          if (historyError) throw historyError;
          
          if (historyData) {
            const formattedHistory = historyData.map(item => ({
              id: item.id,
              description: item.description,
              points: item.points,
              date: new Date(item.created_at).toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })
            }));
            
            setPointHistory(formattedHistory);
          }
        } catch (error) {
          console.error('Sadakat verileri yüklenirken hata:', error);
        } finally {
          setIsLoadingData(false);
        }
      }
    };

    if (isAuthenticated && user) {
      fetchLoyaltyData();
    }
  }, [user, isAuthenticated]);

  // Sadakat seviyesine göre ödülleri tanımla
  const getRewards = () => {
    const rewards: Reward[] = [
      {
        id: 1,
        name: 'Ücretsiz Tatlı',
        points: 100,
        icon: <Coffee className="h-10 w-10 text-primary" />,
        available: loyaltyData.points >= 100
      },
      {
        id: 2,
        name: 'Ücretsiz İçecek',
        points: 150,
        icon: <Coffee className="h-10 w-10 text-primary" />,
        available: loyaltyData.points >= 150
      },
      {
        id: 3,
        name: '%10 İndirim',
        points: 200,
        icon: <Gift className="h-10 w-10 text-primary" />,
        available: loyaltyData.points >= 200
      },
      {
        id: 4,
        name: 'Özel Masa Rezervasyonu',
        points: 300,
        icon: <Award className="h-10 w-10 text-primary" />,
        available: loyaltyData.points >= 300
      }
    ];
    
    return rewards;
  };

  if (isLoading || isLoadingData) {
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

  return (
    <div className="min-h-screen">
      {/* Loyalty Content - No Hero Section */}
      <section className="section-padding pt-32 bg-white">
        <div className="container-custom max-w-6xl">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-playfair">Sadakat Programı</h1>
            <p className="text-xl text-muted-foreground">
              Lezzet Durağı'nın ayrıcalıklar dünyasına hoş geldiniz
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Loyalty Status */}
            <div className="lg:col-span-1">
              <Card className="p-6 h-full">
                <h2 className="text-2xl font-semibold mb-6">Sadakat Durumu</h2>
                
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">{loyaltyData.level}</span>
                  <span className="text-sm font-medium">{loyaltyData.nextLevel}</span>
                </div>
                
                <Progress value={loyaltyData.progress} className="mb-2" />
                
                <p className="text-sm text-muted-foreground mb-6">
                  {loyaltyData.nextLevel} seviyesine ulaşmak için {loyaltyData.pointsToNextLevel} puan daha kazanın
                </p>
                
                <div className="bg-muted p-4 rounded-lg mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Mevcut Puanınız</p>
                    <p className="text-3xl font-bold">{loyaltyData.points}</p>
                  </div>
                  <Award className="h-12 w-12 text-primary opacity-70" />
                </div>
                
                <div className="bg-primary/10 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-sm mb-1">Nasıl Puan Kazanılır?</h3>
                      <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                        <li>Her 100₺ harcama için 10 puan</li>
                        <li>Online rezervasyon için 50 puan</li>
                        <li>Özel etkinliklere katılım için 25 puan</li>
                        <li>Doğum gününüzde 2x puan</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Rewards */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-semibold mb-6">Ödülleriniz</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                {getRewards().map(reward => (
                  <Card key={reward.id} className={`p-6 relative ${!reward.available && 'opacity-60'}`}>
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                        {reward.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{reward.name}</h3>
                        <p className="text-sm text-muted-foreground">{reward.points} Puan</p>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full mt-4"
                      variant={reward.available ? "default" : "outline"}
                      disabled={!reward.available}
                    >
                      {reward.available ? 'Ödülü Kullan' : `${reward.points - loyaltyData.points} Puan Daha Gerekiyor`}
                    </Button>
                  </Card>
                ))}
              </div>
              
              {/* Points History */}
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Puan Geçmişi</h2>
                  
                  <div className="space-y-4">
                    {pointHistory.length > 0 ? (
                      pointHistory.map(item => (
                        <div key={item.id} className="flex justify-between items-center pb-3 border-b">
                          <div>
                            <p className="font-medium">{item.description}</p>
                            <p className="text-sm text-muted-foreground">{item.date}</p>
                          </div>
                          <div className="text-primary font-semibold">+{item.points}</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        Henüz puan geçmişi bulunmuyor.
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Loyalty;
