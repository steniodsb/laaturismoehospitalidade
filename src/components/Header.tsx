import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Search, ChevronDown, User, Heart, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import logoLaa from "@/assets/logo-laa.webp";

interface CategoryLink { label: string; to: string; }

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [categoryLinks, setCategoryLinks] = useState<CategoryLink[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    supabase.from("categories").select("name, slug, icon").order("name").then(({ data }) => {
      if (data) {
        setCategoryLinks(data.map((c) => ({ label: `${c.icon || "📌"} ${c.name}`, to: `/explorar?cat=${c.slug}` })));
      }
    });
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
    navigate("/");
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCatOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoLaa} alt="LAA Turismo & Hospitalidade" className="h-16 md:h-[4.5rem] w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link to="/" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === "/" ? "bg-primary/10 text-primary" : "text-foreground/70 hover:text-foreground hover:bg-muted"}`}>Início</Link>
          <Link to="/cidades" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === "/cidades" ? "bg-primary/10 text-primary" : "text-foreground/70 hover:text-foreground hover:bg-muted"}`}>Cidades</Link>

          <div ref={dropdownRef} className="relative">
            <button onClick={() => setCatOpen(!catOpen)} className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${location.search.includes("cat=") ? "bg-primary/10 text-primary" : "text-foreground/70 hover:text-foreground hover:bg-muted"}`}>
              Categorias <ChevronDown className={`h-4 w-4 transition-transform ${catOpen ? "rotate-180" : ""}`} />
            </button>
            {catOpen && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-card border border-border rounded-xl shadow-lg z-50 py-2 animate-fade-in">
                <Link to="/explorar" onClick={() => setCatOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-foreground/70 hover:bg-muted hover:text-foreground transition-colors">🔍 Ver Todas</Link>
                <div className="border-t border-border my-1" />
                {categoryLinks.map((link) => (
                  <Link key={link.to} to={link.to} onClick={() => setCatOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-foreground/70 hover:bg-muted hover:text-foreground transition-colors">{link.label}</Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/eventos" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === "/eventos" ? "bg-primary/10 text-primary" : "text-foreground/70 hover:text-foreground hover:bg-muted"}`}>Eventos</Link>
          <Link to="/sobre" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === "/sobre" ? "bg-primary/10 text-primary" : "text-foreground/70 hover:text-foreground hover:bg-muted"}`}>Sobre</Link>
          <a href="https://heyzine.com/flip-book/1b00f7baf8.html" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg text-sm font-medium transition-colors text-foreground/70 hover:text-foreground hover:bg-muted">Revista</a>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/explorar"><Button variant="ghost" size="icon" className="text-foreground/70"><Search className="h-5 w-5" /></Button></Link>
          {user ? (
            <div ref={userMenuRef} className="relative">
              <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted transition-colors">
                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center"><User className="h-4 w-4 text-primary" /></div>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-xl shadow-lg z-50 py-2 animate-fade-in">
                  <p className="px-4 py-2 text-xs text-muted-foreground truncate border-b border-border mb-1">{user.email}</p>
                  {isAdmin && <Link to="/paineladmin" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-foreground/70 hover:bg-muted hover:text-foreground transition-colors">🛡️ Painel Admin</Link>}
                  <Link to="/favoritos" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-foreground/70 hover:bg-muted hover:text-foreground transition-colors"><Heart className="h-4 w-4" /> Favoritos</Link>
                  <div className="border-t border-border mt-1 pt-1">
                    <button onClick={handleSignOut} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full text-left"><LogOut className="h-4 w-4" /> Sair</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login"><Button variant="default" size="sm" className="gap-2"><User className="h-4 w-4" /> Entrar</Button></Link>
          )}
        </div>

        <button className="md:hidden p-2 text-foreground/70" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card animate-fade-in">
          <nav className="container py-4 flex flex-col gap-1">
            <Link to="/" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium text-foreground/70 hover:bg-muted">Início</Link>
            <Link to="/cidades" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium text-foreground/70 hover:bg-muted">Cidades</Link>
            <button onClick={() => setCatOpen(!catOpen)} className="flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium text-foreground/70 hover:bg-muted">
              Categorias <ChevronDown className={`h-4 w-4 transition-transform ${catOpen ? "rotate-180" : ""}`} />
            </button>
            {catOpen && (
              <div className="ml-4 flex flex-col gap-0.5 bg-muted/30 rounded-lg py-1">
                <Link to="/explorar" onClick={() => setMobileOpen(false)} className="px-4 py-2.5 text-sm text-foreground/70 hover:bg-muted rounded-lg">🔍 Ver Todas</Link>
                {categoryLinks.map((link) => (
                  <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} className="px-4 py-2.5 text-sm text-foreground/70 hover:bg-muted rounded-lg">{link.label}</Link>
                ))}
              </div>
            )}
            <Link to="/eventos" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium text-foreground/70 hover:bg-muted">Eventos</Link>
            <Link to="/sobre" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium text-foreground/70 hover:bg-muted">Sobre</Link>
            <a href="https://heyzine.com/flip-book/1b00f7baf8.html" target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium text-foreground/70 hover:bg-muted">Revista</a>
            <div className="pt-2 border-t border-border mt-2 space-y-2">
              {user ? (
                <>
                  {isAdmin && <Link to="/paineladmin" onClick={() => setMobileOpen(false)}><Button variant="outline" className="w-full gap-2">🛡️ Painel Admin</Button></Link>}
                  <button onClick={() => { handleSignOut(); setMobileOpen(false); }} className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"><LogOut className="h-4 w-4" /> Sair</button>
                </>
              ) : (
                <Link to="/login" onClick={() => setMobileOpen(false)}><Button className="w-full gap-2"><User className="h-4 w-4" /> Entrar</Button></Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
