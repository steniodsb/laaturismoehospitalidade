import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DOCUMENT_CATEGORIES, toEmbedUrl } from "@/lib/regions";
import { MapPin, Mail, Phone, FileText, X, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";

interface Photo { id: string; image_url: string; display_order: number; }
interface City { id: string; name: string; video_url: string | null; display_order: number; tourism_region_city_photos: Photo[]; }
interface DocItem { id: string; category: string; label: string; file_url: string; display_order: number; }
interface Region {
  id: string; name: string; slug: string; description: string | null; information: string | null;
  cover_image_url: string | null; address: string | null; contact: string | null; email: string | null;
  tourism_region_cities: City[];
  tourism_region_documents: DocItem[];
}

const RegiaoDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [region, setRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    supabase
      .from("tourism_regions")
      .select("*, tourism_region_cities(*, tourism_region_city_photos(*)), tourism_region_documents(*)")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          const r = data as unknown as Region;
          r.tourism_region_cities = [...(r.tourism_region_cities || [])]
            .sort((a, b) => a.display_order - b.display_order)
            .map((c) => ({ ...c, tourism_region_city_photos: [...(c.tourism_region_city_photos || [])].sort((x, y) => x.display_order - y.display_order) }));
          r.tourism_region_documents = [...(r.tourism_region_documents || [])].sort((a, b) => a.display_order - b.display_order);
          setRegion(r);
        } else {
          setRegion(null);
        }
        setLoading(false);
      });
  }, [slug]);

  // Lista achatada de fotos para o lightbox.
  const flatPhotos = useMemo(
    () => (region?.tourism_region_cities || []).flatMap((c) => c.tourism_region_city_photos),
    [region]
  );
  const total = flatPhotos.length;
  const prev = () => setLightbox((i) => (i !== null ? (i - 1 + total) % total : null));
  const next = () => setLightbox((i) => (i !== null ? (i + 1) % total : null));
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
    if (e.key === "Escape") setLightbox(null);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Carregando...</div>;
  }

  if (!region) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Região não encontrada.</p>
        <Link to="/regioes" className="text-primary hover:underline inline-flex items-center gap-1"><ArrowLeft className="h-4 w-4" /> Ver todas as regiões</Link>
      </div>
    );
  }

  const offsetOf = (cityIdx: number) =>
    region.tourism_region_cities.slice(0, cityIdx).reduce((sum, c) => sum + c.tourism_region_city_photos.length, 0);

  return (
    <div className="min-h-screen">
      <div className="container py-8 md:py-12 space-y-8">
        <Link to="/regioes" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" /> Regiões Turísticas
        </Link>

        {/* REGIÃO TURÍSTICA */}
        <section className="text-center border border-border rounded-xl p-8 bg-gradient-to-br from-primary/5 via-secondary/5 to-background">
          <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-2">Região Turística</p>
          <h1 className="text-3xl md:text-4xl font-sans font-normal text-foreground">{region.name}</h1>
          {region.description && <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">{region.description}</p>}
        </section>

        {/* INFORMAÇÕES */}
        {region.information && (
          <section>
            <h2 className="text-xl md:text-2xl font-sans font-normal text-foreground mb-3 text-center">Informações</h2>
            <div className="max-w-3xl mx-auto text-muted-foreground leading-relaxed whitespace-pre-line">{region.information}</div>
          </section>
        )}

        {/* FOTOS / VÍDEOS */}
        {region.tourism_region_cities.length > 0 && (
          <section className="border border-border rounded-xl p-5 md:p-6">
            <h2 className="text-xl md:text-2xl font-sans font-normal text-foreground mb-6 text-center">Fotos / Vídeos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {region.tourism_region_cities.map((city, cityIdx) => {
                const embed = city.video_url ? toEmbedUrl(city.video_url) : "";
                const base = offsetOf(cityIdx);
                return (
                  <div key={city.id} className="border border-border rounded-lg overflow-hidden bg-card">
                    <div className="bg-primary/10 px-3 py-2 text-center font-semibold text-foreground">{city.name}</div>
                    {embed && (
                      <div className="aspect-video bg-black">
                        <iframe src={embed} title={`Vídeo ${city.name}`} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                      </div>
                    )}
                    {city.tourism_region_city_photos.length > 0 && (
                      <div className="grid grid-cols-3 gap-1 p-2">
                        {city.tourism_region_city_photos.map((photo, i) => (
                          <button
                            key={photo.id}
                            onClick={() => setLightbox(base + i)}
                            className="group relative aspect-square overflow-hidden rounded focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <img src={photo.image_url} alt={`${city.name} ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                          </button>
                        ))}
                      </div>
                    )}
                    {!embed && city.tourism_region_city_photos.length === 0 && (
                      <p className="text-xs text-muted-foreground text-center py-4">Sem mídia.</p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* INSTITUCIONAL */}
        {region.tourism_region_documents.length > 0 && (
          <section className="border border-border rounded-xl p-5 md:p-6 bg-muted/30">
            <h2 className="text-xl md:text-2xl font-sans font-normal text-foreground mb-5 text-center">Institucional</h2>
            <div className="space-y-4">
              {DOCUMENT_CATEGORIES.map((cat) => {
                const docs = region.tourism_region_documents.filter((d) => d.category === cat.value);
                if (docs.length === 0) return null;
                return (
                  <div key={cat.value}>
                    <h3 className="text-sm font-semibold text-foreground mb-2">{cat.label}</h3>
                    <div className="flex flex-wrap gap-2">
                      {docs.map((doc) => (
                        <a key={doc.id} href={doc.file_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border text-sm text-foreground hover:border-primary/40 hover:text-primary transition-colors">
                          <FileText className="h-3.5 w-3.5" /> {doc.label}
                        </a>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ENDEREÇO / CONTATOS / E-MAIL */}
        {(region.address || region.contact || region.email) && (
          <section className="border border-border rounded-xl p-5 md:p-6 text-sm text-muted-foreground space-y-1.5">
            {region.address && <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary shrink-0" /> <span><strong className="text-foreground">Endereço:</strong> {region.address}</span></p>}
            {region.contact && <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary shrink-0" /> <span><strong className="text-foreground">Contatos:</strong> {region.contact}</span></p>}
            {region.email && <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary shrink-0" /> <span><strong className="text-foreground">E-mail:</strong> {region.email}</span></p>}
          </section>
        )}
      </div>

      {/* Lightbox */}
      {lightbox !== null && total > 0 && (
        <div className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)} onKeyDown={handleKey} tabIndex={0} role="dialog" aria-label="Galeria de fotos">
          <button onClick={(e) => { e.stopPropagation(); setLightbox(null); }} className="absolute top-4 right-4 text-background/80 hover:text-background"><X className="h-8 w-8" /></button>
          <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 text-background/80 hover:text-background p-2"><ChevronLeft className="h-10 w-10" /></button>
          <img src={flatPhotos[lightbox].image_url} alt={`Foto ${lightbox + 1}`} className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} />
          <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 text-background/80 hover:text-background p-2"><ChevronRight className="h-10 w-10" /></button>
          <span className="absolute bottom-4 text-background/60 text-sm">{lightbox + 1} / {total}</span>
        </div>
      )}
    </div>
  );
};

export default RegiaoDetailPage;
