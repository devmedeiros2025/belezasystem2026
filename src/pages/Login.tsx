import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import angolaBg from "@/assets/angola-bg.jpg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [nomeNegocio, setNomeNegocio] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [estabelecimentoNome, setEstabelecimentoNome] = useState<string | null>(null);
  const { login, usuarioLogado, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const slug = searchParams.get("salon");

  // Load establishment name from slug
  useEffect(() => {
    if (!slug) return;
    supabase
      .from("estabelecimentos")
      .select("nome")
      .eq("slug", slug)
      .eq("ativo", true)
      .single()
      .then(({ data }) => {
        if (data) setEstabelecimentoNome(data.nome);
      });
  }, [slug]);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && usuarioLogado) {
      navigate("/dashboard", { replace: true });
    }
  }, [authLoading, usuarioLogado, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isForgot) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("E-mail de recuperação enviado! Verifique sua caixa de entrada.");
        setIsForgot(false);
      }
      setLoading(false);
      return;
    }

    if (isSignup) {
      if (!nomeNegocio.trim()) {
        toast.error("Informe o nome do seu estabelecimento");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password: senha,
        options: { data: { nome } },
      });
      if (error) {
        toast.error(error.message);
      } else if (data.user) {
        // Create the establishment
        const slugValue = nomeNegocio
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

        const { error: estabError } = await supabase
          .from("estabelecimentos")
          .insert({
            nome: nomeNegocio,
            slug: slugValue + "-" + Date.now().toString(36),
            owner_user_id: data.user.id,
          });

        if (estabError) {
          console.error("Erro ao criar estabelecimento:", estabError);
        }

        // Link profile to establishment
        const { data: estabData } = await supabase
          .from("estabelecimentos")
          .select("id")
          .eq("owner_user_id", data.user.id)
          .single();

        if (estabData) {
          await supabase
            .from("profiles")
            .update({ estabelecimento_id: estabData.id })
            .eq("user_id", data.user.id);
        }

        if (data.session) {
          toast.success("Conta e estabelecimento criados com sucesso!");
        } else {
          toast.success("Conta criada! Verifique seu e-mail para confirmar.");
        }
      }
    } else {
      const success = await login(email, senha);
      if (success) {
        toast.success("Login realizado com sucesso!");
      } else {
        toast.error("E-mail ou senha inválidos");
      }
    }
    setLoading(false);
  };

  const getTitle = () => {
    if (isForgot) return "Recuperar Senha";
    if (isSignup) return "Criar Conta & Estabelecimento";
    return "Entrar no Sistema";
  };

  const displayName = estabelecimentoNome || "BeautyCRM";

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
            <h1 className="font-display text-3xl font-bold text-primary">{displayName}</h1>
          </div>
          <p className="text-sm uppercase tracking-[0.2em] text-text3">
            {estabelecimentoNome ? "Área de Acesso" : "Gestão de Beleza"}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg" style={{ boxShadow: '0 4px 24px hsl(var(--shadow) / 0.1)' }}>
          <h2 className="font-display text-xl font-semibold text-foreground text-center mb-6">
            {getTitle()}
          </h2>

          {isForgot && (
            <p className="text-sm text-text3 text-center mb-4">
              Insira seu e-mail e enviaremos um link para redefinir sua senha.
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && !isForgot && (
              <>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text2">Nome do Estabelecimento</label>
                  <input
                    type="text"
                    value={nomeNegocio}
                    onChange={(e) => setNomeNegocio(e.target.value)}
                    placeholder="Ex: Luxe Beauty Salon"
                    className="w-full rounded-lg border border-border bg-input px-4 py-3 text-sm text-foreground placeholder:text-text3 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text2">Seu nome completo</label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full rounded-lg border border-border bg-input px-4 py-3 text-sm text-foreground placeholder:text-text3 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
              </>
            )}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text2">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full rounded-lg border border-border bg-input px-4 py-3 text-sm text-foreground placeholder:text-text3 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

            {!isForgot && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text2">Senha</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
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
                {!isSignup && (
                  <div className="mt-1.5 text-right">
                    <button
                      type="button"
                      onClick={() => { setIsForgot(true); setIsSignup(false); }}
                      className="text-xs text-primary hover:underline"
                    >
                      Esqueci minha senha
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg gold-gradient px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:opacity-90 disabled:opacity-50"
            >
              {loading
                ? (isForgot ? "Enviando..." : isSignup ? "Criando..." : "Entrando...")
                : (isForgot ? "Enviar link de recuperação" : isSignup ? "Criar Conta & Estabelecimento" : "Entrar")}
            </button>
          </form>

          {!isForgot && (
            <>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-text3">ou</span>
                </div>
              </div>

              <button
                type="button"
                onClick={async () => {
                  const { error } = await lovable.auth.signInWithOAuth("google", {
                    redirect_uri: `${window.location.origin}/dashboard`,
                  });
                  if (error) toast.error("Erro ao entrar com Google");
                }}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Entrar com Google
              </button>
            </>
          )}

          <div className="mt-4 text-center space-y-1">
            {isForgot ? (
              <button
                onClick={() => setIsForgot(false)}
                className="text-sm text-primary hover:underline"
              >
                ← Voltar ao login
              </button>
            ) : (
              <button
                onClick={() => setIsSignup(!isSignup)}
                className="text-sm text-primary hover:underline"
              >
                {isSignup ? "Já tenho conta → Entrar" : "Primeiro acesso? Criar meu salão"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
