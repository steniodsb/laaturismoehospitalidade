import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2 } from "lucide-react";

interface GalleryItem {
  url: string;
  caption?: string;
}

const MAX_FILE_SIZE_MB = 5;

interface GalleryUploadProps {
  value: GalleryItem[];
  onChange: (items: GalleryItem[]) => void;
  bucket?: string;
  path?: string;
  maxSizeMB?: number;
}

const GalleryUpload = ({ value, onChange, bucket = "establishment-images", path = "gallery", maxSizeMB = MAX_FILE_SIZE_MB }: GalleryUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setError("");
    const oversized = Array.from(files).filter(f => f.size > maxSizeMB * 1024 * 1024);
    if (oversized.length > 0) {
      setError(`${oversized.length} arquivo(s) excede(m) o limite de ${maxSizeMB}MB`);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    setUploading(true);
    const newItems: GalleryItem[] = [];
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const fileName = `${path}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, file, { upsert: true });
      if (!uploadError) {
        const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
        newItems.push({ url: data.publicUrl });
      }
    }
    onChange([...value, ...newItems]);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="text-sm font-medium text-foreground mb-1.5 block">Galeria de fotos</label>
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-2">
          {value.map((item, i) => (
            <div key={i} className="relative h-24 rounded-md overflow-hidden border border-border">
              <img src={item.url} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={() => removeItem(i)} className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      <Button type="button" variant="outline" className="w-full border-dashed" onClick={() => inputRef.current?.click()} disabled={uploading}>
        {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
        {uploading ? "Enviando..." : "Adicionar fotos"}
      </Button>
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
      <p className="text-xs text-muted-foreground mt-1">Máximo: {maxSizeMB}MB por arquivo</p>
    </div>
  );
};

export default GalleryUpload;
