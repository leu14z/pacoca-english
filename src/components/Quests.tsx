import React, { useState, useEffect } from 'react';
import { Target, Gem, Flame, Mic, Sparkles, Check, Gift, Clock } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { Mascot } from './Mascot';
import { sound } from '../utils/audio';

const getTodayString = () => new Date().toISOString().split('T')[0];

const getTimeUntilMidnight = () => {
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const diffMs = Math.max(0, tomorrow.getTime() - now.getTime());
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
  return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
};

export const Quests: React.FC = () => {
  const { currentUser, addDiamonds } = useUser();
  const [currentDate, setCurrentDate] = useState<string>(getTodayString);
  const [timeLeft, setTimeLeft] = useState<string>(getTimeUntilMidnight);
  const [claimedQuests, setClaimedQuests] = useState<string[]>(() => {
    const today = getTodayString();
    const saved = localStorage.getItem(`pacoca_claimed_quests_${today}`);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilMidnight());
      const nowDay = getTodayString();
      if (nowDay !== currentDate) {
        setCurrentDate(nowDay);
        const saved = localStorage.getItem(`pacoca_claimed_quests_${nowDay}`);
        setClaimedQuests(saved ? JSON.parse(saved) : []);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [currentDate]);

  if (!currentUser) return null;

  const quests = [
    {
      id: 'q1',
      title: 'Ganhe 20 XP hoje',
      desc: 'Complete qualquer lição ou revisão para somar pontos.',
      current: Math.min(currentUser.xp, 20),
      total: 20,
      reward: 10,
      icon: Sparkles,
      completed: currentUser.xp >= 20,
    },
    {
      id: 'q2',
      title: 'Ofensiva Ativa de Hoje',
      desc: 'Pratique hoje para manter sua ofensiva viva!',
      current: currentUser.completedToday ? 1 : 0,
      total: 1,
      reward: 20,
      icon: Flame,
      completed: currentUser.completedToday,
    },
    {
      id: 'q3',
      title: 'Treino de Pronúncia no Microfone',
      desc: 'Complete 1 exercício de fala usando seu microfone.',
      current: currentUser.completedLessons.length > 0 ? 1 : 0,
      total: 1,
      reward: 15,
      icon: Mic,
      completed: currentUser.completedLessons.length > 0,
    },
    {
      id: 'q4',
      title: 'Mestre da Unidade',
      desc: 'Complete 3 lições da sua categoria atual.',
      current: Math.min(currentUser.completedLessons.length, 3),
      total: 3,
      reward: 30,
      icon: Target,
      completed: currentUser.completedLessons.length >= 3,
    },
  ];

  const handleClaim = (questId: string, reward: number) => {
    sound.playVictory();
    addDiamonds(reward);
    const today = getTodayString();
    const updated = [...claimedQuests, questId];
    setClaimedQuests(updated);
    localStorage.setItem(`pacoca_claimed_quests_${today}`, JSON.stringify(updated));
  };

  const totalCompleted = quests.filter((q) => q.completed).length;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24">
      {/* Quests Header with Paçoca Mascot */}
      <div className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 rounded-3xl p-6 sm:p-7 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border-b-6 border-b-blue-800">
        <div className="space-y-1.5 text-center sm:text-left">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-black uppercase tracking-wider">
            <Target className="w-3.5 h-3.5 text-amber-300" /> Desafios Diários do Paçoca
          </span>
          <h2 className="font-fredoka text-2xl sm:text-3xl font-black">
            Metas do Dia
          </h2>
          <p className="text-sky-100 text-xs sm:text-sm font-medium max-w-sm">
            Cumpra os objetivos com o Paçoca e resgate gemas extras para bater suas metas!
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-amber-400 text-slate-900 font-black text-xs rounded-xl shadow-xs">
              {totalCompleted} de {quests.length} Desafios Cumpridos
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 text-white font-black text-xs rounded-xl backdrop-blur-xs">
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              Reseta em: <span className="font-mono text-amber-300">{timeLeft}</span>
            </span>
          </div>
        </div>

        <div className="shrink-0">
          <Mascot mood="tip" size="md" interactive={true} />
        </div>
      </div>

      {/* Quest Cards List */}
      <div className="space-y-3.5">
        {quests.map((quest) => {
          const Icon = quest.icon;
          const percent = Math.min(100, Math.round((quest.current / quest.total) * 100));
          const isClaimed = claimedQuests.includes(quest.id);

          return (
            <div
              key={quest.id}
              className={`p-5 rounded-3xl border-2 transition-all shadow-xs ${
                quest.completed
                  ? 'bg-emerald-50/70 border-emerald-300 border-b-4 border-b-emerald-400'
                  : 'bg-white border-slate-200 border-b-4 border-b-slate-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border-2 shadow-2xs ${
                      quest.completed
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
                        : 'bg-sky-100 border-sky-200 text-sky-700'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-base">
                      {quest.title}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">{quest.desc}</p>
                  </div>
                </div>

                {/* Progress & Reward Claim */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <div className="flex items-center gap-1.5 bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-200 text-sky-700 font-black text-xs">
                    <Gem className="w-4 h-4 text-sky-500" />
                    +{quest.reward} Gemas
                  </div>

                  {quest.completed ? (
                    isClaimed ? (
                      <span className="px-3 py-2 bg-emerald-100 text-emerald-800 rounded-xl font-black text-xs flex items-center gap-1">
                        <Check className="w-4 h-4 stroke-[3]" /> Resgatado
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleClaim(quest.id, quest.reward)}
                        className="px-4 py-2 bg-amber-400 hover:bg-amber-300 border-b-4 border-b-amber-600 text-slate-900 rounded-xl font-black text-xs uppercase tracking-wider cursor-pointer shadow-md active:scale-95 transition-all flex items-center gap-1.5"
                      >
                        <Gift className="w-4 h-4" /> Resgatar
                      </button>
                    )
                  ) : (
                    <span className="text-xs font-black text-slate-400 px-2">
                      {quest.current}/{quest.total}
                    </span>
                  )}
                </div>
              </div>

              {/* Progress bar inside card */}
              <div className="mt-3.5 w-full bg-slate-200 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-300">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    quest.completed ? 'bg-emerald-500' : 'bg-sky-500'
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
