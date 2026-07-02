-- Campos extras para eventos:
-- - address: endereço/local do evento (texto livre, ex: "Praça Central, Centro")
-- - attractions: lista do que o evento terá de atrativo (array JSON de strings)
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS attractions jsonb NOT NULL DEFAULT '[]'::jsonb;
