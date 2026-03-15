
-- Movimentações (entradas e saídas)
CREATE TABLE public.movimentacoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  hora TIME NOT NULL DEFAULT CURRENT_TIME,
  descricao TEXT NOT NULL,
  categoria TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'Entrada',
  valor NUMERIC NOT NULL DEFAULT 0,
  forma_pgto TEXT NOT NULL DEFAULT 'Dinheiro',
  registrado_por TEXT NOT NULL DEFAULT '',
  beneficiario_origem TEXT,
  observacoes TEXT,
  referencia TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Contas a Pagar
CREATE TABLE public.contas_pagar (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fornecedor_beneficiario TEXT NOT NULL,
  descricao TEXT NOT NULL,
  categoria TEXT NOT NULL,
  valor NUMERIC NOT NULL DEFAULT 0,
  vencimento DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pendente',
  recorrencia TEXT DEFAULT 'Única',
  data_pagamento DATE,
  forma_pgto TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Contas a Receber (fiados)
CREATE TABLE public.contas_receber (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente TEXT NOT NULL,
  servico TEXT NOT NULL,
  valor_total NUMERIC NOT NULL DEFAULT 0,
  valor_pago NUMERIC NOT NULL DEFAULT 0,
  vencimento DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Em aberto',
  data_servico DATE,
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Histórico de pagamentos de contas a receber
CREATE TABLE public.contas_receber_pagamentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conta_receber_id UUID NOT NULL REFERENCES public.contas_receber(id) ON DELETE CASCADE,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  valor NUMERIC NOT NULL DEFAULT 0,
  forma TEXT NOT NULL DEFAULT 'Dinheiro',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Despesas
CREATE TABLE public.despesas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  descricao TEXT NOT NULL,
  categoria TEXT NOT NULL,
  fornecedor TEXT,
  valor NUMERIC NOT NULL DEFAULT 0,
  forma_pgto TEXT NOT NULL DEFAULT 'Dinheiro',
  comprovante TEXT,
  registrado_por TEXT NOT NULL DEFAULT '',
  recorrencia TEXT NOT NULL DEFAULT 'Única',
  nr_fatura TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Fornecedores
CREATE TABLE public.fornecedores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL,
  contato TEXT NOT NULL,
  nif TEXT,
  saldo_devedor NUMERIC NOT NULL DEFAULT 0,
  ultima_compra TEXT DEFAULT '—',
  email TEXT,
  endereco TEXT,
  nome_contato TEXT,
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Histórico de compras de fornecedores
CREATE TABLE public.fornecedor_compras (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fornecedor_id UUID NOT NULL REFERENCES public.fornecedores(id) ON DELETE CASCADE,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  descricao TEXT NOT NULL,
  valor NUMERIC NOT NULL DEFAULT 0,
  pago NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Configuração de salários
CREATE TABLE public.salarios_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profissional TEXT NOT NULL,
  profissional_id UUID REFERENCES public.profissionais(id) ON DELETE SET NULL,
  tipo TEXT NOT NULL DEFAULT 'Fixo',
  fixo NUMERIC NOT NULL DEFAULT 0,
  comissao_pct NUMERIC NOT NULL DEFAULT 0,
  atendimentos_mes INTEGER NOT NULL DEFAULT 0,
  receita_gerada_mes NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Adiantamentos
CREATE TABLE public.adiantamentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  profissional TEXT NOT NULL,
  valor_solicitado NUMERIC NOT NULL DEFAULT 0,
  valor_aprovado NUMERIC NOT NULL DEFAULT 0,
  aprovado_por TEXT NOT NULL DEFAULT '',
  mes_desconto TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pendente aprovação',
  motivo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Produtos vendidos
CREATE TABLE public.produtos_vendidos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL,
  unidades INTEGER NOT NULL DEFAULT 0,
  preco NUMERIC NOT NULL DEFAULT 0,
  custo NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Fechamentos de caixa
CREATE TABLE public.fechamentos_caixa (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  fechado BOOLEAN NOT NULL DEFAULT false,
  fechado_por TEXT,
  hora_fechamento TEXT,
  descontos NUMERIC NOT NULL DEFAULT 0,
  receita_produtos NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.movimentacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contas_pagar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contas_receber ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contas_receber_pagamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.despesas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fornecedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fornecedor_compras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salarios_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adiantamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos_vendidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fechamentos_caixa ENABLE ROW LEVEL SECURITY;

-- RLS policies for authenticated users (financeiro/admin roles)
CREATE POLICY "Auth users can view movimentacoes" ON public.movimentacoes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can insert movimentacoes" ON public.movimentacoes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update movimentacoes" ON public.movimentacoes FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can delete movimentacoes" ON public.movimentacoes FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth users can view contas_pagar" ON public.contas_pagar FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can insert contas_pagar" ON public.contas_pagar FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update contas_pagar" ON public.contas_pagar FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can delete contas_pagar" ON public.contas_pagar FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth users can view contas_receber" ON public.contas_receber FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can insert contas_receber" ON public.contas_receber FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update contas_receber" ON public.contas_receber FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can delete contas_receber" ON public.contas_receber FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth users can view contas_receber_pagamentos" ON public.contas_receber_pagamentos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can insert contas_receber_pagamentos" ON public.contas_receber_pagamentos FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Auth users can view despesas" ON public.despesas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can insert despesas" ON public.despesas FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update despesas" ON public.despesas FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can delete despesas" ON public.despesas FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth users can view fornecedores" ON public.fornecedores FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can insert fornecedores" ON public.fornecedores FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update fornecedores" ON public.fornecedores FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can delete fornecedores" ON public.fornecedores FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth users can view fornecedor_compras" ON public.fornecedor_compras FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can insert fornecedor_compras" ON public.fornecedor_compras FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Auth users can view salarios_config" ON public.salarios_config FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can insert salarios_config" ON public.salarios_config FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update salarios_config" ON public.salarios_config FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can delete salarios_config" ON public.salarios_config FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth users can view adiantamentos" ON public.adiantamentos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can insert adiantamentos" ON public.adiantamentos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update adiantamentos" ON public.adiantamentos FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can delete adiantamentos" ON public.adiantamentos FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth users can view produtos_vendidos" ON public.produtos_vendidos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can insert produtos_vendidos" ON public.produtos_vendidos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update produtos_vendidos" ON public.produtos_vendidos FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can delete produtos_vendidos" ON public.produtos_vendidos FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth users can view fechamentos_caixa" ON public.fechamentos_caixa FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can insert fechamentos_caixa" ON public.fechamentos_caixa FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update fechamentos_caixa" ON public.fechamentos_caixa FOR UPDATE TO authenticated USING (true);
