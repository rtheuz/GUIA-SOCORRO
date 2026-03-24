import { Phone } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { healthInfoItems } from "@/data/health-info";

const HealthInfoPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader title="Informações de Saúde" showBack />

      <main className="flex-1 p-4 pb-8">
        <div className="flex flex-col gap-3">
          {healthInfoItems.map((item) => (
            <details
              key={item.id}
              className="group p-4 bg-card rounded-xl border border-border shadow-sm"
            >
              <summary className="flex items-center gap-3 cursor-pointer list-none min-h-[48px]">
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <span className="flex-1 font-bold text-foreground">{item.title}</span>
                <span className="text-muted-foreground text-xl group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-sm text-foreground/80 leading-relaxed">{item.content}</p>
                {item.id === "cvv" && (
                  <a
                    href="tel:188"
                    className="mt-3 flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-accent text-accent-foreground font-bold text-sm active:opacity-80 transition-opacity"
                  >
                    <Phone className="w-4 h-4" />
                    Ligar 188 — CVV
                  </a>
                )}
              </div>
            </details>
          ))}
        </div>
      </main>
    </div>
  );
};

export default HealthInfoPage;
