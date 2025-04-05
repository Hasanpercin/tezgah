
import { useEffect, useState } from 'react';
import Hero from '@/components/Hero';
import MenuCategory, { MenuCategoryType } from '@/components/MenuCategory';
import { fetchMenuItemsByCategory } from '@/services/menuService';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Menu = () => {
  const { toast } = useToast();
  const heroImage = "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=2000";
  const [menuCategories, setMenuCategories] = useState<MenuCategoryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadMenuData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchMenuItemsByCategory();
        setMenuCategories(data);
      } catch (error: any) {
        console.error('Error loading menu data:', error);
        toast({
          title: "Hata",
          description: "Menü bilgileri yüklenirken bir hata oluştu.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMenuData();
  }, [toast]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero 
        backgroundImage={heroImage}
        title="Menümüz"
        subtitle="Taze ve seçkin malzemelerle hazırlanan özel lezzetlerimiz"
        showButtons={false}
      />
      
      {/* Menu Content */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">Lezzetlerimiz</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Şeflerimizin özenle hazırladığı menümüzde, modern ve geleneksel lezzetleri bir araya getirdik
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : (
            <MenuCategory categories={menuCategories} />
          )}
          
          <div className="text-center mt-16">
            <p className="text-lg font-medium mb-2">Özel diyet ihtiyaçlarınız mı var?</p>
            <p className="text-muted-foreground mb-6">
              Vejetaryen, vegan, glutensiz veya diğer diyet tercihleriniz için lütfen servis personelimize danışınız.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Menu;
