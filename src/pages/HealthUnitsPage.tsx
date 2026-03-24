import { useState, useEffect } from "react";
import { MapPin, Phone, Navigation, Loader2 } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { healthUnits, haversineDistance, type HealthUnit } from "@/data/health-units";

interface UnitWithDistance extends HealthUnit {
  distance: number | null;
}

const HealthUnitsPage = () => {
  const [units, setUnits] = useState<UnitWithDistance[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "UBS" | "UPA">("all");

  useEffect(() => {
    if (!navigator.geolocation) {
      setUnits(healthUnits.map((u) => ({ ...u, distance: null })));
      setLocationError("Geolocalização não suportada neste navegador.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const withDist = healthUnits
          .map((u) => ({
            ...u,
            distance: haversineDistance(latitude, longitude, u.lat, u.lng),
          }))
          .sort((a, b) => a.distance - b.distance);
        setUnits(withDist);
        setLoading(false);
      },
      () => {
        setUnits(healthUnits.map((u) => ({ ...u, distance: null })));
        setLocationError("Não foi possível obter sua localização.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const filtered = filter === "all" ? units : units.filter((u) => u.type === filter);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader title="UBS / UPA Próximas" showBack />

      <main className="flex-1 p-4">
        {/* Filter tabs */}
        <div className="flex gap-2 mb-4">
          {(["all", "UBS", "UPA"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {f === "all" ? "Todas" : f}
            </button>
          ))}
        </div>

        {locationError && (
          <div className="mb-4 p-3 bg-surface rounded-lg text-sm text-muted-foreground">
            ⚠️ {locationError}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Obtendo sua localização...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((unit) => (
              <div
                key={unit.id}
                className="p-4 bg-card rounded-xl border border-border shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-bold ${
                          unit.type === "UPA"
                            ? "bg-primary/10 text-primary"
                            : "bg-accent/10 text-accent"
                        }`}
                      >
                        {unit.type}
                      </span>
                      {unit.distance !== null && (
                        <span className="text-xs text-muted-foreground font-medium">
                          {unit.distance < 1
                            ? `${Math.round(unit.distance * 1000)}m`
                            : `${unit.distance.toFixed(1)} km`}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-foreground">{unit.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      {unit.address}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <a
                    href={`tel:${unit.phone.replace(/\D/g, "")}`}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-semibold active:opacity-80 transition-opacity"
                  >
                    <Phone className="w-4 h-4" />
                    Ligar
                  </a>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${unit.lat},${unit.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-accent text-accent-foreground text-sm font-semibold active:opacity-80 transition-opacity"
                  >
                    <Navigation className="w-4 h-4" />
                    Ver Rota
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default HealthUnitsPage;
