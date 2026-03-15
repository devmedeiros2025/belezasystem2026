export type TarefaStatus = "afazer" | "fazendo" | "feito" | "aguardando" | "concluido";

export interface Tarefa {
  id: number;
  titulo: string;
  descricao: string;
  responsavelId: number;
  responsavelNome: string;
  criadoPorId: number;
  criadoPorNome: string;
  status: TarefaStatus;
  dataInicio: string;
  horaInicio: string;
  dataConclusao: string;
  horaConclusao: string;
  observacoes: string;
}

export const tarefasMock: Tarefa[] = [
  {
    id: 1,
    titulo: "Organizar estoque de coloração",
    descricao: "Verificar validades e reorganizar prateleira de coloração Wella e L'Oréal",
    responsavelId: 2,
    responsavelNome: "Rodrigo Alves",
    criadoPorId: 1,
    criadoPorNome: "Élise Monteiro",
    status: "fazendo",
    dataInicio: "2026-03-08",
    horaInicio: "09:00",
    dataConclusao: "2026-03-08",
    horaConclusao: "12:00",
    observacoes: "Priorizar produtos com validade próxima",
  },
  {
    id: 2,
    titulo: "Confirmar agendamentos de amanhã",
    descricao: "Entrar em contato com todos os clientes agendados para amanhã via WhatsApp",
    responsavelId: 3,
    responsavelNome: "Patrícia Nunes",
    criadoPorId: 1,
    criadoPorNome: "Élise Monteiro",
    status: "fazendo",
    dataInicio: "2026-03-08",
    horaInicio: "14:00",
    dataConclusao: "2026-03-08",
    horaConclusao: "16:00",
    observacoes: "",
  },
  {
    id: 3,
    titulo: "Atualizar preços do catálogo",
    descricao: "Atualizar tabela de preços dos serviços de cabelo conforme novo fornecedor",
    responsavelId: 4,
    responsavelNome: "Carlos Menezes",
    criadoPorId: 1,
    criadoPorNome: "Élise Monteiro",
    status: "feito",
    dataInicio: "2026-03-07",
    horaInicio: "10:00",
    dataConclusao: "2026-03-07",
    horaConclusao: "11:30",
    observacoes: "Aguardando aprovação da Élise para publicar",
  },
  {
    id: 4,
    titulo: "Limpar e esterilizar equipamentos",
    descricao: "Realizar limpeza profunda de todos os equipamentos do salão",
    responsavelId: 2,
    responsavelNome: "Rodrigo Alves",
    criadoPorId: 1,
    criadoPorNome: "Élise Monteiro",
    status: "aguardando",
    dataInicio: "2026-03-07",
    horaInicio: "17:00",
    dataConclusao: "2026-03-07",
    horaConclusao: "18:00",
    observacoes: "Fotos enviadas para aprovação",
  },
  {
    id: 5,
    titulo: "Fazer pedido de toalhas descartáveis",
    descricao: "Encomendar 5 pacotes de toalhas descartáveis — estoque crítico",
    responsavelId: 4,
    responsavelNome: "Carlos Menezes",
    criadoPorId: 1,
    criadoPorNome: "Élise Monteiro",
    status: "concluido",
    dataInicio: "2026-03-06",
    horaInicio: "09:00",
    dataConclusao: "2026-03-06",
    horaConclusao: "10:00",
    observacoes: "Pedido realizado. NF #4521",
  },
  {
    id: 6,
    titulo: "Preparar relatório semanal",
    descricao: "Compilar dados de atendimentos, receita e avaliações da semana",
    responsavelId: 4,
    responsavelNome: "Carlos Menezes",
    criadoPorId: 1,
    criadoPorNome: "Élise Monteiro",
    status: "concluido",
    dataInicio: "2026-03-05",
    horaInicio: "15:00",
    dataConclusao: "2026-03-05",
    horaConclusao: "17:00",
    observacoes: "Relatório entregue por e-mail",
  },
];
