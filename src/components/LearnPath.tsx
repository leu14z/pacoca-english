import React, { useState } from 'react';
import { Star, Check, Lock, Compass, ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { COURSE_UNITS, COURSE_MODULES } from '../data/courses';
import type { Lesson, CourseModule } from '../data/courses';
import { useUser } from '../context/UserContext';
import { sound } from '../utils/audio';

interface LearnPathProps {
  onStartLesson: (lesson: Lesson) => void;
  onOpenPlacementTest?: () => void;
}

export const LearnPath: React.FC<LearnPathProps> = ({ onStartLesson, onOpenPlacementTest }) => {
  const { currentUser } = useUser();
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);

  if (!currentUser) return null;

  const isLessonCompleted = (id: string) => currentUser.completedLessons.includes(id);

  const activeModule: CourseModule = COURSE_MODULES[activeModuleIndex] || COURSE_MODULES[0];
  const activeUnits = COURSE_UNITS.filter((u) => activeModule.unitIds.includes(u.id));

  // Count progress for active module
  const totalModuleLessons = activeUnits.reduce((acc, u) => acc + u.lessons.length, 0);
  const completedModuleLessons = activeUnits.reduce(
    (acc, u) => acc + u.lessons.filter((l) => isLessonCompleted(l.id)).length,
    0
  );
  const moduleProgressPercent = totalModuleLessons > 0 ? (completedModuleLessons / totalModuleLessons) * 100 : 0;

  const handlePrevModule = () => {
    sound.playClick();
    if (activeModuleIndex > 0) setActiveModuleIndex(activeModuleIndex - 1);
  };

  const handleNextModule = () => {
    sound.playClick();
    if (activeModuleIndex < COURSE_MODULES.length - 1) setActiveModuleIndex(activeModuleIndex + 1);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      {/* Placement Test Interactive Banner */}
      <div className="bg-linear-to-r from-indigo-600 via-sky-600 to-emerald-600 p-4 sm:p-5 rounded-3xl text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 border-2 border-white/20 relative overflow-hidden">
        <div className="flex items-center gap-3.5 relative z-10 text-left">
          <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/30 shadow-inner">
            <Compass className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-sky-200 block">
              {currentUser.placementCompleted ? `Nível Oficial: ${currentUser.level || 'A1'}` : 'Descubra seu Nível'}
            </span>
            <h4 className="font-fredoka text-base sm:text-lg font-black leading-tight text-white">
              {currentUser.placementCompleted ? 'Refazer Teste de Nivelamento' : '🎯 Teste de Nivelamento Inicial'}
            </h4>
            <p className="text-white/90 text-xs font-semibold max-w-sm">
              Quiz rápido de 12 perguntas para alocar você ou seus pais no nível ideal (A1, A2 ou B1)!
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
            className="w-full sm:w-auto px-4 py-2.5 bg-white text-indigo-700 hover:bg-slate-100 font-black text-xs uppercase tracking-wider rounded-2xl cursor-pointer shadow-md transition-all active:scale-95 shrink-0 z-10"
          >
            {currentUser.placementCompleted ? 'Refazer Teste' : 'Iniciar Teste'}
          </button>
        )}
      </div>

      {/* Modern Section Navigator (Horizontal Tabs - Stops Endless Scroll!) */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <Layers className="w-4 h-4" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Seletor de Módulos (Sem rolagem infinita)
            </span>
          </div>

          {/* Quick Prev / Next Arrows */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={activeModuleIndex === 0}
              onClick={handlePrevModule}
              className={`p-1.5 rounded-xl border border-slate-200 transition-colors ${
                activeModuleIndex === 0
                  ? 'opacity-30 cursor-not-allowed text-slate-400'
                  : 'hover:bg-slate-100 text-slate-700 cursor-pointer'
              }`}
              title="Módulo anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-500 px-1">
              {activeModuleIndex + 1}/{COURSE_MODULES.length}
            </span>
            <button
              type="button"
              disabled={activeModuleIndex === COURSE_MODULES.length - 1}
              onClick={handleNextModule}
              className={`p-1.5 rounded-xl border border-slate-200 transition-colors ${
                activeModuleIndex === COURSE_MODULES.length - 1
                  ? 'opacity-30 cursor-not-allowed text-slate-400'
                  : 'hover:bg-slate-100 text-slate-700 cursor-pointer'
              }`}
              title="Próximo módulo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Module Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {COURSE_MODULES.map((mod, idx) => {
            const isCurrent = idx === activeModuleIndex;
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => {
                  sound.playClick();
                  setActiveModuleIndex(idx);
                }}
                className={`px-4 py-2.5 rounded-2xl text-left shrink-0 transition-all cursor-pointer flex items-center gap-2.5 border-2 ${
                  isCurrent
                    ? 'bg-slate-900 border-slate-900 text-white shadow-md scale-102'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <span
                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                    isCurrent ? 'bg-amber-400 text-slate-900' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {mod.level}
                </span>
                <span className="text-xs font-black truncate max-w-[160px]">
                  {mod.shortTitle}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Module Focused Card & Progress */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-sky-100 text-sky-800 rounded-lg text-xs font-black uppercase tracking-wider">
                Nível {activeModule.level}
              </span>
              <span className="text-xs font-bold text-slate-400">
                {activeUnits.length} {activeUnits.length === 1 ? 'Unidade' : 'Unidades'} • {totalModuleLessons} Lições
              </span>
            </div>
            <h2 className="font-fredoka text-2xl sm:text-3xl font-black text-slate-800">
              {activeModule.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-lg">
              {activeModule.subtitle}
            </p>
          </div>

          {/* Module Progress Dial */}
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 shrink-0">
            <div className="text-right">
              <span className="text-[10px] font-black uppercase text-slate-400 block">Progresso</span>
              <span className="text-sm font-black text-slate-800">
                {completedModuleLessons}/{totalModuleLessons} Feitas
              </span>
            </div>
            <div className="w-10 h-10 rounded-full border-4 border-slate-200 flex items-center justify-center font-black text-xs text-sky-600">
              {Math.round(moduleProgressPercent)}%
            </div>
          </div>
        </div>

        {/* Focused Units & Lessons of ONLY this active module */}
        <div className="space-y-10 pt-6">
          {activeUnits.map((unit, unitIdx) => (
            <div key={unit.id} className="space-y-6">
              {/* Unit Tag */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-black text-xs">
                  {unitIdx + 1}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800">
                    {unit.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {unit.subtitle}
                  </p>
                </div>
              </div>

              {/* Lesson Nodes (Compact, tactile, no endless scroll) */}
              <div className="flex flex-wrap items-center justify-center gap-6 py-4">
                {unit.lessons.map((lesson, lessonIdx) => {
                  const completed = isLessonCompleted(lesson.id);
                  const isFirstEver = unitIdx === 0 && lessonIdx === 0 && activeModuleIndex === 0;

                  // Level placement unlock check
                  const userLevel = currentUser.level || 'A1';
                  const isUnlockedByLevel =
                    userLevel === 'B1' ||
                    (userLevel === 'A2' && activeModule.level !== 'B1') ||
                    isFirstEver;

                  const prevLesson = unit.lessons[lessonIdx - 1];
                  const isLocked = !completed && !isUnlockedByLevel && (
                    lessonIdx > 0 ? !isLessonCompleted(prevLesson?.id || '') : false
                  );

                  const isActive = !isLocked && !completed;

                  return (
                    <div
                      key={lesson.id}
                      className="flex flex-col items-center gap-2 group relative text-center"
                    >
                      {/* Node Button */}
                      <button
                        type="button"
                        disabled={isLocked}
                        onClick={() => {
                          sound.playClick();
                          onStartLesson(lesson);
                        }}
                        className={`w-20 h-20 rounded-full flex flex-col items-center justify-center cursor-pointer transition-transform active:scale-95 shadow-md ${
                          completed
                            ? 'bg-amber-400 border-4 border-amber-300 border-b-6 border-b-amber-500 text-white'
                            : isLocked
                            ? 'bg-slate-200 border-4 border-slate-300 border-b-6 border-b-slate-400 text-slate-400 cursor-not-allowed'
                            : isActive
                            ? 'bg-emerald-500 border-4 border-emerald-300 border-b-6 border-b-emerald-600 text-white animate-pulse'
                            : 'bg-slate-200 text-slate-400'
                        }`}
                        title={lesson.title}
                      >
                        {completed ? (
                          <Check className="w-8 h-8 stroke-[3]" />
                        ) : isLocked ? (
                          <Lock className="w-7 h-7" />
                        ) : (
                          <Star className="w-8 h-8 fill-white text-white" />
                        )}
                      </button>

                      {/* Lesson Name & XP */}
                      <div className="max-w-[130px]">
                        <span className="text-xs font-black text-slate-700 block truncate" title={lesson.title}>
                          {lesson.title}
                        </span>
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                          +{lesson.xpReward} XP
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Module Switcher Helper */}
        <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            disabled={activeModuleIndex === 0}
            onClick={handlePrevModule}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeModuleIndex === 0
                ? 'opacity-40 cursor-not-allowed text-slate-400'
                : 'text-slate-600 hover:bg-slate-100 cursor-pointer'
            }`}
          >
            ← Módulo Anterior
          </button>

          {activeModuleIndex < COURSE_MODULES.length - 1 && (
            <button
              type="button"
              onClick={handleNextModule}
              className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-md transition-all active:scale-95"
            >
              Próximo Módulo →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
