import React, { useState } from 'react';
import { Flame, Gem, Trophy, Check, Edit2, RotateCcw, Globe } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { sound } from '../utils/audio';

export const ProfileView: React.FC = () => {
  const {
    activeUser,
    activeId,
    updateUserName,
    connectGoogleSimulated,
    logoutGoogle,
    resetAllData,
  } = useUser();

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(activeUser.name);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleInputEmail, setGoogleInputEmail] = useState('');
  const [googleInputName, setGoogleInputName] = useState('');
  const [showFirebaseGuide, setShowFirebaseGuide] = useState(false);

  const handleSaveName = () => {
    if (tempName.trim()) {
      sound.playSuccess();
      updateUserName(activeId, tempName.trim());
      setIsEditingName(false);
    }
  };

  const handleGoogleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleInputEmail) return;
    sound.playSuccess();
    connectGoogleSimulated(googleInputEmail, googleInputName || activeUser.name);
    setShowGoogleModal(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24">
      {/* Profile Card Header */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <img
              src={activeUser.avatar}
              alt={activeUser.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-contain bg-amber-50 p-2 border-4 border-amber-300 shadow-md"
            />
            <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-xs font-black px-2 py-0.5 rounded-full border-2 border-white shadow-xs">
              ATIVO
            </span>
          </div>

          <div className="text-center sm:text-left flex-1">
            {isEditingName ? (
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="px-3 py-1.5 border-2 border-amber-400 rounded-xl font-black text-xl text-slate-800 focus:outline-hidden"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="px-3 py-2 btn-3d-green rounded-xl font-bold text-xs cursor-pointer"
                >
                  Salvar
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <h2 className="font-fredoka text-2xl sm:text-3xl text-slate-800 font-black">
                  {activeUser.name}
                </h2>
                <button
                  onClick={() => {
                    sound.playClick();
                    setIsEditingName(true);
                  }}
                  className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  title="Editar nome"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            )}

            <p className="text-xs sm:text-sm font-bold text-slate-500 mb-4">
              Perfil {activeId === 'bryan' ? 'Principal (Bryan)' : 'Namorada'} • Membro desde 2026
            </p>

            {/* Google status */}
            {activeUser.googleEmail ? (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-extrabold text-xs">
                <Globe className="w-4 h-4 text-emerald-600" />
                <span>Conectado: {activeUser.googleEmail}</span>
                <button
                  onClick={logoutGoogle}
                  className="text-emerald-700 hover:text-emerald-900 underline ml-2 cursor-pointer"
                >
                  Sair
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowGoogleModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border-2 border-slate-300 rounded-xl font-black text-xs text-slate-700 shadow-xs cursor-pointer active:scale-95 transition-all"
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  className="w-4 h-4"
                />
                Vincular Conta Google
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <h3 className="font-fredoka text-xl text-slate-800 font-bold px-1">
        Estatísticas de Aprendizado
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-center">
          <div className="w-8 h-8 mx-auto mb-2 text-amber-500">
            <Flame className="w-full h-full fill-amber-500" />
          </div>
          <span className="text-2xl font-black text-slate-800 block">{activeUser.streak}</span>
          <span className="text-xs font-bold text-slate-400">Dias de Ofensiva</span>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-center">
          <div className="w-8 h-8 mx-auto mb-2 text-sky-500">
            <Gem className="w-full h-full fill-sky-500" />
          </div>
          <span className="text-2xl font-black text-slate-800 block">{activeUser.diamonds}</span>
          <span className="text-xs font-bold text-slate-400">Gemas Acumuladas</span>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-center">
          <div className="w-8 h-8 mx-auto mb-2 text-amber-500">
            <Trophy className="w-full h-full text-amber-500" />
          </div>
          <span className="text-2xl font-black text-slate-800 block">{activeUser.xp}</span>
          <span className="text-xs font-bold text-slate-400">Total de XP</span>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-center">
          <div className="w-8 h-8 mx-auto mb-2 text-emerald-500">
            <Check className="w-full h-full stroke-[3]" />
          </div>
          <span className="text-2xl font-black text-slate-800 block">
            {activeUser.completedLessons.length}
          </span>
          <span className="text-xs font-bold text-slate-400">Lições Concluídas</span>
        </div>
      </div>

      {/* GitHub & Hosting Instructions */}
      <div className="bg-sky-50 border-2 border-sky-200 rounded-3xl p-6">
        <div className="flex items-center justify-between gap-4 mb-2">
          <h4 className="font-fredoka text-lg font-black text-sky-900">
            Hospedagem no GitHub Pages
          </h4>
          <button
            onClick={() => setShowFirebaseGuide(!showFirebaseGuide)}
            className="text-xs font-black text-sky-700 underline cursor-pointer"
          >
            {showFirebaseGuide ? 'Ocultar Dicas' : 'Ver Como Publicar'}
          </button>
        </div>
        <p className="text-xs sm:text-sm font-semibold text-sky-800 leading-relaxed">
          O projeto está 100% configurado com caminhos relativos prontos para o GitHub Pages. Você e sua namorada podem acessar tanto no computador quanto pelo celular no navegador!
        </p>

        {showFirebaseGuide && (
          <div className="mt-4 p-4 bg-white rounded-2xl border border-sky-200 text-xs text-slate-700 space-y-2">
            <p className="font-bold text-slate-800">Passos rápidos para publicar:</p>
            <ol className="list-decimal pl-5 space-y-1 font-semibold">
              <li>Crie um repositório no seu GitHub (ex: <code>pacoca-english</code>).</li>
              <li>Execute <code>git push</code> com este código.</li>
              <li>Vá em <strong>Settings &gt; Pages</strong> no GitHub e selecione a branch ou GitHub Actions!</li>
            </ol>
          </div>
        )}
      </div>

      {/* Reset Progress Action */}
      <div className="pt-4 text-center">
        <button
          onClick={() => {
            if (confirm('Tem certeza que deseja redefinir todo o progresso dos perfis?')) {
              resetAllData();
            }
          }}
          className="text-xs text-rose-500 hover:text-rose-700 font-bold inline-flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reiniciar histórico de lições (Reset)
        </button>
      </div>

      {/* Google Login Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center">
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-12 h-12 mx-auto mb-3"
            />
            <h3 className="font-fredoka text-2xl text-slate-800 mb-1 font-black">
              Conectar com Google
            </h3>
            <p className="text-slate-500 text-xs font-semibold mb-4">
              Vincule sua conta Google ao perfil <strong>{activeUser.name}</strong> para sincronizar seu progresso.
            </p>

            <form onSubmit={handleGoogleLogin} className="space-y-3 text-left">
              <div>
                <label className="text-xs font-black uppercase text-slate-500 block mb-1">
                  Seu E-mail Google:
                </label>
                <input
                  type="email"
                  required
                  placeholder="exemplo@gmail.com"
                  value={googleInputEmail}
                  onChange={(e) => setGoogleInputEmail(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-bold focus:outline-hidden focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-500 block mb-1">
                  Nome de Exibição:
                </label>
                <input
                  type="text"
                  placeholder={activeUser.name}
                  value={googleInputName}
                  onChange={(e) => setGoogleInputName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-bold focus:outline-hidden focus:border-sky-500"
                />
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  className="w-full py-3.5 btn-3d-blue rounded-2xl font-black text-sm cursor-pointer"
                >
                  Conectar Perfil
                </button>
                <button
                  type="button"
                  onClick={() => setShowGoogleModal(false)}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 rounded-2xl font-extrabold text-slate-600 text-xs cursor-pointer"
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
