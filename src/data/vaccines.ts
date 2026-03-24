export interface Vaccine {
  id: string;
  name: string;
  target: string;
  doses: string;
  description: string;
  alert?: string;
}

export const vaccines: Vaccine[] = [
  {
    id: "bcg",
    name: "BCG",
    target: "Recém-nascidos",
    doses: "Dose única ao nascer",
    description: "Protege contra formas graves de tuberculose (meningite tuberculosa e tuberculose miliar).",
    alert: "Deve ser aplicada na maternidade"
  },
  {
    id: "hepatite-b",
    name: "Hepatite B",
    target: "Recém-nascidos",
    doses: "Dose ao nascer + esquema com Pentavalente",
    description: "Previne a hepatite B, doença que ataca o fígado."
  },
  {
    id: "pentavalente",
    name: "Pentavalente (DTP+HB+Hib)",
    target: "Crianças de 2, 4 e 6 meses",
    doses: "3 doses (2, 4 e 6 meses)",
    description: "Protege contra difteria, tétano, coqueluche, hepatite B e Haemophilus influenzae tipo b."
  },
  {
    id: "vip-vop",
    name: "VIP / VOP (Poliomielite)",
    target: "Crianças de 2, 4, 6 meses e reforços",
    doses: "3 doses de VIP + reforços com VOP",
    description: "Previne a paralisia infantil (poliomielite).",
    alert: "Participem das campanhas nacionais de vacinação"
  },
  {
    id: "pneumo-10",
    name: "Pneumocócica 10-valente",
    target: "Crianças de 2 e 4 meses",
    doses: "2 doses + 1 reforço",
    description: "Protege contra pneumonia, meningite e otite causadas pelo pneumococo."
  },
  {
    id: "rotavirus",
    name: "Rotavírus",
    target: "Crianças de 2 e 4 meses",
    doses: "2 doses (via oral)",
    description: "Previne diarreia grave causada pelo rotavírus.",
    alert: "Atenção aos prazos — doses têm idade máxima para aplicação"
  },
  {
    id: "meningo-c",
    name: "Meningocócica C",
    target: "Crianças de 3 e 5 meses",
    doses: "2 doses + 1 reforço aos 12 meses",
    description: "Protege contra meningite meningocócica tipo C."
  },
  {
    id: "triplice-viral",
    name: "Tríplice Viral (SCR)",
    target: "Crianças de 12 meses e 15 meses",
    doses: "2 doses",
    description: "Protege contra sarampo, caxumba e rubéola."
  },
  {
    id: "febre-amarela",
    name: "Febre Amarela",
    target: "A partir de 9 meses",
    doses: "Dose única",
    description: "Previne a febre amarela, transmitida por mosquitos.",
    alert: "Obrigatória para viajantes para áreas de risco"
  },
  {
    id: "influenza",
    name: "Influenza (Gripe)",
    target: "Idosos, crianças, gestantes e grupos prioritários",
    doses: "Dose anual",
    description: "Protege contra os vírus da gripe mais circulantes na temporada.",
    alert: "Campanha anual — fique atento às datas"
  },
  {
    id: "covid-19",
    name: "COVID-19",
    target: "População geral a partir de 6 meses",
    doses: "Esquema conforme orientação do Ministério da Saúde",
    description: "Protege contra formas graves da COVID-19.",
    alert: "Verifique as doses de reforço disponíveis"
  },
  {
    id: "dt-adulto",
    name: "dT (Dupla Adulto)",
    target: "Adolescentes e adultos",
    doses: "Reforço a cada 10 anos",
    description: "Protege contra difteria e tétano."
  }
];
