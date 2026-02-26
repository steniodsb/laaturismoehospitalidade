import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DataTable, type Column } from "@/components/admin/DataTable";
import FormModal from "@/components/admin/FormModal";
import DeleteDialog from "@/components/admin/DeleteDialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import CommonFields from "@/components/admin/establishment-forms/CommonFields";
import HospedagemFields from "@/components/admin/establishment-forms/HospedagemFields";
import GastronomiaFields from "@/components/admin/establishment-forms/GastronomiaFields";
import LazerFields from "@/components/admin/establishment-forms/LazerFields";
import CulturaFields from "@/components/admin/establishment-forms/CulturaFields";
import ArtesanatoFields from "@/components/admin/establishment-forms/ArtesanatoFields";
import GenericFields from "@/components/admin/establishment-forms/GenericFields";

interface EstItem {
  id: string;
  name: string;
  city_name?: string;
  category_name?: string;
  category_slug?: string;
  is_active: boolean;
  phone: string | null;
}

interface Option { id: string; name: string; slug?: string; }

const CATEGORY_SLUG_MAP: Record<string, string> = {};

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
  const [form, setForm] = useState<Record<string, any>>({
    name: "", slug: "", city_id: "", category_id: "", description: "", short_description: "",
    image_url: "", phone: "", whatsapp: "", address: "", amenities: "", latitude: "", longitude: "",
    is_featured: false, display_order: "0",
  });
  const [details, setDetails] = useState<Record<string, any>>({});
  const [gallery, setGallery] = useState<{ url: string; caption?: string }[]>([]);
  const { toast } = useToast();

  const fetchData = async () => {
    const [estRes, citRes, catRes, tagRes] = await Promise.all([
      supabase.from("establishments").select("*, cities(name), categories(name, slug)").order("name"),
      supabase.from("cities").select("id, name").order("name"),
      supabase.from("categories").select("id, name, slug").order("name"),
      supabase.from("tags").select("id, name").order("name"),
    ]);
    const cats = (catRes.data || []) as any[];
    cats.forEach((c: any) => { CATEGORY_SLUG_MAP[c.id] = c.slug; });
    setData((estRes.data || []).map((e: any) => ({
      ...e,
      city_name: e.cities?.name,
      category_name: e.categories?.name,
      category_slug: e.categories?.slug,
    })));
    setCities((citRes.data as Option[]) || []);
    setCategories(cats.map((c: any) => ({ id: c.id, name: c.name, slug: c.slug })));
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

  const resetForm = () => {
    setForm({ name: "", slug: "", city_id: "", category_id: "", description: "", short_description: "", image_url: "", phone: "", whatsapp: "", address: "", amenities: "", latitude: "", longitude: "", is_featured: false, display_order: "0" });
    setDetails({});
    setGallery([]);
    setSelectedTags([]);
  };

  const openAdd = () => { setEditing(null); resetForm(); setModalOpen(true); };

  const openEdit = async (item: EstItem) => {
    const [{ data: full }, { data: etags }] = await Promise.all([
      supabase.from("establishments").select("*").eq("id", item.id).single(),
      supabase.from("establishment_tags").select("tag_id").eq("establishment_id", item.id),
    ]);
    if (full) {
      setEditing(item);
      const d = (full.details as Record<string, any>) || {};
      setForm({
        name: full.name || "", slug: full.slug || "", city_id: full.city_id || "", category_id: full.category_id || "",
        description: full.description || "", short_description: full.short_description || "", image_url: full.image_url || "",
        phone: full.phone || "", whatsapp: full.whatsapp || "", address: full.address || "",
        amenities: (full.amenities || []).join(", "),
        latitude: full.latitude?.toString() || "", longitude: full.longitude?.toString() || "",
        is_featured: full.is_featured || false, display_order: String(full.display_order || 0),
      });
      setGallery(Array.isArray(d.gallery) ? d.gallery : []);
      const { gallery: _g, ...rest } = d;
      setDetails(rest);
      setSelectedTags((etags || []).map((t: any) => t.tag_id));
      setModalOpen(true);
    }
  };

  const getCategorySlug = () => CATEGORY_SLUG_MAP[form.category_id] || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const amenities = form.amenities.split(",").map((a: string) => a.trim()).filter(Boolean);
    const fullDetails = { ...details, gallery };
    const payload = {
      name: form.name, slug, city_id: form.city_id || null, category_id: form.category_id || null,
      description: form.description, short_description: form.short_description, image_url: form.image_url,
      phone: form.phone, whatsapp: form.whatsapp, address: form.address, amenities,
      latitude: form.latitude ? parseFloat(form.latitude) : null,
      longitude: form.longitude ? parseFloat(form.longitude) : null,
      details: fullDetails,
      is_featured: !!form.is_featured, display_order: parseInt(form.display_order) || 0,
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

    if (estId) {
      await supabase.from("establishment_tags").delete().eq("establishment_id", estId);
      if (selectedTags.length > 0) {
        await supabase.from("establishment_tags").insert(selectedTags.map((tag_id) => ({ establishment_id: estId!, tag_id })));
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

  const set = (key: string, val: any) => setForm((f) => ({ ...f, [key]: val }));
  const setDetail = (key: string, val: any) => setDetails((d) => ({ ...d, [key]: val }));
  const toggleTag = (tagId: string) =>
    setSelectedTags((prev) => prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]);

  const categorySlug = getCategorySlug();
  const storagePath = editing?.id || `new-${Date.now()}`;

  const renderCategoryFields = () => {
    switch (categorySlug) {
      case "hospedagem": return <HospedagemFields details={details} setDetail={setDetail} />;
      case "gastronomia": return <GastronomiaFields details={details} setDetail={setDetail} />;
      case "lazer": return <LazerFields details={details} setDetail={setDetail} />;
      case "cultura": return <CulturaFields details={details} setDetail={setDetail} />;
      case "artesanato": return <ArtesanatoFields details={details} setDetail={setDetail} />;
      case "comercio": case "servicos": case "emergencia": case "utilidade_publica":
        return <GenericFields details={details} setDetail={setDetail} />;
      default: return null;
    }
  };

  return (
    <>
      <DataTable title="Estabelecimentos" columns={columns} data={data} onAdd={openAdd} onEdit={openEdit} onDelete={(item) => { setDeleting(item); setDeleteOpen(true); }} />
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Editar Estabelecimento" : "Novo Estabelecimento"} onSubmit={handleSubmit} loading={loading} wide>
        <CommonFields form={form} set={set} categories={categories} cities={cities} tags={tags} selectedTags={selectedTags} toggleTag={toggleTag} gallery={gallery} onGalleryChange={setGallery} storagePath={storagePath} />
        {renderCategoryFields()}
      </FormModal>
      <DeleteDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete} loading={loading} itemName={deleting?.name} />
    </>
  );
};

export default EstablishmentsAdminPage;
