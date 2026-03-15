import { useState, useCallback, useMemo, useEffect } from "react";
import KanbanBoard from "@/components/KanbanBoard";
import { ChevronLeft, ChevronRight, X, GripVertical, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { startOfWeek, addDays, addWeeks, subWeeks, format, isToday, parseISO } from "date-fns";
import { pt } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const diasAbrev: Record<string, string> = {
  "segunda-feira": "Seg",
  "terça-feira": "Ter",
  "quarta-feira": "Qua",
  "quinta-feira": "Qui",
  "sexta-feira": "Sex",
};

const dayAbrevToIndex: Record<string, number> = {
  Seg: 0, Ter: 1, Qua: 2, Qui: 3, Sex: 4,
};

function getWeekDays(baseDate: Date) {
  const monday = startOfWeek(baseDate, { weekStartsOn: 1 });
  return Array.from({ length: 5 }, (_, i) => {
    const date = addDays(monday, i);
    const dayName = format(date, "EEEE", { locale: pt });
    return {
      nome: diasAbrev[dayName] || format(date, "EEE", { locale: pt }),
      num: date.getDate(),
      date,
      isToday: isToday(date),
      isoDate: format(date, "yyyy-MM-dd"),
    };
  });
}

function formatWeekRange(days: ReturnType<typeof getWeekDays>) {
  const first = days[0].date;
  const last = days[days.length - 1].date;
  const sameMonth = first.getMonth() === last.getMonth();
  if (sameMonth) {
    return `${first.getDate()} – ${format(last, "d MMM yyyy", { locale: pt })}`;
  }
  return `${format(first, "d MMM", { locale: pt })} – ${format(last, "d MMM yyyy", { locale: pt })}`;
}

const horarios = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
const views = ["Dia", "Semana", "Mês"] as const;

const defaultColors = ["gold", "teal", "rose", "purple"];

const corMap: Record<string, string> = {
  gold: "border-l-primary bg-primary/10",
  teal: "border-l-teal-custom bg-teal-custom/10",
  rose: "border-l-rose-custom bg-rose-custom/10",
  purple: "border-l-purple-custom bg-purple-custom/10",
};

const dotMap: Record<string, string> = {
  gold: "bg-primary",
  teal: "bg-teal-custom",
  rose: "bg-rose-custom",
  purple: "bg-purple-custom",
};

interface AgendaItem {
  id: string;
  cliente_id: string | null;
  cliente_nome: string;
  servico: string;
  profissional_id: string | null;
  profissional_nome: string;
  data: string; // yyyy-MM-dd
  hora: string; // HH:mm or HH:mm:ss
  duracao: number;
  status: string;
  canal: string | null;
  observacoes: string | null;
  cor: string; // derived from profissional
  diaAbrev: string; // derived from data
}

interface Profissional {
  id: string;
  nome: string;
  cor: string;
}

export default function Agenda() {
  const { usuarioLogado } = useAuth();
  const estabId = usuarioLogado?.estabelecimentoId;
  const [view, setView] = useState<typeof views[number]>("Semana");
  const [selected, setSelected] = useState<AgendaItem | null>(null);
  const [items, setItems] = useState<AgendaItem[]>([]);
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<{ dia: string; hora: string } | null>(null);
  const [weekBase, setWeekBase] = useState(new Date());

  const diasSemana = useMemo(() => getWeekDays(weekBase), [weekBase]);
  const weekLabel = useMemo(() => formatWeekRange(diasSemana), [diasSemana]);

  // Build profissional color map
  const profColorMap = useMemo(() => {
    const map: Record<string, string> = {};
    profissionais.forEach((p, i) => {
      map[p.id] = p.cor || defaultColors[i % defaultColors.length];
    });
    return map;
  }, [profissionais]);

  // Fetch profissionais
  useEffect(() => {
    if (!estabId) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("profissionais")
        .select("id, nome, cor")
        .eq("estabelecimento_id", estabId)
        .order("nome");
      if (data) {
        setProfissionais(
          data.map((p, i) => ({
            id: p.id,
            nome: p.nome,
            cor: p.cor || defaultColors[i % defaultColors.length],
          }))
        );
      }
    };
    fetch();
  }, []);

  // Fetch agendamentos for current week
  useEffect(() => {
    if (!estabId) {
      if (usuarioLogado) setLoading(false);
      return;
    }
    const fetchAgendamentos = async () => {
      setLoading(true);
      const startDate = diasSemana[0].isoDate;
      const endDate = diasSemana[diasSemana.length - 1].isoDate;

      const { data, error } = await supabase
        .from("agendamentos")
        .select("*")
        .eq("estabelecimento_id", estabId)
        .gte("data", startDate)
        .lte("data", endDate)
        .order("hora");

      if (error) {
        toast.error("Erro ao carregar agendamentos");
        console.error(error);
      }

      if (data) {
        setItems(
          data.map((a) => {
            const dateObj = parseISO(a.data);
            const dayName = format(dateObj, "EEEE", { locale: pt });
            const diaAbrev = diasAbrev[dayName] || format(dateObj, "EEE", { locale: pt });
            const horaShort = a.hora.substring(0, 5); // "HH:mm:ss" -> "HH:mm"
            return {
              id: a.id,
              cliente_id: a.cliente_id,
              cliente_nome: a.cliente_nome,
              servico: a.servico,
              profissional_id: a.profissional_id,
              profissional_nome: a.profissional_nome,
              data: a.data,
              hora: horaShort,
              duracao: a.duracao,
              status: a.status,
              canal: a.canal,
              observacoes: a.observacoes,
              cor: a.profissional_id ? (profColorMap[a.profissional_id] || "gold") : "gold",
              diaAbrev,
            };
          })
        );
      }
      setLoading(false);
    };

    if (profissionais.length > 0 || !loading) {
      fetchAgendamentos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekBase, profColorMap, estabId]);

  const goToPrevWeek = useCallback(() => setWeekBase(prev => subWeeks(prev, 1)), []);
  const goToNextWeek = useCallback(() => setWeekBase(prev => addWeeks(prev, 1)), []);
  const goToCurrentWeek = useCallback(() => setWeekBase(new Date()), []);

  const handleDragStart = useCallback((e: React.DragEvent, id: string) => {
    setDragId(id);
    e.dataTransfer.effectAllowed = "move";
    const el = e.currentTarget as HTMLElement;
    setTimeout(() => el.style.opacity = "0.4", 0);
  }, []);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    (e.currentTarget as HTMLElement).style.opacity = "1";
    setDragId(null);
    setDropTarget(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, dia: string, hora: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDropTarget({ dia, hora });
  }, []);

  const handleDragLeave = useCallback(() => {
    setDropTarget(null);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent, dia: string, hora: string) => {
    e.preventDefault();
    setDropTarget(null);
    if (dragId === null) return;

    // Find the target date from dia abbreviation
    const targetDay = diasSemana.find(d => d.nome === dia);
    if (!targetDay) return;

    const occupied = items.find(a => a.diaAbrev === dia && a.hora === hora && a.id !== dragId);
    if (occupied) {
      toast.error("Este horário já está ocupado!");
      setDragId(null);
      return;
    }

    const item = items.find(a => a.id === dragId);
    if (!item) return;

    const changed = item.diaAbrev !== dia || item.hora !== hora;
    if (!changed) {
      setDragId(null);
      return;
    }

    // Update in database
    const { error } = await supabase
      .from("agendamentos")
      .update({ data: targetDay.isoDate, hora: hora + ":00" })
      .eq("id", dragId)
      .eq("estabelecimento_id", estabId);

    if (error) {
      toast.error("Erro ao reagendar");
      console.error(error);
      setDragId(null);
      return;
    }

    setItems(prev => prev.map(a =>
      a.id === dragId
        ? { ...a, data: targetDay.isoDate, hora, diaAbrev: dia }
        : a
    ));
    toast.success(`${item.cliente_nome} movido para ${dia} às ${hora}`);
    setDragId(null);
  }, [dragId, items, diasSemana]);

  const handleUpdateStatus = useCallback(async (id: string, status: string) => {
    const { error } = await supabase
      .from("agendamentos")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast.error("Erro ao atualizar status");
      return;
    }

    setItems(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    toast.success(`Status atualizado para ${status}`);
    setSelected(null);
  }, []);

  const handleCancelAgendamento = useCallback(async (id: string) => {
    const { error } = await supabase
      .from("agendamentos")
      .update({ status: "Cancelado" })
      .eq("id", id);

    if (error) {
      toast.error("Erro ao cancelar");
      return;
    }

    setItems(prev => prev.filter(a => a.id !== id));
    toast.success("Agendamento cancelado");
    setSelected(null);
  }, []);

  // Current time indicator
  const now = new Date();
  const currentHour = format(now, "HH:00");
  const currentDayAbrev = (() => {
    const dayName = format(now, "EEEE", { locale: pt });
    return diasAbrev[dayName] || "";
  })();

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {views.map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                view === v ? "bg-primary/20 text-primary" : "text-text3 hover:text-foreground hover:bg-surface2"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={goToCurrentWeek} className="rounded-full px-3 py-1.5 text-xs font-semibold gold-gradient text-primary-foreground shadow-sm hover:opacity-90 transition-opacity">
            Hoje
          </button>
          <button onClick={goToPrevWeek} className="rounded-lg p-2 text-text3 hover:bg-surface2 transition-colors"><ChevronLeft className="h-4 w-4" /></button>
          <span className="text-sm font-medium text-foreground min-w-[160px] text-center">{weekLabel}</span>
          <button onClick={goToNextWeek} className="rounded-lg p-2 text-text3 hover:bg-surface2 transition-colors"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        {profissionais.map((p) => (
          <div key={p.id} className="flex items-center gap-2 text-xs text-text2">
            <span className={`h-2.5 w-2.5 rounded-full ${dotMap[p.cor] || "bg-primary"}`} />
            {p.nome}
          </div>
        ))}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Grid */}
          <div className="rounded-xl border border-border bg-card overflow-x-auto">
            <div className="min-w-[700px]">
              <div className="grid" style={{ gridTemplateColumns: "70px repeat(5, 1fr)" }}>
                <div className="border-b border-border p-3" />
                {diasSemana.map((d) => (
                  <div key={d.nome} className={`border-b border-l border-border px-3 py-3 text-center ${d.isToday ? "bg-primary/8" : ""}`}>
                    <span className={`block text-[11px] uppercase tracking-wider font-medium ${d.isToday ? "text-primary" : "text-text3"}`}>
                      {d.nome}
                    </span>
                    <span className={`mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full text-lg font-bold ${d.isToday ? "gold-gradient text-primary-foreground" : "text-foreground"}`}>
                      {d.num}
                    </span>
                  </div>
                ))}

                {horarios.map((h) => (
                  <>
                    <div key={h} className="border-b border-border p-2 text-right text-xs text-text3 pr-3 pt-3">{h}</div>
                    {diasSemana.map((d) => {
                      const ag = items.find(a => a.diaAbrev === d.nome && a.hora === h);
                      const isOver = dropTarget?.dia === d.nome && dropTarget?.hora === h;
                      const isDraggingThis = ag && dragId === ag.id;
                      const showNowLine = currentDayAbrev === d.nome && currentHour === h && d.isToday;

                      return (
                        <div
                          key={`${d.nome}-${h}`}
                          className={`border-b border-l border-border p-1.5 min-h-[52px] relative transition-colors duration-150 ${
                            isOver && !ag ? "bg-primary/10 ring-2 ring-inset ring-primary/30 rounded-md" : ""
                          } ${isOver && ag && dragId !== ag.id ? "bg-destructive/10 ring-2 ring-inset ring-destructive/30 rounded-md" : ""}`}
                          onDragOver={(e) => handleDragOver(e, d.nome, h)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, d.nome, h)}
                        >
                          {showNowLine && (
                            <div className="absolute left-0 right-0 top-1/2 border-t border-destructive/60 z-10">
                              <span className="absolute -top-2.5 left-1 text-[9px] text-destructive font-medium">Agora</span>
                            </div>
                          )}
                          {ag ? (
                            <div
                              draggable
                              onDragStart={(e) => handleDragStart(e, ag.id)}
                              onDragEnd={handleDragEnd}
                              onClick={() => setSelected(ag)}
                              className={`w-full rounded-lg border-l-[3px] px-2 py-1.5 text-left text-xs transition-all hover:scale-[1.02] cursor-grab active:cursor-grabbing ${corMap[ag.cor] || corMap.gold} ${isDraggingThis ? "opacity-40" : ""}`}
                            >
                              <div className="flex items-start gap-1">
                                <GripVertical className="h-3 w-3 mt-0.5 text-text3/50 shrink-0" />
                                <div className="min-w-0">
                                  <p className="font-medium text-foreground truncate">{ag.cliente_nome}</p>
                                  <p className="text-text3 truncate">{ag.servico}</p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className={`h-full w-full rounded-lg border border-dashed transition-colors ${
                              isOver ? "border-primary/40" : "border-transparent hover:border-primary/20"
                            } cursor-pointer`} />
                          )}
                        </div>
                      );
                    })}
                  </>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-background/40 backdrop-blur-sm" />
          <div className="relative w-full max-w-sm bg-card border-l border-border h-full p-6 overflow-y-auto animate-slide-in-right" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-lg font-semibold text-foreground">Detalhes</h3>
              <button onClick={() => setSelected(null)} className="rounded-lg p-1 text-text3 hover:bg-surface2"><X className="h-5 w-5" /></button>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full gold-gradient text-sm font-bold text-primary-foreground">
                {selected.cliente_nome.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-foreground">{selected.cliente_nome}</p>
                <p className="text-sm text-text3">{selected.servico}</p>
              </div>
            </div>
            <div className="space-y-4 mb-8">
              {[
                ["Profissional", selected.profissional_nome],
                ["Data", format(parseISO(selected.data), "d MMM yyyy", { locale: pt })],
                ["Horário", selected.hora],
                ["Duração", `${selected.duracao} min`],
                ["Status", selected.status],
                ["Canal", selected.canal || "—"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-text3">{k}</span>
                  <span className={`font-medium ${v === "Pendente" ? "text-primary" : v === "Confirmado" ? "text-green-custom" : "text-foreground"}`}>{v}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => handleUpdateStatus(selected.id, "Confirmado")} className="rounded-lg gold-gradient px-3 py-2.5 text-sm font-semibold text-primary-foreground">Confirmar</button>
              <button className="rounded-lg border border-border px-3 py-2.5 text-sm text-text2 hover:bg-surface2">Remarcar</button>
              <button onClick={() => handleCancelAgendamento(selected.id)} className="rounded-lg border border-destructive/30 px-3 py-2.5 text-sm text-destructive hover:bg-destructive/10">Cancelar</button>
              <button onClick={() => handleUpdateStatus(selected.id, "Concluído")} className="rounded-lg bg-green-custom/20 px-3 py-2.5 text-sm font-medium text-green-custom hover:bg-green-custom/30">Checkout</button>
            </div>
          </div>
        </div>
      )}
      <KanbanBoard />
    </div>
  );
}
