
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

export interface ReservationState {
  selectedTable: Table | null;
  basicFormCompleted: boolean;
  formData: ReservationFormData;
}

// Define the steps for the reservation process - removed menu and payment steps
export const STEPS = [
  { id: 0, name: "Rezervasyon Bilgileri", icon: "Calendar" },
  { id: 1, name: "Masa Seçimi", icon: "Users" },
  { id: 2, name: "Onay", icon: "CheckCircle" }
];

export interface ReservationSummaryProps {
  state: ReservationState;
  showPaymentInfo?: boolean;
}
