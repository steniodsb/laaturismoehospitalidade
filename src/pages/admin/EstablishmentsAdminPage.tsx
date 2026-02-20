import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DataTable, type Column } from "@/components/admin/DataTable";
import FormModal from "@/components/admin/FormModal";
import DeleteDialog from "@/components/admin/DeleteDialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface EstItem {
  id: string;
  name: string;
  city_name?: string;
  category_name?: string;
  is_active: boolean;
  phone: string | null;
}

interface Option { id: string; name: string; }

const EstablishmentsAdminPage = () => {
  const [data, setData] = useState<EstItem[]>([]);
  const [cities, setCities] = useState<Option[]>([]);
  const [categories, setCategories] = useState<Option[]>([]);
  const [tags, setTags] = useState<Option[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<EstItem | null>(null);
  const [deleting, setDeleting] = useState<EstItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", slug: "", city_id: "", category_id: "", description: "", short_description: "",
    image_url: "", phone: "", whatsapp: "", address: "", amenities: "",
  });
  const { toast } = useToast();

  const fetchData = async () => {
    const [estRes, citRes, catRes, tagRes] = await Promise.all([
      supabase.from("establishments").select("*, cities(name), categories(name)").order("name"),
      supabase.from("cities").select("id, name").order("name"),
      supabase.from("categories").select("id, name").order("name"),
      supabase.from("tags").select("id, name").order("name"),
    ]);
    setData((estRes.data || []).map((e: any) => ({
      ...e,
      city_name: e.cities?.name,
      category_name: e.categories?.name,
    })));
    setCities((citRes.data as Option[]) || []);
    setCategories((catRes.data as Option[]) || []);
    setTags((tagRes.data as Option[]) || []);
  };

  useEffect(() => { fetchData(); }, []);

  const columns: Column<EstItem>[] = [
    { key: "name", label: "Nome" },
    { key: "category_name", label: "Categoria" },
    { key: "city_name", label: "Cidade" },
    { key: "is_active", label: "Status", render: (item) => (
      <Badge variant={item.is_active ? "default" : "secondary"}>{item.is_active ? "Ativo" : "Inativo"}</Badge>
    )},
  ];

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", slug: "", city_id: "", category_id: "", description: "", short_description: "", image_url: "", phone: "", whatsapp: "", address: "", amenities: "" });
    setSelectedTags([]);
    setModalOpen(true);
  };

  const openEdit = async (item: EstItem) => {
    const [{ data: full }, { data: etags }] = await Promise.all([
      supabase.from("establishments").select("*").eq("id", item.id).single(),
      supabase.from("establishment_tags").select("tag_id").eq("establishment_id", item.id),
    ]);
    if (full) {
      setEditing(item);
      setForm({
        name: full.name || "", slug: full.slug || "", city_id: full.city_id || "", category_id: full.category_id || "",
        description: full.description || "", short_description: full.short_description || "", image_url: full.image_url || "",
        phone: full.phone || "", whatsapp: full.whatsapp || "", address: full.address || "",
        amenities: (full.amenities || []).join(", "),
      });
      setSelectedTags((etags || []).map((t: any) => t.tag_id));
      setModalOpen(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const amenities = form.amenities.split(",").map((a) => a.trim()).filter(Boolean);
    const payload = {
      name: form.name, slug, city_id: form.city_id || null, category_id: form.category_id || null,
      description: form.description, short_description: form.short_description, image_url: form.image_url,
      phone: form.phone, whatsapp: form.whatsapp, address: form.address, amenities,
    };

    let estId = editing?.id;
    if (editing) {
      const { error } = await supabase.from("establishments").update(payload).eq("id", editing.id);
      if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); setLoading(false); return; }
    } else {
      const { data: inserted, error } = await supabase.from("establishments").insert(payload).select("id").single();
      if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); setLoading(false); return; }
      estId = inserted?.id;
    }

    // Sync tags
    if (estId) {
      await supabase.from("establishment_tags").delete().eq("establishment_id", estId);
      if (selectedTags.length > 0) {
        await supabase.from("establishment_tags").insert(
          selectedTags.map((tag_id) => ({ establishment_id: estId!, tag_id }))
        );
      }
    }

    toast({ title: editing ? "Estabelecimento atualizado!" : "Estabelecimento criado!" });
    setLoading(false);
    setModalOpen(false);
    fetchData();
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setLoading(true);
    await supabase.from("establishment_tags").delete().eq("establishment_id", deleting.id);
    await supabase.from("establishments").delete().eq("id", deleting.id);
    setLoading(false);
    setDeleteOpen(false);
    setDeleting(null);
    toast({ title: "Estabelecimento excluído!" });
    fetchData();
  };

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));
  const toggleTag = (tagId: string) =>
    setSelectedTags((prev) => prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]);

  return (
    <>
      <DataTable title="Estabelecimentos" columns={columns} data={data} onAdd={openAdd} onEdit={openEdit} onDelete={(item) => { setDeleting(item); setDeleteOpen(true); }} />
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Editar Estabelecimento" : "Novo Estabelecimento"} onSubmit={handleSubmit} loading={loading}>
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
        <div><label className="text-sm font-medium text-foreground mb-1.5 block">Comodidades (separar por vírgula)</label><Input value={form.amenities} onChange={(e) => set("amenities", e.target.value)} placeholder="Wi-Fi, Piscina, Estacionamento" /></div>
        <div><label className="text-sm font-medium text-foreground mb-1.5 block">URL da Imagem</label><Input value={form.image_url} onChange={(e) => set("image_url", e.target.value)} /></div>

        {tags.length > 0 && (
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Tags</label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  type="button"
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    selectedTags.includes(tag.id)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted text-muted-foreground border-border hover:border-primary/50"
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </FormModal>
      <DeleteDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete} loading={loading} itemName={deleting?.name} />
    </>
  );
};

export default EstablishmentsAdminPage;
