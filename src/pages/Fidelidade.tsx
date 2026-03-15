import { clientes } from "@/data/mockData";
import { Award, Gift, Trophy, Crown, Gem } from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";

const ranking = [...clientes].sort((a, b) => b.pontos - a.pontos);

const getTier = (pts: number) => {
  if (pts >= 2000) return { name: "Diamante", icon: Gem, color: "text-teal-custom" };
  if (pts >= 1500) return { name: "Ouro", icon: Crown, color: "text-primary" };
  if (pts >= 800) return { name: "Prata", icon: Trophy, color: "text-text2" };
  return { name: "Bronze", icon: Award, color: "text-rose-custom" };
};

const campanhas = [
  { nome: "Março Dourado", vigencia: "1-31 Mar", desconto: "15% em coloração", status: "Ativa" as const },
  { nome: "Dia da Mulher", vigencia: "8 Mar", desconto: "20% em todos serviços", status: "Agendada" as const },
  { nome: "Fevereiro do Amor", vigencia: "1-28 Fev", desconto: "10% para casais", status: "Encerrada" as const },
];

const aniversariantes = [
  { nome: "Ana Paula Souza", data: "15 Mar", enviada: false },
  { nome: "Fernanda Ribeiro", data: "3 Abr", enviada: false },
];

export default function Fidelidade() {
  const { symbol } = useCurrency();

  return (
    <div className="space-y-6">
      {/* Programa */}
      <div className="rounded-xl border border-border bg-card p-6 card-hover">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-1">Programa de Pontos</h3>
            <p className="text-sm text-text2">{symbol} 1 = 1 ponto · 100 pts = {symbol} 10 desconto</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-green-custom font-medium">Ativo</span>
            <div className="h-6 w-11 rounded-full bg-green-custom/30 p-0.5"><div className="h-5 w-5 rounded-full bg-green-custom translate-x-5 transition-transform" /></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Ranking */}
        <div className="rounded-xl border border-border bg-card card-hover">
          <div className="p-5 border-b border-border"><h3 className="font-display text-lg font-semibold text-foreground">Ranking Top Clientes</h3></div>
          <div className="divide-y divide-border/50">
            {ranking.slice(0, 7).map((c, i) => {
              const tier = getTier(c.pontos);
              return (
                <div key={c.id} className="flex items-center gap-3 p-4 hover:bg-surface2/50 transition-colors">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${i < 3 ? "gold-gradient text-primary-foreground" : "bg-surface2 text-text3"}`}>{i + 1}</span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full gold-gradient text-xs font-bold text-primary-foreground">{c.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{c.nome}</p>
                    <p className={`flex items-center gap-1 text-xs ${tier.color}`}><tier.icon className="h-3 w-3" />{tier.name}</p>
                  </div>
                  <span className="text-sm font-bold text-primary">{c.pontos.toLocaleString()} pts</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          {/* Campanhas */}
          <div className="rounded-xl border border-border bg-card p-5 card-hover">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold text-foreground">Campanhas</h3>
              <button className="rounded-lg gold-gradient px-3 py-1.5 text-xs font-semibold text-primary-foreground">+ Nova</button>
            </div>
            <div className="space-y-3">
              {campanhas.map(c => (
                <div key={c.nome} className="rounded-lg bg-surface2 p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-foreground">{c.nome}</h4>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                      c.status === "Ativa" ? "badge-active" : c.status === "Agendada" ? "badge-vip" : "badge-inactive"
                    }`}>{c.status}</span>
                  </div>
                  <p className="text-xs text-text3">{c.vigencia} · {c.desconto}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Aniversariantes */}
          <div className="rounded-xl border border-border bg-card p-5 card-hover">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2"><Gift className="h-5 w-5 text-rose-custom" /> Aniversariantes do Mês</h3>
            <div className="space-y-3">
              {aniversariantes.map(a => (
                <div key={a.nome} className="flex items-center justify-between rounded-lg bg-surface2 p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{a.nome}</p>
                    <p className="text-xs text-text3">🎂 {a.data}</p>
                  </div>
                  <span className={`text-xs font-medium ${a.enviada ? "text-green-custom" : "text-primary"}`}>{a.enviada ? "✓ Enviada" : "○ Pendente"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
