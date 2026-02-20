import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";
import logoLaa from "@/assets/logo-laa.webp";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/"><img src={logoLaa} alt="LAA" className="h-16 mx-auto mb-4" /></Link>
          <h1 className="text-2xl font-serif text-foreground">Recuperar Senha</h1>
        </div>

        {sent ? (
          <div className="bg-card border border-border rounded-2xl p-8 shadow-card text-center">
            <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
            <p className="text-foreground font-medium mb-2">E-mail enviado!</p>
            <p className="text-sm text-muted-foreground">Verifique sua caixa de entrada para redefinir a senha.</p>
            <Link to="/login" className="text-primary text-sm hover:underline mt-4 block">Voltar para login</Link>
          </div>
        ) : (
          <form onSubmit={handleReset} className="bg-card border border-border rounded-2xl p-8 shadow-card space-y-5">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">E-mail</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Enviando..." : "Enviar link de recuperação"}
            </Button>
            <Link to="/login" className="text-primary text-sm hover:underline block text-center">Voltar para login</Link>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
