import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import KanbanBoard from "@/components/KanbanBoard";
import { Star, Plus, X, Trash2, Edit, Camera } from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const statusStyle: Record<string, string> = {
  "Disponível": "badge-active",
  "Em atendimento": "badge-vip",
  "Folga": "badge-inactive",
};

const habilidadesOpcoes = [
  "Coloração", "Progressiva", "Hidratação", "Corte Masculino", "Corte Feminino",
  "Escova", "Manicure + Pedicure", "Nail Art", "Limpeza de Pele", "Hidratação Facial",
  "Massagem", "Design de Sobrancelha", "Depilação", "Maquiagem", "Penteado",
  "Barba", "Botox Capilar", "Cauterização",
];

const emojis = ["💆", "✂️", "💅", "🌿", "💇", "🧖", "💄", "🪒"];

type ProfDB = Tables<"profissionais">;

export default function Profissionais() {
  const { format } = useCurrency();
  const { usuarioLogado } = useAuth();
  const estabId = usuarioLogado?.estabelecimentoId;
  const { canAddProfissional } = useSubscription();
  const [profList, setProfList] = useState<ProfDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const emptyForm = { nome: "", cargo: "", emoji: "💆", foto_url: "", servicos: [] as string[], status: "Disponível" };
  const [form, setForm] = useState(emptyForm);

  const fetchProfs = useCallback(async () => {
    if (!estabId) return;
    const { data } = await supabase.from("profissionais").select("*").eq("estabelecimento_id", estabId).order("nome");
    if (data) setProfList(data);
    setLoading(false);
  }, [estabId]);

  useEffect(() => { fetchProfs(); }, [fetchProfs]);

  const openNew = () => { 
    if (!canAddProfissional) {
      toast.error("Limite de profissionais atingido! Faça o upgrade do seu plano.");
      return;
    }
    setEditId(null); setForm(emptyForm); setShowModal(true); 
  };
  const openEdit = (p: ProfDB) => {
    setEditId(p.id);
    setForm({ nome: p.nome, cargo: p.cargo || "", emoji: p.emoji || "💆", foto_url: p.foto_url || "", servicos: p.servicos || [], status: p.status });
    setShowModal(true);
  };

  const toggleHab = (h: string) => {
    setForm(f => ({ ...f, servicos: f.servicos.includes(h) ? f.servicos.filter(s => s !== h) : [...f.servicos, h] }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const path = `profissionais/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("fotos").upload(path, file);
    if (error) { toast.error("Erro ao enviar foto"); return; }
    const { data: urlData } = supabase.storage.from("fotos").getPublicUrl(path);
    setForm(f => ({ ...f, foto_url: urlData.publicUrl }));
  };

  const save = async () => {
    if (!form.nome.trim() || !form.cargo.trim()) return;
    if (!estabId) return;

    if (!editId && !canAddProfissional) {
      toast.error("Limite de profissionais atingido.");
      return;
    }

    const payload = { nome: form.nome, cargo: form.cargo, emoji: form.emoji, foto_url: form.foto_url || null, servicos: form.servicos, status: form.status, estabelecimento_id: estabId };
    
    if (editId) {
      const { error } = await supabase.from("profissionais").update(payload).eq("id", editId).eq("estabelecimento_id", estabId);
      if (error) { toast.error("Erro ao atualizar"); return; }
      toast.success("Profissional atualizado");
    } else {
      const { error } = await supabase.from("profissionais").insert(payload);
      if (error) { toast.error("Erro ao adicionar"); return; }
      toast.success("Profissional adicionado");
    }
    setShowModal(false);
    fetchProfs();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("profissionais").delete().eq("id", id);
    if (error) { toast.error("Erro ao remover"); return; }
    toast.success("Profissional removido");
    setProfList(prev => prev.filter(p => p.id !== id));
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-foreground">Equipe</h2>
        <button 
          onClick={openNew} 
          className={`flex items-center gap-2 rounded-lg ${canAddProfissional ? 'gold-gradient' : 'bg-surface3 text-text3'} px-4 py-2.5 text-sm font-semibold text-primary-foreground`}
        >
          <Plus className="h-4 w-4" /> Novo Profissional
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {profList.map(p => (
          <div key={p.id} className="rounded-xl border border-border bg-card p-5 card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {p.foto_url ? (
                  <img src={p.foto_url} alt={p.nome} className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <span className="text-3xl">{p.emoji}</span>
                )}
                <div>
                  <h3 className="font-display text-base font-semibold text-foreground">{p.nome}</h3>
                  <p className="text-xs text-text3">{p.cargo}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(p)} className="rounded-lg p-1.5 text-text3 hover:bg-surface2 hover:text-foreground"><Edit className="h-4 w-4" /></button>
                <button onClick={() => remove(p.id)} className="rounded-lg p-1.5 text-text3 hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
            <span className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-medium mb-4 ${statusStyle[p.status] || "badge-inactive"}`}>{p.status}</span>
            <div className="flex flex-wrap gap-1 mt-2">
              {(p.servicos || []).map(s => <span key={s} className="rounded-full bg-surface2 px-2 py-0.5 text-[10px] text-text2">{s}</span>)}
            </div>
          </div>
        ))}
      </div>

      <KanbanBoard />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-foreground">{editId ? "Editar Profissional" : "Novo Profissional"}</h2>
              <button onClick={() => setShowModal(false)} className="text-text3 hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-text3 mb-2 block">Foto do Profissional</label>
                <div className="flex items-center gap-4">
                  <div onClick={() => fileInputRef.current?.click()} className="relative h-20 w-20 rounded-full border-2 border-dashed border-border hover:border-primary/50 cursor-pointer flex items-center justify-center overflow-hidden transition-colors bg-surface2">
                    {form.foto_url ? <img src={form.foto_url} alt="Preview" className="h-full w-full object-cover" /> : <Camera className="h-6 w-6 text-text3" />}
                  </div>
                  <div className="flex flex-col gap-1">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="text-xs text-primary hover:underline">{form.foto_url ? "Trocar foto" : "Enviar foto"}</button>
                    {form.foto_url && <button type="button" onClick={() => setForm(f => ({ ...f, foto_url: "" }))} className="text-xs text-destructive hover:underline">Remover</button>}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                </div>
              </div>
              <div>
                <label className="text-xs text-text3 mb-1 block">Nome *</label>
                <input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="text-xs text-text3 mb-1 block">Cargo / Especialidade *</label>
                <input value={form.cargo} onChange={e => setForm(f => ({ ...f, cargo: e.target.value }))} placeholder="Ex: Colorista Sênior" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="text-xs text-text3 mb-1 block">Emoji / Avatar</label>
                <div className="flex gap-2 flex-wrap">
                  {emojis.map(e => (
                    <button key={e} onClick={() => setForm(f => ({ ...f, emoji: e }))} className={`text-2xl p-1.5 rounded-lg ${form.emoji === e ? "bg-primary/20 ring-2 ring-primary" : "hover:bg-surface2"}`}>{e}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-text3 mb-1 block">Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground">
                  <option value="Disponível">Disponível</option>
                  <option value="Em atendimento">Em atendimento</option>
                  <option value="Folga">Folga</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-text3 mb-2 block">Habilidades / Serviços</label>
                <div className="flex flex-wrap gap-2">
                  {habilidadesOpcoes.map(h => (
                    <button key={h} onClick={() => toggleHab(h)} className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${form.servicos.includes(h) ? "bg-primary/20 text-primary ring-1 ring-primary/30" : "bg-surface2 text-text3 hover:text-foreground"}`}>{h}</button>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={save} className="w-full rounded-lg gold-gradient px-4 py-2.5 text-sm font-semibold text-primary-foreground">{editId ? "Salvar Alterações" : "Adicionar Profissional"}</button>
          </div>
        </div>
      )}
    </div>
  );
}
