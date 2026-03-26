import { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5">
      <div className="container text-center">
        <div className="max-w-lg mx-auto">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-5">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-3xl font-sans font-normal text-foreground mb-3">Fique por Dentro</h2>
          <p className="text-muted-foreground mb-8">
            Receba as melhores dicas de turismo e eventos do interior paulista diretamente no seu e-mail.
          </p>
          {submitted ? (
            <p className="text-secondary font-semibold animate-fade-in">
              ✓ Obrigado! Você receberá nossas novidades em breve.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="Seu melhor e-mail"
                className="flex-1 px-4 py-3 rounded-l-xl border border-border bg-card text-foreground text-sm outline-none focus:border-primary transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-r-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors flex items-center gap-1"
              >
                Inscrever
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
