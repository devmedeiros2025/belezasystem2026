import { useState, useRef, DragEvent } from "react";
import { Plus, Clock, Eye, CheckCircle2, Loader2, ClipboardCheck, X, MessageSquare, CalendarDays, User, ListTodo } from "lucide-react";
import { Tarefa, TarefaStatus, tarefasMock } from "@/data/tarefasData";
import { useAuth } from "@/contexts/AuthContext";

// Temporary mock users for Kanban until fully migrated to Supabase
const mockUsuarios = [
  { id: "1", nome: "Élise Monteiro", perfil: "Administrador" as const, ativo: true },
  { id: "2", nome: "Rodrigo Alves", perfil: "Colaborador" as const, ativo: true },
  { id: "3", nome: "Patrícia Nunes", perfil: "Colaborador" as const, ativo: true },
  { id: "4", nome: "Carlos Menezes", perfil: "Financeiro" as const, ativo: true },
];
import { profissionais } from "@/data/mockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const colunas: { key: TarefaStatus; label: string; icon: React.ElementType; colorClass: string; bgClass: string }[] = [
  { key: "afazer", label: "A Fazer", icon: ListTodo, colorClass: "text-slate-600", bgClass: "bg-slate-50 border-slate-200" },
  { key: "fazendo", label: "Fazendo", icon: Loader2, colorClass: "text-blue-600", bgClass: "bg-blue-50 border-blue-200" },
  { key: "feito", label: "Feito", icon: ClipboardCheck, colorClass: "text-amber-600", bgClass: "bg-amber-50 border-amber-200" },
  { key: "aguardando", label: "Aguardando Aprovação", icon: Eye, colorClass: "text-purple-600", bgClass: "bg-purple-50 border-purple-200" },
  { key: "concluido", label: "Concluído", icon: CheckCircle2, colorClass: "text-green-600", bgClass: "bg-green-50 border-green-200" },
];

const emptyTarefa = (): Omit<Tarefa, "id" | "criadoPorId" | "criadoPorNome"> => ({
  titulo: "",
  descricao: "",
  responsavelId: 0,
  responsavelNome: "",
  status: "afazer",
  dataInicio: new Date().toISOString().split("T")[0],
  horaInicio: "09:00",
  dataConclusao: new Date().toISOString().split("T")[0],
  horaConclusao: "18:00",
  observacoes: "",
});

export default function KanbanBoard() {
  const { perfil, usuarioLogado } = useAuth();
  const isAdmin = perfil === "Administrador";

  const [tarefas, setTarefas] = useState<Tarefa[]>(tarefasMock);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailTask, setDetailTask] = useState<Tarefa | null>(null);
  const [form, setForm] = useState(emptyTarefa());
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dragOverCol, setDragOverCol] = useState<TarefaStatus | null>(null);

  const openNew = () => {
    setForm(emptyTarefa());
    setEditingId(null);
    setModalOpen(true);
  };

  const openEdit = (t: Tarefa) => {
    setForm({ ...t });
    setEditingId(t.id);
    setDetailTask(null);
    setModalOpen(true);
  };

  const saveTarefa = () => {
    if (!form.titulo.trim() || !form.responsavelId) return;
    const responsavel = mockUsuarios.find(u => u.id === String(form.responsavelId));
    if (editingId) {
      setTarefas(prev => prev.map(t => t.id === editingId ? { ...t, ...form, responsavelNome: responsavel?.nome || "" } : t));
    } else {
      const nova: Tarefa = {
        ...form,
        id: Date.now(),
        responsavelNome: responsavel?.nome || "",
        criadoPorId: Number(usuarioLogado?.id) || 1,
        criadoPorNome: usuarioLogado?.nome || "",
      };
      setTarefas(prev => [...prev, nova]);
    }
    setModalOpen(false);
  };

  const moveTask = (id: number, newStatus: TarefaStatus) => {
    setTarefas(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    setDetailTask(prev => prev && prev.id === id ? { ...prev, status: newStatus } : prev);
  };

  const deleteTask = (id: number) => {
    setTarefas(prev => prev.filter(t => t.id !== id));
    setDetailTask(null);
  };

  const formatDate = (d: string) => {
    if (!d) return "";
    const [y, m, day] = d.split("-");
    return `${day}/${m}/${y}`;
  };

  // Filter tasks: collaborators see only their own tasks
  const visibleTarefas = perfil === "Colaborador"
    ? tarefas.filter(t => String(t.responsavelId) === usuarioLogado?.profissionalId || String(t.responsavelId) === usuarioLogado?.id)
    : tarefas;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-primary" />
          Quadro de Tarefas
        </h3>
        {isAdmin && (
          <button
            onClick={openNew}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nova Tarefa
          </button>
        )}
      </div>

      {/* Kanban columns */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        {colunas.map((col) => {
          const items = visibleTarefas.filter(t => t.status === col.key);
          const isOver = dragOverCol === col.key;
          return (
            <div
              key={col.key}
              className={`rounded-xl border p-3 min-h-[200px] transition-all duration-200 ${col.bgClass} ${isOver ? "ring-2 ring-primary/40 scale-[1.01]" : ""}`}
              onDragOver={(e: DragEvent) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                setDragOverCol(col.key);
              }}
              onDragLeave={() => setDragOverCol(null)}
              onDrop={(e: DragEvent) => {
                e.preventDefault();
                setDragOverCol(null);
                if (draggedId !== null) {
                  moveTask(draggedId, col.key);
                  setDraggedId(null);
                }
              }}
            >
              <div className="flex items-center gap-2 mb-3 px-1">
                <col.icon className={`h-4 w-4 ${col.colorClass}`} />
                <span className={`text-sm font-semibold ${col.colorClass}`}>{col.label}</span>
                <span className={`ml-auto rounded-full px-2 py-0.5 text-xs font-bold ${col.colorClass} bg-white/60`}>
                  {items.length}
                </span>
              </div>
              <div className="space-y-2">
                {items.map((t) => (
                  <div
                    key={t.id}
                    draggable
                    onDragStart={(e: DragEvent) => {
                      setDraggedId(t.id);
                      e.dataTransfer.effectAllowed = "move";
                      // Make the ghost semi-transparent
                      if (e.currentTarget instanceof HTMLElement) {
                        e.currentTarget.style.opacity = "0.5";
                      }
                    }}
                    onDragEnd={(e: DragEvent) => {
                      setDraggedId(null);
                      setDragOverCol(null);
                      if (e.currentTarget instanceof HTMLElement) {
                        e.currentTarget.style.opacity = "1";
                      }
                    }}
                    onClick={() => setDetailTask(t)}
                    className={`rounded-lg border border-white/60 bg-white p-3 shadow-sm cursor-grab hover:shadow-md transition-all active:cursor-grabbing ${draggedId === t.id ? "opacity-50 scale-95" : ""}`}
                  >
                    <p className="text-sm font-medium text-foreground leading-snug">{t.titulo}</p>
                    <p className="text-xs text-text3 mt-1 line-clamp-2">{t.descricao}</p>
                    <div className="flex items-center gap-2 mt-2.5">
                      <div className="flex items-center gap-1 text-[11px] text-text3">
                        <User className="h-3 w-3" />
                        {t.responsavelNome.split(" ")[0]}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-text3 ml-auto">
                        <Clock className="h-3 w-3" />
                        {formatDate(t.dataConclusao)}
                      </div>
                    </div>
                  </div>
                ))}
                {isOver && draggedId !== null && (
                  <div className="rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 p-3 text-center text-xs text-primary font-medium">
                    Soltar aqui
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail modal */}
      <Dialog open={!!detailTask} onOpenChange={() => setDetailTask(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">{detailTask?.titulo}</DialogTitle>
          </DialogHeader>
          {detailTask && (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-text3 uppercase mb-1">Descrição</p>
                <p className="text-sm text-foreground">{detailTask.descricao}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-semibold text-text3 uppercase mb-1">Responsável</p>
                  <p className="text-sm text-foreground flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-primary" />
                    {detailTask.responsavelNome}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-text3 uppercase mb-1">Criado por</p>
                  <p className="text-sm text-foreground">{detailTask.criadoPorNome}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-semibold text-text3 uppercase mb-1">Início</p>
                  <p className="text-sm text-foreground flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 text-teal-custom" />
                    {formatDate(detailTask.dataInicio)} às {detailTask.horaInicio}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-text3 uppercase mb-1">Conclusão</p>
                  <p className="text-sm text-foreground flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 text-rose-custom" />
                    {formatDate(detailTask.dataConclusao)} às {detailTask.horaConclusao}
                  </p>
                </div>
              </div>
              {detailTask.observacoes && (
                <div>
                  <p className="text-xs font-semibold text-text3 uppercase mb-1">Observações</p>
                  <p className="text-sm text-foreground rounded-lg bg-surface2 p-3">{detailTask.observacoes}</p>
                </div>
              )}

              {/* Status change buttons */}
              <div>
                <p className="text-xs font-semibold text-text3 uppercase mb-2">Mover para</p>
                <div className="flex flex-wrap gap-2">
                  {colunas.filter(c => c.key !== detailTask.status).map(c => (
                    <button
                      key={c.key}
                      onClick={() => moveTask(detailTask.id, c.key)}
                      className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${c.bgClass} ${c.colorClass} hover:opacity-80`}
                    >
                      <c.icon className="h-3.5 w-3.5" />
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-border">
                {isAdmin && (
                  <>
                    <button onClick={() => openEdit(detailTask)} className="flex-1 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                      Editar
                    </button>
                    <button onClick={() => deleteTask(detailTask.id)} className="rounded-lg border border-destructive/30 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
                      Excluir
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create/Edit modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">{editingId ? "Editar Tarefa" : "Nova Tarefa"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-text3 uppercase">Título *</label>
              <Input value={form.titulo} onChange={e => setForm(p => ({ ...p, titulo: e.target.value }))} placeholder="Ex: Organizar estoque" className="mt-1" />
            </div>
            <div>
              <label className="text-xs font-semibold text-text3 uppercase">Descrição *</label>
              <Textarea value={form.descricao} onChange={e => setForm(p => ({ ...p, descricao: e.target.value }))} placeholder="Descreva a tarefa em detalhes..." className="mt-1" rows={3} />
            </div>
            <div>
              <label className="text-xs font-semibold text-text3 uppercase">Responsável *</label>
              <Select value={String(form.responsavelId || "")} onValueChange={v => setForm(p => ({ ...p, responsavelId: Number(v) }))}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  {mockUsuarios.filter(u => u.ativo).map(u => (
                    <SelectItem key={u.id} value={u.id}>{u.nome} — {u.perfil}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold text-text3 uppercase">Status</label>
              <Select value={form.status} onValueChange={v => setForm(p => ({ ...p, status: v as TarefaStatus }))}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {colunas.map(c => (
                    <SelectItem key={c.key} value={c.key}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-text3 uppercase">Data Início</label>
                <Input type="date" value={form.dataInicio} onChange={e => setForm(p => ({ ...p, dataInicio: e.target.value }))} className="mt-1" />
              </div>
              <div>
                <label className="text-xs font-semibold text-text3 uppercase">Hora Início</label>
                <Input type="time" value={form.horaInicio} onChange={e => setForm(p => ({ ...p, horaInicio: e.target.value }))} className="mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-text3 uppercase">Data Conclusão</label>
                <Input type="date" value={form.dataConclusao} onChange={e => setForm(p => ({ ...p, dataConclusao: e.target.value }))} className="mt-1" />
              </div>
              <div>
                <label className="text-xs font-semibold text-text3 uppercase">Hora Conclusão</label>
                <Input type="time" value={form.horaConclusao} onChange={e => setForm(p => ({ ...p, horaConclusao: e.target.value }))} className="mt-1" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-text3 uppercase">Observações</label>
              <Textarea value={form.observacoes} onChange={e => setForm(p => ({ ...p, observacoes: e.target.value }))} placeholder="Notas adicionais..." className="mt-1" rows={2} />
            </div>
            <button onClick={saveTarefa} className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
              {editingId ? "Salvar Alterações" : "Criar Tarefa"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
