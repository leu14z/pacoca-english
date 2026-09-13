import React, { useState } from 'react';
import { Heart, Send, Award, CheckCircle2, Clock, MessageSquareHeart } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { Mascot } from './Mascot';
import { sound } from '../utils/audio';

export const CoupleDashboard: React.FC = () => {
  const { activeUser, otherUser, coupleStats, sendCoupleNudge, clearNudge } = useUser();
  const [nudgeSent, setNudgeSent] = useState(false);

  const presets = [
    'Amor, bora treinar hoje pro Paçoca não ficar triste! 🐾❤️',
    'Não deixa a nossa ofensiva de casal morrer! Falta só você! 🔥',
    'Duvido você me passar no XP essa semana! 😜',
    'Tô muito orgulhoso(a) de você estudando inglês comigo! ✨',
  ];

  const handleSendNudge = (msg: string) => {
    sound.playSuccess();
    sendCoupleNudge(msg);
    setNudgeSent(true);
    setTimeout(() => setNudgeSent(false), 3000);
  };

  const bryanUser = activeUser.id === 'bryan' ? activeUser : otherUser;
  const partnerUser = activeUser.id === 'partner' ? activeUser : otherUser;
  const bothDone = bryanUser.completedToday && partnerUser.completedToday;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      {/* Active Nudge Alert Banner if present */}
      {coupleStats.lastNudge && (
        <div className="p-4 bg-rose-100 border-2 border-rose-300 rounded-3xl flex items-center justify-between gap-3 shadow-md animate-bounce">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-200 flex items-center justify-center shrink-0">
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
            onClick={() => {
              sound.playClick();
              clearNudge();
            }}
            className="text-xs font-black text-rose-700 bg-white px-3 py-1.5 rounded-xl border border-rose-200 cursor-pointer"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Main Couple Hero Banner */}
      <div className="bg-linear-to-r from-rose-500 via-pink-500 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider mb-3">
              <Heart className="w-3.5 h-3.5 fill-white" />
              Ofensiva do Casal
            </div>
            <h2 className="font-fredoka text-3xl sm:text-4xl font-black mb-2">
              {coupleStats.sharedStreak} Dias Juntos! 🔥
            </h2>
            <p className="text-pink-100 text-sm sm:text-base font-bold max-w-md">
              {bothDone
                ? 'Os dois já treinaram hoje! A chama do casal está brilhando forte!'
                : 'Para a ofensiva de hoje contar, os dois precisam praticar pelo menos 1 lição!'}
            </p>
          </div>

          <div className="shrink-0">
            <Mascot
              mood={bothDone ? 'proud' : 'rest'}
              size="lg"
              interactive={false}
              animate={true}
            />
          </div>
        </div>
      </div>

      {/* Couple Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Bryan Card */}
        <div
          className={`p-5 rounded-3xl border-2 transition-all ${
            bryanUser.completedToday
              ? 'bg-emerald-50 border-emerald-300'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img
                src={bryanUser.avatar}
                alt={bryanUser.name}
                className="w-12 h-12 rounded-full border-2 border-slate-300 object-cover"
              />
              <div>
                <h4 className="font-black text-slate-800 text-lg">{bryanUser.name}</h4>
                <span className="text-xs font-bold text-slate-500">
                  {bryanUser.xp} XP • {bryanUser.streak} dias de ofensiva
                </span>
              </div>
            </div>
            {bryanUser.completedToday ? (
              <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-black text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Feito!
              </span>
            ) : (
              <span className="flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full font-black text-xs">
                <Clock className="w-3.5 h-3.5 text-amber-600" /> Pendente
              </span>
            )}
          </div>

          <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all"
              style={{ width: bryanUser.completedToday ? '100%' : '35%' }}
            />
          </div>
        </div>

        {/* Partner Card */}
        <div
          className={`p-5 rounded-3xl border-2 transition-all ${
            partnerUser.completedToday
              ? 'bg-emerald-50 border-emerald-300'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img
                src={partnerUser.avatar}
                alt={partnerUser.name}
                className="w-12 h-12 rounded-full border-2 border-slate-300 object-cover"
              />
              <div>
                <h4 className="font-black text-slate-800 text-lg">{partnerUser.name}</h4>
                <span className="text-xs font-bold text-slate-500">
                  {partnerUser.xp} XP • {partnerUser.streak} dias de ofensiva
                </span>
              </div>
            </div>
            {partnerUser.completedToday ? (
              <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-black text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Feito!
              </span>
            ) : (
              <span className="flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full font-black text-xs">
                <Clock className="w-3.5 h-3.5 text-amber-600" /> Pendente
              </span>
            )}
          </div>

          <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all"
              style={{ width: partnerUser.completedToday ? '100%' : '30%' }}
            />
          </div>
        </div>
      </div>

      {/* Send Nudge / "Cutucada do Paçoca" */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-fredoka text-xl text-slate-800 font-bold">
              Cutucada do Paçoca ❤️
            </h3>
            <p className="text-slate-500 font-semibold text-xs">
              Mande uma mensagem fofa para incentivar sua namorada ou tirar uma onda!
            </p>
          </div>
        </div>

        {nudgeSent && (
          <div className="mb-4 p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-2xl font-bold text-sm text-center">
            Recado enviado com sucesso! O Paçoca entregou a mensagem! ✨
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          {presets.map((msg, idx) => (
            <button
              key={idx}
              onClick={() => handleSendNudge(msg)}
              className="p-3 text-left bg-slate-50 hover:bg-amber-50 border-2 border-slate-200 hover:border-amber-300 rounded-2xl text-xs sm:text-sm font-bold text-slate-700 transition-all cursor-pointer active:scale-98"
            >
              {msg}
            </button>
          ))}
        </div>
      </div>

      {/* Couple Milestones */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-6 h-6 text-amber-500" />
          <h3 className="font-fredoka text-xl text-slate-800 font-bold">
            Metas & Conquistas a Dois
          </h3>
        </div>

        <div className="space-y-3">
          {[
            { title: 'Primeira Viagem Gringa', desc: 'Completar a lição de Aeroporto e Hotel', done: true, xp: 50 },
            { title: 'Ofensiva de 7 Dias', desc: 'Estudar juntos todos os dias por 1 semana', done: false, xp: 100 },
            { title: 'Casal Fluente', desc: 'Completar 10 lições com 100% de acertos', done: false, xp: 200 },
          ].map((milestone, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border-2 flex items-center justify-between gap-3 ${
                milestone.done
                  ? 'bg-amber-50/50 border-amber-200'
                  : 'bg-slate-50 border-slate-200 opacity-70'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{milestone.done ? '🏆' : '🔒'}</span>
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm">{milestone.title}</h4>
                  <p className="text-slate-500 text-xs font-semibold">{milestone.desc}</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-xl font-black text-xs shrink-0">
                +{milestone.xp} XP
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
