import { useState } from "react";
import { 
  Building2, Palette, Bell, Users, Globe, Megaphone, 
  ShieldCheck, CreditCard, ExternalLink, Sparkles, AlertTriangle
} from "lucide-react";
import { ChangelogModal } from "@/components/ChangelogModal";
import { Card } from "@/components/ui/card";
import { useSubscription, CUSTO_PLANOS } from "@/hooks/useSubscription";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/hooks/useCurrency";

export default function Configuracoes() {
  const [activeTab, setActiveTab] = useState("negocio");
  const [changelogOpen, setChangelogOpen] = useState(false);
  const { planoAtual, limits, usage, getLimitLabel, getLimitPercentage, loading } = useSubscription();
  const { format } = useCurrency();

  const tabs = [
    { id: "negocio", label: "Meu Estabelecimento", icon: Building2 },
    { id: "usuarios", label: "Funcionários & Perfis", icon: Users },
    { id: "assinatura", label: "Assinatura & Plano", icon: CreditCard },
    { id: "preferencias", label: "Preferências", icon: Palette },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight">Definições</h2>
          <p className="text-text3 text-sm mt-1">Gere as configurações do seu negócio em Angola</p>
        </div>
        <button 
          onClick={() => setChangelogOpen(true)}
          className="flex items-center gap-2.5 px-6 py-3 bg-primary/10 text-primary rounded-2xl font-bold text-xs hover:bg-primary/20 transition-all border border-primary/20 group"
        >
          <Sparkles className="h-4 w-4 animate-pulse" /> Novidades
        </button>
      </div>

      <div className="flex gap-2 p-2 bg-surface2 rounded-3xl border border-border inline-flex overflow-x-auto max-w-full">
        {tabs.map(t => (
          <button 
            key={t.id} 
            onClick={() => setActiveTab(t.id)} 
            className={`px-8 py-3.5 text-xs font-bold flex items-center gap-3 rounded-2xl transition-all whitespace-nowrap ${
              activeTab === t.id 
              ? "bg-white text-primary shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-border" 
              : "text-text3 hover:text-foreground"
            }`}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === "negocio" && (
           <Card className="p-10 rounded-[40px] border-none shadow-xl bg-white space-y-8">
             <div className="flex items-center gap-4 border-b border-border pb-6">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"><Building2 className="h-6 w-6" /></div>
                <div><h3 className="font-bold text-lg">Informações do Estabelecimento</h3><p className="text-xs text-text3">Detalhes jurídicos e de contacto</p></div>
             </div>
             
             <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-text3 uppercase tracking-widest ml-1">Nome Fantasia</label>
                  <input defaultValue="Studio Élise" className="w-full bg-surface1 border border-border rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-text3 uppercase tracking-widest ml-1">NIF (Angola)</label>
                  <input defaultValue="5000123456" className="w-full bg-surface1 border border-border rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-text3 uppercase tracking-widest ml-1">Telemóvel</label>
                  <input defaultValue="+244 923 000 000" className="w-full bg-surface1 border border-border rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-text3 uppercase tracking-widest ml-1">Email Profissional</label>
                  <input defaultValue="contacto@studioelise.ao" className="w-full bg-surface1 border border-border rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                </div>
             </div>

             <div className="pt-6 border-t border-border flex justify-end gap-4">
                <button className="gold-gradient px-12 py-4 rounded-2xl text-white font-bold text-xs shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">Guardar Alterações</button>
             </div>
           </Card>
        )}

        {activeTab === "assinatura" && (
          <Card className="p-10 rounded-[40px] border-none shadow-xl bg-white space-y-8">
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                   <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600"><Sparkles className="h-6 w-6" /></div>
                   <div><h3 className="font-bold text-lg">Plano {planoAtual}</h3><p className="text-xs text-text3 italic">Próxima renovação: N/A</p></div>
                </div>
                <Badge className={`${planoAtual === 'Gratuito' ? 'bg-text3' : 'bg-emerald-500'} text-white border-none py-1.5 px-4 rounded-full font-bold uppercase text-[10px]`}>
                  {planoAtual === 'Gratuito' ? 'Trial/Free' : 'Ativa'}
                </Badge>
             </div>

             <div className="bg-surface2 rounded-[32px] p-8 flex justify-between items-center border border-border shadow-inner">
                <div>
                   <p className="text-[10px] font-bold text-text3 uppercase tracking-widest mb-1">Custo Mensal</p>
                   <h4 className="text-3xl font-display font-bold">{format(CUSTO_PLANOS[planoAtual])} <span className="text-sm font-medium text-text3">/mês</span></h4>
                </div>
                <button className="px-8 py-3.5 bg-white border border-border rounded-2xl text-xs font-bold hover:bg-surface3 transition-all flex items-center gap-2">Gerir Assinatura <ExternalLink className="h-4 w-4" /></button>
             </div>

             <div className="pt-6">
                <h4 className="font-bold text-sm mb-6">Uso do seu plano</h4>
                {loading ? (
                  <p className="text-sm text-text3">A carregar...</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {/* Profissionais */}
                    <div className="space-y-2">
                       <div className="flex justify-between items-end">
                         <span className="text-xs font-semibold text-foreground flex items-center gap-2"><Users className="w-3.5 h-3.5" /> Profissionais</span>
                         <span className="text-[10px] font-bold text-text3">{getLimitLabel(usage.profissionais, limits.profissionais)}</span>
                       </div>
                       <div className="h-2 bg-surface2 rounded-full overflow-hidden">
                         <div className={`h-full ${getLimitPercentage(usage.profissionais, limits.profissionais) >= 90 ? 'bg-destructive' : 'bg-primary'} transition-all`} style={{ width: `${getLimitPercentage(usage.profissionais, limits.profissionais)}%` }}></div>
                       </div>
                    </div>
                    {/* Clientes */}
                     <div className="space-y-2">
                       <div className="flex justify-between items-end">
                         <span className="text-xs font-semibold text-foreground flex items-center gap-2"><Globe className="w-3.5 h-3.5" /> Clientes</span>
                         <span className="text-[10px] font-bold text-text3">{getLimitLabel(usage.clientes, limits.clientes)}</span>
                       </div>
                       <div className="h-2 bg-surface2 rounded-full overflow-hidden">
                         <div className={`h-full ${getLimitPercentage(usage.clientes, limits.clientes) >= 90 ? 'bg-destructive' : 'bg-teal-custom'} transition-all`} style={{ width: `${getLimitPercentage(usage.clientes, limits.clientes)}%` }}></div>
                       </div>
                    </div>
                    {/* Agendamentos */}
                    <div className="space-y-2">
                       <div className="flex justify-between items-end">
                         <span className="text-xs font-semibold text-foreground flex items-center gap-2"><Megaphone className="w-3.5 h-3.5" /> Agendamentos</span>
                         <span className="text-[10px] font-bold text-text3">{getLimitLabel(usage.agendamentos, limits.agendamentos_mes)}</span>
                       </div>
                       <div className="h-2 bg-surface2 rounded-full overflow-hidden">
                         <div className={`h-full ${getLimitPercentage(usage.agendamentos, limits.agendamentos_mes) >= 90 ? 'bg-destructive' : 'bg-rose-custom'} transition-all`} style={{ width: `${getLimitPercentage(usage.agendamentos, limits.agendamentos_mes)}%` }}></div>
                       </div>
                    </div>
                  </div>
                )}
             </div>

             {/* Upgrade Prompt se perto do limite */}
             {(!loading && (getLimitPercentage(usage.clientes, limits.clientes) >= 80 || getLimitPercentage(usage.profissionais, limits.profissionais) >= 80)) && (
               <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 text-amber-800">
                 <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                 <div>
                   <p className="font-semibold text-sm">Você está próximo de atingir os limites do plano actual.</p>
                   <p className="text-xs opacity-90 mt-1">Conidere fazer upgrade para evitar interrupções nos seus cadastros.</p>
                 </div>
               </div>
             )}
          </Card>
        )}
      </div>

      <ChangelogModal isOpen={changelogOpen} onClose={() => setChangelogOpen(false)} />
    </div>
  );
}
