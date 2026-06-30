import { useEffect, useMemo, useState } from "react";
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Photo {
  id: string;
  image_url: string;
  caption: string | null;
  display_order: number;
}

interface Album {
  id: string;
  title: string;
  event_date: string | null;
  display_order: number;
  about_album_photos: Photo[];
}

const formatDate = (date: string | null) => {
  if (!date) return "";
  return new Date(date + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
};

const SobrePage = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    supabase
      .from("about_albums")
      .select("id, title, event_date, display_order, about_album_photos(id, image_url, caption, display_order)")
      .eq("is_active", true)
      .order("event_date", { ascending: false, nullsFirst: false })
      .order("display_order")
      .then(({ data }) => {
        if (data) {
          const sorted = (data as unknown as Album[])
            .map((a) => ({
              ...a,
              about_album_photos: [...(a.about_album_photos || [])].sort((x, y) => x.display_order - y.display_order),
            }))
            .filter((a) => a.about_album_photos.length > 0);
          setAlbums(sorted);
        }
      });
  }, []);

  // Lista achatada de todas as fotos (na ordem em que aparecem) para o lightbox navegar.
  const flatPhotos = useMemo(() => albums.flatMap((a) => a.about_album_photos), [albums]);
  const total = flatPhotos.length;

  const prev = () => setLightbox((i) => (i !== null ? (i - 1 + total) % total : null));
  const next = () => setLightbox((i) => (i !== null ? (i + 1) % total : null));

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
    if (e.key === "Escape") setLightbox(null);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-secondary/5 to-background py-16 md:py-24">
        <div className="container text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-sans font-normal text-foreground mb-6">Quem Somos</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A <strong className="text-foreground">LAA Turismo &amp; Hospitalidade</strong> é uma associação dedicada a
            promover o turismo sustentável e a hospitalidade nas cidades do interior paulista. Conectamos viajantes a
            experiências autênticas — de hotéis e restaurantes a eventos culturais e atrativos naturais.
          </p>
        </div>
      </section>

      {/* Vídeo institucional */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-sans font-normal text-foreground mb-6 flex items-center gap-2">
            <Play className="h-6 w-6 text-primary" /> Vídeo institucional
          </h2>
          <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-card">
            <iframe
              src="https://www.youtube.com/embed/Yk1SlycxbrA"
              title="LAA Turismo & Hospitalidade — Vídeo institucional"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* Galeria por evento */}
      <section className="py-12 md:py-16">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-sans font-normal text-foreground mb-2">Nosso trabalho</h2>
          <p className="text-muted-foreground mb-10">Materiais de divulgação e participações da LAA Turismo &amp; Hospitalidade, organizados por evento</p>

          <div className="space-y-12">
            {albums.map((album, albumIdx) => {
              // índice global da primeira foto deste álbum na lista achatada
              const offset = albums.slice(0, albumIdx).reduce((sum, a) => sum + a.about_album_photos.length, 0);
              const dateLabel = formatDate(album.event_date);
              return (
                <div key={album.id}>
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 mb-5 pb-2 border-b border-border">
                    <h3 className="text-xl md:text-2xl font-sans font-normal text-foreground">{album.title}</h3>
                    {dateLabel && <span className="text-sm font-medium text-primary capitalize">{dateLabel}</span>}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3">
                    {album.about_album_photos.map((photo, i) => (
                      <button
                        key={photo.id}
                        onClick={() => setLightbox(offset + i)}
                        className="group relative aspect-square overflow-hidden rounded-lg shadow-sm hover:shadow-card-hover transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <img
                          src={photo.image_url}
                          alt={photo.caption || `${album.title} — foto ${i + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-300 rounded-lg" />
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}

            {albums.length === 0 && (
              <p className="text-center text-muted-foreground py-16">Galeria em atualização.</p>
            )}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && total > 0 && (
        <div
          className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
          onKeyDown={handleKey}
          tabIndex={0}
          role="dialog"
          aria-label="Galeria de fotos"
        >
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox(null); }}
            className="absolute top-4 right-4 text-background/80 hover:text-background transition-colors"
          >
            <X className="h-8 w-8" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 text-background/80 hover:text-background transition-colors p-2"
          >
            <ChevronLeft className="h-10 w-10" />
          </button>

          <img
            src={flatPhotos[lightbox].image_url}
            alt={flatPhotos[lightbox].caption || `Foto ${lightbox + 1}`}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 text-background/80 hover:text-background transition-colors p-2"
          >
            <ChevronRight className="h-10 w-10" />
          </button>

          <span className="absolute bottom-4 text-background/60 text-sm">
            {lightbox + 1} / {total}
          </span>
        </div>
      )}
    </div>
  );
};

export default SobrePage;
