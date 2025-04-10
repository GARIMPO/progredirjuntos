-- Remover políticas existentes
DROP POLICY IF EXISTS "Perfis são visíveis para todos" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios perfis" ON public.profiles;

-- Criar novas políticas
CREATE POLICY "Perfis são visíveis para todos"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Usuários podem inserir perfis"
    ON public.profiles FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Usuários podem atualizar perfis"
    ON public.profiles FOR UPDATE
    USING (true);

CREATE POLICY "Usuários podem deletar perfis"
    ON public.profiles FOR DELETE
    USING (true); 