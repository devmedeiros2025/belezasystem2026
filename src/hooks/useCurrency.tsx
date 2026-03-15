import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type MoedaCode = "KZ" | "BRL" | "USD" | "EUR" | "MZN";
export type FormatoNumerico = "pt" | "en";

interface Moeda {
  code: MoedaCode;
  symbol: string;
  name: string;
}

export const moedas: Moeda[] = [
  { code: "KZ", symbol: "Kz", name: "Kwanza angolano" },
  { code: "BRL", symbol: "R$", name: "Real brasileiro" },
  { code: "USD", symbol: "$", name: "Dólar americano" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "MZN", symbol: "MT", name: "Metical moçambicano" },
];

interface CurrencyContextType {
  moeda: MoedaCode;
  formato: FormatoNumerico;
  setMoeda: (m: MoedaCode) => void;
  setFormato: (f: FormatoNumerico) => void;
  format: (value: number) => string;
  symbol: string;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [moeda, setMoedaState] = useState<MoedaCode>("KZ");
  const [formato, setFormatoState] = useState<FormatoNumerico>("pt");

  useEffect(() => {
    const savedMoeda = localStorage.getItem("beautycrm_moeda") as MoedaCode;
    const savedFormato = localStorage.getItem("beautycrm_formato") as FormatoNumerico;
    if (savedMoeda) setMoedaState(savedMoeda);
    if (savedFormato) setFormatoState(savedFormato);
  }, []);

  const setMoeda = (m: MoedaCode) => {
    setMoedaState(m);
    localStorage.setItem("beautycrm_moeda", m);
  };

  const setFormato = (f: FormatoNumerico) => {
    setFormatoState(f);
    localStorage.setItem("beautycrm_formato", f);
  };

  const currentMoeda = moedas.find(m => m.code === moeda) || moedas[0];

  const format = (value: number): string => {
    const locale = formato === "pt" ? "pt-AO" : "en-US";
    const formatted = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
    return `${currentMoeda.symbol} ${formatted}`;
  };

  return (
    <CurrencyContext.Provider value={{
      moeda,
      formato,
      setMoeda,
      setFormato,
      format,
      symbol: currentMoeda.symbol,
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency must be used within CurrencyProvider");
  return context;
}
