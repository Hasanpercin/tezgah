import { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import MenuCategory from '@/components/MenuCategory';
import { useToast } from "@/hooks/use-toast";
import { fetchMenuItemsByCategory } from "@/services/menuService";
import { MenuCategoryType } from '@/components/MenuCategory';
import { Loader2, Sparkles } from 'lucide-react';

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
        
        const categories: { [key: string]: MenuCategoryType } = {};
        
        menuItemsData.forEach(item => {
          const categoryId = item.menu_categories?.id || 'uncategorized';
          const categoryName = item.menu_categories?.name || 'Uncategorized';
          
          if (!categories[categoryId]) {
            categories[categoryId] = {
              id: categoryId,
              name: categoryName,
              items: [],
              displayOrder: item.menu_categories?.display_order || 0
            };
          }
          
          categories[categoryId].items.push({
            ...item,
            options: item.options || [],
            variants: item.variants || []
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

  return (
    <div className="min-h-screen bg-background">
      <Hero
        backgroundImage="https://images.unsplash.com/photo-1555224177-391776d8221d?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=2000"
        title="Menümüz"
        subtitle="Özenle hazırlanmış lezzetlerimizi keşfedin"
        showButtons={false}
        className="h-[30vh]"
        overlayColor="rgba(0, 0, 0, 0.5)"
        titleGradient={true}
      />
      
      <section className="section-padding pt-12">
        <div className="container-custom max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-playfair font-semibold mb-4">
              Günün Menüsü
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Mevsimsel malzemelerle hazırlanmış, şeflerimizin özel tarifleriyle sunduğumuz
              seçkin menümüzü keşfedin.
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500">
              {error}
            </div>
          ) : (
            <MenuCategory categories={menuCategories} />
          )}
        </div>
      </section>
    </div>
  );
};

export default Menu;
