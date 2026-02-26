import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Props {
  details: Record<string, any>;
  setDetail: (key: string, val: any) => void;
}

const GastronomiaFields = ({ details, setDetail }: Props) => (
  <div className="space-y-3 border-t border-border pt-4">
    <h4 className="text-sm font-semibold text-foreground">Dados de Gastronomia</h4>
    <div className="grid grid-cols-2 gap-3">
      <div><Label>Tipo de cozinha</Label><Input value={details.cuisineType || ""} onChange={(e) => setDetail("cuisineType", e.target.value)} placeholder="Italiana, Japonesa..." /></div>
      <div><Label>Faixa de preço</Label><Input value={details.priceRange || ""} onChange={(e) => setDetail("priceRange", e.target.value)} placeholder="$$" /></div>
    </div>
    <div><Label>Especialidades (separar por vírgula)</Label><Input value={details.specialties || ""} onChange={(e) => setDetail("specialties", e.target.value)} /></div>
    <div><Label>Horário de funcionamento</Label><Input value={details.openingHours || ""} onChange={(e) => setDetail("openingHours", e.target.value)} placeholder="Seg-Sex 11h-23h" /></div>
    <div className="grid grid-cols-2 gap-3">
      <div><Label>Capacidade</Label><Input type="number" value={details.capacity || ""} onChange={(e) => setDetail("capacity", e.target.value)} /></div>
      <div><Label>Nome do chef</Label><Input value={details.chefName || ""} onChange={(e) => setDetail("chefName", e.target.value)} /></div>
    </div>
    <div><Label>Formas de pagamento (separar por vírgula)</Label><Input value={details.paymentMethods || ""} onChange={(e) => setDetail("paymentMethods", e.target.value)} placeholder="Pix, Cartão, Dinheiro" /></div>
    <div className="flex flex-wrap gap-4">
      {[
        { key: "reservationRequired", label: "Reserva necessária" },
        { key: "delivery", label: "Delivery" },
        { key: "liveMusic", label: "Música ao vivo" },
        { key: "outdoorArea", label: "Área externa" },
      ].map(({ key, label }) => (
        <div key={key} className="flex items-center gap-2">
          <Checkbox checked={!!details[key]} onCheckedChange={(v) => setDetail(key, !!v)} id={key} />
          <Label htmlFor={key} className="cursor-pointer">{label}</Label>
        </div>
      ))}
    </div>
  </div>
);

export default GastronomiaFields;
