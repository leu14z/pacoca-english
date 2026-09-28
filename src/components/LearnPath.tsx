import React, { useState, useEffect } from 'react';
import { Star, Check, Lock, Compass, Sparkles } from 'lucide-react';
import { COURSE_UNITS } from '../data/courses';
import type { Lesson, Unit } from '../data/courses';
import { useUser } from '../context/UserContext';
import { sound } from '../utils/audio';

interface LearnPathProps {
  onStartLesson: (lesson: Lesson) => void;
  onOpenPlacementTest?: () => void;
}

export const LearnPath: React.FC<LearnPathProps> = ({ onStartLesson, onOpenPlacementTest }) => {
  const { currentUser, setPlacementLevel } = useUser();

  // Active Category Level Filter: strictly 'A1' | 'A2' | 'B1'
  const [selectedLevel, setSelectedLevel] = useState<'A1' | 'A2' | 'B1'>(() => {
    return (currentUser?.level as 'A1' | 'A2' | 'B1') || 'A1';
  });

  // Sync with currentUser.level if it updates (e.g. from placement test)
  useEffect(() => {
    if (currentUser?.level) {
      setSelectedLevel(currentUser.level);
    }
  }, [currentUser?.level]);

  if (!currentUser) return null;

  const isLessonCompleted = (id: string) => currentUser.completedLessons.includes(id);

  // Filter units strictly for the selected category level
  const levelUnits: Unit[] = COURSE_UNITS.filter((u) => u.level === selectedLevel);

  // Overall stats for the selected level
  const totalLessonsInLevel = levelUnits.reduce((acc, u) => acc + u.lessons.length, 0);
  const completedLessonsInLevel = levelUnits.reduce(
    (acc, u) => acc + u.lessons.filter((l) => isLessonCompleted(l.id)).length,
    0
  );
  const levelPercent = totalLessonsInLevel > 0
    ? Math.round((completedLessonsInLevel / totalLessonsInLevel) * 100)
    : 0;

  const handleSelectLevel = (level: 'A1' | 'A2' | 'B1') => {
    sound.playClick();
    setSelectedLevel(level);
    if (setPlacementLevel && currentUser.level !== level) {
      setPlacementLevel(level);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
      {/* ============================================================ */}
      {/* 1. PLACEMENT TEST HERO BANNER (Optional or Top Callout)      */}
      {/* ============================================================ */}
      {!currentUser.placementCompleted && onOpenPlacementTest && (
        <div className="bg-gradient-to-r from-sky-500 to-indigo-600 rounded-3xl p-5 sm:p-6 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-black uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" /> Descubra seu Nível Exato
            </span>
            <h3 className="font-fredoka text-xl sm:text-2xl font-black">
              Não sabe por onde começar?
            </h3>
            <p className="text-xs sm:text-sm text-sky-100 font-medium max-w-md">
              Faça o Teste Rápido (12 perguntas) e pule direto para o nível A1, A2 ou B1 ideal para você!
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenPlacementTest();
            }}
            className="px-5 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-2xl font-black text-sm uppercase tracking-wider cursor-pointer shadow-md active:scale-95 transition-all shrink-0"
          >
            Fazer Teste de Nível
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. CATEGORY SELECTOR TABS (A1, A2, B1)                       */}
      {/* User ONLY sees the lessons of the active category!          */}
      {/* ============================================================ */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">
            Selecione a sua categoria de aprendizado:
          </span>
          {onOpenPlacementTest && (
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onOpenPlacementTest();
              }}
              className="text-xs font-extrabold text-sky-600 hover:text-sky-700 underline cursor-pointer"
            >
              Refazer Teste de Nivelamento
            </button>
          )}
        </div>

        {/* 3 Main Level Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* TAB A1 */}
          <button
            type="button"
            onClick={() => handleSelectLevel('A1')}
            className={`p-4 rounded-3xl border-2 text-left transition-all cursor-pointer flex items-center justify-between ${
              selectedLevel === 'A1'
                ? 'bg-emerald-50 border-emerald-500 shadow-md scale-101 border-b-6 border-b-emerald-600'
                : 'bg-white border-slate-200 hover:bg-slate-50 border-b-4 border-b-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">🌱</span>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black text-slate-800">Nível A1</span>
                  {currentUser.level === 'A1' && (
                    <span className="px-1.5 py-0.5 bg-emerald-200 text-emerald-800 rounded font-black text-[9px] uppercase">
                      Seu Nível
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-500 font-medium block">
                  Iniciante & Família (Zero)
                </span>
              </div>
            </div>
            <span
              className={`text-xs font-black px-2.5 py-1 rounded-xl ${
                selectedLevel === 'A1'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              4 Unidades
            </span>
          </button>

          {/* TAB A2 */}
          <button
            type="button"
            onClick={() => handleSelectLevel('A2')}
            className={`p-4 rounded-3xl border-2 text-left transition-all cursor-pointer flex items-center justify-between ${
              selectedLevel === 'A2'
                ? 'bg-amber-50 border-amber-500 shadow-md scale-101 border-b-6 border-b-amber-600'
                : 'bg-white border-slate-200 hover:bg-slate-50 border-b-4 border-b-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">🚀</span>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black text-slate-800">Nível A2</span>
                  {currentUser.level === 'A2' && (
                    <span className="px-1.5 py-0.5 bg-amber-200 text-amber-800 rounded font-black text-[9px] uppercase">
                      Seu Nível
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-500 font-medium block">
                  Básico & Viagens
                </span>
              </div>
            </div>
            <span
              className={`text-xs font-black px-2.5 py-1 rounded-xl ${
                selectedLevel === 'A2'
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              4 Unidades
            </span>
          </button>

          {/* TAB B1 */}
          <button
            type="button"
            onClick={() => handleSelectLevel('B1')}
            className={`p-4 rounded-3xl border-2 text-left transition-all cursor-pointer flex items-center justify-between ${
              selectedLevel === 'B1'
                ? 'bg-indigo-50 border-indigo-500 shadow-md scale-101 border-b-6 border-b-indigo-600'
                : 'bg-white border-slate-200 hover:bg-slate-50 border-b-4 border-b-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">⭐</span>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black text-slate-800">Nível B1</span>
                  {currentUser.level === 'B1' && (
                    <span className="px-1.5 py-0.5 bg-indigo-200 text-indigo-800 rounded font-black text-[9px] uppercase">
                      Seu Nível
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-500 font-medium block">
                  Intermediário & Fluência
                </span>
              </div>
            </div>
            <span
              className={`text-xs font-black px-2.5 py-1 rounded-xl ${
                selectedLevel === 'B1'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              4 Unidades
            </span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. ACTIVE LEVEL HEADER & PROGRESS BAR                        */}
      {/* ============================================================ */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase text-sky-600 tracking-wider">
            Visualizando Categoria
          </span>
          <h2 className="font-fredoka text-2xl sm:text-3xl font-black text-slate-800">
            {selectedLevel === 'A1' && '🌱 Nível A1: Primeiros Passos & Família'}
            {selectedLevel === 'A2' && '🚀 Nível A2: Sobrevivência & Viagens'}
            {selectedLevel === 'B1' && '⭐ Nível B1: Carreira & Conversação Fluente'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Mostrando apenas as lições da sua categoria. Complete as atividades para avançar!
          </p>
        </div>

        {/* Level Progress Indicator */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl shrink-0">
          <div className="text-right">
            <span className="text-[10px] font-black uppercase text-slate-400 block">Progresso do Nível</span>
            <span className="text-sm font-black text-slate-800">
              {completedLessonsInLevel}/{totalLessonsInLevel} Feitas
            </span>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-slate-200 flex items-center justify-center font-black text-xs text-sky-600">
            {levelPercent}%
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. STRUCTURED UNIT CARDS (NO WINDING SNAKE, NO MESS)         */}
      {/* Each unit contains a compact grid of activities             */}
      {/* ============================================================ */}
      <div className="space-y-6">
        {levelUnits.map((unit, unitIdx) => {
          const unitTotal = unit.lessons.length;
          const unitCompleted = unit.lessons.filter((l) => isLessonCompleted(l.id)).length;
          const unitPercent = unitTotal > 0 ? Math.round((unitCompleted / unitTotal) * 100) : 0;

          return (
            <div
              key={unit.id}
              className="bg-white border-2 border-slate-200 border-b-6 border-b-slate-300 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6"
            >
              {/* Unit Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-2xl shrink-0 shadow-2xs">
                    {unit.icon || '📖'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-sky-600">
                        Unidade {unitIdx + 1}
                      </span>
                      {unitPercent === 100 && (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-black text-[10px] uppercase flex items-center gap-1">
                          <Check className="w-3 h-3 stroke-[3]" /> Concluída
                        </span>
                      )}
                    </div>
                    <h3 className="font-extrabold text-lg sm:text-xl text-slate-800">
                      {unit.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      {unit.subtitle}
                    </p>
                  </div>
                </div>

                {/* Progress bar inside unit */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-24 bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${unitPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-black text-slate-600">
                    {unitCompleted}/{unitTotal}
                  </span>
                </div>
              </div>

              {/* Grid of Lessons (Structured 2-3 Columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {unit.lessons.map((lesson, lessonIdx) => {
                  const completed = isLessonCompleted(lesson.id);
                  const isFirstLessonOfUnit = lessonIdx === 0;
                  const isFirstUnitOfLevel = unitIdx === 0;

                  // Unlocking Logic
                  const prevLesson = unit.lessons[lessonIdx - 1];
                  const prevUnit = levelUnits[unitIdx - 1];
                  const lastLessonOfPrevUnit = prevUnit ? prevUnit.lessons[prevUnit.lessons.length - 1] : null;

                  const isUnlocked =
                    completed ||
                    (isFirstUnitOfLevel && isFirstLessonOfUnit) ||
                    (lessonIdx > 0 && isLessonCompleted(prevLesson?.id || '')) ||
                    (isFirstLessonOfUnit && lastLessonOfPrevUnit && isLessonCompleted(lastLessonOfPrevUnit.id));

                  const isNextUp = isUnlocked && !completed;

                  return (
                    <div
                      key={lesson.id}
                      className={`p-4 sm:p-5 rounded-2xl border-2 transition-all flex flex-col justify-between gap-4 ${
                        completed
                          ? 'bg-emerald-50/40 border-emerald-300 border-b-4 border-b-emerald-400'
                          : isNextUp
                          ? 'bg-sky-50 border-sky-400 border-b-6 border-b-sky-500 shadow-md ring-2 ring-sky-300/40'
                          : 'bg-slate-50 border-slate-200 border-b-4 border-b-slate-300 opacity-60'
                      }`}
                    >
                      {/* Card Header info */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                              completed
                                ? 'bg-emerald-200 text-emerald-800'
                                : isNextUp
                                ? 'bg-sky-200 text-sky-800'
                                : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            Lição {lessonIdx + 1}
                          </span>
                          <span className="text-[11px] font-black text-amber-600 flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> +{lesson.xpReward} XP
                          </span>
                        </div>

                        <h4 className="font-black text-base text-slate-800 leading-snug">
                          {lesson.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2">
                          {lesson.description}
                        </p>
                      </div>

                      {/* Card Action Button */}
                      <div>
                        {completed ? (
                          <button
                            type="button"
                            onClick={() => {
                              sound.playClick();
                              onStartLesson(lesson);
                            }}
                            className="w-full py-2.5 px-3 bg-white hover:bg-emerald-100 border-2 border-emerald-400 border-b-4 border-b-emerald-500 rounded-xl font-black text-xs text-emerald-800 flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-2xs"
                          >
                            <Check className="w-4 h-4 stroke-[3]" /> Concluída (Praticar)
                          </button>
                        ) : isNextUp ? (
                          <button
                            type="button"
                            onClick={() => {
                              sound.playClick();
                              onStartLesson(lesson);
                            }}
                            className="w-full py-3 px-3 btn-3d-blue rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95 transition-all animate-pulse"
                          >
                            <Star className="w-4 h-4 fill-white" /> Começar Lição
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className="w-full py-2.5 px-3 bg-slate-200 border-2 border-slate-300 rounded-xl font-bold text-xs text-slate-400 flex items-center justify-center gap-1.5 cursor-not-allowed"
                          >
                            <Lock className="w-3.5 h-3.5" /> Bloqueada
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
