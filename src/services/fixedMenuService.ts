
import { supabase } from "@/integrations/supabase/client";

export interface FixedMenuPackage {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_path: string | null;
  is_active: boolean;
}

export interface FixedMenuItem {
  id: string;
  package_id: string;
  menu_item_id: string;
  quantity: number;
  menu_item?: {
    name: string;
    description: string;
    price: number;
  };
}

export const fetchFixedMenus = async () => {
  const { data, error } = await supabase
    .from("fixed_menu_packages")
    .select("*")
    .eq("is_active", true);
    
  if (error) throw error;
  return data as FixedMenuPackage[];
};

export const fetchFixedMenuDetails = async (packageId: string) => {
  const { data, error } = await supabase
    .from("fixed_menu_items")
    .select(`
      *,
      menu_items (
        id, name, description, price
      )
    `)
    .eq("package_id", packageId);
    
  if (error) throw error;
  return data as FixedMenuItem[];
};

export const saveReservationFixedMenu = async (
  reservationId: string,
  fixedMenuId: string,
  quantity: number = 1
) => {
  const { data, error } = await supabase
    .from("reservation_fixed_menus")
    .insert({
      reservation_id: reservationId,
      fixed_menu_id: fixedMenuId,
      quantity
    });
    
  if (error) throw error;
  return data;
};
