import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import HeroSection from "@/components/HeroSection";
import CategoryGrid from "@/components/CategoryGrid";
import SectionHeader from "@/components/SectionHeader";
import CityCard, { type CityData } from "@/components/CityCard";
import EstablishmentCard, { type EstablishmentData } from "@/components/EstablishmentCard";
import EventCard, { type EventData } from "@/components/EventCard";
import NewsletterSection from "@/components/NewsletterSection";

const Index = () => {
  const [cities, setCities] = useState<CityData[]>([]);
  const [establishments, setEstablishments] = useState<EstablishmentData[]>([]);
  const [events, setEvents] = useState<EventData[]>([]);

  useEffect(() => {
    supabase
      .from("cities")
      .select("id, name, slug, image_url, short_description, region")
      .eq("is_featured", true)
      .order("display_order")
      .limit(4)
      .then(({ data }) => { if (data) setCities(data); });

    supabase
      .from("establishments")
      .select("id, name, image_url, short_description, amenities, rating, category:categories(name, icon, slug), city:cities(name)")
      .eq("is_featured", true)
      .eq("is_active", true)
      .order("display_order")
      .limit(4)
      .then(({ data }) => { if (data) setEstablishments(data as unknown as EstablishmentData[]); });

    supabase
      .from("events")
      .select("id, name, image_url, description, start_date, end_date, event_type, city:cities(name)")
      .eq("is_featured", true)
      .eq("is_active", true)
      .order("display_order")
      .limit(3)
      .then(({ data }) => { if (data) setEvents(data as unknown as EventData[]); });
  }, []);

  return (
    <div className="min-h-screen">
      <HeroSection />
      <CategoryGrid />

      {cities.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="container">
            <SectionHeader title="Cidades em Destaque" subtitle="Descubra as joias do interior paulista" linkTo="/cidades" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {cities.map((city, i) => (
                <CityCard key={city.id} city={city} variant={i === 0 ? "featured" : "default"} />
              ))}
            </div>
          </div>
        </section>
      )}

      {events.length > 0 && (
        <section className="py-12 md:py-16 bg-muted/50">
          <div className="container">
            <SectionHeader title="Acontece Agora" subtitle="Eventos e festivais no interior paulista" linkTo="/eventos" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

      {establishments.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="container">
            <SectionHeader title="Onde Ficar & Comer" subtitle="Os melhores hotéis e restaurantes da região" linkTo="/explorar" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {establishments.map((est) => (
                <EstablishmentCard key={est.id} establishment={est} />
              ))}
            </div>
          </div>
        </section>
      )}

      <NewsletterSection />
    </div>
  );
};

export default Index;
