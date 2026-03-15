import { avaliacoes } from "@/data/mockData";
import { Star, MessageCircle } from "lucide-react";
import { useState } from "react";

const distribuicao = [
  { nota: 5, qtd: 98, pct: 77 },
  { nota: 4, qtd: 22, pct: 17 },
  { nota: 3, qtd: 5, pct: 4 },
  { nota: 2, qtd: 1, pct: 1 },
  { nota: 1, qtd: 1, pct: 1 },
];

const resumo = [
  { label: "Nota Média", value: "4,9" },
  { label: "Total", value: "127" },
  { label: "NPS", value: "92" },
  { label: "5 Estrelas", value: "77%" },
];

export default function Avaliacoes() {
  const [filterNota, setFilterNota] = useState<number | null>(null);

  const filtered = filterNota ? avaliacoes.filter(a => a.nota === filterNota) : avaliacoes;

  return (
    <div className="space-y-6">
      {/* Resumo */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {resumo.map(r => (
          <div key={r.label} className="rounded-xl border border-border bg-card p-5 text-center card-hover">
            <p className="text-xs text-text3">{r.label}</p>
            <p className="mt-1 font-display text-3xl font-bold text-primary">{r.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Distribuição */}
        <div className="rounded-xl border border-border bg-card p-5 card-hover">
          <h3 className="font-display text-base font-semibold text-foreground mb-4">Distribuição</h3>
          <div className="space-y-3">
            {distribuicao.map(d => (
              <button key={d.nota} onClick={() => setFilterNota(filterNota === d.nota ? null : d.nota)} className="w-full">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-sm text-primary w-10">{d.nota} <Star className="h-3 w-3 fill-primary" /></span>
                  <div className="flex-1 h-3 rounded-full bg-surface2">
                    <div className="h-full rounded-full gold-gradient transition-all" style={{ width: `${d.pct}%` }} />
                  </div>
                  <span className="text-xs text-text3 w-8 text-right">{d.qtd}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Lista */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card card-hover">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h3 className="font-display text-base font-semibold text-foreground">Avaliações Recentes</h3>
            {filterNota && <button onClick={() => setFilterNota(null)} className="text-xs text-primary hover:underline">Limpar filtro</button>}
          </div>
          <div className="divide-y divide-border/50">
            {filtered.map(a => (
              <div key={a.id} className="p-5 hover:bg-surface2/30 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full gold-gradient text-xs font-bold text-primary-foreground">{a.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{a.nome}</span>
                      <span className="text-xs text-text3">{a.data}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-primary">{"★".repeat(a.nota)}{"☆".repeat(5 - a.nota)}</span>
                      <span className="text-xs text-text3">{a.servico} · {a.profissional}</span>
                    </div>
                    <p className="text-sm text-text2">{a.comentario}</p>
                    <button className="mt-2 flex items-center gap-1.5 text-xs text-primary hover:underline"><MessageCircle className="h-3 w-3" /> Responder</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
