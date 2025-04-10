-- Script para corrigir problemas na tabela de mensagens

-- 1. Verificar a estrutura atual da tabela
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM 
    information_schema.columns 
WHERE 
    table_name = 'messages' 
    AND table_schema = 'public';

-- 2. Verificar se existem mensagens na tabela
SELECT * FROM public.messages;

-- 3. Garantir que todas as políticas RLS estão corretas
DROP POLICY IF EXISTS "Usuários podem ver suas mensagens" ON public.messages;
DROP POLICY IF EXISTS "Remetente pode atualizar mensagens" ON public.messages;
DROP POLICY IF EXISTS "Remetente pode excluir mensagens" ON public.messages;
DROP POLICY IF EXISTS "Usuários podem enviar mensagens" ON public.messages;
DROP POLICY IF EXISTS "Destinatário pode ver mensagens" ON public.messages;

-- 4. Criar políticas simplificadas que permitem acesso total a usuários autenticados
CREATE POLICY "Permitir acesso total a usuários autenticados"
    ON public.messages FOR ALL
    USING (auth.role() = 'authenticated');

-- 5. Garantir que a REPLICA IDENTITY está configurada para permitir RT
ALTER TABLE public.messages REPLICA IDENTITY FULL;

-- 6. Verificar se a tabela está incluída na publicação de realtime
-- Primeiro, verificar se a tabela messages já está na publicação
SELECT * FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime' AND tablename = 'messages';

-- Recriar a publicação para garantir que a tabela messages está incluída
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE 
  public.goals,
  public.messages,
  public.profiles;

-- 7. Verificar e corrigir possíveis problemas com as chaves estrangeiras
ALTER TABLE public.messages DROP CONSTRAINT IF EXISTS messages_sender_id_fkey;
ALTER TABLE public.messages DROP CONSTRAINT IF EXISTS messages_receiver_id_fkey;

ALTER TABLE public.messages
ADD CONSTRAINT messages_sender_id_fkey
FOREIGN KEY (sender_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.messages
ADD CONSTRAINT messages_receiver_id_fkey
FOREIGN KEY (receiver_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Instruções para executar este script:
-- 1. Acesse o Dashboard do Supabase
-- 2. Vá para a seção SQL Editor
-- 3. Cole este script
-- 4. Execute as consultas uma a uma para diagnosticar e corrigir os problemas
-- 5. Verifique os resultados de cada consulta para identificar problemas específicos 