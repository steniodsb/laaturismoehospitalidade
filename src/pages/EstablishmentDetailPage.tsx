import { useParams, Link } from "react-router-dom";
import { MapPin, Phone, Star, ArrowLeft, Clock, Wifi, Car } from "lucide-react";
import { establishments } from "@/data/mockData";

const EstablishmentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const est = establishments.find((e) => e.id === id);

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
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 md:py-14">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-serif text-foreground mb-4">Sobre</h2>
              <p className="text-muted-foreground leading-relaxed mb-8">{est.description}</p>

              <h3 className="text-xl font-serif text-foreground mb-4">Comodidades</h3>
              <div className="flex flex-wrap gap-2 mb-8">
                {est.amenities.map((a) => (
                  <span key={a} className="inline-flex items-center gap-1.5 bg-muted text-foreground text-sm px-3 py-1.5 rounded-full">
                    {a}
                  </span>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div className="bg-card rounded-xl border border-border p-6 shadow-card">
                <h3 className="font-sans font-semibold text-foreground mb-4">Informações de Contato</h3>
                {est.phone && (
                  <div className="flex items-center gap-3 mb-3 text-sm">
                    <Phone className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">{est.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 mb-3 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">{est.cityName}, SP</span>
                </div>
                <div className="flex items-center gap-3 mb-6 text-sm">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Seg-Dom: 8h - 22h</span>
                </div>
                <a
                  href={est.phone ? `tel:${est.phone.replace(/\D/g, "")}` : "#"}
                  className="block w-full text-center bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Entrar em Contato
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EstablishmentDetailPage;
