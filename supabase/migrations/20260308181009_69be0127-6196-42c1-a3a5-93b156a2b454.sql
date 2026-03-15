
-- Timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ========== CLIENTES ==========
CREATE TABLE public.clientes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_completo TEXT NOT NULL,
  genero TEXT,
  profissao TEXT,
  data_nascimento DATE,
  bi TEXT,
  email TEXT,
  telefone TEXT,
  observacoes TEXT,
  total_gasto NUMERIC DEFAULT 0,
  visitas INTEGER DEFAULT 0,
  pontos INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Ativo',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view clientes" ON public.clientes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert clientes" ON public.clientes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update clientes" ON public.clientes FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete clientes" ON public.clientes FOR DELETE TO authenticated USING (true);
CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON public.clientes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ========== SERVICOS ==========
CREATE TABLE public.servicos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL,
  duracao INTEGER NOT NULL,
  preco NUMERIC NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.servicos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view servicos" ON public.servicos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert servicos" ON public.servicos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update servicos" ON public.servicos FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete servicos" ON public.servicos FOR DELETE TO authenticated USING (true);
CREATE TRIGGER update_servicos_updated_at BEFORE UPDATE ON public.servicos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ========== PROFISSIONAIS ==========
CREATE TABLE public.profissionais (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  cargo TEXT,
  foto_url TEXT,
  emoji TEXT,
  cor TEXT,
  servicos TEXT[],
  status TEXT NOT NULL DEFAULT 'Disponível',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profissionais ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view profissionais" ON public.profissionais FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert profissionais" ON public.profissionais FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update profissionais" ON public.profissionais FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete profissionais" ON public.profissionais FOR DELETE TO authenticated USING (true);
CREATE TRIGGER update_profissionais_updated_at BEFORE UPDATE ON public.profissionais FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ========== AGENDAMENTOS ==========
CREATE TABLE public.agendamentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
  cliente_nome TEXT NOT NULL,
  servico TEXT NOT NULL,
  profissional_id UUID REFERENCES public.profissionais(id) ON DELETE SET NULL,
  profissional_nome TEXT NOT NULL,
  data DATE NOT NULL,
  hora TIME NOT NULL,
  duracao INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pendente',
  canal TEXT DEFAULT 'Walk-in',
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view agendamentos" ON public.agendamentos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert agendamentos" ON public.agendamentos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update agendamentos" ON public.agendamentos FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete agendamentos" ON public.agendamentos FOR DELETE TO authenticated USING (true);
CREATE TRIGGER update_agendamentos_updated_at BEFORE UPDATE ON public.agendamentos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for professional photos
INSERT INTO storage.buckets (id, name, public) VALUES ('fotos', 'fotos', true);
CREATE POLICY "Anyone can view fotos" ON storage.objects FOR SELECT USING (bucket_id = 'fotos');
CREATE POLICY "Authenticated users can upload fotos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'fotos');
CREATE POLICY "Authenticated users can update fotos" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'fotos');
CREATE POLICY "Authenticated users can delete fotos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'fotos');
