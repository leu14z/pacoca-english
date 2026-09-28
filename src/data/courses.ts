// English Curriculum with Distinct Levels (A1, A2, B1)
// Cleanly segmented so learners only see content of their category

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
  level: 'A1' | 'A2' | 'B1';
  moduleTitle: string;
  title: string;
  subtitle: string;
  color: string;
  icon: string;
  lessons: Lesson[];
}

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

export const COURSE_UNITS: Unit[] = [
  {
    "id": "unit-1",
    "level": "A1",
    "moduleTitle": "NÍVEL A1 • INICIANTE",
    "title": "Unidade 1: Primeiras Palavras & Educação Básica",
    "subtitle": "Sim, não, por favor, obrigado e os cumprimentos essenciais.",
    "color": "emerald",
    "icon": "👋",
    "lessons": [
      {
        "id": "lesson-1-1",
        "title": "Sim, Não, Por Favor e Obrigado",
        "description": "As 4 palavras mais importantes do inglês!",
        "xpReward": 15,
        "exercises": [
          {
            "id": "u1-e1",
            "type": "multiple-choice",
            "prompt": "Como se diz \"Por favor\" em inglês?",
            "options": [
              "Please",
              "Thank you",
              "Hello"
            ],
            "correctAnswer": "Please",
            "audioText": "Please",
            "tip": "\"Please\" é pronunciado como \"plííz\" e significa \"Por favor\"!"
          },
          {
            "id": "u1-e2",
            "type": "multiple-choice",
            "prompt": "Como se diz \"Obrigado(a)\" em inglês?",
            "options": [
              "Thank you",
              "Yes",
              "Goodbye"
            ],
            "correctAnswer": "Thank you",
            "audioText": "Thank you",
            "tip": "\"Thank you\" significa \"Obrigado\" ou \"Obrigada\"!"
          },
          {
            "id": "u1-e3",
            "type": "match-pairs",
            "prompt": "Combine cada palavra com seu significado em português:",
            "pairItems": [
              {
                "en": "Yes",
                "pt": "Sim"
              },
              {
                "en": "No",
                "pt": "Não"
              },
              {
                "en": "Please",
                "pt": "Por favor"
              },
              {
                "en": "Thank you",
                "pt": "Obrigado(a)"
              }
            ],
            "correctAnswer": ""
          },
          {
            "id": "u1-e4",
            "type": "speech",
            "prompt": "Toque no microfone e diga \"Thank you\" com clareza:",
            "englishPhrase": "Thank you",
            "portuguesePhrase": "Obrigado(a)",
            "correctAnswer": "Thank you",
            "audioText": "Thank you",
            "tip": "Dica do Paçoca: fale com calma perto do microfone!"
          },
          {
            "id": "u1-e5",
            "type": "word-bank",
            "prompt": "Monte em inglês: \"Sim, por favor\"",
            "portuguesePhrase": "Sim, por favor",
            "options": [
              "Yes,",
              "please",
              "No,",
              "water",
              "hello"
            ],
            "correctAnswer": [
              "Yes,",
              "please"
            ],
            "audioText": "Yes, please"
          }
        ]
      },
      {
        "id": "lesson-1-2",
        "title": "Cumprimentos do Dia (Bom dia & Olá)",
        "description": "Aprenda a cumprimentar em qualquer horário.",
        "xpReward": 15,
        "exercises": [
          {
            "id": "u1-e6",
            "type": "multiple-choice",
            "prompt": "O que significa \"Good morning\"?",
            "options": [
              "Bom dia",
              "Boa noite",
              "Até logo"
            ],
            "correctAnswer": "Bom dia",
            "audioText": "Good morning",
            "tip": "\"Morning\" é manhã. \"Good morning\" = Bom dia!"
          },
          {
            "id": "u1-e7",
            "type": "match-pairs",
            "prompt": "Ligue os cumprimentos correspondentes:",
            "pairItems": [
              {
                "en": "Hello",
                "pt": "Olá"
              },
              {
                "en": "Good morning",
                "pt": "Bom dia"
              },
              {
                "en": "Good night",
                "pt": "Boa noite"
              },
              {
                "en": "Goodbye",
                "pt": "Adeus / Tchau"
              }
            ],
            "correctAnswer": ""
          },
          {
            "id": "u1-e8",
            "type": "word-bank",
            "prompt": "Monte a frase: \"Olá, bom dia!\"",
            "portuguesePhrase": "Olá, bom dia!",
            "options": [
              "Hello,",
              "good",
              "morning!",
              "night",
              "water"
            ],
            "correctAnswer": [
              "Hello,",
              "good",
              "morning!"
            ],
            "audioText": "Hello, good morning!"
          },
          {
            "id": "u1-e9",
            "type": "speech",
            "prompt": "Pronuncie a saudação em voz alta:",
            "englishPhrase": "Good morning!",
            "portuguesePhrase": "Bom dia!",
            "correctAnswer": "Good morning!",
            "audioText": "Good morning!"
          }
        ]
      },
      {
        "id": "lesson-1-3",
        "title": "Bebidas e Comidas Básicas (Água e Café)",
        "description": "Vocabulário de sobrevivência: água, café, pão e leite.",
        "xpReward": 20,
        "exercises": [
          {
            "id": "u1-e10",
            "type": "match-pairs",
            "prompt": "Combine os alimentos e bebidas:",
            "pairItems": [
              {
                "en": "Water",
                "pt": "Água"
              },
              {
                "en": "Coffee",
                "pt": "Café"
              },
              {
                "en": "Bread",
                "pt": "Pão"
              },
              {
                "en": "Milk",
                "pt": "Leite"
              }
            ],
            "correctAnswer": ""
          },
          {
            "id": "u1-e11",
            "type": "word-bank",
            "prompt": "Traduza: \"Água, por favor\"",
            "portuguesePhrase": "Água, por favor",
            "options": [
              "Water,",
              "please",
              "Coffee,",
              "milk",
              "bread"
            ],
            "correctAnswer": [
              "Water,",
              "please"
            ],
            "audioText": "Water, please"
          },
          {
            "id": "u1-e12",
            "type": "speech",
            "prompt": "Diga no microfone: \"Water, please\"",
            "englishPhrase": "Water, please",
            "portuguesePhrase": "Água, por favor",
            "correctAnswer": "Water, please",
            "audioText": "Water, please"
          }
        ]
      }
    ]
  },
  {
    "id": "unit-2",
    "level": "A1",
    "moduleTitle": "NÍVEL A1 • INICIANTE",
    "title": "Unidade 2: Apresentação Pessoal & Família",
    "subtitle": "Diga seu nome e fale sobre seus pais, parceiro(a) e amigos.",
    "color": "sky",
    "icon": "👨‍👩‍👦",
    "lessons": [
      {
        "id": "lesson-2-1",
        "title": "Quem Sou Eu? (Eu sou o Leo)",
        "description": "Dizer seu nome e perguntar o nome de alguém.",
        "xpReward": 20,
        "exercises": [
          {
            "id": "u2-e1",
            "type": "multiple-choice",
            "prompt": "Como dizer \"Meu nome é Leo\" em inglês?",
            "options": [
              "My name is Leo",
              "I have a dog",
              "Where is Leo?"
            ],
            "correctAnswer": "My name is Leo",
            "audioText": "My name is Leo",
            "tip": "\"My name is\" significa \"Meu nome é\"!"
          },
          {
            "id": "u2-e2",
            "type": "word-bank",
            "prompt": "Monte a frase: \"Eu sou o Leo\"",
            "portuguesePhrase": "Eu sou o Leo",
            "options": [
              "I",
              "am",
              "Leo",
              "You",
              "are",
              "name"
            ],
            "correctAnswer": [
              "I",
              "am",
              "Leo"
            ],
            "audioText": "I am Leo"
          },
          {
            "id": "u2-e3",
            "type": "match-pairs",
            "prompt": "Combine os termos básicos de apresentação:",
            "pairItems": [
              {
                "en": "I am",
                "pt": "Eu sou / Eu estou"
              },
              {
                "en": "You are",
                "pt": "Você é / Você está"
              },
              {
                "en": "My name",
                "pt": "Meu nome"
              },
              {
                "en": "Nice to meet you",
                "pt": "Prazer em te conhecer"
              }
            ],
            "correctAnswer": ""
          },
          {
            "id": "u2-e4",
            "type": "speech",
            "prompt": "Apresente-se no microfone com clareza:",
            "englishPhrase": "My name is Leo",
            "portuguesePhrase": "Meu nome é Leo",
            "correctAnswer": "My name is Leo",
            "audioText": "My name is Leo"
          }
        ]
      },
      {
        "id": "lesson-2-2",
        "title": "Membros da Família (Pai & Mãe)",
        "description": "Apresente seus pais e familiares com orgulho.",
        "xpReward": 20,
        "exercises": [
          {
            "id": "u2-e5",
            "type": "match-pairs",
            "prompt": "Conecte os parentes em inglês e português:",
            "pairItems": [
              {
                "en": "Father",
                "pt": "Pai"
              },
              {
                "en": "Mother",
                "pt": "Mãe"
              },
              {
                "en": "Brother",
                "pt": "Irmão"
              },
              {
                "en": "Sister",
                "pt": "Irmã"
              }
            ],
            "correctAnswer": ""
          },
          {
            "id": "u2-e6",
            "type": "word-bank",
            "prompt": "Traduza: \"Esta é a minha mãe\"",
            "portuguesePhrase": "Esta é a minha mãe",
            "options": [
              "This",
              "is",
              "my",
              "mother",
              "father",
              "brother"
            ],
            "correctAnswer": [
              "This",
              "is",
              "my",
              "mother"
            ],
            "audioText": "This is my mother"
          },
          {
            "id": "u2-e7",
            "type": "speech",
            "prompt": "Apresente seu pai em inglês:",
            "englishPhrase": "This is my father",
            "portuguesePhrase": "Este é meu pai",
            "correctAnswer": "This is my father",
            "audioText": "This is my father"
          }
        ]
      },
      {
        "id": "lesson-2-3",
        "title": "Amor & Parceiro(a) (Namorada & Esposa)",
        "description": "Como apresentar a namorada, namorado ou esposa.",
        "xpReward": 25,
        "exercises": [
          {
            "id": "u2-e8",
            "type": "match-pairs",
            "prompt": "Combine os termos de relacionamento:",
            "pairItems": [
              {
                "en": "Girlfriend",
                "pt": "Namorada"
              },
              {
                "en": "Boyfriend",
                "pt": "Namorado"
              },
              {
                "en": "Wife",
                "pt": "Esposa"
              },
              {
                "en": "Husband",
                "pt": "Marido"
              }
            ],
            "correctAnswer": ""
          },
          {
            "id": "u2-e9",
            "type": "word-bank",
            "prompt": "Traduza: \"Esta é a minha namorada\"",
            "portuguesePhrase": "Esta é a minha namorada",
            "options": [
              "This",
              "is",
              "my",
              "girlfriend",
              "friend",
              "sister"
            ],
            "correctAnswer": [
              "This",
              "is",
              "my",
              "girlfriend"
            ],
            "audioText": "This is my girlfriend"
          },
          {
            "id": "u2-e10",
            "type": "speech",
            "prompt": "Diga com carinho no microfone:",
            "englishPhrase": "This is my girlfriend",
            "portuguesePhrase": "Esta é minha namorada",
            "correctAnswer": "This is my girlfriend",
            "audioText": "This is my girlfriend"
          }
        ]
      }
    ]
  },
  {
    "id": "unit-3-a1",
    "level": "A1",
    "moduleTitle": "NÍVEL A1 • INICIANTE",
    "title": "Unidade 3: Números, Horas & Dias da Semana",
    "subtitle": "Conte de 1 a 10, pergunte as horas e conheça os dias da semana.",
    "color": "amber",
    "icon": "🔢",
    "lessons": [
      {
        "id": "lesson-3-a1-1",
        "title": "Contando de 1 a 10",
        "description": "One, two, three... Aprenda os números essenciais.",
        "xpReward": 15,
        "exercises": [
          {
            "id": "u3a1-e1",
            "type": "match-pairs",
            "prompt": "Ligue cada número ao seu nome:",
            "pairItems": [
              {
                "en": "One",
                "pt": "Um (1)"
              },
              {
                "en": "Two",
                "pt": "Dois (2)"
              },
              {
                "en": "Three",
                "pt": "Três (3)"
              },
              {
                "en": "Four",
                "pt": "Quatro (4)"
              }
            ],
            "correctAnswer": ""
          },
          {
            "id": "u3a1-e2",
            "type": "multiple-choice",
            "prompt": "Qual número é \"Five\"?",
            "options": [
              "Cinco (5)",
              "Dez (10)",
              "Sete (7)"
            ],
            "correctAnswer": "Cinco (5)",
            "audioText": "Five"
          },
          {
            "id": "u3a1-e3",
            "type": "word-bank",
            "prompt": "Monte: \"One, two, three\"",
            "portuguesePhrase": "Um, dois, três",
            "options": [
              "One,",
              "two,",
              "three",
              "four",
              "five"
            ],
            "correctAnswer": [
              "One,",
              "two,",
              "three"
            ],
            "audioText": "One, two, three"
          },
          {
            "id": "u3a1-e4",
            "type": "speech",
            "prompt": "Fale no microfone os números 1, 2, 3:",
            "englishPhrase": "One, two, three",
            "portuguesePhrase": "Um, dois, três",
            "correctAnswer": "One, two, three",
            "audioText": "One, two, three"
          }
        ]
      },
      {
        "id": "lesson-3-a1-2",
        "title": "Que Horas São? (What time is it?)",
        "description": "Pergunte as horas e entenda respostas simples.",
        "xpReward": 20,
        "exercises": [
          {
            "id": "u3a1-e5",
            "type": "multiple-choice",
            "prompt": "Como perguntar \"Que horas são?\" em inglês?",
            "options": [
              "What time is it?",
              "Where are you?",
              "How much is it?"
            ],
            "correctAnswer": "What time is it?",
            "audioText": "What time is it?",
            "tip": "\"What time is it?\" significa literalmente \"Que hora é?\""
          },
          {
            "id": "u3a1-e6",
            "type": "word-bank",
            "prompt": "Monte a resposta: \"São duas horas\"",
            "portuguesePhrase": "São duas horas",
            "options": [
              "It",
              "is",
              "two",
              "o'clock",
              "three",
              "time"
            ],
            "correctAnswer": [
              "It",
              "is",
              "two",
              "o'clock"
            ],
            "audioText": "It is two o'clock"
          },
          {
            "id": "u3a1-e7",
            "type": "speech",
            "prompt": "Pergunte as horas em inglês:",
            "englishPhrase": "What time is it?",
            "portuguesePhrase": "Que horas são?",
            "correctAnswer": "What time is it?",
            "audioText": "What time is it?"
          }
        ]
      },
      {
        "id": "lesson-3-a1-3",
        "title": "Dias da Semana (Monday, Friday & Weekend)",
        "description": "Segunda-feira, sexta-feira e o tão esperado fim de semana!",
        "xpReward": 20,
        "exercises": [
          {
            "id": "u3a1-e8",
            "type": "match-pairs",
            "prompt": "Combine os dias da semana:",
            "pairItems": [
              {
                "en": "Monday",
                "pt": "Segunda-feira"
              },
              {
                "en": "Friday",
                "pt": "Sexta-feira"
              },
              {
                "en": "Saturday",
                "pt": "Sábado"
              },
              {
                "en": "Sunday",
                "pt": "Domingo"
              }
            ],
            "correctAnswer": ""
          },
          {
            "id": "u3a1-e9",
            "type": "multiple-choice",
            "prompt": "O que significa \"Today is Friday\"?",
            "options": [
              "Hoje é sexta-feira",
              "Amanhã é sábado",
              "Hoje é domingo"
            ],
            "correctAnswer": "Hoje é sexta-feira",
            "audioText": "Today is Friday"
          },
          {
            "id": "u3a1-e10",
            "type": "speech",
            "prompt": "Comemore o dia no microfone:",
            "englishPhrase": "Today is Friday",
            "portuguesePhrase": "Hoje é sexta-feira",
            "correctAnswer": "Today is Friday",
            "audioText": "Today is Friday"
          }
        ]
      }
    ]
  },
  {
    "id": "unit-4-a1",
    "level": "A1",
    "moduleTitle": "NÍVEL A1 • INICIANTE",
    "title": "Unidade 4: Na Casa, Cores & Roupas",
    "subtitle": "Itens pessoais (chave, celular, carteira) e cores do dia a dia.",
    "color": "purple",
    "icon": "🏠",
    "lessons": [
      {
        "id": "lesson-4-a1-1",
        "title": "Celular, Chave e Carteira",
        "description": "Os 3 objetos que você nunca sai de casa sem!",
        "xpReward": 20,
        "exercises": [
          {
            "id": "u4a1-e1",
            "type": "match-pairs",
            "prompt": "Combine os objetos com a tradução:",
            "pairItems": [
              {
                "en": "Phone",
                "pt": "Celular / Telefone"
              },
              {
                "en": "Keys",
                "pt": "Chaves"
              },
              {
                "en": "Wallet",
                "pt": "Carteira"
              },
              {
                "en": "Bag",
                "pt": "Bolsa / Mochila"
              }
            ],
            "correctAnswer": ""
          },
          {
            "id": "u4a1-e2",
            "type": "word-bank",
            "prompt": "Traduza: \"Onde estão minhas chaves?\"",
            "portuguesePhrase": "Onde estão minhas chaves?",
            "options": [
              "Where",
              "are",
              "my",
              "keys?",
              "phone",
              "wallet"
            ],
            "correctAnswer": [
              "Where",
              "are",
              "my",
              "keys?"
            ],
            "audioText": "Where are my keys?"
          },
          {
            "id": "u4a1-e3",
            "type": "speech",
            "prompt": "Pergunte pelo celular no microfone:",
            "englishPhrase": "Where is my phone?",
            "portuguesePhrase": "Onde está meu celular?",
            "correctAnswer": "Where is my phone?",
            "audioText": "Where is my phone?"
          }
        ]
      },
      {
        "id": "lesson-4-a1-2",
        "title": "Cores Principais (Blue, Red & Black)",
        "description": "Azul, vermelho, preto, branco e verde.",
        "xpReward": 15,
        "exercises": [
          {
            "id": "u4a1-e4",
            "type": "match-pairs",
            "prompt": "Combine as cores:",
            "pairItems": [
              {
                "en": "Blue",
                "pt": "Azul"
              },
              {
                "en": "Red",
                "pt": "Vermelho"
              },
              {
                "en": "Black",
                "pt": "Preto"
              },
              {
                "en": "White",
                "pt": "Branco"
              }
            ],
            "correctAnswer": ""
          },
          {
            "id": "u4a1-e5",
            "type": "multiple-choice",
            "prompt": "Como se diz \"carro preto\"? (Lembre-se: a cor vem antes!)",
            "options": [
              "Black car",
              "Car black",
              "Car of black"
            ],
            "correctAnswer": "Black car",
            "audioText": "Black car",
            "tip": "No inglês, a cor e a característica sempre vêm ANTES do objeto: \"Black car\"!"
          },
          {
            "id": "u4a1-e6",
            "type": "speech",
            "prompt": "Diga a expressão no microfone:",
            "englishPhrase": "A black car",
            "portuguesePhrase": "Um carro preto",
            "correctAnswer": "A black car",
            "audioText": "A black car"
          }
        ]
      },
      {
        "id": "lesson-4-a1-3",
        "title": "Roupas do Dia a Dia (Camisa & Tênis)",
        "description": "T-shirt, jeans, shoes e jacket.",
        "xpReward": 20,
        "exercises": [
          {
            "id": "u4a1-e7",
            "type": "match-pairs",
            "prompt": "Ligue as peças de roupa:",
            "pairItems": [
              {
                "en": "T-shirt",
                "pt": "Camiseta"
              },
              {
                "en": "Pants",
                "pt": "Calças"
              },
              {
                "en": "Shoes",
                "pt": "Sapatos / Tênis"
              },
              {
                "en": "Jacket",
                "pt": "Jaqueta / Casaco"
              }
            ],
            "correctAnswer": ""
          },
          {
            "id": "u4a1-e8",
            "type": "word-bank",
            "prompt": "Traduza: \"Eu gosto dessa camiseta\"",
            "portuguesePhrase": "Eu gosto dessa camiseta",
            "options": [
              "I",
              "like",
              "this",
              "T-shirt",
              "shoes",
              "pants"
            ],
            "correctAnswer": [
              "I",
              "like",
              "this",
              "T-shirt"
            ],
            "audioText": "I like this T-shirt"
          },
          {
            "id": "u4a1-e9",
            "type": "speech",
            "prompt": "Diga com convicção no microfone:",
            "englishPhrase": "I like this T-shirt",
            "portuguesePhrase": "Eu gosto dessa camiseta",
            "correctAnswer": "I like this T-shirt",
            "audioText": "I like this T-shirt"
          }
        ]
      }
    ]
  },
  {
    "id": "unit-5-a2",
    "level": "A2",
    "moduleTitle": "NÍVEL A2 • BÁSICO & VIAGENS",
    "title": "Unidade 5: Restaurante, Café & Supermercado",
    "subtitle": "Faça pedidos com elegância, converse com o garçom e peça a conta.",
    "color": "rose",
    "icon": "🍽️",
    "lessons": [
      {
        "id": "lesson-5-a2-1",
        "title": "Mesa para Dois & Cardápio",
        "description": "Chegue ao restaurante e peça uma mesa sem nervosismo.",
        "xpReward": 25,
        "exercises": [
          {
            "id": "u5a2-e1",
            "type": "multiple-choice",
            "prompt": "Como pedir \"Uma mesa para dois, por favor\"?",
            "options": [
              "A table for two, please",
              "Two tables for me, please",
              "Where is two tables?"
            ],
            "correctAnswer": "A table for two, please",
            "audioText": "A table for two, please"
          },
          {
            "id": "u5a2-e2",
            "type": "word-bank",
            "prompt": "Traduza: \"Posso ver o cardápio?\"",
            "portuguesePhrase": "Posso ver o cardápio?",
            "options": [
              "Can",
              "I",
              "see",
              "the",
              "menu?",
              "table",
              "water"
            ],
            "correctAnswer": [
              "Can",
              "I",
              "see",
              "the",
              "menu?"
            ],
            "audioText": "Can I see the menu?"
          },
          {
            "id": "u5a2-e3",
            "type": "speech",
            "prompt": "Diga ao garçom no microfone:",
            "englishPhrase": "A table for two, please",
            "portuguesePhrase": "Uma mesa para dois, por favor",
            "correctAnswer": "A table for two, please",
            "audioText": "A table for two, please"
          }
        ]
      },
      {
        "id": "lesson-5-a2-2",
        "title": "Fazendo o Pedido & Água com Gás",
        "description": "Still or sparkling water? Faça sua escolha com certeza.",
        "xpReward": 25,
        "exercises": [
          {
            "id": "u5a2-e4",
            "type": "match-pairs",
            "prompt": "Combine os tipos de água e pedidos:",
            "pairItems": [
              {
                "en": "Still water",
                "pt": "Água sem gás"
              },
              {
                "en": "Sparkling water",
                "pt": "Água com gás"
              },
              {
                "en": "Orange juice",
                "pt": "Suco de laranja"
              },
              {
                "en": "Ice and lemon",
                "pt": "Gelo e limão"
              }
            ],
            "correctAnswer": ""
          },
          {
            "id": "u5a2-e5",
            "type": "word-bank",
            "prompt": "Traduza: \"Eu gostaria de água sem gás\"",
            "portuguesePhrase": "Eu gostaria de água sem gás",
            "options": [
              "I",
              "would",
              "like",
              "still",
              "water",
              "sparkling",
              "juice"
            ],
            "correctAnswer": [
              "I",
              "would",
              "like",
              "still",
              "water"
            ],
            "audioText": "I would like still water"
          },
          {
            "id": "u5a2-e6",
            "type": "speech",
            "prompt": "Faça seu pedido no microfone:",
            "englishPhrase": "I would like still water",
            "portuguesePhrase": "Eu gostaria de água sem gás",
            "correctAnswer": "I would like still water",
            "audioText": "I would like still water"
          }
        ]
      },
      {
        "id": "lesson-5-a2-3",
        "title": "Pedindo a Conta & Gorjeta",
        "description": "The check, please! Pague e agradeça pelo serviço.",
        "xpReward": 25,
        "exercises": [
          {
            "id": "u5a2-e7",
            "type": "multiple-choice",
            "prompt": "Como pedir a conta educadamente?",
            "options": [
              "The check, please",
              "Give me money now",
              "I do not want to pay"
            ],
            "correctAnswer": "The check, please",
            "audioText": "The check, please"
          },
          {
            "id": "u5a2-e8",
            "type": "dialogue",
            "prompt": "Leia o diálogo e responda:",
            "dialogueLines": [
              {
                "speaker": "Garçom",
                "text": "Did you enjoy your dinner?",
                "translation": "Você gostou do jantar?"
              },
              {
                "speaker": "Leo",
                "text": "Yes, it was delicious! The check, please.",
                "translation": "Sim, estava delicioso! A conta, por favor."
              },
              {
                "speaker": "Garçom",
                "text": "Certainly, here you go.",
                "translation": "Com certeza, aqui está."
              }
            ],
            "options": [
              "Leo achou a comida ruim",
              "Leo gostou do jantar e pediu a conta",
              "Leo pediu mais comida"
            ],
            "correctAnswer": "Leo gostou do jantar e pediu a conta"
          },
          {
            "id": "u5a2-e9",
            "type": "speech",
            "prompt": "Peça a conta no microfone:",
            "englishPhrase": "The check, please",
            "portuguesePhrase": "A conta, por favor",
            "correctAnswer": "The check, please",
            "audioText": "The check, please"
          }
        ]
      }
    ]
  },
  {
    "id": "unit-6-a2",
    "level": "A2",
    "moduleTitle": "NÍVEL A2 • BÁSICO & VIAGENS",
    "title": "Unidade 6: Viagens, Aeroporto & Imigração",
    "subtitle": "Passaporte, portão de embarque e respostas calmas na imigração.",
    "color": "amber",
    "icon": "✈️",
    "lessons": [
      {
        "id": "lesson-6-a2-1",
        "title": "No Balcão & Cartão de Embarque",
        "description": "Boarding pass, passport e despacho de malas.",
        "xpReward": 30,
        "exercises": [
          {
            "id": "u6a2-e1",
            "type": "match-pairs",
            "prompt": "Combine os termos do aeroporto:",
            "pairItems": [
              {
                "en": "Passport",
                "pt": "Passaporte"
              },
              {
                "en": "Boarding pass",
                "pt": "Cartão de embarque"
              },
              {
                "en": "Gate",
                "pt": "Portão de embarque"
              },
              {
                "en": "Luggage",
                "pt": "Mala / Bagagem"
              }
            ],
            "correctAnswer": ""
          },
          {
            "id": "u6a2-e2",
            "type": "word-bank",
            "prompt": "Traduza: \"Onde fica o portão de embarque?\"",
            "portuguesePhrase": "Onde fica o portão de embarque?",
            "options": [
              "Where",
              "is",
              "the",
              "boarding",
              "gate?",
              "flight",
              "ticket"
            ],
            "correctAnswer": [
              "Where",
              "is",
              "the",
              "boarding",
              "gate?"
            ],
            "audioText": "Where is the boarding gate?"
          },
          {
            "id": "u6a2-e3",
            "type": "speech",
            "prompt": "Diga a pergunta no microfone:",
            "englishPhrase": "Where is the boarding gate?",
            "portuguesePhrase": "Onde fica o portão de embarque?",
            "correctAnswer": "Where is the boarding gate?",
            "audioText": "Where is the boarding gate?"
          }
        ]
      },
      {
        "id": "lesson-6-a2-2",
        "title": "Perguntas da Imigração (Vacation & Tourism)",
        "description": "Responda com segurança: \"I am here on vacation\".",
        "xpReward": 30,
        "exercises": [
          {
            "id": "u6a2-e4",
            "type": "multiple-choice",
            "prompt": "O oficial pergunta: \"What is the purpose of your visit?\" O que você responde?",
            "options": [
              "I am here on vacation",
              "I do not know why",
              "I want to go home"
            ],
            "correctAnswer": "I am here on vacation",
            "audioText": "I am here on vacation",
            "tip": "\"Vacation\" significa férias! \"I am here on vacation\" = Estou aqui de férias."
          },
          {
            "id": "u6a2-e5",
            "type": "word-bank",
            "prompt": "Monte a frase: \"Estou aqui de férias\"",
            "portuguesePhrase": "Estou aqui de férias",
            "options": [
              "I",
              "am",
              "here",
              "on",
              "vacation",
              "work",
              "study"
            ],
            "correctAnswer": [
              "I",
              "am",
              "here",
              "on",
              "vacation"
            ],
            "audioText": "I am here on vacation"
          },
          {
            "id": "u6a2-e6",
            "type": "speech",
            "prompt": "Treine sua resposta de imigração no microfone:",
            "englishPhrase": "I am here on vacation",
            "portuguesePhrase": "Estou aqui de férias",
            "correctAnswer": "I am here on vacation",
            "audioText": "I am here on vacation"
          }
        ]
      },
      {
        "id": "lesson-6-a2-3",
        "title": "Desembarque & Pegando um Táxi / Uber",
        "description": "Baggage claim e pegando transporte até a acomodação.",
        "xpReward": 30,
        "exercises": [
          {
            "id": "u6a2-e7",
            "type": "multiple-choice",
            "prompt": "Onde você pega suas malas no desembarque?",
            "options": [
              "Baggage claim",
              "Ticket counter",
              "Restroom"
            ],
            "correctAnswer": "Baggage claim",
            "audioText": "Baggage claim"
          },
          {
            "id": "u6a2-e8",
            "type": "word-bank",
            "prompt": "Diga ao motorista: \"Para o centro da cidade, por favor\"",
            "portuguesePhrase": "Para o centro da cidade, por favor",
            "options": [
              "To",
              "downtown,",
              "please",
              "airport",
              "hotel",
              "fast"
            ],
            "correctAnswer": [
              "To",
              "downtown,",
              "please"
            ],
            "audioText": "To downtown, please"
          },
          {
            "id": "u6a2-e9",
            "type": "speech",
            "prompt": "Fale com o motorista no microfone:",
            "englishPhrase": "To downtown, please",
            "portuguesePhrase": "Para o centro da cidade, por favor",
            "correctAnswer": "To downtown, please",
            "audioText": "To downtown, please"
          }
        ]
      }
    ]
  },
  {
    "id": "unit-7-a2",
    "level": "A2",
    "moduleTitle": "NÍVEL A2 • BÁSICO & VIAGENS",
    "title": "Unidade 7: Hotel, Hospedagem & Wi-Fi",
    "subtitle": "Check-in, senha do Wi-Fi, toalhas extras e check-out tranquilo.",
    "color": "sky",
    "icon": "🏨",
    "lessons": [
      {
        "id": "lesson-7-a2-1",
        "title": "Fazendo Check-in no Hotel",
        "description": "Apresente seu nome e confirme sua reserva.",
        "xpReward": 25,
        "exercises": [
          {
            "id": "u7a2-e1",
            "type": "word-bank",
            "prompt": "Traduza: \"Eu tenho uma reserva\"",
            "portuguesePhrase": "Eu tenho uma reserva",
            "options": [
              "I",
              "have",
              "a",
              "reservation",
              "key",
              "room",
              "hotel"
            ],
            "correctAnswer": [
              "I",
              "have",
              "a",
              "reservation"
            ],
            "audioText": "I have a reservation"
          },
          {
            "id": "u7a2-e2",
            "type": "match-pairs",
            "prompt": "Combine os termos da hospedagem:",
            "pairItems": [
              {
                "en": "Room key",
                "pt": "Chave do quarto"
              },
              {
                "en": "Breakfast included",
                "pt": "Café da manhã incluso"
              },
              {
                "en": "Elevator",
                "pt": "Elevador"
              },
              {
                "en": "Check-out time",
                "pt": "Horário de saída"
              }
            ],
            "correctAnswer": ""
          },
          {
            "id": "u7a2-e3",
            "type": "speech",
            "prompt": "Diga na recepção com clareza:",
            "englishPhrase": "I have a reservation",
            "portuguesePhrase": "Eu tenho uma reserva",
            "correctAnswer": "I have a reservation",
            "audioText": "I have a reservation"
          }
        ]
      },
      {
        "id": "lesson-7-a2-2",
        "title": "A Senha do Wi-Fi & Toalhas Extras",
        "description": "Como pedir a senha do Wi-Fi e comodidades no quarto.",
        "xpReward": 25,
        "exercises": [
          {
            "id": "u7a2-e4",
            "type": "multiple-choice",
            "prompt": "Como perguntar a senha do Wi-Fi?",
            "options": [
              "What is the Wi-Fi password?",
              "Where is the television?",
              "How much is the Wi-Fi?"
            ],
            "correctAnswer": "What is the Wi-Fi password?",
            "audioText": "What is the Wi-Fi password?"
          },
          {
            "id": "u7a2-e5",
            "type": "word-bank",
            "prompt": "Traduza: \"Você tem a senha do Wi-Fi?\"",
            "portuguesePhrase": "Você tem a senha do Wi-Fi?",
            "options": [
              "Do",
              "you",
              "have",
              "the",
              "Wi-Fi",
              "password?",
              "room",
              "key"
            ],
            "correctAnswer": [
              "Do",
              "you",
              "have",
              "the",
              "Wi-Fi",
              "password?"
            ],
            "audioText": "Do you have the Wi-Fi password?"
          },
          {
            "id": "u7a2-e6",
            "type": "speech",
            "prompt": "Pergunte no microfone:",
            "englishPhrase": "What is the Wi-Fi password?",
            "portuguesePhrase": "Qual é a senha do Wi-Fi?",
            "correctAnswer": "What is the Wi-Fi password?",
            "audioText": "What is the Wi-Fi password?"
          }
        ]
      },
      {
        "id": "lesson-7-a2-3",
        "title": "Check-out & Agradecendo a Estadia",
        "description": "Devolva a chave e encerre sua estadia com elogios.",
        "xpReward": 25,
        "exercises": [
          {
            "id": "u7a2-e7",
            "type": "multiple-choice",
            "prompt": "Como dizer que você está fazendo o check-out?",
            "options": [
              "I would like to check out, please",
              "I am staying forever",
              "Where is my bed?"
            ],
            "correctAnswer": "I would like to check out, please",
            "audioText": "I would like to check out, please"
          },
          {
            "id": "u7a2-e8",
            "type": "word-bank",
            "prompt": "Traduza: \"Obrigado por tudo, foi ótimo\"",
            "portuguesePhrase": "Obrigado por tudo, foi ótimo",
            "options": [
              "Thank",
              "you",
              "for",
              "everything,",
              "it",
              "was",
              "great"
            ],
            "correctAnswer": [
              "Thank",
              "you",
              "for",
              "everything,",
              "it",
              "was",
              "great"
            ],
            "audioText": "Thank you for everything, it was great"
          },
          {
            "id": "u7a2-e9",
            "type": "speech",
            "prompt": "Diga na recepção ao sair:",
            "englishPhrase": "I would like to check out, please",
            "portuguesePhrase": "Eu gostaria de fazer o check-out, por favor",
            "correctAnswer": "I would like to check out, please",
            "audioText": "I would like to check out, please"
          }
        ]
      }
    ]
  },
  {
    "id": "unit-8-a2",
    "level": "A2",
    "moduleTitle": "NÍVEL A2 • BÁSICO & VIAGENS",
    "title": "Unidade 8: Pela Cidade, Direções & Farmácia",
    "subtitle": "Onde fica o banheiro? Vire à direita, farmácia e remédios.",
    "color": "teal",
    "icon": "🗺️",
    "lessons": [
      {
        "id": "lesson-8-a2-1",
        "title": "A Pergunta de Ouro: Onde Fica o Banheiro?",
        "description": "Where is the restroom? A frase salvadora em qualquer lugar!",
        "xpReward": 25,
        "exercises": [
          {
            "id": "u8a2-e1",
            "type": "multiple-choice",
            "prompt": "Como perguntar onde fica o banheiro em inglês?",
            "options": [
              "Where is the restroom?",
              "Where is the bedroom?",
              "Who is in the restroom?"
            ],
            "correctAnswer": "Where is the restroom?",
            "audioText": "Where is the restroom?",
            "tip": "\"Restroom\" ou \"bathroom\" é banheiro. \"Where is\" = Onde fica!"
          },
          {
            "id": "u8a2-e2",
            "type": "word-bank",
            "prompt": "Traduza: \"Com licença, onde fica o banheiro?\"",
            "portuguesePhrase": "Com licença, onde fica o banheiro?",
            "options": [
              "Excuse",
              "me,",
              "where",
              "is",
              "the",
              "restroom?",
              "hotel",
              "food"
            ],
            "correctAnswer": [
              "Excuse",
              "me,",
              "where",
              "is",
              "the",
              "restroom?"
            ],
            "audioText": "Excuse me, where is the restroom?"
          },
          {
            "id": "u8a2-e3",
            "type": "speech",
            "prompt": "Pratique a pergunta salva-vidas no microfone:",
            "englishPhrase": "Where is the restroom?",
            "portuguesePhrase": "Onde fica o banheiro?",
            "correctAnswer": "Where is the restroom?",
            "audioText": "Where is the restroom?"
          }
        ]
      },
      {
        "id": "lesson-8-a2-2",
        "title": "Direções: Direita, Esquerda & Em Frente",
        "description": "Turn right, turn left e go straight ahead.",
        "xpReward": 25,
        "exercises": [
          {
            "id": "u8a2-e4",
            "type": "match-pairs",
            "prompt": "Combine as direções:",
            "pairItems": [
              {
                "en": "Turn right",
                "pt": "Vire à direita"
              },
              {
                "en": "Turn left",
                "pt": "Vire à esquerda"
              },
              {
                "en": "Go straight",
                "pt": "Siga em frente"
              },
              {
                "en": "Next to",
                "pt": "Ao lado de"
              }
            ],
            "correctAnswer": ""
          },
          {
            "id": "u8a2-e5",
            "type": "word-bank",
            "prompt": "Traduza: \"Vire à direita e siga em frente\"",
            "portuguesePhrase": "Vire à direita e siga em frente",
            "options": [
              "Turn",
              "right",
              "and",
              "go",
              "straight",
              "left",
              "stop"
            ],
            "correctAnswer": [
              "Turn",
              "right",
              "and",
              "go",
              "straight"
            ],
            "audioText": "Turn right and go straight"
          },
          {
            "id": "u8a2-e6",
            "type": "speech",
            "prompt": "Diga a direção no microfone:",
            "englishPhrase": "Turn right and go straight",
            "portuguesePhrase": "Vire à direita e siga em frente",
            "correctAnswer": "Turn right and go straight",
            "audioText": "Turn right and go straight"
          }
        ]
      },
      {
        "id": "lesson-8-a2-3",
        "title": "Na Farmácia (Remédio para Dor de Cabeça)",
        "description": "Painkiller, headache e itens de farmácia básica.",
        "xpReward": 25,
        "exercises": [
          {
            "id": "u8a2-e7",
            "type": "multiple-choice",
            "prompt": "Como dizer \"Estou com dor de cabeça\"?",
            "options": [
              "I have a headache",
              "I have a big head",
              "My headache is good"
            ],
            "correctAnswer": "I have a headache",
            "audioText": "I have a headache",
            "tip": "\"Headache\" = dor de cabeça (\"head\" = cabeça, \"ache\" = dor)."
          },
          {
            "id": "u8a2-e8",
            "type": "word-bank",
            "prompt": "Traduza: \"Eu preciso de remédio\"",
            "portuguesePhrase": "Eu preciso de remédio",
            "options": [
              "I",
              "need",
              "medicine",
              "water",
              "doctor",
              "help"
            ],
            "correctAnswer": [
              "I",
              "need",
              "medicine"
            ],
            "audioText": "I need medicine"
          },
          {
            "id": "u8a2-e9",
            "type": "speech",
            "prompt": "Diga na farmácia no microfone:",
            "englishPhrase": "I have a headache",
            "portuguesePhrase": "Estou com dor de cabeça",
            "correctAnswer": "I have a headache",
            "audioText": "I have a headache"
          }
        ]
      }
    ]
  },
  {
    "id": "unit-9-b1",
    "level": "B1",
    "moduleTitle": "NÍVEL B1 • INTERMEDIÁRIO & CARREIRA",
    "title": "Unidade 9: No Trabalho, Reuniões & E-mails",
    "subtitle": "Comunique-se em reuniões, agende compromissos e colabore profissionalmente.",
    "color": "indigo",
    "icon": "💼",
    "lessons": [
      {
        "id": "lesson-9-b1-1",
        "title": "Agendando Reuniões & Prazos (Deadlines)",
        "description": "Frases para colaborar com colegas e clientes corporativos.",
        "xpReward": 30,
        "exercises": [
          {
            "id": "u9b1-e1",
            "type": "multiple-choice",
            "prompt": "Como propor uma reunião em inglês corporativo?",
            "options": [
              "Let's schedule a meeting",
              "Where is the meeting room?",
              "I will not go to work"
            ],
            "correctAnswer": "Let's schedule a meeting",
            "audioText": "Let's schedule a meeting"
          },
          {
            "id": "u9b1-e2",
            "type": "word-bank",
            "prompt": "Traduza: \"Qual é o prazo do projeto?\"",
            "portuguesePhrase": "Qual é o prazo do projeto?",
            "options": [
              "What",
              "is",
              "the",
              "deadline",
              "for",
              "the",
              "project?",
              "meeting"
            ],
            "correctAnswer": [
              "What",
              "is",
              "the",
              "deadline",
              "for",
              "the",
              "project?"
            ],
            "audioText": "What is the deadline for the project?"
          },
          {
            "id": "u9b1-e3",
            "type": "speech",
            "prompt": "Fale na reunião no microfone:",
            "englishPhrase": "Let's schedule a meeting",
            "portuguesePhrase": "Vamos agendar uma reunião",
            "correctAnswer": "Let's schedule a meeting",
            "audioText": "Let's schedule a meeting"
          }
        ]
      },
      {
        "id": "lesson-9-b1-2",
        "title": "E-mails Profissionais & Confirmação",
        "description": "Como escrever e responder e-mails em inglês sem erros.",
        "xpReward": 30,
        "exercises": [
          {
            "id": "u9b1-e4",
            "type": "match-pairs",
            "prompt": "Combine as frases comuns de e-mails em inglês:",
            "pairItems": [
              {
                "en": "Please find attached",
                "pt": "Segue em anexo"
              },
              {
                "en": "As discussed",
                "pt": "Conforme conversamos"
              },
              {
                "en": "Best regards",
                "pt": "Atenciosamente"
              },
              {
                "en": "Looking forward to hearing from you",
                "pt": "No aguardo do seu retorno"
              }
            ],
            "correctAnswer": ""
          },
          {
            "id": "u9b1-e5",
            "type": "word-bank",
            "prompt": "Traduza: \"Você poderia me enviar o relatório?\"",
            "portuguesePhrase": "Você poderia me enviar o relatório?",
            "options": [
              "Could",
              "you",
              "send",
              "me",
              "the",
              "report?",
              "email",
              "file"
            ],
            "correctAnswer": [
              "Could",
              "you",
              "send",
              "me",
              "the",
              "report?"
            ],
            "audioText": "Could you send me the report?"
          },
          {
            "id": "u9b1-e6",
            "type": "speech",
            "prompt": "Faça a solicitação profissional no microfone:",
            "englishPhrase": "Could you send me the report?",
            "portuguesePhrase": "Você poderia me enviar o relatório?",
            "correctAnswer": "Could you send me the report?",
            "audioText": "Could you send me the report?"
          }
        ]
      },
      {
        "id": "lesson-9-b1-3",
        "title": "Apresentação Pessoal & Conquistas",
        "description": "Fale sobre sua experiência profissional com autoridade.",
        "xpReward": 35,
        "exercises": [
          {
            "id": "u9b1-e7",
            "type": "multiple-choice",
            "prompt": "Como dizer \"Eu tenho trabalhado com tecnologia há anos\"?",
            "options": [
              "I have been working with technology for years",
              "I work with technology yesterday",
              "I will work with technology now"
            ],
            "correctAnswer": "I have been working with technology for years",
            "audioText": "I have been working with technology for years"
          },
          {
            "id": "u9b1-e8",
            "type": "word-bank",
            "prompt": "Traduza: \"Eu sou responsável por este projeto\"",
            "portuguesePhrase": "Eu sou responsável por este projeto",
            "options": [
              "I",
              "am",
              "responsible",
              "for",
              "this",
              "project",
              "team",
              "work"
            ],
            "correctAnswer": [
              "I",
              "am",
              "responsible",
              "for",
              "this",
              "project"
            ],
            "audioText": "I am responsible for this project"
          },
          {
            "id": "u9b1-e9",
            "type": "speech",
            "prompt": "Diga com confiança no microfone:",
            "englishPhrase": "I am responsible for this project",
            "portuguesePhrase": "Eu sou responsável por este projeto",
            "correctAnswer": "I am responsible for this project",
            "audioText": "I am responsible for this project"
          }
        ]
      }
    ]
  },
  {
    "id": "unit-10-b1",
    "level": "B1",
    "moduleTitle": "NÍVEL B1 • INTERMEDIÁRIO & CARREIRA",
    "title": "Unidade 10: Expressões Nativas & Gírias Reais",
    "subtitle": "Idioms e gírias do dia a dia para soar natural como um nativo.",
    "color": "rose",
    "icon": "💬",
    "lessons": [
      {
        "id": "lesson-10-b1-1",
        "title": "As Expressões Mais Populares (No worries)",
        "description": "No worries, take your time e it is up to you.",
        "xpReward": 30,
        "exercises": [
          {
            "id": "u10b1-e1",
            "type": "multiple-choice",
            "prompt": "O que significa \"No worries\" na prática?",
            "options": [
              "Sem problemas! / De nada!",
              "Estou preocupado",
              "Não fale comigo"
            ],
            "correctAnswer": "Sem problemas! / De nada!",
            "audioText": "No worries"
          },
          {
            "id": "u10b1-e2",
            "type": "match-pairs",
            "prompt": "Conecte as expressões aos seus sentidos reais:",
            "pairItems": [
              {
                "en": "No worries",
                "pt": "Sem problemas / Tranquilo"
              },
              {
                "en": "Take your time",
                "pt": "Vá com calma / No seu tempo"
              },
              {
                "en": "It's up to you",
                "pt": "Você que decide / Fica a seu critério"
              },
              {
                "en": "Keep in touch",
                "pt": "Vamos manter contato"
              }
            ],
            "correctAnswer": ""
          },
          {
            "id": "u10b1-e3",
            "type": "speech",
            "prompt": "Diga no microfone com naturalidade:",
            "englishPhrase": "No worries",
            "portuguesePhrase": "Sem problemas / Tranquilo",
            "correctAnswer": "No worries",
            "audioText": "No worries"
          }
        ]
      },
      {
        "id": "lesson-10-b1-2",
        "title": "Gírias Nativas Comuns (Cool, Hang out & Catch up)",
        "description": "Gírias informais usadas por jovens e adultos no dia a dia.",
        "xpReward": 30,
        "exercises": [
          {
            "id": "u10b1-e4",
            "type": "multiple-choice",
            "prompt": "O que significa a expressão \"Let's hang out\"?",
            "options": [
              "Vamos passar um tempo juntos / dar um rolê",
              "Vamos pendurar as roupas",
              "Vamos trabalhar agora"
            ],
            "correctAnswer": "Vamos passar um tempo juntos / dar um rolê",
            "audioText": "Let's hang out"
          },
          {
            "id": "u10b1-e5",
            "type": "word-bank",
            "prompt": "Traduza: \"Vamos colocar o papo em dia!\"",
            "portuguesePhrase": "Vamos colocar o papo em dia!",
            "options": [
              "Let's",
              "catch",
              "up",
              "soon!",
              "hang",
              "out",
              "talk"
            ],
            "correctAnswer": [
              "Let's",
              "catch",
              "up",
              "soon!"
            ],
            "audioText": "Let's catch up soon!"
          },
          {
            "id": "u10b1-e6",
            "type": "speech",
            "prompt": "Fale no microfone:",
            "englishPhrase": "Let's catch up soon!",
            "portuguesePhrase": "Vamos colocar o papo em dia!",
            "correctAnswer": "Let's catch up soon!",
            "audioText": "Let's catch up soon!"
          }
        ]
      },
      {
        "id": "lesson-10-b1-3",
        "title": "Conectores de Fala (By the way & To be honest)",
        "description": "Palavras que dão fluidez às suas frases em conversas longas.",
        "xpReward": 30,
        "exercises": [
          {
            "id": "u10b1-e7",
            "type": "match-pairs",
            "prompt": "Ligue os conectores ao português:",
            "pairItems": [
              {
                "en": "By the way",
                "pt": "A propósito / Falando nisso"
              },
              {
                "en": "To be honest",
                "pt": "Para ser sincero"
              },
              {
                "en": "In fact",
                "pt": "Na verdade / De fato"
              },
              {
                "en": "As far as I know",
                "pt": "Até onde eu sei"
              }
            ],
            "correctAnswer": ""
          },
          {
            "id": "u10b1-e8",
            "type": "word-bank",
            "prompt": "Traduza: \"A propósito, qual é o seu nome?\"",
            "portuguesePhrase": "A propósito, qual é o seu nome?",
            "options": [
              "By",
              "the",
              "way,",
              "what",
              "is",
              "your",
              "name?",
              "where"
            ],
            "correctAnswer": [
              "By",
              "the",
              "way,",
              "what",
              "is",
              "your",
              "name?"
            ],
            "audioText": "By the way, what is your name?"
          },
          {
            "id": "u10b1-e9",
            "type": "speech",
            "prompt": "Diga no microfone com fluidez nativa:",
            "englishPhrase": "By the way, what is your name?",
            "portuguesePhrase": "A propósito, qual é o seu nome?",
            "correctAnswer": "By the way, what is your name?",
            "audioText": "By the way, what is your name?"
          }
        ]
      }
    ]
  },
  {
    "id": "unit-11-b1",
    "level": "B1",
    "moduleTitle": "NÍVEL B1 • INTERMEDIÁRIO & CARREIRA",
    "title": "Unidade 11: Opiniões, Debates & Argumentação",
    "subtitle": "Concordar, discordar com elegância e defender seu ponto de vista.",
    "color": "emerald",
    "icon": "💡",
    "lessons": [
      {
        "id": "lesson-11-b1-1",
        "title": "Expressando Opinião (In my opinion...)",
        "description": "In my view, I believe, From my perspective.",
        "xpReward": 30,
        "exercises": [
          {
            "id": "u11b1-e1",
            "type": "multiple-choice",
            "prompt": "Como iniciar uma frase expressando sua opinião?",
            "options": [
              "In my opinion, this is the best option",
              "I am not thinking about this",
              "Where is my opinion?"
            ],
            "correctAnswer": "In my opinion, this is the best option",
            "audioText": "In my opinion, this is the best option"
          },
          {
            "id": "u11b1-e2",
            "type": "word-bank",
            "prompt": "Traduza: \"Eu concordo totalmente com você\"",
            "portuguesePhrase": "Eu concordo totalmente com você",
            "options": [
              "I",
              "totally",
              "agree",
              "with",
              "you",
              "disagree",
              "not"
            ],
            "correctAnswer": [
              "I",
              "totally",
              "agree",
              "with",
              "you"
            ],
            "audioText": "I totally agree with you"
          },
          {
            "id": "u11b1-e3",
            "type": "speech",
            "prompt": "Diga no microfone com firmeza:",
            "englishPhrase": "I totally agree with you",
            "portuguesePhrase": "Eu concordo totalmente com você",
            "correctAnswer": "I totally agree with you",
            "audioText": "I totally agree with you"
          }
        ]
      },
      {
        "id": "lesson-11-b1-2",
        "title": "Discordando com Elegância & Respeito",
        "description": "I see your point, but... Como discordar sem ser rude.",
        "xpReward": 35,
        "exercises": [
          {
            "id": "u11b1-e4",
            "type": "multiple-choice",
            "prompt": "Qual a melhor forma educada de discordar em uma reunião?",
            "options": [
              "I see your point, but I have a different perspective",
              "You are completely wrong",
              "Be quiet, please"
            ],
            "correctAnswer": "I see your point, but I have a different perspective",
            "audioText": "I see your point, but I have a different perspective"
          },
          {
            "id": "u11b1-e5",
            "type": "word-bank",
            "prompt": "Traduza: \"Eu entendo seu ponto, mas...\"",
            "portuguesePhrase": "Eu entendo seu ponto, mas...",
            "options": [
              "I",
              "see",
              "your",
              "point,",
              "but",
              "yes",
              "no"
            ],
            "correctAnswer": [
              "I",
              "see",
              "your",
              "point,",
              "but"
            ],
            "audioText": "I see your point, but"
          },
          {
            "id": "u11b1-e6",
            "type": "speech",
            "prompt": "Fale no microfone:",
            "englishPhrase": "I see your point, but",
            "portuguesePhrase": "Eu entendo seu ponto, mas...",
            "correctAnswer": "I see your point, but",
            "audioText": "I see your point, but"
          }
        ]
      },
      {
        "id": "lesson-11-b1-3",
        "title": "Propondo Soluções & Próximos Passos",
        "description": "What if we try this? Como liderar soluções em inglês.",
        "xpReward": 35,
        "exercises": [
          {
            "id": "u11b1-e7",
            "type": "multiple-choice",
            "prompt": "Como sugerir uma alternativa?",
            "options": [
              "What if we try a different approach?",
              "We cannot do anything",
              "Who did this mistake?"
            ],
            "correctAnswer": "What if we try a different approach?",
            "audioText": "What if we try a different approach?"
          },
          {
            "id": "u11b1-e8",
            "type": "word-bank",
            "prompt": "Traduza: \"Esta é uma ótima solução\"",
            "portuguesePhrase": "Esta é uma ótima solução",
            "options": [
              "This",
              "is",
              "a",
              "great",
              "solution",
              "bad",
              "problem"
            ],
            "correctAnswer": [
              "This",
              "is",
              "a",
              "great",
              "solution"
            ],
            "audioText": "This is a great solution"
          },
          {
            "id": "u11b1-e9",
            "type": "speech",
            "prompt": "Diga no microfone:",
            "englishPhrase": "This is a great solution",
            "portuguesePhrase": "Esta é uma ótima solução",
            "correctAnswer": "This is a great solution",
            "audioText": "This is a great solution"
          }
        ]
      }
    ]
  },
  {
    "id": "unit-12-b1",
    "level": "B1",
    "moduleTitle": "NÍVEL B1 • INTERMEDIÁRIO & CARREIRA",
    "title": "Unidade 12: Conversação Social & Conexões Reais",
    "subtitle": "Small talk, hobbies, falar sobre o futuro e fazer amizades.",
    "color": "purple",
    "icon": "☕",
    "lessons": [
      {
        "id": "lesson-12-b1-1",
        "title": "Iniciando Conversas Informais (Small Talk)",
        "description": "Como puxar assunto no café ou na fila sem constrangimento.",
        "xpReward": 30,
        "exercises": [
          {
            "id": "u12b1-e1",
            "type": "multiple-choice",
            "prompt": "Como puxar assunto sobre o dia de alguém?",
            "options": [
              "How has your day been so far?",
              "Where is your money?",
              "Why are you here?"
            ],
            "correctAnswer": "How has your day been so far?",
            "audioText": "How has your day been so far?"
          },
          {
            "id": "u12b1-e2",
            "type": "word-bank",
            "prompt": "Traduza: \"O tempo está maravilhoso hoje\"",
            "portuguesePhrase": "O tempo está maravilhoso hoje",
            "options": [
              "The",
              "weather",
              "is",
              "wonderful",
              "today",
              "cold",
              "rain"
            ],
            "correctAnswer": [
              "The",
              "weather",
              "is",
              "wonderful",
              "today"
            ],
            "audioText": "The weather is wonderful today"
          },
          {
            "id": "u12b1-e3",
            "type": "speech",
            "prompt": "Puxe assunto no microfone:",
            "englishPhrase": "How has your day been so far?",
            "portuguesePhrase": "Como tem sido o seu dia até agora?",
            "correctAnswer": "How has your day been so far?",
            "audioText": "How has your day been so far?"
          }
        ]
      },
      {
        "id": "lesson-12-b1-2",
        "title": "Falando sobre Filmes, Séries & Hobbies",
        "description": "Compartilhe o que você gosta de assistir e fazer no tempo livre.",
        "xpReward": 30,
        "exercises": [
          {
            "id": "u12b1-e4",
            "type": "multiple-choice",
            "prompt": "Como perguntar o que alguém faz no tempo livre?",
            "options": [
              "What do you like to do in your free time?",
              "Do you work in your free time?",
              "Where is free time?"
            ],
            "correctAnswer": "What do you like to do in your free time?",
            "audioText": "What do you like to do in your free time?"
          },
          {
            "id": "u12b1-e5",
            "type": "word-bank",
            "prompt": "Traduza: \"Eu realmente recomendo esse filme\"",
            "portuguesePhrase": "Eu realmente recomendo esse filme",
            "options": [
              "I",
              "really",
              "recommend",
              "this",
              "movie",
              "book",
              "bad"
            ],
            "correctAnswer": [
              "I",
              "really",
              "recommend",
              "this",
              "movie"
            ],
            "audioText": "I really recommend this movie"
          },
          {
            "id": "u12b1-e6",
            "type": "speech",
            "prompt": "Faça a recomendação no microfone:",
            "englishPhrase": "I really recommend this movie",
            "portuguesePhrase": "Eu realmente recomendo esse filme",
            "correctAnswer": "I really recommend this movie",
            "audioText": "I really recommend this movie"
          }
        ]
      },
      {
        "id": "lesson-12-b1-3",
        "title": "Planos, Sonhos & Próximas Viagens",
        "description": "Compartilhe seus planos de vida e aspirações futuras.",
        "xpReward": 35,
        "exercises": [
          {
            "id": "u12b1-e7",
            "type": "multiple-choice",
            "prompt": "Como dizer \"Estou planejando viajar no próximo ano\"?",
            "options": [
              "I am planning to travel next year",
              "I traveled last year",
              "I do not like to travel"
            ],
            "correctAnswer": "I am planning to travel next year",
            "audioText": "I am planning to travel next year"
          },
          {
            "id": "u12b1-e8",
            "type": "word-bank",
            "prompt": "Traduza: \"Meu sonho é falar inglês fluentemente\"",
            "portuguesePhrase": "Meu sonho é falar inglês fluentemente",
            "options": [
              "My",
              "dream",
              "is",
              "to",
              "speak",
              "English",
              "fluently",
              "spanish"
            ],
            "correctAnswer": [
              "My",
              "dream",
              "is",
              "to",
              "speak",
              "English",
              "fluently"
            ],
            "audioText": "My dream is to speak English fluently"
          },
          {
            "id": "u12b1-e9",
            "type": "speech",
            "prompt": "Fale seu sonho no microfone com paixão:",
            "englishPhrase": "My dream is to speak English fluently",
            "portuguesePhrase": "Meu sonho é falar inglês fluentemente",
            "correctAnswer": "My dream is to speak English fluently",
            "audioText": "My dream is to speak English fluently"
          }
        ]
      }
    ]
  }
];

export const COURSE_MODULES: CourseModule[] = [
  {
    "id": "module-a1",
    "number": 1,
    "title": "Módulo A1: Nível Zero & Família",
    "shortTitle": "Iniciante & Família",
    "level": "A1",
    "subtitle": "Palavras essenciais, saudações, membros da família, números e casa.",
    "color": "emerald",
    "unitIds": [
      "unit-1",
      "unit-2",
      "unit-3-a1",
      "unit-4-a1"
    ]
  },
  {
    "id": "module-a2",
    "number": 2,
    "title": "Módulo A2: Dia a Dia & Viagens",
    "shortTitle": "Básico & Viagens",
    "level": "A2",
    "subtitle": "Restaurante, aeroporto, imigração, hotel, direções e farmácia.",
    "color": "amber",
    "unitIds": [
      "unit-5-a2",
      "unit-6-a2",
      "unit-7-a2",
      "unit-8-a2"
    ]
  },
  {
    "id": "module-b1",
    "number": 3,
    "title": "Módulo B1: Intermediário & Fluência",
    "shortTitle": "Intermediário & Carreira",
    "level": "B1",
    "subtitle": "Trabalho, e-mails corporativos, reuniões, gírias nativas e argumentação.",
    "color": "indigo",
    "unitIds": [
      "unit-9-b1",
      "unit-10-b1",
      "unit-11-b1",
      "unit-12-b1"
    ]
  }
];
