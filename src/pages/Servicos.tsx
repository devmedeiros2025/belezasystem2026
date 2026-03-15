import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Clock, DollarSign, Edit, Plus, X, Trash2 } from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";
import { toast } from "sonner";

const categorias = ["Cabelo", "Estética", "Unhas", "Barba", "Spa & Bem-estar"] as const;
type Categoria = typeof categorias[number];

type ServicoDB = Tables<"servicos">;

export default function Servicos() {
  const [cat, setCat] = useState<Categoria>("Cabelo");
  const { format } = useCurrency();
  const [servicosList, setServicosList] = useState<ServicoDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const emptyForm = { nome: "", categoria: cat as string, duracao: 60, preco: 0, ativo: true };
  const [form, setForm] = useState(emptyForm);

  const fetchServicos = useCallback(async () => {
    const { data } = await supabase.from("servicos").select("*").order("nome");
    if (data) setServicosList(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchServicos(); }, [fetchServicos]);

  const filtered = servicosList.filter(s => s.categoria === cat);

  const openNew = () => {
    setEditId(null);
    setForm({ ...emptyForm, categoria: cat });
    setShowModal(true);
  };

  const openEdit = (s: ServicoDB) => {
    setEditId(s.id);
    setForm({ nome: s.nome, categoria: s.categoria, duracao: s.duracao, preco: Number(s.preco), ativo: s.ativo });
    setShowModal(true);
  };

  const save = async () => {
    if (!form.nome.trim()) return;
    if (editId) {
      const { error } = await supabase.from("servicos").update({ nome: form.nome, categoria: form.categoria, duracao: form.duracao, preco: form.preco, ativo: form.ativo }).eq("id", editId);
      if (error) { toast.error("Erro ao atualizar"); return; }
      toast.success("Serviço atualizado");
    } else {
      const { error } = await supabase.from("servicos").insert({ nome: form.nome, categoria: form.categoria, duracao: form.duracao, preco: form.preco, ativo: form.ativo });
      if (error) { toast.error("Erro ao adicionar"); return; }
      toast.success("Serviço adicionado");
    }
    setShowModal(false);
    fetchServicos();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("servicos").delete().eq("id", id);
    if (error) { toast.error("Erro ao remover"); return; }
    toast.success("Serviço removido");
    setServicosList(prev => prev.filter(s => s.id !== id));
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 overflow-x-auto">
          {categorias.map(c => (
            <button key={c} onClick={() => setCat(c)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${cat === c ? "bg-primary/20 text-primary" : "text-text3 hover:text-foreground hover:bg-surface2"}`}>{c}</button>
          ))}
        </div>
        <button onClick={openNew} className="flex items-center gap-2 rounded-lg gold-gradient px-4 py-2.5 text-sm font-semibold text-primary-foreground">
          <Plus className="h-4 w-4" /> Novo Serviço
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(s => (
          <div key={s.id} className="rounded-xl border border-border bg-card p-5 card-hover">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-display text-lg font-semibold text-foreground">{s.nome}</h3>
              <div className="flex gap-1">
                <button onClick={() => openEdit(s)} className="rounded-lg p-1.5 text-text3 hover:bg-surface2 hover:text-foreground"><Edit className="h-4 w-4" /></button>
                <button onClick={() => remove(s.id)} className="rounded-lg p-1.5 text-text3 hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-text2 mb-4">
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-text3" />{s.duracao} min</span>
              <span className="flex items-center gap-1.5"><DollarSign className="h-4 w-4 text-text3" />{format(Number(s.preco))}</span>
            </div>
            <div className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-medium ${s.ativo ? "badge-active" : "badge-inactive"}`}>
              {s.ativo ? "Ativo" : "Inativo"}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-sm text-text3 col-span-full text-center py-10">Nenhum serviço nesta categoria</p>}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-foreground">{editId ? "Editar Serviço" : "Novo Serviço"}</h2>
              <button onClick={() => setShowModal(false)} className="text-text3 hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-text3 mb-1 block">Nome *</label>
                <input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="text-xs text-text3 mb-1 block">Categoria</label>
                <select value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground">
                  {categorias.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-text3 mb-1 block">Duração (min)</label>
                  <input type="number" value={form.duracao} onChange={e => setForm(f => ({ ...f, duracao: +e.target.value }))} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="text-xs text-text3 mb-1 block">Preço</label>
                  <input type="number" value={form.preco} onChange={e => setForm(f => ({ ...f, preco: +e.target.value }))} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-text2">
                <input type="checkbox" checked={form.ativo} onChange={e => setForm(f => ({ ...f, ativo: e.target.checked }))} className="rounded" />
                Ativo
              </label>
            </div>
            <button onClick={save} className="w-full rounded-lg gold-gradient px-4 py-2.5 text-sm font-semibold text-primary-foreground">{editId ? "Salvar Alterações" : "Adicionar Serviço"}</button>
          </div>
        </div>
      )}
    </div>
  );
}
