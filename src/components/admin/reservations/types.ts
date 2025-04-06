
export type ReservationStatus = "Onaylandı" | "Beklemede" | "İptal";

export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: Date;
  time: string;
  guests: string;
  occasion?: string;
  notes?: string;
  status: ReservationStatus;
}
