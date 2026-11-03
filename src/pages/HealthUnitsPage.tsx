import { useState } from "react";
import { MapPin, Phone, Navigation } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { healthUnits } from "@/data/health-units";
import type { HealthUnit } from "@/data/health-units";
import OfflineNavigation from "@/components/OfflineNavigation";

const HealthUnitsPage = () => {
  const [filter, setFilter] = useState<"all" | "UBS" | "UPA">("all");
  const [search, setSearch] = useState("");
  const [selectedUnit, setSelectedUnit] = useState<HealthUnit | null>(null);
  const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const filtered = healthUnits.filter((unit) =>
    (filter === "all" || unit.type === filter) &&
    normalize(`${unit.name} ${unit.address}`).includes(normalize(search.trim()))
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader title="Unidades de saúde" showBack />
      <main className="flex-1 p-4">
        {selectedUnit && <OfflineNavigation unit={selectedUnit} onClose={() => setSelectedUnit(null)} />}
        <label htmlFor="unit-search" className="block text-sm font-semibold mb-1">Buscar por nome, rua ou bairro</label>
        <input id="unit-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)}
          placeholder="Ex.: Vila Luzita" className="w-full mb-4 p-3 rounded-lg border border-border bg-background text-foreground" />
        <div className="flex gap-2 mb-4" aria-label="Filtrar unidades">
          {(["all", "UBS", "UPA"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} aria-pressed={filter === f}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold ${filter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
              {f === "all" ? "Todas" : f}
            </button>
          ))}
        </div>
        <p className="mb-4 p-3 bg-surface rounded-lg text-sm text-muted-foreground">
          Endereços e telefones da Prefeitura, consultados em 03/11/2026. A situação pode mudar; confirme antes de sair. Clínicas da família e policlínicas estão no filtro UBS; o PA está no filtro UPA.
        </p>
        <p className="mb-4 text-sm text-muted-foreground">A rota offline a pé está disponível nas unidades com localização conferida. As demais continuam disponíveis para consulta de endereço e telefone.</p>
        <div className="flex flex-col gap-3">
          {filtered.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma unidade encontrada. Tente outro nome ou bairro.</p>}
          {filtered.map((unit) => (
            <div key={unit.name} className="p-4 bg-card rounded-xl border border-border shadow-sm">
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-primary/10 text-primary">{unit.name.startsWith("PA ") ? "PA" : unit.type}</span>
              <h3 className="font-bold text-foreground mt-1">{unit.name}</h3>
              {unit.status && <p className="text-sm font-bold text-primary mt-1">{unit.status}</p>}
              <p className="text-sm text-muted-foreground mt-1 flex items-start gap-1">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />{unit.address}
              </p>
              <div className="flex gap-2 mt-3">
                <a href={`tel:${unit.phone.replace(/\D/g, "")}`} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-semibold">
                  <Phone className="w-4 h-4" /> Ligar
                </a>
                {!unit.status?.includes("fechada") && <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${unit.name}, ${unit.address}`)}`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-accent text-accent-foreground text-sm font-semibold">
                  <Navigation className="w-4 h-4" /> Mapa online
                </a>}
              </div>
              {unit.coordinates && !unit.status?.includes("fechada") && <button onClick={() => setSelectedUnit(unit)} className="w-full mt-2 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold">Rota a pé offline</button>}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default HealthUnitsPage;
