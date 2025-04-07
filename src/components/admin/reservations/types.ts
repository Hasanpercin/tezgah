
export type ReservationStatus = "Onaylandı" | "Beklemede" | "İptal";

export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: Date;
  time: string;
  guests: string;
  status: ReservationStatus;
  occasion?: string;
  notes?: string;
  has_prepayment?: boolean;
  total_amount?: number;
}
