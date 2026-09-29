import React, { useState } from 'react';
import { Flame, Gem, Heart, Mail } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { sound } from '../utils/audio';
import { MailboxModal } from './MailboxModal';

export const Header: React.FC = () => {
  const { currentUser, refillHearts, incomingInvites } = useUser();
  const [showHeartModal, setShowHeartModal] = useState(false);
  const [showMailboxModal, setShowMailboxModal] = useState(false);
  const [refillError, setRefillError] = useState(false);

  if (!currentUser) return null;

  const pendingInvitesCount = (incomingInvites || []).length;

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
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b-2 border-slate-200 px-3 sm:px-4 py-2 sm:py-2.5 transition-all">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-1.5 sm:gap-3">
          {/* Course Badge with Crisp SVG Flag (Duolingo Style - No broken Windows emoji) */}
          <div
            className="flex items-center gap-1.5 sm:gap-2.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-slate-100 hover:bg-slate-200/80 rounded-2xl border-2 border-slate-200/90 transition-colors cursor-pointer select-none shrink-0"
            title="Curso de Inglês"
          >
            {/* High-res SVG American Flag */}
            <div className="w-6 h-4 rounded-xs overflow-hidden shadow-2xs flex-shrink-0 border border-slate-300">
              <svg viewBox="0 0 60 40" className="w-full h-full object-cover">
                <rect width="60" height="40" fill="#b22234" />
                <path d="M0,6.15h60 M0,12.3h60 M0,18.45h60 M0,24.6h60 M0,30.75h60 M0,36.9h60" stroke="#fff" strokeWidth="3.08" />
                <rect width="25" height="21.5" fill="#3c3b6e" />
                {/* 5 clean stars */}
                <g fill="#fff">
                  <circle cx="5" cy="4" r="1.3" />
                  <circle cx="12" cy="4" r="1.3" />
                  <circle cx="19" cy="4" r="1.3" />
                  <circle cx="8.5" cy="10" r="1.3" />
                  <circle cx="15.5" cy="10" r="1.3" />
                  <circle cx="5" cy="16" r="1.3" />
                  <circle cx="12" cy="16" r="1.3" />
                  <circle cx="19" cy="16" r="1.3" />
                </g>
              </svg>
            </div>
            <span className="font-fredoka text-xs font-bold uppercase tracking-wider text-slate-700">
              Inglês
            </span>
          </div>

          {/* Right Gamification Stats: Streak, Gems, Hearts, Mailbox & Profile Avatar */}
          <div className="flex items-center gap-2 sm:gap-3.5">
            {/* Streak Flame */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl font-black text-sm transition-all select-none ${
                currentUser.completedToday
                  ? 'text-amber-500 hover:bg-amber-50'
                  : 'text-slate-400 hover:bg-slate-100'
              }`}
              title={
                currentUser.completedToday
                  ? 'Ofensiva ativa hoje! Parabéns!'
                  : 'Complete uma lição hoje para acender a chama da ofensiva!'
              }
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
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl font-black text-sm text-sky-500 hover:bg-sky-50 transition-colors select-none"
              title="Gemas do Paçoca"
            >
              <Gem className="w-5 h-5 fill-sky-500 text-sky-500" />
              <span>{currentUser.diamonds}</span>
            </div>

            {/* Hearts (10 Vidas) */}
            <button
              onClick={() => setShowHeartModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl font-black text-sm text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer select-none"
              title="Vidas restantes (até 10). Clique para recarregar!"
            >
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
              <span>{currentUser.hearts}</span>
            </button>

            {/* Mailbox / Correio Button */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setShowMailboxModal(true);
              }}
              className="relative p-2 rounded-2xl bg-slate-100 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-slate-600 hover:text-rose-500 cursor-pointer transition-all active:scale-95 shrink-0"
              title="Correio: Convites de Casal"
            >
              <Mail className="w-5 h-5" />
              {pendingInvitesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] font-black flex items-center justify-center animate-bounce shadow-xs">
                  {pendingInvitesCount}
                </span>
              )}
            </button>

            {/* User Profile Avatar (Sleek circular badge on far right) */}
            <div
              className="w-9 h-9 rounded-full border-2 border-slate-300 hover:border-amber-400 overflow-hidden shadow-2xs transition-all cursor-pointer select-none flex-shrink-0"
              title={`Conectado como ${currentUser.name}`}
            >
              <img
                src={currentUser.avatar || './mascot/mascoteoficial.png'}
                alt={currentUser.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Heart Refill Modal */}
      {showHeartModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center relative">
            <div className="w-20 h-20 mx-auto mb-3">
              <img
                src={currentUser.hearts <= 2 ? './mascot/assustado.png' : './mascot/certinho.png'}
                alt="Paçoca"
                className="w-full h-full object-contain"
              />
            </div>

            <h3 className="font-fredoka text-2xl text-slate-800 mb-1">
              {currentUser.hearts >= 10 ? 'Vidas Cheias!' : 'Recarregar Vidas'}
            </h3>
            <p className="text-slate-600 text-sm font-semibold mb-6">
              {currentUser.hearts >= 10
                ? 'Você já está com as 10 vidas completas! Continue praticando para acumular XP.'
                : `Você tem ${currentUser.hearts} de 10 vidas. Recarregue agora com suas gemas para continuar praticando!`}
            </p>

            {refillError && (
              <p className="text-rose-500 font-bold text-xs mb-4 bg-rose-50 p-2 rounded-xl border border-rose-200">
                Gemas insuficientes! Você precisa de 100 gemas para recarregar.
              </p>
            )}

            <div className="space-y-3">
              {currentUser.hearts < 10 && (
                <button
                  onClick={handleRefill}
                  className="w-full py-3.5 px-4 btn-3d-blue rounded-2xl font-black text-base flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Gem className="w-5 h-5 fill-white" />
                  Recarregar 10 Vidas (100 Gemas)
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

      {/* Mailbox Modal */}
      <MailboxModal
        isOpen={showMailboxModal}
        onClose={() => setShowMailboxModal(false)}
      />
    </>
  );
};
