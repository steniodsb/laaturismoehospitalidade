import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import CityCard, { type CityData } from "@/components/CityCard";

const CitiesPage = () => {
  const [cities, setCities] = useState<CityData[]>([]);

  useEffect(() => {
    supabase
      .from("cities")
      .select("id, name, slug, image_url, short_description, region")
      .order("name")
      .then(({ data }) => { if (data) setCities(data); });
  }, []);

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary/5 via-secondary/5 to-background py-16 md:py-20">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4">Nossas Cidades</h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Conheça as cidades participantes do guia LAA Turismo & Hospitalidade
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {cities.map((city) => (
              <CityCard key={city.id} city={city} />
            ))}
          </div>
          {cities.length === 0 && (
            <p className="text-center text-muted-foreground py-16">Nenhuma cidade cadastrada.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default CitiesPage;
