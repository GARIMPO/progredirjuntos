
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

type TableName = keyof Database['public']['Tables'];

/**
 * Hook for subscribing to realtime updates from a Supabase table
 */
export function useRealtimeSubscription<T extends TableName>(
  table: T, 
  callback: (payload: any) => void,
  events: ('INSERT' | 'UPDATE' | 'DELETE')[] = ['INSERT', 'UPDATE', 'DELETE']
) {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    // Create a new channel for the subscription
    const newChannel = supabase
      .channel(`public:${table}`)
      .on(
        'postgres_changes' as const, 
        { 
          event: events as any, 
          schema: 'public', 
          table 
        }, 
        (payload) => {
          console.log(`Realtime event for ${table}:`, payload);
          callback(payload);
        }
      )
      .subscribe((status) => {
        console.log(`Supabase realtime subscription status for ${table}:`, status);
      });

    setChannel(newChannel);

    // Cleanup function
    return () => {
      if (newChannel) {
        supabase.removeChannel(newChannel);
      }
    };
  }, [table, callback, JSON.stringify(events)]);

  return channel;
}

/**
 * Hook for fetching data from Supabase with loading and error states
 */
export function useSupabaseQuery<T extends TableName, R = any>(
  tableName: T,
  queryFn?: (query: any) => any,
) {
  const [data, setData] = useState<R | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let query = supabase.from(tableName).select('*');
        
        if (queryFn) {
          query = queryFn(query);
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw new Error(error.message);
        }
        
        setData(data as unknown as R);
      } catch (err) {
        console.error(`Error fetching data from ${tableName}:`, err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [tableName, queryFn]);
  
  return { data, loading, error };
}
