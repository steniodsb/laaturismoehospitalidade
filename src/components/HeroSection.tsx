import { useState, useEffect } from "react";
import { Search, MapPin, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import banner1 from "@/assets/banner-1.jpg";
import banner2 from "@/assets/banner-2.jpg";
import banner3 from "@/assets/banner-3.jpg";

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  link_url: string | null;
}

const fallbackSlides = [
  { title: "Descubra o Interior Paulista", subtitle: "Cidades encantadoras, cultura rica e hospitalidade única", image: banner1 },
  { title: "Natureza Exuberante", subtitle: "Cachoeiras, trilhas e paisagens de tirar o fôlego", image: banner2 },
  { title: "Gastronomia de Raiz", subtitle: "Sabores autênticos e experiências inesquecíveis", image: banner3 },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [banners, setBanners] = useState<Banner[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    supabase
      .from("banners")
      .select("id, title, subtitle, image_url, link_url")
      .eq("is_active", true)
      .order("display_order")
      .then(({ data }) => {
        if (data && data.length > 0) setBanners(data);
      });
  }, []);

  const slides = banners.length > 0
    ? banners.map((b) => ({ title: b.title, subtitle: b.subtitle || "", image: b.image_url }))
    : fallbackSlides;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explorar?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section className="relative h-[85vh] min-h-[500px] max-h-[800px] overflow-hidden">
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: currentSlide === i ? 1 : 0 }}
        >
          <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-foreground/20" />

      <div className="relative h-full container flex flex-col justify-end pb-16 md:pb-24">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-4 animate-fade-in">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-background/80 tracking-wide">Interior Paulista</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-sans font-normal text-background leading-tight mb-4 animate-fade-in-up">
            {slides[currentSlide]?.title}
          </h1>

          <p className="text-lg text-background/80 mb-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            {slides[currentSlide]?.subtitle}
          </p>
        </div>

        <form onSubmit={handleSearch} className="max-w-xl animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex bg-card rounded-xl shadow-lg overflow-hidden">
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
            <button type="submit" className="px-6 bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors flex items-center gap-1">
              Buscar
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </form>

        <div className="absolute bottom-6 right-4 md:bottom-10 md:right-8 flex gap-2">
          {slides.map((_, i) => (
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
