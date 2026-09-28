// English Curriculum with Modules & Levels for Beginners, Family & Advanced Progression

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
  prompt: string;
  englishPhrase?: string;
  portuguesePhrase?: string;
  options?: string[];
  correctAnswer: string | string[];
  audioText?: string;
  tip?: string;
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
  moduleTitle: string; // E.g. "MÓDULO 1: NÍVEL ZERO ABSOLUTO"
  title: string;       // E.g. "Unidade 1: Primeiras Palavras & Educação Básica"
  subtitle: string;
  color: string;
  lessons: Lesson[];
}

export const COURSE_UNITS: Unit[] = [
  // ==========================================
  // MÓDULO 1: NÍVEL ZERO (PRIMEIRO CONTATO)
  // ==========================================
  {
    id: 'unit-1',
    moduleTitle: 'MÓDULO 1: NÍVEL ZERO (PRIMEIRO CONTATO)',
    title: 'Unidade 1: Primeiras Palavras & Educação',
    subtitle: 'Aprenda as palavras mais básicas e essenciais do inglês!',
    color: 'emerald',
    lessons: [
      {
        id: 'lesson-1-1',
        title: 'Sim, Não, Por Favor e Obrigado',
        description: 'As 4 palavras mágicas que todo mundo precisa saber.',
        xpReward: 15,
        exercises: [
          {
            id: 'u1-e1',
            type: 'multiple-choice',
            prompt: 'Como se diz "Por favor" em inglês?',
            options: ['Please', 'Thank you', 'Hello'],
            correctAnswer: 'Please',
            audioText: 'Please',
            tip: '"Please" é pronunciado como "plííz" e significa "Por favor"!',
          },
          {
            id: 'u1-e2',
            type: 'multiple-choice',
            prompt: 'Como se diz "Obrigado(a)" em inglês?',
            options: ['Thank you', 'Yes', 'Goodbye'],
            correctAnswer: 'Thank you',
            audioText: 'Thank you',
            tip: '"Thank you" significa "Obrigado" ou "Obrigada"!',
          },
          {
            id: 'u1-e3',
            type: 'match-pairs',
            prompt: 'Combine cada palavra com seu significado em português:',
            pairItems: [
              { en: 'Yes', pt: 'Sim' },
              { en: 'No', pt: 'Não' },
              { en: 'Please', pt: 'Por favor' },
              { en: 'Thank you', pt: 'Obrigado(a)' },
            ],
            correctAnswer: '',
          },
          {
            id: 'u1-e4',
            type: 'speech',
            prompt: 'Toque no microfone e diga "Thank you" com clareza:',
            englishPhrase: 'Thank you',
            portuguesePhrase: 'Obrigado(a)',
            correctAnswer: 'Thank you',
            audioText: 'Thank you',
            tip: 'Dica do Paçoca: fale devagar e perto do microfone!',
          },
          {
            id: 'u1-e5',
            type: 'word-bank',
            prompt: 'Monte em inglês: "Sim, por favor"',
            portuguesePhrase: 'Sim, por favor',
            options: ['Yes,', 'please', 'No,', 'water', 'hello'],
            correctAnswer: ['Yes,', 'please'],
            audioText: 'Yes, please',
          },
        ],
      },
      {
        id: 'lesson-1-2',
        title: 'Cumprimentos do Dia (Bom dia & Olá)',
        description: 'Aprenda a cumprimentar as pessoas em qualquer hora do dia.',
        xpReward: 15,
        exercises: [
          {
            id: 'u1-e6',
            type: 'multiple-choice',
            prompt: 'O que significa "Good morning"?',
            options: ['Bom dia', 'Boa noite', 'Até logo'],
            correctAnswer: 'Bom dia',
            audioText: 'Good morning',
            tip: '"Morning" significa manhã. "Good morning" = Bom dia!',
          },
          {
            id: 'u1-e7',
            type: 'match-pairs',
            prompt: 'Ligue os cumprimentos correspondentes:',
            pairItems: [
              { en: 'Hello', pt: 'Olá' },
              { en: 'Good morning', pt: 'Bom dia' },
              { en: 'Good night', pt: 'Boa noite' },
              { en: 'Goodbye', pt: 'Adeus / Tchau' },
            ],
            correctAnswer: '',
          },
          {
            id: 'u1-e8',
            type: 'word-bank',
            prompt: 'Monte a frase: "Olá, bom dia!"',
            portuguesePhrase: 'Olá, bom dia!',
            options: ['Hello,', 'good', 'morning!', 'night', 'water'],
            correctAnswer: ['Hello,', 'good', 'morning!'],
            audioText: 'Hello, good morning!',
          },
          {
            id: 'u1-e9',
            type: 'speech',
            prompt: 'Pronuncie a saudação em voz alta:',
            englishPhrase: 'Good morning!',
            portuguesePhrase: 'Bom dia!',
            correctAnswer: 'Good morning!',
            audioText: 'Good morning!',
          },
        ],
      },
      {
        id: 'lesson-1-3',
        title: 'Coisas Básicas: Água, Pão e Café',
        description: 'Vocabulário essencial para não passar fome nem sede!',
        xpReward: 20,
        exercises: [
          {
            id: 'u1-e10',
            type: 'match-pairs',
            prompt: 'Combine os alimentos e bebidas:',
            pairItems: [
              { en: 'Water', pt: 'Água' },
              { en: 'Coffee', pt: 'Café' },
              { en: 'Bread', pt: 'Pão' },
              { en: 'Milk', pt: 'Leite' },
            ],
            correctAnswer: '',
          },
          {
            id: 'u1-e11',
            type: 'word-bank',
            prompt: 'Traduza: "Água, por favor"',
            portuguesePhrase: 'Água, por favor',
            options: ['Water,', 'please', 'Coffee,', 'milk', 'bread'],
            correctAnswer: ['Water,', 'please'],
            audioText: 'Water, please',
          },
          {
            id: 'u1-e12',
            type: 'listen-bank',
            prompt: 'Ouça o áudio e selecione as palavras:',
            audioText: 'Coffee and milk',
            portuguesePhrase: 'Café e leite',
            options: ['Coffee', 'and', 'milk', 'water', 'bread'],
            correctAnswer: ['Coffee', 'and', 'milk'],
          },
          {
            id: 'u1-e13',
            type: 'speech',
            prompt: 'Diga no microfone: "Water, please"',
            englishPhrase: 'Water, please',
            portuguesePhrase: 'Água, por favor',
            correctAnswer: 'Water, please',
            audioText: 'Water, please',
          },
        ],
      },
    ],
  },

  {
    id: 'unit-2',
    moduleTitle: 'MÓDULO 1: NÍVEL ZERO (PRIMEIRO CONTATO)',
    title: 'Unidade 2: Apresentação Pessoal & Família',
    subtitle: 'Aprenda a dizer seu nome e falar sobre seus pais e parceiro(a)!',
    color: 'sky',
    lessons: [
      {
        id: 'lesson-2-1',
        title: 'Quem Sou Eu? (Eu sou Leo)',
        description: 'Diga seu nome e pergunte o nome de outra pessoa.',
        xpReward: 20,
        exercises: [
          {
            id: 'u2-e1',
            type: 'multiple-choice',
            prompt: 'Como dizer "Meu nome é Leo" em inglês?',
            options: ['My name is Leo', 'I have a dog', 'Where is Leo?'],
            correctAnswer: 'My name is Leo',
            audioText: 'My name is Leo',
            tip: '"My name is" significa "Meu nome é"!',
          },
          {
            id: 'u2-e2',
            type: 'word-bank',
            prompt: 'Monte a frase: "Eu sou o Leo"',
            portuguesePhrase: 'Eu sou o Leo',
            options: ['I', 'am', 'Leo', 'You', 'are', 'name'],
            correctAnswer: ['I', 'am', 'Leo'],
            audioText: 'I am Leo',
          },
          {
            id: 'u2-e3',
            type: 'match-pairs',
            prompt: 'Combine os pronomes e termos básicos:',
            pairItems: [
              { en: 'I am', pt: 'Eu sou / Eu estou' },
              { en: 'You are', pt: 'Você é / Você está' },
              { en: 'My name', pt: 'Meu nome' },
              { en: 'Nice to meet you', pt: 'Prazer em te conhecer' },
            ],
            correctAnswer: '',
          },
          {
            id: 'u2-e4',
            type: 'speech',
            prompt: 'Fale com orgulho para o Paçoca:',
            englishPhrase: 'Nice to meet you!',
            portuguesePhrase: 'Prazer em te conhecer!',
            correctAnswer: 'Nice to meet you!',
            audioText: 'Nice to meet you!',
          },
        ],
      },
      {
        id: 'lesson-2-2',
        title: 'A Família (Pai, Mãe e Amor)',
        description: 'Palavras para falar de quem a gente mais ama.',
        xpReward: 20,
        exercises: [
          {
            id: 'u2-e5',
            type: 'match-pairs',
            prompt: 'Combine os membros da família:',
            pairItems: [
              { en: 'Father', pt: 'Pai' },
              { en: 'Mother', pt: 'Mãe' },
              { en: 'Son', pt: 'Filho' },
              { en: 'My love', pt: 'Meu amor' },
            ],
            correctAnswer: '',
          },
          {
            id: 'u2-e6',
            type: 'word-bank',
            prompt: 'Traduza: "Eu amo minha família"',
            portuguesePhrase: 'Eu amo minha família',
            options: ['I', 'love', 'my', 'family', 'coffee', 'water', 'car'],
            correctAnswer: ['I', 'love', 'my', 'family'],
            audioText: 'I love my family',
          },
          {
            id: 'u2-e7',
            type: 'speech',
            prompt: 'Diga a frase com carinho:',
            englishPhrase: 'I love my family',
            portuguesePhrase: 'Eu amo minha família',
            correctAnswer: 'I love my family',
            audioText: 'I love my family',
          },
        ],
      },
    ],
  },

  // ==========================================
  // MÓDULO 2: NÍVEL BÁSICO (CONSTRUINDO FRASES)
  // ==========================================
  {
    id: 'unit-3',
    moduleTitle: 'MÓDULO 2: NÍVEL BÁSICO PRÁTICO',
    title: 'Unidade 3: Onde Fica? (Lugares & Direções)',
    subtitle: 'Descubra como perguntar onde fica o banheiro, hotel ou rua!',
    color: 'rose',
    lessons: [
      {
        id: 'lesson-3-1',
        title: 'Onde fica o banheiro? (Perguntas Vitais)',
        description: 'A pergunta número um de qualquer viagem ao exterior.',
        xpReward: 25,
        exercises: [
          {
            id: 'u3-e1',
            type: 'multiple-choice',
            prompt: 'Como perguntar "Onde fica o banheiro?" em inglês?',
            options: [
              'Where is the restroom?',
              'What time is it?',
              'Can I have a coffee?',
            ],
            correctAnswer: 'Where is the restroom?',
            audioText: 'Where is the restroom?',
            tip: '"Where is" significa "Onde fica / Onde está"! E "Restroom" ou "Bathroom" é banheiro!',
          },
          {
            id: 'u3-e2',
            type: 'word-bank',
            prompt: 'Monte a frase: "Onde fica o hotel?"',
            portuguesePhrase: 'Onde fica o hotel?',
            options: ['Where', 'is', 'the', 'hotel?', 'restroom', 'car', 'water'],
            correctAnswer: ['Where', 'is', 'the', 'hotel?'],
            audioText: 'Where is the hotel?',
          },
          {
            id: 'u3-e3',
            type: 'match-pairs',
            prompt: 'Combine os lugares importantes:',
            pairItems: [
              { en: 'Bathroom / Restroom', pt: 'Banheiro' },
              { en: 'Hotel', pt: 'Hotel' },
              { en: 'Airport', pt: 'Aeroporto' },
              { en: 'Restaurant', pt: 'Restaurante' },
            ],
            correctAnswer: '',
          },
          {
            id: 'u3-e4',
            type: 'speech',
            prompt: 'Pratique falar a pergunta de emergência:',
            englishPhrase: 'Where is the restroom?',
            portuguesePhrase: 'Onde fica o banheiro?',
            correctAnswer: 'Where is the restroom?',
            audioText: 'Where is the restroom?',
          },
        ],
      },
      {
        id: 'lesson-3-2',
        title: 'Pedindo Comida no Restaurante',
        description: 'Faça seu pedido e peça a conta sem medo de errar.',
        xpReward: 25,
        exercises: [
          {
            id: 'u3-e5',
            type: 'word-bank',
            prompt: 'Traduza: "Uma mesa para dois, por favor"',
            portuguesePhrase: 'Uma mesa para dois, por favor',
            options: ['A', 'table', 'for', 'two,', 'please', 'one', 'coffee', 'water'],
            correctAnswer: ['A', 'table', 'for', 'two,', 'please'],
            audioText: 'A table for two, please',
          },
          {
            id: 'u3-e6',
            type: 'match-pairs',
            prompt: 'Combine as frases do garçom e do cliente:',
            pairItems: [
              { en: 'The check, please', pt: 'A conta, por favor' },
              { en: 'How much is it?', pt: 'Quanto custa isso?' },
              { en: 'Delicious', pt: 'Delicioso' },
              { en: 'Can I see the menu?', pt: 'Posso ver o cardápio?' },
            ],
            correctAnswer: '',
          },
          {
            id: 'u3-e7',
            type: 'dialogue',
            prompt: 'Leia a conversa e responda:',
            dialogueLines: [
              { speaker: 'Garçom', text: 'Hello! A table for two?', translation: 'Olá! Uma mesa para dois?' },
              { speaker: 'Leo', text: 'Yes, please! And two coffees.', translation: 'Sim, por favor! E dois cafés.' },
              { speaker: 'Garçom', text: 'Right away, sir!', translation: 'Já estou trazendo, senhor!' },
            ],
            options: ['Leo pediu água', 'Leo pediu uma mesa para dois e dois cafés', 'O restaurante estava sem café'],
            correctAnswer: 'Leo pediu uma mesa para dois e dois cafés',
          },
          {
            id: 'u3-e8',
            type: 'speech',
            prompt: 'Peça a conta com elegância:',
            englishPhrase: 'The check, please',
            portuguesePhrase: 'A conta, por favor',
            correctAnswer: 'The check, please',
            audioText: 'The check, please',
          },
        ],
      },
    ],
  },

  // ==========================================
  // MÓDULO 3: CONVERSAÇÃO REAL & FLUÊNCIA
  // ==========================================
  {
    id: 'unit-4',
    moduleTitle: 'MÓDULO 3: VIAGENS & SITUAÇÕES REAIS (A2)',
    title: 'Unidade 4: Viagens, Aeroporto & Imigração',
    subtitle: 'Passaporte, imigração e desembarque como um viajante experiente.',
    color: 'amber',
    lessons: [
      {
        id: 'lesson-4-1',
        title: 'No Aeroporto & Imigração',
        description: 'Responda as perguntas da imigração com calma.',
        xpReward: 30,
        exercises: [
          {
            id: 'u4-e1',
            type: 'word-bank',
            prompt: 'Traduza: "Onde fica o portão de embarque?"',
            portuguesePhrase: 'Onde fica o portão de embarque?',
            options: ['Where', 'is', 'the', 'boarding', 'gate?', 'ticket', 'flight', 'passport'],
            correctAnswer: ['Where', 'is', 'the', 'boarding', 'gate?'],
            audioText: 'Where is the boarding gate?',
          },
          {
            id: 'u4-e2',
            type: 'match-pairs',
            prompt: 'Combine os termos do aeroporto:',
            pairItems: [
              { en: 'Passport', pt: 'Passaporte' },
              { en: 'Boarding pass', pt: 'Cartão de embarque' },
              { en: 'Luggage', pt: 'Bagagem / Malas' },
              { en: 'Vacation', pt: 'Férias' },
            ],
            correctAnswer: '',
          },
          {
            id: 'u4-e3',
            type: 'speech',
            prompt: 'Diga na imigração com confiança:',
            englishPhrase: 'We are on vacation',
            portuguesePhrase: 'Nós estamos de férias',
            correctAnswer: 'We are on vacation',
            audioText: 'We are on vacation',
          },
        ],
      },
    ],
  },

  // ==========================================
  // MÓDULO 4: HOTEL & CIDADE (A2)
  // ==========================================
  {
    id: 'unit-5',
    moduleTitle: 'MÓDULO 4: HOTEL & CIDADE (A2)',
    title: 'Unidade 5: Hotel & Hospedagem',
    subtitle: 'Faça check-in, peça a senha do Wi-Fi e tire dúvidas na recepção!',
    color: 'sky',
    lessons: [
      {
        id: 'lesson-5-1',
        title: 'Fazendo o Check-in no Hotel',
        description: 'Diga que você tem uma reserva e peça a chave do quarto.',
        xpReward: 25,
        exercises: [
          {
            id: 'u5-e1',
            type: 'multiple-choice',
            prompt: 'Como dizer "Eu tenho uma reserva" em inglês?',
            options: ['I have a reservation', 'Where is my car?', 'Can I leave?'],
            correctAnswer: 'I have a reservation',
            audioText: 'I have a reservation',
            tip: '"I have a reservation" é a frase exata para se apresentar na recepção!',
          },
          {
            id: 'u5-e2',
            type: 'word-bank',
            prompt: 'Traduza: "Qual é a senha do Wi-Fi?"',
            portuguesePhrase: 'Qual é a senha do Wi-Fi?',
            options: ['What', 'is', 'the', 'Wi-Fi', 'password?', 'room', 'key', 'breakfast'],
            correctAnswer: ['What', 'is', 'the', 'Wi-Fi', 'password?'],
            audioText: 'What is the Wi-Fi password?',
          },
          {
            id: 'u5-e3',
            type: 'match-pairs',
            prompt: 'Combine os termos do hotel:',
            pairItems: [
              { en: 'Room key', pt: 'Chave do quarto' },
              { en: 'Breakfast included', pt: 'Café da manhã incluso' },
              { en: 'Elevator', pt: 'Elevador' },
              { en: 'Check-out time', pt: 'Horário de saída' },
            ],
            correctAnswer: '',
          },
          {
            id: 'u5-e4',
            type: 'speech',
            prompt: 'Fale na recepção do hotel:',
            englishPhrase: 'I have a reservation',
            portuguesePhrase: 'Eu tenho uma reserva',
            correctAnswer: 'I have a reservation',
            audioText: 'I have a reservation',
          },
        ],
      },
    ],
  },

  // ==========================================
  // MÓDULO 5: TRABALHO & CARREIRA (B1)
  // ==========================================
  {
    id: 'unit-6',
    moduleTitle: 'MÓDULO 5: TRABALHO & CARREIRA (B1)',
    title: 'Unidade 6: Reuniões, E-mails & Negócios',
    subtitle: 'Comunique-se em reuniões e responda e-mails profissionais com segurança.',
    color: 'emerald',
    lessons: [
      {
        id: 'lesson-6-1',
        title: 'Agendando Reuniões & Opiniões',
        description: 'Frases essenciais para colaborar com equipes em inglês.',
        xpReward: 30,
        exercises: [
          {
            id: 'u6-e1',
            type: 'multiple-choice',
            prompt: 'Como dizer "Vamos agendar uma reunião" no trabalho?',
            options: [
              "Let's schedule a meeting",
              'Where is the meeting room?',
              'I am not working today',
            ],
            correctAnswer: "Let's schedule a meeting",
            audioText: "Let's schedule a meeting",
            tip: '"Schedule" significa agendar ou marcar um compromisso!',
          },
          {
            id: 'u6-e2',
            type: 'word-bank',
            prompt: 'Traduza: "Eu concordo com você"',
            portuguesePhrase: 'Eu concordo com você',
            options: ['I', 'agree', 'with', 'you', 'disagree', 'think', 'email', 'project'],
            correctAnswer: ['I', 'agree', 'with', 'you'],
            audioText: 'I agree with you',
          },
          {
            id: 'u6-e3',
            type: 'match-pairs',
            prompt: 'Combine as frases do ambiente corporativo:',
            pairItems: [
              { en: 'Could you send me the report?', pt: 'Você poderia me enviar o relatório?' },
              { en: 'Deadline', pt: 'Prazo de entrega' },
              { en: 'Project manager', pt: 'Gerente de projeto' },
              { en: 'Great job, team!', pt: 'Ótimo trabalho, equipe!' },
            ],
            correctAnswer: '',
          },
          {
            id: 'u6-e4',
            type: 'speech',
            prompt: 'Expresse concordância em inglês:',
            englishPhrase: 'I agree with you',
            portuguesePhrase: 'Eu concordo com você',
            correctAnswer: 'I agree with you',
            audioText: 'I agree with you',
          },
        ],
      },
    ],
  },

  // ==========================================
  // MÓDULO 6: EXPRESSÕES NATIVAS & FLUÊNCIA (B1)
  // ==========================================
  {
    id: 'unit-7',
    moduleTitle: 'MÓDULO 6: CONVERSAÇÃO FLUENTE & GÍRIAS (B1)',
    title: 'Unidade 7: Expressões Nativas do Dia a Dia',
    subtitle: 'Fale como um nativo usando idioms e gírias naturais.',
    color: 'rose',
    lessons: [
      {
        id: 'lesson-7-1',
        title: 'Expressões Populares (No worries & Take your time)',
        description: 'As frases mais usadas no dia a dia que não se traduzem ao pé da letra.',
        xpReward: 30,
        exercises: [
          {
            id: 'u7-e1',
            type: 'multiple-choice',
            prompt: 'O que um nativo quer dizer quando diz "No worries"?',
            options: [
              'Sem problemas! / De nada!',
              'Estou muito preocupado',
              'Não quero falar com você',
            ],
            correctAnswer: 'Sem problemas! / De nada!',
            audioText: 'No worries',
            tip: '"No worries" é super comum nos EUA, Austrália e UK para "De nada / Sem estresse"!',
          },
          {
            id: 'u7-e2',
            type: 'word-bank',
            prompt: 'Traduza a expressão: "Sem pressa / Com calma"',
            portuguesePhrase: 'Sem pressa / Leve o tempo que precisar',
            options: ['Take', 'your', 'time', 'Hurry', 'up', 'fast', 'slow'],
            correctAnswer: ['Take', 'your', 'time'],
            audioText: 'Take your time',
          },
          {
            id: 'u7-e3',
            type: 'match-pairs',
            prompt: 'Ligue cada expressão nativa ao seu real significado:',
            pairItems: [
              { en: 'No worries', pt: 'Sem problemas / Tranquilo' },
              { en: 'Take your time', pt: 'Sem pressa / Vá no seu tempo' },
              { en: "It's up to you", pt: 'Você que decide / Fica a seu critério' },
              { en: 'Keep in touch', pt: 'Vamos manter contato' },
            ],
            correctAnswer: '',
          },
          {
            id: 'u7-e4',
            type: 'speech',
            prompt: 'Diga a expressão com naturalidade:',
            englishPhrase: 'Take your time',
            portuguesePhrase: 'Sem pressa / Vá no seu tempo',
            correctAnswer: 'Take your time',
            audioText: 'Take your time',
          },
        ],
      },
    ],
  },
];

export interface CourseModule {
  id: string;
  number: number;
  title: string;
  shortTitle: string;
  level: 'A1' | 'A2' | 'B1';
  subtitle: string;
  color: string;
  unitIds: string[];
}

export const COURSE_MODULES: CourseModule[] = [
  {
    id: 'module-1',
    number: 1,
    title: 'Módulo 1: Nível Zero (Primeiro Contato)',
    shortTitle: 'Primeiros Passos & Família',
    level: 'A1',
    subtitle: 'Palavras essenciais, saudações e como apresentar você e quem você ama.',
    color: 'emerald',
    unitIds: ['unit-1', 'unit-2'],
  },
  {
    id: 'module-2',
    number: 2,
    title: 'Módulo 2: Dia a Dia & Restaurante',
    shortTitle: 'Restaurante & Comida',
    level: 'A2',
    subtitle: 'Faça pedidos, converse com garçons e peça a conta com elegância.',
    color: 'rose',
    unitIds: ['unit-3'],
  },
  {
    id: 'module-3',
    number: 3,
    title: 'Módulo 3: Viagens & Aeroporto',
    shortTitle: 'Aeroporto & Imigração',
    level: 'A2',
    subtitle: 'Cartão de embarque, portão, alfândega e desembarque seguro.',
    color: 'amber',
    unitIds: ['unit-4'],
  },
  {
    id: 'module-4',
    number: 4,
    title: 'Módulo 4: Hotel & Hospedagem',
    shortTitle: 'Hotel & Check-in',
    level: 'A2',
    subtitle: 'Faça check-in, peça a senha do Wi-Fi e tire dúvidas na recepção.',
    color: 'sky',
    unitIds: ['unit-5'],
  },
  {
    id: 'module-5',
    number: 5,
    title: 'Módulo 5: Trabalho & Carreira',
    shortTitle: 'Reuniões & E-mails',
    level: 'B1',
    subtitle: 'Comunique-se em reuniões e colabore profissionalmente em inglês.',
    color: 'indigo',
    unitIds: ['unit-6'],
  },
  {
    id: 'module-6',
    number: 6,
    title: 'Módulo 6: Conversação Fluente & Gírias',
    shortTitle: 'Expressões Nativas',
    level: 'B1',
    subtitle: 'Idioms e gírias do dia a dia para soar natural como um nativo.',
    color: 'purple',
    unitIds: ['unit-7'],
  },
];

