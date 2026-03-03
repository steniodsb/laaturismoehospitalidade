import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
}

const CategoryGrid = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    supabase
      .from("categories")
      .select("id, name, slug, icon")
      .order("name")
      .then(({ data }) => {
        if (data) setCategories(data);
      });
  }, []);

  if (categories.length === 0) return null;

  return (
    <section className="py-16 md:py-20">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-3">Explore por Categoria</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Encontre exatamente o que você procura no interior paulista
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-9 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/explorar?cat=${cat.slug}`}
              className="group flex flex-col items-center justify-center p-6 rounded-xl bg-card border border-border/50 shadow-card hover:shadow-card-hover hover:border-primary/30 transition-all duration-300"
            >
              <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                {cat.icon || "📌"}
              </span>
              <span className="text-sm font-semibold text-foreground/80 group-hover:text-primary transition-colors text-center">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
