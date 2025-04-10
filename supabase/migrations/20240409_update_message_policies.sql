-- Remover políticas existentes de mensagens
DROP POLICY IF EXISTS "Mensagens são visíveis para todos" ON public.messages;
DROP POLICY IF EXISTS "Usuários podem enviar mensagens" ON public.messages;
DROP POLICY IF EXISTS "Usuários podem atualizar mensagens" ON public.messages;
DROP POLICY IF EXISTS "Usuários podem excluir mensagens" ON public.messages;

-- Criar novas políticas de segurança para mensagens
-- Apenas o destinatário pode ver as mensagens
CREATE POLICY "Destinatário pode ver mensagens"
    ON public.messages FOR SELECT
    USING (auth.uid()::text = receiver_id);

-- Qualquer usuário pode enviar mensagens
CREATE POLICY "Usuários podem enviar mensagens"
    ON public.messages FOR INSERT
    WITH CHECK (true);

-- Apenas o remetente pode atualizar suas próprias mensagens
CREATE POLICY "Remetente pode atualizar mensagens"
    ON public.messages FOR UPDATE
    USING (auth.uid()::text = sender_id)
    WITH CHECK (auth.uid()::text = sender_id);

-- Apenas o remetente pode excluir suas próprias mensagens
CREATE POLICY "Remetente pode excluir mensagens"
    ON public.messages FOR DELETE
    USING (auth.uid()::text = sender_id); 