
// Define the status types for reservations
export type ReservationStatus = "Onaylandı" | "Beklemede" | "İptal";

// Define the main Reservation interface
export interface Reservation {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  date: Date;
  time: string;
  guests: number;  // Ensuring this is number type to match database
  status: ReservationStatus;
  occasion?: string | null;
  notes?: string | null;
  has_prepayment?: boolean | null;
  total_amount?: number | null;
  user_id: string;  // User ID is required
}
