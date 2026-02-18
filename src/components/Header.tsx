import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoLaa from "@/assets/logo-laa.webp";

const navLinks = [
  { label: "Início", to: "/" },
  { label: "Cidades", to: "/cidades" },
  { label: "Hospedagem", to: "/explorar?cat=hospedagem" },
  { label: "Gastronomia", to: "/explorar?cat=gastronomia" },
  { label: "Lazer", to: "/explorar?cat=lazer" },
  { label: "Cultura", to: "/explorar?cat=cultura" },
  { label: "Comércio", to: "/explorar?cat=comercio" },
  { label: "Eventos", to: "/eventos" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logoLaa} alt="LAA Turismo & Hospitalidade" className="h-12 md:h-14 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/70 hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
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
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/70 hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
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
