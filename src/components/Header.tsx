import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categoryLabels, categoryIcons, type EstablishmentCategory } from "@/data/mockData";
import logoLaa from "@/assets/logo-laa.webp";

const categoryLinks = (Object.keys(categoryLabels) as EstablishmentCategory[]).map((key) => ({
  label: `${categoryIcons[key]} ${categoryLabels[key]}`,
  to: `/explorar?cat=${key}`,
}));

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCatOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logoLaa} alt="LAA Turismo & Hospitalidade" className="h-12 md:h-14 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === "/" ? "bg-primary/10 text-primary" : "text-foreground/70 hover:text-foreground hover:bg-muted"
            }`}
          >
            Início
          </Link>
          <Link
            to="/cidades"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === "/cidades" ? "bg-primary/10 text-primary" : "text-foreground/70 hover:text-foreground hover:bg-muted"
            }`}
          >
            Cidades
          </Link>

          {/* Categories Dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setCatOpen(!catOpen)}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.search.includes("cat=") ? "bg-primary/10 text-primary" : "text-foreground/70 hover:text-foreground hover:bg-muted"
              }`}
            >
              Categorias
              <ChevronDown className={`h-4 w-4 transition-transform ${catOpen ? "rotate-180" : ""}`} />
            </button>
            {catOpen && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-card border border-border rounded-xl shadow-lg z-50 py-2 animate-fade-in">
                <Link
                  to="/explorar"
                  onClick={() => setCatOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium text-foreground/70 hover:bg-muted hover:text-foreground transition-colors"
                >
                  🔍 Ver Todas
                </Link>
                <div className="border-t border-border my-1" />
                {categoryLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setCatOpen(false)}
                    className="block px-4 py-2.5 text-sm font-medium text-foreground/70 hover:bg-muted hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/eventos"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === "/eventos" ? "bg-primary/10 text-primary" : "text-foreground/70 hover:text-foreground hover:bg-muted"
            }`}
          >
            Eventos
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/explorar">
            <Button variant="ghost" size="icon" className="text-foreground/70">
              <Search className="h-5 w-5" />
            </Button>
          </Link>
          <Button variant="default" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Anuncie Aqui
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-foreground/70"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card animate-fade-in">
          <nav className="container py-4 flex flex-col gap-1">
            <Link to="/" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium text-foreground/70 hover:bg-muted">
              Início
            </Link>
            <Link to="/cidades" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium text-foreground/70 hover:bg-muted">
              Cidades
            </Link>

            {/* Mobile Categories Accordion */}
            <button
              onClick={() => setCatOpen(!catOpen)}
              className="flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium text-foreground/70 hover:bg-muted"
            >
              Categorias
              <ChevronDown className={`h-4 w-4 transition-transform ${catOpen ? "rotate-180" : ""}`} />
            </button>
            {catOpen && (
              <div className="ml-4 flex flex-col gap-0.5 bg-muted/30 rounded-lg py-1">
                <Link to="/explorar" onClick={() => setMobileOpen(false)} className="px-4 py-2.5 text-sm text-foreground/70 hover:bg-muted rounded-lg">
                  🔍 Ver Todas
                </Link>
                {categoryLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-2.5 text-sm text-foreground/70 hover:bg-muted rounded-lg"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}

            <Link to="/eventos" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium text-foreground/70 hover:bg-muted">
              Eventos
            </Link>

            <div className="pt-2 border-t border-border mt-2">
              <Button className="w-full bg-primary text-primary-foreground">Anuncie Aqui</Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
