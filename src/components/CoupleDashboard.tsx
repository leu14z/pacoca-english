import React, { useState } from 'react';
import { Heart, Send, CheckCircle2, MessageSquareHeart, Copy, Link2, Check, Flame, Unlink, AlertCircle } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { Mascot } from './Mascot';
import { sound } from '../utils/audio';

export const CoupleDashboard: React.FC = () => {
  const { currentUser, partner, coupleStats, sendCoupleNudge, clearNudge, linkPartnerCode, unlinkPartner } = useUser();
  const [partnerCodeInput, setPartnerCodeInput] = useState('');
  const [codeCopied, setCodeCopied] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [nudgeSent, setNudgeSent] = useState(false);

  if (!currentUser) return null;

  const presets = [
    'Amor, bora treinar hoje pro Paçoca não ficar triste!',
    'Não deixa a nossa ofensiva de casal morrer! Falta só você!',
    'Duvido você me passar no XP essa semana!',
    'Tô muito orgulhoso(a) de você estudando inglês comigo!',
  ];

  const handleSendNudge = (msg: string) => {
    sound.playSuccess();
    sendCoupleNudge(msg);
    setNudgeSent(true);
    setTimeout(() => setNudgeSent(false), 3000);
  };

  const handleCopyCode = () => {
    sound.playClick();
    navigator.clipboard.writeText(currentUser.coupleCode || '');
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2500);
  };

  const handleLinkPartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerCodeInput.trim()) return;
    const res = linkPartnerCode(partnerCodeInput);
    if (res.success) {
      sound.playSuccess();
      setFeedback({ type: 'success', message: res.message });
      setPartnerCodeInput('');
    } else {
      sound.playError();
      setFeedback({ type: 'error', message: res.message });
    }
    setTimeout(() => setFeedback(null), 5000);
  };

  const handleUnlink = () => {
    sound.playClick();
    unlinkPartner();
    setFeedback({ type: 'success', message: 'Parceiro desvinculado com sucesso.' });
    setTimeout(() => setFeedback(null), 3000);
  };

  const bothDone = currentUser.completedToday && (partner?.completedToday || false);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      {/* Active Nudge Alert Banner if present */}
      {coupleStats.lastNudge && (
        <div className="p-4 bg-rose-100 border-2 border-rose-300 rounded-3xl flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-200 flex items-center justify-center shrink-0">
              <MessageSquareHeart className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <span className="text-xs font-black text-rose-800 uppercase tracking-wider block">
                Recadinho de {coupleStats.lastNudge.from}:
              </span>
              <p className="font-extrabold text-slate-800 text-sm sm:text-base">
                "{coupleStats.lastNudge.message}"
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              clearNudge();
            }}
            className="text-xs font-black text-rose-700 bg-white px-3 py-1.5 rounded-xl border border-rose-200 cursor-pointer shadow-2xs"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Main Couple Hero Banner */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border-b-6 border-b-rose-700">
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-black uppercase tracking-wider">
              <Heart className="w-3.5 h-3.5 fill-white text-white" />
              Ofensiva do Casal Paçoca
            </div>
            <h2 className="font-fredoka text-3xl sm:text-4xl font-black flex items-center justify-center sm:justify-start gap-2">
              <span>{coupleStats.sharedStreak} Dias Juntos!</span>
              <Flame className="w-8 h-8 fill-amber-300 text-amber-300" />
            </h2>
            <p className="text-pink-100 text-sm sm:text-base font-medium max-w-md">
              {bothDone
                ? 'Os dois já treinaram hoje! A chama do casal está brilhando com força máxima!'
                : 'Para a ofensiva de hoje contar, os dois precisam praticar pelo menos 1 lição cada um no seu aparelho!'}
            </p>
          </div>

          <div className="shrink-0">
            <Mascot
              mood={bothDone ? 'proud' : 'official'}
              size="md"
              interactive={true}
            />
          </div>
        </div>
      </div>

      {/* Partner Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Your Status */}
        <div className="bg-white border-2 border-slate-200 border-b-6 border-b-slate-300 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">Você</span>
            {currentUser.completedToday ? (
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-black flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Praticou Hoje
              </span>
            ) : (
              <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-black">
                Pendente Hoje
              </span>
            )}
          </div>

          <div className="flex items-center gap-3.5">
            <img
              src={currentUser.avatar || './mascot/mascoteoficial.png'}
              alt={currentUser.name}
              className="w-14 h-14 rounded-2xl bg-amber-50 p-1 border-2 border-slate-200 object-contain shadow-2xs"
            />
            <div>
              <h3 className="font-black text-lg text-slate-800">{currentUser.name}</h3>
              <p className="text-xs text-slate-400 font-bold">
                {currentUser.xp} XP • {currentUser.streak} dias de ofensiva
              </p>
            </div>
          </div>
        </div>

        {/* Partner Status */}
        <div className="bg-white border-2 border-slate-200 border-b-6 border-b-slate-300 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">Seu Par</span>
            {partner ? (
              partner.completedToday ? (
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-black flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Praticou Hoje
                </span>
              ) : (
                <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-black">
                  Falta Treinar
                </span>
              )
            ) : (
              <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-black">
                Não Conectado
              </span>
            )}
          </div>

          {partner ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <img
                    src={partner.avatar || './mascot/certinho.png'}
                    alt={partner.name}
                    className="w-14 h-14 rounded-2xl bg-rose-50 p-1 border-2 border-slate-200 object-contain shadow-2xs"
                  />
                  <div>
                    <h3 className="font-black text-lg text-slate-800">{partner.name}</h3>
                    <p className="text-xs text-slate-400 font-bold">
                      {partner.xp} XP • {partner.streak} dias de ofensiva
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleUnlink}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-black border border-rose-200 flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                  title="Desvincular parceiro"
                >
                  <Unlink className="w-3.5 h-3.5" /> Desvincular
                </button>
              </div>

              {feedback && (
                <div
                  className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    feedback.type === 'success'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <span>{feedback.message}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 font-medium">
                Conecte o código ou e-mail do seu amor para sincronizar as ofensivas e mensagens!
              </p>
              <form onSubmit={handleLinkPartner} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Código (ex: PACOCA-XXXX) ou e-mail..."
                  value={partnerCodeInput}
                  onChange={(e) => setPartnerCodeInput(e.target.value)}
                  className="flex-1 px-3 py-2 border-2 border-slate-200 rounded-xl font-bold text-xs focus:outline-none focus:border-rose-400 text-slate-800"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-black text-xs cursor-pointer shadow-xs active:scale-95 transition-all flex items-center gap-1 shrink-0"
                >
                  <Link2 className="w-3.5 h-3.5" /> Vincular
                </button>
              </form>

              {feedback && (
                <div
                  className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    feedback.type === 'success'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <span>{feedback.message}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Share Your Couple Code */}
      <div className="bg-white border-2 border-slate-200 border-b-6 border-b-slate-300 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-black uppercase tracking-wider text-rose-600 block">
            Compartilhe com seu amor
          </span>
          <h3 className="font-black text-lg text-slate-800">
            Seu Código de Conexão: <span className="font-mono text-rose-500 font-black">{currentUser.coupleCode}</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Seu parceiro pode digitar tanto seu código <strong className="text-slate-700">{currentUser.coupleCode}</strong> quanto seu e-mail <strong className="text-slate-700">{currentUser.email}</strong> para conectar!
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopyCode}
          className="px-5 py-3 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 rounded-2xl font-black text-xs text-slate-700 flex items-center gap-2 cursor-pointer active:scale-95 transition-all shrink-0"
        >
          {codeCopied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
              <span>Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-slate-500" />
              <span>Copiar Código</span>
            </>
          )}
        </button>
      </div>

      {/* Quick Love Nudges */}
      <div className="bg-white border-2 border-slate-200 border-b-6 border-b-slate-300 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-black text-lg text-slate-800">
              Cutucada Amorosa
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Envie um lembrete fofo com 1 toque para motivar seu parceiro a treinar!
            </p>
          </div>
          {nudgeSent && (
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-black text-xs animate-bounce flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Enviado!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {presets.map((msg, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendNudge(msg)}
              className="p-3.5 bg-rose-50/60 hover:bg-rose-100 border-2 border-rose-200 rounded-2xl text-left font-bold text-xs sm:text-sm text-slate-800 cursor-pointer active:scale-98 transition-all flex items-center justify-between gap-2 shadow-2xs"
            >
              <span className="line-clamp-2">"{msg}"</span>
              <Send className="w-4 h-4 text-rose-500 shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
