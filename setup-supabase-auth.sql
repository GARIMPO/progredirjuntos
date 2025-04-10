-- Este SQL deve ser executado no Editor SQL do painel do Supabase

-- Habilitar a autenticação por email/senha
UPDATE auth.providers
SET enabled = true
WHERE provider_id = 'email';

-- Configurar as políticas de Row Level Security para a tabela auth.users
-- Certifique-se de que o esquema auth está ativado corretamente

-- Criar um usuário administrador se ele ainda não existir
-- IMPORTANTE: Essa parte deve ser executada pelo console administrativo do Supabase
-- Navegue até Authentication > Users > Invite User
-- E envie um convite para: marcosynoelia02@gmail.com
-- Ao receber o convite, defina a senha como: mutual2024

-- Se você preferir não enviar um convite por email, pode inserir diretamente:
-- (Isso não é recomendado para ambientes de produção, mas funciona para testes)
-- Execute o comando abaixo com o token do JWT que você pode obter no Painel do Supabase

/*
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  uuid_generate_v4(),
  'authenticated',
  'authenticated',
  'marcosynoelia02@gmail.com',
  crypt('mutual2024', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);
*/

-- Conectar o usuário auth com o perfil
-- Adicione esta trigger para criar automaticamente um perfil quando um usuário é criado
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, image, created_at)
  VALUES (
    new.id, 
    SPLIT_PART(new.email, '@', 1), -- Nome padrão baseado no email
    new.email,
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=2662&auto=format&fit=crop&ixlib=rb-4.0.3', -- Imagem padrão
    now()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 