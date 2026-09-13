import React, { useState } from 'react';
import { Flame, Gem, Heart } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { sound } from '../utils/audio';

export const Header: React.FC = () => {
  const { currentUser, refillHearts } = useUser();
  const [showHeartModal, setShowHeartModal] = useState(false);
  const [refillError, setRefillError] = useState(false);

  if (!currentUser) return null;

  const handleRefill = () => {
    const success = refillHearts();
    if (success) {
      sound.playSuccess();
      setShowHeartModal(false);
      setRefillError(false);
    } else {
      sound.playError();
      setRefillError(true);
      setTimeout(() => setRefillError(false), 2500);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b-2 border-slate-200 px-4 py-2.5 sm:py-3 transition-all">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
          {/* Language Flag & Current User Tag */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-xl border-2 border-slate-200">
              <span className="text-xl">🇺🇸</span>
              <span className="font-extrabold text-xs uppercase tracking-wider text-slate-700 hidden sm:inline">
                Inglês
              </span>
            </div>

            {/* Current Logged In User Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border-2 border-amber-200 rounded-xl text-amber-900 shadow-2xs">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-6 h-6 rounded-full object-cover border border-amber-300"
              />
              <span className="font-black text-xs sm:text-sm max-w-[120px] truncate">
                {currentUser.name}
              </span>
            </div>
          </div>

          {/* Gamification Counters: Streak, Gems, Hearts */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Streak Flame */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl font-black text-sm transition-all ${
                currentUser.completedToday
                  ? 'text-amber-500 hover:bg-amber-50'
                  : 'text-slate-400 hover:bg-slate-100'
              }`}
              title={currentUser.completedToday ? 'Ofensiva ativa hoje!' : 'Complete uma lição hoje para manter a ofensiva!'}
            >
              <Flame
                className={`w-5 h-5 ${
                  currentUser.completedToday
                    ? 'fill-amber-500 text-amber-500 animate-bounce'
                    : 'text-slate-400'
                }`}
              />
              <span>{currentUser.streak}</span>
            </div>

            {/* Gems / Diamonds */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl font-black text-sm text-sky-500 hover:bg-sky-50 transition-colors"
              title="Gemas do Paçoca"
            >
              <Gem className="w-5 h-5 fill-sky-500 text-sky-500" />
              <span>{currentUser.diamonds}</span>
            </div>

            {/* Hearts */}
            <button
              onClick={() => setShowHeartModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl font-black text-sm text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Vidas restantes. Clique para recarregar!"
            >
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
              <span>{currentUser.hearts}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Heart Refill Modal */}
      {showHeartModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center relative">
            <div className="w-20 h-20 mx-auto mb-3">
              <img
                src={currentUser.hearts <= 1 ? './mascot/assustado.png' : './mascot/certinho.png'}
                alt="Paçoca"
                className="w-full h-full object-contain"
              />
            </div>

            <h3 className="font-fredoka text-2xl text-slate-800 mb-1">
              {currentUser.hearts === 5 ? 'Vidas Cheias!' : 'Recarregar Vidas'}
            </h3>
            <p className="text-slate-600 text-sm font-semibold mb-6">
              {currentUser.hearts === 5
                ? 'Você já está com as 5 vidas completas! Continue praticando para acumular XP.'
                : 'Você precisa de vidas para praticar lições. Recarregue agora com suas gemas!'}
            </p>

            {refillError && (
              <p className="text-rose-500 font-bold text-xs mb-4 bg-rose-50 p-2 rounded-xl border border-rose-200">
                Gemas insuficientes! Você precisa de 100 gemas para recarregar.
              </p>
            )}

            <div className="space-y-3">
              {currentUser.hearts < 5 && (
                <button
                  onClick={handleRefill}
                  className="w-full py-3.5 px-4 btn-3d-blue rounded-2xl font-black text-base flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Gem className="w-5 h-5 fill-white" />
                  Recarregar 5 Vidas (100 Gemas)
                </button>
              )}

              <button
                onClick={() => setShowHeartModal(false)}
                className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 rounded-2xl font-extrabold text-slate-700 text-sm cursor-pointer"
              >
                Voltar aos Estudos
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
