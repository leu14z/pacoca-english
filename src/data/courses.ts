// English Curriculum for Paçoca English: Practical, Accelerative & Real-World

export type ExerciseType =
  | 'word-bank'      // Tap words to build the sentence
  | 'listen-bank'    // Listen to audio then tap words
  | 'multiple-choice'// 1 of 3 options
  | 'match-pairs'    // Connect EN <-> PT word pairs
  | 'speech'         // Speak into the microphone
  | 'dialogue';      // Read dialogue and answer question

export interface Exercise {
  id: string;
  type: ExerciseType;
  prompt: string;           // E.g. "Traduza esta frase" or "Ouça e monte a frase"
  englishPhrase?: string;   // The English phrase (for speech / listening / reference)
  portuguesePhrase?: string;// The PT phrase
  options?: string[];       // Word tiles for word-bank or choices
  correctAnswer: string | string[]; // Expected string or ordered array
  audioText?: string;       // Text to read in English
  tip?: string;             // Grammar tip from Paçoca
  pairItems?: { en: string; pt: string }[];
  dialogueLines?: { speaker: string; avatar?: string; text: string; translation: string }[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  exercises: Exercise[];
}

export interface Unit {
  id: string;
  title: string;
  subtitle: string;
  color: string; // Tailwind color theme (green, blue, amber, purple)
  lessons: Lesson[];
}

export const COURSE_UNITS: Unit[] = [
  {
    id: 'unit-1',
    title: 'Unidade 1: Primeiros Passos & Sobrevivência',
    subtitle: 'Cumprimentos essenciais, pedir comida e se virar na gringa!',
    color: 'emerald',
    lessons: [
      {
        id: 'lesson-1-1',
        title: 'Oi, Tudo Bem? (Greetings)',
        description: 'Aprenda a se apresentar com naturalidade.',
        xpReward: 15,
        exercises: [
          {
            id: 'u1-e1',
            type: 'multiple-choice',
            prompt: 'Como dizer "Olá, prazer em te conhecer!" em inglês?',
            options: [
              'Hello, nice to meet you!',
              'Good morning, I am tired.',
              'Excuse me, where is the coffee?',
            ],
            correctAnswer: 'Hello, nice to meet you!',
            audioText: 'Hello, nice to meet you!',
            tip: '"Nice to meet you" é a forma clássica e educada ao conhecer alguém!',
          },
          {
            id: 'u1-e2',
            type: 'word-bank',
            prompt: 'Traduza para o inglês: "Meu nome é Bryan"',
            portuguesePhrase: 'Meu nome é Bryan',
            options: ['My', 'name', 'is', 'Bryan', 'Her', 'dog', 'are'],
            correctAnswer: ['My', 'name', 'is', 'Bryan'],
            audioText: 'My name is Bryan',
          },
          {
            id: 'u1-e3',
            type: 'match-pairs',
            prompt: 'Combine os pares de vocabulário:',
            pairItems: [
              { en: 'Good morning', pt: 'Bom dia' },
              { en: 'How are you?', pt: 'Como vai você?' },
              { en: 'Thank you', pt: 'Obrigado(a)' },
              { en: 'See you later', pt: 'Até mais' },
            ],
            correctAnswer: '',
          },
          {
            id: 'u1-e4',
            type: 'speech',
            prompt: 'Pressione o microfone e pronuncie a frase em voz alta:',
            englishPhrase: 'Have a great day!',
            portuguesePhrase: 'Tenha um ótimo dia!',
            correctAnswer: 'Have a great day!',
            audioText: 'Have a great day!',
            tip: 'Dica do Paçoca: fale com entusiasmo e clareza no microfone!',
          },
          {
            id: 'u1-e5',
            type: 'listen-bank',
            prompt: 'Ouça o áudio e selecione as palavras correspondentes:',
            audioText: 'I am learning English with Paçoca',
            portuguesePhrase: 'Eu estou aprendendo inglês com o Paçoca',
            options: ['I', 'am', 'learning', 'English', 'with', 'Paçoca', 'eating', 'sleeping'],
            correctAnswer: ['I', 'am', 'learning', 'English', 'with', 'Paçoca'],
          },
        ],
      },
      {
        id: 'lesson-1-2',
        title: 'Café & Restaurante (Ordering Food)',
        description: 'Peça cafés, sobremesas e comidas sem gaguejar.',
        xpReward: 20,
        exercises: [
          {
            id: 'u1-e6',
            type: 'word-bank',
            prompt: 'Traduza: "Posso pedir um café, por favor?"',
            portuguesePhrase: 'Posso pedir um café, por favor?',
            options: ['Can', 'I', 'get', 'a', 'coffee,', 'please?', 'want', 'water', 'hot'],
            correctAnswer: ['Can', 'I', 'get', 'a', 'coffee,', 'please?'],
            audioText: 'Can I get a coffee, please?',
            tip: 'Nativos usam "Can I get..." ou "Could I have..." muito mais do que "I want"!',
          },
          {
            id: 'u1-e7',
            type: 'dialogue',
            prompt: 'Leia o diálogo na cafeteria e responda:',
            dialogueLines: [
              { speaker: 'Barista', text: 'Hi! What can I get started for you today?', translation: 'Olá! O que posso começar para vocês hoje?' },
              { speaker: 'Bryan', text: 'A table for two and two iced lattes, please!', translation: 'Uma mesa para dois e dois lattes gelados, por favor!' },
              { speaker: 'Barista', text: 'Sure thing! Dine in or to go?', translation: 'Com certeza! Comer aqui ou para viagem?' },
            ],
            options: ['Bryan pediu água gelada', 'Bryan pediu uma mesa para dois e dois cafés gelados', 'O café estava fechado'],
            correctAnswer: 'Bryan pediu uma mesa para dois e dois cafés gelados',
            tip: '"Dine in or to go?" é a clássica pergunta de cafeteria no exterior!',
          },
          {
            id: 'u1-e8',
            type: 'match-pairs',
            prompt: 'Combine os termos da cafeteria:',
            pairItems: [
              { en: 'The check, please', pt: 'A conta, por favor' },
              { en: 'Delicious', pt: 'Delicioso' },
              { en: 'Without ice', pt: 'Sem gelo' },
              { en: 'Table for two', pt: 'Mesa para dois' },
            ],
            correctAnswer: '',
          },
          {
            id: 'u1-e9',
            type: 'speech',
            prompt: 'Pratique a pronúncia do pedido:',
            englishPhrase: 'Can we see the menu, please?',
            portuguesePhrase: 'Podemos ver o cardápio, por favor?',
            correctAnswer: 'Can we see the menu, please?',
            audioText: 'Can we see the menu, please?',
          },
        ],
      },
    ],
  },
  {
    id: 'unit-2',
    title: 'Unidade 2: Vida a Dois & Viagens (Casal)',
    subtitle: 'Expressões para curtir juntos, planejar viagens e elogiar!',
    color: 'rose',
    lessons: [
      {
        id: 'lesson-2-1',
        title: 'Carinho & Conexão (Love & Compliments)',
        description: 'Elogios e frases doces para treinar a dois.',
        xpReward: 20,
        exercises: [
          {
            id: 'u2-e1',
            type: 'word-bank',
            prompt: 'Traduza: "Você está incrível hoje!"',
            portuguesePhrase: 'Você está incrível hoje!',
            options: ['You', 'look', 'so', 'amazing', 'today!', 'very', 'sad', 'are'],
            correctAnswer: ['You', 'look', 'so', 'amazing', 'today!'],
            audioText: 'You look so amazing today!',
            tip: 'Use "You look amazing" para elogiar o visual de quem você ama!',
          },
          {
            id: 'u2-e2',
            type: 'multiple-choice',
            prompt: 'Como dizer "Eu amo passar tempo com você"?',
            options: [
              'I love spending time with you.',
              'I have no time for this.',
              'You are spending too much money.',
            ],
            correctAnswer: 'I love spending time with you.',
            audioText: 'I love spending time with you.',
          },
          {
            id: 'u2-e3',
            type: 'match-pairs',
            prompt: 'Combine as frases de carinho:',
            pairItems: [
              { en: 'My love', pt: 'Meu amor' },
              { en: 'I am proud of you', pt: 'Tenho orgulho de você' },
              { en: 'Give me a hug', pt: 'Me dá um abraço' },
              { en: 'Sweetheart', pt: 'Querido(a) / Meu bem' },
            ],
            correctAnswer: '',
          },
          {
            id: 'u2-e4',
            type: 'speech',
            prompt: 'Pronuncie para a pessoa amada:',
            englishPhrase: 'We make a great team!',
            portuguesePhrase: 'Nós formamos uma ótima equipe!',
            correctAnswer: 'We make a great team!',
            audioText: 'We make a great team!',
          },
        ],
      },
      {
        id: 'lesson-2-2',
        title: 'No Aeroporto & Viagem dos Sonhos (Travel)',
        description: 'Embarque, passaporte e chegada no hotel.',
        xpReward: 25,
        exercises: [
          {
            id: 'u2-e5',
            type: 'word-bank',
            prompt: 'Traduza: "Onde fica o portão de embarque?"',
            portuguesePhrase: 'Onde fica o portão de embarque?',
            options: ['Where', 'is', 'the', 'boarding', 'gate?', 'plane', 'ticket', 'late'],
            correctAnswer: ['Where', 'is', 'the', 'boarding', 'gate?'],
            audioText: 'Where is the boarding gate?',
          },
          {
            id: 'u2-e6',
            type: 'dialogue',
            prompt: 'Na imigração do aeroporto:',
            dialogueLines: [
              { speaker: 'Officer', text: 'Good evening. What is the purpose of your visit?', translation: 'Boa noite. Qual o motivo da sua visita?' },
              { speaker: 'Bryan', text: 'We are on vacation for two weeks!', translation: 'Estamos de férias por duas semanas!' },
              { speaker: 'Officer', text: 'Wonderful. Welcome and enjoy your stay!', translation: 'Maravilha. Bem-vindos e aproveitem a estadia!' },
            ],
            options: ['Eles foram a trabalho', 'Eles estão de férias por duas semanas', 'Eles perderam o voo'],
            correctAnswer: 'Eles estão de férias por duas semanas',
          },
          {
            id: 'u2-e7',
            type: 'match-pairs',
            prompt: 'Combine os termos de viagem:',
            pairItems: [
              { en: 'Boarding pass', pt: 'Cartão de embarque' },
              { en: 'Luggage / Baggage', pt: 'Bagagem / Malas' },
              { en: 'Window seat', pt: 'Assento na janela' },
              { en: 'Flight delay', pt: 'Atraso de voo' },
            ],
            correctAnswer: '',
          },
        ],
      },
    ],
  },
  {
    id: 'unit-3',
    title: 'Unidade 3: Conversas Reais, Gírias & Fluência Rápida',
    subtitle: 'Fale como um nativo: gírias, phrasal verbs e situações dinâmicas!',
    color: 'amber',
    lessons: [
      {
        id: 'lesson-3-1',
        title: 'Gírias Nativas & Conversa Casual',
        description: 'As expressões que todo gringo usa o tempo todo.',
        xpReward: 25,
        exercises: [
          {
            id: 'u3-e1',
            type: 'multiple-choice',
            prompt: 'Se um amigo gringo diz "I am down for pizza!", o que ele quer dizer?',
            options: [
              'Eu topo comer pizza / Tô dentro!',
              'A pizza caiu no chão.',
              'Eu não gosto de pizza.',
            ],
            correctAnswer: 'Eu topo comer pizza / Tô dentro!',
            audioText: "I'm down for pizza!",
            tip: '"I am down" significa "estou dentro / super topo"!',
          },
          {
            id: 'u3-e2',
            type: 'word-bank',
            prompt: 'Traduza: "Isso é muito fácil / Mamão com açúcar!"',
            portuguesePhrase: 'Isso é muito fácil!',
            options: ['It', 'is', 'a', 'piece', 'of', 'cake!', 'hard', 'dog', 'banana'],
            correctAnswer: ['It', 'is', 'a', 'piece', 'of', 'cake!'],
            audioText: "It is a piece of cake!",
            tip: '"Piece of cake" é o equivalente em inglês ao nosso "mamão com açúcar"!',
          },
          {
            id: 'u3-e3',
            type: 'match-pairs',
            prompt: 'Combine as gírias com o significado:',
            pairItems: [
              { en: 'No way!', pt: 'De jeito nenhum! / Mentira!' },
              { en: 'Hit me up', pt: 'Me manda uma mensagem' },
              { en: 'For real?', pt: 'É sério? / Sério mesmo?' },
              { en: 'Never mind', pt: 'Deixa pra lá / Esquece' },
            ],
            correctAnswer: '',
          },
          {
            id: 'u3-e4',
            type: 'speech',
            prompt: 'Pronuncie como um nativo norte-americano:',
            englishPhrase: "What's going on guys?",
            portuguesePhrase: 'O que está rolando galera?',
            correctAnswer: "What's going on guys?",
            audioText: "What's going on guys?",
          },
        ],
      },
      {
        id: 'lesson-3-2',
        title: 'Phrasal Verbs que Destravam o Ouvido',
        description: 'Entenda verbos compostos essenciais do dia a dia.',
        xpReward: 30,
        exercises: [
          {
            id: 'u3-e5',
            type: 'word-bank',
            prompt: 'Traduza: "Eu nunca vou desistir dos meus sonhos"',
            portuguesePhrase: 'Eu nunca vou desistir dos meus sonhos',
            options: ['I', 'will', 'never', 'give', 'up', 'on', 'my', 'dreams', 'take', 'sleep'],
            correctAnswer: ['I', 'will', 'never', 'give', 'up', 'on', 'my', 'dreams'],
            audioText: 'I will never give up on my dreams',
            tip: '"Give up" é um dos phrasal verbs mais famosos: Desistir!',
          },
          {
            id: 'u3-e6',
            type: 'match-pairs',
            prompt: 'Combine os Phrasal Verbs:',
            pairItems: [
              { en: 'Hang out', pt: 'Passar um tempo junto / Dar um rolê' },
              { en: 'Figure out', pt: 'Descobrir / Compreender' },
              { en: 'Look for', pt: 'Procurar por algo' },
              { en: 'Wake up', pt: 'Acordar' },
            ],
            correctAnswer: '',
          },
          {
            id: 'u3-e7',
            type: 'listen-bank',
            prompt: 'Ouça o áudio e monte a frase:',
            audioText: 'We can figure this out together',
            portuguesePhrase: 'Nós conseguimos resolver isso juntos',
            options: ['We', 'can', 'figure', 'this', 'out', 'together', 'apart', 'tomorrow'],
            correctAnswer: ['We', 'can', 'figure', 'this', 'out', 'together'],
          },
        ],
      },
    ],
  },
];
