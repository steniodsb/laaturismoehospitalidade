import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { establishments, cities, categoryLabels, categoryIcons, type EstablishmentCategory } from "@/data/mockData";
import EstablishmentCard from "@/components/EstablishmentCard";

const ExplorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const query = searchParams.get("q") || "";
  const categoryFilter = searchParams.get("cat") || "";
  const cityFilter = searchParams.get("city") || "";

  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const filtered = useMemo(() => {
    return establishments.filter((est) => {
      const matchesQuery =
        !query ||
        est.name.toLowerCase().includes(query.toLowerCase()) ||
        est.shortDescription.toLowerCase().includes(query.toLowerCase()) ||
        est.cityName.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = !categoryFilter || est.category === categoryFilter;
      const matchesCity = !cityFilter || est.cityId === cityFilter;
      return matchesQuery && matchesCategory && matchesCity;
    });
  }, [query, categoryFilter, cityFilter]);

  const activeFilters = [categoryFilter, cityFilter, query].filter(Boolean).length;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/5 via-secondary/5 to-background py-12 md:py-16">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4 text-center">Explorar</h1>
          <p className="text-muted-foreground text-center mb-8 max-w-lg mx-auto">
            Encontre os melhores hotéis, restaurantes e atrações do interior paulista
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto flex gap-2">
            <div className="flex-1 flex items-center gap-3 bg-card border border-border rounded-xl px-4">
              <Search className="h-5 w-5 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Buscar estabelecimentos..."
                className="w-full py-3 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
                value={query}
                onChange={(e) => setFilter("q", e.target.value)}
              />
              {query && (
                <button onClick={() => setFilter("q", "")} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                showFilters || activeFilters > 0
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border text-foreground hover:border-primary/30"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Filtros</span>
              {activeFilters > 0 && (
                <span className="ml-1 bg-primary-foreground text-primary text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {activeFilters}
                </span>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Filters Panel */}
      {showFilters && (
        <div className="border-b border-border bg-card animate-fade-in">
          <div className="container py-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Filter */}
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">Categoria</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilter("cat", "")}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      !categoryFilter ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    Todas
                  </button>
                  {(Object.keys(categoryLabels) as EstablishmentCategory[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => setFilter("cat", categoryFilter === key ? "" : key)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        categoryFilter === key
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {categoryIcons[key]} {categoryLabels[key]}
                    </button>
                  ))}
                </div>
              </div>

              {/* City Filter */}
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">Cidade</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilter("city", "")}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      !cityFilter ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    Todas
                  </button>
                  {cities.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => setFilter("city", cityFilter === city.id ? "" : city.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        cityFilter === city.id
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {city.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <section className="py-10 md:py-14">
        <div className="container">
          <p className="text-sm text-muted-foreground mb-6">
            {filtered.length} {filtered.length === 1 ? "resultado" : "resultados"} encontrados
          </p>
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((est) => (
                <EstablishmentCard key={est.id} establishment={est} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Search className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum resultado encontrado. Tente ajustar seus filtros.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ExplorePage;
