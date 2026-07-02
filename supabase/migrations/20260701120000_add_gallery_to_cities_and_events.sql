-- Galeria de fotos para cidades e eventos.
-- Mesma estrutura usada nos estabelecimentos: um array JSON de { url, caption? }.
-- Usado pelos formulários do admin (CitiesAdminPage / EventsAdminPage) e pelas
-- páginas de detalhe (CityDetailPage / EventDetailPage).
ALTER TABLE public.cities ADD COLUMN IF NOT EXISTS gallery jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS gallery jsonb NOT NULL DEFAULT '[]'::jsonb;
