import { useState, useEffect } from "react";
import { Search, MapPin, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { heroSlides } from "@/data/mockData";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explorar?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section className="relative h-[85vh] min-h-[500px] max-h-[800px] overflow-hidden">
      {/* Slides */}
      {heroSlides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: currentSlide === i ? 1 : 0 }}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-foreground/20" />

      {/* Content */}
      <div className="relative h-full container flex flex-col justify-end pb-16 md:pb-24">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-4 animate-fade-in">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-background/80 tracking-wide">Interior Paulista</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-background leading-tight mb-4 animate-fade-in-up">
            {heroSlides[currentSlide].title}
          </h1>

          <p className="text-lg text-background/80 mb-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            {heroSlides[currentSlide].subtitle}
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex bg-card rounded-xl shadow-lg overflow-hidden max-w-xl">
              <div className="flex-1 flex items-center gap-3 px-4">
                <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  placeholder="Buscar cidades, hotéis, restaurantes..."
                  className="w-full py-4 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="px-6 bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors flex items-center gap-1"
              >
                Buscar
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-6 right-4 md:bottom-10 md:right-8 flex gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentSlide === i ? "bg-primary w-6" : "bg-background/40 hover:bg-background/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
