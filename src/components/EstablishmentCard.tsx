import { Link } from "react-router-dom";
import { MapPin, Star, ChevronRight } from "lucide-react";

export interface EstablishmentData {
  id: string;
  name: string;
  image_url: string | null;
  short_description: string | null;
  amenities: string[] | null;
  rating: number | null;
  category?: { name: string; icon: string | null; slug: string } | null;
  city?: { name: string } | null;
}

interface EstablishmentCardProps {
  establishment: EstablishmentData;
}

const EstablishmentCard = ({ establishment }: EstablishmentCardProps) => {
  const imgSrc = establishment.image_url || "/placeholder.svg";
  const categoryName = establishment.category?.name || "";
  const categoryIcon = establishment.category?.icon || "";
  const cityName = establishment.city?.name || "";
  const amenities = establishment.amenities || [];

  return (
    <Link
      to={`/estabelecimento/${establishment.id}`}
      className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 block"
    >
      <div className="relative h-48 overflow-hidden">
        <img src={imgSrc} alt={establishment.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        {categoryName && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 bg-card/90 backdrop-blur-sm text-foreground text-xs font-medium px-2.5 py-1 rounded-full">
              {categoryIcon} {categoryName}
            </span>
          </div>
        )}
        {establishment.rating && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-card/90 backdrop-blur-sm text-foreground text-xs font-semibold px-2 py-1 rounded-full">
            <Star className="h-3 w-3 text-primary fill-primary" />
            {establishment.rating}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-sans font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
          {establishment.name}
        </h3>
        {cityName && (
          <div className="flex items-center gap-1 mb-2">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{cityName}</span>
          </div>
        )}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {establishment.short_description}
        </p>
        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {amenities.slice(0, 3).map((a) => (
              <span key={a} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{a}</span>
            ))}
          </div>
        )}
        <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
          Saiba Mais <ChevronRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
};

export default EstablishmentCard;
