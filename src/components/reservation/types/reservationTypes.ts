
// Fix this file with proper TypeScript types for the reservation system

export interface Table {
  id: string | number;
  size: number;  // Using number type for size to match database
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

export interface ReservationFormData {
  name: string;
  email: string;
  phone: string;
  date: Date | null;
  time: string;
  guests: string; // Keep as string for form handling, convert to number when sending to API
  notes: string;
  occasion?: string;
}

// Update MenuItem to match the service interface
export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category_id: string;
  image_path?: string;
  quantity?: number;
  is_in_stock: boolean;
  display_order: number; // Changed from optional to required to match menuService.ts
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
  };
}

export interface FixedMenuItem {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  image_path?: string | null;
  quantity?: number;
}

export interface MenuSelectionData {
  type: 'fixed_menu' | 'a_la_carte' | 'at_restaurant';
  selectedFixedMenu?: FixedMenuItem | null;
  selectedMenuItems?: MenuItem[];
}

export interface PaymentInfo {
  transactionId?: string;
  isPaid: boolean;
  amount?: number;
  discountPercentage?: number;
  discountAmount?: number;
}

export interface ReservationState {
  selectedTable: Table | null;
  basicFormCompleted: boolean;
  formData: ReservationFormData;
  menuSelection: MenuSelectionData;
  payment?: PaymentInfo;
}

// Define the steps for the reservation process - add menu selection step
export const STEPS = [
  { id: 0, name: "Rezervasyon Bilgileri", icon: "Calendar" },
  { id: 1, name: "Masa Seçimi", icon: "Users" },
  { id: 2, name: "Menü Seçimi", icon: "Utensils" },
  { id: 3, name: "Ödeme", icon: "CreditCard" },
  { id: 4, name: "Onay", icon: "CheckCircle" }
];

export interface ReservationSummaryProps {
  state: ReservationState;
}

// Add StepIndicatorProps interface for the StepIndicator component
export interface StepIndicatorProps {
  currentStep: number;
  steps: Array<{
    id: number;
    name: string;
    icon: string;
  }>;
  skipStep?: number;
}
