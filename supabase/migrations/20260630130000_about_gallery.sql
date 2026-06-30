-- Galeria da página "Sobre / Quem Somos" organizada por evento/feira.
-- Cada álbum representa um evento (data + nome) e agrupa suas fotos.

-- Álbuns (eventos / feiras)
CREATE TABLE public.about_albums (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  event_date date,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Fotos de cada álbum
CREATE TABLE public.about_album_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id uuid NOT NULL REFERENCES public.about_albums(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  caption text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_about_album_photos_album ON public.about_album_photos(album_id);

-- RLS: leitura pública, escrita só admin (mesmo padrão das demais tabelas)
ALTER TABLE public.about_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_album_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "About albums are viewable by everyone"
  ON public.about_albums FOR SELECT USING (true);
CREATE POLICY "Admins can manage about albums"
  ON public.about_albums FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "About album photos are viewable by everyone"
  ON public.about_album_photos FOR SELECT USING (true);
CREATE POLICY "Admins can manage about album photos"
  ON public.about_album_photos FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Preserva as 74 fotos estáticas atuais num álbum inicial, para o cliente reorganizar.
INSERT INTO public.about_albums (title, display_order)
VALUES ('Acervo geral (organizar por evento)', 0);

INSERT INTO public.about_album_photos (album_id, image_url, display_order)
SELECT a.id, '/portfolio/foto-' || lpad(g::text, 2, '0') || '.jpg', g
FROM public.about_albums a, generate_series(1, 74) AS g
WHERE a.title = 'Acervo geral (organizar por evento)';
