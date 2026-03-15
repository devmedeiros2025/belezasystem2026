import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import angolaBg from "@/assets/angola-bg.jpg";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for PASSWORD_RECOVERY event from the URL token
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Senha redefinida com sucesso!");
      navigate("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${angolaBg})`, opacity: 0.15 }}
      />
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="text-4xl text-primary">✦</span>
            <h1 className="font-display text-3xl font-bold text-primary">BeautyCRM</h1>
          </div>
          <p className="text-sm uppercase tracking-[0.2em] text-text3">Gestão de Beleza</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg" style={{ boxShadow: '0 4px 24px hsl(var(--shadow) / 0.1)' }}>
          <h2 className="font-display text-xl font-semibold text-foreground text-center mb-2">
            Redefinir Senha
          </h2>
          <p className="text-sm text-text3 text-center mb-6">
            Insira sua nova senha abaixo.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text2">Nova senha</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-border bg-input px-4 py-3 pr-10 text-sm text-foreground placeholder:text-text3 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text3 hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text2">Confirmar nova senha</label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-border bg-input px-4 py-3 text-sm text-foreground placeholder:text-text3 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg gold-gradient px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Salvando..." : "Redefinir Senha"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => navigate("/login")}
              className="text-sm text-primary hover:underline"
            >
              ← Voltar ao login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
