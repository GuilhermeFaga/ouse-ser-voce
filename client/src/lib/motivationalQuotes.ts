// OUSE SER VOCÊ – Motivational Quotes
// Frases inspiradoras para as imagens de conquistas

export const motivationalQuotes = [
  // Sobre autoconhecimento e identidade
  "Você é mais forte do que pensa.",
  "Sua jornada é única e valiosa.",
  "Reconhecer-se é o primeiro passo para transformar-se.",
  "Você merece estar em primeiro lugar.",
  "Sua história é inspiradora.",
  
  // Sobre transformação e mudança
  "Pequenas mudanças geram grandes transformações.",
  "Cada dia é uma nova oportunidade.",
  "Você está se tornando a melhor versão de si mesma.",
  "A mudança começa dentro de você.",
  "Sua transformação inspira outras mulheres.",
  
  // Sobre autoestima e amor-próprio
  "Você é digna de amor e respeito.",
  "Ame-se como você ama quem você ama.",
  "Sua autoestima é seu superpoder.",
  "Você brilha quando se ama.",
  "O amor-próprio é revolucionário.",
  
  // Sobre coragem e força
  "Coragem é estar assustada e fazer mesmo assim.",
  "Você é corajosa por estar aqui.",
  "Sua força é inspiradora.",
  "Você consegue mais do que imagina.",
  "Seja corajosa em ser você mesma.",
  
  // Sobre propósito e significado
  "Seu propósito é importante.",
  "Você faz diferença no mundo.",
  "Sua presença importa.",
  "Você está no caminho certo.",
  "Seu propósito está se revelando.",
  
  // Sobre bem-estar e autocuidado
  "Cuidar de si é um ato de amor.",
  "Seu bem-estar é prioridade.",
  "Você merece descanso e paz.",
  "Autocuidado é revolucionário.",
  "Sua saúde emocional importa.",
  
  // Sobre relacionamentos e limites
  "Seus limites são saudáveis.",
  "Você merece relacionamentos respeitosos.",
  "Dizer não é um ato de amor próprio.",
  "Seus limites protegem seu coração.",
  "Você escolhe com quem convive.",
  
  // Sobre resiliência
  "Você já superou 100% das piores dias.",
  "Resiliência é sua natureza.",
  "Você é mais resiliente do que pensa.",
  "Cada obstáculo é uma oportunidade.",
  "Você não desiste de si mesma.",
  
  // Sobre esperança e futuro
  "Seu futuro é brilhante.",
  "Esperança é seu combustível.",
  "Melhores dias estão chegando.",
  "Você está construindo seu melhor futuro.",
  "O melhor ainda está por vir.",
  
  // Sobre comunidade e apoio
  "Você não está sozinha nessa jornada.",
  "Juntas somos mais fortes.",
  "Sua história inspira outras mulheres.",
  "Comunidade é poder.",
  "Você faz parte de algo maior.",
  
  // Sobre celebração e conquistas
  "Celebre cada vitória, por menor que seja.",
  "Você merece celebrar suas conquistas.",
  "Cada passo é uma vitória.",
  "Suas conquistas são reais e importantes.",
  "Você está progredindo.",
  
  // Sobre presença e momento
  "O presente é seu poder.",
  "Viva o agora com presença.",
  "Este momento é seu.",
  "Você está exatamente onde precisa estar.",
  "Presença é um presente para si mesma.",
  
  // Sobre desapego e libertação
  "Você está se libertando do que não serve.",
  "Soltar é um ato de amor próprio.",
  "Você merece leveza.",
  "Liberdade começa dentro de você.",
  "Você está se desapegando do que dói.",
  
  // Sobre gratidão
  "Gratidão transforma sua perspectiva.",
  "Você tem muito pelo qual ser grata.",
  "Gratidão atrai mais bênçãos.",
  "Seu coração é grato.",
  "Aprecie o caminho que você percorreu.",
  
  // Sobre autenticidade
  "Ser autêntica é seu superpoder.",
  "Você é perfeita do jeito que é.",
  "Sua autenticidade inspira.",
  "Seja genuína, sempre.",
  "Você não precisa ser perfeita, precisa ser real.",
];

export function getRandomMotivationalQuote(): string {
  const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
  return motivationalQuotes[randomIndex];
}
