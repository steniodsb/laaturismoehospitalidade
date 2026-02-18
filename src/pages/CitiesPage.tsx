import { cities } from "@/data/mockData";
import CityCard from "@/components/CityCard";

const CitiesPage = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/5 via-secondary/5 to-background py-16 md:py-20">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4">Nossas Cidades</h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Conheça as cidades participantes do guia LAA Turismo & Hospitalidade
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {cities.map((city) => (
              <CityCard key={city.id} city={city} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CitiesPage;
