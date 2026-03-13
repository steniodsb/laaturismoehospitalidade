import { Link } from "react-router-dom";
import { Instagram, Mail, Phone } from "lucide-react";
import logoFull from "@/assets/logo-laa-full.png";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <img src={logoFull} alt="LAA Turismo & Hospitalidade" className="h-24 w-auto brightness-110" />
            </Link>
            <p className="text-sm text-background/60 leading-relaxed">
              Seu guia completo de turismo e lazer no interior paulista.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-sans font-semibold text-sm mb-4 text-background/90">Navegação</h4>
            <ul className="space-y-2 text-sm text-background/60">
              <li><Link to="/" className="hover:text-primary transition-colors">Início</Link></li>
              <li><Link to="/cidades" className="hover:text-primary transition-colors">Cidades</Link></li>
              <li><Link to="/explorar" className="hover:text-primary transition-colors">Explorar</Link></li>
              <li><Link to="/eventos" className="hover:text-primary transition-colors">Eventos</Link></li>
              <li><Link to="/sobre" className="hover:text-primary transition-colors">Sobre</Link></li>
            </ul>
          </div>

          {/* Categorias */}
          <div>
            <h4 className="font-sans font-semibold text-sm mb-4 text-background/90">Categorias</h4>
            <ul className="space-y-2 text-sm text-background/60">
              <li><Link to="/explorar?cat=hospedagem" className="hover:text-primary transition-colors">Hospedagem</Link></li>
              <li><Link to="/explorar?cat=gastronomia" className="hover:text-primary transition-colors">Gastronomia</Link></li>
              <li><Link to="/explorar?cat=lazer" className="hover:text-primary transition-colors">Lazer</Link></li>
              <li><Link to="/explorar?cat=cultura" className="hover:text-primary transition-colors">Cultura</Link></li>
              <li><Link to="/explorar?cat=artesanato" className="hover:text-primary transition-colors">Artesanato</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-sans font-semibold text-sm mb-4 text-background/90">Contato</h4>
            <ul className="space-y-3 text-sm text-background/60">
              <li className="flex items-center gap-2">
                <Instagram className="h-4 w-4 text-primary" />
                <a href="https://instagram.com/laaturismohospitalidade" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  @laaturismohospitalidade
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>contato@laaturismo.com.br</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>(17) 99999-0000</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-10 pt-6 text-center text-xs text-background/40">
          © 2026 LAA Turismo & Hospitalidade. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
