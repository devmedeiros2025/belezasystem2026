export const clientes = [
  { id: 1, nome: "Ana Paula Souza", telefone: "(21) 99999-1111", email: "ana@email.com", ultimoServico: "Coloração", ultimaVisita: "28 Fev", totalGasto: 1840, visitas: 18, status: "VIP" as const, aniversario: "15 Mar", pontos: 1840, avatar: "AP" },
  { id: 2, nome: "Mariana Ferreira", telefone: "(21) 99999-2222", email: "mariana@email.com", ultimoServico: "Progressiva", ultimaVisita: "1 Mar", totalGasto: 2310, visitas: 24, status: "VIP" as const, aniversario: "22 Jun", pontos: 2310, avatar: "MF" },
  { id: 3, nome: "Júlia Alves Costa", telefone: "(21) 99999-3333", email: "julia@email.com", ultimoServico: "Escova", ultimaVisita: "3 Mar", totalGasto: 970, visitas: 9, status: "Ativo" as const, aniversario: "8 Nov", pontos: 970, avatar: "JA" },
  { id: 4, nome: "Fernanda Ribeiro", telefone: "(21) 99999-4444", email: "fernanda@email.com", ultimoServico: "Hidratação", ultimaVisita: "3 Mar", totalGasto: 1560, visitas: 14, status: "Ativo" as const, aniversario: "3 Abr", pontos: 1560, avatar: "FR" },
  { id: 5, nome: "Camila Wanderley", telefone: "(21) 99999-5555", email: "camila@email.com", ultimoServico: "Escova", ultimaVisita: "4 Mar", totalGasto: 2090, visitas: 21, status: "VIP" as const, aniversario: "19 Set", pontos: 2090, avatar: "CW" },
  { id: 6, nome: "Beatriz Martins", telefone: "(21) 99999-6666", email: "beatriz@email.com", ultimoServico: "Manicure", ultimaVisita: "10 Fev", totalGasto: 430, visitas: 4, status: "Em risco" as const, aniversario: "7 Jul", pontos: 430, avatar: "BM" },
  { id: 7, nome: "Sofia Karinne", telefone: "(21) 99999-7777", email: "sofia@email.com", ultimoServico: "Botox Capilar", ultimaVisita: "5 Mar", totalGasto: 780, visitas: 6, status: "Ativo" as const, aniversario: "14 Dez", pontos: 780, avatar: "SK" },
];

export const profissionais = [
  { id: 1, nome: "Élise Monteiro", cargo: "Colorista Sênior", emoji: "💆", foto: "", receita: 7200, atendimentos: 62, avaliacao: 4.9, servicos: ["Coloração", "Progressiva", "Hidratação"], status: "Disponível" as const, cor: "gold" },
  { id: 2, nome: "Rodrigo Alves", cargo: "Barbeiro / Estilista", emoji: "✂️", foto: "", receita: 4850, atendimentos: 78, avaliacao: 4.8, servicos: ["Corte Masculino", "Corte Feminino", "Escova"], status: "Em atendimento" as const, cor: "teal" },
  { id: 3, nome: "Camile Torres", cargo: "Manicure / Nail Designer", emoji: "💅", foto: "", receita: 3120, atendimentos: 94, avaliacao: 5.0, servicos: ["Manicure + Pedicure", "Nail Art"], status: "Disponível" as const, cor: "rose" },
  { id: 4, nome: "Patrícia Nunes", cargo: "Esteticista", emoji: "🌿", foto: "", receita: 3250, atendimentos: 41, avaliacao: 4.7, servicos: ["Limpeza de Pele", "Hidratação Facial"], status: "Folga" as const, cor: "purple" },
];

export const servicos = [
  { id: 1, nome: "Coloração", categoria: "Cabelo", duracao: 120, preco: 180, contagem: 142, ativo: true },
  { id: 2, nome: "Corte Feminino", categoria: "Cabelo", duracao: 45, preco: 80, contagem: 121, ativo: true },
  { id: 3, nome: "Progressiva / Botox", categoria: "Cabelo", duracao: 150, preco: 220, contagem: 88, ativo: true },
  { id: 4, nome: "Escova Modeladora", categoria: "Cabelo", duracao: 50, preco: 70, contagem: 75, ativo: true },
  { id: 5, nome: "Manicure + Pedicure", categoria: "Unhas", duracao: 90, preco: 60, contagem: 68, ativo: true },
  { id: 6, nome: "Corte Masculino", categoria: "Barba", duracao: 30, preco: 45, contagem: 55, ativo: true },
  { id: 7, nome: "Hidratação Capilar", categoria: "Cabelo", duracao: 60, preco: 90, contagem: 47, ativo: true },
  { id: 8, nome: "Limpeza de Pele", categoria: "Estética", duracao: 60, preco: 120, contagem: 34, ativo: true },
  { id: 9, nome: "Nail Art", categoria: "Unhas", duracao: 120, preco: 95, contagem: 28, ativo: true },
  { id: 10, nome: "Massagem Relaxante", categoria: "Spa & Bem-estar", duracao: 60, preco: 150, contagem: 22, ativo: true },
];

export const agendamentos = [
  { id: 1, clienteId: 1, clienteNome: "Ana Paula", servico: "Coloração", profissionalId: 1, profissional: "Élise", dia: "Seg", hora: "09:00", duracao: 120, status: "Confirmado" as const, cor: "gold", canal: "WhatsApp" as const },
  { id: 2, clienteId: 3, clienteNome: "Júlia", servico: "Escova", profissionalId: 2, profissional: "Rodrigo", dia: "Seg", hora: "10:00", duracao: 50, status: "Confirmado" as const, cor: "teal", canal: "Instagram" as const },
  { id: 3, clienteId: 5, clienteNome: "Camila", servico: "Manicure", profissionalId: 3, profissional: "Camile", dia: "Seg", hora: "14:00", duracao: 90, status: "Pendente" as const, cor: "rose", canal: "Telefone" as const },
  { id: 4, clienteId: 2, clienteNome: "Mariana", servico: "Progressiva", profissionalId: 1, profissional: "Élise", dia: "Ter", hora: "09:00", duracao: 150, status: "Confirmado" as const, cor: "gold", canal: "WhatsApp" as const },
  { id: 5, clienteId: 4, clienteNome: "Fernanda", servico: "Hidratação", profissionalId: 4, profissional: "Patrícia", dia: "Ter", hora: "11:00", duracao: 60, status: "Confirmado" as const, cor: "purple", canal: "Walk-in" as const },
  { id: 6, clienteId: 7, clienteNome: "Sofia", servico: "Botox Capilar", profissionalId: 1, profissional: "Élise", dia: "Qua", hora: "09:00", duracao: 150, status: "Pendente" as const, cor: "gold", canal: "Instagram" as const },
  { id: 7, clienteId: 6, clienteNome: "Beatriz", servico: "Manicure", profissionalId: 3, profissional: "Camile", dia: "Qua", hora: "14:00", duracao: 90, status: "Confirmado" as const, cor: "rose", canal: "App" as const },
  { id: 8, clienteId: 1, clienteNome: "Ana Paula", servico: "Escova", profissionalId: 2, profissional: "Rodrigo", dia: "Qui", hora: "10:00", duracao: 50, status: "Confirmado" as const, cor: "teal", canal: "WhatsApp" as const },
  { id: 9, clienteId: 5, clienteNome: "Camila", servico: "Corte Feminino", profissionalId: 2, profissional: "Rodrigo", dia: "Qui", hora: "15:00", duracao: 45, status: "Pendente" as const, cor: "teal", canal: "Telefone" as const },
  { id: 10, clienteId: 3, clienteNome: "Júlia", servico: "Hidratação", profissionalId: 4, profissional: "Patrícia", dia: "Sex", hora: "09:00", duracao: 60, status: "Confirmado" as const, cor: "purple", canal: "Walk-in" as const },
];

export const mensagens = [
  { id: 1, clienteId: 1, nome: "Ana Paula Souza", avatar: "AP", canal: "WhatsApp" as const, preview: "Confirmo meu horário de amanhã!", hora: "10:32", naoLido: false, mensagens: [
    { id: 1, tipo: "recebida" as const, texto: "Oi, tudo bem? Gostaria de confirmar meu horário de amanhã", hora: "10:30" },
    { id: 2, tipo: "enviada" as const, texto: "Olá Ana! Sim, está tudo confirmado para amanhã às 09h. Coloração com a Élise 💛", hora: "10:31" },
    { id: 3, tipo: "recebida" as const, texto: "Confirmo meu horário de amanhã!", hora: "10:32" },
  ]},
  { id: 2, clienteId: 2, nome: "Mariana Ferreira", avatar: "MF", canal: "WhatsApp" as const, preview: "Preciso remarcar para sexta...", hora: "09:15", naoLido: true, mensagens: [
    { id: 1, tipo: "recebida" as const, texto: "Bom dia! Preciso remarcar meu horário de terça para sexta, é possível?", hora: "09:15" },
  ]},
  { id: 3, clienteId: 4, nome: "Fernanda Ribeiro", avatar: "FR", canal: "Instagram" as const, preview: "Vocês fazem progressiva?", hora: "Ontem", naoLido: true, mensagens: [
    { id: 1, tipo: "recebida" as const, texto: "Oi! Vi vocês pelo Instagram. Vocês fazem progressiva?", hora: "Ontem 18:00" },
    { id: 2, tipo: "enviada" as const, texto: "Olá Fernanda! Sim, fazemos! Temos progressiva e botox capilar. Quer agendar?", hora: "Ontem 18:30" },
    { id: 3, tipo: "recebida" as const, texto: "Vocês fazem progressiva?", hora: "Ontem 19:00" },
  ]},
  { id: 4, clienteId: 6, nome: "Beatriz Martins", avatar: "BM", canal: "SMS" as const, preview: "🤖 Lembrete automático enviado", hora: "Ontem", naoLido: false, mensagens: [
    { id: 1, tipo: "enviada" as const, texto: "🤖 Olá Beatriz! Sentimos sua falta. Que tal agendar um horário esta semana? Temos novidades! 💅", hora: "Ontem 10:00", auto: true },
  ]},
  { id: 5, clienteId: 7, nome: "Sofia Karinne", avatar: "SK", canal: "WhatsApp" as const, preview: "Obrigada pelo atendimento!", hora: "5 Mar", naoLido: false, mensagens: [
    { id: 1, tipo: "enviada" as const, texto: "Obrigada pela visita, Sofia! Avalie seu atendimento 🌟", hora: "5 Mar 17:00", auto: true },
    { id: 2, tipo: "recebida" as const, texto: "Obrigada pelo atendimento! Amei o resultado 😍", hora: "5 Mar 17:30" },
  ]},
];

export const avaliacoes = [
  { id: 1, clienteId: 1, nome: "Ana Paula Souza", avatar: "AP", nota: 5, servico: "Coloração", profissional: "Élise Monteiro", comentario: "Amei a cor! Élise é maravilhosa, super atenciosa. Recomendo demais!", data: "28 Fev" },
  { id: 2, clienteId: 5, nome: "Camila Wanderley", avatar: "CW", nota: 5, servico: "Escova Modeladora", profissional: "Rodrigo Alves", comentario: "Ficou perfeita! Durou o dia inteiro.", data: "4 Mar" },
  { id: 3, clienteId: 3, nome: "Júlia Alves Costa", avatar: "JA", nota: 4, servico: "Escova", profissional: "Rodrigo Alves", comentario: "Muito bom, mas esperei um pouquinho.", data: "3 Mar" },
  { id: 4, clienteId: 7, nome: "Sofia Karinne", avatar: "SK", nota: 5, servico: "Botox Capilar", profissional: "Élise Monteiro", comentario: "Resultado incrível! Cabelo super macio e brilhante.", data: "5 Mar" },
  { id: 5, clienteId: 4, nome: "Fernanda Ribeiro", avatar: "FR", nota: 5, servico: "Hidratação", profissional: "Patrícia Nunes", comentario: "Patrícia é sensacional, cuidou muito bem do meu cabelo.", data: "3 Mar" },
  { id: 6, clienteId: 2, nome: "Mariana Ferreira", avatar: "MF", nota: 4, servico: "Progressiva", profissional: "Élise Monteiro", comentario: "Ótimo resultado, só achei o tempo de espera longo.", data: "1 Mar" },
];

export const estoque = [
  { id: 1, produto: "Coloração Wella Koleston", categoria: "Coloração", estoqueAtual: 12, minimo: 5, custoUnit: 45, fornecedor: "Wella Brasil", status: "Normal" as const },
  { id: 2, produto: "Água Oxigenada 30 vol", categoria: "Químicos", estoqueAtual: 8, minimo: 10, custoUnit: 18, fornecedor: "Wella Brasil", status: "Baixo" as const },
  { id: 3, produto: "Shampoo L'Oréal Expert", categoria: "Lavagem", estoqueAtual: 2, minimo: 5, custoUnit: 65, fornecedor: "L'Oréal Pro", status: "Crítico" as const },
  { id: 4, produto: "Máscara Hidratação Kérastase", categoria: "Tratamento", estoqueAtual: 6, minimo: 3, custoUnit: 120, fornecedor: "Kérastase BR", status: "Normal" as const },
  { id: 5, produto: "Esmalte Risqué (kit 20 cores)", categoria: "Unhas", estoqueAtual: 3, minimo: 2, custoUnit: 8, fornecedor: "Risqué", status: "Normal" as const },
  { id: 6, produto: "Toalha Descartável (pct 100)", categoria: "Descartáveis", estoqueAtual: 1, minimo: 3, custoUnit: 35, fornecedor: "DescartBR", status: "Crítico" as const },
  { id: 7, produto: "Creme Alisante", categoria: "Químicos", estoqueAtual: 4, minimo: 3, custoUnit: 55, fornecedor: "Cadiveu", status: "Normal" as const },
];

export const receitaSemanal = [
  { semana: "Sem 1", valor: 3800, meta: 4000 },
  { semana: "Sem 2", valor: 4200, meta: 4000 },
  { semana: "Sem 3", valor: 4900, meta: 4000 },
  { semana: "Sem 4", valor: 5520, meta: 4000 },
];

export const receitaMensal = [
  { mes: "Out", receita: 14200, despesas: 8100, lucro: 6100 },
  { mes: "Nov", receita: 15800, despesas: 8500, lucro: 7300 },
  { mes: "Dez", receita: 19200, despesas: 9800, lucro: 9400 },
  { mes: "Jan", receita: 13500, despesas: 7900, lucro: 5600 },
  { mes: "Fev", receita: 16400, despesas: 8200, lucro: 8200 },
  { mes: "Mar", receita: 18420, despesas: 8900, lucro: 9520 },
];

export const extrato = [
  { id: 1, data: "5 Mar", cliente: "Sofia Karinne", servico: "Botox Capilar", profissional: "Élise", valor: 220, pagamento: "PIX" as const, status: "Pago" as const },
  { id: 2, data: "4 Mar", cliente: "Camila Wanderley", servico: "Escova", profissional: "Rodrigo", valor: 70, pagamento: "Crédito" as const, status: "Pago" as const },
  { id: 3, data: "3 Mar", cliente: "Júlia Alves", servico: "Escova", profissional: "Rodrigo", valor: 70, pagamento: "Débito" as const, status: "Pago" as const },
  { id: 4, data: "3 Mar", cliente: "Fernanda Ribeiro", servico: "Hidratação", profissional: "Patrícia", valor: 90, pagamento: "PIX" as const, status: "Pago" as const },
  { id: 5, data: "1 Mar", cliente: "Mariana Ferreira", servico: "Progressiva", profissional: "Élise", valor: 220, pagamento: "Dinheiro" as const, status: "Pago" as const },
  { id: 6, data: "28 Fev", cliente: "Ana Paula Souza", servico: "Coloração", profissional: "Élise", valor: 180, pagamento: "Crédito" as const, status: "Pago" as const },
];

export type ClienteStatus = "VIP" | "Ativo" | "Em risco" | "Inativo";
