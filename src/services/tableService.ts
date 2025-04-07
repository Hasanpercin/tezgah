
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

export const checkTableAvailability = async (
  tableId: string, 
  date: Date, 
  time: string
) => {
  try {
    const formattedDate = date.toISOString().split('T')[0];
    
    // Check if the table is already reserved for this date and time
    // Using correct query structure for Supabase joins
    const { data, error } = await supabase
      .from("reservation_tables")
      .select(`
        reservation_id,
        reservations!inner(date, time, status)
      `)
      .eq("table_id", tableId)
      .eq("reservations.date", formattedDate)
      .eq("reservations.time", time)
      .neq("reservations.status", "İptal");
    
    if (error) {
      console.error("Table availability check error:", error);
      throw error;
    }
    
    // If there are no results, the table is available
    return data.length === 0;
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
    
    // Check availability for each table
    const formattedDate = date.toISOString().split('T')[0];
    
    // Get all reservations for this date and time
    const { data: reservations = [], error: reservationsError } = await supabase
      .from("reservations")
      .select("id, status")
      .eq("date", formattedDate)
      .eq("time", time)
      .neq("status", "İptal");
    
    if (reservationsError) {
      console.error("Error fetching reservations:", reservationsError);
      throw reservationsError;
    }
    
    if (reservations.length === 0) {
      // No reservations for this date/time, all tables are available
      return tables.map(table => ({ ...table, available: true }));
    }
    
    // Get all reserved tables for these reservations
    const reservationIds = reservations.map(res => res.id);
    const { data: reservedTables = [], error: reservedTablesError } = await supabase
      .from("reservation_tables")
      .select("table_id")
      .in("reservation_id", reservationIds);
    
    if (reservedTablesError) {
      console.error("Error fetching reserved tables:", reservedTablesError);
      throw reservedTablesError;
    }
    
    // Create a set of reserved table IDs for quick lookup
    const reservedTableIds = new Set(reservedTables.map(rt => rt.table_id));
    
    // Mark tables as available or not
    return tables.map(table => ({
      ...table,
      available: !reservedTableIds.has(table.id)
    }));
    
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
