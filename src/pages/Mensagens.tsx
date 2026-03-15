import { useState } from "react";
import { mensagens } from "@/data/mockData";
import { Search, Send, MessageCircle, Instagram, Smartphone, Phone, Wifi, WifiOff } from "lucide-react";

const canais = ["Todos", "WhatsApp", "Instagram", "SMS"] as const;
const templates = [
  "Lembrete de agendamento amanhã às {horário}",
  "Obrigada pela visita! Avalie seu atendimento 🌟",
  "Seu agendamento foi confirmado ✅",
  "Estamos com promoção especial esta semana!",
];

const canalIcon: Record<string, React.ReactNode> = {
  WhatsApp: <MessageCircle className="h-3.5 w-3.5 text-green-custom" />,
  Instagram: <Instagram className="h-3.5 w-3.5 text-purple-custom" />,
  SMS: <Smartphone className="h-3.5 w-3.5 text-text3" />,
};

interface Integration {
  id: string;
  name: string;
  icon: React.ReactNode;
  connected: boolean;
  description: string;
}

export default function Mensagens() {
  const [selectedId, setSelectedId] = useState(mensagens[0].id);
  const [canal, setCanal] = useState<typeof canais[number]>("Todos");
  const [msg, setMsg] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const [showIntegrations, setShowIntegrations] = useState(false);

  const [integrations, setIntegrations] = useState<Integration[]>([
    { id: "whatsapp", name: "WhatsApp Business API", icon: <MessageCircle className="h-5 w-5 text-green-custom" />, connected: false, description: "Conecte sua conta WhatsApp Business para enviar e receber mensagens diretamente pelo sistema." },
    { id: "instagram", name: "Instagram Direct", icon: <Instagram className="h-5 w-5 text-purple-custom" />, connected: false, description: "Vincule o Instagram do salão para gerenciar mensagens do Direct sem sair do sistema." },
  ]);

  const filtered = canal === "Todos" ? mensagens : mensagens.filter(m => m.canal === canal);
  const selected = mensagens.find(m => m.id === selectedId)!;

  const toggleConnection = (id: string) => {
    setIntegrations(prev => prev.map(i => i.id === id ? { ...i, connected: !i.connected } : i));
  };

  return (
    <div className="space-y-4">
      {/* Integration bar */}
      <div className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-3">
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-semibold text-foreground">Canais Conectados</h3>
          <div className="flex gap-3">
            {integrations.map(i => (
              <div key={i.id} className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${i.connected ? "bg-green-custom/10 text-green-custom" : "bg-surface2 text-text3"}`}>
                {i.icon}
                {i.name.split(" ")[0]}
                {i.connected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              </div>
            ))}
          </div>
        </div>
        <button onClick={() => setShowIntegrations(true)} className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text2 hover:bg-surface2 transition-colors">
          Gerenciar APIs
        </button>
      </div>

      {/* Chat area */}
      <div className="flex h-[calc(100vh-200px)] rounded-xl border border-border bg-card overflow-hidden">
        {/* List */}
        <div className="w-full max-w-xs border-r border-border flex flex-col">
          <div className="p-3 border-b border-border">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text3" />
              <input placeholder="Buscar..." className="w-full rounded-lg border border-border bg-surface2 pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-text3 focus:border-primary/50 focus:outline-none" />
            </div>
            <div className="flex gap-1">
              {canais.map(c => (
                <button key={c} onClick={() => setCanal(c)} className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${canal === c ? "bg-primary/20 text-primary" : "text-text3 hover:text-foreground"}`}>{c}</button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.map(m => (
              <button
                key={m.id}
                onClick={() => setSelectedId(m.id)}
                className={`w-full flex items-center gap-3 p-3 text-left border-b border-border/50 transition-colors ${selectedId === m.id ? "bg-primary/5" : "hover:bg-surface2"}`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full gold-gradient text-xs font-bold text-primary-foreground">{m.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-foreground truncate">{m.nome}</span>
                      {canalIcon[m.canal]}
                    </div>
                    <span className="text-[10px] text-text3 shrink-0 ml-2">{m.hora}</span>
                  </div>
                  <p className="truncate text-xs text-text3 mt-0.5">{m.preview}</p>
                </div>
                {m.naoLido && <span className="h-2.5 w-2.5 rounded-full bg-primary shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full gold-gradient text-xs font-bold text-primary-foreground">{selected.avatar}</div>
              <div>
                <p className="text-sm font-medium text-foreground">{selected.nome}</p>
                <div className="flex items-center gap-1.5">
                  {canalIcon[selected.canal]}
                  <p className="text-[11px] text-text3">{selected.canal}</p>
                </div>
              </div>
            </div>
            <button className="text-xs text-primary hover:underline">Ver Perfil</button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {selected.mensagens.map(m => (
              <div key={m.id} className={`flex ${m.tipo === "enviada" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                  m.tipo === "enviada"
                    ? "bg-primary/20 text-foreground rounded-br-md"
                    : "bg-surface2 text-foreground rounded-bl-md"
                }`}>
                  {"auto" in m && m.auto && <span className="text-[10px] text-text3 block mb-1">🤖 Automático</span>}
                  <p>{m.texto}</p>
                  <p className="text-[10px] text-text3 mt-1 text-right">{m.hora}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border p-3">
            {showTemplates && (
              <div className="mb-3 flex flex-wrap gap-2">
                {templates.map((t, i) => (
                  <button key={i} onClick={() => { setMsg(t); setShowTemplates(false); }} className="rounded-full border border-border bg-surface2 px-3 py-1.5 text-xs text-text2 hover:border-primary/40 hover:text-primary transition-colors">{t}</button>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <button onClick={() => setShowTemplates(!showTemplates)} className="rounded-lg border border-border px-3 py-2 text-xs text-text3 hover:bg-surface2">Templates</button>
              <input value={msg} onChange={e => setMsg(e.target.value)} placeholder="Digite sua mensagem..." className="flex-1 rounded-lg border border-border bg-surface2 px-3 py-2 text-sm text-foreground placeholder:text-text3 focus:border-primary/50 focus:outline-none" />
              <button className="rounded-lg gold-gradient px-4 py-2 text-primary-foreground"><Send className="h-4 w-4" /></button>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Modal */}
      {showIntegrations && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-foreground">Gerenciar Integrações</h2>
              <button onClick={() => setShowIntegrations(false)} className="text-text3 hover:text-foreground"><span className="sr-only">Fechar</span>✕</button>
            </div>
            <p className="text-sm text-text3">Conecte suas contas para receber e enviar mensagens diretamente pelo sistema.</p>

            {integrations.map(integration => (
              <div key={integration.id} className="rounded-xl border border-border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {integration.icon}
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{integration.name}</h3>
                      <span className={`text-[11px] font-medium ${integration.connected ? "text-green-custom" : "text-text3"}`}>
                        {integration.connected ? "Conectado" : "Desconectado"}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleConnection(integration.id)}
                    className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
                      integration.connected
                        ? "border border-destructive/30 text-destructive hover:bg-destructive/10"
                        : "gold-gradient text-primary-foreground"
                    }`}
                  >
                    {integration.connected ? "Desconectar" : "Conectar API"}
                  </button>
                </div>
                <p className="text-xs text-text3">{integration.description}</p>
                {!integration.connected && (
                  <div className="rounded-lg bg-surface2 p-3 space-y-2">
                    <p className="text-xs font-medium text-text2">Para conectar:</p>
                    <ol className="text-xs text-text3 space-y-1 list-decimal pl-4">
                      {integration.id === "whatsapp" ? (
                        <>
                          <li>Acesse o <span className="text-primary">Meta Business Suite</span></li>
                          <li>Gere um token de acesso da WhatsApp Business API</li>
                          <li>Cole o token e o número verificado aqui</li>
                        </>
                      ) : (
                        <>
                          <li>Acesse as <span className="text-primary">Configurações do Instagram</span></li>
                          <li>Ative a API de Mensagens para contas profissionais</li>
                          <li>Autorize o acesso ao Direct</li>
                        </>
                      )}
                    </ol>
                  </div>
                )}
              </div>
            ))}

            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
              <p className="text-xs text-text2">
                <span className="font-semibold text-primary">💡 Dica:</span> Para integrações reais, será necessário conectar ao Lovable Cloud e configurar as credenciais da API. As conversas serão sincronizadas automaticamente.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
