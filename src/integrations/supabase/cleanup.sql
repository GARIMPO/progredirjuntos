-- Este SQL é para verificar e limpar perfis duplicados no Supabase

-- 1. Primeiro, vamos verificar quais perfis existem no banco de dados
SELECT * FROM profiles;

-- 2. Para verificar se há perfis duplicados (com mesmo e-mail)
SELECT email, COUNT(*) 
FROM profiles 
GROUP BY email 
HAVING COUNT(*) > 1;

-- 3. Se necessário, mantenha apenas um perfil para cada e-mail (preservando o mais recente)
-- ATENÇÃO: Faça backup antes de executar o DELETE abaixo!
/*
DELETE FROM profiles
WHERE id IN (
  SELECT id 
  FROM (
    SELECT id, email, ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at DESC) as row_num
    FROM profiles
  ) subquery
  WHERE row_num > 1
);
*/

-- 4. Também podemos verificar se há perfis que não estão associados a usuários autenticados
/*
SELECT p.id, p.name, p.email
FROM profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE u.id IS NULL;
*/

-- 5. Para remover perfis órfãos (que não têm usuário autenticado correspondente)
/*
DELETE FROM profiles
WHERE id IN (
  SELECT p.id
  FROM profiles p
  LEFT JOIN auth.users u ON p.id = u.id
  WHERE u.id IS NULL
);
*/ 