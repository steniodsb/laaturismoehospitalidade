import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Calendar, ArrowLeft, X, ChevronLeft, ChevronRight, Sparkles, Navigation, Check, MessageCircle, Share2, CalendarPlus, ExternalLink } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import EstablishmentCard, { type EstablishmentData } from "@/components/EstablishmentCard";
import SectionHeader from "@/components/SectionHeader";

interface EventFull {
  id: string;
  name: string;
  image_url: string | null;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  event_type: string | null;
  address: string | null;
  attractions: string[] | null;
  whatsapp: string | null;
  external_url: string | null;
  gallery: { url: string; caption?: string }[] | null;
  city_id: string | null;
  city: { name: string; slug: string } | null;
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
};

// Data no formato YYYYMMDD (all-day) para o Google Agenda; o fim é exclusivo.
const toCalDate = (dateStr: string, addDays = 0) => {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + addDays);
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
};

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventFull | null>(null);
  const [related, setRelated] = useState<EstablishmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("events")
        .select("id, name, image_url, description, start_date, end_date, event_type, address, attractions, whatsapp, external_url, gallery, city_id, city:cities(name, slug)")
        .eq("id", id)
        .single();
      if (data) {
        setEvent(data as unknown as EventFull);
        if (data.city_id) {
          const { data: est } = await supabase
            .from("establishments")
            .select("id, name, image_url, short_description, amenities, rating, category:categories(name, icon, slug), city:cities(name)")
            .eq("city_id", data.city_id)
            .eq("is_active", true)
            .order("display_order")
            .limit(3);
          if (est) setRelated(est as unknown as EstablishmentData[]);
        }
      }
      setLoading(false);
    };
    load();
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
  const attractions = Array.isArray(event.attractions) ? event.attractions : [];
  const cityName = event.city?.name || "";
  const mapQuery = [event.address, cityName].filter(Boolean).join(", ");
  const whatsappDigits = (event.whatsapp || "").replace(/\D/g, "");

  const calendarUrl = event.start_date
    ? (() => {
        const params = new URLSearchParams({
          action: "TEMPLATE",
          text: event.name,
          dates: `${toCalDate(event.start_date)}/${toCalDate(event.end_date || event.start_date, 1)}`,
        });
        if (event.description) params.set("details", event.description);
        if (mapQuery) params.set("location", mapQuery);
        return `https://calendar.google.com/calendar/render?${params.toString()}`;
      })()
    : null;

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: event.name, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copiado para a área de transferência!");
      }
    } catch {
      /* compartilhamento cancelado pelo usuário */
    }
  };

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
          {/* Ações */}
          <div className="flex flex-wrap gap-3 mb-10">
            {whatsappDigits && (
              <a href={`https://wa.me/${whatsappDigits}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold px-4 py-2.5 rounded-lg hover:bg-[#20bd5a] transition-colors text-sm">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            )}
            {event.external_url && (
              <a href={event.external_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-colors text-sm">
                <ExternalLink className="h-4 w-4" /> Inscrição / Mais informações
              </a>
            )}
            {calendarUrl && (
              <a href={calendarUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2"><CalendarPlus className="h-4 w-4" /> Adicionar ao Google Agenda</Button>
              </a>
            )}
            <Button variant="outline" onClick={handleShare} className="gap-2"><Share2 className="h-4 w-4" /> Compartilhar</Button>
          </div>

          {event.description && (
            <div>
              <h2 className="text-2xl font-sans font-normal text-foreground mb-4">Sobre o evento</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{event.description}</p>
            </div>
          )}

          {attractions.length > 0 && (
            <div className="mt-10">
              <h2 className="text-2xl font-sans font-normal text-foreground mb-5 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" /> Atrativos do evento
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {attractions.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 bg-muted/40 rounded-lg px-4 py-3">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(event.address || cityName) && (
            <div className="mt-10">
              <h2 className="text-2xl font-sans font-normal text-foreground mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" /> Local
              </h2>
              {event.address && <p className="text-muted-foreground mb-4">{event.address}{cityName && ` — ${cityName}`}</p>}
              {mapQuery && (
                <>
                  <div className="rounded-xl overflow-hidden border border-border">
                    <iframe title="Localização do evento" width="100%" height="300" style={{ border: 0 }} loading="lazy" src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=15&output=embed`} />
                  </div>
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-4 text-primary font-medium hover:underline">
                    <Navigation className="h-4 w-4" /> Abrir no Google Maps
                  </a>
                </>
              )}
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

      {/* Estabelecimentos relacionados */}
      {related.length > 0 && (
        <section className="py-10 md:py-14 bg-muted/50">
          <div className="container">
            <SectionHeader title="Onde ir por perto" subtitle={cityName ? `Hospedagem e gastronomia em ${cityName}` : "Hospedagem e gastronomia na região"} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((est) => <EstablishmentCard key={est.id} establishment={est} />)}
            </div>
          </div>
        </section>
      )}

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
