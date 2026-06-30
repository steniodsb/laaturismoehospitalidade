import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard, Building2, MapPin, Tag, Tags, Calendar,
  Users, LogOut, Menu, X, ChevronLeft, Image, Images, Map
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import logoLaa from "@/assets/logo-laa.webp";

const navItems = [
  { to: "/paineladmin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/paineladmin/banners", label: "Banners", icon: Image },
  { to: "/paineladmin/estabelecimentos", label: "Estabelecimentos", icon: Building2 },
  { to: "/paineladmin/cidades", label: "Cidades", icon: MapPin },
  { to: "/paineladmin/categorias", label: "Categorias", icon: Tag },
  { to: "/paineladmin/tags", label: "Tags", icon: Tags },
  { to: "/paineladmin/eventos", label: "Eventos", icon: Calendar },
  { to: "/paineladmin/sobre-galeria", label: "Sobre — Galeria", icon: Images },
  { to: "/paineladmin/regioes", label: "Regiões Turísticas", icon: Map },
];

const AdminLayout = () => {
  const { user, signOut, isAdmin, roles } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/paineladmin/login");
  };

  const isActive = (path: string, exact?: boolean) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-card border-r border-border flex flex-col transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoLaa} alt="LAA" className="h-10 w-auto" />
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.to, item.exact)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-border space-y-2">
          <div className="px-3 py-2">
            <p className="text-sm font-medium text-foreground truncate">{user?.email}</p>
            <p className="text-xs text-muted-foreground capitalize">{roles.join(", ") || "Usuário"}</p>
          </div>
          <Link to="/" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <ChevronLeft className="h-4 w-4" /> Voltar ao site
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors w-full"
          >
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-md border-b border-border h-14 flex items-center px-4 gap-4 lg:px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-muted-foreground">
            <Menu className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-sans font-normal text-foreground">Painel Administrativo</h2>
        </header>
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
