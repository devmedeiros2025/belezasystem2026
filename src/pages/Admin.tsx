import { useState, useEffect } from "react";
import KanbanBoard from "@/components/KanbanBoard";
import { useAuth, Usuario, Perfil } from "@/contexts/AuthContext";
import { profissionais } from "@/data/mockData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Lock, Unlock, Check, X, RefreshCw, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const permissoesTable = [
  { recurso: "Dashboard completo", admin: "✅", financeiro: "✅", colaborador: "✅ parcial" },
  { recurso: "Agenda — ver todos", admin: "✅", financeiro: "✅", colaborador: "✅" },
  { recurso: "Agenda — editar todos", admin: "✅", financeiro: "❌", colaborador: "❌" },
  { recurso: "Clientes — ver lista", admin: "✅", financeiro: "✅", colaborador: "✅" },
  { recurso: "Clientes — editar", admin: "✅", financeiro: "❌", colaborador: "✅" },
  { recurso: "Financeiro completo", admin: "✅", financeiro: "✅", colaborador: "❌" },
  { recurso: "Comissões", admin: "✅", financeiro: "✅", colaborador: "❌" },
  { recurso: "Estoque", admin: "✅", financeiro: "❌", colaborador: "👁️ só ver" },
  { recurso: "Fidelidade", admin: "✅", financeiro: "❌", colaborador: "✅" },
  { recurso: "Avaliações", admin: "✅", financeiro: "❌", colaborador: "✅" },
  { recurso: "Configurações", admin: "✅", financeiro: "❌", colaborador: "❌" },
  { recurso: "Painel Admin", admin: "✅", financeiro: "❌", colaborador: "❌" },
  { recurso: "Criar usuários", admin: "✅", financeiro: "❌", colaborador: "❌" },
];

const activityLog = [
  { time: "hoje 09:14", user: "Élise Monteiro", action: "criou agendamento para Ana Paula Souza" },
  { time: "hoje 08:50", user: "Carlos Menezes", action: "lançou despesa: Produtos — Kz 15.000" },
  { time: "ontem 17:32", user: "Rodrigo Alves", action: "concluiu atendimento de Pedro Henrique" },
  { time: "ontem 16:10", user: "Élise Monteiro", action: "cadastrou novo usuário: Camile Torres" },
  { time: "ontem 14:30", user: "Patrícia Nunes", action: "atualizou perfil de cliente Mariana Ferreira" },
];

type AppRole = "admin" | "financeiro" | "colaborador" | "super_admin";

const perfilToRole: Record<Perfil, AppRole> = {
  SuperAdmin: "super_admin",
  Administrador: "admin",
  Financeiro: "financeiro",
  Colaborador: "colaborador",
};

function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

interface AdminUser {
  id: string;
  nome: string;
  email: string;
  perfil: Perfil;
  ativo: boolean;
  profissionalId?: string;
  criadoEm?: string;
}

export default function Admin() {
  const { usuarioLogado, criarUsuario } = useAuth();
  const [usuariosList, setUsuariosList] = useState<AdminUser[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    perfil: "Colaborador" as Perfil,
    profissionalId: undefined as string | undefined,
    ativo: true,
  });

  // Fetch users from profiles + roles
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    const { data: profiles } = await supabase.from("profiles").select("*");
    if (profiles) {
      const users: AdminUser[] = [];
      for (const p of profiles) {
        const { data: roleData } = await supabase.rpc("get_user_role", { _user_id: p.user_id });
        const roleMap: Record<string, Perfil> = { admin: "Administrador", financeiro: "Financeiro", colaborador: "Colaborador" };
        users.push({
          id: p.user_id,
          nome: p.nome,
          email: p.email || "",
          perfil: roleMap[roleData as string] || "Colaborador",
          ativo: p.ativo ?? true,
          profissionalId: p.profissional_id || undefined,
          criadoEm: new Date(p.created_at).toLocaleDateString("pt-BR", { month: "short", year: "numeric" }),
        });
      }
      setUsuariosList(users);
    }
    setLoadingUsers(false);
  };

  const openCreate = () => {
    setEditingUser(null);
    setForm({ nome: "", email: "", senha: generatePassword(), perfil: "Colaborador", profissionalId: undefined, ativo: true });
    setShowModal(true);
  };

  const openEdit = (user: AdminUser) => {
    setEditingUser(user);
    setForm({
      nome: user.nome,
      email: user.email,
      senha: "",
      perfil: user.perfil,
      profissionalId: user.profissionalId,
      ativo: user.ativo,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.nome || !form.email) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (editingUser) {
      if (editingUser.id === usuarioLogado?.id && editingUser.perfil === "Administrador" && form.perfil !== "Administrador") {
        toast.error("Você não pode alterar seu próprio perfil de Administrador");
        return;
      }

      // Update profile
      await supabase.from("profiles").update({
        nome: form.nome,
        ativo: form.ativo,
        profissional_id: form.profissionalId || null,
      }).eq("user_id", editingUser.id);

      // Update role
      const { error: deleteError } = await supabase.from("user_roles").delete().eq("user_id", editingUser.id);
      if (!deleteError) {
        await supabase.from("user_roles").insert({
          user_id: editingUser.id,
          role: perfilToRole[form.perfil],
        });
      }

      toast.success("Usuário atualizado com sucesso!");
      fetchUsers();
    } else {
      if (!form.senha) {
        toast.error("Senha é obrigatória para novo usuário");
        return;
      }
      const success = await criarUsuario(form.email, form.senha, form.nome, perfilToRole[form.perfil]);
      if (success) {
        toast.success("Usuário criado com sucesso!");
        fetchUsers();
      } else {
        toast.error("Erro ao criar usuário");
      }
    }
    setShowModal(false);
  };

  const toggleActive = async (userId: string) => {
    const user = usuariosList.find(u => u.id === userId);
    if (user?.id === usuarioLogado?.id) {
      toast.error("Você não pode desativar a si mesmo");
      return;
    }
    await supabase.from("profiles").update({ ativo: !user?.ativo }).eq("user_id", userId);
    toast.success(user?.ativo ? "Usuário desativado" : "Usuário ativado");
    fetchUsers();
  };

  const handleDelete = (userId: string) => {
    const user = usuariosList.find(u => u.id === userId);
    if (user?.id === usuarioLogado?.id) {
      toast.error("Você não pode remover a si mesmo");
      return;
    }
    if (user?.perfil === "Administrador") {
      toast.error("Administradores só podem ser desativados, não removidos");
      return;
    }
    // Note: actual user deletion requires service role - just deactivate for now
    toggleActive(userId);
    setDeleteConfirm(null);
  };

  const getPerfilBadge = (perfil: Perfil) => {
    const classes = {
      Administrador: "badge-admin",
      Financeiro: "badge-financeiro",
      Colaborador: "badge-colaborador",
    };
    return `inline-block rounded-full px-2.5 py-1 text-[11px] font-medium ${classes[perfil]}`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Painel de Administração</h1>
          <p className="text-sm text-text3 mt-1">Gerencie usuários e permissões do sistema</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-lg gold-gradient px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg"
        >
          <Plus className="h-4 w-4" />
          Novo Usuário
        </button>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden" style={{ boxShadow: '0 2px 12px hsl(var(--shadow) / 0.08)' }}>
        <div className="p-5 border-b border-border">
          <h3 className="font-display text-lg font-semibold text-foreground">Gestão de Usuários</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface2/50">
                <th className="p-4 text-left text-xs font-semibold text-text3 uppercase tracking-wide">Usuário</th>
                <th className="p-4 text-left text-xs font-semibold text-text3 uppercase tracking-wide">E-mail</th>
                <th className="p-4 text-left text-xs font-semibold text-text3 uppercase tracking-wide">Perfil</th>
                <th className="p-4 text-left text-xs font-semibold text-text3 uppercase tracking-wide">Status</th>
                <th className="p-4 text-left text-xs font-semibold text-text3 uppercase tracking-wide">Criado em</th>
                <th className="p-4 text-center text-xs font-semibold text-text3 uppercase tracking-wide">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loadingUsers ? (
                <tr><td colSpan={6} className="p-8 text-center text-text3">Carregando...</td></tr>
              ) : usuariosList.map((user) => (
                <tr key={user.id} className="border-b border-border/50 hover:bg-surface2/30">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full gold-gradient text-xs font-bold text-primary-foreground">
                        {user.nome.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <span className="font-medium text-foreground">{user.nome}</span>
                    </div>
                  </td>
                  <td className="p-4 text-text2">{user.email}</td>
                  <td className="p-4">
                    <span className={getPerfilBadge(user.perfil)}>{user.perfil}</span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-medium ${user.ativo ? "badge-active" : "badge-inactive"}`}>
                      {user.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="p-4 text-text3">{user.criadoEm}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => openEdit(user)}
                        className="rounded-lg p-2 text-text3 hover:bg-surface2 hover:text-foreground transition-colors"
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => toggleActive(user.id)}
                        className="rounded-lg p-2 text-text3 hover:bg-surface2 hover:text-foreground transition-colors"
                        title={user.ativo ? "Desativar" : "Ativar"}
                      >
                        {user.ativo ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                      </button>
                      {deleteConfirm === user.id ? (
                        <>
                          <button onClick={() => handleDelete(user.id)} className="rounded-lg p-2 text-destructive hover:bg-destructive/10"><Check className="h-4 w-4" /></button>
                          <button onClick={() => setDeleteConfirm(null)} className="rounded-lg p-2 text-text3 hover:bg-surface2"><X className="h-4 w-4" /></button>
                        </>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(user.id)}
                          className="rounded-lg p-2 text-text3 hover:bg-destructive/10 hover:text-destructive transition-colors"
                          title="Remover"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permissions Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden" style={{ boxShadow: '0 2px 12px hsl(var(--shadow) / 0.08)' }}>
        <div className="p-5 border-b border-border">
          <h3 className="font-display text-lg font-semibold text-foreground">Permissões por Perfil</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface2/50">
                <th className="p-4 text-left text-xs font-semibold text-text3 uppercase tracking-wide">Recurso</th>
                <th className="p-4 text-center text-xs font-semibold text-text3 uppercase tracking-wide">Administrador</th>
                <th className="p-4 text-center text-xs font-semibold text-text3 uppercase tracking-wide">Financeiro</th>
                <th className="p-4 text-center text-xs font-semibold text-text3 uppercase tracking-wide">Colaborador</th>
              </tr>
            </thead>
            <tbody>
              {permissoesTable.map((row) => (
                <tr key={row.recurso} className="border-b border-border/50 hover:bg-surface2/30">
                  <td className="p-4 font-medium text-foreground">{row.recurso}</td>
                  <td className="p-4 text-center">{row.admin}</td>
                  <td className="p-4 text-center">{row.financeiro}</td>
                  <td className="p-4 text-center">{row.colaborador}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activity Log */}
      <div className="rounded-xl border border-border bg-card overflow-hidden" style={{ boxShadow: '0 2px 12px hsl(var(--shadow) / 0.08)' }}>
        <div className="p-5 border-b border-border">
          <h3 className="font-display text-lg font-semibold text-foreground">Log de Atividades</h3>
        </div>
        <div className="p-5 space-y-3">
          {activityLog.map((log, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg bg-surface2/50 p-3">
              <Clock className="h-4 w-4 text-text3 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-foreground">
                  <span className="font-medium text-primary">{log.user}</span>{" "}
                  {log.action}
                </p>
                <p className="text-xs text-text3 mt-0.5">[{log.time}]</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kanban */}
      <KanbanBoard />

      {/* Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-foreground">
              {editingUser ? "Editar Usuário" : "Novo Usuário"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text2">Nome completo</label>
              <input
                value={form.nome}
                onChange={(e) => setForm(f => ({ ...f, nome: e.target.value }))}
                className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground focus:border-primary/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text2">E-mail</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground focus:border-primary/50 focus:outline-none"
                disabled={!!editingUser}
              />
            </div>
            {!editingUser && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text2">Senha temporária</label>
                <div className="flex gap-2">
                  <input
                    value={form.senha}
                    onChange={(e) => setForm(f => ({ ...f, senha: e.target.value }))}
                    className="flex-1 rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground font-mono focus:border-primary/50 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, senha: generatePassword() }))}
                    className="rounded-lg border border-border px-3 py-2.5 text-text3 hover:bg-surface2 hover:text-foreground transition-colors"
                    title="Gerar senha"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text2">Perfil</label>
              <select
                value={form.perfil}
                onChange={(e) => setForm(f => ({ ...f, perfil: e.target.value as Perfil }))}
                className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground focus:border-primary/50 focus:outline-none"
              >
                <option value="Administrador">Administrador — Acesso total ao sistema</option>
                <option value="Financeiro">Financeiro — Acesso a relatórios e finanças</option>
                <option value="Colaborador">Colaborador — Acesso básico para profissionais</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text2">Vincular ao profissional (opcional)</label>
              <select
                value={form.profissionalId || ""}
                onChange={(e) => setForm(f => ({ ...f, profissionalId: e.target.value || undefined }))}
                className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground focus:border-primary/50 focus:outline-none"
              >
                <option value="">Nenhum</option>
                {profissionais.map(p => (
                  <option key={p.id} value={p.id}>{p.emoji} {p.nome} — {p.cargo}</option>
                ))}
              </select>
            </div>
            {editingUser && (
              <div className="text-xs text-text3 bg-surface2 rounded-lg p-3">
                <p>Criado em: {editingUser.criadoEm || "—"}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <button
              onClick={() => setShowModal(false)}
              className="rounded-lg border border-border px-4 py-2.5 text-sm text-text2 hover:bg-surface2"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="rounded-lg gold-gradient px-4 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              {editingUser ? "Salvar" : "Criar Usuário"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
