-- Adicionar coluna wishlist como um array de strings
ALTER TABLE IF EXISTS profiles
  ADD COLUMN IF NOT EXISTS wishlist TEXT[] DEFAULT '{}';

-- Atualizar permissões para permitir atualização do wishlist
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Certificar-se de que todos perfis podem ser atualizados (incluindo o wishlist)
DROP POLICY IF EXISTS "Enable all operations for profiles" ON profiles;
CREATE POLICY "Enable all operations for profiles" ON profiles
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Verificar a estrutura atualizada da tabela
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'; 