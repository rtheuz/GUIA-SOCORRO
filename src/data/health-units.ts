export interface HealthUnit {
  id: string;
  name: string;
  type: "UBS" | "UPA";
  address: string;
  lat: number;
  lng: number;
  phone: string;
}

export const healthUnits: HealthUnit[] = [
  // UPAs de Santo André
  {
    id: "upa-central",
    name: "UPA Central",
    type: "UPA",
    address: "R. das Figueiras, 1100 - Centro, Santo André - SP",
    lat: -23.6544,
    lng: -46.5322,
    phone: "(11) 4433-1000"
  },
  {
    id: "upa-jardim-santo-andre",
    name: "UPA Jardim Santo André",
    type: "UPA",
    address: "Estr. do Pedroso, 5500 - Jardim Santo André, Santo André - SP",
    lat: -23.6937,
    lng: -46.4900,
    phone: "(11) 4458-2300"
  },
  {
    id: "upa-vila-luzita",
    name: "UPA Vila Luzita",
    type: "UPA",
    address: "Av. Dom Pedro II, 3450 - Vila Luzita, Santo André - SP",
    lat: -23.6743,
    lng: -46.5087,
    phone: "(11) 4990-8200"
  },
  // UBSs de Santo André
  {
    id: "ubs-santa-teresinha",
    name: "UBS Santa Teresinha",
    type: "UBS",
    address: "R. Pará, 66 - Santa Teresinha, Santo André - SP",
    lat: -23.6413,
    lng: -46.5400,
    phone: "(11) 4438-6969"
  },
  {
    id: "ubs-bangu",
    name: "UBS Bangu",
    type: "UBS",
    address: "R. Bangu, 500 - Bangu, Santo André - SP",
    lat: -23.6530,
    lng: -46.5486,
    phone: "(11) 4991-2373"
  },
  {
    id: "ubs-camilopolis",
    name: "UBS Camilópolis",
    type: "UBS",
    address: "R. Alfredo Maluf, 100 - Camilópolis, Santo André - SP",
    lat: -23.6375,
    lng: -46.5239,
    phone: "(11) 4458-2033"
  },
  {
    id: "ubs-vila-palmares",
    name: "UBS Vila Palmares",
    type: "UBS",
    address: "R. Luís Gama, 270 - Vila Palmares, Santo André - SP",
    lat: -23.6493,
    lng: -46.5585,
    phone: "(11) 4992-2122"
  },
  {
    id: "ubs-jardim-utinga",
    name: "UBS Jardim Utinga",
    type: "UBS",
    address: "R. Visc. de Taunay, 694 - Jardim Utinga, Santo André - SP",
    lat: -23.6385,
    lng: -46.5530,
    phone: "(11) 4994-3211"
  },
  {
    id: "ubs-parque-novo-oratorio",
    name: "UBS Parque Novo Oratório",
    type: "UBS",
    address: "R. Jurubatuba, 1500 - Parque Novo Oratório, Santo André - SP",
    lat: -23.6675,
    lng: -46.5140,
    phone: "(11) 4458-5100"
  },
  {
    id: "ubs-vila-assuncao",
    name: "UBS Vila Assunção",
    type: "UBS",
    address: "R. Oratório, 540 - Vila Assunção, Santo André - SP",
    lat: -23.6610,
    lng: -46.5295,
    phone: "(11) 4991-6322"
  },
  {
    id: "ubs-parque-das-nacoes",
    name: "UBS Parque das Nações",
    type: "UBS",
    address: "R. Xingu, 100 - Parque das Nações, Santo André - SP",
    lat: -23.6483,
    lng: -46.5190,
    phone: "(11) 4972-1100"
  },
  {
    id: "ubs-vila-guiomar",
    name: "UBS Vila Guiomar",
    type: "UBS",
    address: "R. Marechal Deodoro, 900 - Vila Guiomar, Santo André - SP",
    lat: -23.6500,
    lng: -46.5420,
    phone: "(11) 4436-4455"
  }
];

/**
 * Calcula a distância entre dois pontos usando a fórmula de Haversine
 * @returns distância em quilômetros
 */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Raio da Terra em km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
