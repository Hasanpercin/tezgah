
import Hero from '@/components/Hero';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const Index = () => {
  const heroImage = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=2000";

  const featuredItems = [
    {
      id: 1,
      name: "Mevsim Salata",
      description: "Taze mevsim sebzeleri ile hazırlanan özel salata",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=400",
      price: "₺75"
    },
    {
      id: 2,
      name: "Özel Lezzet Burger",
      description: "Ev yapımı özel sos ve taze malzemelerle hazırlanan gurme burger",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=400",
      price: "₺145"
    },
    {
      id: 3,
      name: "Çikolatalı Sufle",
      description: "Sıcak servis edilen akışkan çikolata dolgulu sufle",
      image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=400",
      price: "₺85"
    }
  ];
  
  const atmosphereImages = [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero 
        backgroundImage={heroImage}
        title="Lezzet Durağı"
        subtitle="Eşsiz lezzetler, unutulmaz anlar için sizleri bekliyoruz"
      />
      
      {/* Featured Menu Items */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">Öne Çıkan Lezzetler</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Şefimizin özenle hazırladığı özel tarifler ve mevsimlik lezzetler
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-playfair font-semibold">{item.name}</h3>
                    <span className="font-semibold text-primary">{item.price}</span>
                  </div>
                  <p className="text-muted-foreground mb-4">{item.description}</p>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link to="/menu" className="btn-primary">
              Tüm Menüyü Gör
            </Link>
          </div>
        </div>
      </section>
      
      {/* About Restaurant */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-semibold mb-6">Lezzet Durağı'na Hoş Geldiniz</h2>
              <p className="text-lg mb-4">
                2010 yılından beri İstanbul'un kalbinde, geleneksel tatları modern sunumlarla buluşturuyoruz.
              </p>
              <p className="text-lg mb-6">
                Taze ve mevsimsel malzemelerle hazırlanan özel tariflerimiz, şeflerimizin yaratıcı dokunuşları ve sıcak atmosferimizle unutulmaz bir yemek deneyimi sunuyoruz.
              </p>
              <Link to="/about" className="btn-secondary">
                Daha Fazla Bilgi
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1542834369-f10ebf06d3e0?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=500" 
                alt="Chef preparing food" 
                className="rounded-lg h-full object-cover"
              />
              <div className="grid grid-rows-2 gap-4">
                <img 
                  src="https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=300" 
                  alt="Food plating" 
                  className="rounded-lg h-full object-cover"
                />
                <img 
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=300" 
                  alt="Signature dish" 
                  className="rounded-lg h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Atmosphere Images */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">Restoran Atmosferi</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Sıcak ve konforlu ambiyansımızda unutulmaz anlar yaşayın
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {atmosphereImages.map((image, index) => (
              <img 
                key={index}
                src={image} 
                alt={`Restaurant atmosphere ${index + 1}`}
                className="w-full h-64 object-cover rounded-lg hover:opacity-90 transition-opacity"
              />
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link to="/gallery" className="btn-primary">
              Galeriyi Gör
            </Link>
          </div>
        </div>
      </section>
      
      {/* Reservation CTA */}
      <section 
        className="py-24 bg-fixed bg-cover bg-center"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=2000)`
        }}
      >
        <div className="container-custom text-center text-white">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">Rezervasyon Yaptırın</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Özel anlarınızı unutulmaz kılmak ve lezzetli bir deneyim yaşamak için hemen rezervasyon yapın.
          </p>
          <Link to="/reservation" className="btn-secondary">
            Rezervasyon Yap
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
