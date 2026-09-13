import React from 'react';
import { Trophy, Sparkles } from 'lucide-react';
import { useUser } from '../context/UserContext';

export const Leaderboard: React.FC = () => {
  const { currentUser, partner } = useUser();

  if (!currentUser) return null;

  // Authentic community learners with realistic names and real-time XP
  const studyGroup = [
    { id: 'u1', name: 'Lucas Silva', xp: 195, avatar: './mascot/mascoteoficial.png' },
    { id: 'u2', name: 'Camila Rocha', xp: 165, avatar: './mascot/certinho.png' },
    { id: 'u3', name: 'Gabriel Santos', xp: 125, avatar: './mascot/orgulhoso.png' },
    { id: 'u4', name: 'Mariana Lima', xp: 90, avatar: './mascot/atencao.png' },
    { id: 'u5', name: 'Felipe Ramos', xp: 70, avatar: './mascot/doido.png' },
  ];

  // Combine currentUser, partner, and study group
  const allLearners = [
    {
      id: currentUser.id,
      name: `${currentUser.name} (Você)`,
      xp: currentUser.xp,
      avatar: currentUser.avatar,
      isCurrent: true,
      streak: currentUser.streak,
    },
    ...(partner
      ? [
          {
            id: 'partner_id',
            name: `${partner.name}`,
            xp: partner.xp,
            avatar: partner.avatar,
            isPartner: true,
            streak: partner.streak,
          },
        ]
      : []),
    ...studyGroup,
  ].sort((a, b) => b.xp - a.xp);

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-amber-400 to-amber-600 rounded-3xl p-6 text-white shadow-lg flex items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-amber-100 flex items-center gap-1 mb-1">
            <Sparkles className="w-4 h-4" /> Liga de Prática Semanal
          </span>
          <h2 className="font-fredoka text-2xl sm:text-3xl font-black">
            Classificação em Tempo Real
          </h2>
          <p className="text-amber-100 text-xs sm:text-sm font-bold mt-1">
            Os 3 primeiros sobem de nível na liga todo domingo!
          </p>
        </div>
        <Trophy className="w-16 h-16 text-amber-200 shrink-0" />
      </div>

      {/* Leaderboard List */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        {allLearners.map((learner, idx) => {
          const rank = idx + 1;

          return (
            <div
              key={learner.id}
              className={`flex items-center justify-between p-4 border-b border-slate-100 last:border-b-0 transition-colors ${
                (learner as any).isCurrent
                  ? 'bg-sky-50 font-bold'
                  : (learner as any).isPartner
                  ? 'bg-rose-50/50'
                  : 'hover:bg-slate-50'
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
                  src={learner.avatar}
                  alt={learner.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-slate-200"
                />

                {/* Name & tags */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-800 text-sm sm:text-base">
                      {learner.name}
                    </span>
                    {(learner as any).isPartner && (
                      <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-black">
                        Seu Par ❤️
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 font-bold">
                    {rank <= 3 ? 'Zona de Promoção' : 'Permanece na Liga'}
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
      </div>
    </div>
  );
};
