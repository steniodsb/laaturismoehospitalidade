import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { MapPin, Users, Calendar, ArrowLeft, Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import EstablishmentCard, { type EstablishmentData } from "@/components/EstablishmentCard";
import EventCard, { type EventData } from "@/components/EventCard";
import SectionHeader from "@/components/SectionHeader";

interface CityFull {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  short_description: string | null;
  description: string | null;
  region: string | null;
  population: string | null;
  presentation_video_url: string | null;
  gallery: { url: string; caption?: string }[] | null;
}

const getYoutubeEmbedUrl = (url: string): string | null => {
  try {
    const u = new URL(url);
    let videoId: string | null = null;
    if (u.hostname.includes("youtu.be")) {
      videoId = u.pathname.slice(1);
    } else if (u.hostname.includes("youtube.com")) {
      videoId = u.searchParams.get("v");
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch {
    return null;
  }
};

const CityDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [city, setCity] = useState<CityFull | null>(null);
  const [establishments, setEstablishments] = useState<EstablishmentData[]>([]);
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  useEffect(() => {
    if (!slug) return;
    const load = async () => {
      setLoading(true);
      const { data: c } = await supabase.from("cities").select("*").eq("slug", slug).single();
      if (c) {
        setCity(c as unknown as CityFull);
        const [estRes, evtRes] = await Promise.all([
          supabase.from("establishments").select("id, name, image_url, short_description, amenities, rating, category:categories(name, icon, slug), city:cities(name)").eq("city_id", c.id).eq("is_active", true).order("display_order"),
          supabase.from("events").select("id, name, image_url, description, start_date, end_date, event_type, city:cities(name)").eq("city_id", c.id).eq("is_active", true).order("start_date"),
        ]);
        if (estRes.data) setEstablishments(estRes.data as unknown as EstablishmentData[]);
        if (evtRes.data) setEvents(evtRes.data as unknown as EventData[]);
      }
      setLoading(false);
    };
    load();
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">Carregando...</p></div>;
  }

  if (!city) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-sans font-normal text-foreground mb-4">Cidade não encontrada</h1>
          <Link to="/cidades" className="text-primary font-medium hover:underline">← Voltar para cidades</Link>
        </div>
      </div>
    );
  }

  const gallery = Array.isArray(city.gallery) ? city.gallery : [];

  return (
    <div className="min-h-screen">
      <section className="relative h-[50vh] min-h-[300px] max-h-[500px] overflow-hidden">
        <img src={city.image_url || "/placeholder.svg"} alt={city.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0">
          <div className="container pb-8">
            <Link to="/cidades" className="inline-flex items-center gap-1 text-sm text-background/70 hover:text-background mb-3 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Todas as cidades
            </Link>
            <h1 className="text-4xl md:text-5xl font-sans font-normal text-background mb-2">{city.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-background/70 text-sm">
              {city.region && <span className="flex items-center gap-1"><MapPin className="h-4 w-4 text-primary" /> {city.region}</span>}
              {city.population && <span className="flex items-center gap-1"><Users className="h-4 w-4 text-secondary" /> {city.population} hab.</span>}
            </div>
          </div>
        </div>
      </section>

      {city.description && (
        <section className="py-10 md:py-14">
          <div className="container max-w-3xl">
            <p className="text-lg text-muted-foreground leading-relaxed">{city.description}</p>
          </div>
        </section>
      )}

      {gallery.length > 0 && (
        <section className="py-10 md:py-14">
          <div className="container">
            <h2 className="text-2xl font-sans font-normal text-foreground mb-6">Galeria de fotos</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {gallery.map((img, i) => (
                <button key={i} onClick={() => { setGalleryIndex(i); setGalleryOpen(true); }} className="relative aspect-[4/3] rounded-lg overflow-hidden border border-border group/photo">
                  <img src={img.url} alt={img.caption || `${city.name} - foto ${i + 1}`} className="w-full h-full object-cover group-hover/photo:scale-105 transition-transform duration-500" loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {city.presentation_video_url && (() => {
        const embedUrl = getYoutubeEmbedUrl(city.presentation_video_url);
        return embedUrl ? (
          <section className="py-10 md:py-14 bg-muted/30">
            <div className="container max-w-3xl">
              <h2 className="text-2xl font-sans font-normal text-foreground mb-6 flex items-center gap-2">
                <Play className="h-5 w-5 text-primary" /> Conheça o município
              </h2>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-card">
                <iframe
                  src={embedUrl}
                  title={`Apresentação de ${city.name}`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </section>
        ) : (
          <section className="py-10 md:py-14 bg-muted/30">
            <div className="container max-w-3xl">
              <h2 className="text-2xl font-sans font-normal text-foreground mb-4 flex items-center gap-2">
                <Play className="h-5 w-5 text-primary" /> Conheça o município
              </h2>
              <a
                href={city.presentation_video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
              >
                <Play className="h-4 w-4" /> Assistir apresentação
              </a>
            </div>
          </section>
        );
      })()}

      {events.length > 0 && (
        <section className="py-10 md:py-14 bg-muted/50">
          <div className="container">
            <SectionHeader title="Eventos" subtitle={`O que acontece em ${city.name}`} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {events.map((event) => <EventCard key={event.id} event={event} />)}
            </div>
          </div>
        </section>
      )}

      {establishments.length > 0 && (
        <section className="py-10 md:py-14">
          <div className="container">
            <SectionHeader title="Onde ir" subtitle="Hotéis, restaurantes e pontos turísticos" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {establishments.map((est) => <EstablishmentCard key={est.id} establishment={est} />)}
            </div>
          </div>
        </section>
      )}

      {establishments.length === 0 && events.length === 0 && (
        <section className="py-10 md:py-14">
          <div className="container text-center">
            <Calendar className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-muted-foreground">Em breve, novos estabelecimentos e eventos serão adicionados para {city.name}.</p>
          </div>
        </section>
      )}

      {galleryOpen && gallery.length > 0 && (
        <div className="fixed inset-0 z-[100] bg-foreground/95 flex items-center justify-center">
          <button onClick={() => setGalleryOpen(false)} className="absolute top-4 right-4 text-background/70 hover:text-background z-10"><X className="h-8 w-8" /></button>
          <button onClick={() => setGalleryIndex((prev) => (prev - 1 + gallery.length) % gallery.length)} className="absolute left-4 text-background/70 hover:text-background z-10"><ChevronLeft className="h-10 w-10" /></button>
          <button onClick={() => setGalleryIndex((prev) => (prev + 1) % gallery.length)} className="absolute right-4 text-background/70 hover:text-background z-10"><ChevronRight className="h-10 w-10" /></button>
          <div className="max-w-4xl max-h-[80vh] w-full px-16">
            <img src={gallery[galleryIndex].url} alt={gallery[galleryIndex].caption || ""} className="w-full h-full object-contain rounded-lg" />
            {gallery[galleryIndex].caption && <p className="text-center text-background/70 mt-4 text-sm">{gallery[galleryIndex].caption}</p>}
            <p className="text-center text-background/50 mt-2 text-xs">{galleryIndex + 1} / {gallery.length}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CityDetailPage;
