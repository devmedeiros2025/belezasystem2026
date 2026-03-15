import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, AreaChart, Area, Legend, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Calendar, Users, Star, CheckCircle, Clock, DollarSign, ArrowUpCircle, ArrowDownCircle, Receipt } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrency } from "@/hooks/useCurrency";
import { useDashboardData } from "@/hooks/useDashboardData";
import KanbanBoard from "@/components/KanbanBoard";
import { Skeleton } from "@/components/ui/skeleton";

const dias = ["Seg", "Ter", "Qua", "Qui", "Sex"];
const horarios = ["09:00", "10:00", "11:00", "14:00", "15:00"];

const corMap: Record<string, string> = {
  gold: "border-l-primary bg-primary/10",
  teal: "border-l-teal-custom bg-teal-custom/10",
  rose: "border-l-rose-custom bg-rose-custom/10",
  purple: "border-l-purple-custom bg-purple-custom/10",
};

function pctChange(current: number, previous: number): string {
  if (previous === 0) return current > 0 ? "+100%" : "0%";
  const pct = ((current - previous) / previous) * 100;
  return `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`;
}

function DashboardCompleto() {
  const [clienteTab, setClienteTab] = useState<"VIP" | "Frequentes" | "Novos">("VIP");
  const { format } = useCurrency();
  const d = useDashboardData();

  if (d.loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
        <Skeleton className="h-72 rounded-xl" />
      </div>
    );
  }

  const filteredClientes = clienteTab === "VIP"
    ? d.clientesVIP
    : clienteTab === "Frequentes"
    ? d.clientesFrequentes
    : d.clientesNovos;

  const kpis = [
    { label: "Receita do Mês", value: format(d.receitaMes), change: pctChange(d.receitaMes, d.receitaMesAnterior), positive: d.receitaMes >= d.receitaMesAnterior, icon: TrendingUp, color: "text-primary" },
    { label: "Agendamentos Hoje", value: String(d.agendamentosHoje), sub: `✓ ${d.agendamentosConfirmados} confirmados · ○ ${d.agendamentosPendentes} pendentes`, icon: Calendar, color: "text-teal-custom" },
    { label: "Novos Clientes", value: String(d.novosClientesMes), change: pctChange(d.novosClientesMes, d.novosClientesMesAnterior), positive: d.novosClientesMes >= d.novosClientesMesAnterior, icon: Users, color: "text-rose-custom" },
    { label: "Total Clientes", value: String(d.totalClientes), icon: Star, color: "text-primary" },
  ];

  const categoriaPie = d.despesasCategoria.slice(0, 5).map((c, i) => ({
    name: c.categoria,
    value: c.valor,
    color: ["hsl(35 50% 50%)", "hsl(183 50% 40%)", "hsl(340 60% 55%)", "hsl(260 40% 55%)", "hsl(160 50% 42%)"][i % 5],
  }));

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi, i) => (
          <div
            key={kpi.label}
            className={`rounded-xl border border-border bg-card p-5 card-hover animate-fadeInUp stagger-${i + 1}`}
            style={{ opacity: 0 }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-text2">{kpi.label}</p>
                <p className="mt-1 font-display text-3xl font-bold text-foreground">{kpi.value}</p>
                {kpi.change && (
                  <p className={`mt-1 text-sm font-medium ${kpi.positive ? "text-green-custom" : "text-destructive"}`}>
                    {kpi.change}
                  </p>
                )}
                {kpi.sub && <p className="mt-1 text-xs text-text3">{kpi.sub}</p>}
              </div>
              <div className={`rounded-lg bg-surface2 p-2.5 ${kpi.color}`}>
                <kpi.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tendência Mensal & Categorias */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="col-span-1 xl:col-span-2 rounded-xl border border-border bg-card p-5 card-hover">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold text-foreground">Tendência de Receita</h3>
            <span className="text-xs text-text3 bg-surface2 rounded-full px-3 py-1">Últimos 6 meses</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={d.tendenciaMensal}>
              <defs>
                <linearGradient id="gradReceita" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(35 50% 50%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(35 50% 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(280 20% 90%)" />
              <XAxis dataKey="mes" tick={{ fill: "hsl(280 15% 60%)", fontSize: 12 }} axisLine={false} />
              <YAxis tick={{ fill: "hsl(280 15% 60%)", fontSize: 11 }} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(0 0% 100%)", border: "1px solid hsl(280 20% 90%)", borderRadius: 8 }} />
              <Area type="monotone" dataKey="receita" name="Receita" stroke="hsl(35 50% 50%)" strokeWidth={2.5} fill="url(#gradReceita)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 card-hover">
          <h3 className="font-display text-lg font-semibold text-foreground mb-4">Despesas por Categoria</h3>
          {categoriaPie.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={categoriaPie} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" paddingAngle={3}>
                    {categoriaPie.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "hsl(0 0% 100%)", border: "1px solid hsl(280 20% 90%)", borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 mt-2 justify-center">
                {categoriaPie.map((c) => (
                  <div key={c.name} className="flex items-center gap-1.5 text-xs text-text2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                    {c.name}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-text3 text-sm">Sem despesas no período</p>
          )}
        </div>
      </div>

      {/* Tendência Clientes + Agendamentos */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 card-hover">
          <h3 className="font-display text-base font-semibold text-foreground mb-4">Clientes & Agendamentos</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={d.tendenciaMensal}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(280 20% 90%)" />
              <XAxis dataKey="mes" tick={{ fill: "hsl(280 15% 60%)", fontSize: 12 }} axisLine={false} />
              <YAxis yAxisId="left" tick={{ fill: "hsl(280 15% 60%)", fontSize: 11 }} axisLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: "hsl(280 15% 60%)", fontSize: 11 }} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(0 0% 100%)", border: "1px solid hsl(280 20% 90%)", borderRadius: 8 }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Line yAxisId="left" type="monotone" dataKey="clientes" name="Novos Clientes" stroke="hsl(340 60% 55%)" strokeWidth={2} dot={{ r: 4 }} />
              <Line yAxisId="right" type="monotone" dataKey="agendamentos" name="Agendamentos" stroke="hsl(183 50% 40%)" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Comparativo Mês Atual vs Anterior */}
        <div className="rounded-xl border border-border bg-card p-5 card-hover">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-base font-semibold text-foreground">Mês Atual vs Anterior</h3>
            <span className="text-xs text-text3 bg-surface2 rounded-full px-3 py-1">Comparativo</span>
          </div>
          <div className="space-y-3">
            {[
              { label: "Receita", atual: d.receitaMes, anterior: d.receitaMesAnterior },
              { label: "Despesas", atual: d.despesasMes, anterior: d.despesasMesAnterior },
              { label: "Novos Clientes", atual: d.novosClientesMes, anterior: d.novosClientesMesAnterior },
              { label: "Lucro", atual: d.receitaMes - d.despesasMes, anterior: d.receitaMesAnterior - d.despesasMesAnterior },
            ].map((item) => {
              const variacao = item.anterior === 0 ? 100 : ((item.atual - item.anterior) / item.anterior) * 100;
              const isPositive = variacao >= 0;
              return (
                <div key={item.label} className="flex items-center justify-between rounded-lg bg-surface2 p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-text3">Ant: {item.anterior.toLocaleString("pt-BR")}</span>
                      <span className="text-text3">→</span>
                      <span className="text-xs font-semibold text-foreground">Atual: {item.atual.toLocaleString("pt-BR")}</span>
                    </div>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${isPositive ? "bg-green-custom/15 text-green-custom" : "bg-destructive/15 text-destructive"}`}>
                    {isPositive ? "+" : ""}{variacao.toFixed(1)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Agenda + Clientes */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="col-span-1 xl:col-span-2 rounded-xl border border-border bg-card p-5 card-hover">
          <h3 className="font-display text-lg font-semibold text-foreground mb-4">Agenda Semanal</h3>
          <div className="overflow-x-auto">
            <div className="grid min-w-[600px]" style={{ gridTemplateColumns: "60px repeat(5, 1fr)" }}>
              <div />
              {dias.map((dd, i) => (
                <div key={dd} className={`py-2 text-center text-sm font-semibold ${i === 0 ? "text-primary" : "text-text2"}`}>
                  {dd}
                </div>
              ))}
              {horarios.map((h) => (
                <div key={h} className="contents">
                  <div className="flex items-center text-xs text-text3 pr-2">{h}</div>
                  {dias.map((dd) => {
                    const ag = d.agendamentosSemana.find(a => a.dia === dd && a.hora === h);
                    return (
                      <div key={`${dd}-${h}`} className="p-1">
                        {ag ? (
                          <div className={`rounded-lg border-l-[3px] px-2.5 py-2 text-xs ${corMap[ag.cor] || corMap.gold}`}>
                            <p className="font-medium text-foreground">{ag.clienteNome}</p>
                            <p className="text-text3">{ag.servico}</p>
                          </div>
                        ) : (
                          <div className="rounded-lg border border-dashed border-border/50 px-2.5 py-3 text-center text-[10px] text-text3 hover:border-primary/30 hover:text-primary cursor-pointer transition-colors">
                            +
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 card-hover">
          <h3 className="font-display text-lg font-semibold text-foreground mb-3">Clientes em Destaque</h3>
          <div className="flex gap-1 mb-4">
            {(["VIP", "Frequentes", "Novos"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setClienteTab(tab)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  clienteTab === tab ? "bg-primary/20 text-primary" : "text-text3 hover:text-foreground hover:bg-surface2"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {filteredClientes.length > 0 ? filteredClientes.map((c) => (
              <div key={c.id} className="flex items-center gap-3 rounded-lg bg-surface2 p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full gold-gradient text-xs font-bold text-primary-foreground">
                  {c.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{c.nome}</p>
                  <p className="text-xs text-text3">{c.ultimoServico}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-primary">{format(c.totalGasto)}</p>
                  <p className="text-[11px] text-text3">{c.visitas} visitas</p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-text3">Nenhum cliente nesta categoria</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 card-hover">
          <h3 className="font-display text-base font-semibold text-foreground mb-4">Receita por Semana</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={d.receitaSemanal}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(280 20% 90%)" />
              <XAxis dataKey="semana" tick={{ fill: "hsl(280 15% 60%)", fontSize: 12 }} axisLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ backgroundColor: "hsl(0 0% 100%)", border: "1px solid hsl(280 20% 90%)", borderRadius: 8 }} />
              <Bar dataKey="valor" fill="hsl(35 50% 50%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 card-hover">
          <h3 className="font-display text-base font-semibold text-foreground mb-4">Serviços Mais Populares</h3>
          <div className="space-y-3">
            {d.servicosPopulares.length > 0 ? d.servicosPopulares.map((s, i) => {
              const maxCount = d.servicosPopulares[0]?.contagem || 1;
              return (
                <div key={s.nome}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-text2">{i + 1}. {s.nome}</span>
                    <span className="text-text3">{s.contagem}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-surface2">
                    <div className="h-full rounded-full gold-gradient" style={{ width: `${(s.contagem / maxCount) * 100}%` }} />
                  </div>
                </div>
              );
            }) : (
              <p className="text-sm text-text3">Sem dados no período</p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 card-hover">
          <h3 className="font-display text-base font-semibold text-foreground mb-4">Performance</h3>
          <div className="space-y-3">
            {d.profissionais.map((p) => (
              <div key={p.id} className="flex items-center gap-3 rounded-lg bg-surface2 p-3">
                <span className="text-2xl">{p.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{p.nome}</p>
                </div>
                <p className="text-sm font-semibold text-green-custom">{format(p.receita)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <KanbanBoard />
    </div>
  );
}

function DashboardColaborador() {
  const { usuarioLogado } = useAuth();
  const d = useDashboardData();

  const meusAgendamentos = d.agendamentosSemana.filter(a => {
    const hoje = new Date();
    const diaHoje = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][hoje.getDay()];
    return a.dia === diaHoje;
  });

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6 card-hover">
        <h2 className="font-display text-2xl font-bold text-foreground">
          Bom dia, {usuarioLogado?.nome.split(" ")[0]}! 👋
        </h2>
        <p className="text-text2 mt-1">Aqui está o resumo do seu dia</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 card-hover">
          <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Meus Agendamentos Hoje
          </h3>
          <div className="space-y-3">
            {meusAgendamentos.length > 0 ? meusAgendamentos.map((ag) => (
              <div key={ag.id} className={`rounded-lg border-l-[3px] px-4 py-3 ${corMap[ag.cor] || corMap.gold}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{ag.clienteNome}</p>
                    <p className="text-sm text-text3">{ag.servico}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">{ag.hora}</p>
                    <span className={`text-xs ${ag.status === "Confirmado" ? "text-green-custom" : "text-primary"}`}>
                      {ag.status}
                    </span>
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-text3 text-sm">Nenhum agendamento para hoje</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-card p-5 card-hover">
              <div className="flex items-center gap-3">
                <div className="rounded-lg p-2.5" style={{ backgroundColor: "hsl(160 50% 42% / 0.12)", color: "hsl(160 50% 42%)" }}>
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{d.agendamentosConfirmados}</p>
                  <p className="text-xs text-text3">Confirmados</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-5 card-hover">
              <div className="flex items-center gap-3">
                <div className="rounded-lg p-2.5" style={{ backgroundColor: "hsl(var(--primary) / 0.12)", color: "hsl(var(--primary))" }}>
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{d.agendamentosPendentes}</p>
                  <p className="text-xs text-text3">Pendentes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 card-hover">
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">Agenda da Equipe</h3>
        <div className="overflow-x-auto">
          <div className="grid min-w-[600px]" style={{ gridTemplateColumns: "60px repeat(5, 1fr)" }}>
            <div />
            {dias.map((dd, i) => (
              <div key={dd} className={`py-2 text-center text-sm font-semibold ${i === 0 ? "text-primary" : "text-text2"}`}>
                {dd}
              </div>
            ))}
            {horarios.map((h) => (
              <div key={h} className="contents">
                <div className="flex items-center text-xs text-text3 pr-2">{h}</div>
                {dias.map((dd) => {
                  const ag = d.agendamentosSemana.find(a => a.dia === dd && a.hora === h);
                  return (
                    <div key={`${dd}-${h}`} className="p-1">
                      {ag ? (
                        <div className={`rounded-lg border-l-[3px] px-2.5 py-2 text-xs ${corMap[ag.cor] || corMap.gold}`}>
                          <p className="font-medium text-foreground">{ag.clienteNome}</p>
                          <p className="text-text3">{ag.profissional}</p>
                        </div>
                      ) : (
                        <div className="rounded-lg border border-dashed border-border/30 px-2.5 py-3" />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <KanbanBoard />
    </div>
  );
}

function DashboardFinanceiro() {
  const { usuarioLogado } = useAuth();
  const { format } = useCurrency();
  const d = useDashboardData();

  if (d.loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
        <Skeleton className="h-72 rounded-xl" />
      </div>
    );
  }

  const lucroLiquido = d.receitaMes - d.despesasMes;
  const lucroAnterior = d.receitaMesAnterior - d.despesasMesAnterior;
  const ticketMedio = d.agendamentosHoje > 0 ? Math.round(d.receitaMes / d.totalClientes) : 0;

  const fluxoCaixa = d.tendenciaMensal.map(t => ({
    mes: t.mes,
    entradas: t.receita,
    saidas: t.despesas,
  }));

  const kpis = [
    { label: "Receita do Mês", value: format(d.receitaMes), change: pctChange(d.receitaMes, d.receitaMesAnterior), positive: d.receitaMes >= d.receitaMesAnterior, icon: TrendingUp, color: "text-green-custom" },
    { label: "Despesas do Mês", value: format(d.despesasMes), change: pctChange(d.despesasMes, d.despesasMesAnterior), positive: d.despesasMes <= d.despesasMesAnterior, icon: ArrowDownCircle, color: "text-destructive" },
    { label: "Lucro Líquido", value: format(lucroLiquido), change: pctChange(lucroLiquido, lucroAnterior), positive: lucroLiquido >= lucroAnterior, icon: DollarSign, color: "text-primary" },
    { label: "Ticket Médio", value: format(ticketMedio), icon: Receipt, color: "text-teal-custom" },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6 card-hover">
        <h2 className="font-display text-2xl font-bold text-foreground">Painel Financeiro 💰</h2>
        <p className="text-text2 mt-1">Olá, {usuarioLogado?.nome.split(" ")[0]}! Aqui está o resumo financeiro do mês</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi, i) => (
          <div
            key={kpi.label}
            className={`rounded-xl border border-border bg-card p-5 card-hover animate-fadeInUp stagger-${i + 1}`}
            style={{ opacity: 0 }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-text2">{kpi.label}</p>
                <p className="mt-1 font-display text-3xl font-bold text-foreground">{kpi.value}</p>
                {kpi.change && (
                  <p className={`mt-1 text-sm font-medium ${kpi.positive ? "text-green-custom" : "text-destructive"}`}>
                    {kpi.change}
                  </p>
                )}
              </div>
              <div className={`rounded-lg bg-surface2 p-2.5 ${kpi.color}`}>
                <kpi.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="col-span-1 xl:col-span-2 rounded-xl border border-border bg-card p-5 card-hover">
          <h3 className="font-display text-lg font-semibold text-foreground mb-4">Fluxo de Caixa - 6 Meses</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={fluxoCaixa}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(280 20% 90%)" />
              <XAxis dataKey="mes" tick={{ fill: "hsl(280 15% 60%)", fontSize: 12 }} axisLine={false} />
              <YAxis tick={{ fill: "hsl(280 15% 60%)", fontSize: 11 }} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(0 0% 100%)", border: "1px solid hsl(280 20% 90%)", borderRadius: 8 }} />
              <Bar dataKey="entradas" name="Entradas" fill="hsl(160 50% 42%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="saidas" name="Saídas" fill="hsl(0 70% 55%)" radius={[4, 4, 0, 0]} opacity={0.7} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 card-hover">
          <h3 className="font-display text-lg font-semibold text-foreground mb-4">Despesas por Categoria</h3>
          <div className="space-y-3">
            {d.despesasCategoria.map((dc) => (
              <div key={dc.categoria}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-text2">{dc.categoria}</span>
                  <span className="text-foreground font-medium">{format(dc.valor)} <span className="text-text3 text-xs">({dc.pct}%)</span></span>
                </div>
                <div className="h-2 rounded-full bg-surface2">
                  <div className="h-full rounded-full bg-primary/70" style={{ width: `${dc.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 card-hover">
          <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <ArrowUpCircle className="h-5 w-5 text-green-custom" />
            Contas a Receber
          </h3>
          <div className="space-y-3">
            {d.contasReceber.map((c, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-surface2 p-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{c.cliente}</p>
                  <p className="text-xs text-text3">Venc: {c.vencimento}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">{format(c.valor)}</p>
                  <span className={`text-xs font-medium ${c.status === "atrasado" ? "text-destructive" : "text-primary"}`}>
                    {c.status === "atrasado" ? "Atrasado" : "Pendente"}
                  </span>
                </div>
              </div>
            ))}
            {d.contasReceber.length === 0 && <p className="text-sm text-text3">Nenhuma conta pendente</p>}
            {d.contasReceber.length > 0 && (
              <p className="text-sm font-semibold text-green-custom text-right">
                Total: {format(d.contasReceber.reduce((s, c) => s + c.valor, 0))}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 card-hover">
          <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <ArrowDownCircle className="h-5 w-5 text-destructive" />
            Contas a Pagar
          </h3>
          <div className="space-y-3">
            {d.contasPagar.map((c, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-surface2 p-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{c.fornecedor}</p>
                  <p className="text-xs text-text3">Venc: {c.vencimento}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">{format(c.valor)}</p>
                  <span className={`text-xs font-medium ${c.status === "pago" ? "text-green-custom" : c.status === "atrasado" ? "text-destructive" : "text-primary"}`}>
                    {c.status === "pago" ? "Pago ✓" : c.status === "atrasado" ? "Atrasado" : "Pendente"}
                  </span>
                </div>
              </div>
            ))}
            {d.contasPagar.length === 0 && <p className="text-sm text-text3">Nenhuma conta pendente</p>}
            {d.contasPagar.length > 0 && (
              <p className="text-sm font-semibold text-destructive text-right">
                Total: {format(d.contasPagar.reduce((s, c) => s + c.valor, 0))}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 card-hover">
        <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Comissões dos Profissionais
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-text3">
                <th className="pb-3 font-medium">Profissional</th>
                <th className="pb-3 font-medium">Atendimentos</th>
                <th className="pb-3 font-medium">Receita Gerada</th>
                <th className="pb-3 font-medium">Comissão</th>
              </tr>
            </thead>
            <tbody>
              {d.comissoes.map((c) => (
                <tr key={c.nome} className="border-b border-border/50">
                  <td className="py-3 font-medium text-foreground">{c.nome}</td>
                  <td className="py-3 text-text2">{c.atendimentos}</td>
                  <td className="py-3 text-text2">{format(c.receita)}</td>
                  <td className="py-3 font-semibold text-primary">{format(c.comissaoValor)} ({c.comissaoPct}%)</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 card-hover">
          <h3 className="font-display text-base font-semibold text-foreground mb-4">Receita Semanal</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={d.receitaSemanal}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(280 20% 90%)" />
              <XAxis dataKey="semana" tick={{ fill: "hsl(280 15% 60%)", fontSize: 12 }} axisLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ backgroundColor: "hsl(0 0% 100%)", border: "1px solid hsl(280 20% 90%)", borderRadius: 8 }} />
              <Bar dataKey="valor" fill="hsl(35 50% 50%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 card-hover">
          <h3 className="font-display text-base font-semibold text-foreground mb-4">Serviços por Receita</h3>
          <div className="space-y-3">
            {d.servicosPopulares.map((s, i) => {
              const maxCount = d.servicosPopulares[0]?.contagem || 1;
              return (
                <div key={s.nome}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-text2">{i + 1}. {s.nome}</span>
                    <span className="text-text3">{s.contagem}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-surface2">
                    <div className="h-full rounded-full gold-gradient" style={{ width: `${(s.contagem / maxCount) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <KanbanBoard />
    </div>
  );
}

export default function Dashboard() {
  const { perfil } = useAuth();
  
  if (perfil === "Colaborador") return <DashboardColaborador />;
  if (perfil === "Financeiro") return <DashboardFinanceiro />;
  return <DashboardCompleto />;
}
