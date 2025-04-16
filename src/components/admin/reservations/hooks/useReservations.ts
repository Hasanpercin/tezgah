
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Reservation, ReservationStatus, SelectedItems } from "../types";
import { Json } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  // Realtime subscription için state
  const [subscribed, setSubscribed] = useState(false);
  
  const fetchReservations = async () => {
    try {
      let query = supabase.from('reservations').select('*');
      
      if (selectedDate) {
        const dateString = selectedDate.toISOString().split('T')[0];
        query = query.eq('date', dateString);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return mapToReservations(data || []);
    } catch (error: any) {
      toast({
        title: "Veri çekme hatası",
        description: error.message || "Rezervasyonlar yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
      return [];
    }
  };

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['reservations', selectedDate?.toISOString()],
    queryFn: fetchReservations,
  });

  // Realtime güncellemeler için subscription
  useEffect(() => {
    if (subscribed) return;

    const channel = supabase
      .channel('reservations-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'reservations' }, 
        (payload) => {
          console.log('Supabase realtime update:', payload);
          refetch();
        }
      )
      .subscribe();
      
    setSubscribed(true);
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch, subscribed]);

  const updateReservationStatus = async (id: string, status: ReservationStatus) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ 
          status,
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Durum güncellendi",
        description: `Rezervasyon durumu ${status} olarak güncellendi.`,
      });
      
      // Veriyi manuel olarak refetch edelim (realtime olmama durumuna karşı)
      refetch();
      return true;
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message || "Rezervasyon durumu güncellenirken hata oluştu.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    reservations: data || [],
    isLoading,
    error,
    mutate: refetch,
    updateReservationStatus
  };
};
