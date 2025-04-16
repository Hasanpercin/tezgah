
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ReservationCalendarSidebar } from "./ReservationCalendarSidebar";
import { ReservationContent } from "./ReservationContent";
import { useReservations } from "./hooks/useReservations";
import { Reservation, ReservationStatus } from "./types";

export const ReservationsPanel = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();
  const { reservations, isLoading, error, mutate, updateReservationStatus } = useReservations(selectedDate);

  const handleStatusChange = async (id: string, newStatus: ReservationStatus) => {
    try {
      // updateReservationStatus fonksiyonunu kullanıyoruz
      const success = await updateReservationStatus(id, newStatus);
      
      if (!success) throw new Error("Status update failed");
      
      // Başarılı güncelleme durumunda otomatik olarak mutate edilecek (hook içinde)
      
    } catch (error: any) {
      console.error("Error updating reservation status:", error.message);
      toast({
        title: "Hata",
        description: "Durum güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <ReservationCalendarSidebar 
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        reservations={reservations}
      />
      
      <ReservationContent 
        reservations={reservations}
        isLoading={isLoading}
        error={error}
        selectedDate={selectedDate}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

// Export the Reservation type for use in other components
export type { Reservation } from './types';
export type { ReservationStatus } from './types';
