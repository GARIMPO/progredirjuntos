-- Remover a tabela profiles existente e todas as suas dependências
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Recriar a tabela profiles com a estrutura correta
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    image TEXT DEFAULT '/placeholder.svg',
    phone TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Desabilitar RLS temporariamente
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Remover todas as políticas existentes
DROP POLICY IF EXISTS "Perfis são visíveis para todos" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem inserir perfis" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar perfis" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem deletar perfis" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON public.profiles;
DROP POLICY IF EXISTS "Enable delete for users based on id" ON public.profiles;
DROP POLICY IF EXISTS "Enable all operations for profiles" ON public.profiles;

-- Criar uma única política que permite todas as operações
CREATE POLICY "Enable all operations for profiles"
    ON public.profiles
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Reabilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Inserir dados iniciais com UUIDs válidos
INSERT INTO public.profiles (id, name, image, phone, email)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Maria', '/placeholder.svg', NULL, NULL),
    ('22222222-2222-2222-2222-222222222222', 'João', '/placeholder.svg', NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- Verificar a estrutura final da tabela
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM 
    information_schema.columns 
WHERE 
    table_name = 'profiles' 
    AND table_schema = 'public'; 