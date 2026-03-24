import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/emergencia" element={<EmergencyListPage />} />
          <Route path="/emergencia/:id" element={<EmergencyDetailPage />} />
          <Route path="/unidades" element={<HealthUnitsPage />} />
          <Route path="/vacinas" element={<VaccinesPage />} />
          <Route path="/saude" element={<HealthInfoPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
