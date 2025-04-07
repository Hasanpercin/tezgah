
// Fix this file with proper TypeScript types for the reservation system

export interface Table {
  id: string | number;
  size: number;  // Changed from union type to number to match actual data
  type: 'window' | 'center' | 'corner' | 'booth';
  position_x: number;
  position_y: number;
  position?: {
    x: number;
    y: number;
  };
  available: boolean;
  label: string;
  name?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_path?: string;
  category_id?: string;
  is_in_stock?: boolean;
}

export interface FixMenuOption {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_path?: string;
  quantity?: number; // Added quantity field
}

export interface ReservationFormData {
  name: string;
  email: string;
  phone: string;
  date: Date | null;
  time: string;
  guests: string;
  notes: string;
  occasion?: string;
}

export interface ReservationState {
  selectedTable: Table | null;
  selectedFixMenu: FixMenuOption | null;
  selectedALaCarteItems: { item: MenuItem, quantity: number }[];
  selectAtRestaurant: boolean;
  isPrePayment: boolean;
  transactionId: string | null;
  basicFormCompleted: boolean;
  formData: ReservationFormData;
}

// Define the steps for the reservation process
export const STEPS = [
  { id: 0, name: "Rezervasyon Bilgileri", icon: "Calendar" },
  { id: 1, name: "Masa Seçimi", icon: "Users" },
  { id: 2, name: "Menü Seçimi", icon: "Utensils" },
  { id: 3, name: "Özet & Ödeme", icon: "CreditCard" },
  { id: 4, name: "Onay", icon: "CheckCircle" }
];

export interface ReservationSummaryProps {
  state: ReservationState;
  calculateTotal: () => number;
  showPaymentInfo?: boolean;
}
