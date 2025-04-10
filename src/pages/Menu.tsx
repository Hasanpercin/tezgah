import { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import MenuCategory from '@/components/MenuCategory';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { fetchMenuItemsByCategory, seedMenuData } from "@/services/menuService";
import { MenuCategoryType } from '@/components/MenuCategory';
import { Loader2 } from 'lucide-react';

const Menu = () => {
  const [menuCategories, setMenuCategories] = useState<MenuCategoryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchMenu = async () => {
      setIsLoading(true);
      try {
        const menuItemsData = await fetchMenuItemsByCategory();
        
        // Process the data to match the expected MenuCategoryType structure
        const categories: { [key: string]: MenuCategoryType } = {};
        
        menuItemsData.forEach(item => {
          const categoryId = item.menu_categories?.id || 'uncategorized';
          const categoryName = item.menu_categories?.name || 'Uncategorized';
          
          if (!categories[categoryId]) {
            categories[categoryId] = {
              id: categoryId,
              name: categoryName,
              items: []
            };
          }
          
          categories[categoryId].items.push({
            id: item.id,
            name: item.name,
            description: item.description || '',
            price: `${item.price} ₺`,
            image: item.image_path,
            isInStock: item.is_in_stock
          });
        });
        
        const categoriesArray = Object.values(categories);
        setMenuCategories(categoriesArray);
      } catch (error) {
        console.error("Error loading menu:", error);
        setError("Menü yüklenirken bir hata oluştu.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMenu();
  }, []);

  const handleSeedData = async () => {
    try {
      const result = await seedMenuData();
      if (result && result.success) {
        toast({
          title: "Başarılı",
          description: "Menü verileri başarıyla eklendi.",
        });
      }
    } catch (error) {
      console.error("Error seeding menu data:", error);
      toast({
        title: "Hata",
        description: "Menü verileri eklenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <Hero
        backgroundImage="https://images.unsplash.com/photo-1555224177-391776d8221d?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=2000"
        title="Menümüz"
        subtitle="En lezzetli yemeklerimizi keşfedin"
        showButtons={false}
      />
      
      {/* Menu Content */}
      <section className="section-padding">
        <div className="container-custom max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Günün Menüsü
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Özenle seçilmiş malzemelerle hazırlanan, damak zevkinize hitap edecek
              çeşitlerimizle karşınızdayız.
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500">
              {error}
            </div>
          ) : (
            <MenuCategory categories={menuCategories} />
          )}
          
          {/* Admin Seed Data Button - Conditionally rendered */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 text-center">
              <Button onClick={handleSeedData}>
                Menü Verilerini Ekle
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Menu;
