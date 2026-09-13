import React from 'react';
import { Target, Gem, Flame, Mic, Sparkles } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { Mascot } from './Mascot';

export const Quests: React.FC = () => {
  const { currentUser } = useUser();

  if (!currentUser) return null;

  const quests = [
    {
      id: 'q1',
      title: 'Ganhe 20 XP hoje',
      desc: 'Complete lições para somar pontos.',
      current: Math.min(currentUser.xp, 20),
      total: 20,
      reward: 10,
      icon: Sparkles,
      completed: currentUser.xp >= 20,
    },
    {
      id: 'q2',
      title: 'Ofensiva do Casal',
      desc: 'Você e seu amor praticando juntos hoje!',
      current: currentUser.completedToday ? 1 : 0,
      total: 1,
      reward: 20,
      icon: Flame,
      completed: currentUser.completedToday,
    },
    {
      id: 'q3',
      title: 'Pratique 1 Lição de Voz',
      desc: 'Use o microfone para treinar sua pronúncia nativa.',
      current: currentUser.completedLessons.length > 0 ? 1 : 0,
      total: 1,
      reward: 15,
      icon: Mic,
      completed: currentUser.completedLessons.length > 0,
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24">
      {/* Quests Header */}
      <div className="bg-linear-to-r from-sky-400 to-blue-600 rounded-3xl p-6 text-white shadow-lg flex items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-sky-100 flex items-center gap-1 mb-1">
            <Target className="w-4 h-4" /> Desafios Diários
          </span>
          <h2 className="font-fredoka text-2xl sm:text-3xl font-black">
            Metas do Dia
          </h2>
          <p className="text-sky-100 text-xs sm:text-sm font-bold mt-1">
            Ganhe gemas extras todos os dias cumprindo seus objetivos com o Paçoca!
          </p>
        </div>
        <Mascot mood="surprised" size="sm" interactive={false} />
      </div>

      {/* Quest Cards */}
      <div className="space-y-3">
        {quests.map((quest) => {
          const Icon = quest.icon;
          const percent = Math.min(100, Math.round((quest.current / quest.total) * 100));

          return (
            <div
              key={quest.id}
              className={`p-5 rounded-3xl border-2 transition-all ${
                quest.completed
                  ? 'bg-emerald-50/60 border-emerald-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                      quest.completed
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-sky-100 text-sky-600'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm sm:text-base">
                      {quest.title}
                    </h4>
                    <p className="text-xs text-slate-500 font-semibold">{quest.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-sky-600 font-black text-xs sm:text-sm bg-sky-50 px-2.5 py-1 rounded-xl border border-sky-200">
                  <Gem className="w-4 h-4 fill-sky-500" />
                  +{quest.reward}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-slate-200 h-3 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      quest.completed ? 'bg-emerald-500' : 'bg-sky-500'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="text-xs font-black text-slate-500">
                  {quest.current}/{quest.total}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
