import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Calendar, Users, Scissors, 
  DollarSign, Settings, LogOut, Menu, X, Shield,
  ChevronRight, Bell, Search
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { CambioWidget } from "./CambioWidget";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { usuarioLogado, perfil, logout, podeAcessar } = useAuth();
  const [open, setOpen] = useState(true);
  const location = useLocation();

  const nav = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Agenda & Serviços", path: "/agenda", icon: Calendar },
    { label: "Clientes", path: "/clientes", icon: Users },
    { label: "Facturação (Kz)", path: "/financeiro", icon: DollarSign, hidden: !podeAcessar("financeiro_completo") },
    { label: "Configurações", path: "/configuracoes", icon: Settings, hidden: !podeAcessar("configuracoes") },
  ];

  return (
    <div className="flex h-screen bg-[#FDFCFB] font-body overflow-hidden">
      {/* Sidebar Luxo */}
      <aside className={`${open ? "w-72" : "w-24"} bg-white border-r border-border transition-all duration-500 ease-in-out flex flex-col shadow-[4px_0_40px_rgba(0,0,0,0.03)] z-50`}>
        <div className="p-8 pb-12 flex items-center gap-4">
          <div className="h-10 w-10 flex-shrink-0 rounded-2xl gold-gradient shadow-lg shadow-primary/20 flex items-center justify-center text-white ring-4 ring-primary/10">
            <Scissors className="h-5 w-5" />
          </div>
          {open && (
            <div className="animate-in fade-in duration-700">
              <h1 className="font-display font-bold text-lg tracking-tight">BelezaSystem</h1>
              <p className="text-[10px] uppercase font-bold text-primary tracking-[0.2em] -mt-1">Angola</p>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto no-scrollbar">
          {nav.filter(n => !n.hidden).map(n => (
            <Link 
              key={n.path} 
              to={n.path} 
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                location.pathname === n.path 
                ? "bg-primary/10 text-primary shadow-sm" 
                : "text-text3 hover:bg-surface2 hover:text-foreground"
              }`}
            >
              <n.icon className={`h-5 w-5 ${location.pathname === n.path ? "text-primary" : "text-text3 group-hover:text-primary transition-colors"}`} /> 
              {open && <span className="text-sm font-bold tracking-tight">{n.label}</span>}
              {location.pathname === n.path && open && <ChevronRight className="ml-auto h-4 w-4 opacity-40" />}
            </Link>
          ))}

          {perfil === "SuperAdmin" && (
            <div className="mt-8 pt-8 border-t border-border/60">
               <p className={`${open ? "px-5" : "text-center"} text-[9px] uppercase font-extrabold text-text3 tracking-[0.3em] mb-4`}>
                 {open ? "Administração Master" : "ADM"}
               </p>
               <Link 
                 to="/superadmin" 
                 className="flex items-center gap-4 px-5 py-4 rounded-2xl text-amber-600 hover:bg-amber-50 transition-all font-bold group"
               >
                 <Shield className="h-5 w-5 group-hover:scale-110 transition-transform" /> 
                 {open && <span className="text-sm">Painel Central</span>}
               </Link>
            </div>
          )}
        </nav>

        <div className="p-4">
          <button 
            onClick={logout} 
            className="w-full flex items-center gap-4 px-5 py-5 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold text-sm group"
          >
            <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" /> 
            {open && "Terminar Sessão"}
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col relative">
        <CambioWidget />
        
        <header className="h-[80px] px-10 flex items-center justify-between bg-white/70 backdrop-blur-xl border-b border-border sticky top-0 z-40">
          <button 
            onClick={() => setOpen(!open)} 
            className="p-3 hover:bg-surface2 bg-white border border-border rounded-2xl transition-all shadow-sm active:scale-90"
          >
            {open ? <X className="h-5 w-5 text-text2" /> : <Menu className="h-5 w-5 text-text2" />}
          </button>

          <div className="flex items-center gap-8">
             <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-surface2 rounded-xl border border-border/50">
               <Search className="h-4 w-4 text-text3" />
               <input placeholder="Pesquisar..." className="bg-transparent border-none outline-none text-xs font-medium w-40" />
             </div>

             <div className="flex items-center gap-6 pl-6 border-l border-border">
                <button className="relative p-2 text-text3 hover:text-primary transition-colors">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
                </button>
                
                <div className="flex items-center gap-4 group cursor-pointer">
                   <div className="text-right">
                     <p className="text-xs font-bold text-foreground leading-tight">{usuarioLogado?.nome}</p>
                     <p className="text-[9px] uppercase font-extrabold text-primary tracking-widest">{perfil}</p>
                   </div>
                   <div className="h-11 w-11 rounded-2xl gold-gradient shadow-md shadow-primary/20 flex items-center justify-center font-bold text-white text-sm group-hover:scale-105 transition-transform duration-300 ring-2 ring-primary/5">
                     {usuarioLogado?.nome?.[0]}
                   </div>
                </div>
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10 bg-[#FDFCFB]">
          <div className="max-w-7xl mx-auto animate-in fade-in duration-1000">
            {children}
          </div>
        </main>

        {/* Footer Sutil */}
        <footer className="px-10 py-5 bg-white border-t border-border flex justify-between items-center">
          <p className="text-[10px] text-text3 font-medium uppercase tracking-widest leading-none">© 2026 BelezaSystem Angola. Todos os direitos reservados.</p>
          <div className="flex gap-4">
             <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
             <span className="text-[9px] font-bold text-text3 uppercase italic leading-none">AOA Central Bank API Connected</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
