
export type Table = {
  id: number;
  type: 'window' | 'center' | 'corner' | 'booth';
  size: 2 | 4 | 6 | 8;
  position: { x: number; y: number };
  available: boolean;
  label: string;
};

export type FixMenuOption = {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'starter' | 'main' | 'dessert';
  image?: string;
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
