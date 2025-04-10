import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { MCP_CONFIG } from './mcp-config';

// Configuração do Supabase
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Supabase URL e ANON KEY são necessários');
}

console.log('Configurando cliente Supabase com:', {
  url: SUPABASE_URL,
  projectId: MCP_CONFIG.projectId,
  region: MCP_CONFIG.region
});

// Criar cliente do Supabase
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  }
});

// Testar conexão imediatamente
supabase
  .from('profiles')
  .select('*')
  .limit(1)
  .then(({ data, error }) => {
    if (error) {
      console.error('Erro na conexão inicial:', error);
    } else {
      console.log('Conexão inicial bem sucedida:', data);
    }
  })
  .catch(error => {
    console.error('Erro ao testar conexão inicial:', error);
  });
