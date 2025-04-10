
import { supabase } from "@/integrations/supabase/client";
import { MenuItem } from "@/components/reservation/types/reservationTypes";

export const fetchMenuItems = async () => {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("is_in_stock", true)
    .order('display_order', { ascending: true });
    
  if (error) {
    console.error("Error fetching menu items:", error);
    throw error;
  }
  
  return data as MenuItem[];
};

export const fetchMenuItemDetails = async (itemId: string) => {
  const { data, error } = await supabase
    .from("menu_items")
    .select(`
      *,
      menu_categories (
        id, name
      )
    `)
    .eq("id", itemId)
    .single();
    
  if (error) throw error;
  
  return data;
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
