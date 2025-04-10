
import { supabase } from "@/integrations/supabase/client";

export interface Table {
  id: string;
  name: string;
  type: 'window' | 'center' | 'corner' | 'booth';
  size: number;
  position_x: number;
  position_y: number;
  is_active: boolean;
  available?: boolean;
}

export const fetchTables = async () => {
  const { data, error } = await supabase
    .from("tables")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true });
    
  if (error) throw error;
  return data as Table[];
};

// Check if the table is available based on new time-based reservation rules
export const checkTableAvailability = async (
  tableId: string, 
  date: Date, 
  time: string
) => {
  try {
    const formattedDate = date.toISOString().split('T')[0];
    
    // Parse the requested reservation time
    const [requestHour, requestMinute] = time.split(':').map(Number);
    const requestTimeInMinutes = requestHour * 60 + requestMinute;
    
    // Get all reservations for this table on the given date
    const { data, error } = await supabase
      .from("reservation_tables")
      .select(`
        reservation_id,
        reservations!inner(id, date, time, status)
      `)
      .eq("table_id", tableId)
      .eq("reservations.date", formattedDate)
      .neq("reservations.status", "İptal");
    
    if (error) {
      console.error("Table availability check error:", error);
      throw error;
    }
    
    // If there are no reservations, the table is available
    if (!data || data.length === 0) {
      return true;
    }
    
    // Apply new time-based reservation rules
    
    // Rule 1: After 19:00, table is reserved for the whole night
    if (requestHour >= 19) {
      // Check if there's any other reservation on the same date
      const hasEveningReservation = data.some(res => {
        if (res.reservations) {
          const [resHour] = res.reservations.time.split(':').map(Number);
          return resHour >= 19;
        }
        return false;
      });
      
      // If there's already an evening reservation, table is not available
      if (hasEveningReservation) {
        return false;
      }
    }
    
    // Rule 2: Before 16:00, table is reserved for 4 hours
    // Rule 3: After a reservation, table becomes available again after 4 hours
    return !data.some(res => {
      if (res.reservations) {
        const [resHour, resMinute] = res.reservations.time.split(':').map(Number);
        const resTimeInMinutes = resHour * 60 + resMinute;
        
        // Calculate the time difference in minutes
        const timeDiffInMinutes = Math.abs(requestTimeInMinutes - resTimeInMinutes);
        
        // Check if the reservation time is within 4 hours (240 minutes) of an existing reservation
        if (timeDiffInMinutes < 240) {
          return true; // Conflict found
        }
        
        // Special handling for early reservations (before 16:00)
        if (resHour < 16) {
          // If the existing reservation is before 16:00 and the requested time is within 4 hours
          return requestTimeInMinutes < resTimeInMinutes + 240;
        }
      }
      return false;
    });
  } catch (err) {
    console.error("Error checking table availability:", err);
    return false; // Error case - assume unavailable to be safe
  }
};

export const fetchTablesByAvailability = async (
  date: Date | null, 
  time: string, 
  guests: number
) => {
  if (!date || !time) {
    return [];
  }

  try {
    console.log(`Fetching tables for date: ${date.toISOString()}, time: ${time}, guests: ${guests}`);
    
    // First get all active tables that can accommodate the party size
    const { data: tables = [], error } = await supabase
      .from("tables")
      .select("*")
      .gte("size", guests)
      .eq("is_active", true)
      .order("name", { ascending: true });
      
    if (error) {
      console.error("Error fetching tables:", error);
      throw error;
    }

    console.log(`Found ${tables.length} tables matching size criteria`);
    
    if (tables.length === 0) {
      return [];
    }
    
    // Check availability for each table with the new time-based rules
    const availableTables = await Promise.all(
      tables.map(async (table) => {
        const isAvailable = await checkTableAvailability(table.id, date, time);
        return {
          ...table,
          available: isAvailable
        };
      })
    );
    
    return availableTables;
  } catch (err) {
    console.error("Error in fetchTablesByAvailability:", err);
    throw err;
  }
};

export const reserveTable = async (
  reservationId: string,
  tableId: string
) => {
  const { data, error } = await supabase
    .from("reservation_tables")
    .insert({
      reservation_id: reservationId,
      table_id: tableId
    } as any);
    
  if (error) throw error;
  return data;
};
