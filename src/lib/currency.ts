/**
 * Utilitários de Moeda para o BelezaSystem Angola
 * Padrão: Kz 1.250,50
 */

export const formatKz = (v: number) =>
  "Kz " + v.toLocaleString("pt-AO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

export const FORMAS_PAGAMENTO = [
  "Numerário",
  "TPA",
  "Transferência bancária",
  "Multicaixa Express",
  "Referência Multicaixa"
] as const;

export type FormaPagamento = typeof FORMAS_PAGAMENTO[number];

/**
 * Converte string de input (ex: "1.250,50") para number
 */
export const parseKzInput = (v: string): number => {
  if (!v) return 0;
  const clean = v.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
  return parseFloat(clean) || 0;
};
