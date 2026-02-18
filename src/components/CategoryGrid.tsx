import { Link } from "react-router-dom";
import { type EstablishmentCategory, categoryLabels, categoryIcons } from "@/data/mockData";

const categories: { key: EstablishmentCategory; color: string }[] = [
  { key: "hospedagem", color: "from-primary/20 to-primary/5" },
  { key: "gastronomia", color: "from-secondary/20 to-secondary/5" },
  { key: "lazer", color: "from-primary/15 to-secondary/10" },
  { key: "cultura", color: "from-secondary/15 to-primary/10" },
  { key: "artesanato", color: "from-primary/10 to-accent/50" },
  { key: "comercio", color: "from-secondary/10 to-muted/50" },
];

const CategoryGrid = () => {
  return (
    <section className="py-16 md:py-20">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-3">Explore por Categoria</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Encontre exatamente o que você procura no interior paulista
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.key}
              to={`/explorar?cat=${cat.key}`}
              className={`group flex flex-col items-center justify-center p-6 rounded-xl bg-gradient-to-br ${cat.color} border border-border/50 hover:border-primary/30 hover:shadow-card-hover transition-all duration-300`}
            >
              <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                {categoryIcons[cat.key]}
              </span>
              <span className="text-sm font-semibold text-foreground/80 group-hover:text-primary transition-colors">
                {categoryLabels[cat.key]}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
