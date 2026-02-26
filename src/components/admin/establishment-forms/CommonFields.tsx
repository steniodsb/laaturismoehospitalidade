import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "./ImageUpload";
import GalleryUpload from "./GalleryUpload";

interface Option { id: string; name: string; }

interface CommonFieldsProps {
  form: Record<string, any>;
  set: (key: string, val: any) => void;
  categories: Option[];
  cities: Option[];
  tags: Option[];
  selectedTags: string[];
  toggleTag: (id: string) => void;
  gallery: { url: string; caption?: string }[];
  onGalleryChange: (items: { url: string; caption?: string }[]) => void;
  storagePath: string;
}

const CommonFields = ({ form, set, categories, cities, tags, selectedTags, toggleTag, gallery, onGalleryChange, storagePath }: CommonFieldsProps) => (
  <>
    <div><label className="text-sm font-medium text-foreground mb-1.5 block">Nome</label><Input value={form.name} onChange={(e) => set("name", e.target.value)} required /></div>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="text-sm font-medium text-foreground mb-1.5 block">Categoria</label>
        <select value={form.category_id} onChange={(e) => set("category_id", e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
          <option value="">Selecione...</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-1.5 block">Cidade</label>
        <select value={form.city_id} onChange={(e) => set("city_id", e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
          <option value="">Selecione...</option>
          {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
    </div>
    <div><label className="text-sm font-medium text-foreground mb-1.5 block">Descrição curta</label><Input value={form.short_description} onChange={(e) => set("short_description", e.target.value)} /></div>
    <div><label className="text-sm font-medium text-foreground mb-1.5 block">Descrição</label><Textarea value={form.description} onChange={(e) => set("description", e.target.value)} /></div>
    <div className="grid grid-cols-2 gap-3">
      <div><label className="text-sm font-medium text-foreground mb-1.5 block">Telefone</label><Input value={form.phone} onChange={(e) => set("phone", e.target.value)} /></div>
      <div><label className="text-sm font-medium text-foreground mb-1.5 block">WhatsApp</label><Input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} /></div>
    </div>
    <div><label className="text-sm font-medium text-foreground mb-1.5 block">Endereço</label><Input value={form.address} onChange={(e) => set("address", e.target.value)} /></div>
    <div className="grid grid-cols-2 gap-3">
      <div><label className="text-sm font-medium text-foreground mb-1.5 block">Latitude</label><Input type="number" step="any" value={form.latitude} onChange={(e) => set("latitude", e.target.value)} /></div>
      <div><label className="text-sm font-medium text-foreground mb-1.5 block">Longitude</label><Input type="number" step="any" value={form.longitude} onChange={(e) => set("longitude", e.target.value)} /></div>
    </div>
    <div><label className="text-sm font-medium text-foreground mb-1.5 block">Comodidades (separar por vírgula)</label><Input value={form.amenities} onChange={(e) => set("amenities", e.target.value)} placeholder="Wi-Fi, Piscina, Estacionamento" /></div>
    
    <ImageUpload value={form.image_url} onChange={(url) => set("image_url", url)} path={storagePath} />
    <GalleryUpload value={gallery} onChange={onGalleryChange} path={`${storagePath}/gallery`} />

    {tags.length > 0 && (
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Tags</label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button type="button" key={tag.id} onClick={() => toggleTag(tag.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                selectedTags.includes(tag.id) ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border hover:border-primary/50"
              }`}>
              {tag.name}
            </button>
          ))}
        </div>
      </div>
    )}
  </>
);

export default CommonFields;
