import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  linkTo?: string;
  linkLabel?: string;
}

const SectionHeader = ({ title, subtitle, linkTo, linkLabel = "Ver todos" }: SectionHeaderProps) => {
  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-serif text-foreground">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {linkTo && (
        <Link
          to={linkTo}
          className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          {linkLabel} <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
};

export default SectionHeader;
