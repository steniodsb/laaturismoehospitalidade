import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import ImageUpload from "@/components/admin/establishment-forms/ImageUpload";
import FileUpload from "@/components/admin/FileUpload";
import { DOCUMENT_CATEGORIES, documentCategoryLabel, slugify } from "@/lib/regions";
import { ChevronLeft, Plus, Trash2, Upload, Loader2, X, Video } from "lucide-react";

interface Photo { id: string; region_city_id: string; image_url: string; display_order: number; }
interface City { id: string; region_id: string; name: string; video_url: string | null; display_order: number; tourism_region_city_photos: Photo[]; }
interface DocItem { id: string; region_id: string; category: string; label: string; file_url: string; display_order: number; }

const BUCKET = "establishment-images";
const MAX_MB = 5;

const RegionEditorPage = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: "", slug: "", description: "", information: "", cover_image_url: "",
    address: "", contact: "", email: "", display_order: "0", is_active: true,
  });
  const [cities, setCities] = useState<City[]>([]);
  const [documents, setDocuments] = useState<DocItem[]>([]);
  const [savingRegion, setSavingRegion] = useState(false);
  const [newCity, setNewCity] = useState({ name: "", video_url: "" });
  const [newDoc, setNewDoc] = useState({ category: "estatuto", label: "", file_url: "" });

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const fetchAll = async () => {
    if (!id) return;
    const { data: region } = await supabase.from("tourism_regions").select("*").eq("id", id).single();
    if (region) {
      setForm({
        name: region.name, slug: region.slug, description: region.description || "",
        information: region.information || "", cover_image_url: region.cover_image_url || "",
        address: region.address || "", contact: region.contact || "", email: region.email || "",
        display_order: String(region.display_order), is_active: region.is_active,
      });
    }
    const { data: cityData } = await supabase
      .from("tourism_region_cities")
      .select("*, tourism_region_city_photos(*)")
      .eq("region_id", id)
      .order("display_order");
    setCities(((cityData as unknown as City[]) || []).map((c) => ({
      ...c,
      tourism_region_city_photos: [...(c.tourism_region_city_photos || [])].sort((a, b) => a.display_order - b.display_order),
    })));
    const { data: docData } = await supabase.from("tourism_region_documents").select("*").eq("region_id", id).order("display_order");
    setDocuments((docData as DocItem[]) || []);
  };

  useEffect(() => { fetchAll(); /* eslint-disable-next-line */ }, [id]);

  // ---- Região ----
  const saveRegion = async () => {
    if (!id) return;
    setSavingRegion(true);
    const { error } = await supabase.from("tourism_regions").update({
      name: form.name,
      slug: form.slug || slugify(form.name),
      description: form.description || null,
      information: form.information || null,
      cover_image_url: form.cover_image_url || null,
      address: form.address || null,
      contact: form.contact || null,
      email: form.email || null,
      display_order: parseInt(form.display_order) || 0,
      is_active: form.is_active,
    }).eq("id", id);
    setSavingRegion(false);
    if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Região salva!" });
  };

  // ---- Cidades ----
  const addCity = async () => {
    if (!id || !newCity.name.trim()) return;
    const { error } = await supabase.from("tourism_region_cities").insert({
      region_id: id, name: newCity.name.trim(), video_url: newCity.video_url || null, display_order: cities.length,
    });
    if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    setNewCity({ name: "", video_url: "" });
    fetchAll();
  };

  const updateCity = async (cityId: string, patch: { name?: string; video_url?: string | null }) => {
    await supabase.from("tourism_region_cities").update(patch).eq("id", cityId);
  };

  const deleteCity = async (cityId: string) => {
    await supabase.from("tourism_region_cities").delete().eq("id", cityId);
    fetchAll();
  };

  // ---- Documentos ----
  const addDocument = async () => {
    if (!id || !newDoc.label.trim() || !newDoc.file_url.trim()) {
      toast({ title: "Preencha o nome e o link/arquivo do documento", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("tourism_region_documents").insert({
      region_id: id, category: newDoc.category, label: newDoc.label.trim(), file_url: newDoc.file_url.trim(), display_order: documents.length,
    });
    if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    setNewDoc({ category: newDoc.category, label: "", file_url: "" });
    fetchAll();
  };

  const deleteDocument = async (docId: string) => {
    await supabase.from("tourism_region_documents").delete().eq("id", docId);
    fetchAll();
  };

  return (
    <div className="max-w-4xl">
      <Link to="/paineladmin/regioes" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ChevronLeft className="h-4 w-4" /> Voltar para Regiões
      </Link>

      {/* 1. Dados da região */}
      <section className="bg-card border border-border rounded-xl p-5 mb-6">
        <h2 className="text-lg font-medium text-foreground mb-4">Dados da região</h2>
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Nome</label>
              <Input value={form.name} onChange={(e) => { set("name", e.target.value); if (!form.slug) set("slug", slugify(e.target.value)); }} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Slug (URL)</label>
              <Input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="noroeste-paulista" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Descrição (subtítulo)</label>
            <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={2} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Informações</label>
            <Textarea value={form.information} onChange={(e) => set("information", e.target.value)} rows={5} placeholder="Texto do bloco INFORMAÇÕES" />
          </div>
          <ImageUpload value={form.cover_image_url} onChange={(url) => set("cover_image_url", url)} bucket={BUCKET} path={`regions/cover/${id}`} label="Imagem de capa (opcional)" />
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Endereço</label>
              <Input value={form.address} onChange={(e) => set("address", e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Contatos</label>
              <Input value={form.contact} onChange={(e) => set("contact", e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">E-mail</label>
              <Input value={form.email} onChange={(e) => set("email", e.target.value)} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 items-end">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Ordem</label>
              <Input type="number" value={form.display_order} onChange={(e) => set("display_order", e.target.value)} />
            </div>
            <div className="flex items-center gap-2 pb-2">
              <input type="checkbox" checked={form.is_active} onChange={(e) => set("is_active", e.target.checked)} id="region-active" className="h-4 w-4 rounded border-input" />
              <label htmlFor="region-active" className="text-sm font-medium cursor-pointer">Visível no site</label>
            </div>
          </div>
          <Button onClick={saveRegion} disabled={savingRegion}>{savingRegion ? "Salvando..." : "Salvar dados da região"}</Button>
        </div>
      </section>

      {/* 2. Cidades, vídeos e fotos */}
      <section className="bg-card border border-border rounded-xl p-5 mb-6">
        <h2 className="text-lg font-medium text-foreground mb-1">Cidades, vídeos e fotos</h2>
        <p className="text-sm text-muted-foreground mb-4">Cada cidade vira uma coluna na seção FOTOS / VÍDEOS, com seu vídeo e galeria.</p>

        <div className="space-y-4">
          {cities.map((city) => (
            <CityEditor key={city.id} city={city} onUpdate={updateCity} onDelete={deleteCity} onRefresh={fetchAll} />
          ))}
        </div>

        <div className="mt-4 border-t border-border pt-4 grid sm:grid-cols-[1fr_1fr_auto] gap-2 items-end">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Nova cidade</label>
            <Input value={newCity.name} onChange={(e) => setNewCity((c) => ({ ...c, name: e.target.value }))} placeholder="Nome da cidade" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Link do vídeo (opcional)</label>
            <Input value={newCity.video_url} onChange={(e) => setNewCity((c) => ({ ...c, video_url: e.target.value }))} placeholder="YouTube / Vimeo" />
          </div>
          <Button type="button" onClick={addCity} className="gap-1"><Plus className="h-4 w-4" /> Adicionar</Button>
        </div>
      </section>

      {/* 3. Documentos institucionais */}
      <section className="bg-card border border-border rounded-xl p-5 mb-6">
        <h2 className="text-lg font-medium text-foreground mb-1">Documentos institucionais</h2>
        <p className="text-sm text-muted-foreground mb-4">Estatuto, atas, listas de presença, planos, prestação de contas, etc.</p>

        <div className="space-y-2 mb-4">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-border">
              <Badge variant="secondary" className="shrink-0">{documentCategoryLabel(doc.category)}</Badge>
              <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="flex-1 text-sm text-foreground hover:text-primary truncate">{doc.label}</a>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteDocument(doc.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          ))}
          {documents.length === 0 && <p className="text-sm text-muted-foreground">Nenhum documento ainda.</p>}
        </div>

        <div className="border-t border-border pt-4 grid sm:grid-cols-[auto_1fr] gap-3">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Categoria</label>
            <select value={newDoc.category} onChange={(e) => setNewDoc((d) => ({ ...d, category: e.target.value }))} className="h-10 rounded-md border border-input bg-background px-3 text-sm w-full">
              {DOCUMENT_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Nome do documento</label>
            <Input value={newDoc.label} onChange={(e) => setNewDoc((d) => ({ ...d, label: e.target.value }))} placeholder="Ex.: Ata da reunião de junho/2026" />
          </div>
          <div className="sm:col-span-2 flex flex-col sm:flex-row gap-2 sm:items-center">
            <Input value={newDoc.file_url} onChange={(e) => setNewDoc((d) => ({ ...d, file_url: e.target.value }))} placeholder="Cole um link (PDF/Drive) ou envie um arquivo" className="flex-1" />
            <FileUpload label="Enviar arquivo" path={`regions/${id}/docs`} onUploaded={(url, name) => setNewDoc((d) => ({ ...d, file_url: url, label: d.label || name }))} />
            <Button type="button" onClick={addDocument} className="gap-1"><Plus className="h-4 w-4" /> Adicionar</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

// ---- Editor de uma cidade (vídeo + fotos) ----
const CityEditor = ({ city, onUpdate, onDelete, onRefresh }: {
  city: City;
  onUpdate: (id: string, patch: { name?: string; video_url?: string | null }) => Promise<void>;
  onDelete: (id: string) => void;
  onRefresh: () => void;
}) => {
  const { toast } = useToast();
  const [name, setName] = useState(city.name);
  const [videoUrl, setVideoUrl] = useState(city.video_url || "");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const photos = city.tourism_region_city_photos;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    let order = photos.length;
    for (const file of files) {
      if (file.size > MAX_MB * 1024 * 1024) {
        toast({ title: "Arquivo muito grande", description: `${file.name} passa de ${MAX_MB}MB`, variant: "destructive" });
        continue;
      }
      const ext = file.name.split(".").pop();
      const fileName = `regions/${city.region_id}/${city.id}/${Date.now()}-${order}.${ext}`;
      const { error: upErr } = await supabase.storage.from(BUCKET).upload(fileName, file, { upsert: true });
      if (upErr) { toast({ title: "Erro no upload", description: upErr.message, variant: "destructive" }); continue; }
      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
      await supabase.from("tourism_region_city_photos").insert({ region_city_id: city.id, image_url: pub.publicUrl, display_order: order });
      order++;
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
    onRefresh();
  };

  const deletePhoto = async (photoId: string) => {
    await supabase.from("tourism_region_city_photos").delete().eq("id", photoId);
    onRefresh();
  };

  return (
    <div className="border border-border rounded-lg p-3">
      <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-2 items-end mb-3">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Cidade</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} onBlur={() => name !== city.name && onUpdate(city.id, { name })} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Video className="h-3 w-3" /> Link do vídeo</label>
          <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} onBlur={() => videoUrl !== (city.video_url || "") && onUpdate(city.id, { video_url: videoUrl || null })} placeholder="YouTube / Vimeo" />
        </div>
        <Button type="button" variant="ghost" size="icon" className="text-destructive h-10 w-10" onClick={() => onDelete(city.id)}><Trash2 className="h-4 w-4" /></Button>
      </div>

      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground">Fotos ({photos.length})</span>
        <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
          {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
          {uploading ? "Enviando..." : "Enviar fotos"}
        </Button>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
      </div>
      {photos.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {photos.map((p) => (
            <div key={p.id} className="relative group aspect-square rounded-md overflow-hidden border border-border">
              <img src={p.image_url} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={() => deletePhoto(p.id)} className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RegionEditorPage;
