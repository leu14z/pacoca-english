import React from 'react';
import { Trophy, Sparkles, UserPlus, Flame } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { Mascot } from './Mascot';

export const Leaderboard: React.FC = () => {
  const { currentUser, allLearners } = useUser();

  if (!currentUser) return null;

  // STRICTLY REAL REGISTERED USERS ONLY - NO FAKE / MOCK PEOPLE
  const sortedLearners = [...allLearners].sort((a, b) => b.xp - a.xp);

  const top1 = sortedLearners[0];
  const top2 = sortedLearners[1];
  const top3 = sortedLearners[2];

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24">
      {/* Header Banner with Mascot */}
      <div className="bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 rounded-3xl p-6 sm:p-7 text-white shadow-xl flex items-center justify-between gap-4 border-b-6 border-b-amber-700">
        <div className="space-y-1">
          <span className="text-xs font-black uppercase tracking-wider text-amber-100 flex items-center gap-1">
            <Sparkles className="w-4 h-4 fill-amber-300 text-amber-300" /> Placar da Liga Paçoca
          </span>
          <h2 className="font-fredoka text-2xl sm:text-3xl font-black">
            Ranking em Tempo Real
          </h2>
          <p className="text-amber-100 text-xs sm:text-sm font-medium">
            Pontuação real de quem está aprendendo inglês de verdade no app!
          </p>
        </div>
        <div className="shrink-0">
          <Mascot mood="proud" size="sm" interactive={true} />
        </div>
      </div>

      {/* TOP 3 PODIUM (If at least 1 user exists) */}
      {sortedLearners.length > 0 && (
        <div className="grid grid-cols-3 gap-2.5 items-end pt-4 pb-2 px-2">
          {/* 2nd Place */}
          <div className="flex flex-col items-center">
            {top2 ? (
              <div className="flex flex-col items-center gap-1.5 w-full">
                <div className="w-12 h-12 rounded-2xl p-0.5 bg-gradient-to-b from-slate-200 to-slate-400 border-2 border-slate-300 shadow-md">
                  <img
                    src={top2.avatar || './mascot/mascoteoficial.png'}
                    alt={top2.name}
                    className="w-full h-full object-contain rounded-xl bg-white"
                  />
                </div>
                <span className="text-xs font-black text-slate-700 truncate max-w-[80px]">
                  {top2.name}
                </span>
                <span className="text-[11px] font-bold text-slate-500">{top2.xp} XP</span>
              </div>
            ) : null}
            <div className="w-full h-16 bg-gradient-to-t from-slate-300 to-slate-200 border-2 border-slate-400 border-b-0 rounded-t-2xl flex flex-col items-center justify-center mt-2 shadow-xs">
              <span className="text-sm font-black text-slate-700">2º</span>
              <span className="text-[10px] font-bold uppercase text-slate-500">Prata</span>
            </div>
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center">
            {top1 ? (
              <div className="flex flex-col items-center gap-1.5 w-full">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl p-1 bg-gradient-to-b from-amber-300 to-amber-500 border-2 border-amber-400 shadow-lg animate-pulse">
                    <img
                      src={top1.avatar || './mascot/orgulhoso.png'}
                      alt={top1.name}
                      className="w-full h-full object-contain rounded-xl bg-white"
                    />
                  </div>
                  <div className="absolute -top-3 -right-2 p-1 bg-amber-400 rounded-full border-2 border-white shadow-xs">
                    <Trophy className="w-3.5 h-3.5 text-slate-900" />
                  </div>
                </div>
                <span className="text-xs font-black text-slate-800 truncate max-w-[90px]">
                  {top1.name}
                </span>
                <span className="text-[11px] font-black text-amber-600">{top1.xp} XP</span>
              </div>
            ) : null}
            <div className="w-full h-24 bg-gradient-to-t from-amber-400 to-amber-300 border-2 border-amber-500 border-b-0 rounded-t-2xl flex flex-col items-center justify-center mt-2 shadow-sm">
              <span className="text-lg font-black text-slate-900">1º</span>
              <span className="text-[10px] font-black uppercase text-amber-900">Ouro</span>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center">
            {top3 ? (
              <div className="flex flex-col items-center gap-1.5 w-full">
                <div className="w-12 h-12 rounded-2xl p-0.5 bg-gradient-to-b from-amber-600 to-amber-800 border-2 border-amber-700 shadow-md">
                  <img
                    src={top3.avatar || './mascot/mascoteoficial.png'}
                    alt={top3.name}
                    className="w-full h-full object-contain rounded-xl bg-white"
                  />
                </div>
                <span className="text-xs font-black text-slate-700 truncate max-w-[80px]">
                  {top3.name}
                </span>
                <span className="text-[11px] font-bold text-slate-500">{top3.xp} XP</span>
              </div>
            ) : null}
            <div className="w-full h-12 bg-gradient-to-t from-amber-700 to-amber-600 border-2 border-amber-800 border-b-0 rounded-t-2xl flex flex-col items-center justify-center mt-2 shadow-xs">
              <span className="text-sm font-black text-white">3º</span>
              <span className="text-[10px] font-bold uppercase text-amber-200">Bronze</span>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard List */}
      <div className="bg-white border-2 border-slate-200 border-b-6 border-b-slate-300 rounded-3xl overflow-hidden shadow-xs">
        {sortedLearners.map((learner, idx) => {
          const rank = idx + 1;
          const isCurrent = learner.id === currentUser.id;

          return (
            <div
              key={learner.id}
              className={`flex items-center justify-between p-4 border-b border-slate-100 last:border-b-0 transition-colors ${
                isCurrent ? 'bg-sky-50/80 font-bold' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Rank Badge */}
                <div className="w-8 text-center font-black text-sm">
                  {rank === 1 ? (
                    <span className="w-7 h-7 rounded-xl bg-amber-400 text-slate-900 border border-amber-500 inline-flex items-center justify-center shadow-2xs font-black">
                      1
                    </span>
                  ) : rank === 2 ? (
                    <span className="w-7 h-7 rounded-xl bg-slate-300 text-slate-800 border border-slate-400 inline-flex items-center justify-center shadow-2xs font-black">
                      2
                    </span>
                  ) : rank === 3 ? (
                    <span className="w-7 h-7 rounded-xl bg-amber-700 text-amber-100 border border-amber-800 inline-flex items-center justify-center shadow-2xs font-black">
                      3
                    </span>
                  ) : (
                    <span className="text-slate-400 font-bold">{rank}</span>
                  )}
                </div>

                {/* Avatar */}
                <img
                  src={learner.avatar || './mascot/mascoteoficial.png'}
                  alt={learner.name}
                  className="w-11 h-11 rounded-2xl object-contain bg-amber-50 p-1 border-2 border-slate-200 shadow-2xs"
                />

                {/* Name & tags */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-800 text-sm sm:text-base">
                      {learner.name}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full font-black">
                        Você
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    {learner.streak} {learner.streak === 1 ? 'dia' : 'dias'} de ofensiva
                  </span>
                </div>
              </div>

              {/* XP */}
              <div className="font-black text-slate-800 text-sm sm:text-base">
                {learner.xp} XP
              </div>
            </div>
          );
        })}

        {/* If only 1 user registered */}
        {sortedLearners.length <= 1 && (
          <div className="p-6 text-center text-slate-500 font-bold text-sm bg-slate-50">
            <UserPlus className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-700 font-black">Você é o pioneiro da plataforma!</p>
            <p className="text-xs text-slate-400 mt-1">
              Conforme sua namorada ou seus pais criarem a conta deles no celular, eles aparecerão aqui disputando o topo com você!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
