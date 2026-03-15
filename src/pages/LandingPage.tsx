import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Star, Crown, Gem, Sparkles, ArrowRight, Shield, Zap, Users, BarChart3, Calendar, MessageSquare } from "lucide-react";
import salonHero from "@/assets/salon-hero.jpg";
import barberSection from "@/assets/barber-section.jpg";
import spaSection from "@/assets/spa-section.jpg";

const plans = [
  {
    name: "Essencial",
    price: "14.900",
    period: "/mês",
    icon: Star,
    description: "Para salões que estão começando a profissionalizar a gestão.",
    features: [
      "Até 2 profissionais",
      "Agendamento online",
      "Cadastro de clientes",
      "Controle financeiro básico",
      "Relatórios mensais",
      "Suporte por e-mail",
    ],
    cta: "Começar Agora",
    popular: false,
    gradient: "from-[hsl(30,20%,96%)] to-[hsl(35,30%,92%)]",
    border: "border-border",
  },
  {
    name: "Profissional",
    price: "29.900",
    period: "/mês",
    icon: Crown,
    description: "O plano mais escolhido. Ideal para salões em crescimento.",
    features: [
      "Até 10 profissionais",
      "Tudo do plano Essencial",
      "Comissões automáticas",
      "Programa de fidelidade",
      "Controle de estoque",
      "Contas a pagar/receber",
      "Relatórios avançados",
      "Suporte prioritário",
    ],
    cta: "Escolher Profissional",
    popular: true,
    gradient: "from-[hsl(35,50%,50%)] to-[hsl(35,55%,40%)]",
    border: "border-primary",
  },
  {
    name: "Premium",
    price: "49.900",
    period: "/mês",
    icon: Gem,
    description: "Para redes e salões de alto padrão que exigem o melhor.",
    features: [
      "Profissionais ilimitados",
      "Tudo do plano Profissional",
      "Multi-estabelecimentos",
      "API & integrações",
      "Personalização da marca",
      "Relatórios personalizados",
      "Gerente de conta dedicado",
      "Onboarding VIP",
    ],
    cta: "Falar com Consultor",
    popular: false,
    gradient: "from-[hsl(270,30%,20%)] to-[hsl(280,40%,15%)]",
    border: "border-[hsl(270,40%,55%)]",
  },
];

const features = [
  { icon: Calendar, title: "Agenda Inteligente", desc: "Gerencie todos os agendamentos com visualização diária, semanal e mensal. Seus clientes nunca mais ficam sem horário." },
  { icon: Users, title: "CRM de Clientes", desc: "Histórico completo, preferências, programa de fidelidade. Conheça cada cliente como se fosse único — porque é." },
  { icon: BarChart3, title: "Financeiro Completo", desc: "Fluxo de caixa, comissões, contas a pagar e receber. Saiba exatamente quanto seu salão fatura e lucra." },
  { icon: Shield, title: "Estoque Controlado", desc: "Nunca mais perca venda por falta de produto. Alertas automáticos de estoque mínimo e controle de validade." },
  { icon: Zap, title: "Relatórios em Tempo Real", desc: "Dashboards visuais com os KPIs que importam. Tome decisões baseadas em dados, não em achismos." },
  { icon: MessageSquare, title: "Multi-Estabelecimento", desc: "Gerencie várias unidades numa única plataforma. Dados consolidados e visão global do seu império." },
];

const testimonials = [
  { name: "Mariana S.", role: "Dona do Luxe Beauty", text: "Triplicamos nosso faturamento em 6 meses. O controle financeiro mudou completamente nossa gestão.", avatar: "MS" },
  { name: "Carlos M.", role: "Gestor do Studio CM", text: "A agenda online reduziu 70% das faltas. Nossos clientes adoram a praticidade de agendar a qualquer hora.", avatar: "CM" },
  { name: "Ana P.", role: "CEO da Rede Belíssima", text: "Gerenciar 5 unidades era um caos. Com o BeautyCRM, tenho tudo numa tela. Não troco por nada.", avatar: "AP" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export default function LandingPage() {
  const navigate = useNavigate();
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[hsl(30,20%,97%)] text-[hsl(320,30%,10%)] overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[hsl(30,20%,97%)/0.9] border-b border-[hsl(280,20%,90%)]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl text-primary">✦</span>
            <span className="font-display text-xl font-bold text-primary">BeautyCRM</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[hsl(280,15%,45%)]">
            <a href="#funcionalidades" className="hover:text-primary transition-colors">Funcionalidades</a>
            <a href="#planos" className="hover:text-primary transition-colors">Planos</a>
            <a href="#depoimentos" className="hover:text-primary transition-colors">Depoimentos</a>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="text-sm font-medium text-primary hover:underline"
            >
              Entrar
            </button>
            <button
              onClick={() => navigate("/login")}
              className="gold-gradient text-sm font-semibold text-[hsl(0,0%,100%)] px-5 py-2.5 rounded-full shadow-lg hover:opacity-90 transition-all"
            >
              Teste Grátis
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img src={salonHero} alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.07]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(30,20%,97%)] via-transparent to-[hsl(30,20%,97%)]" />
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[hsl(35,50%,50%)/0.08] blur-3xl" />
          <div className="absolute -bottom-20 -left-40 w-[500px] h-[500px] rounded-full bg-[hsl(270,40%,55%)/0.06] blur-3xl" />
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[hsl(35,50%,50%)/0.1] border border-[hsl(35,50%,50%)/0.2] text-primary text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            A plataforma nº1 de gestão para salões em Angola
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6"
          >
            Transforme seu salão num{" "}
            <span className="text-primary">império de beleza</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-[hsl(280,15%,45%)] max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Agenda, clientes, financeiro, estoque, comissões — tudo num só lugar.
            O sistema completo que os melhores salões de Angola já usam para faturar mais e trabalhar menos.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => navigate("/login")}
              className="gold-gradient px-8 py-4 rounded-full text-[hsl(0,0%,100%)] font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2"
            >
              Começar Grátis por 3 Dias
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-sm text-[hsl(280,15%,60%)]">
              Sem cartão de crédito • Cancele quando quiser
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
          >
            {[
              { value: "500+", label: "Salões activos" },
              { value: "98%", label: "Satisfação" },
              { value: "3x", label: "Mais produtividade" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-display text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-[hsl(280,15%,55%)] mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="funcionalidades" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} custom={0} className="text-primary font-medium text-sm uppercase tracking-[0.2em] mb-3">
              Funcionalidades
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl md:text-4xl font-bold mb-4">
              Tudo que seu salão precisa, <span className="text-primary">numa só plataforma</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-[hsl(280,15%,45%)] max-w-xl mx-auto">
              Desenvolvido por quem entende de beleza e tecnologia. Cada recurso foi pensado para simplificar sua rotina e maximizar seus resultados.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                custom={i}
                className="group p-6 rounded-2xl border border-[hsl(280,20%,90%)] bg-[hsl(0,0%,100%)] hover:border-primary/40 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="w-6 h-6 text-[hsl(0,0%,100%)]" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-[hsl(280,15%,45%)] leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Banner */}
      <section className="py-12 px-6 gold-gradient">
        <div className="max-w-4xl mx-auto text-center text-[hsl(0,0%,100%)]">
          <p className="font-display text-2xl md:text-3xl font-bold mb-2">
            "Cada dia sem sistema, é dinheiro que escapa pelas suas mãos."
          </p>
          <p className="text-[hsl(0,0%,100%)/0.8] text-sm">
            Junte-se a centenas de profissionais que já transformaram seus negócios.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section id="planos" className="py-20 px-6 bg-[hsl(30,15%,95%)]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} custom={0} className="text-primary font-medium text-sm uppercase tracking-[0.2em] mb-3">
              Planos & Preços
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl md:text-4xl font-bold mb-4">
              Invista no crescimento do seu <span className="text-primary">negócio</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-[hsl(280,15%,45%)] max-w-xl mx-auto">
              Escolha o plano ideal para o tamanho do seu salão. Todos incluem 3 dias grátis.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {plans.map((plan, i) => {
              const isPopular = plan.popular;
              const isPremium = i === 2;
              return (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={fadeUp}
                  custom={i}
                  onMouseEnter={() => setHoveredPlan(i)}
                  onMouseLeave={() => setHoveredPlan(null)}
                  className={`relative rounded-2xl border-2 ${plan.border} p-8 transition-all duration-300 ${
                    isPopular
                      ? "bg-[hsl(0,0%,100%)] shadow-2xl scale-[1.02]"
                      : isPremium
                      ? "bg-[hsl(270,30%,12%)] text-[hsl(0,0%,95%)]"
                      : "bg-[hsl(0,0%,100%)]"
                  } ${hoveredPlan === i ? "shadow-2xl scale-[1.03]" : ""}`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 gold-gradient text-[hsl(0,0%,100%)] text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                      MAIS POPULAR
                    </div>
                  )}

                  <plan.icon className={`w-8 h-8 mb-4 ${isPremium ? "text-[hsl(270,60%,70%)]" : "text-primary"}`} />
                  <h3 className="font-display text-2xl font-bold mb-1">{plan.name}</h3>
                  <p className={`text-sm mb-6 ${isPremium ? "text-[hsl(270,20%,70%)]" : "text-[hsl(280,15%,45%)]"}`}>
                    {plan.description}
                  </p>

                  <div className="mb-6">
                    <span className="font-display text-4xl font-bold">{plan.price}</span>
                    <span className={`text-sm ${isPremium ? "text-[hsl(270,20%,70%)]" : "text-[hsl(280,15%,45%)]"}`}> Kz{plan.period}</span>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feat, fi) => (
                      <li key={fi} className="flex items-start gap-2 text-sm">
                        <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isPremium ? "text-[hsl(270,60%,70%)]" : "text-primary"}`} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Implementação — serviço extra opcional */}
                  <div className={`rounded-xl border border-dashed ${
                    isPremium ? "border-[hsl(270,30%,40%)] bg-[hsl(270,25%,16%)]" : "border-primary/30 bg-primary/5"
                  } p-4 mb-8`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Sparkles className={`w-4 h-4 ${isPremium ? "text-[hsl(270,60%,70%)]" : "text-primary"}`} />
                      <span className={`text-xs font-semibold uppercase tracking-wider ${isPremium ? "text-[hsl(270,40%,75%)]" : "text-primary"}`}>
                        Serviço Extra
                      </span>
                    </div>
                    <p className="font-display text-sm font-bold mb-0.5">Implementação Assistida</p>
                    <p className={`text-xs leading-relaxed ${isPremium ? "text-[hsl(270,15%,65%)]" : "text-[hsl(280,15%,45%)]"}`}>
                      Nossa equipa configura tudo para si — cadastro de serviços, profissionais, preços e formação da sua equipa.
                    </p>
                    <p className={`text-xs mt-2 font-semibold ${isPremium ? "text-[hsl(270,40%,75%)]" : "text-primary/80"}`}>
                      Pagamento único · Consulte valores →
                    </p>
                  </div>

                  <button
                    onClick={() => navigate("/login")}
                    className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                      isPopular
                        ? "gold-gradient text-[hsl(0,0%,100%)] shadow-lg hover:shadow-xl"
                        : isPremium
                        ? "bg-[hsl(270,60%,70%)] text-[hsl(0,0%,100%)] hover:bg-[hsl(270,60%,65%)]"
                        : "border-2 border-primary text-primary hover:bg-primary hover:text-[hsl(0,0%,100%)]"
                    }`}
                  >
                    {plan.cta}
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Nota sobre implementação */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={4}
            className="mt-10 max-w-2xl mx-auto text-center"
          >
            <p className="text-sm text-[hsl(280,15%,45%)] leading-relaxed">
              <strong className="text-foreground">Precisa de ajuda para começar?</strong>{" "}
              O serviço de <span className="text-primary font-medium">Implementação Assistida</span> é opcional e cobrado à parte. A nossa equipa trata de toda a configuração inicial do sistema —
              para que o seu salão comece a funcionar sem preocupações desde o primeiro dia.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="depoimentos" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} custom={0} className="text-primary font-medium text-sm uppercase tracking-[0.2em] mb-3">
              Depoimentos
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl md:text-4xl font-bold">
              Quem usa, <span className="text-primary">recomenda</span>
            </motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                custom={i}
                className="p-6 rounded-2xl border border-[hsl(280,20%,90%)] bg-[hsl(0,0%,100%)]"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, si) => (
                    <Star key={si} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-[hsl(280,15%,35%)] leading-relaxed mb-4 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center text-[hsl(0,0%,100%)] font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-[hsl(280,15%,55%)]">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 relative overflow-hidden">
        <img src={spaSection} alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.06]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(30,20%,97%)] via-[hsl(30,20%,97%)/0.9] to-[hsl(30,20%,97%)]" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 variants={fadeUp} custom={0} className="font-display text-3xl md:text-4xl font-bold mb-4">
              Pronto para elevar o seu salão ao <span className="text-primary">próximo nível</span>?
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-[hsl(280,15%,45%)] mb-8 text-lg">
              Comece agora com 3 dias grátis. Sem compromisso, sem cartão de crédito.
            </motion.p>
            <motion.div variants={fadeUp} custom={2}>
              <button
                onClick={() => navigate("/login")}
                className="gold-gradient px-10 py-4 rounded-full text-[hsl(0,0%,100%)] font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all inline-flex items-center gap-2"
              >
                Criar Minha Conta Grátis
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-[hsl(280,20%,90%)]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl text-primary">✦</span>
            <span className="font-display font-bold text-primary">BeautyCRM</span>
          </div>
          <p className="text-sm text-[hsl(280,15%,55%)]">
            © 2026 BeautyCRM. Todos os direitos reservados. Feito com ❤️ em Angola.
          </p>
        </div>
      </footer>
    </div>
  );
}
