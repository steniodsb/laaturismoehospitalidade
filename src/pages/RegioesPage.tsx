import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, ChevronRight } from "lucide-react";

interface Region {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  cover_image_url: string | null;
}

const RegioesPage = () => {
  const [regions, setRegions] = useState<Region[]>([]);

  useEffect(() => {
    supabase
      .from("tourism_regions")
      .select("id, name, slug, description, cover_image_url")
      .eq("is_active", true)
      .order("display_order")
      .then(({ data }) => { if (data) setRegions(data as Region[]); });
  }, []);

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary/5 via-secondary/5 to-background py-16 md:py-20">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-sans font-normal text-foreground mb-4">Regiões Turísticas</h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Conheça as regiões turísticas do interior paulista e seus municípios
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {regions.map((region) => (
              <Link
                key={region.id}
                to={`/regioes/${region.slug}`}
                className="group flex flex-col overflow-hidden rounded-xl bg-card border border-border/50 shadow-card hover:shadow-card-hover hover:border-primary/30 transition-all duration-300"
              >
                <div className="relative h-44 bg-muted overflow-hidden">
                  {region.cover_image_url ? (
                    <img src={region.cover_image_url} alt={region.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                      <MapPin className="h-10 w-10 text-primary/40" />
                    </div>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{region.name}</h2>
                  {region.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{region.description}</p>}
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    Ver região <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
          {regions.length === 0 && (
            <p className="text-center text-muted-foreground py-16">Nenhuma região cadastrada ainda.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default RegioesPage;
