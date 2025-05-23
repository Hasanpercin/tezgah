
import Hero from '@/components/Hero';
import MenuCategory from '@/components/MenuCategory';
import { useEffect, useState } from 'react';
import { MenuCategoryType } from '@/components/MenuCategory';
import { fetchFeaturedMenuItems } from '@/services/menuService';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Sparkles, UtensilsCrossed } from 'lucide-react';

const Index = () => {
  const heroImage = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=2000";
  const [menuCategories, setMenuCategories] = useState<MenuCategoryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      setIsLoading(true);
      try {
        const featuredItems = await fetchFeaturedMenuItems();

        // Structure the fetched items into the MenuCategoryType format
        const category: MenuCategoryType = {
          id: 'featured',
          name: 'Öne Çıkan Lezzetler',
          items: featuredItems.map(item => ({
            ...item,
            // We're already handling empty arrays for these in the service
            options: item.options || [],
            variants: item.variants || []
          }))
        };

        setMenuCategories([category]);
      } catch (err: any) {
        setError(err.message || 'Failed to load featured menu items.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <Hero 
        backgroundImage={heroImage} 
        title="Lezzetli Anlar" 
        subtitle="Enfes yemekler, sıcak bir atmosfer ve unutulmaz deneyimler" 
        showButtons={true}
        titleGradient={true}
      />

      {/* Featured Menu Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-amber-500 mr-2" />
              Öne Çıkan Lezzetler
              <Sparkles className="h-6 w-6 text-amber-500 ml-2" />
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Şefimizin özel seçimiyle hazırlanan, en sevilen ve beğenilen lezzetlerimizden bazıları.
            </p>
          </div>

          {isLoading && <p className="text-center">Menü yükleniyor...</p>}
          {error && <p className="text-center text-red-500">Hata: {error}</p>}

          {!isLoading && !error && menuCategories.length > 0 && (
            <MenuCategory categories={menuCategories} />
          )}

          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link to="/menu" className="flex items-center">
                <UtensilsCrossed className="mr-2" /> Tüm Menüyü Görüntüle
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Us Section (Example) */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-semibold mb-4 text-secondary-foreground">Hakkımızda</h2>
              <p className="text-lg text-muted-foreground">
                Restoranımız, lezzetli yemekleri ve sıcak atmosferiyle unutulmaz bir deneyim sunmayı amaçlar.
                En taze malzemelerle hazırlanan menümüz, her damak zevkine hitap edecek çeşitliliktedir.
              </p>
              <p className="text-lg text-muted-foreground mt-4">
                Sizleri ağırlamaktan ve özel anlarınıza eşlik etmekten mutluluk duyarız.
              </p>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600"
                alt="Restaurant Interior"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
