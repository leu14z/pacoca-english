import React, { useState } from 'react';
import { Mail, Heart, Check, X, Send, AlertCircle, Clock, CheckCircle2, UserPlus, Sparkles } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { Mascot } from './Mascot';
import { sound } from '../utils/audio';
import type { CoupleInvite } from '../services/auth';

interface MailboxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MailboxModal: React.FC<MailboxModalProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    incomingInvites,
    sentInvite,
    sendCoupleInvite,
    acceptCoupleInvite,
    declineCoupleInvite,
    cancelSentInvite,
    partner,
  } = useUser();

  const [inputCodeOrEmail, setInputCodeOrEmail] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !currentUser) return null;

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCodeOrEmail.trim()) return;

    setLoading(true);
    setFeedback(null);
    try {
      const res = await sendCoupleInvite(inputCodeOrEmail.trim());
      if (res.success) {
        setFeedback({ type: 'success', message: res.message });
        setInputCodeOrEmail('');
      } else {
        setFeedback({ type: 'error', message: res.message });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Erro ao enviar convite. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (invite: CoupleInvite) => {
    sound.playClick();
    setLoading(true);
    setFeedback(null);
    try {
      const res = await acceptCoupleInvite(invite);
      if (res.success) {
        setFeedback({ type: 'success', message: res.message });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Erro ao aceitar convite. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async (inviteId: string) => {
    sound.playClick();
    await declineCoupleInvite(inviteId);
    setFeedback({ type: 'success', message: 'Convite recusado.' });
  };

  const handleCancelSent = async () => {
    sound.playClick();
    await cancelSentInvite();
    setFeedback({ type: 'success', message: 'Convite cancelado com sucesso.' });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white border-2 border-slate-200 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 p-5 sm:p-6 text-white relative shrink-0">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white cursor-pointer transition-all active:scale-95"
            title="Fechar Correio"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/30 shadow-xs shrink-0">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white/20 rounded-full text-[11px] font-black uppercase tracking-wider">
                <Heart className="w-3 h-3 fill-rose-200 text-rose-200" /> Correio de Casal
              </div>
              <h2 className="font-fredoka text-2xl font-black text-white">
                Caixa de Entrada
              </h2>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* Feedback banner */}
          {feedback && (
            <div
              className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2.5 animate-in fade-in duration-150 ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Already paired notice */}
          {partner && (
            <div className="p-4 rounded-2xl bg-pink-50 border-2 border-pink-200 flex items-center gap-3.5">
              <img
                src={partner.avatar || './mascot/mascoteoficial.png'}
                alt={partner.name}
                className="w-11 h-11 rounded-2xl bg-white p-1 border border-pink-200 object-contain shadow-2xs shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-slate-800 text-sm truncate">{partner.name}</span>
                  <span className="px-2 py-0.5 bg-rose-500 text-white rounded-full text-[10px] font-black uppercase">
                    Seu Par Oficial
                  </span>
                </div>
                <p className="text-xs text-rose-700 font-bold truncate">
                  Vocês já estão conectados e com ofensiva sincronizada!
                </p>
              </div>
            </div>
          )}

          {/* Section: Incoming Invites */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-rose-500" />
                Convites Recebidos ({incomingInvites.length})
              </h3>
            </div>

            {incomingInvites.length > 0 ? (
              <div className="space-y-3">
                {incomingInvites.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-4 rounded-2xl bg-amber-50/70 border-2 border-amber-300 border-b-4 border-b-amber-400 space-y-3 shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={inv.fromAvatar || './mascot/mascoteoficial.png'}
                        alt={inv.fromName}
                        className="w-12 h-12 rounded-2xl bg-white p-1 border-2 border-amber-300 object-contain shadow-2xs shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-black text-slate-800 text-base truncate">
                          {inv.fromName}
                        </h4>
                        <p className="text-xs text-slate-500 font-bold truncate">
                          {inv.fromEmail}
                        </p>
                        <span className="inline-block mt-0.5 px-2 py-0.5 bg-amber-200 text-amber-900 rounded-md text-[10px] font-mono font-black">
                          {inv.fromCode}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 font-semibold bg-white/80 p-2.5 rounded-xl border border-amber-200">
                      Quer se conectar como seu par para vocês praticarem inglês juntos e manterem a ofensiva de casal!
                    </p>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleAccept(inv)}
                        disabled={loading}
                        className="flex-1 py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 border-b-4 border-b-emerald-700 text-white rounded-xl font-black text-xs uppercase tracking-wider cursor-pointer shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-4 h-4 stroke-[3]" /> Aceitar Convite
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDecline(inv.id)}
                        disabled={loading}
                        className="py-2.5 px-3 bg-white hover:bg-slate-100 text-slate-600 rounded-xl font-black text-xs border border-slate-300 cursor-pointer active:scale-95 transition-all"
                      >
                        Recusar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 text-center space-y-2">
                <div className="w-16 h-16 mx-auto opacity-80">
                  <Mascot mood="tip" size="sm" interactive={false} />
                </div>
                <p className="text-xs text-slate-500 font-bold">
                  Nenhum convite recebido no momento.
                </p>
                <p className="text-[11px] text-slate-400 font-medium">
                  Quando seu parceiro(a) enviar um convite com seu código ou e-mail, ele aparecerá aqui na hora!
                </p>
              </div>
            )}
          </div>

          {/* Section: Pending Sent Invite */}
          {sentInvite && (
            <div className="p-4 rounded-2xl bg-sky-50 border-2 border-sky-200 border-b-4 border-b-sky-300 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-sky-700 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Convite Enviado por Você
                </span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-[10px] font-black animate-pulse">
                  Aguardando Resposta
                </span>
              </div>
              <p className="text-xs text-slate-700 font-bold">
                Você convidou <span className="text-sky-700 font-black">{sentInvite.toEmail}</span> para ser seu par.
              </p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-400 font-medium">
                  Assim que ele(a) aceitar no Correio, vocês dois serão conectados!
                </span>
                <button
                  type="button"
                  onClick={handleCancelSent}
                  className="text-xs font-black text-rose-600 hover:text-rose-700 bg-white px-2.5 py-1 rounded-lg border border-rose-200 cursor-pointer active:scale-95"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Section: Send an Invite to Someone */}
          <div className="p-4 rounded-2xl bg-white border-2 border-slate-200 border-b-4 border-b-slate-300 space-y-3">
            <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <UserPlus className="w-4 h-4 text-rose-500" />
              Enviar Novo Convite
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Digite o código de conexão ou o e-mail do seu amor para enviar uma notificação de casal:
            </p>

            <form onSubmit={handleSendInvite} className="flex gap-2">
              <input
                type="text"
                placeholder="Código (ex: PACOCA-XXXX) ou e-mail..."
                value={inputCodeOrEmail}
                onChange={(e) => setInputCodeOrEmail(e.target.value)}
                className="flex-1 px-3.5 py-2.5 border-2 border-slate-200 rounded-xl font-bold text-xs focus:outline-none focus:border-rose-400 text-slate-800"
              />
              <button
                type="submit"
                disabled={loading || !inputCodeOrEmail.trim()}
                className="px-4 py-2.5 bg-rose-500 hover:bg-rose-600 border-b-4 border-b-rose-700 disabled:opacity-50 text-white rounded-xl font-black text-xs uppercase tracking-wider cursor-pointer shadow-md active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
              >
                <Send className="w-3.5 h-3.5" /> Enviar
              </button>
            </form>
          </div>

          {/* Quick Info Box */}
          <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 text-xs text-amber-900 font-semibold space-y-1">
            <div className="flex items-center gap-1.5 font-black">
              <Sparkles className="w-4 h-4 text-amber-600" /> Seu Código de Conexão:
            </div>
            <div className="font-mono font-black text-sm text-amber-800">
              {currentUser.coupleCode}
            </div>
            <p className="text-[11px] text-amber-700 font-medium">
              Seu parceiro pode digitar tanto esse código quanto seu e-mail ({currentUser.email}) para se conectar!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center shrink-0">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-full py-2.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-black text-slate-700 cursor-pointer transition-all"
          >
            Fechar Correio
          </button>
        </div>
      </div>
    </div>
  );
};
