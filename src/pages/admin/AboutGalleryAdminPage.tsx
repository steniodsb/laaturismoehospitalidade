import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DataTable, type Column } from "@/components/admin/DataTable";
import FormModal from "@/components/admin/FormModal";
import DeleteDialog from "@/components/admin/DeleteDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Upload, Loader2, X } from "lucide-react";

interface Album {
  id: string;
  title: string;
  event_date: string | null;
  display_order: number;
  is_active: boolean;
  photoCount?: number;
}

interface Photo {
  id: string;
  album_id: string;
  image_url: string;
  caption: string | null;
  display_order: number;
}

const BUCKET = "establishment-images";
const MAX_MB = 5;

const AboutGalleryAdminPage = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<Album | null>(null);
  const [deleting, setDeleting] = useState<Album | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", event_date: "", display_order: "0", is_active: true });
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const fetchData = async () => {
    const { data } = await supabase
      .from("about_albums")
      .select("*, about_album_photos(count)")
      .order("event_date", { ascending: false, nullsFirst: false })
      .order("display_order");
    const mapped = (data || []).map((a: any) => ({
      ...a,
      photoCount: a.about_album_photos?.[0]?.count ?? 0,
    }));
    setAlbums(mapped as Album[]);
  };

  useEffect(() => { fetchData(); }, []);

  const fetchPhotos = async (albumId: string) => {
    const { data } = await supabase
      .from("about_album_photos")
      .select("*")
      .eq("album_id", albumId)
      .order("display_order");
    setPhotos((data as Photo[]) || []);
  };

  const columns: Column<Album>[] = [
    { key: "title", label: "Evento / Feira" },
    { key: "event_date", label: "Data", render: (a) => a.event_date ? new Date(a.event_date + "T00:00:00").toLocaleDateString("pt-BR") : "—" },
    { key: "photoCount", label: "Fotos", render: (a) => <Badge variant="secondary">{a.photoCount ?? 0}</Badge> },
    { key: "display_order", label: "Ordem" },
    { key: "is_active", label: "Status", render: (a) => <Badge variant={a.is_active ? "default" : "secondary"}>{a.is_active ? "Visível" : "Oculto"}</Badge> },
  ];

  const openAdd = () => {
    setEditing(null);
    setForm({ title: "", event_date: "", display_order: "0", is_active: true });
    setPhotos([]);
    setModalOpen(true);
  };

  const openEdit = (a: Album) => {
    setEditing(a);
    setForm({ title: a.title, event_date: a.event_date || "", display_order: String(a.display_order), is_active: a.is_active });
    fetchPhotos(a.id);
    setModalOpen(true);
  };

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      title: form.title,
      event_date: form.event_date || null,
      display_order: parseInt(form.display_order) || 0,
      is_active: form.is_active,
    };
    if (editing) {
      const { error } = await supabase.from("about_albums").update(payload).eq("id", editing.id);
      if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); setLoading(false); return; }
      toast({ title: "Evento atualizado!" });
    } else {
      const { error } = await supabase.from("about_albums").insert(payload);
      if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); setLoading(false); return; }
      toast({ title: "Evento criado!", description: "Abra-o em editar para enviar as fotos." });
    }
    setLoading(false);
    setModalOpen(false);
    fetchData();
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setLoading(true);
    await supabase.from("about_albums").delete().eq("id", deleting.id);
    setLoading(false);
    setDeleteOpen(false);
    setDeleting(null);
    toast({ title: "Evento excluído!" });
    fetchData();
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!editing || files.length === 0) return;
    setUploading(true);
    let order = photos.length;
    for (const file of files) {
      if (file.size > MAX_MB * 1024 * 1024) {
        toast({ title: "Arquivo muito grande", description: `${file.name} passa de ${MAX_MB}MB`, variant: "destructive" });
        continue;
      }
      const ext = file.name.split(".").pop();
      const fileName = `about/${editing.id}/${Date.now()}-${order}.${ext}`;
      const { error: upErr } = await supabase.storage.from(BUCKET).upload(fileName, file, { upsert: true });
      if (upErr) { toast({ title: "Erro no upload", description: upErr.message, variant: "destructive" }); continue; }
      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
      await supabase.from("about_album_photos").insert({ album_id: editing.id, image_url: pub.publicUrl, display_order: order });
      order++;
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
    fetchPhotos(editing.id);
    fetchData();
  };

  const deletePhoto = async (photo: Photo) => {
    await supabase.from("about_album_photos").delete().eq("id", photo.id);
    fetchPhotos(photo.album_id);
    fetchData();
  };

  const updatePhotoOrder = async (id: string, value: string) => {
    await supabase.from("about_album_photos").update({ display_order: parseInt(value) || 0 }).eq("id", id);
    if (editing) fetchPhotos(editing.id);
  };

  const movePhoto = async (photo: Photo, newAlbumId: string) => {
    if (newAlbumId === photo.album_id) return;
    await supabase.from("about_album_photos").update({ album_id: newAlbumId }).eq("id", photo.id);
    toast({ title: "Foto movida!" });
    if (editing) fetchPhotos(editing.id);
    fetchData();
  };

  return (
    <>
      <DataTable
        title="Sobre — Galeria por evento"
        columns={columns}
        data={albums}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={(a) => { setDeleting(a); setDeleteOpen(true); }}
        searchPlaceholder="Buscar evento..."
        searchField="title"
      />

      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Editar evento" : "Novo evento"} onSubmit={handleSubmit} loading={loading} wide>
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Nome do evento / feira</label>
          <Input value={form.title} onChange={(e) => set("title", e.target.value)} required placeholder="Ex.: Feira de Turismo de São Paulo" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Data</label>
            <Input type="date" value={form.event_date} onChange={(e) => set("event_date", e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Ordem</label>
            <Input type="number" value={form.display_order} onChange={(e) => set("display_order", e.target.value)} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={form.is_active} onChange={(e) => set("is_active", e.target.checked)} id="album-active" className="h-4 w-4 rounded border-input" />
          <label htmlFor="album-active" className="text-sm font-medium text-foreground cursor-pointer">Visível no site</label>
        </div>

        {editing ? (
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-foreground">Fotos do evento ({photos.length})</label>
              <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
                {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                {uploading ? "Enviando..." : "Enviar fotos"}
              </Button>
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
            </div>
            {photos.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma foto ainda. Clique em "Enviar fotos" (pode selecionar várias de uma vez).</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {photos.map((p) => (
                  <div key={p.id} className="rounded-md border border-border overflow-hidden bg-card">
                    <div className="relative aspect-square">
                      <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => deletePhoto(p)} className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:opacity-90">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="p-1.5 space-y-1">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-muted-foreground">Ordem</span>
                        <Input type="number" defaultValue={p.display_order} onBlur={(e) => updatePhotoOrder(p.id, e.target.value)} className="h-6 text-xs px-1.5" />
                      </div>
                      <select
                        value={p.album_id}
                        onChange={(e) => movePhoto(p, e.target.value)}
                        className="w-full h-6 text-[11px] rounded border border-input bg-background px-1"
                        title="Mover para outro evento"
                      >
                        {albums.map((al) => (
                          <option key={al.id} value={al.id}>{al.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground border-t border-border pt-4">Salve o evento primeiro; depois reabra em <strong>editar</strong> para enviar as fotos.</p>
        )}
      </FormModal>

      <DeleteDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete} loading={loading} itemName={deleting?.title} />
    </>
  );
};

export default AboutGalleryAdminPage;
