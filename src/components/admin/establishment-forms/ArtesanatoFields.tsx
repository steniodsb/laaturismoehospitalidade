import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Props {
  details: Record<string, any>;
  setDetail: (key: string, val: any) => void;
}

const ArtesanatoFields = ({ details, setDetail }: Props) => (
  <div className="space-y-3 border-t border-border pt-4">
    <h4 className="text-sm font-semibold text-foreground">Dados de Artesanato</h4>
    <div><Label>Produtos oferecidos (separar por vírgula)</Label><Input value={details.products || ""} onChange={(e) => setDetail("products", e.target.value)} /></div>
    <div><Label>Horário de funcionamento</Label><Input value={details.openingHours || ""} onChange={(e) => setDetail("openingHours", e.target.value)} /></div>
    <div className="flex items-center gap-2">
      <Checkbox checked={!!details.workshopsAvailable} onCheckedChange={(v) => setDetail("workshopsAvailable", !!v)} id="workshopsAvailable" />
      <Label htmlFor="workshopsAvailable" className="cursor-pointer">Oficinas disponíveis</Label>
    </div>
  </div>
);

export default ArtesanatoFields;
