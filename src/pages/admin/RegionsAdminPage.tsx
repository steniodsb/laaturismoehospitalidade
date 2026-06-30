import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DataTable, type Column } from "@/components/admin/DataTable";
import FormModal from "@/components/admin/FormModal";
import DeleteDialog from "@/components/admin/DeleteDialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { slugify } from "@/lib/regions";

interface Region {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
  cityCount?: number;
}

const RegionsAdminPage = () => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState<Region | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchData = async () => {
    const { data } = await supabase
      .from("tourism_regions")
      .select("*, tourism_region_cities(count)")
      .order("display_order");
    const mapped = (data || []).map((r: any) => ({ ...r, cityCount: r.tourism_region_cities?.[0]?.count ?? 0 }));
    setRegions(mapped as Region[]);
  };

  useEffect(() => { fetchData(); }, []);

  const columns: Column<Region>[] = [
    { key: "name", label: "Região" },
    { key: "slug", label: "Slug" },
    { key: "cityCount", label: "Cidades", render: (r) => <Badge variant="secondary">{r.cityCount ?? 0}</Badge> },
    { key: "display_order", label: "Ordem" },
    { key: "is_active", label: "Status", render: (r) => <Badge variant={r.is_active ? "default" : "secondary"}>{r.is_active ? "Visível" : "Oculto"}</Badge> },
  ];

  const openAdd = () => {
    setForm({ name: "", description: "" });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const slug = slugify(form.name);
    const { data, error } = await supabase
      .from("tourism_regions")
      .insert({ name: form.name, slug, description: form.description || null })
      .select("id")
      .single();
    setLoading(false);
    if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    setModalOpen(false);
    toast({ title: "Região criada!", description: "Adicione cidades, fotos e documentos." });
    navigate(`/paineladmin/regioes/${data!.id}`);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setLoading(true);
    await supabase.from("tourism_regions").delete().eq("id", deleting.id);
    setLoading(false);
    setDeleteOpen(false);
    setDeleting(null);
    toast({ title: "Região excluída!" });
    fetchData();
  };

  return (
    <>
      <DataTable
        title="Regiões Turísticas"
        columns={columns}
        data={regions}
        onAdd={openAdd}
        onEdit={(r) => navigate(`/paineladmin/regioes/${r.id}`)}
        onDelete={(r) => { setDeleting(r); setDeleteOpen(true); }}
        searchPlaceholder="Buscar região..."
        searchField="name"
      />

      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title="Nova Região Turística" onSubmit={handleSubmit} loading={loading}>
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Nome da região</label>
          <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required placeholder="Ex.: Noroeste Paulista" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Descrição (opcional)</label>
          <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} />
        </div>
        <p className="text-xs text-muted-foreground">Ao salvar, você será levado ao editor para adicionar informações, cidades, fotos/vídeos e documentos.</p>
      </FormModal>

      <DeleteDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete} loading={loading} itemName={deleting?.name} />
    </>
  );
};

export default RegionsAdminPage;
