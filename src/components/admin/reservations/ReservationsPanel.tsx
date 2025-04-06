
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ReservationCalendarSidebar } from "./ReservationCalendarSidebar";
import { ReservationContent } from "./ReservationContent";
import { useReservations } from "./hooks/useReservations";
import { Reservation, ReservationStatus } from "./types";

type ReservationsPanelProps = {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  onStatusChange: (id: string, newStatus: ReservationStatus) => void;
};

export const ReservationsPanel = ({
  selectedDate,
  onSelectDate,
  onStatusChange
}: ReservationsPanelProps) => {
  const { reservations, isLoading, error } = useReservations(selectedDate);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <ReservationCalendarSidebar 
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
        reservations={reservations}
      />
      
      <ReservationContent 
        reservations={reservations}
        isLoading={isLoading}
        error={error}
        selectedDate={selectedDate}
        onStatusChange={onStatusChange}
      />
    </div>
  );
};

// Export the Reservation type for use in other components
export type { Reservation } from './types';
export type { ReservationStatus } from './types';
