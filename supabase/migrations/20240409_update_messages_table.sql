-- Primeiro, remover todas as políticas existentes
DROP POLICY IF EXISTS "Mensagens são visíveis para todos" ON public.messages;
DROP POLICY IF EXISTS "Usuários podem enviar mensagens" ON public.messages;
DROP POLICY IF EXISTS "Usuários podem atualizar mensagens" ON public.messages;
DROP POLICY IF EXISTS "Usuários podem excluir mensagens" ON public.messages;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.messages;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.messages;
DROP POLICY IF EXISTS "Enable update for users based on id" ON public.messages;
DROP POLICY IF EXISTS "Enable delete for users based on id" ON public.messages;
DROP POLICY IF EXISTS "Usuários podem ver suas mensagens" ON public.messages;

-- Desabilitar RLS temporariamente
ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;

-- Agora podemos alterar as colunas
ALTER TABLE public.messages
    ALTER COLUMN id TYPE UUID USING id::UUID,
    ALTER COLUMN id SET DEFAULT uuid_generate_v4(),
    ALTER COLUMN sender_id TYPE UUID USING sender_id::UUID,
    ALTER COLUMN receiver_id TYPE UUID USING receiver_id::UUID,
    ALTER COLUMN content SET NOT NULL,
    ALTER COLUMN timestamp SET DEFAULT timezone('utc'::text, now());

-- Criar novas políticas de segurança
-- Remetente e destinatário podem ver suas mensagens
CREATE POLICY "Usuários podem ver suas mensagens"
    ON public.messages FOR SELECT
    USING (
        auth.uid()::text = receiver_id::text OR 
        auth.uid()::text = sender_id::text
    );

-- Qualquer usuário pode enviar mensagens
CREATE POLICY "Usuários podem enviar mensagens"
    ON public.messages FOR INSERT
    WITH CHECK (true);

-- Apenas o remetente pode atualizar suas próprias mensagens
CREATE POLICY "Remetente pode atualizar mensagens"
    ON public.messages FOR UPDATE
    USING (auth.uid()::text = sender_id::text)
    WITH CHECK (auth.uid()::text = sender_id::text);

-- Apenas o remetente pode excluir suas próprias mensagens
CREATE POLICY "Remetente pode excluir mensagens"
    ON public.messages FOR DELETE
    USING (auth.uid()::text = sender_id::text);

-- Reabilitar RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Verificar a estrutura final da tabela
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