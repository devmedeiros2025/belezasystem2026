
-- Create estabelecimentos (establishments/businesses) table
CREATE TABLE public.estabelecimentos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  slug text NOT NULL UNIQUE,
  logo_url text,
  cor_primaria text DEFAULT '#b8894a',
  plano text NOT NULL DEFAULT 'basico',
  ativo boolean NOT NULL DEFAULT true,
  owner_user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Link profiles to establishments
ALTER TABLE public.profiles ADD COLUMN estabelecimento_id uuid REFERENCES public.estabelecimentos(id);

-- Enable RLS
ALTER TABLE public.estabelecimentos ENABLE ROW LEVEL SECURITY;

-- Policies: authenticated users can view their own establishment
CREATE POLICY "Users can view own establishment" ON public.estabelecimentos
  FOR SELECT TO authenticated
  USING (id IN (SELECT estabelecimento_id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Owner can update establishment" ON public.estabelecimentos
  FOR UPDATE TO authenticated
  USING (owner_user_id = auth.uid());

CREATE POLICY "Authenticated can insert establishment" ON public.estabelecimentos
  FOR INSERT TO authenticated
  WITH CHECK (owner_user_id = auth.uid());

-- Trigger for updated_at
CREATE TRIGGER update_estabelecimentos_updated_at
  BEFORE UPDATE ON public.estabelecimentos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
