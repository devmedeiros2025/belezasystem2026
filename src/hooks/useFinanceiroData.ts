import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Tables } from "@/integrations/supabase/types";
import { FormaPagamento } from "@/lib/currency";

export interface Movimentacao {
  id: string;
  data: string;
  hora: string;
  descricao: string;
  categoria: string;
  tipo: "Entrada" | "Saída";
  valor: number;
  formaPgto: FormaPagamento;
  registradoPor: string;
}

export function useFinanceiroData() {
  const { usuarioLogado } = useAuth();
  const estabId = usuarioLogado?.estabelecimentoId;
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    if (!estabId) {
      if (usuarioLogado) setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("movimentacoes")
        .select("*")
        .eq("estabelecimento_id", estabId)
        .order("data", { ascending: false })
        .order("hora", { ascending: false });

      if (error) throw error;
      if (data) setMovimentacoes(data.map(mapMovimentacao));
    } catch (err: any) {
      toast.error("Erro ao carregar dados financeiros: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const mapMovimentacao = (row: Tables<"movimentacoes">): Movimentacao => ({
    id: row.id,
    data: row.data,
    hora: row.hora?.slice(0, 5) || "00:00",
    descricao: row.descricao,
    categoria: row.categoria,
    tipo: (row.tipo as "Entrada" | "Saída") || "Entrada",
    valor: Number(row.valor),
    formaPgto: (row.forma_pgto as FormaPagamento) || "Numerário",
    registradoPor: row.registrado_por || "Sistema"
  });

  const addMovimentacao = async (m: Omit<Movimentacao, "id">) => {
    if (!estabId) throw new Error("Estabelecimento não identificado.");
    try {
      const { error } = await supabase.from("movimentacoes").insert({
        data: m.data,
        hora: m.hora + ":00",
        descricao: m.descricao,
        categoria: m.categoria,
        tipo: m.tipo,
        valor: m.valor,
        forma_pgto: m.formaPgto,
        registrado_por: m.registradoPor,
        estabelecimento_id: estabId
      });

      if (error) throw error;
      toast.success("Movimentação registada com sucesso!");
      await fetchAll();
      return true;
    } catch (err: any) {
      toast.error("Erro ao guardar: " + err.message);
      return false;
    }
  };

  /**
   * Função para registar pagamento automático de serviço da agenda
   */
  const registarPagamentoServico = async (valor: number, descricao: string, formaPgto: FormaPagamento) => {
    return addMovimentacao({
      data: new Date().toISOString().split("T")[0],
      hora: new Date().toLocaleTimeString("pt-AO", { hour: "2-digit", minute: "2-digit" }),
      descricao: `Serviço: ${descricao}`,
      categoria: "Serviço Prestado",
      tipo: "Entrada",
      valor,
      formaPgto,
      registradoPor: "Agenda Auto"
    });
  };

  useEffect(() => {
    fetchAll();
  }, [fetchAll, estabId]);

  return { 
    movimentacoes, 
    loading, 
    addMovimentacao, 
    registarPagamentoServico,
    refetch: fetchAll 
  };
}
