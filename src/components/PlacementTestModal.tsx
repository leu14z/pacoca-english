import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, Volume2, Award, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound, speakEnglish } from '../utils/audio';
import { useUser } from '../context/UserContext';

interface PlacementQuestion {
  id: number;
  levelTarget: 'A1' | 'A2' | 'B1';
  prompt: string;
  audioText?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  // Nível A1 (Questões 1 a 4)
  {
    id: 1,
    levelTarget: 'A1',
    prompt: 'O que significa a expressão "Water, please"?',
    audioText: 'Water, please',
    options: ['Água, por favor', 'Café com leite', 'Muito obrigado', 'Bom dia'],
    correctIndex: 0,
    explanation: '"Water" é água e "please" é por favor!',
  },
  {
    id: 2,
    levelTarget: 'A1',
    prompt: 'Como se diz "Obrigado(a)" em inglês?',
    options: ['Please', 'Thank you', 'Goodbye', 'Hello'],
    correctIndex: 1,
    explanation: '"Thank you" significa Obrigado ou Obrigada!',
  },
  {
    id: 3,
    levelTarget: 'A1',
    prompt: 'Ouça o áudio e selecione a saudação correta:',
    audioText: 'Good morning',
    options: ['Boa noite', 'Bom dia', 'Até logo', 'Por favor'],
    correctIndex: 1,
    explanation: '"Good morning" é a saudação matinal: Bom dia!',
  },
  {
    id: 4,
    levelTarget: 'A1',
    prompt: 'Complete a frase: "___ am Leo." (Eu sou o Leo)',
    options: ['You', 'I', 'He', 'They'],
    correctIndex: 1,
    explanation: '"I am" significa "Eu sou" ou "Eu estou"!',
  },

  // Nível A2 (Questões 5 a 8)
  {
    id: 5,
    levelTarget: 'A2',
    prompt: 'Onde você usaria a pergunta "Where is the restroom?"',
    audioText: 'Where is the restroom?',
    options: [
      'Para perguntar onde fica o banheiro',
      'Para pedir a conta do restaurante',
      'Para comprar uma passagem',
      'Para dizer seu nome',
    ],
    correctIndex: 0,
    explanation: '"Restroom" é banheiro em inglês americano!',
  },
  {
    id: 6,
    levelTarget: 'A2',
    prompt: 'No restaurante, como você pede uma mesa para duas pessoas?',
    options: [
      'A table for two, please',
      'The check, please',
      'Where is the hotel?',
      'I want two waters',
    ],
    correctIndex: 0,
    explanation: '"A table for two, please" = Uma mesa para dois, por favor!',
  },
  {
    id: 7,
    levelTarget: 'A2',
    prompt: 'No aeroporto, onde você vai para embarcar no avião?',
    options: ['Boarding gate', 'Luggage claim', 'Restroom', 'Hotel lobby'],
    correctIndex: 0,
    explanation: '"Boarding gate" é o portão de embarque!',
  },
  {
    id: 8,
    levelTarget: 'A2',
    prompt: 'Complete a frase de rotina: "She _____ coffee every morning."',
    options: ['drinks', 'drink', 'drinking', 'dranked'],
    correctIndex: 0,
    explanation: 'Na 3ª pessoa do singular (she/he), adicionamos "s": She drinks!',
  },

  // Nível B1 (Questões 9 a 12)
  {
    id: 9,
    levelTarget: 'B1',
    prompt: 'Passado simples: "Yesterday, I _____ a delicious dinner."',
    options: ['cook', 'cooked', 'cooking', 'have cook'],
    correctIndex: 1,
    explanation: 'No passado regular em inglês, adicionamos -ed: "cooked"!',
  },
  {
    id: 10,
    levelTarget: 'B1',
    prompt: 'O que significa: "Could you give me a hand with this?"',
    options: [
      'Você poderia me dar uma ajuda com isso?',
      'Você pode segurar minha mão?',
      'Você quer comprar isso de mim?',
      'Você tem duas mãos livres?',
    ],
    correctIndex: 0,
    explanation: '"Give a hand" é a expressão idiomática para dar uma ajuda!',
  },
  {
    id: 11,
    levelTarget: 'B1',
    prompt: 'Complete: "They have lived in New York _____ five years."',
    options: ['for', 'since', 'during', 'from'],
    correctIndex: 0,
    explanation: 'Usamos "for" para indicar duração de tempo ("for five years")!',
  },
  {
    id: 12,
    levelTarget: 'B1',
    prompt: 'Expressão nativa: "It\'s raining cats and dogs!" significa:',
    options: [
      'Está chovendo muito forte / um temporal!',
      'Estão caindo animais do céu.',
      'O dia está ensolarado e tranquilo.',
      'Há muitos cachorros na rua.',
    ],
    correctIndex: 0,
    explanation: '"Raining cats and dogs" é um clássico idioma para chuva torrencial!',
  },
];

interface PlacementTestModalProps {
  onClose: () => void;
}

export const PlacementTestModal: React.FC<PlacementTestModalProps> = ({ onClose }) => {
  const { setPlacementLevel } = useUser();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = PLACEMENT_QUESTIONS[currentIdx];
  const progressPercent = ((currentIdx + 1) / PLACEMENT_QUESTIONS.length) * 100;

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    sound.playClick();
    setSelectedOption(idx);
  };

  const handleConfirmAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswered(true);

    const isCorrect = selectedOption === currentQ.correctIndex;
    if (isCorrect) {
      sound.playSuccess();
      setScore((s) => s + 1);
    } else {
      sound.playError();
    }
  };

  const handleNextQuestion = () => {
    sound.playClick();
    if (currentIdx < PLACEMENT_QUESTIONS.length - 1) {
      setCurrentIdx((c) => c + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Concluiu o teste!
      finishPlacement();
    }
  };

  const finishPlacement = () => {
    setIsFinished(true);
    sound.playVictory();
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });

    const calculatedLevel = getLevelFromScore(score);
    setPlacementLevel(calculatedLevel);
  };

  const handleSkipToZero = () => {
    sound.playClick();
    setPlacementLevel('A1');
    onClose();
  };

  const getLevelFromScore = (pts: number): 'A1' | 'A2' | 'B1' => {
    if (pts >= 9) return 'B1';
    if (pts >= 5) return 'A2';
    return 'A1';
  };

  const finalLevel = getLevelFromScore(score);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-4 border-slate-200 relative overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Progress Header */}
        {!isFinished && (
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-sky-600 flex items-center gap-1.5">
                <Compass className="w-4 h-4" />
                Teste de Nivelamento Paçoca
              </span>
              <button
                type="button"
                onClick={handleSkipToZero}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 underline cursor-pointer"
              >
                Pular (Começar do Zero)
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div
                className="bg-sky-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Questão {currentIdx + 1} de {PLACEMENT_QUESTIONS.length}</span>
              <span className="px-2 py-0.5 bg-sky-50 text-sky-700 rounded-md font-black">
                Foco: Nível {currentQ.levelTarget}
              </span>
            </div>
          </div>
        )}

        {/* Content Question Area */}
        {!isFinished ? (
          <div className="flex-1 overflow-y-auto space-y-5 py-2">
            <h3 className="text-xl sm:text-2xl font-black text-slate-800 leading-snug">
              {currentQ.prompt}
            </h3>

            {/* Audio Button if available */}
            {currentQ.audioText && (
              <button
                type="button"
                onClick={() => speakEnglish(currentQ.audioText!)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold rounded-2xl text-sm cursor-pointer border border-sky-200 transition-colors shadow-2xs"
              >
                <Volume2 className="w-5 h-5 text-sky-600" />
                <span>Ouvir frase em inglês</span>
              </button>
            )}

            {/* Options */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correctIndex;

                let btnStyle = 'border-slate-200 hover:bg-slate-50 text-slate-700';

                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-800 border-2';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'border-rose-500 bg-rose-50 text-rose-800 border-2';
                  } else {
                    btnStyle = 'opacity-40 border-slate-200';
                  }
                } else if (isSelected) {
                  btnStyle = 'border-sky-500 bg-sky-50 text-sky-800 border-2 font-black shadow-xs';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 rounded-2xl text-left font-bold text-sm sm:text-base border-2 transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {isAnswered && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box after answer */}
            {isAnswered && (
              <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-xs font-bold text-slate-700">
                💡 <span className="font-black text-slate-800">Explicação:</span> {currentQ.explanation}
              </div>
            )}
          </div>
        ) : (
          /* Finished Result View */
          <div className="text-center py-6 space-y-6 flex-1 flex flex-col justify-center items-center">
            <div className="w-24 h-24 rounded-full bg-amber-100 border-4 border-amber-300 flex items-center justify-center mx-auto shadow-md">
              <Award className="w-12 h-12 text-amber-600" />
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-1">
                Resultado do Teste de Nivelamento
              </span>
              <h2 className="text-3xl font-black text-slate-800">
                Você acertou {score} de {PLACEMENT_QUESTIONS.length}!
              </h2>
            </div>

            {/* Level Badge Card */}
            <div className="p-6 bg-linear-to-br from-sky-50 to-indigo-50 border-2 border-sky-200 rounded-3xl w-full max-w-sm">
              <span className="text-xs font-black uppercase tracking-widest text-sky-600 block mb-1">
                Seu Nível Recomendado:
              </span>
              <p className="text-2xl font-black text-slate-800 mb-2">
                {finalLevel === 'A1' && 'Nível A1: Iniciante'}
                {finalLevel === 'A2' && 'Nível A2: Básico Prático'}
                {finalLevel === 'B1' && 'Nível B1: Intermediário'}
              </p>
              <p className="text-xs font-bold text-slate-600">
                {finalLevel === 'A1' &&
                  'Perfeito para construir uma base sólida com palavras do dia a dia, família e primeiras frases!'}
                {finalLevel === 'A2' &&
                  'Você já domina o básico! Vamos focar em situações práticas de viagens, restaurantes e rotina.'}
                {finalLevel === 'B1' &&
                  'Excelente vocabulário! Seu foco será conversação real, tempos verbais e fluência no trabalho.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 active:translate-y-0.5 border-b-4 border-b-emerald-700 text-white font-black rounded-2xl cursor-pointer text-base shadow-lg transition-all"
              >
                Bora Aprender! 🚀
              </button>
            </div>
          </div>
        )}

        {/* Footer Buttons */}
        {!isFinished && (
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            {!isAnswered ? (
              <button
                type="button"
                disabled={selectedOption === null}
                onClick={handleConfirmAnswer}
                className={`w-full py-4 rounded-2xl font-black text-base transition-all shadow-md ${
                  selectedOption !== null
                    ? 'bg-sky-500 hover:bg-sky-600 border-b-4 border-b-sky-700 text-white cursor-pointer active:translate-y-0.5'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Verificar Resposta
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNextQuestion}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 border-b-4 border-b-emerald-700 text-white rounded-2xl font-black text-base cursor-pointer shadow-md active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <span>Continuar</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
