
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
  is_in_stock: boolean;
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
  
  // Ensure is_in_stock property exists, default to true if missing
  const itemsWithStockStatus = data.map(item => ({
    ...item,
    is_in_stock: item.is_in_stock !== undefined ? item.is_in_stock : true
  }));
  
  return itemsWithStockStatus as MenuItem[];
};

export const fetchFeaturedMenuItems = async (limit: number = 4) => {
  // Try to get items marked as featured first
  const { data: featuredData, error: featuredError } = await supabase
    .from("menu_items")
    .select("*, menu_categories(name)")
    .eq("is_featured", true)
    .limit(limit);
    
  if (featuredError) throw featuredError;
  
  // If no featured items found, get random items
  if (!featuredData || featuredData.length === 0) {
    console.log("No featured items found, getting random items instead");
    const { data: randomData, error: randomError } = await supabase
      .from("menu_items")
      .select("*, menu_categories(name)")
      .limit(limit);
      
    if (randomError) throw randomError;
    
    // Ensure is_in_stock property exists, default to true if missing
    const itemsWithStockStatus = (randomData || []).map(item => ({
      ...item,
      is_in_stock: item.is_in_stock !== undefined ? item.is_in_stock : true
    }));
    
    return itemsWithStockStatus as (MenuItem & { menu_categories: { name: string } })[];
  }
  
  // Ensure is_in_stock property exists, default to true if missing
  const itemsWithStockStatus = featuredData.map(item => ({
    ...item,
    is_in_stock: item.is_in_stock !== undefined ? item.is_in_stock : true
  }));
  
  return itemsWithStockStatus as (MenuItem & { menu_categories: { name: string } })[];
};

export const updateFeaturedMenuItem = async (itemId: string, isFeatured: boolean) => {
  const { data, error } = await supabase
    .from("menu_items")
    .update({ is_featured: isFeatured })
    .eq("id", itemId)
    .select();
    
  if (error) throw error;
  return data;
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
          image: item.image_path,
          isInStock: item.is_in_stock
        }))
      };
    })
  );
  
  return menuWithItems;
};

// Add function to seed menu data
export const seedMenuData = async () => {
  try {
    // First, check if we have the required categories
    const requiredCategories = [
      { name: "Zeytinyağlılar", display_order: 1 },
      { name: "Ana Yemekler", display_order: 2 },
      { name: "Salatalar", display_order: 3 },
      { name: "Tatlılar", display_order: 4 },
    ];
    
    // Create a map to store category IDs
    const categoryMap: Record<string, string> = {};
    
    // Check and add categories if they don't exist
    for (const category of requiredCategories) {
      const { data: existingCategories, error: fetchError } = await supabase
        .from("menu_categories")
        .select("id")
        .eq("name", category.name);
      
      if (fetchError) throw fetchError;
      
      if (existingCategories && existingCategories.length > 0) {
        // Category exists, save its ID
        categoryMap[category.name] = existingCategories[0].id;
      } else {
        // Category doesn't exist, create it
        const { data: newCategory, error: insertError } = await supabase
          .from("menu_categories")
          .insert(category)
          .select("id")
          .single();
        
        if (insertError) throw insertError;
        if (newCategory) {
          categoryMap[category.name] = newCategory.id;
        }
      }
    }
    
    // Define the menu items from the table
    const menuItems = [
      // Zeytinyağlılar
      { name: "Portakallı Rezene, Arapsaçı", price: 220, category_name: "Zeytinyağlılar", display_order: 1, is_featured: true },
      { name: "Koruklu Taze Fasulye", price: 240, category_name: "Zeytinyağlılar", display_order: 2 },
      { name: "Defneli Barbunya Yemeği", price: 240, category_name: "Zeytinyağlılar", display_order: 3 },
      { name: "Koruklu Bamya Yemeği", price: 260, category_name: "Zeytinyağlılar", display_order: 4 },
      { name: "Cevizli Biber Dolması", price: 260, category_name: "Zeytinyağlılar", display_order: 5 },
      { name: "Karaköy Zeytinyağı ile Taze Bezelye", price: 280, category_name: "Zeytinyağlılar", display_order: 6 },
      { name: "Kabak Çiçeği Dolması", price: 350, category_name: "Zeytinyağlılar", display_order: 7 },
      { name: "Kuşkonmazlı Enginarlı Yaz Pilavı", price: 350, category_name: "Zeytinyağlılar", display_order: 8 },
      
      // Ana Yemekler
      { name: "Selanik Yemeği (Lobdes)", price: 320, category_name: "Ana Yemekler", display_order: 1, is_featured: true },
      { name: "Kuzu Etli Enginar Yemeği (Girit Usulü)", price: 450, category_name: "Ana Yemekler", display_order: 2 },
      { name: "Damla Sakızı Yaprağında Odun Ateşi Lezzeti Levrek/Çipura", price: 520, category_name: "Ana Yemekler", display_order: 3 },
      { name: "Göçmen Yemeği", price: 600, category_name: "Ana Yemekler", display_order: 4 },
      
      // Salatalar
      { name: "Ada Otu Salatası", price: 220, category_name: "Salatalar", display_order: 1, is_featured: true },
      { name: "Köz Patlıcan Salatası", price: 240, category_name: "Salatalar", display_order: 2 },
      { name: "Yaz Salatası", price: 240, category_name: "Salatalar", display_order: 3 },
      
      // Tatlılar
      { name: "Itırlı Muhallebi", price: 180, category_name: "Tatlılar", display_order: 1 },
      { name: "San Sebastian Cheseecake", price: 220, category_name: "Tatlılar", display_order: 2 },
      { name: "Ruby San Sebastian Cheseecake", price: 240, category_name: "Tatlılar", display_order: 3, is_featured: true },
      { name: "Lavantalı Tiramisu", price: 240, category_name: "Tatlılar", display_order: 4 },
      { name: "Çeşme Limonlu Tiramisu", price: 240, category_name: "Tatlılar", display_order: 5 },
      { name: "Bitter San Sebastian", price: 250, category_name: "Tatlılar", display_order: 6 },
      { name: "Alaçatı'nın Tatlı Enginarı", price: 250, category_name: "Tatlılar", display_order: 7 },
      { name: "Kül suyunda Kalburabastı", price: 260, category_name: "Tatlılar", display_order: 8 },
      { name: "Baklava Chesecake", price: 260, category_name: "Tatlılar", display_order: 9 },
    ];
    
    // Add items to their respective categories
    for (const item of menuItems) {
      const { category_name, is_featured = false, ...menuItem } = item;
      
      const category_id = categoryMap[category_name];
      if (!category_id) continue; // Skip if category not found (which shouldn't happen)
      
      // Check if the item already exists
      const { data: existingItems, error: fetchError } = await supabase
        .from("menu_items")
        .select("id")
        .eq("name", menuItem.name)
        .eq("category_id", category_id);
      
      if (fetchError) throw fetchError;
      
      if (existingItems && existingItems.length === 0) {
        // Item doesn't exist, create it
        const { error: insertError } = await supabase
          .from("menu_items")
          .insert({
            ...menuItem,
            category_id,
            is_in_stock: true,
            is_featured,
            is_vegetarian: category_name === "Zeytinyağlılar" || category_name === "Salatalar",
            is_vegan: category_name === "Zeytinyağlılar" || category_name === "Salatalar",
            description: null
          });
        
        if (insertError) throw insertError;
      }
    }
    
    return { success: true, message: "Menü başarıyla güncellendi" };
  } catch (error: any) {
    console.error("Error seeding menu data:", error);
    return { success: false, error: error.message };
  }
};

// Utility function to format price
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: price % 1 === 0 ? 0 : 2
  }).format(price);
};
