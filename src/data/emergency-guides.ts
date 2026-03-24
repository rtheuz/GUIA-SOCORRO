export interface EmergencyGuide {
  id: string;
  title: string;
  icon: string;
  symptoms: string[];
  doList: string[];
  dontList: string[];
  callEmergency: string;
}

export const emergencyGuides: EmergencyGuide[] = [
  {
    id: "engasgo",
    title: "Engasgo",
    icon: "🫁",
    symptoms: [
      "Dificuldade para respirar ou falar",
      "Tosse fraca ou ausente",
      "Pele, lábios ou unhas azuladas",
      "Pessoa levando as mãos ao pescoço",
      "Perda de consciência"
    ],
    doList: [
      "Ligue 192 (SAMU) imediatamente",
      "Para adultos: aplique a Manobra de Heimlich — posicione-se atrás da pessoa, coloque o punho fechado acima do umbigo e pressione com força para dentro e para cima",
      "Para bebês: coloque de bruços sobre o antebraço e dê 5 tapas firmes nas costas, entre as escápulas",
      "Se a pessoa desmaiar, inicie compressões torácicas (RCP)",
      "Verifique a boca e remova o objeto se estiver visível"
    ],
    dontList: [
      "Não dê tapas nas costas de adultos que ainda conseguem tossir",
      "Não tente enfiar o dedo na garganta às cegas",
      "Não ofereça água ou comida",
      "Não segure a pessoa de cabeça para baixo (exceto bebês pela técnica correta)"
    ],
    callEmergency: "Ligue 192 (SAMU) se a pessoa não conseguir respirar, tossir ou falar, ou se perder a consciência."
  },
  {
    id: "parada-cardiaca",
    title: "Parada Cardíaca",
    icon: "❤️",
    symptoms: [
      "Pessoa inconsciente e não responde",
      "Ausência de respiração normal",
      "Sem pulso detectável",
      "Pele pálida ou azulada"
    ],
    doList: [
      "Ligue 192 (SAMU) imediatamente",
      "Inicie RCP: 30 compressões torácicas seguidas de 2 ventilações",
      "Comprima forte e rápido no centro do peito (5-6 cm de profundidade)",
      "Mantenha ritmo de 100-120 compressões por minuto",
      "Use um DEA (desfibrilador) se disponível",
      "Não pare até o socorro chegar"
    ],
    dontList: [
      "Não perca tempo procurando pulso por mais de 10 segundos",
      "Não interrompa as compressões por mais de 10 segundos",
      "Não dê comida ou água",
      "Não mova a pessoa desnecessariamente"
    ],
    callEmergency: "Ligue 192 (SAMU) imediatamente. Cada minuto sem RCP reduz a chance de sobrevivência em 10%."
  },
  {
    id: "convulsao",
    title: "Convulsão",
    icon: "⚡",
    symptoms: [
      "Movimentos involuntários e rítmicos do corpo",
      "Rigidez muscular",
      "Perda de consciência",
      "Salivação excessiva",
      "Olhos revirados"
    ],
    doList: [
      "Proteja a cabeça com algo macio",
      "Afaste objetos perigosos ao redor",
      "Coloque a pessoa de lado (posição de recuperação) após a crise",
      "Marque o tempo da convulsão",
      "Aguarde a crise passar e acalme a pessoa"
    ],
    dontList: [
      "Não coloque nada na boca da pessoa",
      "Não tente segurar ou impedir os movimentos",
      "Não jogue água no rosto",
      "Não dê medicamentos durante a crise"
    ],
    callEmergency: "Ligue 192 se a convulsão durar mais de 5 minutos, se a pessoa não recuperar a consciência, ou se for a primeira crise."
  },
  {
    id: "queimaduras",
    title: "Queimaduras",
    icon: "🔥",
    symptoms: [
      "Pele vermelha e dolorida (1º grau)",
      "Bolhas com líquido (2º grau)",
      "Pele esbranquiçada, marrom ou carbonizada (3º grau)",
      "Dor intensa ou ausência de dor em queimaduras graves"
    ],
    doList: [
      "Resfrie a área com água corrente fria por 10-20 minutos",
      "Remova anéis, relógios e roupas soltas antes do inchaço",
      "Cubra com pano limpo e úmido",
      "Mantenha a pessoa hidratada",
      "Procure atendimento médico para queimaduras maiores que a palma da mão"
    ],
    dontList: [
      "Não aplique pasta de dente, manteiga ou qualquer receita caseira",
      "Não estoure as bolhas",
      "Não remova roupas grudadas na pele",
      "Não use gelo diretamente na queimadura",
      "Não use algodão sobre a área queimada"
    ],
    callEmergency: "Ligue 192 para queimaduras extensas, no rosto/mãos/pés/genitais, por eletricidade ou produtos químicos."
  },
  {
    id: "fraturas",
    title: "Fraturas",
    icon: "🦴",
    symptoms: [
      "Dor intensa no local",
      "Inchaço e hematoma",
      "Deformidade visível no membro",
      "Incapacidade de movimentar a região",
      "Estalos ao movimentar"
    ],
    doList: [
      "Imobilize a região fraturada como está",
      "Aplique gelo envolto em pano por 15-20 minutos",
      "Eleve o membro se possível",
      "Use tala improvisada (revista, papelão) se necessário transportar",
      "Procure atendimento médico"
    ],
    dontList: [
      "Não tente colocar o osso no lugar",
      "Não movimente a área fraturada",
      "Não aplique calor",
      "Não dê analgésicos sem orientação médica em caso de cirurgia"
    ],
    callEmergency: "Ligue 192 se houver osso exposto, perda de sensibilidade, deformidade grave ou suspeita de fratura na coluna."
  },
  {
    id: "hemorragias",
    title: "Hemorragias",
    icon: "🩸",
    symptoms: [
      "Sangramento intenso e contínuo",
      "Palidez e suor frio",
      "Pulso rápido e fraco",
      "Tontura e confusão mental",
      "Sede intensa"
    ],
    doList: [
      "Pressione o local com pano limpo por pelo menos 10 minutos",
      "Eleve a parte do corpo que está sangrando",
      "Mantenha a pressão — não retire o pano para verificar",
      "Se o sangue atravessar, coloque mais pano por cima",
      "Deite a pessoa e mantenha aquecida"
    ],
    dontList: [
      "Não faça torniquete, exceto em hemorragia com risco de vida em membros",
      "Não retire objetos encravados",
      "Não lave feridas profundas com água",
      "Não dê líquidos se a pessoa estiver inconsciente"
    ],
    callEmergency: "Ligue 192 se o sangramento não parar após 10 minutos de pressão, se houver objeto encravado, ou se a pessoa apresentar sinais de choque."
  },
  {
    id: "desmaio",
    title: "Desmaio",
    icon: "😵",
    symptoms: [
      "Perda temporária de consciência",
      "Tontura ou vertigem antes do desmaio",
      "Visão turva ou escurecida",
      "Palidez e suor frio",
      "Fraqueza nas pernas"
    ],
    doList: [
      "Deite a pessoa de costas e eleve as pernas acima do nível do coração",
      "Afrouxe roupas apertadas (gravata, cinto, botões)",
      "Mantenha o ambiente ventilado",
      "Quando acordar, mantenha deitada por alguns minutos",
      "Ofereça água quando estiver totalmente consciente"
    ],
    dontList: [
      "Não jogue água no rosto",
      "Não dê tapas",
      "Não tente levantar a pessoa rapidamente",
      "Não dê comida ou bebida enquanto estiver inconsciente",
      "Não use amônia ou álcool para reanimar"
    ],
    callEmergency: "Ligue 192 se a pessoa não acordar em 1 minuto, se desmaiar com frequência, se houver convulsão ou se bater a cabeça na queda."
  }
];
