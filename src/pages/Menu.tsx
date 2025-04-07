
import { useEffect, useState } from 'react';
import Hero from '@/components/Hero';
import MenuCategory, { MenuCategoryType } from '@/components/MenuCategory';
import { fetchMenuItemsByCategory, seedMenuData } from '@/services/menuService';
import { Loader2, RefreshCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const Menu = () => {
  const { toast } = useToast();
  const heroImage = "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=2000";
  const [menuCategories, setMenuCategories] = useState<MenuCategoryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeedingData, setIsSeedingData] = useState(false);
  
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

  const handleSeedMenu = async () => {
    try {
      setIsSeedingData(true);
      const result = await seedMenuData();
      
      if (result.success) {
        toast({
          title: "Başarılı",
          description: "Menü başarıyla güncellendi.",
        });
        
        // Reload menu data
        const data = await fetchMenuItemsByCategory();
        setMenuCategories(data);
      } else {
        toast({
          title: "Hata",
          description: result.error || "Menü güncellenirken bir hata oluştu.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error seeding menu data:', error);
      toast({
        title: "Hata",
        description: "Menü güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsSeedingData(false);
    }
  };

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
            
            {/* Admin only: Menu Update Button */}
            {import.meta.env.DEV && (
              <div className="mt-4">
                <Button 
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={handleSeedMenu}
                  disabled={isSeedingData}
                >
                  {isSeedingData ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCcw className="h-4 w-4" />
                  )}
                  Menü Verilerini Yükle
                </Button>
              </div>
            )}
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
