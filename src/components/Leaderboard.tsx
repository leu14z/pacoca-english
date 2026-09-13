import React from 'react';
import { Trophy, Sparkles, UserPlus } from 'lucide-react';
import { useUser } from '../context/UserContext';

export const Leaderboard: React.FC = () => {
  const { currentUser, allLearners } = useUser();

  if (!currentUser) return null;

  // STRICTLY REAL REGISTERED USERS ONLY - NO FAKE / MOCK PEOPLE
  const sortedLearners = [...allLearners].sort((a, b) => b.xp - a.xp);

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-amber-400 to-amber-600 rounded-3xl p-6 text-white shadow-lg flex items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-amber-100 flex items-center gap-1 mb-1">
            <Sparkles className="w-4 h-4" /> Placar em Tempo Real
          </span>
          <h2 className="font-fredoka text-2xl sm:text-3xl font-black">
            Ranking da Plataforma
          </h2>
          <p className="text-amber-100 text-xs sm:text-sm font-bold mt-1">
            Exibindo apenas os estudantes reais cadastrados.
          </p>
        </div>
        <Trophy className="w-16 h-16 text-amber-200 shrink-0" />
      </div>

      {/* Leaderboard List */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        {sortedLearners.map((learner, idx) => {
          const rank = idx + 1;
          const isCurrent = learner.id === currentUser.id;

          return (
            <div
              key={learner.id}
              className={`flex items-center justify-between p-4 border-b border-slate-100 last:border-b-0 transition-colors ${
                isCurrent ? 'bg-sky-50 font-bold' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Rank number or medal */}
                <div className="w-8 text-center font-black text-base">
                  {rank === 1 ? (
                    <span className="text-2xl">🥇</span>
                  ) : rank === 2 ? (
                    <span className="text-2xl">🥈</span>
                  ) : rank === 3 ? (
                    <span className="text-2xl">🥉</span>
                  ) : (
                    <span className="text-slate-400 font-bold">{rank}</span>
                  )}
                </div>

                {/* Avatar */}
                <img
                  src={learner.avatar || './mascot/mascoteoficial.png'}
                  alt={learner.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-slate-200"
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
                  <span className="text-xs text-slate-400 font-bold">
                    {learner.streak} {learner.streak === 1 ? 'dia' : 'dias'} de ofensiva
                  </span>
                </div>
              </div>

              {/* XP */}
              <div className="font-black text-slate-700 text-sm sm:text-base">
                {learner.xp} XP
              </div>
            </div>
          );
        })}

        {/* If only 1 user registered */}
        {sortedLearners.length <= 1 && (
          <div className="p-6 text-center text-slate-500 font-bold text-sm bg-slate-50">
            <UserPlus className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p>Apenas você está cadastrado neste momento.</p>
            <p className="text-xs text-slate-400 mt-1">
              Conforme sua namorada ou seus pais criarem a conta deles, eles aparecerão aqui no ranking em tempo real!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
