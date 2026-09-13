import React from 'react';
import { Star, Check, Lock, Sparkles } from 'lucide-react';
import { COURSE_UNITS } from '../data/courses';
import type { Lesson } from '../data/courses';
import { useUser } from '../context/UserContext';
import { Mascot } from './Mascot';
import { sound } from '../utils/audio';

interface LearnPathProps {
  onStartLesson: (lesson: Lesson) => void;
}

export const LearnPath: React.FC<LearnPathProps> = ({ onStartLesson }) => {
  const { activeUser } = useUser();

  const isLessonCompleted = (id: string) => activeUser.completedLessons.includes(id);

  // An offset pattern for the Duolingo winding path
  const getOffsetClass = (index: number) => {
    const offsets = ['translate-x-0', '-translate-x-12', 'translate-x-12', '-translate-x-6', 'translate-x-8'];
    return offsets[index % offsets.length];
  };

  return (
    <div className="max-w-2xl mx-auto space-y-12 pb-24">
      {COURSE_UNITS.map((unit) => (
        <div key={unit.id} className="relative">
          {/* Unit Header Banner */}
          <div
            className={`p-6 rounded-3xl text-white shadow-lg mb-8 relative overflow-hidden ${
              unit.color === 'emerald'
                ? 'bg-emerald-500 border-b-6 border-emerald-600'
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
              const isLocked = !completed && lessonIdx > 0 && !isLessonCompleted(unit.lessons[lessonIdx - 1]?.id);
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

                    {/* Mini crown for completed lessons */}
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
      ))}
    </div>
  );
};
