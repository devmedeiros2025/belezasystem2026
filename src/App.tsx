import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import SuperAdminRoute from "@/components/SuperAdminRoute";
import { Toaster } from "@/components/ui/sonner";

const Login = lazy(() => import("@/pages/Login"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Financeiro = lazy(() => import("@/pages/Financeiro"));
const Configuracoes = lazy(() => import("@/pages/Configuracoes"));
const Agenda = lazy(() => import("@/pages/Agenda"));
const Clientes = lazy(() => import("@/pages/Clientes"));
const SuperAdmin = lazy(() => import("@/pages/SuperAdmin"));
const LandingPage = lazy(() => import("@/pages/LandingPage"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const LoadingScreen = () => (
  <div className="h-screen w-full flex flex-col items-center justify-center bg-background gap-4">
    <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    <p className="text-sm font-bold text-primary uppercase tracking-[0.3em] animate-pulse">BelezaSystem Angola</p>
  </div>
);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              {/* Pública */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              
              {/* Painel Administrativo Master */}
              <Route 
                path="/superadmin" 
                element={
                  <SuperAdminRoute>
                    <SuperAdmin />
                  </SuperAdminRoute>
                } 
              />
              
              {/* App Protegido */}
              <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
              <Route path="/agenda" element={<ProtectedRoute><Layout><Agenda /></Layout></ProtectedRoute>} />
              <Route path="/clientes" element={<ProtectedRoute><Layout><Clientes /></Layout></ProtectedRoute>} />
              <Route path="/financeiro" element={<ProtectedRoute><Layout><Financeiro /></Layout></ProtectedRoute>} />
              <Route path="/configuracoes" element={<ProtectedRoute><Layout><Configuracoes /></Layout></ProtectedRoute>} />
              
              {/* Fallback */}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Suspense>
          <Toaster richColors position="top-right" />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
