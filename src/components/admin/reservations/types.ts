
import { Json } from "@/integrations/supabase/types";

export type ReservationStatus = 'Beklemede' | 'Onaylandı' | 'İptal';

export interface SelectedItems {
  menuSelectionType: 'fixed_menu' | 'a_la_carte' | 'at_restaurant';
  fixedMenuId?: string | number;
  items?: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}

export interface Reservation {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  date: Date;
  time: string;
  guests: number;
  status: ReservationStatus;
  notes?: string;
  occasion?: string;
  selected_items?: SelectedItems;
  has_prepayment?: boolean;
  total_amount?: number;
  created_at: string;
  updated_at: string;
}
