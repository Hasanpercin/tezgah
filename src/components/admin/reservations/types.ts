
export type ReservationStatus = "Onaylandı" | "Beklemede" | "İptal";

export interface Reservation {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  date: Date;
  time: string;
  guests: number;  // Changed from string to number to match database
  status: ReservationStatus;
  occasion?: string | null;
  notes?: string | null;
  has_prepayment?: boolean | null;
  total_amount?: number | null;
}
