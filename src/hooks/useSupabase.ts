import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export function useSupabase() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Testar conexão ao montar o hook
  useEffect(() => {
    async function checkConnection() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .limit(1);

        if (error) throw error;
        
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    }

    checkConnection();
  }, []);

  // Funções comuns do Supabase
  const getProfiles = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');
    
    if (error) throw error;
    return data;
  };

  const updateProfile = async (id: string, updates: Partial<Database['public']['Tables']['profiles']['Update']>) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  };

  return {
    loading,
    error,
    getProfiles,
    updateProfile,
    // Adicione mais funções conforme necessário
  };
} 