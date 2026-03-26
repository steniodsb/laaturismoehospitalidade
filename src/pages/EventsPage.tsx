import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import EventCard, { type EventData } from "@/components/EventCard";

interface CityOption { id: string; name: string; }

const EventsPage = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [cities, setCities] = useState<CityOption[]>([]);
  const [cityFilter, setCityFilter] = useState("");

  useEffect(() => {
    supabase
      .from("events")
      .select("id, name, image_url, description, start_date, end_date, event_type, city_id, city:cities(name)")
      .eq("is_active", true)
      .order("start_date")
      .then(({ data }) => {
        if (data) {
          setEvents(data as unknown as (EventData & { city_id: string })[]);
          const uniqueCities = new Map<string, string>();
          data.forEach((e: any) => {
            if (e.city_id && e.city?.name) uniqueCities.set(e.city_id, e.city.name);
          });
          setCities(Array.from(uniqueCities, ([id, name]) => ({ id, name })));
        }
      });
  }, []);

  const filtered = cityFilter
    ? events.filter((e: any) => e.city_id === cityFilter)
    : events;

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary/5 via-secondary/5 to-background py-16 md:py-20">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-sans font-normal text-foreground mb-4">Eventos</h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Festivais, festas e comemorações do interior paulista
          </p>
        </div>
      </section>

      {cities.length > 0 && (
        <section className="py-6 border-b border-border">
          <div className="container">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCityFilter("")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  !cityFilter ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                Todos
              </button>
              {cities.map((city) => (
                <button
                  key={city.id}
                  onClick={() => setCityFilter(cityFilter === city.id ? "" : city.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    cityFilter === city.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {city.name}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-10 md:py-14">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-16">Nenhum evento encontrado.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default EventsPage;
