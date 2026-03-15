
-- Estoque table
CREATE TABLE public.estoque (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  produto text NOT NULL,
  categoria text NOT NULL,
  estoque_atual integer NOT NULL DEFAULT 0,
  minimo integer NOT NULL DEFAULT 5,
  custo_unit numeric NOT NULL DEFAULT 0,
  fornecedor text,
  validade date,
  nota_fiscal text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.estoque ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Auth users can view estoque" ON public.estoque FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can insert estoque" ON public.estoque FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update estoque" ON public.estoque FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can delete estoque" ON public.estoque FOR DELETE TO authenticated USING (true);

-- Movimentações de estoque (log de entradas/saídas)
CREATE TABLE public.estoque_movimentacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  estoque_id uuid NOT NULL REFERENCES public.estoque(id) ON DELETE CASCADE,
  tipo text NOT NULL DEFAULT 'Entrada',
  quantidade integer NOT NULL DEFAULT 0,
  custo_unit numeric,
  fornecedor text,
  nota_fiscal text,
  registrado_por text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.estoque_movimentacoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Auth users can view estoque_mov" ON public.estoque_movimentacoes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can insert estoque_mov" ON public.estoque_movimentacoes FOR INSERT TO authenticated WITH CHECK (true);
