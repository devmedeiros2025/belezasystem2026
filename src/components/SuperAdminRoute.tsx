import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface SuperAdminRouteProps {
  children: ReactNode;
}

export default function SuperAdminRoute({ children }: SuperAdminRouteProps) {
  const { usuarioLogado, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // Redireciona para 404 se não for SuperAdmin (segurança por obscuridade)
  if (!usuarioLogado || usuarioLogado.perfil !== "SuperAdmin") {
    return <Navigate to="/404" replace />;
  }

  return <>{children}</>;
}
