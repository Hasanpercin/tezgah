
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Reservation } from "../types";

export const useReservations = (selectedDate: Date | undefined) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let query = supabase.from("reservations").select("*");
        
        if (selectedDate) {
          const dateString = format(selectedDate, 'yyyy-MM-dd');
          query = query.eq('date', dateString);
        }

        const { data, error } = await query.order('date', { ascending: true });
        
        if (error) {
          throw error;
        }

        console.log("Fetched reservations:", data);

        if (data) {
          const formattedReservations = data.map(res => ({
            ...res,
            date: new Date(res.date),
            guests: String(res.guests),
            name: res.name || "İsimsiz",
            email: res.email || "",
            phone: res.phone || "",
            status: res.status as "Onaylandı" | "Beklemede" | "İptal"
          })) as Reservation[];

          setReservations(formattedReservations);
        }
      } catch (error: any) {
        console.error("Error fetching reservations:", error);
        setError("Rezervasyonlar yüklenirken bir hata oluştu");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, [selectedDate]);

  const filteredReservations = selectedDate 
    ? reservations.filter(res => {
        const resDate = new Date(res.date);
        return resDate.toDateString() === selectedDate.toDateString();
      })
    : reservations;

  return {
    reservations: filteredReservations,
    isLoading,
    error
  };
};
