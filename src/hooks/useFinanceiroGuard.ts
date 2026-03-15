import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function useFinanceiroGuard() {
  const { podeAcessar } = useAuth();
  const navigate = useNavigate();
  const temAcesso = podeAcessar("financeiro_completo");

  useEffect(() => {
    if (!temAcesso) {
      navigate("/dashboard", { replace: true });
    }
  }, [temAcesso, navigate]);

  return temAcesso;
}
