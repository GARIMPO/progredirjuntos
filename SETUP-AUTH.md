# Configuração da Autenticação no Supabase

Este guia ajudará você a configurar a autenticação no seu projeto Supabase para o aplicativo "Progredir Juntos".

## Passo 1: Habilitar Autenticação por Email/Senha

1. Acesse o [Painel do Supabase](https://app.supabase.io)
2. Selecione o seu projeto
3. Navegue até **Authentication** > **Providers**
4. Certifique-se de que o provider **Email** está habilitado
5. Desative a opção "Secure email verification" se quiser simplificar o processo para testes

## Passo 2: Criar um Usuário Administrador

### Opção 1: Usando o Painel de Administração (Recomendado)

1. Navegue até **Authentication** > **Users**
2. Clique em **Invite user**
3. Digite o email: `marcosynoelia02@gmail.com`
4. Após enviar o convite, verifique o email e defina a senha como `mutual2024`

### Opção 2: Usando SQL (Para usuários avançados)

Se você não quiser enviar um convite por email, você pode executar o SQL fornecido no arquivo `setup-supabase-auth.sql` no **SQL Editor** do Supabase, descomentando a parte do INSERT.

## Passo 3: Configurar a Conexão entre Auth e Profiles

1. Navegue até **SQL Editor**
2. Cole e execute a última parte do SQL fornecido no arquivo `setup-supabase-auth.sql` (a função `handle_new_user` e o trigger)
3. Isso garantirá que quando um usuário se registrar, um perfil será criado automaticamente

## Passo 4: Políticas de Segurança RLS

Garanta que suas tabelas tenham as políticas de segurança Row Level Security (RLS) adequadas:

```sql
-- Para permitir acesso de leitura aos perfis
CREATE POLICY "Profiles are publicly accessible"
ON public.profiles
FOR SELECT
USING (true);

-- Para permitir que os usuários atualizem seus próprios perfis
CREATE POLICY "Users can update their own profiles"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);
```

## Testando

Após configurar, você deverá ser capaz de fazer login no aplicativo usando:

- **Email**: marcosynoelia02@gmail.com
- **Senha**: mutual2024

## Solução de Problemas

- Se ocorrer o erro "User not found" ao tentar fazer login, verifique se o usuário foi criado corretamente no painel do Supabase.
- Se ocorrer o erro "Invalid login credentials", verifique se a senha está correta.
- Se ocorrer erros de "permission denied", verifique as políticas RLS.

## Observações

- Este método cria um único usuário fixo para a aplicação conforme solicitado.
- Para um ambiente de produção, recomenda-se implementar um sistema de registro/recuperação de senha completo. 