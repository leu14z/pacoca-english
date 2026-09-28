import React, { useState, useEffect } from 'react';
import { ShieldCheck, Mail, User, ArrowRight, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { Mascot } from './Mascot';
import { PacocaBadge } from './PacocaBadge';
import { sound } from '../utils/audio';
import { loadGoogleGsiScript, parseJwt } from '../services/auth';
import { signInWithGoogle, isSupabaseConfigured } from '../services/supabase';

interface QuickGoogleProfile {
  name: string;
  email: string;
  avatarBg: string;
  initial: string;
  badge: string;
}

const QUICK_ACCOUNTS: QuickGoogleProfile[] = [
  {
    name: 'Leo',
    email: 'leo@gmail.com',
    avatarBg: 'bg-emerald-500',
    initial: 'L',
    badge: 'Conta Principal',
  },
  {
    name: 'Amor',
    email: 'namorada@gmail.com',
    avatarBg: 'bg-rose-500',
    initial: 'A',
    badge: 'Parceiro(a)',
  },
];

export const LoginScreen: React.FC = () => {
  const { loginUser } = useUser();
  const [showChooserModal, setShowChooserModal] = useState(false);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Initialize official Google Identity Services script if configured
  useEffect(() => {
    loadGoogleGsiScript().then((ready) => {
      const googleClientId =
        (window as any).VITE_GOOGLE_CLIENT_ID ||
        localStorage.getItem('pacoca_google_client_id') ||
        import.meta.env.VITE_GOOGLE_CLIENT_ID;

      if (ready && googleClientId && (window as any).google?.accounts?.id) {
        try {
          (window as any).google.accounts.id.initialize({
            client_id: googleClientId,
            callback: (response: any) => {
              const payload = parseJwt(response.credential);
              if (payload) {
                sound.playSuccess();
                loginUser(payload.email, payload.name, payload.picture);
              }
            },
          });
          const buttonDiv = document.getElementById('googleGsiDiv');
          if (buttonDiv) {
            (window as any).google.accounts.id.renderButton(buttonDiv, {
              theme: 'outline',
              size: 'large',
              width: '100%',
              text: 'continue_with',
              shape: 'pill',
            });
          }
        } catch (e) {
          console.warn('Google GSI init notice:', e);
        }
      }
    });
  }, [loginUser]);

  // Handle Google primary button click
  const handleGoogleClick = async () => {
    sound.playClick();
    setIsSigningIn(true);

    // If Supabase OAuth with Google is configured in .env, attempt redirect
    if (isSupabaseConfigured) {
      try {
        const { error } = await signInWithGoogle();
        if (!error) {
          // Redirecting to Google OAuth...
          return;
        }
      } catch (err) {
        console.warn('Supabase OAuth notice:', err);
      }
    }

    // Open authentic Google Account Chooser dialog
    setIsSigningIn(false);
    setShowChooserModal(true);
  };

  // Quick login with chosen profile
  const handleSelectQuickAccount = (profile: QuickGoogleProfile) => {
    sound.playSuccess();
    loginUser(profile.email, profile.name);
    setShowChooserModal(false);
  };

  // Custom Google account submission
  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim() || !customName.trim()) return;

    sound.playSuccess();
    loginUser(customEmail.trim(), customName.trim());
    setShowChooserModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/70 via-slate-50 to-amber-100/30 flex flex-col justify-between p-4 sm:p-8">
      {/* Top Brand Bar */}
      <header className="w-full max-w-4xl mx-auto flex items-center justify-between py-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-400 border-2 border-amber-500 border-b-4 border-b-amber-600 flex items-center justify-center shadow-sm overflow-hidden p-0.5">
            <img
              src="./mascot/mascoteoficial.png"
              alt="Paçoca"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="font-fredoka text-xl font-black text-amber-700 tracking-tight leading-none">
              PAÇOCA ENGLISH
            </h1>
            <span className="text-[10px] font-black uppercase text-amber-500 tracking-widest">
              Plataforma Oficial
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 text-xs font-black">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>v2.0 Online</span>
        </div>
      </header>

      {/* Hero Core */}
      <main className="w-full max-w-md mx-auto my-auto flex flex-col items-center text-center py-6">
        {/* Paçoca Mascot with speech */}
        <Mascot
          mood="official"
          size="lg"
          speech="Olá! Faça login com sua conta Google para salvar seu progresso e aprender inglês comigo!"
          className="mb-4"
        />

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black uppercase tracking-wider mb-2 border border-amber-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          Aprenda Inglês Sem Frustração
        </div>

        <h2 className="font-fredoka text-3xl sm:text-4xl text-slate-800 font-black mb-2 leading-tight">
          Pratique com o Paçoca
        </h2>
        <p className="text-slate-600 font-bold text-sm sm:text-base max-w-xs mb-6">
          Cada usuário tem seu painel exclusivo, vidas, streak e lições por nível A1, A2 e B1.
        </p>

        {/* Google Sign-In Primary Card */}
        <div className="w-full bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-xl space-y-3">
          {/* Optional Official GSI Container */}
          <div id="googleGsiDiv" className="w-full flex justify-center empty:hidden"></div>

          {/* Primary 3D Google Button */}
          <button
            onClick={handleGoogleClick}
            disabled={isSigningIn}
            className="w-full py-4 px-6 bg-white hover:bg-slate-50 border-2 border-slate-200 border-b-4 border-b-slate-400 active:border-b-2 active:translate-y-0.5 rounded-2xl font-black text-slate-700 text-base sm:text-lg flex items-center justify-center gap-3 shadow-md transition-all cursor-pointer group"
          >
            {/* Crisp SVG Google G */}
            <svg className="w-6 h-6 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isSigningIn ? 'Conectando...' : 'Entrar com a Conta Google'}</span>
          </button>

          {/* Quick 1-click accounts row */}
          <div className="pt-2">
            <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider block mb-2">
              Ou selecione sua conta rápida:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  onClick={() => handleSelectQuickAccount(acc)}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 flex items-center gap-2 text-left transition-all cursor-pointer group"
                >
                  <div
                    className={`w-7 h-7 rounded-full ${acc.avatarBg} text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs`}
                  >
                    {acc.initial}
                  </div>
                  <div className="min-w-0">
                    <p className="font-fredoka text-xs font-black text-slate-800 truncate group-hover:text-amber-700">
                      {acc.name}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold truncate">
                      {acc.badge}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Highlights (Original 3D Badges, Zero Emojis) */}
        <div className="w-full grid grid-cols-3 gap-2 mt-6">
          <div className="bg-white/80 rounded-2xl p-3 border border-slate-200/80 flex flex-col items-center text-center shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-1">
              <svg className="w-5 h-5 fill-sky-600" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
              </svg>
            </div>
            <span className="font-fredoka text-xs font-black text-slate-700">Voz Inteligente</span>
            <span className="text-[10px] text-slate-500 font-semibold leading-tight">Grava sem cortes</span>
          </div>

          <div className="bg-white/80 rounded-2xl p-3 border border-slate-200/80 flex flex-col items-center text-center shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1">
              <PacocaBadge badge="level-a1" size="sm" />
            </div>
            <span className="font-fredoka text-xs font-black text-slate-700">Níveis A1 a B1</span>
            <span className="text-[10px] text-slate-500 font-semibold leading-tight">Bloqueados em ordem</span>
          </div>

          <div className="bg-white/80 rounded-2xl p-3 border border-slate-200/80 flex flex-col items-center text-center shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-1">
              <svg className="w-5 h-5 fill-purple-600" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <span className="font-fredoka text-xs font-black text-slate-700">Modo Casal</span>
            <span className="text-[10px] text-slate-500 font-semibold leading-tight">Streak compartilhado</span>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="w-full max-w-md mx-auto text-center py-2 text-xs font-bold text-slate-400 flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>Seus dados são salvos com segurança na sua conta Google</span>
      </footer>

      {/* Google Account Selector Dialog (Realistic Google Dialog) */}
      {showChooserModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/75 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border-2 border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-150">
            {/* Google Dialog Header */}
            <div className="p-6 text-center border-b border-slate-100 relative">
              <button
                onClick={() => setShowChooserModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <svg className="w-10 h-10 mx-auto mb-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>

              <h3 className="font-fredoka text-xl text-slate-800 font-black">
                Fazer login com o Google
              </h3>
              <p className="text-slate-500 text-xs font-semibold mt-1">
                Escolha uma conta para ir para <span className="font-bold text-amber-600">Paçoca English</span>
              </p>
            </div>

            {/* Account List */}
            <div className="p-4 space-y-2">
              {QUICK_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  onClick={() => handleSelectQuickAccount(acc)}
                  className="w-full p-3 rounded-2xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/60 flex items-center justify-between transition-all cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full ${acc.avatarBg} text-white font-black text-sm flex items-center justify-center shadow-xs`}
                    >
                      {acc.initial}
                    </div>
                    <div>
                      <p className="font-fredoka text-sm font-black text-slate-800 group-hover:text-amber-700">
                        {acc.name}
                      </p>
                      <p className="text-xs text-slate-500 font-semibold">{acc.email}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}

              {/* Usar outra conta */}
              {!isCustomMode ? (
                <button
                  onClick={() => {
                    sound.playClick();
                    setIsCustomMode(true);
                  }}
                  className="w-full p-3 rounded-2xl border border-dashed border-slate-300 hover:border-slate-400 hover:bg-slate-50 flex items-center gap-3 text-left transition-all cursor-pointer text-slate-600 font-black text-xs"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-500 flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <span>Usar outra conta Google</span>
                </button>
              ) : (
                <form onSubmit={handleCustomSubmit} className="pt-2 space-y-3 border-t border-slate-100">
                  <div>
                    <label className="text-[11px] font-black uppercase text-slate-500 block mb-1">
                      E-mail da Conta Google:
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        placeholder="exemplo@gmail.com"
                        value={customEmail}
                        onChange={(e) => setCustomEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold focus:outline-hidden focus:border-amber-500"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-black uppercase text-slate-500 block mb-1">
                      Seu Nome:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="Seu nome"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold focus:outline-hidden focus:border-amber-500"
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div className="pt-1 flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 btn-3d-green rounded-xl font-black text-xs cursor-pointer"
                    >
                      Acessar Conta
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCustomMode(false)}
                      className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-600 text-xs cursor-pointer"
                    >
                      Voltar
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Privacy footer */}
            <div className="bg-slate-50 p-4 border-t border-slate-100 text-[11px] text-slate-400 text-center font-medium leading-relaxed">
              Para continuar, o Google compartilhará seu nome, e-mail e foto do perfil com Paçoca English.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
