import React, { useState, useEffect } from 'react';
import { ShieldCheck, Sparkles, CheckCircle2, Settings, Key, AlertCircle } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { Mascot } from './Mascot';
import { PacocaBadge } from './PacocaBadge';
import { sound } from '../utils/audio';
import {
  loadGoogleGsiScript,
  parseJwt,
  redirectToGoogleOAuth,
  checkGoogleOAuthCallback,
} from '../services/auth';
import { signInWithGoogle, isSupabaseConfigured } from '../services/supabase';

export const LoginScreen: React.FC = () => {
  const { loginUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [googleClientId, setGoogleClientId] = useState<string>(() => {
    return (
      (window as any).VITE_GOOGLE_CLIENT_ID ||
      localStorage.getItem('pacoca_google_client_id') ||
      import.meta.env.VITE_GOOGLE_CLIENT_ID ||
      ''
    );
  });
  const [tempClientId, setTempClientId] = useState('');

  // 1. Check if returning from Google OAuth redirect with access_token in URL hash
  useEffect(() => {
    checkGoogleOAuthCallback().then((profile) => {
      if (profile) {
        sound.playSuccess();
        loginUser(profile.email, profile.name, profile.avatar);
      }
    });
  }, [loginUser]);

  // 2. Initialize Google Identity Services (GSI) official button and One-Tap
  useEffect(() => {
    loadGoogleGsiScript().then((ready) => {
      if (ready && googleClientId && (window as any).google?.accounts?.id) {
        try {
          (window as any).google.accounts.id.initialize({
            client_id: googleClientId,
            callback: (response: any) => {
              const payload = parseJwt(response.credential);
              if (payload?.email) {
                sound.playSuccess();
                loginUser(payload.email, payload.name, payload.picture);
              }
            },
            auto_select: false,
          });

          // Render official Google Sign-In button if element exists
          const buttonDiv = document.getElementById('officialGoogleButtonDiv');
          if (buttonDiv) {
            buttonDiv.innerHTML = '';
            (window as any).google.accounts.id.renderButton(buttonDiv, {
              theme: 'outline',
              size: 'large',
              width: 320,
              text: 'continue_with',
              shape: 'pill',
              logo_alignment: 'left',
            });
          }

          // Optional: Google One Tap prompt
          (window as any).google.accounts.id.prompt();
        } catch (err) {
          console.warn('Google GSI initialization error:', err);
        }
      }
    });
  }, [googleClientId, loginUser]);

  // Handle Official Google Sign-In click
  const handleGoogleSignIn = async () => {
    sound.playClick();
    setIsLoading(true);
    setErrorMessage(null);

    // Option A: Supabase Auth with Google OAuth
    if (isSupabaseConfigured) {
      try {
        const { error } = await signInWithGoogle();
        if (error) {
          setErrorMessage(error.message);
          setIsLoading(false);
        }
        return;
      } catch (err: any) {
        setErrorMessage(err?.message || 'Falha ao conectar ao Supabase.');
        setIsLoading(false);
        return;
      }
    }

    // Option B: Google Client ID with OAuth / GSI
    if (googleClientId) {
      try {
        if ((window as any).google?.accounts?.id) {
          (window as any).google.accounts.id.prompt((notification: any) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
              // Fallback to direct Google OAuth 2.0 redirect
              redirectToGoogleOAuth(googleClientId);
            }
          });
        } else {
          redirectToGoogleOAuth(googleClientId);
        }
      } catch (err) {
        redirectToGoogleOAuth(googleClientId);
      }
      return;
    }

    // Option C: No credentials configured yet -> prompt configuration
    setIsLoading(false);
    setShowConfigModal(true);
  };

  const handleSaveClientId = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = tempClientId.trim();
    if (!clean) return;

    localStorage.setItem('pacoca_google_client_id', clean);
    setGoogleClientId(clean);
    setShowConfigModal(false);
    sound.playSuccess();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/70 via-slate-50 to-amber-100/30 flex flex-col justify-between p-4 sm:p-8">
      {/* Top Header */}
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

        <button
          onClick={() => {
            sound.playClick();
            setShowConfigModal(true);
          }}
          title="Configurações de Conexão Google"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-600 text-xs font-black transition-colors cursor-pointer"
        >
          <Settings className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Google OAuth</span>
        </button>
      </header>

      {/* Main Login Hero */}
      <main className="w-full max-w-md mx-auto my-auto flex flex-col items-center text-center py-6">
        <Mascot
          mood="official"
          size="lg"
          speech="Bem-vindo ao Paçoca English! Faça login com sua conta oficial do Google para acessar suas lições e salvar seu progresso!"
          className="mb-4"
        />

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black uppercase tracking-wider mb-2 border border-amber-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          Acesso Seguro & Individual
        </div>

        <h2 className="font-fredoka text-3xl sm:text-4xl text-slate-800 font-black mb-2 leading-tight">
          Aprenda Inglês com o Paçoca
        </h2>
        <p className="text-slate-600 font-bold text-sm sm:text-base max-w-xs mb-6">
          A plataforma é aberta a todos os alunos. Conecte sua conta Google para iniciar do seu nível individual.
        </p>

        {/* Central Google Sign-In Card */}
        <div className="w-full bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-xl space-y-4">
          {/* Error Message if any */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Official Google Button rendered by Google Identity Services if Client ID exists */}
          <div id="officialGoogleButtonDiv" className="w-full flex justify-center empty:hidden"></div>

          {/* Primary 3D Google Sign-In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-4 px-6 bg-white hover:bg-slate-50 border-2 border-slate-300 border-b-4 border-b-slate-400 active:border-b-2 active:translate-y-0.5 rounded-2xl font-black text-slate-700 text-base sm:text-lg flex items-center justify-center gap-3 shadow-md hover:border-slate-400 transition-all cursor-pointer group"
          >
            {/* Authentic Google Multi-Color G Logo */}
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
            <span>{isLoading ? 'Conectando ao Google...' : 'Continuar com o Google'}</span>
          </button>

          <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
            Ao continuar, você entrará diretamente com sua conta Google oficial. Suas vidas, lições e conquistas ficam salvos de forma permanente.
          </p>
        </div>

        {/* Feature Badges Grid (Zero Emojis) */}
        <div className="w-full grid grid-cols-3 gap-2.5 mt-6">
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
            <span className="text-[10px] text-slate-500 font-semibold leading-tight">Ordem estruturada</span>
          </div>

          <div className="bg-white/80 rounded-2xl p-3 border border-slate-200/80 flex flex-col items-center text-center shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-1">
              <svg className="w-5 h-5 fill-purple-600" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <span className="font-fredoka text-xs font-black text-slate-700">Modo Casal</span>
            <span className="text-[10px] text-slate-500 font-semibold leading-tight">Conexão opcional</span>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="w-full max-w-md mx-auto text-center py-2 text-xs font-bold text-slate-400 flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>Autenticação direta pelos servidores oficiais da Google</span>
      </footer>

      {/* Configuration Modal (for entering Google Client ID or Supabase OAuth setup) */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/75 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border-2 border-slate-200 p-6 text-left animate-in fade-in zoom-in duration-150">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-fredoka text-xl text-slate-800 font-black">
                  Conexão Oficial Google
                </h3>
                <p className="text-slate-500 text-xs font-semibold">
                  Google Cloud Console ou Supabase Auth
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 font-semibold leading-relaxed mb-4">
              Para autenticar centenas de usuários com a conta oficial do Google (@gmail.com), a plataforma utiliza o <span className="font-bold text-slate-800">Google OAuth 2.0</span> ou o <span className="font-bold text-slate-800">Supabase</span>.
            </p>

            <form onSubmit={handleSaveClientId} className="space-y-4">
              <div>
                <label className="text-[11px] font-black uppercase text-slate-500 block mb-1">
                  Google Client ID (Google Cloud):
                </label>
                <input
                  type="text"
                  placeholder="ex: 123456789-xxxxxx.apps.googleusercontent.com"
                  value={tempClientId || googleClientId}
                  onChange={(e) => setTempClientId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold focus:outline-hidden focus:border-amber-500"
                />
                <span className="text-[10px] text-slate-400 font-semibold mt-1 block">
                  Criado gratuitamente no <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer" className="text-sky-600 underline">Google Cloud Console</a>.
                </span>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs font-medium space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Ambiente de Produção com Supabase:</span>
                </div>
                <p className="text-[11px] text-amber-800/90 leading-tight">
                  Se você utiliza o Supabase, basta definir <code className="bg-amber-100 px-1 rounded text-[10px]">VITE_SUPABASE_URL</code> e <code className="bg-amber-100 px-1 rounded text-[10px]">VITE_SUPABASE_ANON_KEY</code> no arquivo <code className="bg-amber-100 px-1 rounded text-[10px]">.env</code> para habilitar o Google Provider.
                </p>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 btn-3d-green rounded-xl font-black text-xs cursor-pointer"
                >
                  Salvar e Ativar Google Sign-In
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-600 text-xs cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
