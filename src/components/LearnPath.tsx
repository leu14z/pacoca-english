import React from 'react';
import { Star, Check, Lock, Sparkles, Compass } from 'lucide-react';
import { COURSE_UNITS } from '../data/courses';
import type { Lesson } from '../data/courses';
import { useUser } from '../context/UserContext';
import { Mascot } from './Mascot';
import { sound } from '../utils/audio';

interface LearnPathProps {
  onStartLesson: (lesson: Lesson) => void;
  onOpenPlacementTest?: () => void;
}

export const LearnPath: React.FC<LearnPathProps> = ({ onStartLesson, onOpenPlacementTest }) => {
  const { currentUser } = useUser();

  if (!currentUser) return null;

  const isLessonCompleted = (id: string) => currentUser.completedLessons.includes(id);

  // Offset pattern for the winding path
  const getOffsetClass = (index: number) => {
    const offsets = ['translate-x-0', '-translate-x-12', 'translate-x-12', '-translate-x-6', 'translate-x-8'];
    return offsets[index % offsets.length];
  };

  return (
    <div className="max-w-2xl mx-auto space-y-10 pb-24">
      {/* Placement Test Interactive Banner */}
      <div className="bg-linear-to-r from-indigo-600 via-sky-600 to-emerald-600 p-5 sm:p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 border-2 border-white/20 relative overflow-hidden">
        <div className="flex items-center gap-3.5 relative z-10 text-left">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/30 shadow-inner">
            <Compass className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-sky-200 block">
              {currentUser.placementCompleted ? `Nível Classificado: ${currentUser.level || 'A1'}` : 'Descubra seu Nível Oficial'}
            </span>
            <h4 className="font-fredoka text-lg sm:text-xl font-black leading-tight text-white">
              {currentUser.placementCompleted ? 'Refazer Teste de Nivelamento' : '🎯 Teste de Nivelamento Inicial'}
            </h4>
            <p className="text-white/90 text-xs font-semibold max-w-sm">
              Quiz rápido de 12 perguntas (vocabulário, áudio e gramática) para você ou seus pais começarem no nível ideal!
            </p>
          </div>
        </div>

        {onOpenPlacementTest && (
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenPlacementTest();
            }}
            className="w-full sm:w-auto px-5 py-3 bg-white text-indigo-700 hover:bg-slate-100 font-black text-xs uppercase tracking-wider rounded-2xl cursor-pointer shadow-md transition-all active:scale-95 shrink-0 z-10"
          >
            {currentUser.placementCompleted ? 'Refazer Teste' : 'Fazer Teste Agora'}
          </button>
        )}
      </div>
      {COURSE_UNITS.map((unit, unitIdx) => {
        const prevUnit = COURSE_UNITS[unitIdx - 1];
        const isNewModule = !prevUnit || prevUnit.moduleTitle !== unit.moduleTitle;

        return (
          <div key={unit.id} className="relative">
            {/* Module Level Divider */}
            {isNewModule && (
              <div className="flex items-center justify-center gap-3 my-8">
                <div className="h-0.5 bg-slate-300 flex-1" />
                <span className="px-4 py-1.5 bg-slate-800 text-white rounded-full font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-xs">
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  {unit.moduleTitle}
                </span>
                <div className="h-0.5 bg-slate-300 flex-1" />
              </div>
            )}

            {/* Unit Header Banner */}
            <div
              className={`p-6 rounded-3xl text-white shadow-lg mb-8 relative overflow-hidden ${
                unit.color === 'emerald'
                  ? 'bg-emerald-500 border-b-6 border-emerald-600'
                  : unit.color === 'sky'
                  ? 'bg-sky-500 border-b-6 border-sky-600'
                  : unit.color === 'rose'
                  ? 'bg-rose-500 border-b-6 border-rose-600'
                  : 'bg-amber-500 border-b-6 border-amber-600'
              }`}
            >
              <div className="relative z-10">
                <span className="text-xs font-black uppercase tracking-widest text-white/80 block mb-1">
                  {unit.title.split(':')[0]}
                </span>
                <h3 className="font-fredoka text-2xl sm:text-3xl font-black mb-1">
                  {unit.title.split(':')[1] || unit.title}
                </h3>
                <p className="text-white/90 text-sm font-bold max-w-md">
                  {unit.subtitle}
                </p>
              </div>
              {/* Sparkle background decoration */}
              <Sparkles className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10" />
            </div>

            {/* Lessons Path Nodes */}
            <div className="flex flex-col items-center gap-8 relative">
              {unit.lessons.map((lesson, lessonIdx) => {
                const completed = isLessonCompleted(lesson.id);
                const isFirstEver = unitIdx === 0 && lessonIdx === 0;
                const prevLessonInUnit = unit.lessons[lessonIdx - 1];
                const prevUnitLastLesson = prevUnit?.lessons[prevUnit.lessons.length - 1];

                // Level placement unlocks
                const userLevel = currentUser.level || 'A1';
                const isUnlockedByLevel =
                  (userLevel === 'B1' && lessonIdx === 0) ||
                  (userLevel === 'A2' && unitIdx <= 4 && lessonIdx === 0) ||
                  isFirstEver;

                const isLocked = !completed && !isUnlockedByLevel && (
                  lessonIdx > 0
                    ? !isLessonCompleted(prevLessonInUnit?.id || '')
                    : !isLessonCompleted(prevUnitLastLesson?.id || '')
                );

                const isActive = !isLocked && !completed;
                const offset = getOffsetClass(lessonIdx);

                return (
                  <div key={lesson.id} className={`flex flex-col items-center relative transition-transform ${offset}`}>
                    {/* Floating Mascot cheering near active lesson */}
                    {isActive && (
                      <div className="absolute -right-28 -top-6 hidden sm:block">
                        <Mascot mood="official" size="sm" speech="Sua vez! Bora lá!" />
                      </div>
                    )}

                    {/* Circular 3D Lesson Node */}
                    <button
                      disabled={isLocked}
                      onClick={() => {
                        sound.playClick();
                        onStartLesson(lesson);
                      }}
                      className={`w-20 h-20 rounded-full flex flex-col items-center justify-center relative cursor-pointer transition-transform active:scale-95 shadow-md ${
                        completed
                          ? 'bg-amber-400 border-4 border-amber-300 border-b-8 border-b-amber-500 text-white'
                          : isLocked
                          ? 'bg-slate-200 border-4 border-slate-300 border-b-8 border-b-slate-400 text-slate-400 cursor-not-allowed'
                          : 'bg-emerald-500 border-4 border-emerald-300 border-b-8 border-b-emerald-600 text-white animate-pulse'
                      }`}
                    >
                      {completed ? (
                        <Check className="w-9 h-9 stroke-[3]" />
                      ) : isLocked ? (
                        <Lock className="w-8 h-8" />
                      ) : (
                        <Star className="w-9 h-9 fill-white text-white" />
                      )}

                      {/* Mini label for completed lessons */}
                      {completed && (
                        <span className="absolute -top-2 bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-300">
                          COMPLETO
                        </span>
                      )}
                    </button>

                    {/* Title tooltip under node */}
                    <div className="mt-2 text-center max-w-[180px]">
                      <h4 className="font-black text-slate-800 text-sm">{lesson.title}</h4>
                      <span className="text-[11px] font-bold text-slate-400">+{lesson.xpReward} XP</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
