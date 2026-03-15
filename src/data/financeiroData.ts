// ===== TYPES RE-EXPORTED FROM HOOK =====
export type {
  Movimentacao,
  ContaPagar,
  ContaReceber,
  Despesa,
  Fornecedor,
  SalarioConfig,
  Adiantamento,
  ProdutoVendido,
  FechamentoCaixa,
} from "@/hooks/useFinanceiroData";

// ===== CATEGORIAS DE DESPESAS (with icons) =====
export const categoriasDespesa = [
  { key: "Aluguel", label: "Aluguel", icon: "🏠" },
  { key: "Utilidades", label: "Utilidades", icon: "💡" },
  { key: "Produtos/Insumos", label: "Produtos/Insumos", icon: "🛒" },
  { key: "Manutenção", label: "Manutenção", icon: "🔧" },
  { key: "Marketing", label: "Marketing", icon: "📱" },
  { key: "Transporte", label: "Transporte", icon: "🚗" },
  { key: "Administrativo", label: "Administrativo", icon: "📋" },
  { key: "Outras", label: "Outras", icon: "➕" },
];

// ===== STATIC CHART DATA (historical trends - will be computed from DB later) =====
export const receitaDespesasMensal = [
  { mes: "Out", receita: 420000, despesas: 285000, lucro: 135000 },
  { mes: "Nov", receita: 445000, despesas: 310000, lucro: 135000 },
  { mes: "Dez", receita: 520000, despesas: 340000, lucro: 180000 },
  { mes: "Jan", receita: 380000, despesas: 290000, lucro: 90000 },
  { mes: "Fev", receita: 456000, despesas: 318000, lucro: 138000 },
  { mes: "Mar", receita: 468000, despesas: 385500, lucro: 82500 },
];

export const formaPagamentoData = [
  { name: "Dinheiro", value: 45000 },
  { name: "Transferência", value: 87500 },
  { name: "TPA (cartão)", value: 32000 },
];

export const fluxoCaixaDiario = [
  { dia: "01", entradas: 16000, saidas: 8500 },
  { dia: "02", entradas: 4500, saidas: 5500 },
  { dia: "03", entradas: 14000, saidas: 20000 },
  { dia: "04", entradas: 40000, saidas: 125000 },
  { dia: "05", entradas: 22000, saidas: 3000 },
  { dia: "06", entradas: 18000, saidas: 4500 },
  { dia: "07", entradas: 15000, saidas: 2000 },
];

export const topServicosReceita = [
  { nome: "Coloração", receita: 142000 },
  { nome: "Progressiva / Botox", receita: 98000 },
  { nome: "Corte Feminino", receita: 68000 },
  { nome: "Manicure + Pedicure", receita: 48000 },
  { nome: "Hidratação Capilar", receita: 42000 },
];

export const dreData = {
  servicosPrestados: 420000,
  vendaProdutos: 48000,
  descontosConcedidos: 12000,
  despesasOperacionais: {
    aluguel: 80000,
    aguaEnergia: 18000,
    internetTelefone: 8500,
    marketing: 15000,
    manutencao: 6000,
    outros: 11000,
  },
  despesasPessoal: {
    salarios: 140000,
    comissoes: 87000,
    adiantamentos: 20000,
  },
  compraFornecedores: 32000,
};

export const despesasMensalTrend = [
  { mes: "Out", total: 245000, aluguel: 80000, produtos: 52000, utilidades: 18000, marketing: 12000, outros: 83000 },
  { mes: "Nov", total: 268000, aluguel: 80000, produtos: 61000, utilidades: 19000, marketing: 14000, outros: 94000 },
  { mes: "Dez", total: 312000, aluguel: 80000, produtos: 78000, utilidades: 21000, marketing: 25000, outros: 108000 },
  { mes: "Jan", total: 285000, aluguel: 80000, produtos: 65000, utilidades: 20000, marketing: 15000, outros: 105000 },
  { mes: "Fev", total: 298000, aluguel: 80000, produtos: 70000, utilidades: 19500, marketing: 18000, outros: 110500 },
  { mes: "Mar", total: 385500, aluguel: 80000, produtos: 95000, utilidades: 22000, marketing: 15000, outros: 173500 },
];

export const contasPagarMensalTrend = [
  { mes: "Out", total: 195000, pagas: 180000, vencidas: 8000, pendentes: 7000 },
  { mes: "Nov", total: 210000, pagas: 195000, vencidas: 5000, pendentes: 10000 },
  { mes: "Dez", total: 240000, pagas: 220000, vencidas: 12000, pendentes: 8000 },
  { mes: "Jan", total: 185000, pagas: 170000, vencidas: 6000, pendentes: 9000 },
  { mes: "Fev", total: 215000, pagas: 200000, vencidas: 10000, pendentes: 5000 },
  { mes: "Mar", total: 280500, pagas: 80000, vencidas: 8500, pendentes: 192000 },
];
