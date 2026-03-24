import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MapPin, Calendar, Info, Phone } from "lucide-react";
import IntroScreen from "@/components/IntroScreen";
import InstallBanner from "@/components/InstallBanner";
import AppHeader from "@/components/AppHeader";

const menuItems = [
  {
    id: "emergency",
    label: "Guia de Emergência",
    sublabel: "Primeiros Socorros",
    icon: Heart,
    path: "/emergencia",
    color: "bg-secondary text-secondary-foreground",
  },
  {
    id: "units",
    label: "UBS / UPA Mais Próxima",
    sublabel: "Localizar unidade de saúde",
    icon: MapPin,
    path: "/unidades",
    color: "bg-secondary text-secondary-foreground",
  },
  {
    id: "vaccines",
    label: "Calendário de Vacinas",
    sublabel: "Vacinação e campanhas",
    icon: Calendar,
    path: "/vacinas",
    color: "bg-secondary text-secondary-foreground",
  },
  {
    id: "health",
    label: "Informações de Saúde",
    sublabel: "Telefones e prevenção",
    icon: Info,
    path: "/saude",
    color: "bg-secondary text-secondary-foreground",
  },
];

const emergencyDials = [
  { label: "SAMU", number: "192", color: "bg-red-700 text-primary-foreground" },
  { label: "Bombeiros", number: "193", color: "bg-orange-400 text-primary-foreground" },
  { label: "Polícia", number: "190", color: "bg-blue-800 text-primary-foreground" },
];

const Index = () => {
  const [showIntro, setShowIntro] = useState(true);
  const navigate = useNavigate();

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
  }, []);

  return (
    <>
      {showIntro && <IntroScreen onComplete={handleIntroComplete} />}

      <div className="flex flex-col min-h-screen bg-background">
        <AppHeader title="GUIA SOCORRO" />

        <main className="flex-1 flex flex-col p-4 gap-4">
          <InstallBanner />

          {/* Quick Emergency Dial */}
          <div className="flex gap-2">
            {emergencyDials.map((dial) => (
              <a
                key={dial.number}
                href={`tel:${dial.number}`}
                className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 rounded-xl ${dial.color} shadow-md active:scale-[0.96] transition-transform`}
              >
                <Phone className="w-5 h-5" />
                <span className="text-xs font-bold">{dial.label}</span>
                <span className="text-lg font-black leading-none">{dial.number}</span>
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-4 w-full min-h-[80px] p-5 rounded-xl ${item.color} shadow-md active:scale-[0.98] transition-transform`}
              >
                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-background/10 flex-shrink-0">
                  <item.icon className="w-7 h-7" />
                </div>
                <div className="text-left">
                  <span className="block text-lg font-bold leading-tight">
                    {item.label}
                  </span>
                  <span className="block text-sm opacity-80 mt-0.5">
                    {item.sublabel}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-auto pt-6 pb-4 text-center">
            <p className="text-xs text-muted-foreground">
              Santo André — SP • Funciona offline
            </p>
          </div>
        </main>
      </div>
    </>
  );
};

export default Index;
