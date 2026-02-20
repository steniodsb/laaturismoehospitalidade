import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DataTable, type Column } from "@/components/admin/DataTable";
import FormModal from "@/components/admin/FormModal";
import DeleteDialog from "@/components/admin/DeleteDialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
}

const columns: Column<Category>[] = [
  { key: "icon", label: "Ícone" },
  { key: "name", label: "Nome" },
  { key: "slug", label: "Slug" },
  { key: "description", label: "Descrição" },
];

const CategoriesAdminPage = () => {
  const [data, setData] = useState<Category[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", icon: "", description: "" });
  const { toast } = useToast();

  const fetchData = async () => {
    const { data } = await supabase.from("categories").select("*").order("name");
    setData((data as Category[]) || []);
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", slug: "", icon: "", description: "" });
    setModalOpen(true);
  };

  const openEdit = (item: Category) => {
    setEditing(item);
    setForm({ name: item.name, slug: item.slug, icon: item.icon || "", description: item.description || "" });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const payload = { ...form, slug };

    if (editing) {
      const { error } = await supabase.from("categories").update(payload).eq("id", editing.id);
      if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
      else toast({ title: "Categoria atualizada!" });
    } else {
      const { error } = await supabase.from("categories").insert(payload);
      if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
      else toast({ title: "Categoria criada!" });
    }
    setLoading(false);
    setModalOpen(false);
    fetchData();
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setLoading(true);
    const { error } = await supabase.from("categories").delete().eq("id", deleting.id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else toast({ title: "Categoria excluída!" });
    setLoading(false);
    setDeleteOpen(false);
    setDeleting(null);
    fetchData();
  };

  return (
    <>
      <DataTable
        title="Categorias"
        columns={columns}
        data={data}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={(item) => { setDeleting(item); setDeleteOpen(true); }}
      />
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Editar Categoria" : "Nova Categoria"} onSubmit={handleSubmit} loading={loading}>
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Nome</label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Slug</label>
          <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-gerado" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Ícone (emoji)</label>
          <Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="🏨" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Descrição</label>
          <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
      </FormModal>
      <DeleteDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete} loading={loading} itemName={deleting?.name} />
    </>
  );
};

export default CategoriesAdminPage;
