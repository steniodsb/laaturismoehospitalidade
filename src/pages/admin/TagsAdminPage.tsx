import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DataTable, type Column } from "@/components/admin/DataTable";
import FormModal from "@/components/admin/FormModal";
import DeleteDialog from "@/components/admin/DeleteDialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface TagItem {
  id: string;
  name: string;
}

const columns: Column<TagItem>[] = [
  { key: "name", label: "Nome" },
];

const TagsAdminPage = () => {
  const [data, setData] = useState<TagItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<TagItem | null>(null);
  const [deleting, setDeleting] = useState<TagItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const { toast } = useToast();

  const fetchData = async () => {
    const { data } = await supabase.from("tags").select("*").order("name");
    setData((data as TagItem[]) || []);
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => { setEditing(null); setName(""); setModalOpen(true); };
  const openEdit = (item: TagItem) => { setEditing(item); setName(item.name); setModalOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (editing) {
      const { error } = await supabase.from("tags").update({ name }).eq("id", editing.id);
      if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
      else toast({ title: "Tag atualizada!" });
    } else {
      const { error } = await supabase.from("tags").insert({ name });
      if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
      else toast({ title: "Tag criada!" });
    }
    setLoading(false);
    setModalOpen(false);
    fetchData();
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setLoading(true);
    await supabase.from("tags").delete().eq("id", deleting.id);
    setLoading(false);
    setDeleteOpen(false);
    setDeleting(null);
    toast({ title: "Tag excluída!" });
    fetchData();
  };

  return (
    <>
      <DataTable title="Tags" columns={columns} data={data} onAdd={openAdd} onEdit={openEdit} onDelete={(item) => { setDeleting(item); setDeleteOpen(true); }} />
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Editar Tag" : "Nova Tag"} onSubmit={handleSubmit} loading={loading}>
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Nome</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
      </FormModal>
      <DeleteDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete} loading={loading} itemName={deleting?.name} />
    </>
  );
};

export default TagsAdminPage;
