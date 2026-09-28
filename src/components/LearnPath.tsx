import React, { useState, useEffect } from 'react';
import {
  Star,
  Check,
  Lock,
  Compass,
  Sparkles,
} from 'lucide-react';
import { COURSE_UNITS } from '../data/courses';
import type { Lesson, Unit } from '../data/courses';
import { useUser } from '../context/UserContext';
import { sound } from '../utils/audio';
import { PacocaBadge } from './PacocaBadge';
import type { PacocaBadgeType } from './PacocaBadge';

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

  // Locked Category Alert Notice
  const [lockedNotice, setLockedNotice] = useState<{
    targetLevel: string;
    requiredLevel: string;
  } | null>(null);

  // Sync with currentUser.level if it updates (e.g. from placement test)
  useEffect(() => {
    if (currentUser?.level) {
      setSelectedLevel(currentUser.level);
    }
  }, [currentUser?.level]);

  if (!currentUser) return null;

  const isLessonCompleted = (id: string) => currentUser.completedLessons.includes(id);

  // Level Completion & Lock Status Logic
  const a1Units = COURSE_UNITS.filter((u) => u.level === 'A1');
  const a1Lessons = a1Units.flatMap((u) => u.lessons);
  const a1CompletedCount = a1Lessons.filter((l) => isLessonCompleted(l.id)).length;
  const isA1FullyCompleted = a1Lessons.length > 0 && a1CompletedCount === a1Lessons.length;

  const a2Units = COURSE_UNITS.filter((u) => u.level === 'A2');
  const a2Lessons = a2Units.flatMap((u) => u.lessons);
  const a2CompletedCount = a2Lessons.filter((l) => isLessonCompleted(l.id)).length;
  const isA2FullyCompleted = a2Lessons.length > 0 && a2CompletedCount === a2Lessons.length;

  // Unlocking Rules:
  // A1: always unlocked
  // A2: unlocked if user placed into A2/B1 OR completed all A1 lessons
  // B1: unlocked if user placed into B1 OR completed all A2 lessons
  const isA2Unlocked = currentUser.level === 'A2' || currentUser.level === 'B1' || isA1FullyCompleted;
  const isB1Unlocked = currentUser.level === 'B1' || (isA2Unlocked && isA2FullyCompleted);

  const handleSelectLevel = (level: 'A1' | 'A2' | 'B1') => {
    // Check if category is locked
    if (level === 'A2' && !isA2Unlocked) {
      sound.playError();
      setLockedNotice({
        targetLevel: 'Nível A2 (Básico & Viagens)',
        requiredLevel: 'Nível A1 (Iniciante)',
      });
      return;
    }

    if (level === 'B1' && !isB1Unlocked) {
      sound.playError();
      setLockedNotice({
        targetLevel: 'Nível B1 (Intermediário & Carreira)',
        requiredLevel: 'Nível A2 (Básico & Viagens)',
      });
      return;
    }

    sound.playClick();
    setLockedNotice(null);
    setSelectedLevel(level);
    if (setPlacementLevel && currentUser.level !== level) {
      setPlacementLevel(level);
    }
  };

  // Filter units strictly for the active unlocked category level
  const levelUnits: Unit[] = COURSE_UNITS.filter((u) => u.level === selectedLevel);

  // Overall stats for the selected level
  const totalLessonsInLevel = levelUnits.reduce((acc, u) => acc + u.lessons.length, 0);
  const completedLessonsInLevel = levelUnits.reduce(
    (acc, u) => acc + u.lessons.filter((l) => isLessonCompleted(l.id)).length,
    0
  );
  const levelPercent =
    totalLessonsInLevel > 0 ? Math.round((completedLessonsInLevel / totalLessonsInLevel) * 100) : 0;

  // Map each unit ID to its unique, bespoke Paçoca badge
  const getUnitBadge = (unitId: string): PacocaBadgeType => {
    switch (unitId) {
      case 'unit-1':
        return 'unit-welcome';
      case 'unit-2':
        return 'unit-family';
      case 'unit-3-a1':
        return 'unit-clock';
      case 'unit-4-a1':
        return 'unit-home';
      case 'unit-5-a2':
        return 'unit-restaurant';
      case 'unit-6-a2':
        return 'unit-travel';
      case 'unit-7-a2':
        return 'unit-hotel';
      case 'unit-8-a2':
        return 'unit-city';
      case 'unit-9-b1':
        return 'unit-career';
      case 'unit-10-b1':
        return 'unit-slang';
      case 'unit-11-b1':
        return 'unit-ideas';
      case 'unit-12-b1':
        return 'unit-coffee';
      default:
        return 'unit-welcome';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
      {/* ============================================================ */}
      {/* 1. PLACEMENT TEST HERO BANNER                                */}
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
              Faça o Teste Rápido (12 perguntas) e desbloqueie instantaneamente a categoria A1, A2 ou B1 ideal para você!
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
      {/* LOCKED CATEGORY ALERT NOTICE (When clicking locked level)    */}
      {/* ============================================================ */}
      {lockedNotice && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-200 text-amber-900 rounded-xl shrink-0 mt-0.5">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-amber-900 text-base">
                Categoria Bloqueada: {lockedNotice.targetLevel}
              </h4>
              <p className="text-xs sm:text-sm text-amber-800 font-medium">
                Você precisa concluir todas as lições do <strong>{lockedNotice.requiredLevel}</strong> ou obter pontuação correspondente no Teste de Nivelamento para acessar esta categoria.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            {onOpenPlacementTest && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onOpenPlacementTest();
                }}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-black text-xs uppercase tracking-wider cursor-pointer shadow-xs active:scale-95 transition-all"
              >
                Fazer Teste de Nível
              </button>
            )}
            <button
              type="button"
              onClick={() => setLockedNotice(null)}
              className="px-3 py-2 text-xs font-bold text-amber-700 hover:text-amber-900 cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. CATEGORY SELECTOR TABS (With Original Paçoca Medallions)  */}
      {/* ============================================================ */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">
            Categorias de Aprendizado do Paçoca:
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

        {/* 3 Level Tabs with Custom Paçoca Medallions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* TAB A1 */}
          <button
            type="button"
            onClick={() => handleSelectLevel('A1')}
            className={`p-4 rounded-3xl border-2 text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
              selectedLevel === 'A1'
                ? 'bg-emerald-50 border-emerald-500 shadow-md scale-101 border-b-6 border-b-emerald-600'
                : 'bg-white border-slate-200 hover:bg-slate-50 border-b-4 border-b-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <PacocaBadge badge="level-a1" size="md" />
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
                  Iniciante & Família
                </span>
              </div>
            </div>
            <span
              className={`text-xs font-black px-2.5 py-1 rounded-xl shrink-0 ${
                selectedLevel === 'A1' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              4 Unidades
            </span>
          </button>

          {/* TAB A2 (LOCKED IF NOT PASSED) */}
          <button
            type="button"
            onClick={() => handleSelectLevel('A2')}
            className={`p-4 rounded-3xl border-2 text-left transition-all flex items-center justify-between gap-3 ${
              !isA2Unlocked
                ? 'bg-slate-100/80 border-slate-300 border-b-4 border-b-slate-400 opacity-75 cursor-not-allowed'
                : selectedLevel === 'A2'
                ? 'bg-amber-50 border-amber-500 shadow-md scale-101 border-b-6 border-b-amber-600 cursor-pointer'
                : 'bg-white border-slate-200 hover:bg-slate-50 border-b-4 border-b-slate-300 cursor-pointer'
            }`}
          >
            <div className="flex items-center gap-3">
              <PacocaBadge badge="level-a2" size="md" locked={!isA2Unlocked} />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black text-slate-800">Nível A2</span>
                  {!isA2Unlocked ? (
                    <span className="px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded font-black text-[9px] uppercase flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> Bloqueado
                    </span>
                  ) : (
                    currentUser.level === 'A2' && (
                      <span className="px-1.5 py-0.5 bg-amber-200 text-amber-800 rounded font-black text-[9px] uppercase">
                        Seu Nível
                      </span>
                    )
                  )}
                </div>
                <span className="text-xs text-slate-500 font-medium block">
                  {!isA2Unlocked ? 'Complete o Nível A1 para liberar' : 'Básico & Viagens'}
                </span>
              </div>
            </div>
            <span
              className={`text-xs font-black px-2.5 py-1 rounded-xl shrink-0 ${
                !isA2Unlocked
                  ? 'bg-slate-200 text-slate-400'
                  : selectedLevel === 'A2'
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              4 Unidades
            </span>
          </button>

          {/* TAB B1 (LOCKED IF NOT PASSED) */}
          <button
            type="button"
            onClick={() => handleSelectLevel('B1')}
            className={`p-4 rounded-3xl border-2 text-left transition-all flex items-center justify-between gap-3 ${
              !isB1Unlocked
                ? 'bg-slate-100/80 border-slate-300 border-b-4 border-b-slate-400 opacity-75 cursor-not-allowed'
                : selectedLevel === 'B1'
                ? 'bg-indigo-50 border-indigo-500 shadow-md scale-101 border-b-6 border-b-indigo-600 cursor-pointer'
                : 'bg-white border-slate-200 hover:bg-slate-50 border-b-4 border-b-slate-300 cursor-pointer'
            }`}
          >
            <div className="flex items-center gap-3">
              <PacocaBadge badge="level-b1" size="md" locked={!isB1Unlocked} />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black text-slate-800">Nível B1</span>
                  {!isB1Unlocked ? (
                    <span className="px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded font-black text-[9px] uppercase flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> Bloqueado
                    </span>
                  ) : (
                    currentUser.level === 'B1' && (
                      <span className="px-1.5 py-0.5 bg-indigo-200 text-indigo-800 rounded font-black text-[9px] uppercase">
                        Seu Nível
                      </span>
                    )
                  )}
                </div>
                <span className="text-xs text-slate-500 font-medium block">
                  {!isB1Unlocked ? 'Complete o Nível A2 para liberar' : 'Intermediário & Fluência'}
                </span>
              </div>
            </div>
            <span
              className={`text-xs font-black px-2.5 py-1 rounded-xl shrink-0 ${
                !isB1Unlocked
                  ? 'bg-slate-200 text-slate-400'
                  : selectedLevel === 'B1'
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
        <div className="flex items-center gap-4">
          <PacocaBadge
            badge={
              selectedLevel === 'A1'
                ? 'level-a1'
                : selectedLevel === 'A2'
                ? 'level-a2'
                : 'level-b1'
            }
            size="md"
          />
          <div>
            <span className="text-xs font-black uppercase text-sky-600 tracking-wider block">
              Categoria Ativa
            </span>
            <h2 className="font-fredoka text-2xl sm:text-3xl font-black text-slate-800">
              {selectedLevel === 'A1' && 'Nível A1: Primeiros Passos & Família'}
              {selectedLevel === 'A2' && 'Nível A2: Sobrevivência & Viagens'}
              {selectedLevel === 'B1' && 'Nível B1: Carreira & Conversação Fluente'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Lições exclusivas do seu nível. Complete cada lição para avançar na sua jornada!
            </p>
          </div>
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
      {/* 4. STRUCTURED UNIT CARDS (Custom Paçoca 3D Emblems)         */}
      {/* ============================================================ */}
      <div className="space-y-6">
        {levelUnits.map((unit, unitIdx) => {
          const unitTotal = unit.lessons.length;
          const unitCompleted = unit.lessons.filter((l) => isLessonCompleted(l.id)).length;
          const unitPercent = unitTotal > 0 ? Math.round((unitCompleted / unitTotal) * 100) : 0;
          const badgeType = getUnitBadge(unit.id);

          return (
            <div
              key={unit.id}
              className="bg-white border-2 border-slate-200 border-b-6 border-b-slate-300 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6"
            >
              {/* Unit Header with Unique Paçoca Badge Emblem */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-4">
                  <PacocaBadge badge={badgeType} size="md" />
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

                  // Unlocking Logic within the Category
                  const prevLesson = unit.lessons[lessonIdx - 1];
                  const prevUnit = levelUnits[unitIdx - 1];
                  const lastLessonOfPrevUnit = prevUnit
                    ? prevUnit.lessons[prevUnit.lessons.length - 1]
                    : null;

                  const isUnlocked =
                    completed ||
                    (isFirstUnitOfLevel && isFirstLessonOfUnit) ||
                    (lessonIdx > 0 && isLessonCompleted(prevLesson?.id || '')) ||
                    (isFirstLessonOfUnit &&
                      lastLessonOfPrevUnit &&
                      isLessonCompleted(lastLessonOfPrevUnit.id));

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
                            <Sparkles className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> +
                            {lesson.xpReward} XP
                          </span>
                        </div>

                        <h4 className="font-black text-base text-slate-800 leading-snug">
                          {lesson.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2">{lesson.description}</p>
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
