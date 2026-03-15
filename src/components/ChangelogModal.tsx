import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Megaphone, Calendar, Rocket, CheckCircle2, Info, ShieldAlert, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

export function ChangelogModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      supabase.from("changelog")
        .select("*, changelog_itens(*)")
        .eq("publicado", true)
        .order("data_publicacao", { ascending: false })
        .then(({ data }) => {
          setLogs(data || []);
          setLoading(false);
        });
    }
  }, [isOpen]);

  const getBadgeType = (tipo: string) => {
    switch (tipo) {
      case "nova_funcionalidade": return { label: "Nova funcionalidade", className: "bg-blue-500", icon: Rocket };
      case "melhoria": return { label: "Melhoria", className: "bg-emerald-500", icon: CheckCircle2 };
      case "correccao": return { label: "Correcção", className: "bg-amber-500", icon: Info };
      case "seguranca": return { label: "Segurança", className: "bg-red-500", icon: ShieldAlert };
      case "breaking": return { label: "Alteração crítica", className: "bg-red-900", icon: AlertTriangle };
      default: return { label: tipo, className: "bg-slate-500", icon: Megaphone };
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" 
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.95, y: 20 }} 
            animate={{ scale: 1, y: 0 }} 
            className="bg-card w-full max-w-xl max-h-[85vh] overflow-hidden rounded-3xl border border-border shadow-2xl flex flex-col" 
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 border-b border-border flex justify-between items-center bg-surface2/50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl gold-gradient flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                  <Megaphone className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg">Novidades</h2>
                  <p className="text-[10px] uppercase font-bold text-text3 tracking-widest mt-0.5">Evolução BelezaSystem AO</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-surface3 rounded-full transition-colors"><X className="h-5 w-5" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
              {loading ? (
                <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
              ) : logs.length === 0 ? (
                <div className="text-center py-20 opacity-40">Sem registos de versão disponíveis.</div>
              ) : logs.map(log => (
                <div key={log.id} className="relative pl-8 border-l-2 border-primary/20">
                  <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary shadow-sm" />
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-xl">v{log.versao}</span>
                    <span className="text-[10px] uppercase font-bold text-text3 flex items-center gap-1.5 px-2 py-1 bg-surface2 rounded-full">
                      <Calendar className="h-3 w-3" /> {new Date(log.data_publicacao).toLocaleDateString("pt-AO")}
                    </span>
                  </div>
                  <h4 className="font-bold text-primary italic mb-4 leading-tight">"{log.titulo}"</h4>
                  <div className="space-y-6">
                    {log.changelog_itens?.map((it: any) => {
                      const style = getBadgeType(it.tipo);
                      return (
                        <div key={it.id} className="group">
                          <div className="flex items-center gap-2 mb-1.5">
                            <Badge className={`${style.className} text-white border-none py-0 px-2 text-[9px] font-bold uppercase`}>{style.label}</Badge>
                            {it.modulo_afetado && <span className="text-[9px] font-bold text-text3 uppercase italic opacity-60"># {it.modulo_afetado}</span>}
                          </div>
                          <p className="text-sm text-text2 leading-relaxed">{it.descricao}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-surface2 text-center border-t border-border">
              <p className="text-[9px] font-bold text-text3 uppercase tracking-[0.2em]">Obrigado por utilizar o BelezaSystem Angola 🇦🇴</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
