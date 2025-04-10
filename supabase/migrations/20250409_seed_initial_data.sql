
-- Insert default profiles
INSERT INTO public.profiles (id, name, image)
VALUES 
  ('profile1', 'Maria', '/placeholder.svg'),
  ('profile2', 'João', '/placeholder.svg')
ON CONFLICT (id) DO NOTHING;

-- Add initial goals if none exist
INSERT INTO public.goals (title, objective, details)
SELECT 
  'Primeira Meta do Casal', 
  'Visitar 5 países em 2 anos', 
  'Vamos planejar uma viagem a cada 6 meses para conhecer novos lugares juntos.'
WHERE 
  NOT EXISTS (SELECT 1 FROM public.goals LIMIT 1);
