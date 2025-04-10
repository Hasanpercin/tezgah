
import Hero from '@/components/Hero';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { useWebsiteContent } from '@/hooks/useWebsiteContent';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect } from 'react';
import { fetchFeaturedMenuItems } from '@/services/menuService';

const Index = () => {
  const { content, isLoading } = useWebsiteContent('homepage');
  const [featuredItems, setFeaturedItems] = useState([]);
  const [isLoadingMenuItems, setIsLoadingMenuItems] = useState(true);
  
  // Load featured menu items from the database
  useEffect(() => {
    const loadFeaturedItems = async () => {
      try {
        const items = await fetchFeaturedMenuItems(3);
        if (items && items.length > 0) {
          const formattedItems = items.map(item => ({
            id: item.id,
            name: item.name,
            description: item.description || '',
            image: item.image_path || `https://images.unsplash.com/photo-${item.id.substring(0, 8)}?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=400`,
            price: new Intl.NumberFormat('tr-TR', {
              style: 'currency',
              currency: 'TRY',
              minimumFractionDigits: 0
            }).format(item.price)
          }));
          setFeaturedItems(formattedItems);
        } else {
          // Fallback to default items if no featured items are found
          setFeaturedItems([
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
          ]);
        }
      } catch (error) {
        console.error("Error loading featured menu items:", error);
        // Set fallback items on error
        setFeaturedItems([
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
        ]);
      } finally {
        setIsLoadingMenuItems(false);
      }
    };

    loadFeaturedItems();
  }, []);
  
  // Default values to use as fallbacks if content isn't loaded yet
  const heroImage = content.hero_image || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=2000";

  if (isLoading || isLoadingMenuItems) {
    return (
      <div className="min-h-screen">
        <Skeleton className="w-full h-[40vh]" />
        <div className="container-custom py-12">
          <Skeleton className="w-2/3 h-12 mx-auto mb-4" />
          <Skeleton className="w-1/2 h-6 mx-auto mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero 
        backgroundImage={heroImage}
        title={content.hero_title || "Lezzet Durağı"}
        subtitle={content.hero_subtitle || "Eşsiz lezzetler, unutulmaz anlar için sizleri bekliyoruz"}
      />
      
      {/* Featured Menu Items */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              {content.feature_section_title || "Öne Çıkan Lezzetler"}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {content.feature_section_description || "Şefimizin özenle hazırladığı özel tarifler ve mevsimlik lezzetler"}
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
              {content.feature_button_text || "Tüm Menüyü Gör"}
            </Link>
          </div>
        </div>
      </section>
      
      {/* About Restaurant */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-semibold mb-6">
                {content.about_title || "Lezzet Durağı'na Hoş Geldiniz"}
              </h2>
              <p className="text-lg mb-4">
                {content.about_text_1 || "2010 yılından beri İstanbul'un kalbinde, geleneksel tatları modern sunumlarla buluşturuyoruz."}
              </p>
              <p className="text-lg mb-6">
                {content.about_text_2 || "Taze ve mevsimsel malzemelerle hazırlanan özel tariflerimiz, şeflerimizin yaratıcı dokunuşları ve sıcak atmosferimizle unutulmaz bir yemek deneyimi sunuyoruz."}
              </p>
              <Link to="/about" className="btn-secondary">
                {content.about_button_text || "Daha Fazla Bilgi"}
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <img 
                src={content.about_image_1 || "https://images.unsplash.com/photo-1542834369-f10ebf06d3e0?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=500"} 
                alt="Chef preparing food" 
                className="rounded-lg h-full object-cover"
              />
              <div className="grid grid-rows-2 gap-4">
                <img 
                  src={content.about_image_2 || "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=300"} 
                  alt="Food plating" 
                  className="rounded-lg h-full object-cover"
                />
                <img 
                  src={content.about_image_3 || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=300"} 
                  alt="Signature dish" 
                  className="rounded-lg h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Atmosphere Images - Now linked to Gallery */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              {content.atmosphere_title || "Restoran Atmosferi"}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {content.atmosphere_description || "Sıcak ve konforlu ambiyansımızda unutulmaz anlar yaşayın"}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <img 
              src={content.atmosphere_image_1 || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600"}
              alt="Restaurant atmosphere 1"
              className="w-full h-64 object-cover rounded-lg hover:opacity-90 transition-opacity"
            />
            <img 
              src={content.atmosphere_image_2 || "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600"}
              alt="Restaurant atmosphere 2"
              className="w-full h-64 object-cover rounded-lg hover:opacity-90 transition-opacity"
            />
            <img 
              src={content.atmosphere_image_3 || "https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600"}
              alt="Restaurant atmosphere 3"
              className="w-full h-64 object-cover rounded-lg hover:opacity-90 transition-opacity"
            />
          </div>
          
          <div className="text-center mt-10">
            <Link to="/gallery" className="btn-primary">
              {content.gallery_button_text || "Galeriyi Gör"}
            </Link>
          </div>
        </div>
      </section>
      
      {/* Reservation CTA */}
      <section 
        className="py-24 bg-fixed bg-cover bg-center"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${content.reservation_bg_image || "https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=2000"})`
        }}
      >
        <div className="container-custom text-center text-white">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            {content.reservation_title || "Rezervasyon Yaptırın"}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {content.reservation_description || "Özel anlarınızı unutulmaz kılmak ve lezzetli bir deneyim yaşamak için hemen rezervasyon yapın."}
          </p>
          <Link to="/reservation" className="btn-secondary">
            {content.reservation_button_text || "Rezervasyon Yap"}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
