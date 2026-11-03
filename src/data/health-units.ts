// Fontes consultadas em 03/11/2026:
// https://portais.santoandre.sp.gov.br/saude/unidades-basicas/
// https://portais.santoandre.sp.gov.br/saude/urgencia-e-emergencia/
export interface HealthUnit {
  name: string;
  type: "UBS" | "UPA";
  address: string;
  phone: string;
  status?: string;
}

// Coordenadas serão adicionadas somente após validação.
const records: [string, HealthUnit["type"], string, string, string?][] = [
  ["UPA Bangu", "UPA", "Rua Avaré, 107 – Vila São Pedro", "4997-4211"],
  ["UPA Central", "UPA", "Praça IV Centenário, 8 – Centro", "4436-6844", "Em reforma – fechada"],
  ["UPA Faisa", "UPA", "Rua Adolfo Bastos, 25 – Vila Bastos", "4436-6844", "Em reforma – fechada"],
  ["UPA Jardim Santo André", "UPA", "Rua Tom Jobim, 396 – Jardim Santo André", "4422-4560"],
  ["UPA Perimetral", "UPA", "Rua Cel. Agenor de Camargo, 129 – Vila Assunção", "4435-1400"],
  ["UPA Sacadura Cabral", "UPA", "Rua Lauro Muller, 354 – Vila Sacadura Cabral", "4421-1224"],
  ["UPA Vila Luzita", "UPA", "Rua Calecute, 25 – Vila Luzita", "4453-5119"],
  ["PA Paranapiacaba", "UPA", "Avenida Ford, s/nº – Paranapiacaba", "4439-0299"],
  ["Policlínica Centro", "UBS", "Rua Xavier de Toledo, 517 – Centro", "4422-9519"],
  ["Policlínica Parque João Ramalho", "UBS", "Rua Maragogipe, s/nº – Parque João Ramalho", "4435-1450"],
  ["Policlínica Vila Helena", "UBS", "Avenida Andrade Neves, 1.082 – Vila Helena", "4435-1394"],
  ["Clínica da Família Jardim Ana Maria", "UBS", "Rua Otávio Mangabeira, 331 – Jardim Ana Maria", "4435-1358"],
  ["Clínica da Família Jardim Carla", "UBS", "Rua José de Alencar, s/nº – Jardim Carla", "4435-1391"],
  ["Clínica da Família Jardim Santo Alberto", "UBS", "Rua Almada, 745 – Jardim Santo Alberto", "4435-1355"],
  ["Clínica da Família Jardim Santo André", "UBS", "Rua Tom Jobim, 660 – Jardim Santo André", "4435-1471"],
  ["Clínica da Família Jardim Sorocaba", "UBS", "Avenida Sorocaba, 935/945 – Jardim Sorocaba", "4435-1360"],
  ["Clínica da Família Recreio da Borda do Campo", "UBS", "Avenida Mico Leão Dourado, 2.452 (esquina com Rua Guariba) – Recreio da Borda do Campo", "4435-1467"],
  ["Clínica da Família Valparaíso", "UBS", "Rua Andradina, 471 – Vila Valparaíso", "4435-1487"],
  ["Clínica da Família Vila Linda", "UBS", "Rua Embaré, 97 (esquina com Rua Ingá) – Vila Linda", "4435-1350", "Em reforma – fechada"],
  ["Clínica da Família Capuava – Centro de Saúde Escola", "UBS", "Rua Irlanda, 700 – Parque Capuava", "4435-1363"],
  ["Clínica da Família São Jorge", "UBS", "Avenida São Paulo, 800 – Cidade São Jorge", "4435-1478"],
  ["Dr. Moysés Fucs", "UBS", "Rua Alexandreta, 180 – Jardim Santo Antônio", "4435-1373", "Em reforma – com atendimento"],
  ["Clínica da Família Jardim Alvorada", "UBS", "Rua Dr. Almenor Jardim Silveira, s/nº – Jardim Alvorada", "4435-1455"],
  ["Clínica da Família Jardim Irene", "UBS", "Estrada da Cata Preta, 552 – Jardim Irene", "4435-1462"],
  ["Clínica da Família Jardim Marek", "UBS", "Rua Eng. Alfred Heitzman Júnior, s/nº – Jardim Marek", "4435-1388"],
  ["Clínica da Família Utinga", "UBS", "Alameda México, s/nº – Vila Metalúrgica", "4435-1376"],
  ["Clínica da Família Vila Guiomar", "UBS", "Rua das Silveiras, 73 – Vila Guiomar", "4435-1483"],
  ["Clínica da Família Vila Luzita", "UBS", "Avenida Dom Pedro I, 4.197 – Vila Luzita", "4435-1474"],
  ["Clínica da Família Alzira Franco", "UBS", "Rua Asa Branca, s/nº (esquina com Rua Horizonte Azul) – Jardim Alzira Franco", "4435-1315"],
  ["Clínica da Família Jardim Cipreste", "UBS", "Rua Caminho dos Vianas, 300 – Jardim Cipreste", "4435-1459"],
  ["Clínica da Família Paranapiacaba", "UBS", "Avenida Ford, s/nº – Paranapiacaba", "4422-9510"],
  ["Clínica da Família Parque Andreense", "UBS", "Avenida Ibertioga, s/nº – Parque Andreense", "4422-9512"],
  ["Clínica da Família Parque Miami", "UBS", "Estrada do Pedroso, 5.151 – Parque Miami", "4435-1465"],
  ["Clínica da Família Cruzado – Sylvia Augusta dos Santos", "UBS", "Rua dos Vicentinhos, 335 – Jardim Santo André", "4435-1310"],
  ["Policlínica Bairro Paraíso", "UBS", "Rua Juquiá, 256 – Bairro Paraíso", "4422-9522"],
  ["Policlínica Campestre", "UBS", "Rua das Figueiras, 2.716 – Bairro Campestre", "4435-1492"],
  ["Policlínica Humaitá", "UBS", "Rua Fernando de Mascarenhas, 191 – Vila Humaitá", "4422-4814"],
  ["Policlínica Jardim Bom Pastor", "UBS", "Rua José D’Ângelo, 35 – Jardim Bom Pastor", "4422-9532"],
  ["Policlínica Parque das Nações", "UBS", "Praça Waldemar Soares, s/nº – Parque das Nações", "4435-1367"],
  ["Policlínica Parque Novo Oratório", "UBS", "Rua Tunísia, s/nº – Parque Novo Oratório", "4422-4800"],
  ["Policlínica Vila Lucinda", "UBS", "Rua Caconde, s/nº (em frente à Praça Heliópolis) – Vila Lucinda", "4435-1370"],
  ["Policlínica Vila Palmares", "UBS", "Praça Áurea, 234 – Vila Palmares", "4435-1481"],
];

export const healthUnits: HealthUnit[] = records.map(([name, type, address, phone, status]) => ({
  name, type, address: `${address} – Santo André, SP`, phone: `(11) ${phone}`, status,
}));
