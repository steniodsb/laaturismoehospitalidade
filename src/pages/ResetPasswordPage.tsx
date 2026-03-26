import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import logoLaa from "@/assets/logo-laa.webp";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setValid(true);
    }
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Senha atualizada!" });
      navigate("/login");
    }
  };

  if (!valid) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-sans font-normal text-foreground mb-4">Link inválido</h1>
          <p className="text-muted-foreground">Use o link enviado por e-mail para redefinir a senha.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logoLaa} alt="LAA" className="h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-sans font-normal text-foreground">Nova Senha</h1>
        </div>
        <form onSubmit={handleUpdate} className="bg-card border border-border rounded-2xl p-8 shadow-card space-y-5">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Nova senha</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" required minLength={6} />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Atualizando..." : "Redefinir senha"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
