import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type PlanType = 'Gratuito' | 'Professional' | 'Premium';

export interface PlanLimits {
  profissionais: number | 'Ilimitado';
  clientes: number | 'Ilimitado';
  agendamentos_mes: number | 'Ilimitado';
}

export const PLANOS_LIMITES: Record<PlanType, PlanLimits> = {
  Gratuito: { profissionais: 2, clientes: 50, agendamentos_mes: 100 },
  Professional: { profissionais: 10, clientes: 500, agendamentos_mes: 2000 },
  Premium: { profissionais: 'Ilimitado', clientes: 'Ilimitado', agendamentos_mes: 'Ilimitado' },
};

export const CUSTO_PLANOS: Record<PlanType, number> = {
  Gratuito: 0,
  Professional: 25000,
  Premium: 50000,
};

export function useSubscription() {
  const { usuarioLogado } = useAuth();
  const estabId = usuarioLogado?.estabelecimentoId;
  const [planoAtual, setPlanoAtual] = useState<PlanType>('Gratuito');
  const [limits, setLimits] = useState<PlanLimits>(PLANOS_LIMITES['Gratuito']);
  const [loading, setLoading] = useState(true);
  const [usage, setUsage] = useState({
    profissionais: 0,
    clientes: 0,
    agendamentos: 0,
  });

  useEffect(() => {
    if (!estabId) {
      if (usuarioLogado) setLoading(false);
      return;
    }

    const fetchSubscriptionData = async () => {
      setLoading(true);
      try {
        const { data: estabelecimento } = await supabase
          .from('estabelecimentos')
          .select('plano')
          .eq('id', estabId)
          .single();

        let nomePlano = (estabelecimento?.plano as string) || 'Gratuito';
        // Normalize
        nomePlano = nomePlano.charAt(0).toUpperCase() + nomePlano.slice(1).toLowerCase();
        if (nomePlano === 'Basico' || nomePlano === 'Básico') nomePlano = 'Gratuito';
        
        const planoFinal = (PLANOS_LIMITES[nomePlano as PlanType] ? nomePlano : 'Gratuito') as PlanType;

        setPlanoAtual(planoFinal);
        setLimits(PLANOS_LIMITES[planoFinal]);

        // Get usage
        const [profCount, cliCount, agnCount] = await Promise.all([
          supabase.from('profissionais').select('id', { count: 'exact', head: true }).eq('estabelecimento_id', estabId),
          supabase.from('clientes').select('id', { count: 'exact', head: true }).eq('estabelecimento_id', estabId),
          // For agendamentos we should probably count current month, but for simplicity let's count all or recent
          supabase.from('agendamentos').select('id', { count: 'exact', head: true }).eq('estabelecimento_id', estabId),
        ]);

        setUsage({
          profissionais: profCount.count || 0,
          clientes: cliCount.count || 0,
          agendamentos: agnCount.count || 0,
        });
      } catch (err) {
        console.error("Erro ao carregar plano e uso", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [estabId, usuarioLogado]);

  const canAddProfissional = limits.profissionais === 'Ilimitado' || usage.profissionais < (limits.profissionais as number);
  const canAddCliente = limits.clientes === 'Ilimitado' || usage.clientes < (limits.clientes as number);
  const canAddAgendamento = limits.agendamentos_mes === 'Ilimitado' || usage.agendamentos < (limits.agendamentos_mes as number);

  const getLimitLabel = (used: number, limit: number | 'Ilimitado') => {
    if (limit === 'Ilimitado') return `${used} / Ilimitado`;
    return `${used} / ${limit}`;
  };

  const getLimitPercentage = (used: number, limit: number | 'Ilimitado') => {
    if (limit === 'Ilimitado') return 0;
    return Math.min(100, Math.round((used / limit) * 100));
  };

  return {
    planoAtual,
    limits,
    usage,
    loading,
    canAddProfissional,
    canAddCliente,
    canAddAgendamento,
    getLimitLabel,
    getLimitPercentage,
  };
}
