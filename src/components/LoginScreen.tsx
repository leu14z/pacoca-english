import React, { useState, useEffect } from 'react';
import { ShieldCheck, Mail, User } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { Mascot } from './Mascot';
import { sound } from '../utils/audio';
import { loadGoogleGsiScript, parseJwt } from '../services/auth';

export const LoginScreen: React.FC = () => {
  const { loginUser } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  // Initialize Google Identity Services script
  useEffect(() => {
    loadGoogleGsiScript().then((ready) => {
      const googleClientId = (window as any).VITE_GOOGLE_CLIENT_ID || localStorage.getItem('pacoca_google_client_id');
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
          const buttonDiv = document.getElementById('googleSignInDiv');
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
          console.warn('Google GSI init error:', e);
        }
      }
    });
  }, []);

  const handleOpenLogin = () => {
    sound.playClick();
    setShowModal(true);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim()) return;
    sound.playSuccess();
    loginUser(email.trim(), name.trim());
    setShowModal(false);
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
      </div>

      {/* Hero Content */}
      <div className="w-full max-w-md my-auto flex flex-col items-center text-center py-6">
        <Mascot
          mood="official"
          size="lg"
          speech="Bem-vindo! Crie sua conta ou faça login para começar do zero!"
          className="mb-4"
        />

        <h1 className="font-fredoka text-3xl sm:text-4xl text-slate-800 font-black mb-3">
          Aprenda Inglês de Verdade
        </h1>
        <p className="text-slate-600 font-bold text-sm sm:text-base max-w-xs mb-8">
          Pratique pelo celular ou computador. Cada pessoa tem seu próprio painel, suas vidas e seu progresso!
        </p>

        {/* Login with Google Button */}
        <div className="w-full space-y-3">
          {/* Native Google Button if initialized */}
          <div id="googleSignInDiv" className="w-full flex justify-center"></div>

          {/* Primary Google Login Button */}
          <button
            onClick={handleOpenLogin}
            className="w-full py-4 px-6 bg-white hover:bg-slate-50 border-2 border-slate-300 border-b-4 border-b-slate-400 rounded-2xl font-black text-slate-700 text-base flex items-center justify-center gap-3 shadow-md hover:border-slate-400 active:border-b-2 active:translate-y-0.5 transition-all cursor-pointer"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-6 h-6"
            />
            <span>Entrar com a Conta Google</span>
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="w-full max-w-md text-center py-2 text-xs font-bold text-slate-400 flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>Cada conta inicia do zero, sem dados fictícios</span>
      </div>

      {/* Google Login Form Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center">
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-12 h-12 mx-auto mb-3"
            />
            <h3 className="font-fredoka text-2xl text-slate-800 mb-1 font-black">
              Entrar na Plataforma
            </h3>
            <p className="text-slate-500 text-xs font-semibold mb-5">
              Digite seu e-mail e nome para entrar no seu painel individual.
            </p>

            <form onSubmit={handleManualSubmit} className="space-y-4 text-left">
              <div>
                <label className="text-xs font-black uppercase text-slate-500 block mb-1">
                  Seu E-mail:
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="ex: seuemail@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-bold focus:outline-hidden focus:border-sky-500"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-500 block mb-1">
                  Seu Nome ou Apelido:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="ex: Leo, Maria, Carlos..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-bold focus:outline-hidden focus:border-sky-500"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  className="w-full py-3.5 btn-3d-green rounded-2xl font-black text-sm cursor-pointer"
                >
                  Entrar no Meu Painel
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 rounded-2xl font-extrabold text-slate-600 text-xs cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
