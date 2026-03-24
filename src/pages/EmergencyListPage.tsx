import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { emergencyGuides } from "@/data/emergency-guides";

const EmergencyListPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader title="Guia de Emergência" showBack />

      <main className="flex-1 p-4">
        <p className="text-sm text-muted-foreground mb-4">
          Selecione a situação de emergência para ver o passo a passo:
        </p>
        <div className="flex flex-col gap-3">
          {emergencyGuides.map((guide) => (
            <button
              key={guide.id}
              onClick={() => navigate(`/emergencia/${guide.id}`)}
              className="flex items-center gap-4 w-full min-h-[64px] p-4 bg-card rounded-xl border border-border shadow-sm active:bg-secondary transition-colors"
            >
              <span className="text-3xl flex-shrink-0">{guide.icon}</span>
              <span className="flex-1 text-left font-semibold text-foreground">
                {guide.title}
              </span>
              <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default EmergencyListPage;
