-- Criação de tabelas para o Módulo Super Admin e Changelog

-- 1. Planos de Assinatura
CREATE TABLE IF NOT EXISTS planos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    descricao TEXT,
    preco_mensal DECIMAL(12, 2) NOT NULL, -- Em Kwanza
    limite_funcionarios INTEGER DEFAULT 1,
    limite_clientes INTEGER,
    features JSONB DEFAULT '[]',
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Assinaturas dos Tenants
CREATE TABLE IF NOT EXISTS assinaturas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    estabelecimento_id UUID NOT NULL REFERENCES estabelecimentos(id),
    plano_id UUID REFERENCES planos(id),
    status TEXT NOT NULL CHECK (status IN ('active', 'past_due', 'canceled', 'trialing')),
    valor_cobrado DECIMAL(12, 2) NOT NULL,
    data_inicio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_fim TIMESTAMP WITH TIME ZONE,
    ultimo_pagamento TIMESTAMP WITH TIME ZONE,
    metodo_pagamento TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Sistema de Tickets de Suporte
CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    estabelecimento_id UUID NOT NULL REFERENCES estabelecimentos(id),
    usuario_id UUID NOT NULL,
    titulo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    prioridade TEXT NOT NULL CHECK (prioridade IN ('baixa', 'media', 'alta', 'critica')),
    status TEXT NOT NULL DEFAULT 'aberto' CHECK (status IN ('aberto', 'em_progresso', 'resolvido', 'fechado')),
    categoria TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ticket_mensagens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    usuario_id UUID NOT NULL,
    mensagem TEXT NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Changelog do Sistema
CREATE TABLE IF NOT EXISTS changelog (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    versao TEXT NOT NULL UNIQUE,
    titulo TEXT NOT NULL,
    data_publicacao DATE NOT NULL DEFAULT CURRENT_DATE,
    publicado BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS changelog_itens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    changelog_id UUID NOT NULL REFERENCES changelog(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL CHECK (tipo IN ('nova_funcionalidade', 'melhoria', 'correccao', 'seguranca', 'breaking')),
    descricao TEXT NOT NULL,
    modulo_afetado TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS e Políticas

ALTER TABLE planos ENABLE ROW LEVEL SECURITY;
ALTER TABLE assinaturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_mensagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE changelog ENABLE ROW LEVEL SECURITY;
ALTER TABLE changelog_itens ENABLE ROW LEVEL SECURITY;

-- Políticas para Super Admin (Acesso Total)
-- Nota: Assume-se que o SuperAdmin tem um role/claim específico no Supabase Auth
-- ou é identificado via função rpc get_user_role()

CREATE POLICY "Acesso total Super Admin em Planos" ON planos FOR ALL USING (auth.jwt() ->> 'email' LIKE '%admin@belezasystem.ao%');
CREATE POLICY "Leitura pública Changelog" ON changelog FOR SELECT USING (publicado = TRUE);
CREATE POLICY "Leitura pública Changelog Itens" ON changelog_itens FOR SELECT USING (TRUE);

-- Inserção de dados iniciais (Exemplo)
INSERT INTO changelog (versao, titulo, data_publicacao, publicado) 
VALUES ('1.0.0', 'Lançamento BelezaSystem Angola', CURRENT_DATE, TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO changelog_itens (changelog_id, tipo, descricao, modulo_afetado)
SELECT id, 'nova_funcionalidade', 'Lançamento do módulo financeiro com suporte a Kwanza (Kz).', 'Financeiro'
FROM changelog WHERE versao = '1.0.0';
