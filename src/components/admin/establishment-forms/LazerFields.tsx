import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  details: Record<string, any>;
  setDetail: (key: string, val: any) => void;
}

const LazerFields = ({ details, setDetail }: Props) => (
  <div className="space-y-3 border-t border-border pt-4">
    <h4 className="text-sm font-semibold text-foreground">Dados de Lazer</h4>
    <div><Label>Horário de funcionamento</Label><Input value={details.openingHours || ""} onChange={(e) => setDetail("openingHours", e.target.value)} placeholder="Seg-Dom 9h-18h" /></div>
    <div><Label>Faixa de preço / Entrada</Label><Input value={details.priceRange || ""} onChange={(e) => setDetail("priceRange", e.target.value)} placeholder="Gratuito / R$ 20" /></div>
    <div><Label>Faixa etária recomendada</Label><Input value={details.ageRange || ""} onChange={(e) => setDetail("ageRange", e.target.value)} placeholder="Todas as idades" /></div>
    <div><Label>Atividades disponíveis (separar por vírgula)</Label><Input value={details.activities || ""} onChange={(e) => setDetail("activities", e.target.value)} /></div>
  </div>
);

export default LazerFields;
