import { useParams, Link } from "react-router-dom";
import { MapPin, Users, Calendar, ChevronRight, ArrowLeft } from "lucide-react";
import { cities, establishments, events } from "@/data/mockData";
import EstablishmentCard from "@/components/EstablishmentCard";
import EventCard from "@/components/EventCard";
import SectionHeader from "@/components/SectionHeader";

const CityDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const city = cities.find((c) => c.slug === slug);

  if (!city) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-serif text-foreground mb-4">Cidade não encontrada</h1>
          <Link to="/cidades" className="text-primary font-medium hover:underline">
            ← Voltar para cidades
          </Link>
        </div>
      </div>
    );
  }

  const cityEstablishments = establishments.filter((e) => e.cityId === city.id);
  const cityEvents = events.filter((e) => e.cityId === city.id);

  return (
    <div className="min-h-screen">
      {/* Banner */}
      <section className="relative h-[50vh] min-h-[300px] max-h-[500px] overflow-hidden">
        <img src={city.image} alt={city.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0">
          <div className="container pb-8">
            <Link
              to="/cidades"
              className="inline-flex items-center gap-1 text-sm text-background/70 hover:text-background mb-3 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Todas as cidades
            </Link>
            <h1 className="text-4xl md:text-5xl font-serif text-background mb-2">{city.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-background/70 text-sm">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-primary" /> {city.region}
              </span>
              {city.population && (
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-secondary" /> {city.population} hab.
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="py-10 md:py-14">
        <div className="container max-w-3xl">
          <p className="text-lg text-muted-foreground leading-relaxed">{city.description}</p>
        </div>
      </section>

      {/* City Events */}
      {cityEvents.length > 0 && (
        <section className="py-10 md:py-14 bg-muted/50">
          <div className="container">
            <SectionHeader title="Eventos" subtitle={`O que acontece em ${city.name}`} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {cityEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* City Establishments */}
      {cityEstablishments.length > 0 && (
        <section className="py-10 md:py-14">
          <div className="container">
            <SectionHeader title="Onde ir" subtitle="Hotéis, restaurantes e pontos turísticos" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {cityEstablishments.map((est) => (
                <EstablishmentCard key={est.id} establishment={est} />
              ))}
            </div>
          </div>
        </section>
      )}

      {cityEstablishments.length === 0 && cityEvents.length === 0 && (
        <section className="py-10 md:py-14">
          <div className="container text-center">
            <Calendar className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-muted-foreground">
              Em breve, novos estabelecimentos e eventos serão adicionados para {city.name}.
            </p>
          </div>
        </section>
      )}
    </div>
  );
};

export default CityDetailPage;
