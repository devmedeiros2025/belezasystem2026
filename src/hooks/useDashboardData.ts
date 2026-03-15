import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardData {
  // KPIs
  receitaMes: number;
  receitaMesAnterior: number;
  despesasMes: number;
  despesasMesAnterior: number;
  agendamentosHoje: number;
  agendamentosConfirmados: number;
  agendamentosPendentes: number;
  novosClientesMes: number;
  novosClientesMesAnterior: number;
  totalClientes: number;

  // Tendência mensal (últimos 6 meses)
  tendenciaMensal: { mes: string; receita: number; despesas: number; clientes: number; agendamentos: number }[];

  // Clientes
  clientesVIP: { id: string; nome: string; avatar: string; ultimoServico: string; totalGasto: number; visitas: number }[];
  clientesFrequentes: { id: string; nome: string; avatar: string; ultimoServico: string; totalGasto: number; visitas: number }[];
  clientesNovos: { id: string; nome: string; avatar: string; ultimoServico: string; totalGasto: number; visitas: number }[];

  // Profissionais performance
  profissionais: { id: string; nome: string; emoji: string; cor: string; atendimentos: number; receita: number }[];

  // Agendamentos da semana
  agendamentosSemana: { id: string; clienteNome: string; servico: string; profissional: string; dia: string; hora: string; status: string; cor: string }[];

  // Despesas por categoria
  despesasCategoria: { categoria: string; valor: number; pct: number }[];

  // Contas
  contasReceber: { cliente: string; valor: number; vencimento: string; status: string }[];
  contasPagar: { fornecedor: string; valor: number; vencimento: string; status: string }[];

  // Comissões
  comissoes: { nome: string; atendimentos: number; receita: number; comissaoPct: number; comissaoValor: number }[];

  // Receita semanal do mês atual
  receitaSemanal: { semana: string; valor: number }[];

  // Serviços populares
  servicosPopulares: { nome: string; contagem: number }[];

  loading: boolean;
}

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function getMonthRange(offset: number) {
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const start = d.toISOString().split("T")[0];
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().split("T")[0];
  return { start, end, label: MESES[d.getMonth()] };
}

function avatarFromName(name: string) {
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

function getWeekDayLabel(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][d.getDay()];
}

function getWeekRange() {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);
  return {
    start: monday.toISOString().split("T")[0],
    end: friday.toISOString().split("T")[0],
  };
}

export function useDashboardData(): DashboardData {
  const { usuarioLogado } = useAuth();
  const estabId = usuarioLogado?.estabelecimentoId;

  const [data, setData] = useState<DashboardData>({
    receitaMes: 0, receitaMesAnterior: 0, despesasMes: 0, despesasMesAnterior: 0,
    agendamentosHoje: 0, agendamentosConfirmados: 0, agendamentosPendentes: 0,
    novosClientesMes: 0, novosClientesMesAnterior: 0, totalClientes: 0,
    tendenciaMensal: [], clientesVIP: [], clientesFrequentes: [], clientesNovos: [],
    profissionais: [], agendamentosSemana: [], despesasCategoria: [],
    contasReceber: [], contasPagar: [], comissoes: [], receitaSemanal: [],
    servicosPopulares: [], loading: true,
  });

  const fetchAll = useCallback(async () => {
    if (!estabId) {
      if (usuarioLogado) setData(prev => ({ ...prev, loading: false }));
      return;
    }

    const hoje = new Date().toISOString().split("T")[0];
    const mesAtual = getMonthRange(0);
    const mesAnterior = getMonthRange(-1);
    const week = getWeekRange();

    // Parallel queries
    const [
      movMesAtual, movMesAnterior, despMesAtual, despMesAnterior,
      agHoje, clientesAll, profsAll, agSemana,
      contasRec, contasPag, salariosAll, mov6meses, desp6meses, ag6meses
    ] = await Promise.all([
      supabase.from("movimentacoes").select("*").eq("estabelecimento_id", estabId).gte("data", mesAtual.start).lte("data", mesAtual.end),
      supabase.from("movimentacoes").select("*").eq("estabelecimento_id", estabId).gte("data", mesAnterior.start).lte("data", mesAnterior.end),
      supabase.from("despesas").select("*").eq("estabelecimento_id", estabId).gte("data", mesAtual.start).lte("data", mesAtual.end),
      supabase.from("despesas").select("*").eq("estabelecimento_id", estabId).gte("data", mesAnterior.start).lte("data", mesAnterior.end),
      supabase.from("agendamentos").select("*").eq("estabelecimento_id", estabId).eq("data", hoje),
      supabase.from("clientes").select("*").eq("estabelecimento_id", estabId).order("total_gasto", { ascending: false }),
      supabase.from("profissionais").select("*").eq("estabelecimento_id", estabId),
      supabase.from("agendamentos").select("*").eq("estabelecimento_id", estabId).gte("data", week.start).lte("data", week.end).order("data").order("hora"),
      supabase.from("contas_receber").select("*").eq("estabelecimento_id", estabId).neq("status", "Pago").order("vencimento"),
      supabase.from("contas_pagar").select("*").eq("estabelecimento_id", estabId).order("vencimento"),
      supabase.from("salarios_config").select("*").eq("estabelecimento_id", estabId),
      // Last 6 months movimentacoes
      supabase.from("movimentacoes").select("*").eq("estabelecimento_id", estabId).gte("data", getMonthRange(-5).start).lte("data", mesAtual.end),
      supabase.from("despesas").select("*").eq("estabelecimento_id", estabId).gte("data", getMonthRange(-5).start).lte("data", mesAtual.end),
      supabase.from("agendamentos").select("*").eq("estabelecimento_id", estabId).gte("data", getMonthRange(-5).start).lte("data", mesAtual.end),
    ]);

    const movAtualData = movMesAtual.data || [];
    const movAnteriorData = movMesAnterior.data || [];
    const despAtualData = despMesAtual.data || [];
    const despAnteriorData = despMesAnterior.data || [];
    const agHojeData = agHoje.data || [];
    const clientes = clientesAll.data || [];
    const profs = profsAll.data || [];
    const agSemanaData = agSemana.data || [];
    const contasRecData = contasRec.data || [];
    const contasPagData = contasPag.data || [];
    const salariosData = salariosAll.data || [];

    // Receita / Despesas do mês
    const receitaMes = movAtualData.filter(m => m.tipo === "Entrada").reduce((s, m) => s + Number(m.valor), 0);
    const receitaMesAnterior = movAnteriorData.filter(m => m.tipo === "Entrada").reduce((s, m) => s + Number(m.valor), 0);
    const despesasMes = despAtualData.reduce((s, d) => s + Number(d.valor), 0);
    const despesasMesAnterior = despAnteriorData.reduce((s, d) => s + Number(d.valor), 0);

    // Agendamentos hoje
    const agendamentosConfirmados = agHojeData.filter(a => a.status === "Confirmado").length;
    const agendamentosPendentes = agHojeData.filter(a => a.status === "Pendente").length;

    // Novos clientes
    const novosClientesMes = clientes.filter(c => c.created_at >= mesAtual.start).length;
    const novosClientesMesAnterior = clientes.filter(c => c.created_at >= mesAnterior.start && c.created_at < mesAtual.start).length;

    // Map clientes
    const mapCliente = (c: typeof clientes[0]) => ({
      id: c.id,
      nome: c.nome_completo,
      avatar: avatarFromName(c.nome_completo),
      ultimoServico: "—",
      totalGasto: Number(c.total_gasto) || 0,
      visitas: c.visitas || 0,
    });

    const clientesVIP = clientes.filter(c => c.status === "VIP").slice(0, 5).map(mapCliente);
    const clientesFrequentes = clientes.filter(c => (c.visitas || 0) >= 10).slice(0, 5).map(mapCliente);
    const clientesNovos = clientes.filter(c => c.created_at >= mesAtual.start).slice(0, 5).map(mapCliente);

    // Profissionais performance (from agendamentos this month)
    const profPerf = profs.map(p => {
      const agProf = movAtualData.filter(m => m.tipo === "Entrada" && m.beneficiario_origem === p.nome);
      return {
        id: p.id,
        nome: p.nome,
        emoji: p.emoji || "👤",
        cor: p.cor || "gold",
        atendimentos: agHojeData.filter(a => a.profissional_id === p.id || a.profissional_nome === p.nome).length * 30, // estimate from month
        receita: agProf.reduce((s, m) => s + Number(m.valor), 0),
      };
    });

    // Agenda da semana
    const profMap = Object.fromEntries(profs.map(p => [p.id, p]));
    const agSemMapped = agSemanaData.map(a => ({
      id: a.id,
      clienteNome: a.cliente_nome,
      servico: a.servico,
      profissional: a.profissional_nome,
      dia: getWeekDayLabel(a.data),
      hora: typeof a.hora === "string" ? a.hora.slice(0, 5) : a.hora,
      status: a.status,
      cor: profMap[a.profissional_id || ""]?.cor || "gold",
    }));

    // Despesas por categoria
    const despCatMap: Record<string, number> = {};
    despAtualData.forEach(d => {
      despCatMap[d.categoria] = (despCatMap[d.categoria] || 0) + Number(d.valor);
    });
    const totalDesp = Object.values(despCatMap).reduce((s, v) => s + v, 0) || 1;
    const despesasCategoria = Object.entries(despCatMap)
      .sort((a, b) => b[1] - a[1])
      .map(([cat, val]) => ({ categoria: cat, valor: val, pct: Math.round((val / totalDesp) * 1000) / 10 }));

    // Contas a receber
    const contasReceber = contasRecData.slice(0, 5).map(c => ({
      cliente: c.cliente,
      valor: Number(c.valor_total) - Number(c.valor_pago),
      vencimento: new Date(c.vencimento + "T00:00:00").toLocaleDateString("pt-BR", { day: "numeric", month: "short" }),
      status: new Date(c.vencimento) < new Date(hoje) ? "atrasado" : "pendente",
    }));

    // Contas a pagar
    const contasPagar = contasPagData.slice(0, 5).map(c => ({
      fornecedor: c.fornecedor_beneficiario,
      valor: Number(c.valor),
      vencimento: new Date(c.vencimento + "T00:00:00").toLocaleDateString("pt-BR", { day: "numeric", month: "short" }),
      status: c.status.toLowerCase().includes("pag") ? "pago" : c.status.toLowerCase().includes("venc") ? "atrasado" : "pendente",
    }));

    // Comissões
    const comissoes = salariosData.map(s => ({
      nome: s.profissional,
      atendimentos: s.atendimentos_mes,
      receita: Number(s.receita_gerada_mes),
      comissaoPct: Number(s.comissao_pct),
      comissaoValor: Math.round(Number(s.receita_gerada_mes) * Number(s.comissao_pct) / 100),
    }));

    // Tendência mensal (últimos 6 meses)
    const mov6 = mov6meses.data || [];
    const desp6 = desp6meses.data || [];
    const ag6 = ag6meses.data || [];
    const tendenciaMensal: DashboardData["tendenciaMensal"] = [];
    for (let i = -5; i <= 0; i++) {
      const mr = getMonthRange(i);
      const recMes = mov6.filter(m => m.tipo === "Entrada" && m.data >= mr.start && m.data <= mr.end).reduce((s, m) => s + Number(m.valor), 0);
      const despMes = desp6.filter(d => d.data >= mr.start && d.data <= mr.end).reduce((s, d) => s + Number(d.valor), 0);
      const cliMes = clientes.filter(c => c.created_at >= mr.start && c.created_at <= mr.end + "T23:59:59").length;
      const agMes = ag6.filter(a => a.data >= mr.start && a.data <= mr.end).length;
      tendenciaMensal.push({ mes: mr.label, receita: recMes, despesas: despMes, clientes: cliMes, agendamentos: agMes });
    }

    // Receita semanal (dividir mês atual em semanas)
    const receitaSemanal: { semana: string; valor: number }[] = [];
    const mesStart = new Date(mesAtual.start);
    for (let w = 0; w < 4; w++) {
      const wStart = new Date(mesStart);
      wStart.setDate(mesStart.getDate() + w * 7);
      const wEnd = new Date(wStart);
      wEnd.setDate(wStart.getDate() + 6);
      const wStartStr = wStart.toISOString().split("T")[0];
      const wEndStr = wEnd.toISOString().split("T")[0];
      const val = movAtualData.filter(m => m.tipo === "Entrada" && m.data >= wStartStr && m.data <= wEndStr).reduce((s, m) => s + Number(m.valor), 0);
      receitaSemanal.push({ semana: `Sem ${w + 1}`, valor: val });
    }

    // Serviços populares (from agendamentos this month)
    const agMesData = ag6.filter(a => a.data >= mesAtual.start && a.data <= mesAtual.end);
    const servCount: Record<string, number> = {};
    agMesData.forEach(a => { servCount[a.servico] = (servCount[a.servico] || 0) + 1; });
    const servicosPopulares = Object.entries(servCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([nome, contagem]) => ({ nome, contagem }));

    setData({
      receitaMes, receitaMesAnterior, despesasMes, despesasMesAnterior,
      agendamentosHoje: agHojeData.length, agendamentosConfirmados, agendamentosPendentes,
      novosClientesMes, novosClientesMesAnterior, totalClientes: clientes.length,
      tendenciaMensal, clientesVIP, clientesFrequentes, clientesNovos,
      profissionais: profPerf, agendamentosSemana: agSemMapped,
      despesasCategoria, contasReceber, contasPagar, comissoes,
      receitaSemanal, servicosPopulares, loading: false,
    });
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll, estabId]);

  // Debounced realtime refetch to avoid hammering Supabase
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debouncedRefetch = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchAll();
    }, 2000);
  }, [fetchAll]);

  useEffect(() => {
    const channel = supabase
      .channel('dashboard-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'movimentacoes' }, debouncedRefetch)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'agendamentos' }, debouncedRefetch)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clientes' }, debouncedRefetch)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'despesas' }, debouncedRefetch)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contas_pagar' }, debouncedRefetch)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contas_receber' }, debouncedRefetch)
      .subscribe();

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      supabase.removeChannel(channel);
    };
  }, [fetchAll, debouncedRefetch]);

  return data;
}

