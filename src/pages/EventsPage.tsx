import { events, cities } from "@/data/mockData";
import EventCard from "@/components/EventCard";
import { useState } from "react";

const EventsPage = () => {
  const [cityFilter, setCityFilter] = useState("");

  const filtered = cityFilter ? events.filter((e) => e.cityId === cityFilter) : events;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/5 via-secondary/5 to-background py-16 md:py-20">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4">Eventos</h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Festivais, festas e comemorações do interior paulista
          </p>
        </div>
      </section>

      {/* Filters */}
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
            {cities
              .filter((c) => events.some((e) => e.cityId === c.id))
              .map((city) => (
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

      {/* Events Grid */}
      <section className="py-10 md:py-14">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-16">Nenhum evento encontrado para esta cidade.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default EventsPage;
