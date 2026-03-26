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
    <div className="flex flex-col items-center text-center mb-10">
      <h2 className="text-3xl md:text-4xl font-semibold text-foreground">{title}</h2>
      {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
      {linkTo && (
        <Link
          to={linkTo}
          className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors mt-3"
        >
          {linkLabel} <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
};

export default SectionHeader;
