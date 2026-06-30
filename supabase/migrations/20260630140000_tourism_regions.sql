-- Regiões Turísticas: páginas regionais com cidades (vídeo + fotos),
-- bloco de informações e documentos institucionais.

CREATE TABLE public.tourism_regions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  information text,
  cover_image_url text,
  address text,
  contact text,
  email text,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Cidades dentro da região (cada coluna "CIDADE" do esboço, com seu vídeo)
CREATE TABLE public.tourism_region_cities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  region_id uuid NOT NULL REFERENCES public.tourism_regions(id) ON DELETE CASCADE,
  name text NOT NULL,
  video_url text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_tr_cities_region ON public.tourism_region_cities(region_id);

-- Fotos de cada cidade da região
CREATE TABLE public.tourism_region_city_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  region_city_id uuid NOT NULL REFERENCES public.tourism_region_cities(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_tr_city_photos_city ON public.tourism_region_city_photos(region_city_id);

-- Documentos institucionais (estatuto, atas, listas, planos, prestação de contas, outros)
CREATE TABLE public.tourism_region_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  region_id uuid NOT NULL REFERENCES public.tourism_regions(id) ON DELETE CASCADE,
  category text NOT NULL DEFAULT 'outros',
  label text NOT NULL,
  file_url text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_tr_documents_region ON public.tourism_region_documents(region_id);

-- RLS: leitura pública, escrita só admin (mesmo padrão das demais tabelas)
ALTER TABLE public.tourism_regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tourism_region_cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tourism_region_city_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tourism_region_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tourism regions are viewable by everyone"
  ON public.tourism_regions FOR SELECT USING (true);
CREATE POLICY "Admins can manage tourism regions"
  ON public.tourism_regions FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Tourism region cities are viewable by everyone"
  ON public.tourism_region_cities FOR SELECT USING (true);
CREATE POLICY "Admins can manage tourism region cities"
  ON public.tourism_region_cities FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Tourism region city photos are viewable by everyone"
  ON public.tourism_region_city_photos FOR SELECT USING (true);
CREATE POLICY "Admins can manage tourism region city photos"
  ON public.tourism_region_city_photos FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Tourism region documents are viewable by everyone"
  ON public.tourism_region_documents FOR SELECT USING (true);
CREATE POLICY "Admins can manage tourism region documents"
  ON public.tourism_region_documents FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role));
