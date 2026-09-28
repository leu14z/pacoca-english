import React, { useState } from 'react';
import { Flame, Gem, Trophy, Check, Edit2, RotateCcw, LogOut, Volume2 } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { sound, getSavedVoicePreference, setSavedVoicePreference, type PreferredVoiceStyle } from '../utils/audio';
import { PacocaBadge } from './PacocaBadge';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    updateUserName,
    logout,
    resetAllData,
  } = useUser();

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(currentUser?.name || '');
  const [voiceStyle, setVoiceStyle] = useState<PreferredVoiceStyle>(() => getSavedVoicePreference());
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!currentUser) return null;

  const handleSaveName = () => {
    if (tempName.trim()) {
      sound.playSuccess();
      updateUserName(tempName.trim());
      setIsEditingName(false);
    }
  };

  const handleVoiceChange = (style: PreferredVoiceStyle) => {
    sound.playClick();
    setVoiceStyle(style);
    setSavedVoicePreference(style);
  };

  const levelBadge =
    currentUser.level === 'A1'
      ? 'level-a1'
      : currentUser.level === 'A2'
      ? 'level-a2'
      : 'level-b1';

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24">
      {/* Student ID Card with Paçoca Badge */}
      <div className="bg-white border-2 border-slate-200 border-b-6 border-b-slate-300 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative shrink-0">
            <PacocaBadge badge={levelBadge} size="lg" />
          </div>

          <div className="text-center sm:text-left flex-1">
            {isEditingName ? (
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="px-3 py-1.5 border-2 border-amber-400 rounded-xl font-black text-xl text-slate-800 focus:outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleSaveName}
                  className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black text-xs cursor-pointer shadow-xs"
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
                  type="button"
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

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-black text-xs uppercase">
                Nível {currentUser.level || 'A1'}
              </span>
              <span className="text-xs font-bold text-slate-400">
                Aluno Oficial • Paçoca English
              </span>
            </div>

            <p className="text-xs text-slate-500 font-medium">
              Código de Parceria: <span className="font-mono font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">{currentUser.coupleCode}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border-2 border-slate-200 border-b-4 border-b-slate-300 rounded-2xl p-4 text-center shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center mx-auto mb-1.5">
            <Trophy className="w-4 h-4 text-amber-600" />
          </div>
          <span className="font-black text-xl text-slate-800 block">{currentUser.xp}</span>
          <span className="text-[11px] font-bold text-slate-400 uppercase">Total XP</span>
        </div>

        <div className="bg-white border-2 border-slate-200 border-b-4 border-b-slate-300 rounded-2xl p-4 text-center shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center mx-auto mb-1.5">
            <Flame className="w-4 h-4 text-orange-600 fill-orange-500" />
          </div>
          <span className="font-black text-xl text-slate-800 block">{currentUser.streak}</span>
          <span className="text-[11px] font-bold text-slate-400 uppercase">Dias de Ofensiva</span>
        </div>

        <div className="bg-white border-2 border-slate-200 border-b-4 border-b-slate-300 rounded-2xl p-4 text-center shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-sky-100 flex items-center justify-center mx-auto mb-1.5">
            <Gem className="w-4 h-4 text-sky-600 fill-sky-500" />
          </div>
          <span className="font-black text-xl text-slate-800 block">{currentUser.diamonds || 0}</span>
          <span className="text-[11px] font-bold text-slate-400 uppercase">Gemas / Diamantes</span>
        </div>

        <div className="bg-white border-2 border-slate-200 border-b-4 border-b-slate-300 rounded-2xl p-4 text-center shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-1.5">
            <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
          </div>
          <span className="font-black text-xl text-slate-800 block">{currentUser.completedLessons.length}</span>
          <span className="text-[11px] font-bold text-slate-400 uppercase">Lições Feitas</span>
        </div>
      </div>

      {/* Audio & Natural Voice Preferences */}
      <div className="bg-white border-2 border-slate-200 border-b-6 border-b-slate-300 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-700 shrink-0">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-base text-slate-800">
              Voz de Pronúncia em Inglês
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Escolha o estilo de voz nativa utilizado nos áudios do aplicativo.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => handleVoiceChange('female-natural')}
            className={`p-3.5 rounded-2xl border-2 text-left transition-colors cursor-pointer ${
              voiceStyle === 'female-natural'
                ? 'bg-sky-50 border-sky-500 text-sky-800 font-black border-b-4 border-b-sky-600'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700 font-bold'
            }`}
          >
            <span className="text-xs font-black block">Natural Feminina</span>
            <span className="text-[11px] text-slate-400 font-medium">Clara e amigável</span>
          </button>

          <button
            type="button"
            onClick={() => handleVoiceChange('male-british')}
            className={`p-3.5 rounded-2xl border-2 text-left transition-colors cursor-pointer ${
              voiceStyle === 'male-british'
                ? 'bg-sky-50 border-sky-500 text-sky-800 font-black border-b-4 border-b-sky-600'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700 font-bold'
            }`}
          >
            <span className="text-xs font-black block">Natural Britânica</span>
            <span className="text-[11px] text-slate-400 font-medium">Sotaque refinado</span>
          </button>

          <button
            type="button"
            onClick={() => handleVoiceChange('google-natural')}
            className={`p-3.5 rounded-2xl border-2 text-left transition-colors cursor-pointer ${
              voiceStyle === 'google-natural'
                ? 'bg-sky-50 border-sky-500 text-sky-800 font-black border-b-4 border-b-sky-600'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700 font-bold'
            }`}
          >
            <span className="text-xs font-black block">Americana Padrão</span>
            <span className="text-[11px] text-slate-400 font-medium">Conversação diária</span>
          </button>
        </div>
      </div>

      {/* Account Management & Reset */}
      <div className="bg-white border-2 border-slate-200 border-b-6 border-b-slate-300 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="font-black text-base text-slate-800">
          Gerenciamento da Conta
        </h3>

        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <button
            type="button"
            onClick={logout}
            className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 rounded-2xl font-black text-xs text-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <LogOut className="w-4 h-4 text-slate-500" />
            <span>Trocar de Conta</span>
          </button>

          {!showResetConfirm ? (
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="py-3 px-4 text-rose-600 hover:bg-rose-50 border-2 border-rose-200 rounded-2xl font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reiniciar Progresso</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  resetAllData();
                }}
                className="py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-xs cursor-pointer shadow-xs transition-colors"
              >
                Confirmar Reinício
              </button>
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="py-3 px-3 text-slate-500 font-bold text-xs cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
