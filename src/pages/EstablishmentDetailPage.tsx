import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Phone, Star, ArrowLeft, Clock, Navigation, Bed, Users, Globe, DogIcon, Coffee, Car, X, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { establishments, categoryLabels, categoryIcons } from "@/data/mockData";
import { Button } from "@/components/ui/button";

const EstablishmentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const est = establishments.find((e) => e.id === id);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  if (!est) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-serif text-foreground mb-4">Estabelecimento não encontrado</h1>
          <Link to="/explorar" className="text-primary font-medium hover:underline">
            ← Voltar para explorar
          </Link>
        </div>
      </div>
    );
  }

  const isHospedagem = est.category === "hospedagem";
  const details = est.hospedagemDetails;
  const allImages = est.gallery?.length ? est.gallery : [{ url: est.image, caption: est.name }];

  const openRoute = () => {
    if (est.latitude && est.longitude) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${est.latitude},${est.longitude}`,
        "_blank"
      );
    } else if (est.address) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(est.address)}`,
        "_blank"
      );
    }
  };

  const openMap = () => {
    if (est.latitude && est.longitude) {
      window.open(
        `https://www.google.com/maps?q=${est.latitude},${est.longitude}`,
        "_blank"
      );
    }
  };

  return (
    <div className="min-h-screen">
      {/* Banner */}
      <section className="relative h-[45vh] min-h-[280px] max-h-[450px] overflow-hidden">
        <img src={est.image} alt={est.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0">
          <div className="container pb-8">
            <Link
              to="/explorar"
              className="inline-flex items-center gap-1 text-sm text-background/70 hover:text-background mb-3 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Voltar
            </Link>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 bg-primary/90 text-primary-foreground text-xs font-medium px-2.5 py-1 rounded-full">
                {categoryIcons[est.category]} {categoryLabels[est.category]}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif text-background mb-2">{est.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-background/70 text-sm">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-primary" /> {est.cityName}
              </span>
              {est.rating && (
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-primary fill-primary" /> {est.rating}
                </span>
              )}
              {isHospedagem && details?.priceRange && (
                <span className="text-background/90 font-medium">{details.priceRange}</span>
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
                <button
                  key={i}
                  onClick={() => { setGalleryIndex(i); setGalleryOpen(true); }}
                  className="relative flex-shrink-0 w-28 h-20 rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-colors"
                >
                  <img src={img.url} alt={img.caption || `Foto ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
              <button
                onClick={() => { setGalleryIndex(0); setGalleryOpen(true); }}
                className="flex-shrink-0 w-28 h-20 rounded-lg border-2 border-dashed border-border bg-muted flex items-center justify-center text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                Ver todas
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="py-10 md:py-14">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-serif text-foreground mb-4">Sobre</h2>
                <p className="text-muted-foreground leading-relaxed">{est.description}</p>
              </div>

              {/* Hospedagem-specific details */}
              {isHospedagem && details && (
                <div className="bg-muted/30 rounded-xl border border-border p-6">
                  <h3 className="text-xl font-serif text-foreground mb-5">Detalhes da Hospedagem</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {details.checkIn && (
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">Check-in</p>
                          <p className="text-sm font-medium text-foreground">{details.checkIn}</p>
                        </div>
                      </div>
                    )}
                    {details.checkOut && (
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-secondary mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">Check-out</p>
                          <p className="text-sm font-medium text-foreground">{details.checkOut}</p>
                        </div>
                      </div>
                    )}
                    {details.totalRooms && (
                      <div className="flex items-start gap-3">
                        <Bed className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">Quartos</p>
                          <p className="text-sm font-medium text-foreground">{details.totalRooms} unidades</p>
                        </div>
                      </div>
                    )}
                    {details.breakfastIncluded !== undefined && (
                      <div className="flex items-start gap-3">
                        <Coffee className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">Café da Manhã</p>
                          <p className="text-sm font-medium text-foreground">{details.breakfastIncluded ? "Incluso" : "Não incluso"}</p>
                        </div>
                      </div>
                    )}
                    {details.parkingIncluded !== undefined && (
                      <div className="flex items-start gap-3">
                        <Car className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">Estacionamento</p>
                          <p className="text-sm font-medium text-foreground">{details.parkingIncluded ? "Gratuito" : "Pago"}</p>
                        </div>
                      </div>
                    )}
                    {details.petsAllowed !== undefined && (
                      <div className="flex items-start gap-3">
                        <DogIcon className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">Pets</p>
                          <p className="text-sm font-medium text-foreground">{details.petsAllowed ? "Aceitos" : "Não aceitos"}</p>
                        </div>
                      </div>
                    )}
                    {details.languages && details.languages.length > 0 && (
                      <div className="flex items-start gap-3">
                        <Globe className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">Idiomas</p>
                          <p className="text-sm font-medium text-foreground">{details.languages.join(", ")}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {details.roomTypes && details.roomTypes.length > 0 && (
                    <div className="mt-5 pt-5 border-t border-border">
                      <p className="text-sm font-semibold text-foreground mb-2">Tipos de Quarto</p>
                      <div className="flex flex-wrap gap-2">
                        {details.roomTypes.map((rt) => (
                          <span key={rt} className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-sm px-3 py-1.5 rounded-full font-medium">
                            <Bed className="h-3.5 w-3.5" /> {rt}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {details.cancellationPolicy && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">Cancelamento:</span> {details.cancellationPolicy}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Amenities */}
              <div>
                <h3 className="text-xl font-serif text-foreground mb-4">Comodidades</h3>
                <div className="flex flex-wrap gap-2">
                  {est.amenities.map((a) => (
                    <span key={a} className="inline-flex items-center gap-1.5 bg-muted text-foreground text-sm px-3 py-1.5 rounded-full">
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              {/* Map Section */}
              {(est.latitude && est.longitude) && (
                <div>
                  <h3 className="text-xl font-serif text-foreground mb-4">Localização</h3>
                  <div className="rounded-xl overflow-hidden border border-border">
                    <iframe
                      title="Localização"
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      loading="lazy"
                      src={`https://www.google.com/maps?q=${est.latitude},${est.longitude}&z=15&output=embed`}
                    />
                  </div>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <Button onClick={openRoute} className="gap-2">
                      <Navigation className="h-4 w-4" /> Iniciar Rota
                    </Button>
                    <Button variant="outline" onClick={openMap} className="gap-2">
                      <MapPin className="h-4 w-4" /> Abrir no Google Maps
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-card rounded-xl border border-border p-6 shadow-card">
                <h3 className="font-sans font-semibold text-foreground mb-4">Informações de Contato</h3>
                {est.address && (
                  <div className="flex items-start gap-3 mb-3 text-sm">
                    <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{est.address}</span>
                  </div>
                )}
                {!est.address && (
                  <div className="flex items-center gap-3 mb-3 text-sm">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">{est.cityName}, SP</span>
                  </div>
                )}
                {est.phone && (
                  <div className="flex items-center gap-3 mb-3 text-sm">
                    <Phone className="h-4 w-4 text-primary" />
                    <a href={`tel:${est.phone.replace(/\D/g, "")}`} className="text-muted-foreground hover:text-primary transition-colors">
                      {est.phone}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-3 mb-6 text-sm">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Seg-Dom: 8h - 22h</span>
                </div>

                <div className="space-y-2">
                  {est.whatsapp && (
                    <a
                      href={`https://wa.me/${est.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white font-semibold py-3 rounded-lg hover:bg-[#20bd5a] transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" /> WhatsApp
                    </a>
                  )}
                  <a
                    href={est.phone ? `tel:${est.phone.replace(/\D/g, "")}` : "#"}
                    className="block w-full text-center bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Ligar Agora
                  </a>
                </div>
              </div>

              {isHospedagem && details?.priceRange && (
                <div className="bg-primary/5 rounded-xl border border-primary/20 p-6">
                  <p className="text-sm text-muted-foreground mb-1">A partir de</p>
                  <p className="text-2xl font-bold text-primary">{details.priceRange}</p>
                  <p className="text-xs text-muted-foreground mt-1">por noite</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Modal */}
      {galleryOpen && (
        <div className="fixed inset-0 z-[100] bg-foreground/95 flex items-center justify-center">
          <button
            onClick={() => setGalleryOpen(false)}
            className="absolute top-4 right-4 text-background/70 hover:text-background z-10"
          >
            <X className="h-8 w-8" />
          </button>
          <button
            onClick={() => setGalleryIndex((prev) => (prev - 1 + allImages.length) % allImages.length)}
            className="absolute left-4 text-background/70 hover:text-background z-10"
          >
            <ChevronLeft className="h-10 w-10" />
          </button>
          <button
            onClick={() => setGalleryIndex((prev) => (prev + 1) % allImages.length)}
            className="absolute right-4 text-background/70 hover:text-background z-10"
          >
            <ChevronRight className="h-10 w-10" />
          </button>
          <div className="max-w-4xl max-h-[80vh] w-full px-16">
            <img
              src={allImages[galleryIndex].url}
              alt={allImages[galleryIndex].caption || ""}
              className="w-full h-full object-contain rounded-lg"
            />
            {allImages[galleryIndex].caption && (
              <p className="text-center text-background/70 mt-4 text-sm">{allImages[galleryIndex].caption}</p>
            )}
            <p className="text-center text-background/50 mt-2 text-xs">
              {galleryIndex + 1} / {allImages.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EstablishmentDetailPage;
