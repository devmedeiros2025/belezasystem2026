import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { Perfil } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedProfiles?: Perfil[];
}

export default function ProtectedRoute({ children, allowedProfiles }: ProtectedRouteProps) {
  const { usuarioLogado, perfil, loading } = useAuth();
  const [trialExpired, setTrialExpired] = useState(false);
  const [checkingTrial, setCheckingTrial] = useState(true);

  useEffect(() => {
    if (!usuarioLogado) {
      setCheckingTrial(false);
      return;
    }

    const checkTrial = async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("estabelecimento_id")
        .eq("user_id", usuarioLogado.id)
        .single();

      if (!profile?.estabelecimento_id) {
        setCheckingTrial(false);
        return;
      }

      const { data: estab } = await supabase
        .from("estabelecimentos")
        .select("trial_expires_at, plano")
        .eq("id", profile.estabelecimento_id)
        .single();

      if (estab && estab.plano === "basico" && estab.trial_expires_at) {
        const expiresAt = new Date(estab.trial_expires_at);
        if (expiresAt < new Date()) {
          setTrialExpired(true);
        }
      }
      setCheckingTrial(false);
    };

    checkTrial();
  }, [usuarioLogado]);

  if (loading || checkingTrial) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-sm text-text3">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!usuarioLogado) {
    return <Navigate to="/login" replace />;
  }

  if (trialExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md text-center space-y-6">
          <div className="text-5xl">⏰</div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Período de teste expirado
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Seus 3 dias de teste gratuito terminaram. Para continuar utilizando o BeautyCRM,
            escolha um dos nossos planos e desbloqueie todo o potencial do sistema.
          </p>
          <div className="flex flex-col gap-3">
            <a
              href="/#planos"
              className="gold-gradient px-6 py-3 rounded-xl text-primary-foreground font-semibold shadow-lg hover:opacity-90 transition-all inline-block"
            >
              Ver Planos & Preços
            </a>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = "/";
              }}
              className="text-sm text-primary hover:underline"
            >
              Sair da conta
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (allowedProfiles && perfil && !allowedProfiles.includes(perfil)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
