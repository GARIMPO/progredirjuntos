-- Habilitar extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Configurar autenticação
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, image)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'image'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger para novos usuários
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Configurar funções de banco de dados
CREATE OR REPLACE FUNCTION public.get_user_profile(user_id UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  image TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.name, p.image, p.created_at
  FROM public.profiles p
  WHERE p.id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Configurar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_goals_created_at ON public.goals(created_at);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at);

-- Configurar funções de busca
CREATE OR REPLACE FUNCTION public.search_profiles(search_term TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  image TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.name, p.image
  FROM public.profiles p
  WHERE LOWER(p.name) LIKE LOWER('%' || search_term || '%');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Configurar funções para metas
CREATE OR REPLACE FUNCTION public.get_user_goals(user_id UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  objective TEXT,
  details TEXT,
  completed BOOLEAN,
  archived BOOLEAN,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT g.id, g.title, g.objective, g.details, g.completed, g.archived, g.created_at
  FROM public.goals g
  WHERE g.id IN (
    SELECT id FROM public.goals
    WHERE NOT archived
    ORDER BY created_at DESC
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 