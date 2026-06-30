// Categorias de documentos institucionais de uma Região Turística (bloco "INSTITUCIONAL").
export const DOCUMENT_CATEGORIES = [
  { value: "estatuto", label: "Doc./Estatuto" },
  { value: "atas", label: "Atas" },
  { value: "listas_presenca", label: "Listas de Presenças" },
  { value: "plano_trabalho", label: "Plano de Trabalho" },
  { value: "plano_regional", label: "Plano Reg. de Turismo" },
  { value: "prestacao_contas", label: "Prest. de Contas" },
  { value: "outros", label: "Outros" },
] as const;

export const documentCategoryLabel = (value: string) =>
  DOCUMENT_CATEGORIES.find((c) => c.value === value)?.label || "Outros";

// Gera um slug a partir do nome da região.
export const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

// Converte um link de vídeo (YouTube/Vimeo) em URL de embed; senão devolve o original.
export const toEmbedUrl = (url: string): string => {
  if (!url) return "";
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return url;
};
