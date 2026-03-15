
-- 20260316000000_multi_tenancy_core.sql
-- Adiciona isolamento por estabelecimento (Multi-tenancy) em todas as tabelas

-- 1. Adicionar coluna estabelecimento_id em todas as tabelas transacionais
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS estabelecimento_id UUID REFERENCES public.estabelecimentos(id) ON DELETE CASCADE;
ALTER TABLE public.servicos ADD COLUMN IF NOT EXISTS estabelecimento_id UUID REFERENCES public.estabelecimentos(id) ON DELETE CASCADE;
ALTER TABLE public.profissionais ADD COLUMN IF NOT EXISTS estabelecimento_id UUID REFERENCES public.estabelecimentos(id) ON DELETE CASCADE;
ALTER TABLE public.agendamentos ADD COLUMN IF NOT EXISTS estabelecimento_id UUID REFERENCES public.estabelecimentos(id) ON DELETE CASCADE;
ALTER TABLE public.movimentacoes ADD COLUMN IF NOT EXISTS estabelecimento_id UUID REFERENCES public.estabelecimentos(id) ON DELETE CASCADE;
ALTER TABLE public.contas_pagar ADD COLUMN IF NOT EXISTS estabelecimento_id UUID REFERENCES public.estabelecimentos(id) ON DELETE CASCADE;
ALTER TABLE public.contas_receber ADD COLUMN IF NOT EXISTS estabelecimento_id UUID REFERENCES public.estabelecimentos(id) ON DELETE CASCADE;
ALTER TABLE public.despesas ADD COLUMN IF NOT EXISTS estabelecimento_id UUID REFERENCES public.estabelecimentos(id) ON DELETE CASCADE;
ALTER TABLE public.fornecedores ADD COLUMN IF NOT EXISTS estabelecimento_id UUID REFERENCES public.estabelecimentos(id) ON DELETE CASCADE;
ALTER TABLE public.salarios_config ADD COLUMN IF NOT EXISTS estabelecimento_id UUID REFERENCES public.estabelecimentos(id) ON DELETE CASCADE;
ALTER TABLE public.adiantamentos ADD COLUMN IF NOT EXISTS estabelecimento_id UUID REFERENCES public.estabelecimentos(id) ON DELETE CASCADE;
ALTER TABLE public.produtos_vendidos ADD COLUMN IF NOT EXISTS estabelecimento_id UUID REFERENCES public.estabelecimentos(id) ON DELETE CASCADE;
ALTER TABLE public.fechamentos_caixa ADD COLUMN IF NOT EXISTS estabelecimento_id UUID REFERENCES public.estabelecimentos(id) ON DELETE CASCADE;
ALTER TABLE public.estoque ADD COLUMN IF NOT EXISTS estabelecimento_id UUID REFERENCES public.estabelecimentos(id) ON DELETE CASCADE;
ALTER TABLE public.estoque_movimentacoes ADD COLUMN IF NOT EXISTS estabelecimento_id UUID REFERENCES public.estabelecimentos(id) ON DELETE CASCADE;

-- 2. Índices para performance
CREATE INDEX IF NOT EXISTS idx_clientes_estabelecimento ON public.clientes(estabelecimento_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_estabelecimento ON public.agendamentos(estabelecimento_id);
CREATE INDEX IF NOT EXISTS idx_movimentacoes_estabelecimento ON public.movimentacoes(estabelecimento_id);
CREATE INDEX IF NOT EXISTS idx_profissionais_estabelecimento ON public.profissionais(estabelecimento_id);

-- 3. Resetar e criar novas políticas de RLS baseadas no estabelecimento
-- Nota: SuperAdmin continua tendo acesso via regra de JWT ou função bypass (has_role)

DO $$ 
DECLARE 
    t TEXT;
BEGIN 
    FOR t IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN (
            'clientes', 'servicos', 'profissionais', 'agendamentos', 
            'movimentacoes', 'contas_pagar', 'contas_receber', 
            'despesas', 'fornecedores', 'salarios_config', 
            'adiantamentos', 'produtos_vendidos', 'fechamentos_caixa',
            'estoque', 'estoque_movimentacoes'
        )
    LOOP 
        -- Remover políticas antigas genéricas
        EXECUTE format('DROP POLICY IF EXISTS "Authenticated users can view %I" ON public.%I', t, t);
        EXECUTE format('DROP POLICY IF EXISTS "Authenticated users can insert %I" ON public.%I', t, t);
        EXECUTE format('DROP POLICY IF EXISTS "Authenticated users can update %I" ON public.%I', t, t);
        EXECUTE format('DROP POLICY IF EXISTS "Authenticated users can delete %I" ON public.%I', t, t);
        EXECUTE format('DROP POLICY IF EXISTS "Auth users can view %I" ON public.%I', t, t);
        EXECUTE format('DROP POLICY IF EXISTS "Auth users can insert %I" ON public.%I', t, t);
        EXECUTE format('DROP POLICY IF EXISTS "Auth users can update %I" ON public.%I', t, t);
        EXECUTE format('DROP POLICY IF EXISTS "Auth users can delete %I" ON public.%I', t, t);

        -- Criar novas políticas filtrando por estabelecimento_id do perfil do usuário
        EXECUTE format('
            CREATE POLICY "Tenancy_Select_%I" ON public.%I 
            FOR SELECT TO authenticated 
            USING (
                estabelecimento_id IN (SELECT estabelecimento_id FROM public.profiles WHERE user_id = auth.uid())
                OR (auth.jwt() ->> ''email'' LIKE ''%%admin@belezasystem.ao%%'')
            )', t, t);

        EXECUTE format('
            CREATE POLICY "Tenancy_Insert_%I" ON public.%I 
            FOR INSERT TO authenticated 
            WITH CHECK (
                estabelecimento_id IN (SELECT estabelecimento_id FROM public.profiles WHERE user_id = auth.uid())
                OR (auth.jwt() ->> ''email'' LIKE ''%%admin@belezasystem.ao%%'')
            )', t, t);

        EXECUTE format('
            CREATE POLICY "Tenancy_Update_%I" ON public.%I 
            FOR UPDATE TO authenticated 
            USING (
                estabelecimento_id IN (SELECT estabelecimento_id FROM public.profiles WHERE user_id = auth.uid())
                OR (auth.jwt() ->> ''email'' LIKE ''%%admin@belezasystem.ao%%'')
            )', t, t);

        EXECUTE format('
            CREATE POLICY "Tenancy_Delete_%I" ON public.%I 
            FOR DELETE TO authenticated 
            USING (
                estabelecimento_id IN (SELECT estabelecimento_id FROM public.profiles WHERE user_id = auth.uid())
                OR (auth.jwt() ->> ''email'' LIKE ''%%admin@belezasystem.ao%%'')
            )', t, t);
    END LOOP;
END $$;
