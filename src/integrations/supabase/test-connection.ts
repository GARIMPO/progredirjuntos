import { supabase } from './client';

export async function testConnection() {
  try {
    console.log('Iniciando teste de conexão...');
    
    // Teste de conexão básica
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Erro detalhado:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      return false;
    }

    console.log('Conexão bem sucedida! Dados:', data);
    return true;
  } catch (error) {
    console.error('Erro ao testar conexão:', error);
    return false;
  }
} 