
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Reservation, ReservationStatus, SelectedItems } from "../types";
import { Json } from "@/integrations/supabase/types";

// Helper function to safely convert JSON data to SelectedItems type
const parseSelectedItems = (jsonData: Json | null): SelectedItems | undefined => {
  if (!jsonData) return undefined;
  
  try {
    // Handle object case
    if (typeof jsonData === 'object' && jsonData !== null && !Array.isArray(jsonData)) {
      return {
        menuSelectionType: (jsonData as any).menuSelectionType || "at_restaurant",
        fixedMenuId: (jsonData as any).fixedMenuId,
        items: (jsonData as any).items || []
      };
    }
    
    // Default
    return undefined;
  } catch (error) {
    console.error("Error parsing selected_items:", error);
    return undefined;
  }
}

// Convert raw Supabase data to strong typed Reservation objects
const mapToReservations = (data: any[]): Reservation[] => {
  return data.map(item => {
    // Properly convert the selected_items JSON data to the expected SelectedItems type
    const selectedItems = parseSelectedItems(item.selected_items);
    
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
