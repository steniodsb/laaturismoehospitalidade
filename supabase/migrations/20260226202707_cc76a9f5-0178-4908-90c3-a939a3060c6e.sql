
-- Add featured flags and display order
ALTER TABLE public.cities ADD COLUMN is_featured BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.cities ADD COLUMN display_order INTEGER NOT NULL DEFAULT 0;

ALTER TABLE public.establishments ADD COLUMN is_featured BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.establishments ADD COLUMN display_order INTEGER NOT NULL DEFAULT 0;

ALTER TABLE public.events ADD COLUMN is_featured BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.events ADD COLUMN display_order INTEGER NOT NULL DEFAULT 0;
