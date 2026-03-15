import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, FileSpreadsheet, Search, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";
import { exportToPDF, exportToExcel } from "@/lib/exportUtils";

// ===== MODAL =====
export function Modal({ open, onClose, title, children, size = "md" }: { 
  open: boolean; 
  onClose: () => void; 
  title: string; 
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  if (!open) return null;
  const sizeClass = size === "sm" ? "max-w-sm" : size === "lg" ? "max-w-2xl" : "max-w-lg";
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm p-4" 
        onClick={onClose}
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: "spring", damping: 25, stiffness: 350, mass: 0.8 }}
          className={`w-full ${sizeClass} max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-card p-6 space-y-4 shadow-2xl`} 
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <motion.h2 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.2 }}
              className="font-display text-lg font-bold text-foreground"
            >
              {title}
            </motion.h2>
            <button onClick={onClose} className="text-text3 hover:text-foreground transition-colors"><X className="h-5 w-5" /></button>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.25 }}
          >
            {children}
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ===== CONFIRM DIALOG =====
export function ConfirmDialog({ 
  open, 
  onClose, 
  onConfirm, 
  title = "Confirmar ação", 
  message = "Tem certeza que deseja continuar?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "danger"
}: { 
  open: boolean; 
  onClose: () => void; 
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "default";
}) {
  if (!open) return null;
  const btnClass = variant === "danger" 
    ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
    : variant === "warning"
    ? "bg-primary text-primary-foreground hover:bg-primary/90"
    : "gold-gradient text-primary-foreground";
  
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center gap-4 py-2">
        <div className={`rounded-full p-3 ${variant === "danger" ? "bg-destructive/10" : "bg-primary/10"}`}>
          <AlertTriangle className={`h-6 w-6 ${variant === "danger" ? "text-destructive" : "text-primary"}`} />
        </div>
        <p className="text-center text-sm text-text2">{message}</p>
        <div className="flex gap-3 w-full">
          <button onClick={onClose} className="flex-1 rounded-lg bg-surface2 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-surface3">{cancelText}</button>
          <button onClick={() => { onConfirm(); onClose(); }} className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold ${btnClass}`}>{confirmText}</button>
        </div>
      </div>
    </Modal>
  );
}

// ===== KPI CARD =====
export function KpiCard({ label, value, icon: Icon, color, variacao, trend, index = 0 }: { 
  label: string; 
  value: string; 
  icon: any; 
  color: string; 
  variacao?: { valor: string; positivo: boolean };
  trend?: number[];
  index?: number;
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.07, duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className="rounded-xl border border-border bg-card p-5 card-hover"
    >
      <div className="flex items-center gap-3">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.07 + 0.15, type: "spring", stiffness: 400, damping: 15 }}
          className={`rounded-lg p-2.5 ${color}`}
        >
          <Icon className="h-5 w-5" />
        </motion.div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-text3 truncate">{label}</p>
          <p className="font-display text-2xl font-bold text-foreground truncate">{value}</p>
          {variacao && (
            <p className={`text-xs mt-0.5 ${variacao.positivo ? "text-green-custom" : "text-destructive"}`}>
              {variacao.positivo ? "↑" : "↓"} {variacao.valor} vs mês anterior
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ===== STATUS BADGE =====
const statusStyles: Record<string, string> = {
  "Pendente": "bg-primary/10 text-primary",
  "Vencida": "bg-destructive/10 text-destructive animate-pulse",
  "Paga": "bg-green-custom/10 text-green-custom",
  "Paga com atraso": "bg-muted text-muted-foreground",
  "Em aberto": "bg-primary/10 text-primary",
  "Parcialmente pago": "bg-teal-custom/10 text-teal-custom",
  "Quitado": "bg-green-custom/10 text-green-custom",
  "Vencido": "bg-destructive/10 text-destructive animate-pulse",
  "Pendente aprovação": "bg-primary/10 text-primary",
  "Aprovado — aguardando desconto": "bg-gold/10 text-primary",
  "Descontado no salário": "bg-green-custom/10 text-green-custom",
  "Incluída no salário": "bg-green-custom/10 text-green-custom",
  "Paga separadamente": "bg-teal-custom/10 text-teal-custom",
  "Pendente pagamento": "bg-primary/10 text-primary",
  "Entrada": "bg-green-custom/10 text-green-custom",
  "Saída": "bg-destructive/10 text-destructive",
  "Fixo": "bg-teal-custom/10 text-teal-custom",
  "Somente comissão": "bg-primary/10 text-primary",
  "Fixo + comissão": "bg-green-custom/10 text-green-custom",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium whitespace-nowrap ${statusStyles[status] || "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  );
}

// ===== FIELD COMPONENTS =====
export function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label className="text-xs text-text3 mb-1 block">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      {children}
    </div>
  );
}

export function InputField({ label, value, onChange, type = "text", placeholder = "", required, disabled }: { 
  label: string; 
  value: string | number; 
  onChange: (v: string) => void; 
  type?: string; 
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <Field label={label} required={required}>
      <input 
        type={type} 
        value={value} 
        onChange={e => onChange(e.target.value)} 
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed" 
      />
    </Field>
  );
}

export function SelectField({ label, value, onChange, options, required }: { 
  label: string; 
  value: string; 
  onChange: (v: string) => void; 
  options: { value: string; label: string }[];
  required?: boolean;
}) {
  return (
    <Field label={label} required={required}>
      <select 
        value={value} 
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </Field>
  );
}

export function TextareaField({ label, value, onChange, placeholder = "", required, rows = 3 }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}) {
  return (
    <Field label={label} required={required}>
      <textarea 
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
      />
    </Field>
  );
}

// ===== EXPORT BUTTONS =====
export function ExportButtons({ 
  title, 
  fileName, 
  columns, 
  data,
  onExport 
}: { 
  title: string;
  fileName: string;
  columns: { header: string; key: string }[];
  data: Record<string, any>[];
  onExport?: () => void;
}) {
  const handleExport = (fmt: "pdf" | "excel") => {
    const opts = { title, fileName, columns, data };
    fmt === "pdf" ? exportToPDF(opts) : exportToExcel(opts);
    onExport?.();
  };

  return (
    <div className="flex gap-2">
      <button onClick={() => handleExport("pdf")} className="flex items-center gap-1.5 rounded-lg bg-surface2 px-3 py-1.5 text-xs font-medium text-text2 hover:text-foreground hover:bg-primary/10 transition-colors">
        <Download className="h-3.5 w-3.5" />PDF
      </button>
      <button onClick={() => handleExport("excel")} className="flex items-center gap-1.5 rounded-lg bg-surface2 px-3 py-1.5 text-xs font-medium text-text2 hover:text-foreground hover:bg-primary/10 transition-colors">
        <FileSpreadsheet className="h-3.5 w-3.5" />Excel
      </button>
    </div>
  );
}

// ===== SEARCH INPUT =====
export function SearchInput({ value, onChange, placeholder = "Pesquisar..." }: { 
  value: string; 
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text3" />
      <input 
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-text3 focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}

// ===== PAGINATION =====
export function usePagination<T>(items: T[], perPage = 10) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(items.length / perPage);
  const paginated = items.slice((page - 1) * perPage, page * perPage);
  
  // Reset to page 1 if items change and current page is out of bounds
  if (page > totalPages && totalPages > 0) {
    setPage(1);
  }
  
  return { paginated, page, totalPages, setPage, total: items.length };
}

export function PaginationControls({ page, totalPages, setPage, total }: { 
  page: number; 
  totalPages: number; 
  setPage: (p: number) => void;
  total?: number;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between p-4 border-t border-border">
      {total !== undefined && (
        <span className="text-xs text-text3">{total} registro(s)</span>
      )}
      <div className="flex items-center gap-2 ml-auto">
        <button 
          disabled={page <= 1} 
          onClick={() => setPage(page - 1)} 
          className="rounded-lg bg-surface2 p-2 text-text2 hover:bg-primary/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-xs text-text3 min-w-[80px] text-center">
          Página {page} de {totalPages}
        </span>
        <button 
          disabled={page >= totalPages} 
          onClick={() => setPage(page + 1)} 
          className="rounded-lg bg-surface2 p-2 text-text2 hover:bg-primary/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ===== PERIOD FILTER =====
export type PeriodoFilter = "hoje" | "semana" | "mes" | "mes_anterior" | "trimestre" | "personalizado";

export function PeriodFilter({ value, onChange, showCustom = true }: {
  value: PeriodoFilter;
  onChange: (v: PeriodoFilter) => void;
  showCustom?: boolean;
}) {
  const options: { value: PeriodoFilter; label: string }[] = [
    { value: "hoje", label: "Hoje" },
    { value: "semana", label: "Esta semana" },
    { value: "mes", label: "Este mês" },
    { value: "mes_anterior", label: "Mês anterior" },
    { value: "trimestre", label: "Últimos 3 meses" },
  ];
  if (showCustom) options.push({ value: "personalizado", label: "Personalizado" });

  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map(o => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            value === o.value 
              ? "bg-primary/15 text-primary ring-1 ring-primary/30" 
              : "bg-surface2 text-text3 hover:bg-surface3 hover:text-text2"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ===== STATUS FILTER =====
export function StatusFilter<T extends string>({ 
  value, 
  onChange, 
  options 
}: {
  value: T | null;
  onChange: (v: T | null) => void;
  options: { value: T; label: string; color?: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <button
        onClick={() => onChange(null)}
        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
          value === null 
            ? "bg-primary/15 text-primary ring-1 ring-primary/30" 
            : "bg-surface2 text-text3 hover:bg-surface3"
        }`}
      >
        Todos
      </button>
      {options.map(o => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            value === o.value 
              ? "bg-primary/15 text-primary ring-1 ring-primary/30" 
              : "bg-surface2 text-text3 hover:bg-surface3"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ===== EMPTY STATE =====
export function EmptyState({ icon: Icon, title, description }: {
  icon: any;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-surface2 p-4 mb-4">
        <Icon className="h-8 w-8 text-text3" />
      </div>
      <p className="font-medium text-foreground mb-1">{title}</p>
      {description && <p className="text-sm text-text3 max-w-sm">{description}</p>}
    </div>
  );
}

// ===== MOBILE CARD =====
export function MobileCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-border bg-card p-4 space-y-3 md:hidden ${className}`}>
      {children}
    </div>
  );
}

export function MobileCardRow({ label, value, className = "" }: { label: string; value: React.ReactNode; className?: string }) {
  return (
    <div className={`flex justify-between items-center text-sm ${className}`}>
      <span className="text-text3">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

// ===== TAB ANIMATION WRAPPER =====
export function TabContent({ children, tabKey }: { children: React.ReactNode; tabKey: string }) {
  return (
    <motion.div
      key={tabKey}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className="space-y-6"
    >
      {children}
    </motion.div>
  );
}

// ===== TABLE WRAPPER =====
export function TableWrapper({ 
  title, 
  actions,
  exportProps,
  children 
}: { 
  title?: string;
  actions?: React.ReactNode;
  exportProps?: {
    title: string;
    fileName: string;
    columns: { header: string; key: string }[];
    data: Record<string, any>[];
  };
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {(title || actions || exportProps) && (
        <div className="p-5 border-b border-border flex flex-wrap items-center justify-between gap-3">
          {title && <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>}
          <div className="flex items-center gap-3 ml-auto">
            {actions}
            {exportProps && <ExportButtons {...exportProps} />}
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        {children}
      </div>
    </div>
  );
}
