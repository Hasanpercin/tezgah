import { supabase } from "@/integrations/supabase/client";

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category_id: string;
  image_path?: string;
  quantity?: number;
  is_in_stock: boolean;
  display_order: number;
  ingredients?: string;
  allergens?: string;
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  is_gluten_free?: boolean;
  is_spicy?: boolean;
  is_featured?: boolean;
  menu_categories?: {
    name: string;
    id?: string;
    display_order?: number;
  };
  options?: MenuItemOption[];
  variants?: MenuItemVariant[];
}

export interface MenuItemOption {
  id: string;
  name: string;
  price_adjustment: number;
  is_required: boolean;
  min_selections?: number;
  max_selections?: number;
}

export interface MenuItemVariant {
  id: string;
  name: string;
  price_adjustment: number;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface FixedMenuItem {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  image_path?: string | null;
  quantity?: number;
}

export const fetchMenuItems = async () => {
  const { data, error } = await supabase
    .from("menu_items")
    .select(`
      *,
      menu_categories(*)
    `)
    .eq("is_in_stock", true)
    .order('display_order', { ascending: true });
    
  if (error) {
    console.error("Error fetching menu items:", error);
    throw error;
  }
  
  return data as MenuItem[];
};

export const fetchMenuItemDetails = async (itemId: string) => {
  try {
    const { data: itemData, error: itemError } = await supabase
      .from("menu_items")
      .select(`
        *,
        menu_categories (
          id, name
        )
      `)
      .eq("id", itemId)
      .single();
      
    if (itemError) throw itemError;
    
    const options: MenuItemOption[] = [];
    const variants: MenuItemVariant[] = [];
    
    return {
      ...itemData,
      options,
      variants
    } as MenuItem;
  } catch (error) {
    console.error("Error fetching menu item details:", error);
    throw error;
  }
};

export const saveReservationMenuItems = async (
  reservationId: string,
  menuItems: MenuItem[]
) => {
  const items = menuItems.map(item => ({
    reservation_id: reservationId,
    menu_item_id: item.id,
    quantity: item.quantity || 1
  }));
  
  const { data, error } = await supabase
    .from("reservation_menu_items")
    .insert(items);
    
  if (error) throw error;
  
  return data;
};

export const fetchMenuItemsByCategory = async () => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select(`
        *,
        menu_categories(*)
      `)
      .order('display_order', { ascending: true });

    if (error) throw error;
    
    return data.map(item => ({
      ...item,
      options: [],
      variants: []
    })) as MenuItem[];
  } catch (error) {
    console.error("Error in fetchMenuItemsByCategory:", error);
    throw error;
  }
};

export const fetchFeaturedMenuItems = async () => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select(`
        *,
        menu_categories(*)
      `)
      .eq('is_featured', true)
      .limit(6);

    if (error) throw error;
    
    return data.map(item => ({
      ...item,
      options: [],
      variants: []
    })) as MenuItem[];
  } catch (error) {
    console.error("Error in fetchFeaturedMenuItems:", error);
    throw error;
  }
};

export const updateFeaturedMenuItem = async (id: string, isFeatured: boolean) => {
  const { data, error } = await supabase
    .from('menu_items')
    .update({ is_featured: isFeatured })
    .eq('id', id);

  if (error) throw error;
  return data;
};

export const seedMenuData = async () => {
  return { success: true };
};

export const getFixedMenus = async () => {
  try {
    console.log("Fetching fixed menus from Supabase...");
    
    const { data, error } = await supabase
      .from("fixed_menu_packages")
      .select("*")
      .eq("is_active", true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching fixed menus:", error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log("No fixed menus found or data is empty");
    } else {
      console.log(`Successfully fetched ${data.length} fixed menus:`, data);
    }
    
    return data || [];
  } catch (error) {
    console.error("Exception while fetching fixed menus:", error);
    throw error;
  }
};
