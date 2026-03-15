import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import type { Tables } from "@/integrations/supabase/types";

type ClienteDB = Tables<"clientes">;

export interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  ultimoServico: string;
  ultimaVisita: string;
  totalGasto: number;
  visitas: number;
  status: "VIP" | "Ativo" | "Em risco" | "Inativo";
  aniversario: string;
  pontos: number;
  avatar: string;
  genero?: string;
  profissao?: string;
  dataNascimento?: string;
  bi?: string;
  observacoes?: string;
}

function mapDbToCliente(row: ClienteDB): Cliente {
  const nomes = row.nome_completo.trim().split(" ");
  const avatar = nomes.length >= 2
    ? (nomes[0][0] + nomes[nomes.length - 1][0]).toUpperCase()
    : row.nome_completo.slice(0, 2).toUpperCase();

  const totalGasto = Number(row.total_gasto) || 0;
  const visitas = row.visitas || 0;

  let status: Cliente["status"] = "Ativo";
  if (row.status === "VIP") status = "VIP";
  else if (row.status === "Em risco") status = "Em risco";
  else if (row.status === "Inativo") status = "Inativo";

  let aniversario = "—";
  if (row.data_nascimento) {
    const d = new Date(row.data_nascimento + "T00:00:00");
    aniversario = d.toLocaleDateString("pt-BR", { day: "numeric", month: "short" });
  }

  return {
    id: row.id,
    nome: row.nome_completo,
    telefone: row.telefone || "",
    email: row.email || "",
    ultimoServico: "—",
    ultimaVisita: row.updated_at ? new Date(row.updated_at).toLocaleDateString("pt-BR", { day: "numeric", month: "short" }) : "—",
    totalGasto,
    visitas,
    status,
    aniversario,
    pontos: row.pontos || 0,
    avatar,
    genero: row.genero || undefined,
    profissao: row.profissao || undefined,
    dataNascimento: row.data_nascimento || undefined,
    bi: row.bi || undefined,
    observacoes: row.observacoes || undefined,
  };
}

interface ClientesContextType {
  clientesList: Cliente[];
  loading: boolean;
  addCliente: (dados: { nome: string; email: string; telefone: string; genero?: string; profissao?: string; dataNascimento?: string; bi?: string; observacoes?: string }) => Promise<void>;
  removeCliente: (id: string) => Promise<void>;
  getCliente: (id: string) => Cliente | undefined;
  refetch: () => Promise<void>;
}

const ClientesContext = createContext<ClientesContextType | null>(null);

export function ClientesProvider({ children }: { children: ReactNode }) {
  const { usuarioLogado } = useAuth();
  const estabId = usuarioLogado?.estabelecimentoId;
  const [clientesList, setClientesList] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClientes = useCallback(async () => {
    if (!estabId) {
      if (usuarioLogado) setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .eq("estabelecimento_id", estabId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setClientesList(data.map(mapDbToCliente));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes, estabId]);

  const addCliente = async (dados: { nome: string; email: string; telefone: string; genero?: string; profissao?: string; dataNascimento?: string; bi?: string; observacoes?: string }) => {
    if (!estabId) throw new Error("Estabelecimento não identificado.");
    
    const { error } = await supabase.from("clientes").insert({
      nome_completo: dados.nome,
      email: dados.email || null,
      telefone: dados.telefone || null,
      genero: dados.genero || null,
      profissao: dados.profissao || null,
      data_nascimento: dados.dataNascimento || null,
      bi: dados.bi || null,
      observacoes: dados.observacoes || null,
      estabelecimento_id: estabId,
    });
    if (!error) await fetchClientes();
    else throw error;
  };

  const removeCliente = async (id: string) => {
    const { error } = await supabase.from("clientes").delete().eq("id", id);
    if (!error) setClientesList(prev => prev.filter(c => c.id !== id));
    else throw error;
  };

  const getCliente = (id: string) => clientesList.find(c => c.id === id);

  return (
    <ClientesContext.Provider value={{ clientesList, loading, addCliente, removeCliente, getCliente, refetch: fetchClientes }}>
      {children}
    </ClientesContext.Provider>
  );
}

export function useClientes() {
  const ctx = useContext(ClientesContext);
  if (!ctx) throw new Error("useClientes must be used within ClientesProvider");
  return ctx;
}
