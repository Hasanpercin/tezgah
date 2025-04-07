
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Reservation } from '../types';

export const useReservations = (selectedDate: Date | undefined) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchReservations = async () => {
    if (!selectedDate) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .eq('date', formattedDate)
        .order('time', { ascending: true });

      if (error) {
        throw error;
      }
      
      const formattedReservations: Reservation[] = data.map(res => ({
        id: res.id,
        name: res.name || '',
        email: res.email || '',
        phone: res.phone || '',
        date: new Date(res.date),
        time: res.time,
        guests: String(res.guests),
        status: res.status,
        occasion: res.occasion,
        notes: res.notes || '',
        has_prepayment: res.has_prepayment,
        total_amount: res.total_amount
      }));

      setReservations(formattedReservations);
    } catch (err) {
      console.error('Error fetching reservations:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch reservations when selectedDate changes
  useEffect(() => {
    fetchReservations();
  }, [selectedDate]);

  // Return the data and a function to refresh it
  return {
    reservations,
    isLoading,
    error,
    mutate: fetchReservations
  };
};
