import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import EmergencyListPage from "./pages/EmergencyListPage";
import EmergencyDetailPage from "./pages/EmergencyDetailPage";
import HealthUnitsPage from "./pages/HealthUnitsPage";
import VaccinesPage from "./pages/VaccinesPage";
import HealthInfoPage from "./pages/HealthInfoPage";
import NotFound from "./pages/NotFound";
import IntroScreen from "./components/IntroScreen";

const queryClient = new QueryClient();

// Must match vite.config `base` (GitHub Pages project URL: /REPO_NAME/)
const routerBasename =
  import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

const AnimatedRoutes = () => {
  const location = useLocation();
  return <div key={location.pathname} className="page-transition"><Routes location={location}>
    <Route path="/" element={<Index />} />
    <Route path="/emergencia" element={<EmergencyListPage />} />
    <Route path="/emergencia/:id" element={<EmergencyDetailPage />} />
    <Route path="/unidades" element={<HealthUnitsPage />} />
    <Route path="/vacinas" element={<VaccinesPage />} />
    <Route path="/saude" element={<HealthInfoPage />} />
    <Route path="/GUIA-SOCORRO/*" element={<Navigate to="/" replace />} />
    <Route path="*" element={<NotFound />} />
  </Routes></div>;
};

const App = () => {
  const [showIntro, setShowIntro] = useState(true);
  const finishIntro = useCallback(() => setShowIntro(false), []);
  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={routerBasename}>
        <AnimatedRoutes />
        {showIntro && <IntroScreen onComplete={finishIntro} />}
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
