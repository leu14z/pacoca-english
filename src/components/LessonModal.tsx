import React, { useState, useEffect, useRef } from 'react';
import { X, Volume2, Snail, Mic, CheckCircle2, XCircle, Heart, RefreshCw, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import type { Lesson, Exercise } from '../data/courses';
import { useUser } from '../context/UserContext';
import { Mascot } from './Mascot';
import { sound, speakEnglish } from '../utils/audio';
import type { MascotMood } from '../utils/mascot';
import { listenForPhrase, isSpeechSupported } from '../utils/speech';

interface LessonModalProps {
  lesson: Lesson;
  onClose: () => void;
}

export const LessonModal: React.FC<LessonModalProps> = ({ lesson, onClose }) => {
  const { currentUser, completeLesson, loseHeart } = useUser();

  // Active exercises list (can include review round)
  const [exerciseList, setExerciseList] = useState<Exercise[]>(() => [...lesson.exercises]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Review queue for missed exercises
  const [reviewQueue, setReviewQueue] = useState<Exercise[]>([]);
  const [isReviewMode, setIsReviewMode] = useState(false);

  const [status, setStatus] = useState<'answering' | 'correct' | 'incorrect' | 'completed'>('answering');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [selectedPair, setSelectedPair] = useState<{ type: 'en' | 'pt'; text: string } | null>(null);
  const [combo, setCombo] = useState(0);
  const [mascotMood, setMascotMood] = useState<MascotMood>('official');
  const [mascotSpeech, setMascotSpeech] = useState<string | undefined>(undefined);

  // Speech Recognition States
  const [speechState, setSpeechState] = useState<'idle' | 'listening' | 'processing' | 'error' | 'done'>('idle');
  const [speechMessage, setSpeechMessage] = useState<string>('');
  const [spokenTranscript, setSpokenTranscript] = useState<string>('');
  const abortSpeechRef = useRef<(() => void) | null>(null);

  const currentExercise: Exercise = exerciseList[currentIndex];
  const progressPercent = ((currentIndex) / exerciseList.length) * 100;

  // Initialize exercise state
  useEffect(() => {
    if (!currentExercise || !currentUser) return;
    setStatus('answering');
    setSelectedAnswer(null);
    setSelectedPair(null);
    setSpeechState('idle');
    setSpeechMessage('');
    setSpokenTranscript('');

    if (abortSpeechRef.current) {
      abortSpeechRef.current();
      abortSpeechRef.current = null;
    }

    if (currentExercise.type === 'word-bank' || currentExercise.type === 'listen-bank') {
      const words = [...(currentExercise.options || [])].sort(() => Math.random() - 0.5);
      setAvailableWords(words);
      setSelectedWords([]);
    }

    if (currentExercise.type === 'match-pairs') {
      setMatchedPairs([]);
    }

    // Play prompt audio automatically for listening exercises
    if (currentExercise.type === 'listen-bank' && currentExercise.audioText) {
      setTimeout(() => {
        speakEnglish(currentExercise.audioText!);
      }, 300);
    }

    // Set mood based on review mode, hearts or combo
    if (isReviewMode) {
      setMascotMood('tip');
      setMascotSpeech('Hora de revisar! Vamos acertar as que ficaram para trás!');
    } else if (currentUser.hearts <= 1) {
      setMascotMood('scared');
      setMascotSpeech('Cuidado, só resta 1 coraçãozinho!');
    } else if (combo >= 3) {
      setMascotMood('frenzy');
      setMascotSpeech(`Modo Frenesi! Combo x${combo}! 🔥`);
    } else {
      setMascotMood('official');
      setMascotSpeech(currentExercise.tip);
    }
  }, [currentIndex, isReviewMode]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if (abortSpeechRef.current) {
        abortSpeechRef.current();
      }
    };
  }, []);

  if (!currentUser) return null;

  // Handle word selection in word bank
  const handleWordSelect = (word: string, index: number) => {
    sound.playClick();
    setSelectedWords((prev) => [...prev, word]);
    setAvailableWords((prev) => prev.filter((_, i) => i !== index));
  };

  const handleWordDeselect = (word: string, index: number) => {
    sound.playClick();
    setSelectedWords((prev) => prev.filter((_, i) => i !== index));
    setAvailableWords((prev) => [...prev, word]);
  };

  // Handle pair matching
  const handlePairClick = (type: 'en' | 'pt', text: string) => {
    sound.playClick();
    if (matchedPairs.includes(text)) return;

    if (!selectedPair) {
      setSelectedPair({ type, text });
      if (type === 'en') speakEnglish(text);
      return;
    }

    if (selectedPair.type === type) {
      setSelectedPair({ type, text });
      if (type === 'en') speakEnglish(text);
      return;
    }

    // Check if they match
    const enText = type === 'en' ? text : selectedPair.text;
    const ptText = type === 'pt' ? text : selectedPair.text;

    const isMatch = currentExercise.pairItems?.some(
      (p) => p.en.toLowerCase() === enText.toLowerCase() && p.pt.toLowerCase() === ptText.toLowerCase()
    );

    if (isMatch) {
      sound.playSuccess();
      const updated = [...matchedPairs, enText, ptText];
      setMatchedPairs(updated);
      setSelectedPair(null);

      // If all matched
      if (currentExercise.pairItems && updated.length >= currentExercise.pairItems.length * 2) {
        handleSuccess();
      }
    } else {
      sound.playError();
      setSelectedPair(null);
    }
  };

  // Handle Speech Recognition with continuous live capture
  const handleSpeechRecord = () => {
    sound.playClick();

    if (!isSpeechSupported()) {
      setSpeechState('error');
      setSpeechMessage('Seu navegador não tem suporte a microfone direto. Toque em "Ouvir pronúncia nativa" e repita em voz alta!');
      return;
    }

    if (abortSpeechRef.current) {
      abortSpeechRef.current();
    }

    const targetPhrase = currentExercise.englishPhrase || (currentExercise.correctAnswer as string);

    abortSpeechRef.current = listenForPhrase(
      targetPhrase,
      (interim) => {
        setSpokenTranscript(interim);
      },
      (newStatus, msg) => {
        setSpeechState(newStatus);
        if (msg) setSpeechMessage(msg);
      },
      (result) => {
        setSpokenTranscript(result.transcript);
        if (result.isMatch) {
          handleSuccess();
        } else {
          sound.playError();
          setMascotMood('wrong');
          setMascotSpeech('Quase lá! Tente pronunciar novamente mais perto do microfone.');
        }
      }
    );
  };

  const handleStopSpeech = () => {
    if (abortSpeechRef.current) {
      abortSpeechRef.current();
      abortSpeechRef.current = null;
    }
    setSpeechState('done');
  };

  // Validate current answer
  const handleVerify = () => {
    if (status !== 'answering') {
      handleNext();
      return;
    }

    let isCorrect = false;

    if (currentExercise.type === 'multiple-choice' || currentExercise.type === 'dialogue') {
      isCorrect = selectedAnswer === currentExercise.correctAnswer;
    } else if (currentExercise.type === 'word-bank' || currentExercise.type === 'listen-bank') {
      const expected = currentExercise.correctAnswer;
      if (Array.isArray(expected)) {
        isCorrect =
          selectedWords.length === expected.length &&
          selectedWords.every((w, i) => w.toLowerCase().replace(/[^a-z0-9]/g, '') === expected[i].toLowerCase().replace(/[^a-z0-9]/g, ''));
      }
    } else if (currentExercise.type === 'speech') {
      isCorrect = spokenTranscript.length > 0;
    }

    if (isCorrect) {
      handleSuccess();
    } else {
      handleFail();
    }
  };

  const handleSuccess = () => {
    sound.playSuccess();
    setStatus('correct');
    setCombo((c) => c + 1);
    setMascotMood('correct');
    setMascotSpeech('Excelente! Resposta correta!');
  };

  const handleFail = () => {
    sound.playError();
    loseHeart();
    setStatus('incorrect');
    setCombo(0);
    setMascotMood('wrong');
    setMascotSpeech('Opa! Não se preocupe: você terá a chance de refazer esta questão no final da lição!');

    // Add to review queue so user gets to redo it!
    if (!reviewQueue.some((q) => q.id === currentExercise.id)) {
      setReviewQueue((prev) => [...prev, currentExercise]);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < exerciseList.length) {
      setCurrentIndex((prev) => prev + 1);
    } else if (reviewQueue.length > 0) {
      // START REVIEW ROUND FOR MISSED EXERCISES!
      sound.playClick();
      setExerciseList([...reviewQueue]);
      setReviewQueue([]);
      setCurrentIndex(0);
      setIsReviewMode(true);
      setMascotMood('tip');
      setMascotSpeech('Hora de revisar! Vamos refazer as questões que você errou para fixar de vez!');
    } else {
      // COMPLETED EVERYTHING SUCCESSFULLY!
      setStatus('completed');
      sound.playVictory();
      setMascotMood('proud');
      completeLesson(lesson.id, lesson.xpReward);

      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.6 },
      });
    }
  };

  // When all hearts run out
  if (currentUser.hearts <= 0 && status !== 'completed') {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center border-4 border-rose-300 shadow-2xl">
          <Mascot mood="scared" size="lg" className="mx-auto mb-4" />
          <h2 className="font-fredoka text-3xl text-rose-600 mb-2">Sem Vidas!</h2>
          <p className="text-slate-600 font-bold mb-6 text-sm">
            Suas vidas acabaram nesta rodada! Recarregue suas vidas com gemas ou descanse um pouco antes de tentar novamente.
          </p>
          <button
            onClick={onClose}
            className="w-full py-4 btn-3d-blue rounded-2xl font-black text-lg cursor-pointer"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  // Lesson Finished Screen
  if (status === 'completed') {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-between p-6">
        <div className="w-full max-w-md flex flex-col items-center justify-center flex-1 text-center">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Mascot mood="proud" size="xl" speech="Parabéns! Você concluiu tudo com sucesso!" className="mb-4" />
          </motion.div>

          <h2 className="font-fredoka text-4xl text-amber-500 font-black mb-2">
            Lição Concluída!
          </h2>
          <p className="text-slate-600 font-bold text-base mb-8">
            Você aprendeu todas as frases e acertou a revisão com louvor!
          </p>

          {/* Reward cards */}
          <div className="grid grid-cols-2 gap-4 w-full mb-8">
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 text-center">
              <span className="text-xs font-black uppercase text-amber-700 tracking-wider">XP Ganho</span>
              <div className="text-3xl font-black text-amber-600 mt-1">+{lesson.xpReward}</div>
            </div>
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 text-center">
              <span className="text-xs font-black uppercase text-emerald-700 tracking-wider">Ofensiva</span>
              <div className="text-3xl font-black text-emerald-600 mt-1">{currentUser.streak} dias 🔥</div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md">
          <button
            onClick={onClose}
            className="w-full py-4 btn-3d-green rounded-2xl font-black text-lg tracking-wider uppercase cursor-pointer"
          >
            Continuar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col justify-between overflow-hidden">
      {/* Top Header Bar */}
      <div className="max-w-4xl w-full mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 p-2 rounded-xl transition-colors cursor-pointer"
        >
          <X className="w-6 h-6 stroke-[3]" />
        </button>

        {/* Progress Bar with Review Indicator */}
        <div className="flex-1 flex flex-col">
          <div className="h-3.5 bg-slate-200 rounded-full overflow-hidden relative">
            <motion.div
              className={`h-full rounded-full transition-all ${
                isReviewMode ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          {isReviewMode && (
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 mt-1 flex items-center gap-1">
              <RotateCcw className="w-3 h-3" /> Rodada de Revisão (Refazendo os Erros)
            </span>
          )}
        </div>

        {/* Hearts */}
        <div className="flex items-center gap-1.5 text-rose-500 font-black text-lg">
          <Heart className="w-6 h-6 fill-rose-500 text-rose-500" />
          <span>{currentUser.hearts}</span>
        </div>
      </div>

      {/* Main Exercise View */}
      <div className="flex-1 max-w-2xl w-full mx-auto px-4 py-6 overflow-y-auto flex flex-col justify-center">
        {/* Exercise Prompt */}
        <h3 className="font-extrabold text-xl sm:text-2xl text-slate-800 mb-6">
          {currentExercise.prompt}
        </h3>

        {/* Portuguese phrase reference if applicable */}
        {currentExercise.portuguesePhrase && currentExercise.type !== 'dialogue' && (
          <div className="mb-6 p-4 bg-slate-100 rounded-2xl border-2 border-slate-200">
            <span className="text-xs font-black uppercase text-slate-500 tracking-wider block mb-1">
              Em Português:
            </span>
            <p className="text-lg sm:text-xl font-bold text-slate-800">
              "{currentExercise.portuguesePhrase}"
            </p>
          </div>
        )}

        {/* Exercise Type 1: Listen Bank */}
        {currentExercise.type === 'listen-bank' && currentExercise.audioText && (
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => {
                sound.playClick();
                speakEnglish(currentExercise.audioText!);
              }}
              className="p-4 btn-3d-blue rounded-2xl cursor-pointer flex items-center gap-2 font-black"
            >
              <Volume2 className="w-8 h-8" />
              <span>Ouvir</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                speakEnglish(currentExercise.audioText!, true);
              }}
              className="p-4 bg-amber-100 hover:bg-amber-200 border-2 border-amber-300 rounded-2xl cursor-pointer text-amber-800"
              title="Ouvir devagar"
            >
              <Snail className="w-8 h-8" />
            </button>
          </div>
        )}

        {/* Word Bank Input / Slots */}
        {(currentExercise.type === 'word-bank' || currentExercise.type === 'listen-bank') && (
          <div className="space-y-6">
            {/* Selected Words Line */}
            <div className="min-h-16 p-3 border-b-2 border-slate-300 flex flex-wrap gap-2 items-center">
              {selectedWords.map((word, idx) => (
                <button
                  key={`${word}-${idx}`}
                  onClick={() => handleWordDeselect(word, idx)}
                  className="px-4 py-2.5 bg-white border-2 border-slate-300 rounded-2xl font-bold text-base text-slate-800 shadow-sm hover:border-rose-400 cursor-pointer transition-all active:scale-95"
                >
                  {word}
                </button>
              ))}
              {selectedWords.length === 0 && (
                <span className="text-slate-400 text-sm font-semibold">
                  Toque nas palavras abaixo para montar a frase...
                </span>
              )}
            </div>

            {/* Available Words Pool */}
            <div className="flex flex-wrap gap-2 justify-center pt-4">
              {availableWords.map((word, idx) => (
                <button
                  key={`${word}-${idx}`}
                  onClick={() => handleWordSelect(word, idx)}
                  className="px-4 py-2.5 bg-white border-2 border-slate-200 border-b-4 border-b-slate-300 rounded-2xl font-bold text-base text-slate-700 hover:bg-slate-50 cursor-pointer active:border-b-2 active:translate-y-0.5 transition-all"
                >
                  {word}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Exercise Type 2: Multiple Choice */}
        {currentExercise.type === 'multiple-choice' && (
          <div className="space-y-3">
            {currentExercise.options?.map((opt, idx) => {
              const isSelected = selectedAnswer === opt;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    sound.playClick();
                    setSelectedAnswer(opt);
                    if (currentExercise.audioText) speakEnglish(opt);
                  }}
                  className={`w-full p-4 text-left rounded-2xl font-extrabold text-base transition-all cursor-pointer ${
                    isSelected ? 'btn-3d-selected' : 'btn-3d-card text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt}</span>
                    <Volume2
                      className="w-5 h-5 opacity-40 hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        speakEnglish(opt);
                      }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Exercise Type 3: Match Pairs */}
        {currentExercise.type === 'match-pairs' && currentExercise.pairItems && (
          <div className="grid grid-cols-2 gap-3">
            {currentExercise.pairItems.flatMap((pair) => [
              { type: 'en' as const, text: pair.en },
              { type: 'pt' as const, text: pair.pt },
            ]).sort((a, b) => a.text.localeCompare(b.text)).map((item, idx) => {
              const isMatched = matchedPairs.includes(item.text);
              const isSelected = selectedPair?.text === item.text;

              return (
                <button
                  key={idx}
                  disabled={isMatched}
                  onClick={() => handlePairClick(item.type, item.text)}
                  className={`p-4 rounded-2xl font-black text-sm sm:text-base transition-all cursor-pointer ${
                    isMatched
                      ? 'opacity-25 bg-emerald-100 text-emerald-800 border-2 border-emerald-300'
                      : isSelected
                      ? 'btn-3d-selected scale-102'
                      : 'btn-3d-card text-slate-800'
                  }`}
                >
                  {item.text}
                </button>
              );
            })}
          </div>
        )}

        {/* Exercise Type 4: Speech Practice with Live Continuous Capture */}
        {currentExercise.type === 'speech' && (
          <div className="text-center py-4 space-y-5">
            <div className="p-6 bg-sky-50 border-2 border-sky-200 rounded-3xl">
              <span className="text-xs font-black uppercase text-sky-600 tracking-wider block mb-2">
                Fale esta frase em voz alta:
              </span>
              <p className="text-2xl font-black text-slate-800 mb-3">
                "{currentExercise.englishPhrase}"
              </p>
              <button
                onClick={() => speakEnglish(currentExercise.englishPhrase!)}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-sky-300 rounded-xl text-sky-700 hover:bg-sky-100 font-bold text-xs cursor-pointer transition-colors shadow-2xs"
              >
                <Volume2 className="w-4 h-4" />
                <span>Ouvir pronúncia nativa</span>
              </button>
            </div>

            {/* Microphone Button with Dynamic Continuous States */}
            <div className="flex flex-col items-center">
              {speechState === 'listening' ? (
                <button
                  onClick={handleStopSpeech}
                  className="w-24 h-24 rounded-full bg-rose-500 text-white flex items-center justify-center cursor-pointer shadow-lg animate-pulse scale-110"
                  title="Clique para parar de gravar"
                >
                  <div className="w-8 h-8 bg-white rounded-lg" />
                </button>
              ) : (
                <button
                  onClick={handleSpeechRecord}
                  className="w-24 h-24 rounded-full btn-3d-blue flex items-center justify-center cursor-pointer shadow-lg"
                  title="Toque no microfone e fale"
                >
                  {speechState === 'processing' ? (
                    <RefreshCw className="w-10 h-10 animate-spin text-white" />
                  ) : (
                    <Mic className="w-10 h-10 text-white" />
                  )}
                </button>
              )}

              <span className="text-slate-700 font-black text-sm mt-3">
                {speechState === 'listening'
                  ? '🎙️ Microfone ouvindo... Fale agora! (Toque no botão vermelho quando terminar)'
                  : speechState === 'processing'
                  ? 'Avaliando o que você disse...'
                  : 'Toque no microfone para falar'}
              </span>

              {/* Live words being spoken */}
              {spokenTranscript && (
                <div className="mt-3 p-3 bg-emerald-50 border border-emerald-300 rounded-2xl max-w-sm">
                  <span className="text-[11px] font-black uppercase text-emerald-700 block mb-0.5">
                    Ouvido pelo sistema:
                  </span>
                  <p className="text-base font-black text-slate-800">
                    "{spokenTranscript}"
                  </p>
                </div>
              )}

              {/* Error Message with Help */}
              {speechMessage && speechState === 'error' && (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-300 rounded-2xl max-w-sm text-xs text-amber-900 font-bold text-center">
                  {speechMessage}
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  sound.playClick();
                  handleSuccess();
                }}
                className="text-xs text-slate-400 hover:text-slate-600 underline font-bold cursor-pointer"
              >
                Não posso falar agora / Continuar
              </button>
            </div>
          </div>
        )}

        {/* Exercise Type 5: Dialogue Story */}
        {currentExercise.type === 'dialogue' && currentExercise.dialogueLines && (
          <div className="space-y-4">
            <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-2xl border-2 border-slate-200">
              {currentExercise.dialogueLines.map((line, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center font-black text-amber-800 text-xs shrink-0">
                    {line.speaker[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-slate-500">{line.speaker}</span>
                      <Volume2
                        className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-sky-500"
                        onClick={() => speakEnglish(line.text)}
                      />
                    </div>
                    <p className="font-black text-slate-800 text-sm sm:text-base">{line.text}</p>
                    <p className="text-xs text-slate-400 font-medium italic">{line.translation}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Multiple choice for dialogue */}
            <div className="space-y-2">
              {currentExercise.options?.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    sound.playClick();
                    setSelectedAnswer(opt);
                  }}
                  className={`w-full p-3.5 text-left rounded-2xl font-bold text-sm cursor-pointer ${
                    selectedAnswer === opt ? 'btn-3d-selected' : 'btn-3d-card text-slate-700'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mascot dynamic companion */}
        <div className="mt-8 flex justify-center">
          <Mascot mood={mascotMood} speech={mascotSpeech} size="sm" />
        </div>
      </div>

      {/* Bottom Action Footer Sheet */}
      <div
        className={`w-full border-t-2 p-4 sm:p-6 transition-all ${
          status === 'correct'
            ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
            : status === 'incorrect'
            ? 'bg-rose-100 border-rose-300 text-rose-900'
            : 'bg-white border-slate-200'
        }`}
      >
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div className="flex-1">
            {status === 'correct' && (
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-fredoka text-xl text-emerald-800 font-black">
                    Sensacional!
                  </h4>
                  <p className="text-xs sm:text-sm font-bold text-emerald-700">
                    Resposta certa!
                  </p>
                </div>
              </div>
            )}

            {status === 'incorrect' && (
              <div className="flex items-center gap-3">
                <XCircle className="w-8 h-8 text-rose-600 shrink-0" />
                <div>
                  <h4 className="font-fredoka text-xl text-rose-800 font-black">
                    Ops, quase lá!
                  </h4>
                  <p className="text-xs sm:text-sm font-bold text-rose-700">
                    Correto:{' '}
                    <span className="font-black underline">
                      {Array.isArray(currentExercise.correctAnswer)
                        ? currentExercise.correctAnswer.join(' ')
                        : currentExercise.correctAnswer}
                    </span>
                  </p>
                  <p className="text-[11px] font-bold text-rose-600 mt-0.5">
                    Você terá a chance de refazer esta questão no final da lição!
                  </p>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleVerify}
            className={`py-3.5 px-8 rounded-2xl font-black text-base uppercase tracking-wider cursor-pointer transition-all ${
              status === 'correct'
                ? 'btn-3d-green'
                : status === 'incorrect'
                ? 'btn-3d-red'
                : 'btn-3d-green'
            }`}
          >
            {status === 'answering' ? 'Verificar' : 'Continuar'}
          </button>
        </div>
      </div>
    </div>
  );
};
