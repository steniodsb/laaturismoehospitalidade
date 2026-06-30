import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import HeroSection from "@/components/HeroSection";
import CategoryGrid from "@/components/CategoryGrid";
import SectionHeader from "@/components/SectionHeader";
import CityCard, { type CityData } from "@/components/CityCard";
import EstablishmentCard, { type EstablishmentData } from "@/components/EstablishmentCard";
import EventCard, { type EventData } from "@/components/EventCard";
import NewsletterSection from "@/components/NewsletterSection";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

const Index = () => {
  const [cities, setCities] = useState<CityData[]>([]);
  const [hospedagem, setHospedagem] = useState<EstablishmentData[]>([]);
  const [gastronomia, setGastronomia] = useState<EstablishmentData[]>([]);
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
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("display_order")
      .then(({ data }) => {
        if (data) {
          const all = data as unknown as EstablishmentData[];
          setHospedagem(all.filter((e) => e.category?.slug === "hospedagem"));
          setGastronomia(all.filter((e) => e.category?.slug === "gastronomia"));
        }
      });

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

      {events.length > 0 && (
        <section className="py-12 md:py-16 bg-muted/50">
          <div className="container">
            <SectionHeader title="Agenda de Eventos" subtitle="Festivais, festas e comemorações do interior paulista" linkTo="/eventos" linkLabel="Ver todos" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

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

      {hospedagem.length > 0 && (
        <section className="py-12 md:py-16 bg-muted/50">
          <div className="container">
            <SectionHeader title="Onde Ficar" subtitle="As melhores pousadas e hotéis da região" linkTo="/explorar?cat=hospedagem" linkLabel="Ver mais" />
            <div className="px-10">
              <Carousel opts={{ align: "start", loop: true }} className="w-full">
                <CarouselContent className="-ml-4">
                  {hospedagem.map((est) => (
                    <CarouselItem key={est.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                      <EstablishmentCard establishment={est} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-10" />
                <CarouselNext className="-right-10" />
              </Carousel>
            </div>
            <div className="mt-6 text-center sm:hidden">
              <Link
                to="/explorar?cat=hospedagem"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Ver mais <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {gastronomia.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="container">
            <SectionHeader title="Onde Comer" subtitle="Os melhores restaurantes e sabores regionais" linkTo="/explorar?cat=gastronomia" linkLabel="Ver mais" />
            <div className="px-10">
              <Carousel opts={{ align: "start", loop: true }} className="w-full">
                <CarouselContent className="-ml-4">
                  {gastronomia.map((est) => (
                    <CarouselItem key={est.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                      <EstablishmentCard establishment={est} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-10" />
                <CarouselNext className="-right-10" />
              </Carousel>
            </div>
            <div className="mt-6 text-center sm:hidden">
              <Link
                to="/explorar?cat=gastronomia"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Ver mais <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      <NewsletterSection />
    </div>
  );
};

export default Index;
