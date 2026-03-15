import { useState, useEffect } from "react";
import { RefreshCw, Globe, Repeat, TrendingUp } from "lucide-react";
import { formatKz } from "@/lib/currency";
import { toast } from "sonner";

interface ExchangeRates {
  USD: number;
  BRL: number;
  CNY: number;
  updatedAt: string;
}

const FALLBACK_RATES = { USD: 917.0, BRL: 175.8, CNY: 128.5 };

export function CambioWidget() {
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<number>(1);
  const [currency, setCurrency] = useState<"USD" | "BRL" | "CNY">("USD");

  const fetchRates = async () => {
    setLoading(true);
    try {
      const resp = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
      const data = await resp.json();
      const aoa = data.rates.AOA || 917;
      setRates({
        USD: aoa,
        BRL: aoa / data.rates.BRL,
        CNY: aoa / data.rates.CNY,
        updatedAt: new Date().toLocaleTimeString("pt-AO", { hour: "2-digit", minute: "2-digit" })
      });
    } catch {
      setRates({ ...FALLBACK_RATES, updatedAt: "Referência" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
    const id = setInterval(fetchRates, 30 * 60 * 1000); // 30 min
    return () => clearInterval(id);
  }, []);

  const result = amount * (rates?.[currency] || FALLBACK_RATES[currency]);

  return (
    <div className="flex w-full items-center justify-between bg-surface2 px-6 py-2 border-b border-border text-[11px] gap-4 overflow-x-auto no-scrollbar shadow-inner">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 font-bold text-primary uppercase tracking-tight">
          <Globe className="h-3.5 w-3.5" /> <span>BNA Ref</span>
        </div>
        <div className="flex items-center gap-5 whitespace-nowrap">
          <div className="flex gap-1.5 items-center">
            <span className="text-text3">🇺🇸 USD</span> <span className="font-bold">{formatKz(rates?.USD || 0)}</span>
            <TrendingUp className="h-3 w-3 text-emerald-500" />
          </div>
          <div className="flex gap-1.5 items-center">
            <span className="text-text3">🇧🇷 BRL</span> <span className="font-bold">{formatKz(rates?.BRL || 0)}</span>
          </div>
          <div className="flex gap-1.5 items-center">
            <span className="text-text3">🇨🇳 CNY</span> <span className="font-bold">{formatKz(rates?.CNY || 0)}</span>
          </div>
        </div>
        <button onClick={fetchRates} className="p-1 hover:text-primary transition-colors">
          <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="flex items-center gap-2 bg-card rounded-md border border-border px-2 py-0.5 shadow-sm">
        <div className="flex items-center gap-1 border-r border-border pr-2">
          <input 
            type="number" 
            value={amount} 
            onChange={e => setAmount(Number(e.target.value))}
            className="w-10 bg-transparent outline-none font-bold p-0 text-center text-[10px]"
          />
          <select value={currency} onChange={e => setCurrency(e.target.value as any)} className="bg-transparent border-none p-0 outline-none text-[10px] font-bold text-primary uppercase cursor-pointer">
            <option value="USD">USD</option>
            <option value="BRL">BRL</option>
            <option value="CNY">CNY</option>
          </select>
        </div>
        <Repeat className="h-2.5 w-2.5 opacity-30" />
        <span className="font-bold text-primary whitespace-nowrap">{formatKz(result)}</span>
      </div>
    </div>
  );
}
