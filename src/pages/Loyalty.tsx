import Hero from '@/components/Hero';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Gift, Coffee, Award, Info } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Loyalty = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // Updated heroImage
  const heroImage = "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?q=80&w=1920&auto=format&fit=crop";
  
  // Example loyalty data
  const loyaltyData = {
    points: 150,
    level: 'Bronz',
    nextLevel: 'Gümüş',
    pointsToNextLevel: 100,
    totalPointsForNextLevel: 250,
    progress: 60, // percentage
    history: [
      { id: 1, date: '15 Nisan 2025', description: 'Rezervasyon', points: 50 },
      { id: 2, date: '10 Nisan 2025', description: 'Yemek Siparişi', points: 75 },
      { id: 3, date: '5 Mart 2025', description: 'Özel Etkinlik Katılımı', points: 25 }
    ]
  };
  
  // Rewards list
  const rewards = [
    {
      id: 1,
      name: 'Ücretsiz Tatlı',
      points: 100,
      icon: <Coffee className="h-10 w-10 text-primary" />,
      available: true
    },
    {
      id: 2,
      name: 'Ücretsiz İçecek',
      points: 150,
      icon: <Coffee className="h-10 w-10 text-primary" />,
      available: true
    },
    {
      id: 3,
      name: '%10 İndirim',
      points: 200,
      icon: <Gift className="h-10 w-10 text-primary" />,
      available: false
    },
    {
      id: 4,
      name: 'Özel Masa Rezervasyonu',
      points: 300,
      icon: <Award className="h-10 w-10 text-primary" />,
      available: false
    }
  ];

  if (!isAuthenticated) {
    return null; // Return null since useEffect will redirect
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero 
        backgroundImage={heroImage}
        title="Sadakat Programı"
        subtitle="Lezzet Durağı'nın ayrıcalıklar dünyasına hoş geldiniz"
        showButtons={false}
        overlayColor="green-600/70"
      />
      
      {/* Loyalty Content */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-6xl">
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
                {rewards.map(reward => (
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
                    {loyaltyData.history.map(item => (
                      <div key={item.id} className="flex justify-between items-center pb-3 border-b">
                        <div>
                          <p className="font-medium">{item.description}</p>
                          <p className="text-sm text-muted-foreground">{item.date}</p>
                        </div>
                        <div className="text-primary font-semibold">+{item.points}</div>
                      </div>
                    ))}
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
