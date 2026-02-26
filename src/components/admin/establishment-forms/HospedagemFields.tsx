import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Props {
  details: Record<string, any>;
  setDetail: (key: string, val: any) => void;
}

const HospedagemFields = ({ details, setDetail }: Props) => (
  <div className="space-y-3 border-t border-border pt-4">
    <h4 className="text-sm font-semibold text-foreground">Dados de Hospedagem</h4>
    <div className="grid grid-cols-2 gap-3">
      <div><Label>Check-in</Label><Input value={details.checkIn || ""} onChange={(e) => setDetail("checkIn", e.target.value)} placeholder="14:00" /></div>
      <div><Label>Check-out</Label><Input value={details.checkOut || ""} onChange={(e) => setDetail("checkOut", e.target.value)} placeholder="12:00" /></div>
    </div>
    <div><Label>Faixa de preço</Label><Input value={details.priceRange || ""} onChange={(e) => setDetail("priceRange", e.target.value)} placeholder="R$ 200 - R$ 500" /></div>
    <div><Label>Total de quartos</Label><Input type="number" value={details.totalRooms || ""} onChange={(e) => setDetail("totalRooms", e.target.value)} /></div>
    <div><Label>Tipos de quarto (separar por vírgula)</Label><Input value={details.roomTypes || ""} onChange={(e) => setDetail("roomTypes", e.target.value)} placeholder="Standard, Luxo, Suíte" /></div>
    <div><Label>Idiomas atendidos (separar por vírgula)</Label><Input value={details.languages || ""} onChange={(e) => setDetail("languages", e.target.value)} placeholder="Português, Inglês, Espanhol" /></div>
    <div className="flex flex-wrap gap-4">
      {[
        { key: "petsAllowed", label: "Pets permitidos" },
        { key: "breakfastIncluded", label: "Café da manhã incluso" },
        { key: "parkingIncluded", label: "Estacionamento incluso" },
      ].map(({ key, label }) => (
        <div key={key} className="flex items-center gap-2">
          <Checkbox checked={!!details[key]} onCheckedChange={(v) => setDetail(key, !!v)} id={key} />
          <Label htmlFor={key} className="cursor-pointer">{label}</Label>
        </div>
      ))}
    </div>
    <div><Label>Política de cancelamento</Label><Textarea value={details.cancellationPolicy || ""} onChange={(e) => setDetail("cancellationPolicy", e.target.value)} /></div>
  </div>
);

export default HospedagemFields;
