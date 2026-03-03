import { MapPin, Calendar } from "lucide-react";

export interface EventData {
  id: string;
  name: string;
  image_url: string | null;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  event_type: string | null;
  city?: { name: string } | null;
}

interface EventCardProps {
  event: EventData;
}

const EventCard = ({ event }: EventCardProps) => {
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  };

  const imgSrc = event.image_url || "/placeholder.svg";
  const cityName = event.city?.name || "";

  return (
    <div className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300">
      <div className="relative h-44 overflow-hidden">
        <img src={imgSrc} alt={event.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        {event.start_date && (
          <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-lg">
            <Calendar className="h-3 w-3 inline mr-1" />
            {formatDate(event.start_date)}
            {event.end_date && ` - ${formatDate(event.end_date)}`}
          </div>
        )}
      </div>
      <div className="p-4">
        {event.event_type && <span className="text-xs font-medium text-secondary mb-1 block">{event.event_type}</span>}
        <h3 className="font-sans font-semibold text-foreground mb-1">{event.name}</h3>
        {cityName && (
          <div className="flex items-center gap-1 mb-2">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{cityName}</span>
          </div>
        )}
        <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
      </div>
    </div>
  );
};

export default EventCard;
