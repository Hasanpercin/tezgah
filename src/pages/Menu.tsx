
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
            ...item,
            // We're already handling empty arrays for these in the service
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
      {/* Hero Section with gradient background and smaller height */}
      <Hero
        backgroundImage="https://images.unsplash.com/photo-1555224177-391776d8221d?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=2000"
        title="Menümüz"
        subtitle="En lezzetli yemeklerimizi keşfedin"
        showButtons={false}
        className="h-[30vh]"
        overlayColor="rgba(115, 191, 130, 0.7)" // Light green color with transparency
        titleGradient={true}
      />
      
      {/* Menu Content */}
      <section className="section-padding pt-8">
        <div className="container-custom max-w-5xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-semibold mb-2 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-amber-500 mr-2" />
              Günün Menüsü
              <Sparkles className="h-6 w-6 text-amber-500 ml-2" />
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
        </div>
      </section>
    </div>
  );
};

export default Menu;
