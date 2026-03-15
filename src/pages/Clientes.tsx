import { useState } from "react";
import { Search, Users, UserCheck, TrendingUp, DollarSign, Plus, Trash2, X } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { useCurrency } from "@/hooks/useCurrency";
import { useAuth } from "@/contexts/AuthContext";
import { useClientes } from "@/contexts/ClientesContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useSubscription } from "@/hooks/useSubscription";

type Filter = "Todos" | "VIP" | "Ativos" | "Inativos" | "Em risco";

const statusStyle: Record<string, string> = {
  VIP: "badge-vip",
  Ativo: "badge-active",
  "Em risco": "badge-risk",
  Inativo: "badge-inactive",
};

const initialForm = {
  nome: "",
  genero: "",
  profissao: "",
  dataNascimento: "",
  bi: "",
  email: "",
  telefone: "",
  observacoes: "",
};

export default function Clientes() {
  const { perfil, podeAcessar } = useAuth();
  const { clientesList, addCliente, removeCliente } = useClientes();
  const [filter, setFilter] = useState<Filter>("Todos");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const { format } = useCurrency();
  const { canAddCliente } = useSubscription();

  // Somente Administrador e Colaborador veem esta página
  if (perfil !== "Administrador" && perfil !== "Colaborador") {
    return <Navigate to="/dashboard" replace />;
  }

  const podeEditar = podeAcessar("clientes_editar");

  const metrics = [
    { label: "Total", value: clientesList.length.toString(), icon: Users, color: "text-primary" },
    { label: "Ativos este mês", value: clientesList.filter(c => c.status === "Ativo" || c.status === "VIP").length.toString(), icon: UserCheck, color: "text-green-custom" },
    { label: "Taxa de retorno", value: "68%", icon: TrendingUp, color: "text-teal-custom" },
    { label: "Ticket médio", value: format(147), icon: DollarSign, color: "text-primary" },
  ];

  const filtered = clientesList.filter((c) => {
    if (search && !c.nome.toLowerCase().includes(search.toLowerCase()) && !c.telefone.includes(search)) return false;
    if (filter === "Todos") return true;
    if (filter === "VIP") return c.status === "VIP";
    if (filter === "Ativos") return c.status === "Ativo";
    if (filter === "Em risco") return c.status === "Em risco";
    if (filter === "Inativos") return c.status === "Inativo";
    return false;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim() || !form.telefone.trim()) {
      toast.error("Nome e Telefone são obrigatórios.");
      return;
    }
    try {
      await addCliente({
        nome: form.nome.trim(),
        email: form.email.trim(),
        telefone: form.telefone.trim(),
        genero: form.genero,
        profissao: form.profissao,
        dataNascimento: form.dataNascimento,
        bi: form.bi,
        observacoes: form.observacoes,
      });
      setForm(initialForm);
      setOpen(false);
      toast.success("Cliente adicionado com sucesso!");
    } catch {
      toast.error("Erro ao adicionar cliente.");
    }
  };

  const handleRemove = async (id: string, nome: string) => {
    try {
      await removeCliente(id);
      toast.success(`Cliente "${nome}" removido com sucesso.`);
    } catch {
      toast.error("Erro ao remover cliente.");
    }
  };

  const updateField = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-xl border border-border bg-card p-4 card-hover">
            <div className="flex items-center gap-3">
              <div className={`rounded-lg bg-surface2 p-2 ${m.color}`}><m.icon className="h-4 w-4" /></div>
              <div>
                <p className="text-xs text-text3">{m.label}</p>
                <p className="font-display text-xl font-bold text-foreground">{m.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters + Add Button */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text3" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou telefone..."
            className="w-full rounded-lg border border-border bg-input pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-text3 focus:border-primary/50 focus:outline-none"
          />
        </div>
        <div className="flex gap-1">
          {(["Todos", "VIP", "Ativos", "Em risco", "Inativos"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === f ? "bg-primary/20 text-primary" : "text-text3 hover:text-foreground hover:bg-surface2"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {podeEditar && (
          <Dialog open={open} onOpenChange={(val) => {
            if (val && !canAddCliente) {
              toast.error("O limite de clientes para o seu plano foi atingido. Faça upgrade para continuar.");
              return;
            }
            setOpen(val);
          }}>
            <DialogTrigger asChild>
              <button 
                onClick={(e) => {
                  if (!canAddCliente) {
                    e.preventDefault();
                    toast.error("Limite de clientes atingido! Upgrade necessário.");
                  }
                }}
                className={`ml-auto flex items-center gap-2 rounded-lg ${canAddCliente ? 'gold-gradient' : 'bg-surface3 text-text3'} px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity`}
              >
                <Plus className="h-4 w-4" /> Novo Cliente
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-display text-lg">Adicionar Novo Cliente</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                <div>
                  <label className="text-sm font-medium text-foreground">Nome Completo *</label>
                  <input value={form.nome} onChange={(e) => updateField("nome", e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground placeholder:text-text3 focus:border-primary/50 focus:outline-none" placeholder="Nome completo do cliente" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Gênero</label>
                    <select value={form.genero} onChange={(e) => updateField("genero", e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground focus:border-primary/50 focus:outline-none">
                      <option value="">Selecione</option>
                      <option value="Feminino">Feminino</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Profissão</label>
                    <input value={form.profissao} onChange={(e) => updateField("profissao", e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground placeholder:text-text3 focus:border-primary/50 focus:outline-none" placeholder="Ex: Engenheira" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Data de Nascimento</label>
                    <input type="date" value={form.dataNascimento} onChange={(e) => updateField("dataNascimento", e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground focus:border-primary/50 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">B.I</label>
                    <input value={form.bi} onChange={(e) => updateField("bi", e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground placeholder:text-text3 focus:border-primary/50 focus:outline-none" placeholder="Nº do B.I" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground placeholder:text-text3 focus:border-primary/50 focus:outline-none" placeholder="email@exemplo.com" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Tel / WhatsApp *</label>
                    <input value={form.telefone} onChange={(e) => updateField("telefone", e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground placeholder:text-text3 focus:border-primary/50 focus:outline-none" placeholder="+244 9XX XXX XXX" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Observações</label>
                  <textarea value={form.observacoes} onChange={(e) => updateField("observacoes", e.target.value)} rows={3} className="mt-1 w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground placeholder:text-text3 focus:border-primary/50 focus:outline-none resize-none" placeholder="Alergias, preferências, notas especiais..." />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-border px-4 py-2.5 text-sm text-text2 hover:bg-surface2">Cancelar</button>
                  <button type="submit" className="rounded-lg gold-gradient px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">Salvar Cliente</button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-text3">
              <th className="p-4">Cliente</th>
              <th className="p-4 hidden md:table-cell">Telefone</th>
              <th className="p-4 hidden lg:table-cell">Último Serviço</th>
              <th className="p-4 hidden lg:table-cell">Última Visita</th>
              <th className="p-4">Total Gasto</th>
              <th className="p-4 hidden md:table-cell">Visitas</th>
              <th className="p-4">Status</th>
              {podeEditar && <th className="p-4 w-12"></th>}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-border/50 hover:bg-surface2/50 transition-colors">
                <td className="p-4">
                  <Link to={`/clientes/${c.id}`} className="flex items-center gap-3 hover:text-primary transition-colors">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full gold-gradient text-xs font-bold text-primary-foreground">
                      {c.avatar}
                    </div>
                    <span className="font-medium text-foreground">{c.nome}</span>
                  </Link>
                </td>
                <td className="p-4 text-text2 hidden md:table-cell">{c.telefone}</td>
                <td className="p-4 text-text2 hidden lg:table-cell">{c.ultimoServico}</td>
                <td className="p-4 text-text3 hidden lg:table-cell">{c.ultimaVisita}</td>
                <td className="p-4 font-semibold text-foreground">{format(c.totalGasto)}</td>
                <td className="p-4 text-text2 hidden md:table-cell">{c.visitas}</td>
                <td className="p-4">
                  <span className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-medium ${statusStyle[c.status]}`}>
                    {c.status}
                  </span>
                </td>
                {podeEditar && (
                  <td className="p-4">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="rounded-lg p-1.5 text-text3 hover:text-destructive hover:bg-destructive/10 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remover cliente?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja remover <strong>{c.nome}</strong>? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleRemove(c.id, c.nome)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Remover
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </td>
                )}
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="p-8 text-center text-text3">Nenhum cliente encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
