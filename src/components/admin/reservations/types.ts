
export type ReservationStatus = "Onaylandı" | "Beklemede" | "İptal";

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  quantity?: number;
}

export interface SelectedItems {
  menuSelectionType: "fixed_menu" | "a_la_carte" | "at_restaurant";
  fixedMenuId?: string | number;
  items?: MenuItem[];
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
  created_at: string;
  updated_at: string;
}

export interface ReservationsFilter {
  date?: Date;
  status?: ReservationStatus;
  search?: string;
}
