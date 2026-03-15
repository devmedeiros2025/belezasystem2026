import { useState } from "react";
import { 
  DollarSign, TrendingUp, TrendingDown, Wallet, Calendar, 
  Filter, Download, Plus, Search, Receipt, ArrowUpRight, ArrowDownLeft 
} from "lucide-react";
import { useFinanceiroData } from "@/hooks/useFinanceiroData";
import { useFinanceiroGuard } from "@/hooks/useFinanceiroGuard";
import { formatKz, FORMAS_PAGAMENTO } from "@/lib/currency";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Financeiro() {
  useFinanceiroGuard();
  const { movimentacoes, loading, addMovimentacao } = useFinanceiroData();
  const [filter, setFilter] = useState("todos");

  const totalEntradas = movimentacoes.filter(m => m.tipo === "Entrada").reduce((acc, c) => acc + c.valor, 0);
  const totalSaidas = movimentacoes.filter(m => m.tipo === "Saída").reduce((acc, c) => acc + c.valor, 0);
  const saldo = totalEntradas - totalSaidas;

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-display font-bold">Fluxo de Caixa</h2>
          <p className="text-text3 text-sm mt-1">Gestão financeira e facturação (Kz - Angola)</p>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center gap-2 px-6 py-3 gold-gradient text-white rounded-2xl text-xs font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95">
             <Plus className="h-4 w-4" /> Nova Factura
           </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <StatCard label="Saldo Disponível" value={formatKz(saldo)} icon={Wallet} color="primary" />
        <StatCard label="Total de Entradas" value={formatKz(totalEntradas)} icon={ArrowUpRight} color="emerald-500" />
        <StatCard label="Total de Saídas" value={formatKz(totalSaidas)} icon={ArrowDownLeft} color="red-500" />
      </div>

      <Card className="rounded-[40px] border-none shadow-[0_30px_60px_rgba(0,0,0,0.05)] bg-white overflow-hidden">
        <div className="p-8 border-b border-border flex justify-between items-center bg-surface2/30">
          <div className="flex gap-4">
            {["todos", "Entrada", "Saída"].map(t => (
              <button 
                key={t}
                onClick={() => setFilter(t)}
                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                  filter === t 
                  ? "bg-primary text-white border-primary shadow-md" 
                  : "bg-white text-text3 border-border hover:bg-surface2"
                }`}
              >
                {t === "todos" ? "Todos os movimentos" : t === "Entrada" ? "Facturas (Receita)" : "Despesas"}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button className="p-3 bg-white border border-border rounded-2xl hover:bg-surface2 transition-colors"><Search className="h-4 w-4 text-text3" /></button>
            <button className="p-3 bg-white border border-border rounded-2xl hover:bg-surface2 transition-colors"><Download className="h-4 w-4 text-text3" /></button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] uppercase font-bold text-text3 bg-surface2/50 border-b border-border">
                <th className="px-8 py-5 text-left">Data / Hora</th>
                <th className="px-8 py-5 text-left">Descrição</th>
                <th className="px-8 py-5 text-left">Categoria</th>
                <th className="px-8 py-5 text-left">Pagamento</th>
                <th className="px-8 py-5 text-left">Valor (Kz)</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {loading ? (
                <tr><td colSpan={6} className="p-20 text-center text-text3 font-medium">A carregar dados financeiros...</td></tr>
              ) : movimentacoes.filter(m => filter === "todos" || m.tipo === filter).map(m => (
                <tr key={m.id} className="hover:bg-surface2/20 transition-colors">
                  <td className="px-8 py-6">
                    <p className="font-bold tracking-tight">{new Date(m.data).toLocaleDateString("pt-AO")}</p>
                    <p className="text-[10px] text-text3 font-bold uppercase">{m.hora}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                       <div className={`p-2 rounded-xl ${m.tipo === "Entrada" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                         <Receipt className="h-4 w-4" />
                       </div>
                       <span className="font-medium text-text1">{m.descricao}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <Badge variant="outline" className="text-[9px] uppercase font-extrabold px-2 py-0.5 border-border rounded-lg bg-surface1 text-text3">{m.categoria}</Badge>
                  </td>
                  <td className="px-8 py-6">
                     <span className="text-xs font-bold text-text2 italic">{m.formaPgto}</span>
                  </td>
                  <td className={`px-8 py-6 font-bold text-lg tracking-tighter ${m.tipo === "Entrada" ? "text-emerald-600" : "text-red-600"}`}>
                    {m.tipo === "Entrada" ? "+" : "-"} {formatKz(m.valor)}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="text-xs font-bold text-primary hover:underline">Detalhes</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <Card className="p-10 rounded-[48px] border-none shadow-[0_20px_50px_rgba(0,0,0,0.03)] bg-white group cursor-default">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-[24px] bg-${color}/10 text-${color} text-primary group-hover:rotate-12 transition-all duration-500`}>
          <Icon className="h-6 w-6" />
        </div>
        <TrendingUp className="h-5 w-5 text-text3 opacity-10" />
      </div>
      <p className="text-[11px] font-bold text-text3 uppercase tracking-[0.2em]">{label}</p>
      <h3 className="text-3xl font-display font-bold mt-3 tracking-tighter">{value}</h3>
      <div className="h-1.5 w-12 bg-primary/20 rounded-full mt-6 group-hover:w-full transition-all duration-700" />
    </Card>
  );
}
