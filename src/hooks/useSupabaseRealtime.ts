
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

type RealtimeProps = {
  table: string;
  schema?: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
};

type ChangePayload = RealtimePostgresChangesPayload<{
  [key: string]: any;
}>;

export const useSupabaseRealtime = ({
  table,
  schema = 'public',
  event = '*',
  filter,
}: RealtimeProps) => {
  const [payload, setPayload] = useState<ChangePayload | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Create a channel for the specific table changes
    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes' as any, // Use type assertion to resolve the type mismatch
        { event, schema, table, filter },
        (payload) => {
          console.log('Realtime change detected:', payload);
          // Cast the payload to unknown first and then to ChangePayload to satisfy TypeScript
          setPayload(payload as unknown as ChangePayload);
        }
      )
      .subscribe((status) => {
        console.log(`Supabase realtime subscription status:`, status);
        setIsConnected(status === 'SUBSCRIBED');
        
        if (status === 'CHANNEL_ERROR') {
          setError(new Error('Failed to connect to Supabase realtime'));
        } else if (status === 'SUBSCRIBED') {
          setError(null);
        }
      });

    return () => {
      console.log('Removing Supabase channel');
      supabase.removeChannel(channel);
    };
  }, [table, schema, event, filter]);

  return { payload, isConnected, error };
};
