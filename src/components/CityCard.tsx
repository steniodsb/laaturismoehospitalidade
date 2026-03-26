import { Link } from "react-router-dom";
import { MapPin, ChevronRight } from "lucide-react";

export interface CityData {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  short_description: string | null;
  region: string | null;
}

interface CityCardProps {
  city: CityData;
  variant?: "default" | "featured";
}

const CityCard = ({ city, variant = "default" }: CityCardProps) => {
  const imgSrc = city.image_url || "/placeholder.svg";

  if (variant === "featured") {
    return (
      <Link
        to={`/cidades/${city.slug}`}
        className="group relative rounded-xl overflow-hidden h-64 md:h-80 block shadow-card hover:shadow-card-hover transition-all duration-300"
      >
        <img src={imgSrc} alt={city.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-center gap-1 mb-1">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs text-background/70">{city.region}</span>
          </div>
          <h3 className="text-xl font-sans font-normal text-background mb-1">{city.name}</h3>
          <p className="text-sm text-background/70 line-clamp-2">{city.short_description}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/cidades/${city.slug}`}
      className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 block"
    >
      <div className="relative h-44 overflow-hidden">
        <img src={imgSrc} alt={city.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-1 mb-1">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs text-muted-foreground">{city.region}</span>
        </div>
        <h3 className="font-sans font-normal text-lg text-foreground mb-1 group-hover:text-primary transition-colors">{city.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{city.short_description}</p>
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
          Explorar <ChevronRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
};

export default CityCard;
