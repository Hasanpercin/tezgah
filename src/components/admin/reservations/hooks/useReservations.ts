
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Reservation, ReservationStatus, SelectedItems } from "../types";

// Convert raw Supabase data to strong typed Reservation objects
const mapToReservations = (data: any[]): Reservation[] => {
  return data.map(item => {
    // Properly convert the selected_items JSON data to the expected SelectedItems type
    const selectedItems: SelectedItems | undefined = item.selected_items ? {
      menuSelectionType: item.selected_items.menuSelectionType || "at_restaurant",
      fixedMenuId: item.selected_items.fixedMenuId,
      items: item.selected_items.items || []
    } : undefined;
    
    return {
      id: item.id,
      user_id: item.user_id,
      name: item.name || "",
      email: item.email || "",
      phone: item.phone || "",
      date: new Date(item.date),
      time: item.time,
      guests: item.guests,
      status: item.status as ReservationStatus,
      notes: item.notes || "",
      occasion: item.occasion || "",
      selected_items: selectedItems,
      created_at: item.created_at,
      updated_at: item.updated_at
    };
  });
};

export const useReservations = (selectedDate?: Date) => {
  const fetchReservations = async () => {
    let query = supabase.from('reservations').select('*');
    
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      query = query.eq('date', dateString);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return mapToReservations(data || []);
  };

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['reservations', selectedDate?.toISOString()],
    queryFn: fetchReservations,
  });

  return {
    reservations: data || [],
    isLoading,
    error,
    mutate: refetch
  };
};
