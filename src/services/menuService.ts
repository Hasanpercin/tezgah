
import { supabase } from "@/integrations/supabase/client";

export interface MenuCategory {
  id: string;
  name: string;
  description: string | null;
  display_order: number;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  image_path: string | null;
  ingredients: string | null;
  allergens: string | null;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  is_spicy: boolean;
  is_featured: boolean;
  display_order: number;
}

export const fetchMenuCategories = async () => {
  const { data, error } = await supabase
    .from("menu_categories")
    .select("*")
    .order("display_order", { ascending: true });
    
  if (error) throw error;
  return data as MenuCategory[];
};

export const fetchMenuItems = async (categoryId?: string) => {
  let query = supabase
    .from("menu_items")
    .select("*")
    .order("display_order", { ascending: true });
    
  if (categoryId && categoryId !== "all") {
    query = query.eq("category_id", categoryId);
  }
    
  const { data, error } = await query;
  if (error) throw error;
  return data as MenuItem[];
};

export const fetchFeaturedMenuItems = async (limit: number = 4) => {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*, menu_categories(name)")
    .eq("is_featured", true)
    .limit(limit);
    
  if (error) throw error;
  return data as (MenuItem & { menu_categories: { name: string } })[];
};

export const fetchMenuItemsByCategory = async () => {
  // Get categories first
  const categories = await fetchMenuCategories();
  
  // For each category, get its items
  const menuWithItems = await Promise.all(
    categories.map(async (category) => {
      const items = await fetchMenuItems(category.id);
      return {
        ...category,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description || "",
          price: formatPrice(item.price),
          image: item.image_path
        }))
      };
    })
  );
  
  return menuWithItems;
};

// Utility function to format price
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: price % 1 === 0 ? 0 : 2
  }).format(price);
};
