import React, { useState } from 'react';
import { Flame, Gem, Trophy, Check, Edit2, RotateCcw, LogOut, Key } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { sound } from '../utils/audio';
import { saveFirebaseConfig } from '../services/firebase';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    updateUserName,
    logout,
    resetAllData,
  } = useUser();

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(currentUser?.name || '');
  const [showFirebaseModal, setShowFirebaseModal] = useState(false);
  const [fbApiKey, setFbApiKey] = useState('');
  const [fbProjectId, setFbProjectId] = useState('');
  const [fbConfigSaved, setFbConfigSaved] = useState(false);

  if (!currentUser) return null;

  const handleSaveName = () => {
    if (tempName.trim()) {
      sound.playSuccess();
      updateUserName(tempName.trim());
      setIsEditingName(false);
    }
  };

  const handleSaveFirebase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbApiKey || !fbProjectId) return;
    saveFirebaseConfig({
      apiKey: fbApiKey.trim(),
      projectId: fbProjectId.trim(),
      authDomain: `${fbProjectId.trim()}.firebaseapp.com`,
    });
    sound.playSuccess();
    setFbConfigSaved(true);
    setTimeout(() => {
      setFbConfigSaved(false);
      setShowFirebaseModal(false);
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24">
      {/* Profile Card Header */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
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
                  {currentUser.name}
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
              Código de Casal: <span className="font-mono font-black text-slate-700">{currentUser.coupleCode}</span>
            </p>

            {/* Actions: Firebase config & Logout */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <button
                onClick={() => setShowFirebaseModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-black text-slate-700 cursor-pointer transition-colors"
              >
                <Key className="w-3.5 h-3.5 text-amber-600" />
                <span>Configurar Chave Google / Firebase</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  logout();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-black cursor-pointer transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sair da Conta</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <h3 className="font-fredoka text-xl text-slate-800 font-bold px-1">
        Suas Estatísticas
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-center">
          <div className="w-8 h-8 mx-auto mb-2 text-amber-500">
            <Flame className="w-full h-full fill-amber-500" />
          </div>
          <span className="text-2xl font-black text-slate-800 block">{currentUser.streak}</span>
          <span className="text-xs font-bold text-slate-400">Dias de Ofensiva</span>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-center">
          <div className="w-8 h-8 mx-auto mb-2 text-sky-500">
            <Gem className="w-full h-full fill-sky-500" />
          </div>
          <span className="text-2xl font-black text-slate-800 block">{currentUser.diamonds}</span>
          <span className="text-xs font-bold text-slate-400">Gemas Acumuladas</span>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-center">
          <div className="w-8 h-8 mx-auto mb-2 text-amber-500">
            <Trophy className="w-full h-full text-amber-500" />
          </div>
          <span className="text-2xl font-black text-slate-800 block">{currentUser.xp}</span>
          <span className="text-xs font-bold text-slate-400">Total de XP</span>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-center">
          <div className="w-8 h-8 mx-auto mb-2 text-emerald-500">
            <Check className="w-full h-full stroke-[3]" />
          </div>
          <span className="text-2xl font-black text-slate-800 block">
            {currentUser.completedLessons.length}
          </span>
          <span className="text-xs font-bold text-slate-400">Lições Concluídas</span>
        </div>
      </div>

      {/* GitHub & Hosting Instructions */}
      <div className="bg-sky-50 border-2 border-sky-200 rounded-3xl p-6">
        <h4 className="font-fredoka text-lg font-black text-sky-900 mb-2">
          Publicação no GitHub Pages
        </h4>
        <p className="text-xs sm:text-sm font-semibold text-sky-800 leading-relaxed mb-3">
          O projeto está 100% pronto para o GitHub Pages. Você no seu celular e sua namorada no celular dela podem abrir o mesmo link no navegador e salvar na tela inicial como um aplicativo nativo!
        </p>
      </div>

      {/* Reset Progress Action */}
      <div className="pt-4 text-center">
        <button
          onClick={() => {
            if (confirm('Deseja redefinir todo o histórico local desta conta?')) {
              resetAllData();
            }
          }}
          className="text-xs text-rose-500 hover:text-rose-700 font-bold inline-flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reiniciar histórico de lições (Reset)
        </button>
      </div>

      {/* Firebase Keys Modal */}
      {showFirebaseModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="font-fredoka text-2xl text-slate-800 mb-2 font-black">
              Conectar Projeto Firebase
            </h3>
            <p className="text-slate-500 text-xs font-semibold mb-4">
              Para usar o Google Sign-In real no seu GitHub Pages entre celulares diferentes, cole as credenciais do seu projeto gratuito do Firebase:
            </p>

            <form onSubmit={handleSaveFirebase} className="space-y-3">
              <div>
                <label className="text-xs font-black uppercase text-slate-500 block mb-1">
                  API Key:
                </label>
                <input
                  type="text"
                  required
                  placeholder="AIzaSy..."
                  value={fbApiKey}
                  onChange={(e) => setFbApiKey(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-hidden focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-500 block mb-1">
                  Project ID:
                </label>
                <input
                  type="text"
                  required
                  placeholder="pacoca-english-xxxx"
                  value={fbProjectId}
                  onChange={(e) => setFbProjectId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-hidden focus:border-sky-500"
                />
              </div>

              {fbConfigSaved && (
                <p className="text-emerald-600 font-bold text-xs bg-emerald-50 p-2 rounded-xl border border-emerald-200 text-center">
                  Configuração do Firebase salva com sucesso! ✨
                </p>
              )}

              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  className="w-full py-3 btn-3d-blue rounded-2xl font-black text-sm cursor-pointer"
                >
                  Salvar Configurações
                </button>
                <button
                  type="button"
                  onClick={() => setShowFirebaseModal(false)}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 rounded-2xl font-extrabold text-slate-600 text-xs cursor-pointer"
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
