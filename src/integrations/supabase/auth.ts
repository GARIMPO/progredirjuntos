import { supabase } from './client';

// Função para fazer login com email/senha
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  
  return data;
}

// Função para verificar se o usuário está autenticado
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  
  if (error) throw error;
  
  return data.user;
}

// Função para fazer logout
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  
  if (error) throw error;
  
  return true;
}

// Função para ouvir mudanças de estado de autenticação
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
} 