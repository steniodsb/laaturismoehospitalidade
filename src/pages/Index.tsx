import HeroSection from "@/components/HeroSection";
import CategoryGrid from "@/components/CategoryGrid";
import SectionHeader from "@/components/SectionHeader";
import CityCard from "@/components/CityCard";
import EstablishmentCard from "@/components/EstablishmentCard";
import EventCard from "@/components/EventCard";
import NewsletterSection from "@/components/NewsletterSection";
import { cities, establishments, events } from "@/data/mockData";

const Index = () => {
  const featuredCities = cities.slice(0, 4);
  const featuredEstablishments = establishments.slice(0, 4);
  const upcomingEvents = events.slice(0, 3);

  return (
    <div className="min-h-screen">
      <HeroSection />

      <CategoryGrid />

      {/* Featured Cities */}
      <section className="py-12 md:py-16">
        <div className="container">
          <SectionHeader
            title="Cidades em Destaque"
            subtitle="Descubra as joias do interior paulista"
            linkTo="/cidades"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredCities.map((city, i) => (
              <CityCard key={city.id} city={city} variant={i === 0 ? "featured" : "default"} />
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-12 md:py-16 bg-muted/50">
        <div className="container">
          <SectionHeader
            title="Acontece Agora"
            subtitle="Eventos e festivais no interior paulista"
            linkTo="/eventos"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Establishments */}
      <section className="py-12 md:py-16">
        <div className="container">
          <SectionHeader
            title="Onde Ficar & Comer"
            subtitle="Os melhores hotéis e restaurantes da região"
            linkTo="/explorar"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredEstablishments.map((est) => (
              <EstablishmentCard key={est.id} establishment={est} />
            ))}
          </div>
        </div>
      </section>

      <NewsletterSection />
    </div>
  );
};

export default Index;
