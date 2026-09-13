import React, { useState } from 'react';
import { Heart, ShieldCheck } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { Mascot } from './Mascot';
import { sound } from '../utils/audio';

export const LoginScreen: React.FC = () => {
  const { loginWithGoogle, loginAsUser } = useUser();
  const [loading, setLoading] = useState(false);

  const handleGoogleClick = async () => {
    sound.playClick();
    setLoading(true);
    await loginWithGoogle();
    setLoading(false);
  };

  const handleQuickLogin = (preset: 'leo' | 'partner') => {
    sound.playSuccess();
    loginAsUser(preset);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-between p-4 sm:p-8">
      {/* Top Header */}
      <div className="w-full max-w-md flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <img
            src="./mascot/mascoteoficial.png"
            alt="Paçoca"
            className="w-9 h-9 object-contain"
          />
          <span className="font-fredoka text-xl font-black text-amber-600 uppercase">
            Paçoca English
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs font-black text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
          <Heart className="w-3.5 h-3.5 fill-rose-500" />
          <span>Modo Casal</span>
        </div>
      </div>

      {/* Hero Content */}
      <div className="w-full max-w-md my-auto flex flex-col items-center text-center py-6">
        <Mascot
          mood="official"
          size="lg"
          speech="Bem-vindo! Bora destravar o inglês juntos?"
          className="mb-4"
        />

        <h1 className="font-fredoka text-3xl sm:text-4xl text-slate-800 font-black mb-3">
          Aprenda Inglês de Verdade
        </h1>
        <p className="text-slate-600 font-bold text-sm sm:text-base max-w-xs mb-8">
          A plataforma interativa e divertida para você e seu amor praticarem cada um no seu próprio celular!
        </p>

        {/* Login with Google Button */}
        <div className="w-full space-y-3">
          <button
            onClick={handleGoogleClick}
            disabled={loading}
            className="w-full py-4 px-6 bg-white hover:bg-slate-50 border-2 border-slate-300 border-b-4 border-b-slate-400 rounded-2xl font-black text-slate-700 text-base flex items-center justify-center gap-3 shadow-md hover:border-slate-400 active:border-b-2 active:translate-y-0.5 transition-all cursor-pointer"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-6 h-6"
            />
            <span>{loading ? 'Conectando...' : 'Continuar com o Google'}</span>
          </button>

          {/* Quick Access for Leo & Girlfriend */}
          <div className="pt-4 border-t border-slate-200">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-3">
              Ou escolha seu painel para entrar agora:
            </span>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleQuickLogin('leo')}
                className="py-3 px-4 btn-3d-green rounded-2xl font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Entrar como Leo</span>
              </button>

              <button
                onClick={() => handleQuickLogin('partner')}
                className="py-3 px-4 btn-3d-amber rounded-2xl font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Entrar como Amor ❤️</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="w-full max-w-md text-center py-2 text-xs font-bold text-slate-400 flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>Cada um tem seu login e painel exclusivo e independente</span>
      </div>
    </div>
  );
};
