import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Props {
  details: Record<string, any>;
  setDetail: (key: string, val: any) => void;
}

const CulturaFields = ({ details, setDetail }: Props) => (
  <div className="space-y-3 border-t border-border pt-4">
    <h4 className="text-sm font-semibold text-foreground">Dados de Cultura</h4>
    <div><Label>Horário de funcionamento</Label><Input value={details.openingHours || ""} onChange={(e) => setDetail("openingHours", e.target.value)} /></div>
    <div><Label>Preço de entrada</Label><Input value={details.priceRange || ""} onChange={(e) => setDetail("priceRange", e.target.value)} placeholder="Gratuito / R$ 10" /></div>
    <div>
      <Label>Tipo</Label>
      <select value={details.venueType || ""} onChange={(e) => setDetail("venueType", e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
        <option value="">Selecione...</option>
        <option value="museu">Museu</option>
        <option value="teatro">Teatro</option>
        <option value="galeria">Galeria</option>
        <option value="centro_cultural">Centro Cultural</option>
        <option value="biblioteca">Biblioteca</option>
        <option value="outro">Outro</option>
      </select>
    </div>
    <div><Label>Exposições atuais</Label><Textarea value={details.currentExhibitions || ""} onChange={(e) => setDetail("currentExhibitions", e.target.value)} /></div>
  </div>
);

export default CulturaFields;
