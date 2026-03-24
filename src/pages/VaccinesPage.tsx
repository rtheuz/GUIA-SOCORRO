import { Syringe, AlertCircle } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { vaccines } from "@/data/vaccines";

const VaccinesPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader title="Calendário de Vacinas" showBack />

      <main className="flex-1 p-4 pb-8">
        <p className="text-sm text-muted-foreground mb-4">
          Calendário Nacional de Vacinação — Ministério da Saúde
        </p>

        <div className="flex flex-col gap-3">
          {vaccines.map((vaccine) => (
            <div
              key={vaccine.id}
              className="p-4 bg-card rounded-xl border border-border shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 flex-shrink-0">
                  <Syringe className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-foreground">{vaccine.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{vaccine.target}</p>
                  <p className="text-xs font-medium text-accent mt-1">{vaccine.doses}</p>
                  <p className="text-sm text-foreground/80 mt-2">{vaccine.description}</p>
                  {vaccine.alert && (
                    <div className="flex items-start gap-1.5 mt-2 p-2 bg-primary/5 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-primary font-medium">{vaccine.alert}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default VaccinesPage;
