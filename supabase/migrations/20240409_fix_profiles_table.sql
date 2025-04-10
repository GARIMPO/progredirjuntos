-- Verificar e corrigir a estrutura da tabela profiles
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

-- Desabilitar RLS temporariamente para fazer as correções
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Criar novas políticas
CREATE POLICY "Enable read access for all users"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for authenticated users only"
    ON public.profiles FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Enable update for users based on id"
    ON public.profiles FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable delete for users based on id"
    ON public.profiles FOR DELETE
    USING (true);

-- Reabilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Verificar se a tabela está correta
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