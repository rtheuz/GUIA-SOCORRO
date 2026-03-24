export interface HealthInfoItem {
  id: string;
  title: string;
  icon: string;
  content: string;
}

export const healthInfoItems: HealthInfoItem[] = [
  {
    id: "cvv",
    title: "CVV — 188",
    icon: "💙",
    content: "O Centro de Valorização da Vida oferece apoio emocional e prevenção do suicídio. Funciona 24 horas por dia, 7 dias por semana. A ligação é gratuita. Também disponível por chat em cvv.org.br."
  },
  {
    id: "dengue",
    title: "Prevenção contra Dengue",
    icon: "🦟",
    content: "Elimine água parada em vasos, pneus, garrafas e calhas. Use repelente. Procure atendimento médico se tiver febre alta, dor atrás dos olhos, dores no corpo e manchas vermelhas. Não tome aspirina ou anti-inflamatórios sem orientação médica."
  },
  {
    id: "hipertensao",
    title: "Hipertensão Arterial",
    icon: "💓",
    content: "A pressão alta é silenciosa e pode causar infarto, AVC e problemas renais. Meça sua pressão regularmente, reduza o sal na alimentação, pratique exercícios e tome medicamentos conforme prescrição médica. Acompanhe na UBS."
  },
  {
    id: "diabetes",
    title: "Diabetes",
    icon: "🩸",
    content: "O diabetes é uma condição crônica que requer controle da glicemia. Mantenha alimentação equilibrada, pratique atividades físicas, tome a medicação e monitore o açúcar no sangue. Faça acompanhamento regular na UBS."
  },
  {
    id: "saude-mental",
    title: "Saúde Mental",
    icon: "🧠",
    content: "Cuide da sua saúde mental. Se você ou alguém próximo está em sofrimento emocional, procure o CAPS (Centro de Atenção Psicossocial) da sua região ou ligue 188 (CVV). Ansiedade, depressão e outros transtornos têm tratamento gratuito pelo SUS."
  },
  {
    id: "gestantes",
    title: "Pré-Natal (Gestantes)",
    icon: "🤰",
    content: "Toda gestante tem direito ao pré-natal gratuito pelo SUS. Inicie o acompanhamento assim que descobrir a gravidez. Compareça às consultas, faça os exames solicitados e tome as vitaminas prescritas. Procure a UBS mais próxima."
  }
];
