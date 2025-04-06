// This file is now a wrapper that imports from the new component structure
// We're keeping it to maintain backward compatibility
import { ReservationsPanel as Reservations } from "./reservations/ReservationsPanel";
export { ReservationsPanel as default, type Reservation } from "./reservations/ReservationsPanel";
export const ReservationsPanel = Reservations;
