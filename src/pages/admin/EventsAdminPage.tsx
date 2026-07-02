import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DataTable, type Column } from "@/components/admin/DataTable";
import FormModal from "@/components/admin/FormModal";
import DeleteDialog from "@/components/admin/DeleteDialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import ImageUpload from "@/components/admin/establishment-forms/ImageUpload";
import GalleryUpload from "@/components/admin/establishment-forms/GalleryUpload";

interface EventItem {
  id: string;
  name: string;
  event_type: string | null;
  start_date: string | null;
  end_date: string | null;
  city_id: string | null;
  city_name?: string;
}

interface CityOption { id: string; name: string; }

const EventsAdminPage = () => {
  const [data, setData] = useState<EventItem[]>([]);
  const [cities, setCities] = useState<CityOption[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<EventItem | null>(null);
  const [deleting, setDeleting] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Record<string, any>>({ name: "", event_type: "", start_date: "", end_date: "", description: "", image_url: "", city_id: "", is_featured: false, display_order: "0" });
  const [gallery, setGallery] = useState<{ url: string; caption?: string }[]>([]);
  const { toast } = useToast();

  const fetchData = async () => {
    const [evRes, citRes] = await Promise.all([
      supabase.from("events").select("*, cities(name)").order("start_date", { ascending: false }),
      supabase.from("cities").select("id, name").order("name"),
    ]);
    setData((evRes.data || []).map((e: any) => ({ ...e, city_name: e.cities?.name })));
    setCities((citRes.data as CityOption[]) || []);
  };

  useEffect(() => { fetchData(); }, []);

  const columns: Column<EventItem>[] = [
    { key: "name", label: "Nome" },
    { key: "event_type", label: "Tipo" },
    { key: "start_date", label: "Início" },
    { key: "city_name", label: "Cidade" },
  ];

  const openAdd = () => { setEditing(null); setForm({ name: "", event_type: "", start_date: "", end_date: "", description: "", image_url: "", city_id: "", is_featured: false, display_order: "0" }); setGallery([]); setModalOpen(true); };

  const openEdit = async (item: EventItem) => {
    const { data: full } = await supabase.from("events").select("*").eq("id", item.id).single();
    if (full) {
      setEditing(item);
      setGallery(Array.isArray(full.gallery) ? (full.gallery as { url: string; caption?: string }[]) : []);
      setForm({
        name: full.name || "", event_type: full.event_type || "", start_date: full.start_date || "",
        end_date: full.end_date || "", description: full.description || "", image_url: full.image_url || "",
        city_id: full.city_id || "", is_featured: full.is_featured || false, display_order: String(full.display_order || 0),
      });
      setModalOpen(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      name: form.name as string, event_type: form.event_type || null, description: form.description || null,
      image_url: form.image_url || null, city_id: form.city_id || null,
      start_date: form.start_date || null, end_date: form.end_date || null,
      gallery, is_featured: !!form.is_featured, display_order: parseInt(form.display_order) || 0,
    };
    if (editing) {
      const { error } = await supabase.from("events").update(payload).eq("id", editing.id);
      if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
      else toast({ title: "Evento atualizado!" });
    } else {
      const { error } = await supabase.from("events").insert(payload);
      if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
      else toast({ title: "Evento criado!" });
    }
    setLoading(false);
    setModalOpen(false);
    fetchData();
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setLoading(true);
    await supabase.from("events").delete().eq("id", deleting.id);
    setLoading(false);
    setDeleteOpen(false);
    setDeleting(null);
    toast({ title: "Evento excluído!" });
    fetchData();
  };

  const set = (key: string, val: any) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <>
      <DataTable title="Eventos" columns={columns} data={data} onAdd={openAdd} onEdit={openEdit} onDelete={(item) => { setDeleting(item); setDeleteOpen(true); }} />
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Editar Evento" : "Novo Evento"} onSubmit={handleSubmit} loading={loading}>
        <div><label className="text-sm font-medium text-foreground mb-1.5 block">Nome</label><Input value={form.name} onChange={(e) => set("name", e.target.value)} required /></div>
        <div><label className="text-sm font-medium text-foreground mb-1.5 block">Tipo</label><Input value={form.event_type} onChange={(e) => set("event_type", e.target.value)} placeholder="Festival, Show..." /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-sm font-medium text-foreground mb-1.5 block">Data início</label><Input type="date" value={form.start_date} onChange={(e) => set("start_date", e.target.value)} /></div>
          <div><label className="text-sm font-medium text-foreground mb-1.5 block">Data fim</label><Input type="date" value={form.end_date} onChange={(e) => set("end_date", e.target.value)} /></div>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Cidade</label>
          <select value={form.city_id} onChange={(e) => set("city_id", e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
            <option value="">Selecione...</option>
            {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div><label className="text-sm font-medium text-foreground mb-1.5 block">Descrição</label><Textarea value={form.description} onChange={(e) => set("description", e.target.value)} /></div>
        <ImageUpload value={form.image_url} onChange={(url) => set("image_url", url)} path={`events/${editing?.id || "new"}`} label="Imagem do evento" />
        <GalleryUpload value={gallery} onChange={setGallery} path={`events/${editing?.id || "new"}/gallery`} />
        <div className="grid grid-cols-2 gap-3 border-t border-border pt-4">
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => set("is_featured", e.target.checked)} id="event-featured" className="h-4 w-4 rounded border-input" />
            <label htmlFor="event-featured" className="text-sm font-medium text-foreground cursor-pointer">⭐ Exibir na tela inicial</label>
          </div>
          <div><label className="text-sm font-medium text-foreground mb-1.5 block">Ordem de exibição</label><Input type="number" value={form.display_order} onChange={(e) => set("display_order", e.target.value)} /></div>
        </div>
      </FormModal>
      <DeleteDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete} loading={loading} itemName={deleting?.name} />
    </>
  );
};

export default EventsAdminPage;
