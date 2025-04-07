
export type Table = {
  id: string;
  type: 'window' | 'center' | 'corner' | 'booth';
  size: number;
  position_x: number;
  position_y: number;
  position: { x: number; y: number };  // Frontend gösterimi için
  available: boolean;
  label: string;
  name?: string;
};

export type FixMenuOption = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_path?: string | null;
};

export type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category_id: string;
  image_path?: string | null;
};

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

export const STEPS = [
  { id: 'details', name: 'Rezervasyon Detayları', icon: 'Calendar' },
  { id: 'table', name: 'Masa Seçimi', icon: 'Users' },
  { id: 'menu', name: 'Menü Seçimi', icon: 'Utensils' },
  { id: 'payment', name: 'Özet ve Ödeme', icon: 'CreditCard' },
  { id: 'confirmation', name: 'Onay', icon: 'CheckCircle' },
];
