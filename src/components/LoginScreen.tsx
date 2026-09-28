import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../context/UserContext';
import { sound } from '../utils/audio';
import { loadGoogleGsiScript, parseJwt, checkGoogleOAuthCallback } from '../services/auth';
import { supabase, signInWithGoogle, isSupabaseConfigured } from '../services/supabase';

export const LoginScreen: React.FC = () => {
  const { loginUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const gsiLoadedRef = useRef(false);

  const googleClientId =
    (window as any).VITE_GOOGLE_CLIENT_ID ||
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    '427875091260-b956dimsk55mves2pgur7uufj8p82p1e.apps.googleusercontent.com';

  // 1. Check if returning from standard Google OAuth redirect
  useEffect(() => {
    checkGoogleOAuthCallback().then((profile) => {
      if (profile) {
        sound.playSuccess();
        loginUser(profile.email, profile.name, profile.avatar);
      }
    });
  }, [loginUser]);

  // 2. Initialize Google Identity Services (GSI) for seamless in-app popup (no black redirect screen)
  useEffect(() => {
    if (gsiLoadedRef.current) return;

    loadGoogleGsiScript().then((ready) => {
      if (ready && googleClientId && (window as any).google?.accounts?.id) {
        try {
          (window as any).google.accounts.id.initialize({
            client_id: googleClientId,
            callback: async (response: any) => {
              if (!response?.credential) return;

              setIsLoading(true);
              sound.playSuccess();

              // Authenticate with Supabase using native Google ID Token (no redirect!)
              if (supabase) {
                try {
                  const { data, error } = await supabase.auth.signInWithIdToken({
                    provider: 'google',
                    token: response.credential,
                  });

                  if (data?.user && !error) {
                    const email = data.user.email || '';
                    const name =
                      data.user.user_metadata?.full_name ||
                      data.user.user_metadata?.name ||
                      email.split('@')[0];
                    const avatar =
                      data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture;

                    loginUser(email, name, avatar, data.user.id);
                    setIsLoading(false);
                    return;
                  }
                } catch (supabaseErr) {
                  console.warn('Supabase id_token auth fallback:', supabaseErr);
                }
              }

              // Fallback to direct client-side payload
              const payload = parseJwt(response.credential);
              if (payload?.email) {
                loginUser(payload.email, payload.name, payload.picture);
              }
              setIsLoading(false);
            },
            auto_select: false,
          });

          gsiLoadedRef.current = true;

          // Render Google's native one-tap or prompt if appropriate
          (window as any).google.accounts.id.prompt((notification: any) => {
            if (notification.isNotDisplayed()) {
              console.log('Google One Tap notice:', notification.getNotDisplayedReason());
            }
          });
        } catch (err) {
          console.warn('Google GSI init notice:', err);
        }
      }
    });
  }, [googleClientId, loginUser]);

  // Handle Sign In click with clean Google OAuth2 popup (no supabase.co url shown to users!)
  const handleGoogleSignIn = () => {
    sound.playClick();
    setIsLoading(true);
    setErrorMessage(null);

    // Primary: Official Google OAuth2 popup dialog
    if ((window as any).google?.accounts?.oauth2) {
      try {
        const client = (window as any).google.accounts.oauth2.initTokenClient({
          client_id: googleClientId,
          scope: 'email profile openid',
          callback: async (tokenResponse: any) => {
            if (tokenResponse?.error) {
              setIsLoading(false);
              if (tokenResponse.error !== 'popup_closed_by_user') {
                setErrorMessage('Não foi possível concluir o login com o Google.');
              }
              return;
            }

            if (tokenResponse?.access_token) {
              try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                if (res.ok) {
                  const data = await res.json();
                  sound.playSuccess();
                  loginUser(data.email, data.name || data.given_name || 'Aluno', data.picture);
                  setIsLoading(false);
                  return;
                }
              } catch (fetchErr) {
                console.warn('Erro ao buscar dados do Google:', fetchErr);
              }
            }
            setIsLoading(false);
          },
        });

        client.requestAccessToken();
        return;
      } catch (err) {
        console.warn('Google oauth2 client init notice:', err);
      }
    }

    // Secondary fallback: Supabase redirect
    executeFallbackRedirect();
  };

  const executeFallbackRedirect = async () => {
    if (isSupabaseConfigured) {
      try {
        const { error } = await signInWithGoogle();
        if (error) {
          setErrorMessage(error.message);
          setIsLoading(false);
        }
        return;
      } catch (err: any) {
        setErrorMessage(err?.message || 'Falha ao conectar com o Google.');
        setIsLoading(false);
        return;
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] flex flex-col justify-between items-center p-6 select-none">
      {/* Brand Header */}
      <header className="w-full max-w-md flex items-center justify-between pt-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-400 border-2 border-amber-500 border-b-4 border-b-amber-600 flex items-center justify-center shadow-xs overflow-hidden p-0.5">
            <img
              src="./mascot/mascoteoficial.png"
              alt="Paçoca"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="font-fredoka text-2xl font-black text-amber-700 tracking-tight leading-none">
              PAÇOCA ENGLISH
            </h1>
            <span className="text-[11px] font-black uppercase text-amber-500 tracking-wider">
              Aprenda Inglês Falando
            </span>
          </div>
        </div>
      </header>

      {/* Main Focus Area */}
      <main className="w-full max-w-sm flex flex-col items-center text-center my-auto py-8">
        {/* Mascot Centerpiece */}
        <div className="relative mb-6">
          <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-b from-amber-100/90 to-amber-200/50 flex items-center justify-center p-3 border-4 border-white shadow-xl">
            <img
              src="./mascot/mascoteoficial.png"
              alt="Paçoca Mascote"
              className="w-full h-full object-contain drop-shadow-md transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Title and Tagline */}
        <h2 className="font-fredoka text-3xl sm:text-4xl text-slate-800 font-black mb-3 leading-tight tracking-tight">
          Aprenda Inglês de Verdade
        </h2>
        <p className="text-slate-500 font-bold text-sm sm:text-base leading-relaxed max-w-xs mb-8">
          Pratique fala e pronúncia desde o nível iniciante com o Paçoca. Sem enrolação.
        </p>

        {/* Primary Action Button */}
        <div className="w-full space-y-3">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-bold text-center">
              {errorMessage}
            </div>
          )}

          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-4 px-6 bg-white hover:bg-slate-50 border-2 border-slate-300 border-b-4 border-b-slate-400 active:border-b-2 active:translate-y-0.5 rounded-2xl font-black text-slate-700 text-base sm:text-lg flex items-center justify-center gap-3.5 shadow-md hover:border-slate-400 transition-all cursor-pointer group disabled:opacity-60"
          >
            {/* Crisp Authentic Google G Logo */}
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
            <span>{isLoading ? 'Conectando ao Google...' : 'Entrar com o Google'}</span>
          </button>
        </div>
      </main>

      {/* Clean Footer */}
      <footer className="w-full max-w-sm text-center pb-4 text-xs font-bold text-slate-400">
        Cada aluno possui seu próprio painel, vidas e histórico salvos.
      </footer>
    </div>
  );
};
