import { useState, useEffect } from "react";
import { 
  ShieldCheck, Building2, TrendingUp, CreditCard, Ticket, 
  History, Settings, Search, Filter, Plus, ExternalLink, 
  CheckCircle2, AlertTriangle, Clock
} from "lucide-react";
import { formatKz } from "@/lib/currency";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function SuperAdmin() {
  const [tenants, setTenants] = useState<Tables<"estabelecimentos">[]>([]);
  const [stats, setStats] = useState({ tenants: 0, mrr: 0, activeTickets: 0 });
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editingTenant, setEditingTenant] = useState<Tables<"estabelecimentos"> | null>(null);
  const [editForm, setEditForm] = useState({ plano: "", ativo: true });

  useEffect(() => {
    const loadData = async () => {
      const { data: estabs } = await supabase.from("estabelecimentos").select("*").order("created_at", { ascending: false });
      const { data: subs } = await supabase.from("assinaturas").select("valor_cobrado").eq("status", "active");
      const { count: ticketsCount } = await supabase.from("tickets").select("*", { count: 'exact', head: true }).eq("status", "aberto");

      setTenants(estabs || []);
      setStats({
        tenants: estabs?.length || 0,
        mrr: subs?.reduce((acc, c) => acc + Number(c.valor_cobrado), 0) || 0,
        activeTickets: ticketsCount || 0
      });
    };
    loadData();
  }, []);

  const handleEditTenant = (t: Tables<"estabelecimentos">) => {
    setEditingTenant(t);
    setEditForm({ plano: t.plano, ativo: t.ativo });
  };

  const handleSaveTenant = async () => {
    if (!editingTenant) return;
    try {
      const { error } = await supabase
        .from("estabelecimentos")
        .update({ plano: editForm.plano, ativo: editForm.ativo })
        .eq("id", editingTenant.id);

      if (error) throw error;
      
      toast.success("Estabelecimento atualizado com sucesso!");
      setTenants(prev => prev.map(t => t.id === editingTenant.id ? { ...t, plano: editForm.plano, ativo: editForm.ativo } : t));
      setEditingTenant(null);
    } catch (err: any) {
      toast.error("Erro ao atualizar estabelecimento: " + err.message);
    }
  };

  return (
    <div className="flex h-screen bg-[#FDFCFB]">
      {/* Sidebar Administrativa */}
      <aside className="w-72 border-r border-border bg-white p-8 flex flex-col gap-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-2xl gold-gradient flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg leading-tight">Master Admin</h1>
            <p className="text-[10px] uppercase font-bold text-text3 tracking-widest">BelezaSystem AO</p>
          </div>
        </div>

        <nav className="space-y-1">
          {[
            { id: "dashboard", label: "Dashboard", icon: TrendingUp },
            { id: "tenants", label: "Estabelecimentos", icon: Building2 },
            { id: "assinaturas", label: "Assinaturas", icon: CreditCard },
            { id: "tickets", label: "Suporte Técnico", icon: Ticket },
            { id: "changelog", label: "Gestão de Changelog", icon: History }
          ].map(i => (
            <button 
              key={i.id} 
              onClick={() => setActiveTab(i.id)}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${
                activeTab === i.id 
                ? "bg-primary/10 text-primary shadow-sm" 
                : "text-text3 hover:bg-surface2 hover:text-foreground"
              }`}
            >
              <i.icon className="h-4 w-4" />
              {i.label}
              {i.id === "tickets" && stats.activeTickets > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{stats.activeTickets}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="mt-auto p-5 bg-surface2 rounded-3xl border border-border">
          <p className="text-[10px] font-bold text-text3 uppercase mb-2">Ambiente</p>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold">Produção (Live)</span>
          </div>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-10 space-y-10 overflow-y-auto">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-display font-bold capitalize">{activeTab}</h2>
            <p className="text-text3 text-sm mt-1">Gestão centralizada da plataforma em Angola</p>
          </div>
          <div className="flex gap-3">
             <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-border rounded-xl text-xs font-bold shadow-sm"><Search className="h-3.5 w-3.5" /> Pesquisar</button>
             <button className="flex items-center gap-2 px-6 py-2.5 gold-gradient text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20"><Plus className="h-3.5 w-3.5" /> Novo</button>
          </div>
        </div>

        {activeTab === "dashboard" && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-4 gap-8">
              <StatCard label="Receita Recorrente (MRR)" value={formatKz(stats.mrr)} icon={TrendingUp} color="border-emerald-500" />
              <StatCard label="Total Clientes (SaaS)" value={stats.tenants} icon={Building2} color="border-primary" />
              <StatCard label="Tickets Pendentes" value={stats.activeTickets} icon={Ticket} color="border-amber-500" />
              <StatCard label="Churn Rate (Mes)" value="1.2%" icon={AlertTriangle} color="border-red-500" />
            </div>

            <Card className="rounded-[32px] border-none shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="p-8 border-b border-border bg-white flex justify-between items-center">
                <h3 className="font-bold text-lg">Últimos Estabelecimentos Registados</h3>
                <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1">Ver todos <ExternalLink className="h-3 w-3" /></button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-surface2/50 text-[10px] uppercase font-bold text-text3 border-b border-border">
                      <th className="px-8 py-5 text-left">Estabelecimento</th>
                      <th className="px-8 py-5 text-left">Plano</th>
                      <th className="px-8 py-5 text-left">NIF / Localidade</th>
                      <th className="px-8 py-5 text-left">Status</th>
                      <th className="px-8 py-5 text-left">Criação</th>
                      <th className="px-8 py-5"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {tenants.map(t => (
                      <tr key={t.id} className="hover:bg-surface2/30 transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">{t.nome[0].toUpperCase()}</div>
                            <span className="font-bold text-sm tracking-tight">{t.nome}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <Badge className="bg-surface2 text-text2 border-none font-bold uppercase text-[9px] px-2 py-0.5">{t.plano || 'Standard'}</Badge>
                        </td>
                        <td className="px-8 py-6">
                           <p className="text-xs font-medium">{t.nif || 'N/A'}</p>
                           <p className="text-[10px] text-text3 italic">Luanda, Angola</p>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                             <span className={`h-1.5 w-1.5 rounded-full ${t.ativo ? 'bg-emerald-500' : 'bg-red-500'}`} />
                             <span className="text-xs font-bold">{t.ativo ? 'Activo' : 'Suspenso'}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-xs text-text3 font-medium">
                          {new Date(t.created_at).toLocaleDateString("pt-AO")}
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button onClick={() => handleEditTenant(t)} className="p-2 hover:bg-surface3 rounded-lg text-text3 hover:text-primary transition-colors">
                            <Settings className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
        {/* Modal de Edição de Tenant */}
        {editingTenant && (
          <Dialog open={!!editingTenant} onOpenChange={(open) => !open && setEditingTenant(null)}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display">Gerir Estabelecimento</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="text-xs font-bold text-text3 uppercase mb-2 block">Nome</label>
                  <p className="font-medium text-sm">{editingTenant.nome}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-text3 uppercase mb-2 block">Plano Atual</label>
                  <select 
                    value={editForm.plano} 
                    onChange={e => setEditForm(prev => ({ ...prev, plano: e.target.value }))}
                    className="w-full bg-surface1 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  >
                    <option value="Gratuito">Gratuito</option>
                    <option value="Professional">Professional</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <label className="text-xs font-bold text-text3 uppercase">Status (Acesso ao Sistema)</label>
                  <button 
                    onClick={() => setEditForm(prev => ({ ...prev, ativo: !prev.ativo }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${editForm.ativo ? 'bg-emerald-500' : 'bg-surface3'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${editForm.ativo ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
              <DialogFooter className="flex justify-end gap-3 pt-4 border-t border-border">
                <button 
                  onClick={() => setEditingTenant(null)}
                  className="px-4 py-2.5 rounded-xl border border-border text-sm font-bold text-text2 hover:bg-surface2 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSaveTenant}
                  className="px-6 py-2.5 rounded-xl gold-gradient text-white text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                >
                  Salvar Alterações
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

      </main>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <Card className="p-8 rounded-[32px] border-none shadow-[0_10px_40px_rgba(0,0,0,0.03)] bg-white relative overflow-hidden group">
      <div className={`absolute top-0 left-0 w-1.5 h-full ${color.replace('border-', 'bg-')}`} />
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 rounded-2xl bg-surface2 text-text2 group-hover:scale-110 transition-transform">
          <Icon className="h-5 w-5" />
        </div>
        <Clock className="h-4 w-4 text-text3 opacity-20" />
      </div>
      <p className="text-[10px] font-bold text-text3 uppercase tracking-widest">{label}</p>
      <h3 className="text-2xl font-display font-bold mt-2 tracking-tight">{value}</h3>
    </Card>
  );
}
