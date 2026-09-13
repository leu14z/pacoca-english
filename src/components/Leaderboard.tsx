import React from 'react';
import { Trophy, Sparkles } from 'lucide-react';
import { useUser } from '../context/UserContext';

export const Leaderboard: React.FC = () => {
  const { activeUser, otherUser } = useUser();

  const mockUsers = [
    { id: 'u1', name: 'Paçoca Turbinado 🐾', xp: 210, avatar: './mascot/doido.png' },
    { id: 'u2', name: 'Gringo do Zap ☕', xp: 130, avatar: './mascot/certinho.png' },
    { id: 'u3', name: 'Teacher Coffee 📚', xp: 85, avatar: './mascot/orgulhoso.png' },
    { id: 'u4', name: 'Bilingual Doggy 🐶', xp: 60, avatar: './mascot/surpreso.png' },
  ];

  // Combine active user, other user, and community mocks
  const allUsers = [
    { id: activeUser.id, name: `${activeUser.name} (Você)`, xp: activeUser.xp, avatar: activeUser.avatar, isCurrent: true },
    { id: otherUser.id, name: otherUser.name, xp: otherUser.xp, avatar: otherUser.avatar, isPartner: true },
    ...mockUsers,
  ].sort((a, b) => b.xp - a.xp);

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-amber-400 to-amber-600 rounded-3xl p-6 text-white shadow-lg flex items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-amber-100 flex items-center gap-1 mb-1">
            <Sparkles className="w-4 h-4" /> Divisão Ouro
          </span>
          <h2 className="font-fredoka text-2xl sm:text-3xl font-black">
            Placar Semanal
          </h2>
          <p className="text-amber-100 text-xs sm:text-sm font-bold mt-1">
            Os 3 primeiros sobem para a Divisão Diamante no domingo!
          </p>
        </div>
        <Trophy className="w-16 h-16 text-amber-200 shrink-0" />
      </div>

      {/* Leaderboard List */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        {allUsers.map((user, idx) => {
          const rank = idx + 1;

          return (
            <div
              key={user.id}
              className={`flex items-center justify-between p-4 border-b border-slate-100 last:border-b-0 transition-colors ${
                (user as any).isCurrent
                  ? 'bg-sky-50 font-bold'
                  : (user as any).isPartner
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
                  src={user.avatar}
                  alt={user.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-slate-200"
                />

                {/* Name & tags */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-800 text-sm sm:text-base">
                      {user.name}
                    </span>
                    {(user as any).isPartner && (
                      <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-black">
                        Namorada ❤️
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 font-bold">
                    {rank <= 3 ? 'Zona de Promoção' : 'Permanece na Divisão'}
                  </span>
                </div>
              </div>

              {/* XP */}
              <div className="font-black text-slate-700 text-sm sm:text-base">
                {user.xp} XP
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
