-- Adicionar colunas que faltam na tabela profiles
ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS phone TEXT,
    ADD COLUMN IF NOT EXISTS email TEXT;

-- Atualizar a estrutura da tabela
ALTER TABLE public.profiles
    ALTER COLUMN id TYPE UUID USING id::UUID,
    ALTER COLUMN id SET DEFAULT uuid_generate_v4(),
    ALTER COLUMN name SET NOT NULL,
    ALTER COLUMN image SET DEFAULT '/placeholder.svg',
    ALTER COLUMN created_at SET DEFAULT timezone('utc'::text, now());

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

-- Desabilitar RLS temporariamente
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Criar novas políticas simplificadas
CREATE POLICY "Enable all operations for profiles"
    ON public.profiles
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Reabilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

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