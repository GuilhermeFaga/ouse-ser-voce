// OUSE SER VOCÊ – Dados da Jornada
// 30 dias de conteúdo divididos em 4 módulos semanais

export interface WeekModule {
  week: number;
  title: string;
  subtitle: string;
  description: string;
  theme: string;
}

export interface DayContent {
  day: number;
  week: number;
  theme: string;
  title: string;
  subtitle: string;
  soraiaMessage: string;
  reflection: string;
  affirmation: string;
  exercise: {
    title: string;
    description: string;
    steps: string[];
  };
  journalPrompts: string[];
  meditationTitle: string;
  meditationDuration: string;
  meditationDescription: string;
  audioUrl?: string;
}

export interface ScannerQuestion {
  id: string;
  area:
    | "identidade"
    | "emocional"
    | "autocuidado"
    | "relacionamentos"
    | "proposito";
  question: string;
  options: { label: string; value: number }[];
}

// ─── MÓDULOS SEMANAIS ─────────────────────────────────────────────────────────

export const weekModules: WeekModule[] = [
  {
    week: 1,
    title: "Autoconhecimento e Presença",
    subtitle: "Semana 1",
    theme: "Quem sou eu?",
    description:
      "Esta semana você vai se reencontrar. Vamos explorar sua identidade, seus padrões emocionais, seus sonhos esquecidos e a arte de estar presente consigo mesma.",
  },
  {
    week: 2,
    title: "Desapego e Foco",
    subtitle: "Semana 2",
    theme: "O que eu carrego?",
    description:
      "Chegou a hora de soltar o que não é seu. Vamos trabalhar crenças limitantes, excesso de responsabilidades, relações desgastantes e aprender a direcionar sua energia.",
  },
  {
    week: 3,
    title: "Limites e Autoconfiança",
    subtitle: "Semana 3",
    theme: "Quem eu quero ser?",
    description:
      "Autoestima, comunicação assertiva, culpa, limites saudáveis e o silenciamento da crítica interna. Esta semana você aprende a se defender — de você mesma e dos outros.",
  },
  {
    week: 4,
    title: "Transformação e Prosperidade",
    subtitle: "Semana 4",
    theme: "Para onde eu vou?",
    description:
      "Propósito, resiliência, perdão, comparações e visão de futuro. A semana final é sobre integrar tudo que você descobriu e criar uma nova narrativa para sua vida.",
  },
];

// ─── FRASES MOTIVACIONAIS ─────────────────────────────────────────────────────

export const dailyQuotes: string[] = [
  "Você não perdeu quem você é. Só parou de procurar.",
  "Cuidar de si mesma não é egoísmo. É o ato mais generoso que você pode praticar.",
  "Sua história não termina aqui. Ela está apenas começando a fazer sentido.",
  "Você merece a mesma compaixão que oferece aos outros.",
  "Presença não é perfeição. É honestidade consigo mesma.",
  "O que você sente importa. Sempre importou.",
  "Você não precisa se justificar para existir.",
  "Seus limites são um ato de amor — por você e pelos outros.",
  "A mulher que você está se tornando vale cada passo difícil.",
  "Reconhecer sua dor não é fraqueza. É o começo da cura.",
  "Você tem permissão para mudar de ideia, de caminho, de vida.",
  "Sua voz merece ser ouvida — especialmente por você.",
  "Não existe versão perfeita de você. Existe a versão real.",
  "Soltar não é desistir. É escolher o que realmente importa.",
  "Você não precisa carregar tudo sozinha.",
  "Sua intuição sabe mais do que você imagina.",
  "Cada dia que você se escolhe, você se cura um pouco mais.",
  "Você é mais resiliente do que acredita ser.",
  "Pedir ajuda é um ato de coragem, não de fraqueza.",
  "Seus sonhos não têm data de validade.",
  "Você pode ser gentil e firme ao mesmo tempo.",
  "O passado explica, mas não define quem você é hoje.",
  "Você tem o direito de ocupar espaço neste mundo.",
  "Sua presença já é suficiente.",
  "Transformação começa quando você para de fugir de si mesma.",
  "Você não precisa de aprovação para ser quem você é.",
  "Amor-próprio não é vaidade. É necessidade.",
  "Cada limite que você estabelece é uma declaração de valor.",
  "Você chegou até aqui. E isso já é extraordinário.",
  "A melhor versão de você não está no futuro. Está sendo construída agora.",
];

// ─── CONTEÚDO DOS 30 DIAS ─────────────────────────────────────────────────────

export const dailyContent: DayContent[] = [
  // SEMANA 1 – AUTOCONHECIMENTO E PRESENÇA
  {
    day: 1,
    week: 1,
    theme: "Identidade",
    title: "Quem você é além dos papéis que desempenha?",
    subtitle: "O primeiro passo é se ver.",
    soraiaMessage:
      "Antes de qualquer coisa, quero que você saiba: chegar até aqui já é um ato de coragem. Muitas mulheres passam anos sem se perguntar quem são além de mãe, esposa, filha, profissional. Hoje, vamos começar com a pergunta mais importante: quem é você quando ninguém está olhando?",
    reflection:
      "Desde criança, aprendemos a nos definir pelos papéis que ocupamos. Com o tempo, esses papéis se tornam nossa identidade — e esquecemos que existe uma mulher por trás de tudo isso. Hoje não é sobre o que você faz. É sobre quem você é.",
    affirmation:
      "Eu sou mais do que os papéis que desempenho. Minha essência existe independente do que faço pelos outros.",
    exercise: {
      title: "Carta para você mesma",
      description: "Um exercício simples e poderoso de autoconhecimento.",
      steps: [
        "Encontre um lugar tranquilo e reserve 15 minutos.",
        "Escreva uma carta começando com: 'Querida [seu nome], eu te vejo...'",
        "Descreva quem você é além dos seus papéis — seus gostos, medos, sonhos, qualidades.",
        "Não censure. Deixe fluir sem julgamento.",
        "Ao terminar, releia em voz alta para você mesma.",
      ],
    },
    journalPrompts: [
      "Quando foi a última vez que você fez algo só para você, sem culpa?",
      "Se você pudesse se descrever em 5 palavras honestas, quais seriam?",
      "O que você perdeu de si mesma nos últimos anos?",
    ],
    meditationTitle: "Reencontro com você mesma",
    meditationDuration: "10 min",
    meditationDescription:
      "Uma meditação guiada para você se reconectar com sua essência, além dos papéis e responsabilidades do dia a dia.",
  },
  {
    day: 2,
    week: 1,
    theme: "Padrões Emocionais",
    title: "Os padrões que você repete sem perceber",
    subtitle: "Consciência é o primeiro passo para a mudança.",
    soraiaMessage:
      "Todos nós temos padrões emocionais — respostas automáticas que desenvolvemos para sobreviver. O problema é quando esses padrões nos aprisionam. Hoje vamos iluminar o que está operando nas sombras da sua vida emocional.",
    reflection:
      "Você já se pegou reagindo de uma forma e depois pensando 'por que fiz isso de novo'? Esses são seus padrões em ação. Eles foram úteis em algum momento — mas talvez já não sirvam mais à mulher que você está se tornando.",
    affirmation:
      "Eu tenho consciência dos meus padrões e o poder de escolher respostas diferentes.",
    exercise: {
      title: "Mapeamento de padrões",
      description: "Identifique seus padrões emocionais mais recorrentes.",
      steps: [
        "Pense em uma situação recente que te gerou desconforto emocional.",
        "Escreva o que aconteceu, o que você sentiu e como reagiu.",
        "Agora pergunte: 'Já vivi isso antes? Como costumo reagir nessas situações?'",
        "Identifique o padrão: fuga, controle, complacência, explosão, isolamento...",
        "Escreva como você gostaria de ter reagido.",
      ],
    },
    journalPrompts: [
      "Qual emoção você mais evita sentir? Por quê?",
      "Em quais situações você se sente mais 'fora de controle' emocionalmente?",
      "Que padrão emocional você herdou da sua família?",
    ],
    meditationTitle: "Observando sem julgar",
    meditationDuration: "12 min",
    meditationDescription:
      "Meditação de atenção plena para observar seus padrões emocionais com curiosidade, não com julgamento.",
  },
  {
    day: 3,
    week: 1,
    theme: "Sonhos Esquecidos",
    title: "O que você sonhava antes de 'crescer'?",
    subtitle: "Seus sonhos não morreram. Estão esperando.",
    soraiaMessage:
      "Existe uma versão de você que sonhava livremente — antes das responsabilidades, antes das decepções, antes do 'isso não é possível'. Hoje vamos encontrar essa mulher e ouvir o que ela tem a dizer.",
    reflection:
      "Quando crescemos, aprendemos a 'ser realistas'. Mas muitas vezes confundimos realismo com resignação. Seus sonhos esquecidos carregam pistas importantes sobre quem você realmente é e o que sua alma precisa.",
    affirmation:
      "Meus sonhos são válidos. Tenho permissão de querer mais para minha vida.",
    exercise: {
      title: "Arqueologia dos sonhos",
      description: "Resgate os sonhos que você deixou para trás.",
      steps: [
        "Feche os olhos e volte mentalmente aos seus 10-15 anos.",
        "O que você queria ser? O que te emocionava? O que você amava fazer?",
        "Escreva tudo que vier, sem filtro.",
        "Para cada sonho, escreva: 'Abandonei isso porque...'",
        "Agora pergunte: 'Existe alguma versão desse sonho que ainda faz sentido para mim hoje?'",
      ],
    },
    journalPrompts: [
      "Se dinheiro, tempo e opinião dos outros não fossem obstáculos, o que você faria?",
      "Qual sonho você enterrou por causa de alguém ou de alguma situação?",
      "O que sua versão de 10 anos diria para você hoje?",
    ],
    meditationTitle: "O jardim dos sonhos",
    meditationDuration: "15 min",
    meditationDescription:
      "Uma visualização guiada para reconectar com seus desejos mais profundos e autênticos.",
  },
  {
    day: 4,
    week: 1,
    theme: "Gratidão",
    title: "O que você tem que ainda não viu",
    subtitle: "Gratidão não é negação. É perspectiva.",
    soraiaMessage:
      "Gratidão não é fingir que tudo está bem. É treinar o olhar para enxergar o que existe de bom mesmo quando a vida está difícil. Hoje vamos praticar isso — não como positividade tóxica, mas como um ato de honestidade com o que você já tem.",
    reflection:
      "A mente humana tem uma tendência natural de focar no negativo — isso é biologia, não fraqueza. Praticar gratidão é um ato de resistência consciente. É escolher ver além do que dói.",
    affirmation: "Reconheço o que tenho enquanto trabalho pelo que quero.",
    exercise: {
      title: "Gratidão profunda",
      description: "Além da lista comum de gratidão.",
      steps: [
        "Escreva 3 coisas pelas quais você é grata hoje — mas vá além do óbvio.",
        "Para cada uma, escreva: 'Isso importa porque...'",
        "Agora escreva algo difícil que você viveu e que te ensinou algo valioso.",
        "Termine com: 'Sou grata por ter sobrevivido a isso porque...'",
      ],
    },
    journalPrompts: [
      "Qual qualidade sua você costuma ignorar ou minimizar?",
      "Quem na sua vida merece mais reconhecimento do que você tem dado?",
      "O que sua vida atual tem que sua versão de 5 anos atrás sonhava?",
    ],
    meditationTitle: "Coração aberto",
    meditationDuration: "10 min",
    meditationDescription:
      "Meditação de gratidão para abrir o coração e cultivar uma perspectiva mais amorosa sobre sua vida.",
  },
  {
    day: 5,
    week: 1,
    theme: "Presença",
    title: "Você está aqui, mas está presente?",
    subtitle: "O passado e o futuro roubam o agora.",
    soraiaMessage:
      "Quantas vezes você está fisicamente presente, mas mentalmente em outro lugar — preocupada com o que vai acontecer, ruminando o que já passou? Hoje vamos praticar o ato radical de estar aqui, agora, consigo mesma.",
    reflection:
      "A ausência de presença é uma das formas mais sutis de autoabandono. Quando você não está presente, perde os momentos que constroem sua vida. A prática da presença é um ato de amor-próprio.",
    affirmation: "Estou aqui. Estou presente. Este momento é suficiente.",
    exercise: {
      title: "5 sentidos agora",
      description: "Um exercício de ancoragem no presente.",
      steps: [
        "Pare o que está fazendo por 5 minutos.",
        "Observe: 5 coisas que você pode ver agora.",
        "Toque: 4 texturas diferentes ao seu redor.",
        "Ouça: 3 sons presentes neste momento.",
        "Cheire: 2 aromas que você percebe.",
        "Prove: 1 sabor que você tem na boca.",
        "Respire fundo 3 vezes e pergunte: 'Como estou me sentindo agora?'",
      ],
    },
    journalPrompts: [
      "Em quais momentos você mais perde a presença? O que está pensando nesses momentos?",
      "Quando foi a última vez que você se sentiu completamente presente?",
      "O que a ansiedade sobre o futuro te impede de aproveitar hoje?",
    ],
    meditationTitle: "Aqui e agora",
    meditationDuration: "12 min",
    meditationDescription:
      "Meditação de mindfulness para cultivar a presença plena e reduzir a ruminação mental.",
  },
  {
    day: 6,
    week: 1,
    theme: "Autorreflexão",
    title: "O espelho que você evita",
    subtitle: "Ver a si mesma com clareza é um ato de coragem.",
    soraiaMessage:
      "Autorreflexão honesta é rara. A maioria de nós oscila entre a autocrítica destruidora e a negação protetora. Hoje vamos encontrar o meio-termo: olhar para si mesma com honestidade e compaixão ao mesmo tempo.",
    reflection:
      "Você não precisa ser perfeita para ser digna de amor e respeito. Mas precisa ser honesta consigo mesma para crescer. O espelho da autorreflexão não é para te julgar — é para te conhecer.",
    affirmation:
      "Me vejo com honestidade e compaixão. Sou humana, imperfeita e em constante crescimento.",
    exercise: {
      title: "Inventário pessoal",
      description: "Um olhar honesto e compassivo sobre si mesma.",
      steps: [
        "Divida uma folha em 4 quadrantes: Forças, Áreas de crescimento, O que me orgulha, O que quero mudar.",
        "Preencha cada quadrante com honestidade.",
        "Para cada item de 'O que quero mudar', escreva: 'Um pequeno passo que posso dar é...'",
        "Releia e observe: você foi mais gentil ou mais crítica consigo mesma?",
      ],
    },
    journalPrompts: [
      "Qual é a coisa que você mais tem dificuldade de admitir sobre si mesma?",
      "Em que área da sua vida você está sendo mais honesta? E menos honesta?",
      "O que você precisaria mudar para se sentir mais alinhada com quem você quer ser?",
    ],
    meditationTitle: "Encontro com a verdade",
    meditationDuration: "10 min",
    meditationDescription:
      "Meditação para desenvolver a capacidade de se ver com clareza e compaixão.",
  },
  {
    day: 7,
    week: 1,
    theme: "Integração",
    title: "O que você descobriu sobre si mesma esta semana?",
    subtitle: "Integrar é tão importante quanto descobrir.",
    soraiaMessage:
      "Você completou a primeira semana. Isso não é pouco — é muito. Muitas mulheres chegam até aqui e já sentem algo diferente dentro de si. Hoje é dia de integrar, celebrar e preparar o coração para o que vem a seguir.",
    reflection:
      "Integração é o processo de fazer as descobertas fazerem parte de você — não apenas como conhecimento intelectual, mas como vivência. O que você aprendeu esta semana precisa descer da cabeça para o coração.",
    affirmation:
      "Cada descoberta sobre mim mesma me aproxima de quem eu realmente sou.",
    exercise: {
      title: "Carta de integração",
      description: "Consolide as descobertas da semana.",
      steps: [
        "Releia suas anotações e entradas do diário desta semana.",
        "Escreva: 'Esta semana eu descobri que...' (pelo menos 5 coisas).",
        "Escreva: 'O que mais me surpreendeu foi...'",
        "Escreva: 'O que quero levar para a próxima semana é...'",
        "Termine com uma palavra que define como você se sente agora.",
      ],
    },
    journalPrompts: [
      "Qual foi o momento mais significativo desta semana?",
      "O que você descobriu que não sabia sobre si mesma?",
      "Como você se sente em relação à jornada que está fazendo?",
    ],
    meditationTitle: "Celebração interior",
    meditationDuration: "15 min",
    meditationDescription:
      "Meditação de integração e celebração para honrar o que você viveu e descobriu nesta primeira semana.",
  },

  // SEMANA 2 – DESAPEGO E FOCO
  {
    day: 8,
    week: 2,
    theme: "Crenças Limitantes",
    title: "As histórias que você conta sobre si mesma",
    subtitle: "Crenças não são verdades. São narrativas.",
    soraiaMessage:
      "Desde a infância, construímos narrativas sobre quem somos e o que merecemos. Muitas dessas histórias foram escritas por outros — pais, professores, parceiros, sociedade. Hoje vamos identificar quais histórias estão te limitando.",
    reflection:
      "Uma crença limitante é uma ideia que você aceita como verdade absoluta, mas que na realidade é apenas uma interpretação. 'Não sou boa o suficiente', 'Não mereço ser feliz', 'Sempre vai ser assim' — essas são histórias, não fatos.",
    affirmation: "Tenho o poder de reescrever as histórias que me limitam.",
    exercise: {
      title: "Caça às crenças",
      description: "Identifique e questione suas crenças limitantes.",
      steps: [
        "Complete estas frases sem pensar muito: 'Eu nunca...', 'Eu sempre...', 'Eu não consigo...', 'Eu não mereço...'",
        "Para cada frase, pergunte: 'Isso é um fato ou uma história que eu conto?'",
        "Pergunte: 'Quando aprendi isso? Quem me ensinou?'",
        "Reescreva cada crença em uma versão mais empoderada e realista.",
      ],
    },
    journalPrompts: [
      "Qual crença sobre si mesma mais te limita hoje?",
      "De onde veio essa crença? Quem a plantou em você?",
      "O que seria possível na sua vida se você não acreditasse nisso?",
    ],
    meditationTitle: "Libertando narrativas antigas",
    meditationDuration: "12 min",
    meditationDescription:
      "Meditação para identificar e soltar as histórias que te aprisionam.",
  },
  {
    day: 9,
    week: 2,
    theme: "Excesso de Responsabilidades",
    title: "Você carrega o que não é seu",
    subtitle: "Nem tudo que pesa é sua responsabilidade.",
    soraiaMessage:
      "Muitas mulheres carregam o peso do mundo — a felicidade dos filhos, a estabilidade do relacionamento, o humor do chefe, os problemas da família. Hoje vamos examinar o que você está carregando que não pertence a você.",
    reflection:
      "Existe uma diferença entre ser responsável e ser responsabilizada por tudo. Quando você assume responsabilidades que não são suas, perde energia para cuidar do que realmente importa: você mesma.",
    affirmation: "Cuido do que é meu. Libero o que não me pertence.",
    exercise: {
      title: "Inventário de responsabilidades",
      description: "Separe o que é seu do que não é.",
      steps: [
        "Liste todas as responsabilidades que você carrega atualmente.",
        "Para cada uma, marque: 'É minha responsabilidade?' ou 'Assumi por medo, culpa ou hábito?'",
        "Identifique 3 responsabilidades que você pode delegar ou soltar.",
        "Escreva: 'Ao soltar [X], estou me dando permissão para...'",
      ],
    },
    journalPrompts: [
      "O que você carrega que não é seu? Por que ainda carrega?",
      "Quem se beneficia do seu excesso de responsabilidade?",
      "O que aconteceria se você parasse de carregar tudo sozinha?",
    ],
    meditationTitle: "Soltando o peso",
    meditationDuration: "15 min",
    meditationDescription:
      "Meditação de liberação para soltar responsabilidades que não são suas.",
  },
  {
    day: 10,
    week: 2,
    theme: "Relações Desgastantes",
    title: "As relações que drenam sua energia",
    subtitle: "Nem todo vínculo merece sua energia.",
    soraiaMessage:
      "Algumas relações nos nutrem. Outras nos drenam. Hoje vamos olhar honestamente para os vínculos da sua vida — não para destruí-los, mas para entender o que eles fazem com você.",
    reflection:
      "Uma relação desgastante não precisa ser abusiva para ser prejudicial. Pode ser simplesmente uma relação onde você dá muito mais do que recebe, onde você se sente pequena, invisível ou constantemente culpada.",
    affirmation: "Mereço relações que me nutrem e me fazem crescer.",
    exercise: {
      title: "Mapa de energia relacional",
      description: "Avalie como suas relações afetam sua energia.",
      steps: [
        "Liste as 5 pessoas com quem você mais interage.",
        "Para cada uma, responda: 'Depois de estar com essa pessoa, me sinto...'",
        "Classifique cada relação: Nutre / Neutro / Drena.",
        "Para as que drenam, pergunte: 'O que posso fazer para proteger minha energia nessa relação?'",
      ],
    },
    journalPrompts: [
      "Qual relação na sua vida mais te cansa? Por quê você ainda mantém?",
      "Com quem você se sente mais você mesma? O que essa relação tem de diferente?",
      "O que você teme que aconteça se você estabelecer limites nas relações desgastantes?",
    ],
    meditationTitle: "Protegendo sua energia",
    meditationDuration: "12 min",
    meditationDescription:
      "Meditação para criar um escudo energético e proteger sua paz interior.",
  },
  {
    day: 11,
    week: 2,
    theme: "Autocuidado",
    title: "Você é a última da sua lista?",
    subtitle: "Autocuidado não é luxo. É sobrevivência.",
    soraiaMessage:
      "Você cuida de todos — mas quando foi a última vez que cuidou de você com a mesma dedicação? Hoje vamos falar sobre autocuidado real: não apenas banhos relaxantes, mas sobre se colocar como prioridade.",
    reflection:
      "Autocuidado não é egoísmo. É a base de tudo. Quando você não se cuida, não tem nada para oferecer aos outros — só o que sobra, e sobras não nutrem ninguém.",
    affirmation: "Meu bem-estar é uma prioridade, não uma recompensa.",
    exercise: {
      title: "Plano de autocuidado real",
      description: "Crie um plano de autocuidado que funciona para sua vida.",
      steps: [
        "Escreva: 'Quando me cuido bem, me sinto...'",
        "Liste 10 formas de autocuidado que te fazem bem (pequenas e grandes).",
        "Escolha 3 que você pode praticar esta semana.",
        "Agende na sua agenda como compromisso — não como 'se der tempo'.",
        "Escreva o que você precisa soltar para ter espaço para esse cuidado.",
      ],
    },
    journalPrompts: [
      "Qual é o maior obstáculo para você se cuidar? É real ou é uma crença?",
      "O que você diria para uma amiga que nunca se coloca em primeiro lugar?",
      "Que forma de autocuidado você abandonou que sente falta?",
    ],
    meditationTitle: "Voltando para casa",
    meditationDuration: "10 min",
    meditationDescription:
      "Meditação de autocuidado para nutrir seu corpo, mente e coração.",
  },
  {
    day: 12,
    week: 2,
    theme: "Energia Emocional",
    title: "Para onde vai sua energia emocional?",
    subtitle: "Energia é um recurso finito. Use com sabedoria.",
    soraiaMessage:
      "Sua energia emocional é um recurso precioso. Cada preocupação, cada conflito não resolvido, cada relação tóxica consome uma parte dela. Hoje vamos mapear onde sua energia está indo e recuperar o que foi desperdiçado.",
    reflection:
      "Você já se sentiu exausta sem ter feito nada físico? Isso é esgotamento emocional. Quando sua energia está fragmentada em mil preocupações, não sobra nada para o que realmente importa.",
    affirmation:
      "Direciono minha energia para o que me nutre e me faz crescer.",
    exercise: {
      title: "Auditoria de energia",
      description: "Identifique onde sua energia está sendo gasta.",
      steps: [
        "Escreva tudo que está consumindo sua energia agora (preocupações, conflitos, pendências).",
        "Classifique cada item: 'Posso resolver agora' / 'Não posso controlar' / 'Preciso aceitar'.",
        "Para o que não pode controlar, pratique: 'Solto isso. Não é meu para resolver.'",
        "Escreva 3 coisas que você quer que recebam mais da sua energia.",
      ],
    },
    journalPrompts: [
      "O que está consumindo mais sua energia emocional agora?",
      "Existe algo que você está tentando controlar e não pode? Como seria soltar?",
      "Quando você se sente mais energizada? O que tem nesse momento?",
    ],
    meditationTitle: "Recuperando sua energia",
    meditationDuration: "15 min",
    meditationDescription:
      "Meditação de recuperação energética para restaurar sua vitalidade emocional.",
  },
  {
    day: 13,
    week: 2,
    theme: "Foco",
    title: "O que realmente importa para você?",
    subtitle: "Clareza é poder.",
    soraiaMessage:
      "Vivemos em um mundo que constantemente nos diz o que deveria importar. Mas o que realmente importa para você — não para sua família, não para a sociedade, não para as redes sociais? Hoje vamos encontrar seu foco verdadeiro.",
    reflection:
      "Foco não é sobre fazer mais. É sobre fazer o que importa. Quando você sabe o que realmente importa, fica mais fácil dizer não para o que não importa.",
    affirmation:
      "Sei o que importa para mim e direciono minha vida nessa direção.",
    exercise: {
      title: "As 5 prioridades da sua vida",
      description: "Identifique o que realmente importa.",
      steps: [
        "Imagine que você tem apenas 1 ano de vida. O que você priorizaria?",
        "Escreva as 5 coisas mais importantes para você nesse cenário.",
        "Compare com como você está vivendo agora. Há alinhamento?",
        "Identifique uma mudança pequena que você pode fazer para se aproximar do que importa.",
      ],
    },
    journalPrompts: [
      "No final da sua vida, o que você quer ter vivido? Amado? Realizado?",
      "Existe algo que você faz por obrigação que poderia soltar?",
      "O que você diria não se soubesse o que realmente importa para você?",
    ],
    meditationTitle: "Clareza interior",
    meditationDuration: "12 min",
    meditationDescription:
      "Meditação para conectar com seus valores mais profundos e encontrar clareza sobre o que importa.",
  },
  {
    day: 14,
    week: 2,
    theme: "Integração",
    title: "Você está mais leve?",
    subtitle: "Desapegar é um processo, não um evento.",
    soraiaMessage:
      "Duas semanas. Você chegou até aqui. Talvez você sinta que soltou algumas coisas — ou talvez ainda sinta o peso. Tudo bem. Desapego é um processo que acontece em camadas. Hoje celebramos o que você já soltou.",
    reflection:
      "Desapegar não significa não se importar. Significa escolher conscientemente o que merece sua energia, seu tempo e seu coração. Você está aprendendo a fazer isso.",
    affirmation: "Cada coisa que solto cria espaço para algo melhor entrar.",
    exercise: {
      title: "Ritual de liberação",
      description: "Um ritual simbólico de desapego.",
      steps: [
        "Escreva em um papel tudo que você quer soltar: medos, crenças, relações, responsabilidades.",
        "Leia cada item em voz alta e diga: 'Eu te solto. Você não me define mais.'",
        "Se possível, queime ou rasgue o papel como símbolo de liberação.",
        "Escreva o que você quer receber no espaço que foi criado.",
      ],
    },
    journalPrompts: [
      "O que você conseguiu soltar nesta semana?",
      "O que ainda está difícil de soltar? O que esse apego te dá?",
      "Como você está se sentindo em comparação com o início da jornada?",
    ],
    meditationTitle: "Leveza",
    meditationDuration: "15 min",
    meditationDescription:
      "Meditação de liberação profunda para celebrar o desapego e receber o novo.",
  },

  // SEMANA 3 – LIMITES E AUTOCONFIANÇA
  {
    day: 15,
    week: 3,
    theme: "Autoestima",
    title: "O que você acha de si mesma?",
    subtitle: "Autoestima é a base de tudo.",
    soraiaMessage:
      "Autoestima não é achar que você é perfeita. É acreditar que você tem valor — mesmo com suas imperfeições, mesmo quando erra, mesmo quando não agrada a todos. Hoje vamos trabalhar a raiz da sua relação com você mesma.",
    reflection:
      "A autoestima é construída ao longo da vida — e pode ser reconstruída. Cada vez que você se trata com respeito, cada vez que honra suas necessidades, cada vez que se defende, você está construindo autoestima.",
    affirmation:
      "Tenho valor independente do que faço, do que tenho ou do que os outros pensam.",
    exercise: {
      title: "Carta de amor próprio",
      description: "Escreva para si mesma como escreveria para alguém que ama.",
      steps: [
        "Pense em uma pessoa que você ama incondicionalmente.",
        "Escreva como você a descreveria — suas qualidades, o que você admira nela.",
        "Agora escreva a mesma carta para você mesma.",
        "Se sentir resistência, observe: por que é mais fácil ver o valor nos outros do que em si mesma?",
      ],
    },
    journalPrompts: [
      "Em que situações você se sente menos valiosa? O que acontece nessas situações?",
      "Quais qualidades suas você mais minimiza ou ignora?",
      "O que você precisaria acreditar sobre si mesma para se sentir mais confiante?",
    ],
    meditationTitle: "Amor incondicional",
    meditationDuration: "15 min",
    meditationDescription:
      "Meditação de amor-próprio para cultivar uma relação mais amorosa e respeitosa consigo mesma.",
  },
  {
    day: 16,
    week: 3,
    theme: "Comunicação Assertiva",
    title: "Você diz o que pensa ou o que os outros querem ouvir?",
    subtitle: "Sua voz importa.",
    soraiaMessage:
      "Assertividade é a habilidade de expressar o que você pensa, sente e precisa — com respeito por você e pelo outro. Não é agressividade. Não é passividade. É honestidade corajosa.",
    reflection:
      "Muitas mulheres aprenderam que expressar suas necessidades é egoísmo, que discordar é conflito, que dizer não é crueldade. Hoje vamos desaprender isso.",
    affirmation:
      "Minha voz tem valor. Expresso minhas necessidades com clareza e respeito.",
    exercise: {
      title: "Praticando o não",
      description: "Exercite a assertividade em situações do dia a dia.",
      steps: [
        "Pense em uma situação recente onde você disse sim quando queria dizer não.",
        "Escreva o que você queria dizer de verdade.",
        "Pratique dizer isso em voz alta, sozinha.",
        "Identifique uma situação esta semana onde você pode praticar ser mais assertiva.",
        "Prepare o que vai dizer: 'Eu sinto/penso/preciso... Por isso...'",
      ],
    },
    journalPrompts: [
      "Em quais situações você mais cala o que sente? Por quê?",
      "Qual é o seu maior medo ao se expressar com honestidade?",
      "O que você gostaria de dizer para alguém que ainda não disse?",
    ],
    meditationTitle: "Encontrando sua voz",
    meditationDuration: "10 min",
    meditationDescription:
      "Meditação para fortalecer sua voz interior e cultivar a coragem de se expressar.",
  },
  {
    day: 17,
    week: 3,
    theme: "Culpa",
    title: "A culpa que você carrega sem precisar",
    subtitle: "Nem toda culpa é sua.",
    soraiaMessage:
      "A culpa é uma das emoções mais pesadas que as mulheres carregam. Culpa por trabalhar, por descansar, por querer mais, por não querer, por não ser perfeita. Hoje vamos examinar essa culpa e descobrir o que é real e o que é programação.",
    reflection:
      "Existe a culpa saudável — que nos avisa quando agimos contra nossos valores. E existe a culpa tóxica — que nos pune por simplesmente existir, ter necessidades e ser humana. Aprender a distinguir as duas é libertador.",
    affirmation:
      "Não sou responsável pela felicidade de todos. Tenho permissão de existir sem culpa.",
    exercise: {
      title: "Auditoria da culpa",
      description: "Examine suas culpas e libere as que não são suas.",
      steps: [
        "Liste tudo pelo que você se sente culpada agora.",
        "Para cada item, pergunte: 'Agi contra meus valores? Causei dano real a alguém?'",
        "Se sim: o que você pode fazer para reparar? Se não: isso é culpa tóxica.",
        "Para cada culpa tóxica, escreva: 'Eu me perdoo por ter acreditado que precisava me sentir culpada por isso.'",
      ],
    },
    journalPrompts: [
      "Pelo que você se sente mais culpada? Essa culpa é justa?",
      "Quem se beneficia da sua culpa? Quem plantou essa culpa em você?",
      "O que mudaria na sua vida se você soltasse essa culpa?",
    ],
    meditationTitle: "Libertando a culpa",
    meditationDuration: "15 min",
    meditationDescription:
      "Meditação de perdão e liberação para soltar a culpa que não é sua.",
  },
  {
    day: 18,
    week: 3,
    theme: "Limites Saudáveis",
    title: "Dizer não é um ato de amor",
    subtitle: "Limites protegem o que você mais valoriza.",
    soraiaMessage:
      "Limites não são muros para afastar as pessoas. São cercas que protegem o que você mais valoriza — sua energia, sua paz, sua saúde, seus sonhos. Hoje vamos aprender a construir limites com amor e firmeza.",
    reflection:
      "Quando você não tem limites, permite que outros decidam como você vai se sentir, o que vai fazer e quanto vai se dar. Limites são a linguagem do autorrespeito.",
    affirmation:
      "Meus limites são um ato de amor por mim mesma e pelos outros.",
    exercise: {
      title: "Definindo seus limites",
      description: "Identifique e pratique seus limites.",
      steps: [
        "Escreva 3 situações onde você se sente invadida, desrespeitada ou sobrecarregada.",
        "Para cada uma, defina: 'O que eu preciso que seja diferente?'",
        "Escreva como você comunicaria esse limite: 'Quando X acontece, eu me sinto Y. Preciso que Z.'",
        "Pratique dizer isso em voz alta com firmeza e calma.",
      ],
    },
    journalPrompts: [
      "Em qual área da sua vida você mais precisa de limites?",
      "O que você teme que aconteça quando estabelece limites?",
      "Qual limite você precisa estabelecer agora, mas está adiando?",
    ],
    meditationTitle: "Construindo seu espaço",
    meditationDuration: "12 min",
    meditationDescription:
      "Meditação para fortalecer sua capacidade de estabelecer e manter limites saudáveis.",
  },
  {
    day: 19,
    week: 3,
    theme: "Autoconfiança",
    title: "Você confia em si mesma?",
    subtitle: "Autoconfiança se constrói com ação.",
    soraiaMessage:
      "Autoconfiança não é ausência de medo. É agir apesar do medo. É confiar que você tem recursos internos para lidar com o que vier. Hoje vamos trabalhar essa confiança que talvez você tenha perdido ao longo do caminho.",
    reflection:
      "A autoconfiança é construída por evidências — cada vez que você enfrenta um desafio, cada vez que supera um obstáculo, cada vez que se mantém fiel a si mesma. Você tem mais evidências do que imagina.",
    affirmation:
      "Confio em mim mesma para enfrentar o que vier. Tenho recursos internos poderosos.",
    exercise: {
      title: "Inventário de conquistas",
      description: "Reconheça o que você já superou.",
      steps: [
        "Liste 10 situações difíceis que você já superou na vida.",
        "Para cada uma, escreva: 'O que isso me prova sobre mim?'",
        "Identifique as qualidades que você usou para superar cada situação.",
        "Escreva: 'Sou uma mulher que...' usando essas qualidades.",
      ],
    },
    journalPrompts: [
      "Em que área da sua vida você mais desconfia de si mesma?",
      "Qual foi o momento mais difícil que você já superou? O que isso te diz sobre você?",
      "O que você faria se soubesse que não poderia falhar?",
    ],
    meditationTitle: "Força interior",
    meditationDuration: "12 min",
    meditationDescription:
      "Meditação para acessar sua força interior e cultivar autoconfiança profunda.",
  },
  {
    day: 20,
    week: 3,
    theme: "Crítica Interna",
    title: "A voz que te sabota por dentro",
    subtitle: "Você não precisa acreditar em tudo que pensa.",
    soraiaMessage:
      "Existe uma voz dentro de você que critica, compara, diminui e sabota. Essa voz não é você — é uma coleção de mensagens que você absorveu ao longo da vida. Hoje vamos aprender a reconhecê-la e a responder a ela.",
    reflection:
      "A crítica interna fala com a voz de quem nos machucou — pais exigentes, professores cruéis, parceiros que nos diminuíram. Mas você não precisa mais ouvir essa voz como se fosse a verdade.",
    affirmation: "Sou minha maior aliada, não minha maior crítica.",
    exercise: {
      title: "Diálogo com o crítico interno",
      description: "Transforme a relação com sua voz crítica.",
      steps: [
        "Escreva o que sua voz crítica diz com mais frequência.",
        "Pergunte: 'De onde veio essa voz? Quem falava assim comigo?'",
        "Agora escreva uma resposta compassiva — como uma amiga responderia.",
        "Pratique: quando a voz crítica aparecer, diga: 'Obrigada pela preocupação, mas eu escolho me tratar com gentileza.'",
      ],
    },
    journalPrompts: [
      "O que sua voz crítica diz com mais frequência? Você acredita nisso?",
      "Como você trataria uma amiga que dissesse as mesmas coisas que você diz para si mesma?",
      "Qual seria o impacto na sua vida se você substituísse a autocrítica por autocompaixão?",
    ],
    meditationTitle: "Silenciando o crítico",
    meditationDuration: "15 min",
    meditationDescription:
      "Meditação de autocompaixão para transformar a relação com sua voz crítica interior.",
  },
  {
    day: 21,
    week: 3,
    theme: "Integração",
    title: "Três semanas. Você está diferente.",
    subtitle: "A transformação já está acontecendo.",
    soraiaMessage:
      "Três semanas. Você trabalhou autoestima, comunicação, culpa, limites e autoconfiança. Isso é profundo. Hoje vamos pausar, respirar e reconhecer o quanto você cresceu.",
    reflection:
      "Transformação não é um evento dramático. É uma série de pequenas escolhas que, somadas, mudam tudo. Cada vez que você se escolheu, cada vez que foi honesta consigo mesma, você se transformou.",
    affirmation:
      "Estou em transformação constante. Cada passo me aproxima de quem eu realmente sou.",
    exercise: {
      title: "Carta para o futuro",
      description: "Escreva para a mulher que você está se tornando.",
      steps: [
        "Imagine você daqui a 6 meses — mais confiante, mais presente, mais você.",
        "Escreva uma carta para essa mulher.",
        "Descreva o que ela conquistou, como ela se sente, quem ela é.",
        "Termine com: 'Estou a caminho de ser você. E mal posso esperar.'",
      ],
    },
    journalPrompts: [
      "Qual foi a maior mudança que você percebeu em si mesma até agora?",
      "O que você fez nessas 3 semanas que a versão de você antes da jornada não faria?",
      "O que você mais quer trabalhar na última semana?",
    ],
    meditationTitle: "Encontrando a nova você",
    meditationDuration: "15 min",
    meditationDescription:
      "Meditação de integração para honrar sua transformação e preparar o coração para a semana final.",
  },

  // SEMANA 4 – TRANSFORMAÇÃO E PROSPERIDADE
  {
    day: 22,
    week: 4,
    theme: "Propósito",
    title: "Para que você veio ao mundo?",
    subtitle: "Propósito não é destino. É direção.",
    soraiaMessage:
      "Propósito não é uma grande missão grandiosa que você precisa descobrir. É a direção que faz sua vida fazer sentido — o que te move, o que te dá energia, o que você faz que faz o mundo um pouco melhor.",
    reflection:
      "Muitas mulheres acreditam que não têm propósito porque não encontraram 'a grande missão'. Mas propósito pode estar nos pequenos atos — na forma como você cuida, cria, conecta, inspira.",
    affirmation: "Minha vida tem propósito. Estou aqui por uma razão.",
    exercise: {
      title: "Encontrando seu propósito",
      description: "Descubra o que te move.",
      steps: [
        "Responda: O que você faz que faz o tempo passar sem perceber?",
        "Responda: O que as pessoas sempre pedem sua ajuda ou conselho?",
        "Responda: O que te indigna no mundo? (Indignação aponta para valores.)",
        "Responda: O que você faria de graça se pudesse?",
        "Encontre o fio que conecta essas respostas — esse é seu propósito.",
      ],
    },
    journalPrompts: [
      "O que você faz que te faz sentir que está contribuindo com algo maior?",
      "Se você pudesse deixar uma mensagem para o mundo, qual seria?",
      "O que você quer que as pessoas lembrem de você?",
    ],
    meditationTitle: "Chamado interior",
    meditationDuration: "15 min",
    meditationDescription:
      "Meditação para conectar com seu propósito mais profundo e encontrar clareza sobre sua direção.",
  },
  {
    day: 23,
    week: 4,
    theme: "Resiliência",
    title: "Você é mais forte do que acredita",
    subtitle: "Resiliência não é não cair. É se levantar.",
    soraiaMessage:
      "Você já passou por coisas difíceis. Já se levantou quando achava que não conseguia. Já sobreviveu ao que parecia impossível. Hoje vamos honrar essa força e aprender a cultivá-la conscientemente.",
    reflection:
      "Resiliência não é endurecer o coração. É ter raízes profundas o suficiente para dobrar sem quebrar. É saber que você tem recursos internos para enfrentar o que vier.",
    affirmation: "Sou resiliente. Cada desafio me fortalece e me ensina.",
    exercise: {
      title: "Mapa da resiliência",
      description: "Reconheça sua força através das suas histórias.",
      steps: [
        "Escreva os 3 momentos mais difíceis da sua vida.",
        "Para cada um, escreva: 'Como eu sobrevivi a isso?'",
        "Identifique as forças que você usou: coragem, fé, humor, apoio, determinação...",
        "Escreva: 'Sou resiliente porque já provei que consigo...'",
      ],
    },
    journalPrompts: [
      "Qual foi o momento mais difícil da sua vida? O que você aprendeu sobre si mesma?",
      "Que recursos internos você usa quando enfrenta adversidades?",
      "O que você diria para uma mulher que está passando pelo que você já passou?",
    ],
    meditationTitle: "Raízes profundas",
    meditationDuration: "12 min",
    meditationDescription:
      "Meditação para fortalecer suas raízes internas e cultivar resiliência profunda.",
  },
  {
    day: 24,
    week: 4,
    theme: "Perdão",
    title: "O perdão que te liberta",
    subtitle: "Perdoar não é absolver. É se libertar.",
    soraiaMessage:
      "Perdão é um dos temas mais mal compreendidos. Perdoar não é dizer que o que aconteceu estava certo. Não é reconciliar. É soltar o peso que você carrega — não pelo outro, mas por você.",
    reflection:
      "Guardar mágoa é como tomar veneno esperando que o outro morra. O perdão é um presente que você se dá. E o perdão mais importante — e muitas vezes o mais difícil — é o perdão a si mesma.",
    affirmation: "Escolho o perdão como um ato de amor por mim mesma.",
    exercise: {
      title: "Carta de perdão",
      description: "Um exercício poderoso de liberação.",
      steps: [
        "Escreva uma carta para alguém que te machucou — sem enviar.",
        "Escreva tudo que você sente: raiva, dor, decepção.",
        "Termine com: 'Eu te perdoo — não porque o que você fez estava certo, mas porque eu mereço ser livre.'",
        "Agora escreva uma carta de perdão para você mesma.",
      ],
    },
    journalPrompts: [
      "Quem você ainda não perdoou? O que essa mágoa te custa?",
      "O que você precisa se perdoar? Por que é difícil?",
      "Como seria sua vida se você soltasse essa mágoa?",
    ],
    meditationTitle: "Libertação pelo perdão",
    meditationDuration: "20 min",
    meditationDescription:
      "Meditação profunda de perdão para soltar mágoas e se libertar do passado.",
  },
  {
    day: 25,
    week: 4,
    theme: "Comparações",
    title: "Você não está em competição com ninguém",
    subtitle: "Sua jornada é única. Sua medida é você mesma.",
    soraiaMessage:
      "As redes sociais tornaram a comparação uma epidemia. Mas comparar sua vida com a vida dos outros é comparar seu bastidor com o palco deles. Hoje vamos trabalhar a armadilha da comparação.",
    reflection:
      "Quando você se compara, perde de vista o que é único em você. Cada mulher tem uma jornada diferente, com pontos de partida diferentes, desafios diferentes. Sua medida não é a outra — é você mesma.",
    affirmation:
      "Minha jornada é única. Me comparo apenas com quem eu era ontem.",
    exercise: {
      title: "Desintoxicação de comparações",
      description: "Identifique e transforme o hábito de se comparar.",
      steps: [
        "Escreva com quem você mais se compara e em quais áreas.",
        "Para cada comparação, pergunte: 'O que essa comparação me diz sobre o que eu valorizo?'",
        "Escreva: 'Em vez de me comparar com X, vou me inspirar em X para...'",
        "Identifique 3 coisas únicas na sua jornada que ninguém mais tem.",
      ],
    },
    journalPrompts: [
      "Com quem você mais se compara? O que essa pessoa representa para você?",
      "O que você tem que os outros não têm?",
      "Como seria sua vida se você parasse de se comparar?",
    ],
    meditationTitle: "Singularidade",
    meditationDuration: "10 min",
    meditationDescription:
      "Meditação para celebrar sua unicidade e soltar a armadilha das comparações.",
  },
  {
    day: 26,
    week: 4,
    theme: "Prosperidade",
    title: "Você merece prosperar",
    subtitle: "Prosperidade começa na sua mente.",
    soraiaMessage:
      "Prosperidade não é só dinheiro. É abundância em todas as áreas — saúde, relacionamentos, amor, paz, realização. Hoje vamos trabalhar sua relação com o merecimento e com a abundância.",
    reflection:
      "Muitas mulheres sabotam sua própria prosperidade porque no fundo acreditam que não merecem. Que é egoísmo querer mais. Que outras pessoas precisam mais. Hoje vamos desafiar essa crença.",
    affirmation: "Mereço prosperar em todas as áreas da minha vida.",
    exercise: {
      title: "Mapa da prosperidade",
      description: "Expanda sua visão de abundância.",
      steps: [
        "Escreva o que prosperidade significa para você em 5 áreas: saúde, relacionamentos, trabalho, finanças, espiritualidade.",
        "Para cada área, escreva: 'Atualmente estou em...' e 'Quero chegar em...'",
        "Identifique uma crença que te impede de prosperar em cada área.",
        "Reescreva cada crença em uma afirmação de abundância.",
      ],
    },
    journalPrompts: [
      "Em qual área da sua vida você mais sente escassez? De onde vem essa sensação?",
      "O que você acredita que precisa acontecer para você merecer mais?",
      "O que seria diferente na sua vida se você acreditasse que merece prosperar?",
    ],
    meditationTitle: "Abundância",
    meditationDuration: "15 min",
    meditationDescription:
      "Meditação de abundância para abrir sua mente e coração para receber o que você merece.",
  },
  {
    day: 27,
    week: 4,
    theme: "Visão de Futuro",
    title: "Que mulher você quer ser?",
    subtitle: "Visão sem ação é sonho. Ação sem visão é esforço.",
    soraiaMessage:
      "Você chegou até aqui. Conheceu a si mesma, soltou o que não era seu, construiu confiança e começou a se ver de forma diferente. Agora é hora de olhar para frente — não com ansiedade, mas com esperança e intenção.",
    reflection:
      "Uma visão clara do futuro não é uma fantasia. É um mapa. Quando você sabe para onde quer ir, cada decisão do presente se torna mais clara.",
    affirmation:
      "Tenho uma visão clara de quem quero ser e caminho em direção a ela todos os dias.",
    exercise: {
      title: "Visão de futuro",
      description: "Crie uma visão clara e inspiradora do seu futuro.",
      steps: [
        "Feche os olhos e imagine você daqui a 1 ano — vivendo de acordo com seus valores.",
        "Escreva com detalhes: Como você acorda? Como se sente? O que faz? Com quem está?",
        "Identifique 3 mudanças concretas que você precisa fazer para chegar lá.",
        "Escreva um compromisso: 'A partir de hoje, eu me comprometo a...'",
      ],
    },
    journalPrompts: [
      "Que mulher você quer ser daqui a 1 ano?",
      "Qual é o primeiro passo concreto em direção a essa visão?",
      "O que você está disposta a mudar para chegar lá?",
    ],
    meditationTitle: "Visualizando o futuro",
    meditationDuration: "20 min",
    meditationDescription:
      "Meditação de visualização criativa para conectar com sua visão de futuro e ativar sua intenção.",
  },
  {
    day: 28,
    week: 4,
    theme: "Gratidão Profunda",
    title: "Obrigada por ter chegado até aqui",
    subtitle: "Gratidão pela jornada — não só pelo destino.",
    soraiaMessage:
      "Faltam apenas 3 dias. Quero que você saiba: o fato de você ter chegado até aqui já é uma transformação. Não importa quantos dias você completou — o que importa é que você se escolheu. E isso muda tudo.",
    reflection:
      "Gratidão pela jornada — não só pelo destino. Cada dia difícil, cada insight doloroso, cada momento de resistência fez parte da sua transformação.",
    affirmation: "Sou grata pela jornada que me trouxe até aqui.",
    exercise: {
      title: "Carta de gratidão para a jornada",
      description: "Honre o caminho percorrido.",
      steps: [
        "Escreva uma carta de gratidão para esta jornada.",
        "Agradeça pelos momentos difíceis e pelo que eles te ensinaram.",
        "Agradeça pelas descobertas, mesmo as que doeram.",
        "Agradeça para você mesma por ter se escolhido.",
      ],
    },
    journalPrompts: [
      "Pelo que você é mais grata nesta jornada?",
      "Qual foi o dia mais difícil? O que ele te ensinou?",
      "O que você diria para uma amiga que está considerando fazer esta jornada?",
    ],
    meditationTitle: "Gratidão pela jornada",
    meditationDuration: "15 min",
    meditationDescription:
      "Meditação de gratidão profunda para honrar tudo que você viveu e aprendeu.",
  },
  {
    day: 29,
    week: 4,
    theme: "Integração Final",
    title: "Você não é mais a mesma",
    subtitle: "A transformação já aconteceu.",
    soraiaMessage:
      "Você começou esta jornada como uma mulher que se sentia desconectada de si mesma. Hoje, você é uma mulher que se conhece melhor, que tem mais clareza sobre o que importa, que sabe que merece cuidado e amor. Isso é real. Isso é seu.",
    reflection:
      "Transformação não é chegar a um destino. É tornar-se. E você está em processo de se tornar — a cada dia, a cada escolha, a cada vez que se trata com gentileza.",
    affirmation:
      "Sou uma mulher em transformação. Cada dia me torno mais eu mesma.",
    exercise: {
      title: "Antes e depois",
      description: "Compare quem você era com quem você é agora.",
      steps: [
        "Releia sua avaliação inicial.",
        "Escreva: 'Antes eu acreditava que... Agora eu sei que...'",
        "Escreva: 'Antes eu me tratava... Agora eu me trato...'",
        "Escreva: 'A maior transformação que aconteceu em mim foi...'",
      ],
    },
    journalPrompts: [
      "Como você é diferente hoje em comparação com o dia 1?",
      "Qual descoberta desta jornada vai ficar com você para sempre?",
      "O que você quer continuar praticando depois que a jornada terminar?",
    ],
    meditationTitle: "A nova você",
    meditationDuration: "20 min",
    meditationDescription:
      "Meditação de integração final para honrar sua transformação e celebrar quem você se tornou.",
  },
  {
    day: 30,
    week: 4,
    theme: "Celebração",
    title: "30 dias. Você fez isso.",
    subtitle: "Este é apenas o começo.",
    soraiaMessage:
      "Você chegou. 30 dias de coragem, honestidade e amor-próprio. Você se escolheu todos os dias — e isso é extraordinário. Hoje não é um fim. É um novo começo. Você tem ferramentas, clareza e uma relação diferente com você mesma. O que você faz com isso agora é sua escolha.",
    reflection:
      "Esta jornada foi sobre você se reencontrar. E você encontrou. Agora é sobre continuar escolhendo ser você — todos os dias, em cada decisão, em cada limite que estabelece, em cada vez que se trata com gentileza.",
    affirmation: "Eu me escolho. Hoje e todos os dias.",
    exercise: {
      title: "Manifesto pessoal",
      description: "Escreva o manifesto da mulher que você se tornou.",
      steps: [
        "Escreva: 'Eu sou uma mulher que...' (pelo menos 10 afirmações poderosas).",
        "Escreva: 'Eu mereço...' (pelo menos 5 coisas).",
        "Escreva: 'Eu me comprometo a...' (pelo menos 5 compromissos).",
        "Leia em voz alta, de pé, com a mão no coração.",
        "Guarde este manifesto. Releia sempre que precisar se lembrar de quem você é.",
      ],
    },
    journalPrompts: [
      "O que você quer dizer para você mesma neste último dia?",
      "Qual é o seu maior presente para si mesma a partir de hoje?",
      "O que você quer que a mulher que você é hoje saiba?",
    ],
    meditationTitle: "Celebração e novo começo",
    meditationDuration: "20 min",
    meditationDescription:
      "Meditação de celebração e intenção para honrar sua jornada e abrir o coração para o que vem a seguir.",
  },
];

// ─── SCANNER DE ESSÊNCIA ──────────────────────────────────────────────────────

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

export function calculateScannerResults(answers: Record<string, number>) {
  const areas = [
    "identidade",
    "emocional",
    "autocuidado",
    "relacionamentos",
    "proposito",
  ] as const;
  const areaScores: Record<string, number[]> = {
    identidade: [],
    emocional: [],
    autocuidado: [],
    relacionamentos: [],
    proposito: [],
  };

  scannerQuestions.forEach(q => {
    if (answers[q.id] !== undefined) {
      areaScores[q.area].push(answers[q.id]);
    }
  });

  const percentages: Record<string, number> = {};
  let totalScore = 0;
  let minScore = 100;
  let criticalArea = "identidade";

  areas.forEach(area => {
    const scores = areaScores[area];
    if (scores.length === 0) {
      percentages[area] = 50;
      return;
    }
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const pct = Math.round((avg / 5) * 100);
    percentages[area] = pct;
    totalScore += pct;
    if (pct < minScore) {
      minScore = pct;
      criticalArea = area;
    }
  });

  const avgScore = Math.round(totalScore / areas.length);
  const abandonmentLevel = 100 - avgScore;

  const abandonmentLabel =
    abandonmentLevel >= 70
      ? "Alto"
      : abandonmentLevel >= 40
        ? "Moderado"
        : "Baixo";

  const areaNames: Record<string, string> = {
    identidade: "Identidade",
    emocional: "Equilíbrio Emocional",
    autocuidado: "Autocuidado",
    relacionamentos: "Relacionamentos",
    proposito: "Propósito",
  };

  const explanations: Record<string, string> = {
    identidade:
      "Você está desconectada de quem você realmente é. Seus papéis (mãe, esposa, profissional) tomaram tanto espaço que a mulher por trás deles ficou invisível. O trabalho mais urgente é se reencontrar — descobrir seus valores, desejos e identidade além do que você faz pelos outros.",
    emocional:
      "Sua vida emocional está sobrecarregada. Você pode estar evitando sentir, se julgando por suas emoções ou operando no limite do esgotamento. O trabalho mais urgente é aprender a acolher suas emoções com compaixão e cuidar da sua saúde emocional.",
    autocuidado:
      "Você está no final da sua própria lista de prioridades. O autocuidado foi substituído por obrigações, e a culpa aparece quando você tenta se cuidar. O trabalho mais urgente é se colocar como prioridade — não como luxo, mas como necessidade.",
    relacionamentos:
      "Suas relações estão te drenando mais do que te nutrindo. Você pode estar com dificuldade de estabelecer limites, expressar suas necessidades ou se sentindo invisível nas relações. O trabalho mais urgente é aprender a se comunicar com assertividade e proteger sua energia.",
    proposito:
      "Você está sem direção e sem sentido. Pode estar vivendo no piloto automático, sem clareza sobre o que realmente importa para você. O trabalho mais urgente é reconectar com seus valores, sonhos e o que dá sentido à sua vida.",
  };

  const recommendations: Record<string, string> = {
    identidade:
      "Esta semana, reserve 15 minutos por dia para escrever sobre quem você é além dos seus papéis. Comece com: 'Quando ninguém está olhando, eu sou...' Não censure. Deixe fluir.",
    emocional:
      "Hoje, identifique uma emoção que você tem evitado sentir. Sente-se em silêncio por 5 minutos e permita que ela esteja presente — sem julgamento, sem tentar resolver. Apenas observe.",
    autocuidado:
      "Hoje, escolha uma coisa pequena que você faria só para você — um chá, uma caminhada, 10 minutos de silêncio. Faça isso sem pedir permissão e sem se justificar para ninguém.",
    relacionamentos:
      "Esta semana, pratique dizer não para uma coisa que você normalmente diria sim por obrigação. Observe como você se sente antes, durante e depois.",
    proposito:
      "Hoje, escreva 3 coisas que te fazem perder a noção do tempo quando você as faz. Essas atividades contêm pistas importantes sobre o que dá sentido à sua vida.",
  };

  return {
    percentages,
    totalScore: avgScore,
    abandonmentLevel,
    abandonmentLabel,
    criticalArea,
    criticalAreaName: areaNames[criticalArea],
    explanation: explanations[criticalArea],
    recommendation: recommendations[criticalArea],
  };
}

