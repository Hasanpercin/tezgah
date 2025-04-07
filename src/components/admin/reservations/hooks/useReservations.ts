import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Reservation, ReservationStatus } from "../types";

export const useReservations = (selectedDate: Date | undefined) => {
  const fetchReservations = async (): Promise<Reservation[]> => {
    if (!selectedDate) return [];
    
    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    
    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .eq("date", formattedDate)
      .order("time", { ascending: true });
    
    if (error) throw error;
    
    // Transform and validate the data to match Reservation type
    return data.map(item => ({
      ...item,
      // Ensure status is of type ReservationStatus
      status: item.status as ReservationStatus,
      // Convert date string to Date object
      date: new Date(item.date),
      // Ensure guests is a number
      guests: Number(item.guests),
      // Keep other fields as is - updated Reservation type now matches DB schema
    })) as Reservation[];
  };
  
  const {
    data = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["reservations", selectedDate ? format(selectedDate, "yyyy-MM-dd") : "no-date"],
    queryFn: fetchReservations,
    enabled: !!selectedDate,
  });
  
  // Function to refresh data
  const mutate = () => {
    refetch();
  };
  
  return { reservations: data, isLoading, error, mutate };
};
