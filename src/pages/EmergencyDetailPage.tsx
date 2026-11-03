import { useParams, useNavigate } from "react-router-dom";
import { Phone, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { emergencyGuides } from "@/data/emergency-guides";

const EmergencyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const guide = emergencyGuides.find((g) => g.id === id);

  if (!guide) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <AppHeader title="Não encontrado" showBack />
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-muted-foreground">Guia não encontrado.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader title={guide.title} showBack />

      <main className="flex-1 p-4 space-y-4 pb-8">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 bg-surface rounded-xl">
          <span className="text-4xl">{guide.icon}</span>
          <div>
            <h2 className="text-xl font-bold text-foreground">{guide.title}</h2>
            <p className="text-sm text-muted-foreground">Guia de primeiros socorros</p>
          </div>
        </div>

        {/* Sintomas */}
        <section className="p-4 bg-card rounded-xl border border-border">
          <h3 className="flex items-center gap-2 text-base font-bold text-foreground mb-3">
            <AlertTriangle className="w-5 h-5 text-primary" />
            Sintomas
          </h3>
          <ul className="space-y-2">
            {guide.symptoms.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </section>

        {/* O que fazer */}
        <section className="p-4 bg-accent/10 rounded-xl border border-accent/30">
          <h3 className="flex items-center gap-2 text-base font-bold text-accent mb-3">
            <CheckCircle2 className="w-5 h-5" />
            O que fazer
          </h3>
          <ol className="space-y-3">
            {guide.doList.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent text-accent-foreground text-xs font-bold flex-shrink-0">
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ol>
        </section>

        {/* O que NÃO fazer */}
        <section className="p-4 bg-primary/5 rounded-xl border border-primary/20">
          <h3 className="flex items-center gap-2 text-base font-bold text-primary mb-3">
            <XCircle className="w-5 h-5" />
            O que NÃO fazer
          </h3>
          <ul className="space-y-2">
            {guide.dontList.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <XCircle className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Quando ligar para emergência */}
        <section className="p-4 bg-primary rounded-xl">
          <h3 className="flex items-center gap-2 text-base font-bold text-primary-foreground mb-2">
            <Phone className="w-5 h-5" />
            Quando chamar emergência
          </h3>
          <p className="text-sm text-primary-foreground/90">{guide.callEmergency}</p>
          <a
            href="tel:192"
            className="mt-3 flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-primary-foreground text-primary font-bold text-base active:opacity-80 transition-opacity"
          >
            <Phone className="w-5 h-5" />
            Ligar 192 — SAMU
          </a>
        </section>
      </main>
    </div>
  );
};

export default EmergencyDetailPage;
