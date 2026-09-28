import React from 'react';
import { BookOpen, HeartHandshake, Trophy, Target, User } from 'lucide-react';
import { sound } from '../utils/audio';

export type TabType = 'learn' | 'couple' | 'leaderboard' | 'quests' | 'profile';

interface NavigationProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentTab, onSelectTab }) => {
  const navItems: { id: TabType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'learn', label: 'Aprender', icon: BookOpen },
    { id: 'couple', label: 'Modo Casal', icon: HeartHandshake },
    { id: 'leaderboard', label: 'Ranking', icon: Trophy },
    { id: 'quests', label: 'Desafios', icon: Target },
    { id: 'profile', label: 'Perfil', icon: User },
  ];

  const handleTabClick = (tab: TabType) => {
    sound.playClick();
    onSelectTab(tab);
  };

  return (
    <>
      {/* Desktop Left Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r-2 border-slate-200 bg-white p-4 min-h-screen sticky top-0 shrink-0">
        {/* Brand */}
        <div className="flex items-center gap-3 px-3 py-4 mb-6">
          <img
            src="./mascot/mascoteoficial.png"
            alt="Paçoca"
            className="w-11 h-11 object-contain drop-shadow"
          />
          <div>
            <h1 className="font-fredoka text-xl text-amber-600 tracking-wide font-black uppercase leading-tight">
              Paçoca
            </h1>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
              English
            </span>
          </div>
        </div>

        {/* Sidebar Links */}
        <nav className="space-y-2 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? 'bg-sky-100 text-sky-600 border-2 border-sky-300 shadow-xs'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700 border-2 border-transparent'
                }`}
              >
                <Icon
                  className={`w-6 h-6 ${
                    isActive ? 'text-sky-500' : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Mascot Tip box at bottom of sidebar */}
        <div className="p-3 bg-amber-50 border-2 border-amber-200 rounded-2xl flex items-center gap-3">
          <img
            src="./mascot/doido.png"
            alt="Paçoca"
            className="w-10 h-10 object-contain shrink-0"
          />
          <p className="text-xs font-bold text-amber-900 leading-snug">
            Ofensiva de casal ativa! Não deixem a chama apagar!
          </p>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-md border-t-2 border-slate-200 px-1 py-1 pb-[max(0.35rem,env(safe-area-inset-bottom))] flex items-center justify-around shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer ${
                isActive ? 'text-sky-500 font-black' : 'text-slate-400 font-bold hover:text-slate-600'
              }`}
            >
              <Icon
                className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform ${
                  isActive ? 'scale-110 text-sky-500' : 'text-slate-400'
                }`}
              />
              <span className="text-[9px] sm:text-[10px] mt-0.5 tracking-tight leading-none truncate max-w-[64px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
