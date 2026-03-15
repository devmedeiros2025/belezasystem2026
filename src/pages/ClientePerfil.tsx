import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, MessageSquare, Edit, Award, AlertTriangle } from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";
import { useClientes } from "@/contexts/ClientesContext";

const historico = [
  { data: "28 Fev", servico: "Coloração", profissional: "Élise", duracao: "2h", valor: 180, avaliacao: 5, status: "Realizado" },
  { data: "14 Fev", servico: "Escova", profissional: "Rodrigo", duracao: "50min", valor: 70, avaliacao: 5, status: "Realizado" },
  { data: "1 Fev", servico: "Hidratação", profissional: "Patrícia", duracao: "1h", valor: 90, avaliacao: 4, status: "Realizado" },
  { data: "18 Jan", servico: "Corte", profissional: "Rodrigo", duracao: "45min", valor: 80, avaliacao: 5, status: "Realizado" },
];

export default function ClientePerfil() {
  const { id } = useParams();
  const { format } = useCurrency();
  const { getCliente } = useClientes();
  const cliente = getCliente(id || "");

  if (!cliente) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-text3">
        <p>Cliente não encontrado</p>
        <Link to="/clientes" className="mt-3 text-sm text-primary hover:underline">← Voltar</Link>
      </div>
    );
  }

  const metricas = [
    { label: "Total gasto", value: format(cliente.totalGasto) },
    { label: "Visitas", value: cliente.visitas.toString() },
    { label: "Ticket médio", value: format(cliente.visitas > 0 ? Math.round(cliente.totalGasto / cliente.visitas) : 0) },
    { label: "Última visita", value: cliente.ultimaVisita },
  ];

  return (
    <div className="space-y-6">
      <Link to="/clientes" className="inline-flex items-center gap-2 text-sm text-text3 hover:text-primary transition-colors">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      {/* Header */}
      <div className="rounded-xl border border-border bg-card p-6 card-hover">
        <div className="flex flex-wrap items-start gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full gold-gradient text-xl font-bold text-primary-foreground">
            {cliente.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-display text-2xl font-bold text-foreground">{cliente.nome}</h2>
            <p className="text-sm text-text2 mt-1">{cliente.telefone} · {cliente.email}</p>
            {(cliente.genero || cliente.profissao || cliente.bi) && (
              <p className="text-xs text-text3 mt-1">
                {[cliente.genero, cliente.profissao, cliente.bi ? `B.I: ${cliente.bi}` : null].filter(Boolean).join(" · ")}
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              {cliente.status === "VIP" && <span className="badge-vip rounded-full px-3 py-1 text-xs font-medium">⭐ VIP</span>}
              {cliente.visitas >= 10 && <span className="rounded-full bg-teal-custom/12 border border-teal-custom/20 px-3 py-1 text-xs text-teal-custom font-medium">Cliente Frequente</span>}
              <span className="rounded-full bg-rose-custom/12 border border-rose-custom/20 px-3 py-1 text-xs text-rose-custom font-medium">🎂 {cliente.aniversario}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="rounded-lg gold-gradient px-4 py-2 text-sm font-semibold text-primary-foreground flex items-center gap-2"><Calendar className="h-4 w-4" /> Agendar</button>
            <button className="rounded-lg border border-border px-4 py-2 text-sm text-text2 hover:bg-surface2 flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Mensagem</button>
            <button className="rounded-lg border border-border px-3 py-2 text-text3 hover:bg-surface2"><Edit className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {metricas.map((m) => (
          <div key={m.label} className="rounded-xl border border-border bg-card p-4 text-center card-hover">
            <p className="text-xs text-text3">{m.label}</p>
            <p className="mt-1 font-display text-2xl font-bold text-foreground">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Histórico */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card overflow-x-auto">
          <div className="p-5 border-b border-border">
            <h3 className="font-display text-lg font-semibold text-foreground">Histórico</h3>
          </div>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-left text-xs text-text3">
              <th className="p-4">Data</th><th className="p-4">Serviço</th><th className="p-4 hidden md:table-cell">Profissional</th><th className="p-4">Valor</th><th className="p-4 hidden md:table-cell">⭐</th>
            </tr></thead>
            <tbody>
              {historico.map((h, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-surface2/50"><td className="p-4 text-text3">{h.data}</td><td className="p-4 text-foreground">{h.servico}</td><td className="p-4 text-text2 hidden md:table-cell">{h.profissional}</td><td className="p-4 font-medium text-foreground">{format(h.valor)}</td><td className="p-4 text-primary hidden md:table-cell">{"★".repeat(h.avaliacao)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sidebar info */}
        <div className="space-y-5">
          {/* Preferências */}
          <div className="rounded-xl border border-border bg-card p-5 card-hover">
            <h3 className="font-display text-base font-semibold text-foreground mb-3">Preferências</h3>
            <div className="space-y-3 text-sm">
              <div><p className="text-text3 mb-1">Produtos preferidos</p><p className="text-text2">Kérastase, L'Oréal Professionnel</p></div>
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3">
                <div className="flex items-center gap-2 text-destructive mb-1"><AlertTriangle className="h-4 w-4" /><span className="font-medium text-xs">Alergias</span></div>
                <p className="text-xs text-destructive/80">Sensibilidade a amônia — usar coloração sem amônia</p>
              </div>
              {cliente.observacoes && (
                <div><p className="text-text3 mb-1">Observações</p><p className="text-text2">{cliente.observacoes}</p></div>
              )}
              {!cliente.observacoes && (
                <div><p className="text-text3 mb-1">Observações</p><p className="text-text2">Prefere horários matutinos. Gosta de café durante o atendimento.</p></div>
              )}
            </div>
          </div>

          {/* Fidelidade */}
          <div className="rounded-xl border border-border bg-card p-5 card-hover">
            <div className="flex items-center gap-2 mb-3"><Award className="h-5 w-5 text-primary" /><h3 className="font-display text-base font-semibold text-foreground">Fidelidade</h3></div>
            <p className="text-3xl font-bold text-primary font-display">{cliente.pontos}</p>
            <p className="text-xs text-text3 mb-3">pontos acumulados</p>
            <div className="mb-2 flex justify-between text-xs text-text3"><span>Próx. recompensa</span><span>2000 pts</span></div>
            <div className="h-2 rounded-full bg-surface2"><div className="h-full rounded-full gold-gradient" style={{ width: `${Math.min((cliente.pontos / 2000) * 100, 100)}%` }} /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
