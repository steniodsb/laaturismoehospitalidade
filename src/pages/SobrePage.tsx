import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react";

const totalFotos = 74;
const fotos = Array.from({ length: totalFotos }, (_, i) => `/portfolio/foto-${String(i + 1).padStart(2, "0")}.jpg`);

const SobrePage = () => {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const prev = () => setLightbox((i) => (i !== null ? (i - 1 + totalFotos) % totalFotos : null));
  const next = () => setLightbox((i) => (i !== null ? (i + 1) % totalFotos : null));

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

      {/* Galeria de materiais */}
      <section className="py-12 md:py-16">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-sans font-normal text-foreground mb-2">Nosso trabalho</h2>
          <p className="text-muted-foreground mb-8">Materiais de divulgação produzidos pela LAA Turismo &amp; Hospitalidade</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3">
            {fotos.map((src, idx) => (
              <button
                key={idx}
                onClick={() => setLightbox(idx)}
                className="group relative aspect-square overflow-hidden rounded-lg shadow-sm hover:shadow-card-hover transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <img
                  src={src}
                  alt={`Material de divulgação ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-300 rounded-lg" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
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
            src={fotos[lightbox]}
            alt={`Foto ${lightbox + 1}`}
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
            {lightbox + 1} / {totalFotos}
          </span>
        </div>
      )}
    </div>
  );
};

export default SobrePage;
