import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  details: Record<string, any>;
  setDetail: (key: string, val: any) => void;
}

const GenericFields = ({ details, setDetail }: Props) => (
  <div className="space-y-3 border-t border-border pt-4">
    <h4 className="text-sm font-semibold text-foreground">Informações adicionais</h4>
    <div><Label>Horário de funcionamento</Label><Input value={details.openingHours || ""} onChange={(e) => setDetail("openingHours", e.target.value)} /></div>
    <div><Label>Serviços oferecidos (separar por vírgula)</Label><Input value={details.services || ""} onChange={(e) => setDetail("services", e.target.value)} /></div>
  </div>
);

export default GenericFields;
