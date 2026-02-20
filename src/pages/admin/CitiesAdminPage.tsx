import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DataTable, type Column } from "@/components/admin/DataTable";
import FormModal from "@/components/admin/FormModal";
import DeleteDialog from "@/components/admin/DeleteDialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface CityItem {
  id: string;
  name: string;
  slug: string;
  region: string | null;
  population: string | null;
  short_description: string | null;
}

const columns: Column<CityItem>[] = [
  { key: "name", label: "Nome" },
  { key: "region", label: "Região" },
  { key: "population", label: "População" },
  { key: "short_description", label: "Descrição curta" },
];

const empty = { name: "", slug: "", region: "", population: "", short_description: "", description: "", image_url: "" };

const CitiesAdminPage = () => {
  const [data, setData] = useState<CityItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<CityItem | null>(null);
  const [deleting, setDeleting] = useState<CityItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(empty);
  const { toast } = useToast();

  const fetchData = async () => {
    const { data } = await supabase.from("cities").select("*").order("name");
    setData((data as CityItem[]) || []);
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => { setEditing(null); setForm(empty); setModalOpen(true); };

  const openEdit = async (item: CityItem) => {
    const { data: full } = await supabase.from("cities").select("*").eq("id", item.id).single();
    if (full) {
      setEditing(item);
      setForm({
        name: full.name || "",
        slug: full.slug || "",
        region: full.region || "",
        population: full.population || "",
        short_description: full.short_description || "",
        description: full.description || "",
        image_url: full.image_url || "",
      });
      setModalOpen(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const payload = { ...form, slug };

    if (editing) {
      const { error } = await supabase.from("cities").update(payload).eq("id", editing.id);
      if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
      else toast({ title: "Cidade atualizada!" });
    } else {
      const { error } = await supabase.from("cities").insert(payload);
      if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
      else toast({ title: "Cidade criada!" });
    }
    setLoading(false);
    setModalOpen(false);
    fetchData();
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setLoading(true);
    await supabase.from("cities").delete().eq("id", deleting.id);
    setLoading(false);
    setDeleteOpen(false);
    setDeleting(null);
    toast({ title: "Cidade excluída!" });
    fetchData();
  };

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <>
      <DataTable title="Cidades" columns={columns} data={data} onAdd={openAdd} onEdit={openEdit} onDelete={(item) => { setDeleting(item); setDeleteOpen(true); }} />
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Editar Cidade" : "Nova Cidade"} onSubmit={handleSubmit} loading={loading}>
        <div><label className="text-sm font-medium text-foreground mb-1.5 block">Nome</label><Input value={form.name} onChange={(e) => set("name", e.target.value)} required /></div>
        <div><label className="text-sm font-medium text-foreground mb-1.5 block">Slug</label><Input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="auto-gerado" /></div>
        <div><label className="text-sm font-medium text-foreground mb-1.5 block">Região</label><Input value={form.region} onChange={(e) => set("region", e.target.value)} /></div>
        <div><label className="text-sm font-medium text-foreground mb-1.5 block">População</label><Input value={form.population} onChange={(e) => set("population", e.target.value)} /></div>
        <div><label className="text-sm font-medium text-foreground mb-1.5 block">Descrição curta</label><Input value={form.short_description} onChange={(e) => set("short_description", e.target.value)} /></div>
        <div><label className="text-sm font-medium text-foreground mb-1.5 block">Descrição</label><Textarea value={form.description} onChange={(e) => set("description", e.target.value)} /></div>
        <div><label className="text-sm font-medium text-foreground mb-1.5 block">URL da Imagem</label><Input value={form.image_url} onChange={(e) => set("image_url", e.target.value)} /></div>
      </FormModal>
      <DeleteDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete} loading={loading} itemName={deleting?.name} />
    </>
  );
};

export default CitiesAdminPage;
