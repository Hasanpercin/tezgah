
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Hero from '@/components/Hero';

export default function Loyalty() {
  // Example loyalty tiers
  const loyaltyTiers = [
    {
      name: "Bronz",
      points: "0-499",
      benefits: [
        "Her 100₺ harcama için 10 puan",
        "Doğum gününüzde hoş geldin içeceği",
      ]
    },
    {
      name: "Gümüş",
      points: "500-999",
      benefits: [
        "Her 100₺ harcama için 15 puan",
        "Doğum gününüzde hoş geldin içeceği",
        "%5 indirim",
        "Rezervasyonlarda öncelik"
      ]
    },
    {
      name: "Altın",
      points: "1000+",
      benefits: [
        "Her 100₺ harcama için 20 puan",
        "Doğum gününüzde ücretsiz tatlı",
        "%10 indirim",
        "Özel etkinliklere davet",
        "VIP rezervasyon"
      ]
    }
  ];

  const howToEarn = [
    {
      title: "Restoran Ziyareti",
      description: "Her 100₺ harcama için 10 puan kazanın",
      icon: "🍽️"
    },
    {
      title: "Online Rezervasyon",
      description: "Her online rezervasyon için ekstra 5 puan",
      icon: "📱"
    },
    {
      title: "Arkadaş Tavsiyesi",
      description: "Her başarılı tavsiye için 25 puan",
      icon: "👥"
    },
    {
      title: "Sosyal Medya",
      description: "Restoranımızı etiketlediğiniz paylaşımlar için 15 puan",
      icon: "📸"
    }
  ];

  const rewards = [
    {
      title: "Ücretsiz İçecek",
      points: 100,
      description: "Sıcak veya soğuk içecek seçeneği"
    },
    {
      title: "Ücretsiz Tatlı",
      points: 250,
      description: "Dilediğiniz tatlıyı seçebilirsiniz"
    },
    {
      title: "%15 İndirim Kuponu",
      points: 500,
      description: "Tüm menüde geçerli"
    },
    {
      title: "Ücretsiz Ana Yemek",
      points: 1000,
      description: "Ana yemek seçeneklerinden biri"
    }
  ];

  return (
    <>
      <Hero 
        backgroundImage="/lovable-uploads/a685bcf7-d128-4123-ab5f-581a1d6ef24f.png" 
        title="Sadakat Programı" 
        subtitle="Lezzet Durağı'na her gelişinizde kazanın, özel fırsatlardan yararlanın"
        showButtons={false}
      />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-playfair font-bold text-foreground mb-4">Nasıl Çalışır?</h2>
          <p className="text-lg text-muted-foreground">
            Lezzet Durağı Sadakat Programı, sizi her ziyaretinizde ödüllendirmek için tasarlandı. 
            Puan biriktirin, özel avantajlardan yararlanın ve daha fazla lezzet deneyimi kazanın.
          </p>
          <div className="mt-8">
            <Button asChild>
              <a href="/profile">Üye Ol ve Puanları Toplamaya Başla</a>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 p-2 bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center">
                <span className="text-3xl">🍽️</span>
              </div>
              <CardTitle className="text-xl">Yemek Ye & Kazan</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Her ziyaretinizde harcama tutarınıza göre puan kazanın. Hesabınıza üye olduktan sonra puanlarınız otomatik olarak eklenir.</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 p-2 bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center">
                <span className="text-3xl">🏆</span>
              </div>
              <CardTitle className="text-xl">Puanları Biriktir</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Kazandığınız puanlar hesabınızda birikir. Ne kadar çok ziyaret ederseniz o kadar çok puan kazanır ve üst seviyelere yükselirsiniz.</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 p-2 bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center">
                <span className="text-3xl">🎁</span>
              </div>
              <CardTitle className="text-xl">Ödülleri Kullan</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Biriken puanlarınızı ücretsiz yemekler, içecekler, indirimler ve daha fazlası için kullanabilirsiniz.</p>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-3xl font-playfair font-bold text-foreground mb-8 text-center">Üyelik Seviyeleri</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {loyaltyTiers.map((tier, index) => (
            <Card key={index} className={`${
              tier.name === "Altın" ? "border-secondary" : ""
            }`}>
              <CardHeader className={`${
                tier.name === "Altın" ? "bg-secondary text-secondary-foreground" : ""
              }`}>
                <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                <CardDescription className={`${
                  tier.name === "Altın" ? "text-secondary-foreground/90" : ""
                }`}>
                  {tier.points} puan
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-2">
                  {tier.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-secondary mr-2">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div>
            <h2 className="text-2xl font-playfair font-bold mb-6">Puan Kazanma Yolları</h2>
            <div className="space-y-4">
              {howToEarn.map((item, index) => (
                <div key={index} className="flex items-start p-4 border rounded-lg">
                  <div className="text-3xl mr-4">{item.icon}</div>
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-playfair font-bold mb-6">Ödüller</h2>
            <div className="space-y-4">
              {rewards.map((reward, index) => (
                <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{reward.title}</h3>
                    <p className="text-sm text-muted-foreground">{reward.description}</p>
                  </div>
                  <div className="text-secondary font-bold">
                    {reward.points} puan
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-accent rounded-lg p-6 text-center">
          <h2 className="text-2xl font-playfair font-bold mb-4">Hemen Başlayın!</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Lezzet Durağı Sadakat Programı'na üye olun, her ziyaretinizde puan biriktirin ve özel ödüllerin tadını çıkarın!
          </p>
          <Button asChild size="lg">
            <a href="/profile">Üye Ol</a>
          </Button>
        </div>
      </div>
    </>
  );
}
