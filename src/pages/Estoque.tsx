import { AlertTriangle, Package, Plus, Pencil, Trash2, ArrowUpDown } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useCurrency } from "@/hooks/useCurrency";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface EstoqueItem {
  id: string;
  produto: string;
  categoria: string;
  estoque_atual: number;
  minimo: number;
  custo_unit: number;
  fornecedor: string | null;
  validade: string | null;
  nota_fiscal: string | null;
}

function getStatus(item: EstoqueItem) {
  if (item.estoque_atual <= 0 || item.estoque_atual < item.minimo * 0.5) return "Crítico";
  if (item.estoque_atual < item.minimo) return "Baixo";
  return "Normal";
}

const statusStyle: Record<string, string> = {
  Normal: "badge-active",
  Baixo: "bg-primary/12 text-primary border border-primary/20",
  Crítico: "badge-risk",
};

const categorias = ["Coloração", "Químicos", "Lavagem", "Tratamento", "Unhas", "Descartáveis", "Outros"];

export default function Estoque() {
  const { format } = useCurrency();
  const [items, setItems] = useState<EstoqueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showProdutoModal, setShowProdutoModal] = useState(false);
  const [editItem, setEditItem] = useState<EstoqueItem | null>(null);

  // Form states - Entrada de Estoque
  const [entradaProdutoId, setEntradaProdutoId] = useState("");
  const [entradaQtd, setEntradaQtd] = useState(10);
  const [entradaCusto, setEntradaCusto] = useState(0);
  const [entradaFornecedor, setEntradaFornecedor] = useState("");
  const [entradaNF, setEntradaNF] = useState("");

  // Form states - Produto
  const [prodNome, setProdNome] = useState("");
  const [prodCategoria, setProdCategoria] = useState("Outros");
  const [prodMinimo, setProdMinimo] = useState(5);
  const [prodCusto, setProdCusto] = useState(0);
  const [prodFornecedor, setProdFornecedor] = useState("");

  const fetchItems = useCallback(async () => {
    const { data, error } = await supabase
      .from("estoque")
      .select("*")
      .order("produto");
    if (!error && data) setItems(data as EstoqueItem[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const criticos = items.filter(e => getStatus(e) === "Crítico");
  const baixos = items.filter(e => getStatus(e) === "Baixo");

  const handleEntrada = async () => {
    if (!entradaProdutoId) { toast.error("Selecione um produto"); return; }
    const { error } = await supabase.from("estoque").update({
      estoque_atual: (items.find(i => i.id === entradaProdutoId)?.estoque_atual || 0) + entradaQtd,
      custo_unit: entradaCusto || undefined,
      fornecedor: entradaFornecedor || undefined,
    }).eq("id", entradaProdutoId);

    if (!error) {
      await supabase.from("estoque_movimentacoes").insert({
        estoque_id: entradaProdutoId,
        tipo: "Entrada",
        quantidade: entradaQtd,
        custo_unit: entradaCusto || null,
        fornecedor: entradaFornecedor || null,
        nota_fiscal: entradaNF || null,
      });
      toast.success("Estoque atualizado! ✅");
      setShowModal(false);
      resetEntradaForm();
      fetchItems();
    } else {
      toast.error("Erro ao atualizar estoque");
    }
  };

  const resetEntradaForm = () => {
    setEntradaProdutoId("");
    setEntradaQtd(10);
    setEntradaCusto(0);
    setEntradaFornecedor("");
    setEntradaNF("");
  };

  const handleSaveProduto = async () => {
    if (!prodNome.trim()) { toast.error("Nome do produto é obrigatório"); return; }
    if (editItem) {
      const { error } = await supabase.from("estoque").update({
        produto: prodNome,
        categoria: prodCategoria,
        minimo: prodMinimo,
        custo_unit: prodCusto,
        fornecedor: prodFornecedor || null,
      }).eq("id", editItem.id);
      if (!error) { toast.success("Produto atualizado!"); } else { toast.error("Erro ao atualizar"); return; }
    } else {
      const { error } = await supabase.from("estoque").insert({
        produto: prodNome,
        categoria: prodCategoria,
        estoque_atual: 0,
        minimo: prodMinimo,
        custo_unit: prodCusto,
        fornecedor: prodFornecedor || null,
      });
      if (!error) { toast.success("Produto cadastrado!"); } else { toast.error("Erro ao cadastrar"); return; }
    }
    setShowProdutoModal(false);
    setEditItem(null);
    resetProdutoForm();
    fetchItems();
  };

  const resetProdutoForm = () => {
    setProdNome("");
    setProdCategoria("Outros");
    setProdMinimo(5);
    setProdCusto(0);
    setProdFornecedor("");
  };

  const openEdit = (item: EstoqueItem) => {
    setEditItem(item);
    setProdNome(item.produto);
    setProdCategoria(item.categoria);
    setProdMinimo(item.minimo);
    setProdCusto(item.custo_unit);
    setProdFornecedor(item.fornecedor || "");
    setShowProdutoModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja realmente excluir este produto?")) return;
    const { error } = await supabase.from("estoque").delete().eq("id", id);
    if (!error) { toast.success("Produto removido"); fetchItems(); }
    else toast.error("Erro ao remover");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alerts */}
      {(criticos.length > 0 || baixos.length > 0) && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <span className="text-sm font-semibold text-destructive">{criticos.length + baixos.length} itens precisam de atenção</span>
          </div>
          <div className="space-y-1">
            {criticos.map(e => <p key={e.id} className="text-xs text-destructive/80">🔴 {e.produto} — estoque: {e.estoque_atual} (mín: {e.minimo})</p>)}
            {baixos.map(e => <p key={e.id} className="text-xs text-primary">🟡 {e.produto} — estoque: {e.estoque_atual} (mín: {e.minimo})</p>)}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <h3 className="font-display text-lg font-semibold text-foreground">Produtos e Insumos ({items.length})</h3>
        <div className="flex gap-2">
          <button onClick={() => { setEditItem(null); resetProdutoForm(); setShowProdutoModal(true); }} className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-surface2">
            <Package className="h-4 w-4" /> Novo Produto
          </button>
          <button onClick={() => { resetEntradaForm(); setShowModal(true); }} className="flex items-center gap-2 rounded-lg gold-gradient px-4 py-2.5 text-sm font-semibold text-primary-foreground">
            <Plus className="h-4 w-4" /> Entrada de Estoque
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border text-xs text-text3">
            <th className="p-4 text-left">Produto</th>
            <th className="p-4 text-left hidden md:table-cell">Categoria</th>
            <th className="p-4 text-left">Estoque</th>
            <th className="p-4 text-left hidden md:table-cell">Mínimo</th>
            <th className="p-4 text-left hidden lg:table-cell">Custo Unit.</th>
            <th className="p-4 text-left hidden lg:table-cell">Fornecedor</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-left">Ações</th>
          </tr></thead>
          <tbody>
            {items.map(e => {
              const status = getStatus(e);
              return (
                <tr key={e.id} className="border-b border-border/50 hover:bg-surface2/50">
                  <td className="p-4 font-medium text-foreground">
                    <div className="flex items-center gap-2"><Package className="h-4 w-4 text-text3 shrink-0" />{e.produto}</div>
                  </td>
                  <td className="p-4 text-text2 hidden md:table-cell">{e.categoria}</td>
                  <td className="p-4 text-foreground font-semibold">{e.estoque_atual}</td>
                  <td className="p-4 text-text3 hidden md:table-cell">{e.minimo}</td>
                  <td className="p-4 text-text2 hidden lg:table-cell">{format(e.custo_unit)}</td>
                  <td className="p-4 text-text2 hidden lg:table-cell">{e.fornecedor || "—"}</td>
                  <td className="p-4"><span className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-medium ${statusStyle[status]}`}>{status}</span></td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(e)} className="rounded-lg p-2 text-text3 hover:text-foreground hover:bg-surface2">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => handleDelete(e.id)} className="rounded-lg p-2 text-text3 hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {items.length === 0 && (
              <tr><td colSpan={8} className="p-8 text-center text-text3">Nenhum produto cadastrado</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Entrada de Estoque */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-xl font-semibold text-foreground mb-5">Entrada de Estoque</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm text-text2">Produto</label>
                <select value={entradaProdutoId} onChange={e => {
                  setEntradaProdutoId(e.target.value);
                  const item = items.find(i => i.id === e.target.value);
                  if (item) { setEntradaCusto(item.custo_unit); setEntradaFornecedor(item.fornecedor || ""); }
                }} className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground focus:outline-none">
                  <option value="">Selecione...</option>
                  {items.map(i => <option key={i.id} value={i.id}>{i.produto} (atual: {i.estoque_atual})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="mb-1.5 block text-sm text-text2">Quantidade</label><input type="number" value={entradaQtd} onChange={e => setEntradaQtd(Number(e.target.value))} className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground focus:outline-none" /></div>
                <div><label className="mb-1.5 block text-sm text-text2">Custo Unit.</label><input type="number" value={entradaCusto} onChange={e => setEntradaCusto(Number(e.target.value))} className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground focus:outline-none" /></div>
              </div>
              <div><label className="mb-1.5 block text-sm text-text2">Fornecedor</label><input value={entradaFornecedor} onChange={e => setEntradaFornecedor(e.target.value)} className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground focus:outline-none" /></div>
              <div><label className="mb-1.5 block text-sm text-text2">Nº Nota Fiscal</label><input value={entradaNF} onChange={e => setEntradaNF(e.target.value)} className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground focus:outline-none" /></div>
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <button onClick={() => setShowModal(false)} className="rounded-lg border border-border px-4 py-2.5 text-sm text-text2 hover:bg-surface2">Cancelar</button>
              <button onClick={handleEntrada} className="rounded-lg gold-gradient px-5 py-2.5 text-sm font-semibold text-primary-foreground">Confirmar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Novo/Editar Produto */}
      {showProdutoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4" onClick={() => { setShowProdutoModal(false); setEditItem(null); }}>
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-xl font-semibold text-foreground mb-5">{editItem ? "Editar Produto" : "Novo Produto"}</h3>
            <div className="space-y-4">
              <div><label className="mb-1.5 block text-sm text-text2">Nome do Produto</label><input value={prodNome} onChange={e => setProdNome(e.target.value)} placeholder="Ex: Shampoo Profissional" className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground focus:outline-none" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm text-text2">Categoria</label>
                  <select value={prodCategoria} onChange={e => setProdCategoria(e.target.value)} className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground focus:outline-none">
                    {categorias.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div><label className="mb-1.5 block text-sm text-text2">Estoque Mínimo</label><input type="number" value={prodMinimo} onChange={e => setProdMinimo(Number(e.target.value))} className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground focus:outline-none" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="mb-1.5 block text-sm text-text2">Custo Unitário</label><input type="number" value={prodCusto} onChange={e => setProdCusto(Number(e.target.value))} className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground focus:outline-none" /></div>
                <div><label className="mb-1.5 block text-sm text-text2">Fornecedor</label><input value={prodFornecedor} onChange={e => setProdFornecedor(e.target.value)} className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground focus:outline-none" /></div>
              </div>
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <button onClick={() => { setShowProdutoModal(false); setEditItem(null); }} className="rounded-lg border border-border px-4 py-2.5 text-sm text-text2 hover:bg-surface2">Cancelar</button>
              <button onClick={handleSaveProduto} className="rounded-lg gold-gradient px-5 py-2.5 text-sm font-semibold text-primary-foreground">{editItem ? "Salvar" : "Cadastrar"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
