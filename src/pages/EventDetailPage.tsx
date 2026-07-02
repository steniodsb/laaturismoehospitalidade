import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Calendar, ArrowLeft, X, ChevronLeft, ChevronRight } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";

interface EventFull {
  id: string;
  name: string;
  image_url: string | null;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  event_type: string | null;
  gallery: { url: string; caption?: string }[] | null;
  city: { name: string; slug: string } | null;
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
};

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("events")
      .select("id, name, image_url, description, start_date, end_date, event_type, gallery, city:cities(name, slug)")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        if (data) setEvent(data as unknown as EventFull);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">Carregando...</p></div>;
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-sans font-normal text-foreground mb-4">Evento não encontrado</h1>
          <Link to="/eventos" className="text-primary font-medium hover:underline">← Voltar para eventos</Link>
        </div>
      </div>
    );
  }

  const gallery = Array.isArray(event.gallery) ? event.gallery : [];
  const allImages = gallery.length > 0 ? gallery : [{ url: event.image_url || "/placeholder.svg", caption: event.name }];
  const cityName = event.city?.name || "";

  return (
    <div className="min-h-screen">
      {/* Banner */}
      <section className="relative h-[45vh] min-h-[280px] max-h-[450px] overflow-hidden">
        <img src={event.image_url || "/placeholder.svg"} alt={event.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0">
          <div className="container pb-8">
            <Link to="/eventos" className="inline-flex items-center gap-1 text-sm text-background/70 hover:text-background mb-3 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Todos os eventos
            </Link>
            {event.event_type && (
              <div className="mb-2">
                <span className="inline-flex items-center gap-1 bg-primary/90 text-primary-foreground text-xs font-medium px-2.5 py-1 rounded-full">
                  {event.event_type}
                </span>
              </div>
            )}
            <h1 className="text-3xl md:text-4xl font-sans font-normal text-background mb-2">{event.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-background/70 text-sm">
              {event.start_date && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-primary" />
                  {formatDate(event.start_date)}
                  {event.end_date && event.end_date !== event.start_date && ` até ${formatDate(event.end_date)}`}
                </span>
              )}
              {cityName && (
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4 text-secondary" /> {cityName}</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Thumbnails */}
      {allImages.length > 1 && (
        <section className="bg-muted/50 border-b border-border">
          <div className="container py-4">
            <div className="flex gap-3 overflow-x-auto pb-2">
              {allImages.map((img, i) => (
                <button key={i} onClick={() => { setGalleryIndex(i); setGalleryOpen(true); }} className="relative flex-shrink-0 w-28 h-20 rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-colors">
                  <img src={img.url} alt={img.caption || `Foto ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="py-10 md:py-14">
        <div className="container max-w-3xl">
          {event.description && (
            <div>
              <h2 className="text-2xl font-sans font-normal text-foreground mb-4">Sobre o evento</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{event.description}</p>
            </div>
          )}

          {event.city && (
            <div className="mt-8 pt-8 border-t border-border">
              <Link to={`/cidades/${event.city.slug}`} className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
                <MapPin className="h-4 w-4" /> Ver mais sobre {event.city.name}
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Gallery Modal */}
      {galleryOpen && (
        <div className="fixed inset-0 z-[100] bg-foreground/95 flex items-center justify-center">
          <button onClick={() => setGalleryOpen(false)} className="absolute top-4 right-4 text-background/70 hover:text-background z-10"><X className="h-8 w-8" /></button>
          <button onClick={() => setGalleryIndex((prev) => (prev - 1 + allImages.length) % allImages.length)} className="absolute left-4 text-background/70 hover:text-background z-10"><ChevronLeft className="h-10 w-10" /></button>
          <button onClick={() => setGalleryIndex((prev) => (prev + 1) % allImages.length)} className="absolute right-4 text-background/70 hover:text-background z-10"><ChevronRight className="h-10 w-10" /></button>
          <div className="max-w-4xl max-h-[80vh] w-full px-16">
            <img src={allImages[galleryIndex].url} alt={allImages[galleryIndex].caption || ""} className="w-full h-full object-contain rounded-lg" />
            {allImages[galleryIndex].caption && <p className="text-center text-background/70 mt-4 text-sm">{allImages[galleryIndex].caption}</p>}
            <p className="text-center text-background/50 mt-2 text-xs">{galleryIndex + 1} / {allImages.length}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetailPage;
