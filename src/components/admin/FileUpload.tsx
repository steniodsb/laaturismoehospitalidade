import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";

interface FileUploadProps {
  onUploaded: (url: string, fileName: string) => void;
  bucket?: string;
  path?: string;
  accept?: string;
  label?: string;
  maxSizeMB?: number;
}

const FileUpload = ({
  onUploaded,
  bucket = "establishment-images",
  path = "regions/docs",
  accept = "*",
  label = "Enviar arquivo",
  maxSizeMB = 20,
}: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Arquivo muito grande. Máximo: ${maxSizeMB}MB`);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const fileName = `${path}/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from(bucket).upload(fileName, file, { upsert: true });
    if (!upErr) {
      const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
      onUploaded(data.publicUrl, file.name);
    } else {
      setError(upErr.message);
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="inline-flex flex-col gap-1">
      <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={uploading}>
        {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
        {uploading ? "Enviando..." : label}
      </Button>
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handle} />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};

export default FileUpload;
