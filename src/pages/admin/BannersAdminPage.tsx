import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DataTable, type Column } from "@/components/admin/DataTable";
import FormModal from "@/components/admin/FormModal";
import DeleteDialog from "@/components/admin/DeleteDialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import ImageUpload from "@/components/admin/establishment-forms/ImageUpload";

interface BannerItem {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  link_url: string | null;
  display_order: number;
  is_active: boolean;
}

const BannersAdminPage = () => {
  const [data, setData] = useState<BannerItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<BannerItem | null>(null);
  const [deleting, setDeleting] = useState<BannerItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", subtitle: "", image_url: "", link_url: "", display_order: "0", is_active: true });
  const { toast } = useToast();

  const fetchData = async () => {
    const { data: banners } = await supabase.from("banners").select("*").order("display_order");
    setData((banners as BannerItem[]) || []);
  };

  useEffect(() => { fetchData(); }, []);

  const columns: Column<BannerItem>[] = [
    { key: "title", label: "Título" },
    { key: "display_order", label: "Ordem" },
    { key: "is_active", label: "Status", render: (item) => (
      <Badge variant={item.is_active ? "default" : "secondary"}>{item.is_active ? "Ativo" : "Inativo"}</Badge>
    )},
    { key: "image_url", label: "Imagem", render: (item) => (
      item.image_url ? <img src={item.image_url} alt="" className="h-10 w-16 object-cover rounded" /> : <span className="text-muted-foreground text-xs">Sem imagem</span>
    )},
  ];

  const openAdd = () => {
    setEditing(null);
    setForm({ title: "", subtitle: "", image_url: "", link_url: "", display_order: "0", is_active: true });
    setModalOpen(true);
  };

  const openEdit = (item: BannerItem) => {
    setEditing(item);
    setForm({
      title: item.title, subtitle: item.subtitle || "", image_url: item.image_url,
      link_url: item.link_url || "", display_order: String(item.display_order), is_active: item.is_active,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      title: form.title, subtitle: form.subtitle || null, image_url: form.image_url,
      link_url: form.link_url || null, display_order: parseInt(form.display_order) || 0, is_active: form.is_active,
    };

    if (editing) {
      const { error } = await supabase.from("banners").update(payload).eq("id", editing.id);
      if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); setLoading(false); return; }
      toast({ title: "Banner atualizado!" });
    } else {
      const { error } = await supabase.from("banners").insert(payload);
      if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); setLoading(false); return; }
      toast({ title: "Banner criado!" });
    }
    setLoading(false);
    setModalOpen(false);
    fetchData();
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setLoading(true);
    await supabase.from("banners").delete().eq("id", deleting.id);
    setLoading(false);
    setDeleteOpen(false);
    setDeleting(null);
    toast({ title: "Banner excluído!" });
    fetchData();
  };

  const set = (key: string, val: any) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <>
      <DataTable title="Banners" columns={columns} data={data} onAdd={openAdd} onEdit={openEdit} onDelete={(item) => { setDeleting(item); setDeleteOpen(true); }} />
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Editar Banner" : "Novo Banner"} onSubmit={handleSubmit} loading={loading}>
        <div><label className="text-sm font-medium text-foreground mb-1.5 block">Título</label><Input value={form.title} onChange={(e) => set("title", e.target.value)} required /></div>
        <div><label className="text-sm font-medium text-foreground mb-1.5 block">Subtítulo</label><Input value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} /></div>
        <ImageUpload value={form.image_url} onChange={(url) => set("image_url", url)} path={`banners/${editing?.id || "new"}`} label="Imagem do banner" />
        <div><label className="text-sm font-medium text-foreground mb-1.5 block">Link (opcional)</label><Input value={form.link_url} onChange={(e) => set("link_url", e.target.value)} placeholder="/explorar" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-sm font-medium text-foreground mb-1.5 block">Ordem</label><Input type="number" value={form.display_order} onChange={(e) => set("display_order", e.target.value)} /></div>
          <div className="flex items-center gap-2 pt-6">
            <input type="checkbox" checked={form.is_active} onChange={(e) => set("is_active", e.target.checked)} id="banner-active" className="h-4 w-4 rounded border-input" />
            <label htmlFor="banner-active" className="text-sm font-medium text-foreground cursor-pointer">Ativo</label>
          </div>
        </div>
      </FormModal>
      <DeleteDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete} loading={loading} itemName={deleting?.title} />
    </>
  );
};

export default BannersAdminPage;
