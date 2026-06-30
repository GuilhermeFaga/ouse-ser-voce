// OUSE SER VOCÊ – Histórias de Transformação da Comunidade
// Depoimentos autênticos e inspiradores de mulheres que completaram a jornada

export interface CommunityStory {
  id: string;
  name: string;
  age: number;
  avatar: string;
  role: string;
  daysCompleted: number;
  mainTransformation: string;
  quote: string;
  fullStory: string;
  highlights: string[];
  likes: number;
  timestamp: string;
  achievements: string[];
  moodBefore: number;
  moodAfter: number;
}

export const communityStories: CommunityStory[] = [
  {
    id: "story-1",
    name: "Marina",
    age: 42,
    avatar: "👩‍🦱",
    role: "Advogada e Mãe",
    daysCompleted: 30,
    mainTransformation: "Recuperou autoestima e aprendeu a dizer não",
    quote: "Eu não sabia que era possível ser mãe, profissional e ainda assim ser eu mesma.",
    fullStory: "Marina passou 15 anos colocando os outros em primeiro lugar. Depois de começar a jornada OUSE SER VOCÊ, descobriu que dizer não era um ato de amor, não de egoísmo. Hoje, ela equilibra sua carreira de sucesso com tempo para si mesma, e sua família a vê mais feliz do que nunca.",
    highlights: [
      "Estabeleceu limites saudáveis com a família",
      "Voltou a fazer yoga (sua paixão abandonada)",
      "Recebeu promoção no trabalho com mais confiança",
      "Melhorou relacionamento com seu parceiro"
    ],
    likes: 247,
    timestamp: "Há 2 dias",
    achievements: ["Semana 1 Completa", "Semana 2 Completa", "Semana 3 Completa", "Semana 4 Completa", "Jornada Completa"],
    moodBefore: 2,
    moodAfter: 5,
  },
  {
    id: "story-2",
    name: "Fernanda",
    age: 38,
    avatar: "👩",
    role: "Empresária",
    daysCompleted: 30,
    mainTransformation: "Descobriu seu propósito além dos negócios",
    quote: "Construí um império, mas tinha perdido a mim mesma no caminho.",
    fullStory: "Fernanda era uma empresária de sucesso, mas se sentia vazia. A jornada de 30 dias a ajudou a reconectar com seus valores e descobrir que seu propósito ia além de lucros. Agora usa sua empresa para impactar positivamente a vida de suas colaboradoras.",
    highlights: [
      "Implementou programa de bem-estar para equipe",
      "Redescobriu paixão por mentoria de mulheres",
      "Criou espaço de acolhimento no trabalho",
      "Melhorou saúde mental e disposição"
    ],
    likes: 189,
    timestamp: "Há 5 dias",
    achievements: ["Semana 1 Completa", "Semana 2 Completa", "Semana 3 Completa", "Semana 4 Completa"],
    moodBefore: 2,
    moodAfter: 5,
  },
  {
    id: "story-3",
    name: "Carla",
    age: 45,
    avatar: "👩‍🦳",
    role: "Professora",
    daysCompleted: 30,
    mainTransformation: "Encontrou amor-próprio após anos de autocrítica",
    quote: "Aprendi a ser minha melhor amiga, não minha pior inimiga.",
    fullStory: "Carla passava horas se criticando por não ser 'boa o suficiente'. A prática diária de autorreflexão e meditação a transformou. Hoje, ela olha no espelho com compaixão e gratidão, e essa mudança impactou todas as suas relações.",
    highlights: [
      "Parou de comparar-se com outras mulheres",
      "Desenvolveu rotina de autocuidado genuína",
      "Melhorou relacionamento com filhos",
      "Voltou a investir em sua aparência com amor"
    ],
    likes: 312,
    timestamp: "Há 1 semana",
    achievements: ["Semana 1 Completa", "Semana 2 Completa", "Semana 3 Completa", "Semana 4 Completa", "Jornada Completa"],
    moodBefore: 2,
    moodAfter: 5,
  },
  {
    id: "story-4",
    name: "Juliana",
    age: 35,
    avatar: "👩‍🦰",
    role: "Designer e Mãe Solo",
    daysCompleted: 20,
    mainTransformation: "Aprendendo a equilibrar maternidade com identidade pessoal",
    quote: "Ser mãe não significa deixar de ser eu. Estou aprendendo isso agora.",
    fullStory: "Juliana é mãe solo de duas crianças e trabalha como designer freelancer. Sentia-se constantemente culpada por não estar 100% em nenhum lugar. A jornada a ajudou a entender que sua presença presente é mais valiosa que sua disponibilidade total.",
    highlights: [
      "Estabeleceu horários de trabalho definidos",
      "Criou momentos de qualidade com os filhos",
      "Começou a cuidar de sua saúde mental",
      "Sente menos culpa e mais paz"
    ],
    likes: 156,
    timestamp: "Há 3 dias",
    achievements: ["Semana 1 Completa", "Semana 2 Completa"],
    moodBefore: 3,
    moodAfter: 4,
  },
  {
    id: "story-5",
    name: "Beatriz",
    age: 52,
    avatar: "👩‍🦱",
    role: "Executiva",
    daysCompleted: 30,
    mainTransformation: "Redescobriu a vida após síndrome do ninho vazio",
    quote: "Criei uma vida para meus filhos, agora estou criando uma para mim.",
    fullStory: "Com os filhos saindo de casa, Beatriz se viu diante de um espelho e não reconheceu quem estava ali. A jornada de 30 dias foi seu ponto de virada. Ela está redescubrindo hobbies, viajando, e se permitindo sonhar novamente.",
    highlights: [
      "Planejou viagem dos sonhos",
      "Voltou a estudar (fez curso de fotografia)",
      "Fortaleceu amizades antigas",
      "Sente-se viva novamente"
    ],
    likes: 428,
    timestamp: "Há 1 semana",
    achievements: ["Semana 1 Completa", "Semana 2 Completa", "Semana 3 Completa", "Semana 4 Completa", "Jornada Completa"],
    moodBefore: 2,
    moodAfter: 5,
  },
  {
    id: "story-6",
    name: "Sofia",
    age: 40,
    avatar: "👩",
    role: "Psicóloga",
    daysCompleted: 15,
    mainTransformation: "Aplicando a jornada em sua prática profissional",
    quote: "Como posso ajudar outras mulheres se não estou bem comigo mesma?",
    fullStory: "Sofia é psicóloga, mas descobriu que estava tão focada em cuidar dos outros que negligenciava a si mesma. A jornada OUSE SER VOCÊ a ajudou a vivenciar na pele o que seus pacientes experimentam, tornando-a uma profissional mais empática e integrada.",
    highlights: [
      "Melhorou qualidade de suas sessões terapêuticas",
      "Desenvolveu maior compaixão por si mesma",
      "Estabeleceu limites profissionais saudáveis",
      "Inspirou pacientes a fazer a jornada também"
    ],
    likes: 203,
    timestamp: "Há 4 dias",
    achievements: ["Semana 1 Completa"],
    moodBefore: 3,
    moodAfter: 4,
  },
];

export function getRandomStories(count: number = 3): CommunityStory[] {
  const shuffled = [...communityStories].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getMostLikedStories(count: number = 3): CommunityStory[] {
  return [...communityStories].sort((a, b) => b.likes - a.likes).slice(0, count);
}

export function getRecentStories(count: number = 3): CommunityStory[] {
  return [...communityStories].slice(0, count);
}
