-- Contatos/links de ação para eventos:
-- - whatsapp: número (só dígitos, com DDI) para o botão de WhatsApp
-- - external_url: link externo (inscrição, ingressos ou site oficial do evento)
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS whatsapp text;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS external_url text;
