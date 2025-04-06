
import { supabase } from "@/integrations/supabase/client";

export interface Table {
  id: string;
  name: string;
  type: 'window' | 'center' | 'corner' | 'booth';
  size: number;
  position_x: number;
  position_y: number;
  is_active: boolean;
}

export const fetchTables = async () => {
  const { data, error } = await supabase
    .from("tables")
    .select("*")
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
    // Supabase fonksiyonu çağırarak masanın uygunluğunu kontrol et
    const { data, error } = await supabase.rpc(
      'check_table_availability',
      {
        p_table_id: tableId,
        p_date: date.toISOString().split('T')[0],
        p_time: time
      }
    );
    
    if (error) {
      console.error("Availability check error:", error);
      throw error;
    }
    return data as boolean;
  } catch (err) {
    console.error("Error checking availability:", err);
    return false; // Hata durumunda false döndür
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
    console.log(`Fetching tables for date: ${date}, time: ${time}, guests: ${guests}`);
    
    // Önce tüm aktif masaları çek
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
    
    // Her masa için müsaitlik kontrolü yap
    const availabilityResults = await Promise.all(
      (tables as Table[]).map(async (table) => {
        try {
          const isAvailable = await checkTableAvailability(table.id, date, time);
          console.log(`Table ${table.name} availability: ${isAvailable}`);
          return {
            ...table,
            available: isAvailable
          };
        } catch (err) {
          console.error(`Error checking availability for table ${table.name}:`, err);
          return {
            ...table,
            available: false
          };
        }
      })
    );
    
    return availabilityResults;
  } catch (err) {
    console.error("Error in fetchTablesByAvailability:", err);
    return [];
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
