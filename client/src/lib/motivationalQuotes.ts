// OUSE SER VOCÊ – Motivational Quotes
// Frases inspiradoras organizadas por categoria para as imagens de conquistas

export interface QuoteCategory {
  id: string;
  name: string;
  emoji: string;
  description: string;
  quotes: string[];
}

export const quoteCategories: QuoteCategory[] = [
  {
    id: "self-knowledge",
    name: "Autoconhecimento",
    emoji: "🪞",
    description: "Reconhecer-se e sua identidade",
    quotes: [
      "Você é mais forte do que pensa.",
      "Sua jornada é única e valiosa.",
      "Reconhecer-se é o primeiro passo para transformar-se.",
      "Você merece estar em primeiro lugar.",
      "Sua história é inspiradora.",
    ],
  },
  {
    id: "transformation",
    name: "Transformação",
    emoji: "🦋",
    description: "Mudança e evolução pessoal",
    quotes: [
      "Pequenas mudanças geram grandes transformações.",
      "Cada dia é uma nova oportunidade.",
      "Você está se tornando a melhor versão de si mesma.",
      "A mudança começa dentro de você.",
      "Sua transformação inspira outras mulheres.",
    ],
  },
  {
    id: "self-esteem",
    name: "Autoestima",
    emoji: "👑",
    description: "Amor-próprio e valorização",
    quotes: [
      "Você é digna de amor e respeito.",
      "Ame-se como você ama quem você ama.",
      "Sua autoestima é seu superpoder.",
      "Você brilha quando se ama.",
      "O amor-próprio é revolucionário.",
    ],
  },
  {
    id: "courage",
    name: "Coragem",
    emoji: "💪",
    description: "Força e bravura",
    quotes: [
      "Coragem é estar assustada e fazer mesmo assim.",
      "Você é corajosa por estar aqui.",
      "Sua força é inspiradora.",
      "Você consegue mais do que imagina.",
      "Seja corajosa em ser você mesma.",
    ],
  },
  {
    id: "purpose",
    name: "Propósito",
    emoji: "✨",
    description: "Significado e direção",
    quotes: [
      "Seu propósito é importante.",
      "Você faz diferença no mundo.",
      "Sua presença importa.",
      "Você está no caminho certo.",
      "Seu propósito está se revelando.",
    ],
  },
  {
    id: "wellness",
    name: "Bem-estar",
    emoji: "🌿",
    description: "Cuidado e saúde emocional",
    quotes: [
      "Cuidar de si é um ato de amor.",
      "Seu bem-estar é prioridade.",
      "Você merece descanso e paz.",
      "Autocuidado é revolucionário.",
      "Sua saúde emocional importa.",
    ],
  },
  {
    id: "boundaries",
    name: "Limites",
    emoji: "🚪",
    description: "Relacionamentos saudáveis",
    quotes: [
      "Seus limites são saudáveis.",
      "Você merece relacionamentos respeitosos.",
      "Dizer não é um ato de amor próprio.",
      "Seus limites protegem seu coração.",
      "Você escolhe com quem convive.",
    ],
  },
  {
    id: "resilience",
    name: "Resiliência",
    emoji: "🌊",
    description: "Superação e persistência",
    quotes: [
      "Você já superou 100% das piores dias.",
      "Resiliência é sua natureza.",
      "Você é mais resiliente do que pensa.",
      "Cada obstáculo é uma oportunidade.",
      "Você não desiste de si mesma.",
    ],
  },
  {
    id: "hope",
    name: "Esperança",
    emoji: "🌅",
    description: "Futuro brilhante",
    quotes: [
      "Seu futuro é brilhante.",
      "Esperança é seu combustível.",
      "Melhores dias estão chegando.",
      "Você está construindo seu melhor futuro.",
      "O melhor ainda está por vir.",
    ],
  },
  {
    id: "community",
    name: "Comunidade",
    emoji: "🤝",
    description: "Conexão e apoio",
    quotes: [
      "Você não está sozinha nessa jornada.",
      "Juntas somos mais fortes.",
      "Sua história inspira outras mulheres.",
      "Comunidade é poder.",
      "Você faz parte de algo maior.",
    ],
  },
  {
    id: "celebration",
    name: "Celebração",
    emoji: "🎉",
    description: "Conquistas e vitórias",
    quotes: [
      "Celebre cada vitória, por menor que seja.",
      "Você merece celebrar suas conquistas.",
      "Cada passo é uma vitória.",
      "Suas conquistas são reais e importantes.",
      "Você está progredindo.",
    ],
  },
  {
    id: "presence",
    name: "Presença",
    emoji: "🧘",
    description: "Momento presente",
    quotes: [
      "O presente é seu poder.",
      "Viva o agora com presença.",
      "Este momento é seu.",
      "Você está exatamente onde precisa estar.",
      "Presença é um presente para si mesma.",
    ],
  },
  {
    id: "letting-go",
    name: "Desapego",
    emoji: "🍃",
    description: "Liberação e leveza",
    quotes: [
      "Você está se libertando do que não serve.",
      "Soltar é um ato de amor próprio.",
      "Você merece leveza.",
      "Liberdade começa dentro de você.",
      "Você está se desapegando do que dói.",
    ],
  },
  {
    id: "gratitude",
    name: "Gratidão",
    emoji: "🙏",
    description: "Apreciação e reconhecimento",
    quotes: [
      "Gratidão transforma sua perspectiva.",
      "Você tem muito pelo qual ser grata.",
      "Gratidão atrai mais bênçãos.",
      "Seu coração é grato.",
      "Aprecie o caminho que você percorreu.",
    ],
  },
  {
    id: "authenticity",
    name: "Autenticidade",
    emoji: "💎",
    description: "Ser genuína e verdadeira",
    quotes: [
      "Ser autêntica é seu superpoder.",
      "Você é perfeita do jeito que é.",
      "Sua autenticidade inspira.",
      "Seja genuína, sempre.",
      "Você não precisa ser perfeita, precisa ser real.",
    ],
  },
];

export function getRandomQuoteFromCategory(categoryId: string): string {
  const category = quoteCategories.find(c => c.id === categoryId);
  if (!category) return "Você é mais forte do que pensa.";
  
  const randomIndex = Math.floor(Math.random() * category.quotes.length);
  return category.quotes[randomIndex];
}

export function getRandomMotivationalQuote(): string {
  const allQuotes = quoteCategories.flatMap(c => c.quotes);
  const randomIndex = Math.floor(Math.random() * allQuotes.length);
  return allQuotes[randomIndex];
}
