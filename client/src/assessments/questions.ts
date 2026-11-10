export type ScannerAreaId =
  | "identidade"
  | "emocional"
  | "autocuidado"
  | "relacionamentos"
  | "proposito";

export interface ScannerQuestion {
  id: string;
  area: ScannerAreaId;
  question: string;
  options: { label: string; value: number }[];
}

export const scannerQuestions: ScannerQuestion[] = [
  {
    id: "id1",
    area: "identidade",
    question: "Quando alguém te pergunta 'quem você é?', como você responde?",
    options: [
      {
        label: "Me defino pelos meus papéis: mãe, esposa, profissional...",
        value: 1,
      },
      {
        label: "Tenho dificuldade de responder — não sei bem quem sou",
        value: 2,
      },
      {
        label: "Consigo falar sobre mim além dos papéis, mas com dificuldade",
        value: 3,
      },
      {
        label: "Tenho clareza sobre quem sou além dos papéis que desempenho",
        value: 5,
      },
    ],
  },
  {
    id: "id2",
    area: "identidade",
    question:
      "Com que frequência você faz coisas que refletem seus valores e desejos reais?",
    options: [
      { label: "Raramente — vivo para os outros", value: 1 },
      { label: "Às vezes, quando sobra tempo", value: 2 },
      { label: "Com alguma regularidade", value: 3 },
      { label: "Frequentemente — me priorizo", value: 5 },
    ],
  },
  {
    id: "em1",
    area: "emocional",
    question:
      "Como você lida com suas emoções difíceis (tristeza, raiva, ansiedade)?",
    options: [
      { label: "Evito sentir — me ocupo ou me distraio", value: 1 },
      { label: "Sinto, mas me julgo muito por isso", value: 2 },
      { label: "Consigo sentir, mas ainda é difícil", value: 3 },
      { label: "Acolho minhas emoções com compaixão", value: 5 },
    ],
  },
  {
    id: "em2",
    area: "emocional",
    question: "Com que frequência você se sente emocionalmente esgotada?",
    options: [
      { label: "Quase sempre — estou no limite", value: 1 },
      { label: "Com frequência", value: 2 },
      { label: "Às vezes", value: 3 },
      { label: "Raramente — cuido da minha energia", value: 5 },
    ],
  },
  {
    id: "ac1",
    area: "autocuidado",
    question:
      "Quando foi a última vez que você fez algo só para você, sem culpa?",
    options: [
      { label: "Não me lembro — sempre me sinto culpada", value: 1 },
      { label: "Faz muito tempo", value: 2 },
      { label: "Recentemente, mas com alguma culpa", value: 3 },
      { label: "Faço isso regularmente e sem culpa", value: 5 },
    ],
  },
  {
    id: "ac2",
    area: "autocuidado",
    question: "Como você se trata quando comete um erro?",
    options: [
      { label: "Me critico duramente — sou muito exigente comigo", value: 1 },
      { label: "Me culpo bastante, mas eventualmente me perdoo", value: 2 },
      { label: "Consigo me tratar com alguma gentileza", value: 3 },
      {
        label: "Me trato com a mesma compaixão que trataria uma amiga",
        value: 5,
      },
    ],
  },
  {
    id: "rel1",
    area: "relacionamentos",
    question:
      "Nas suas relações, você consegue expressar suas necessidades e estabelecer limites?",
    options: [
      { label: "Não — tenho muito medo do conflito ou da rejeição", value: 1 },
      { label: "Raramente — me calo para não criar problemas", value: 2 },
      { label: "Às vezes, com dificuldade", value: 3 },
      { label: "Sim — me expresso com clareza e respeito", value: 5 },
    ],
  },
  {
    id: "rel2",
    area: "relacionamentos",
    question: "Como você se sente na maioria das suas relações próximas?",
    options: [
      { label: "Invisível, sobrecarregada ou não valorizada", value: 1 },
      { label: "Às vezes valorizada, mas frequentemente drenada", value: 2 },
      { label: "Razoavelmente bem, com algumas relações difíceis", value: 3 },
      { label: "Nutrida, respeitada e valorizada", value: 5 },
    ],
  },
  {
    id: "prop1",
    area: "proposito",
    question: "Você tem clareza sobre o que dá sentido à sua vida?",
    options: [
      { label: "Não — me sinto perdida e sem direção", value: 1 },
      { label: "Tenho algumas ideias, mas nada claro", value: 2 },
      { label: "Tenho alguma clareza, mas ainda busco mais", value: 3 },
      { label: "Sim — sei o que me move e caminho nessa direção", value: 5 },
    ],
  },
  {
    id: "prop2",
    area: "proposito",
    question: "Como você se sente em relação ao seu futuro?",
    options: [
      { label: "Com medo e sem esperança — não vejo saída", value: 1 },
      { label: "Incerta e ansiosa", value: 2 },
      { label: "Com alguma esperança, mas muitas dúvidas", value: 3 },
      { label: "Com esperança e clareza sobre onde quero chegar", value: 5 },
    ],
  },
];
