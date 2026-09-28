import React from 'react';

export type PacocaBadgeType =
  // Category Medallions
  | 'level-a1'
  | 'level-a2'
  | 'level-b1'
  // Unit Badges
  | 'unit-welcome'     // Unit 1: Primeiras Palavras
  | 'unit-family'      // Unit 2: Apresentação & Família
  | 'unit-clock'       // Unit 3: Números & Horas
  | 'unit-home'        // Unit 4: Na Casa & Roupas
  | 'unit-restaurant'  // Unit 5: Restaurante & Café
  | 'unit-travel'      // Unit 6: Aeroporto & Imigração
  | 'unit-hotel'       // Unit 7: Hotel & Wi-Fi
  | 'unit-city'        // Unit 8: Direções & Banheiro
  | 'unit-career'      // Unit 9: Trabalho & Reuniões
  | 'unit-slang'       // Unit 10: Gírias Nativas
  | 'unit-ideas'       // Unit 11: Debates & Opiniões
  | 'unit-coffee';     // Unit 12: Conexões & Café

interface PacocaBadgeProps {
  badge: PacocaBadgeType;
  size?: 'sm' | 'md' | 'lg';
  locked?: boolean;
  className?: string;
}

export const PacocaBadge: React.FC<PacocaBadgeProps> = ({
  badge,
  size = 'md',
  locked = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-11 h-11',
    md: 'w-14 h-14 sm:w-16 sm:h-16',
    lg: 'w-20 h-20',
  }[size];

  // If locked, render a custom carved stone/steel locked padlock emblem
  if (locked) {
    return (
      <div
        className={`relative rounded-2xl bg-gradient-to-b from-slate-200 to-slate-300 border-2 border-slate-300 border-b-4 border-b-slate-400 p-2 flex items-center justify-center shrink-0 shadow-inner ${sizeClasses} ${className}`}
      >
        <svg viewBox="0 0 48 48" className="w-full h-full fill-slate-500 drop-shadow-sm">
          {/* Shackle */}
          <path
            d="M16 20v-6a8 8 0 0 1 16 0v6"
            fill="none"
            stroke="#64748b"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Body */}
          <rect x="10" y="18" width="28" height="24" rx="6" fill="#94a3b8" stroke="#475569" strokeWidth="2" />
          <circle cx="24" cy="28" r="3" fill="#334155" />
          <path d="M24 31v4" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // 1. CATEGORY MEDALLIONS (Featuring Official Paçoca Mascot with 3D Rings)
  if (badge === 'level-a1') {
    return (
      <div className={`relative shrink-0 ${sizeClasses} ${className}`}>
        <div className="w-full h-full rounded-2xl bg-gradient-to-b from-emerald-300 via-emerald-400 to-emerald-600 p-1 border-2 border-emerald-300 border-b-4 border-b-emerald-700 shadow-md flex items-center justify-center">
          <div className="w-full h-full rounded-xl bg-white/90 p-0.5 flex items-center justify-center overflow-hidden">
            <img
              src="./mascot/mascoteoficial.png"
              alt="Paçoca Nível A1"
              className="w-full h-full object-contain drop-shadow"
            />
          </div>
        </div>
      </div>
    );
  }

  if (badge === 'level-a2') {
    return (
      <div className={`relative shrink-0 ${sizeClasses} ${className}`}>
        <div className="w-full h-full rounded-2xl bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 p-1 border-2 border-amber-300 border-b-4 border-b-amber-700 shadow-md flex items-center justify-center">
          <div className="w-full h-full rounded-xl bg-white/90 p-0.5 flex items-center justify-center overflow-hidden">
            <img
              src="./mascot/atencao.png"
              alt="Paçoca Nível A2"
              className="w-full h-full object-contain drop-shadow"
            />
          </div>
        </div>
      </div>
    );
  }

  if (badge === 'level-b1') {
    return (
      <div className={`relative shrink-0 ${sizeClasses} ${className}`}>
        <div className="w-full h-full rounded-2xl bg-gradient-to-b from-indigo-300 via-indigo-500 to-purple-700 p-1 border-2 border-indigo-300 border-b-4 border-b-indigo-800 shadow-md flex items-center justify-center">
          <div className="w-full h-full rounded-xl bg-white/90 p-0.5 flex items-center justify-center overflow-hidden">
            <img
              src="./mascot/orgulhoso.png"
              alt="Paçoca Nível B1"
              className="w-full h-full object-contain drop-shadow"
            />
          </div>
        </div>
      </div>
    );
  }

  // 2. BESPOKE UNIT BADGES (Unique Brand Visuals with 3D Depth)

  // Unit 1: Primeiras Palavras (Selo Boas-Vindas do Paçoca)
  if (badge === 'unit-welcome') {
    return (
      <div className={`relative shrink-0 ${sizeClasses} ${className}`}>
        <div className="w-full h-full rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 border-2 border-emerald-400 border-b-4 border-b-emerald-600 p-1 shadow-xs flex items-center justify-center">
          <svg viewBox="0 0 64 64" className="w-full h-full">
            <defs>
              <linearGradient id="bubbleGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
            {/* 3D Speech Bubble with Hello */}
            <rect x="8" y="10" width="48" height="34" rx="14" fill="url(#bubbleGrad1)" stroke="#047857" strokeWidth="2.5" />
            <polygon points="20,44 14,54 28,44" fill="#059669" stroke="#047857" strokeWidth="2" strokeLinejoin="round" />
            {/* Friendly smiling face on speech bubble */}
            <circle cx="24" cy="24" r="3" fill="#ffffff" />
            <circle cx="40" cy="24" r="3" fill="#ffffff" />
            <path d="M26 31 Q32 37 38 31" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
            {/* Sparkle star */}
            <polygon points="50,8 52,13 57,15 52,17 50,22 48,17 43,15 48,13" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
          </svg>
        </div>
      </div>
    );
  }

  // Unit 2: Família & Amor (Coração & Paçoca Partner)
  if (badge === 'unit-family') {
    return (
      <div className={`relative shrink-0 ${sizeClasses} ${className}`}>
        <div className="w-full h-full rounded-2xl bg-gradient-to-br from-rose-100 to-pink-200 border-2 border-rose-400 border-b-4 border-b-rose-600 p-1 shadow-xs flex items-center justify-center">
          <svg viewBox="0 0 64 64" className="w-full h-full">
            <defs>
              <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fb7185" />
                <stop offset="100%" stopColor="#e11d48" />
              </linearGradient>
            </defs>
            {/* 3D Heart */}
            <path
              d="M32 54 C10 40 4 24 14 14 C22 6 30 14 32 18 C34 14 42 6 50 14 C60 24 54 40 32 54 Z"
              fill="url(#heartGrad)"
              stroke="#be123c"
              strokeWidth="2.5"
            />
            {/* Inner highlight */}
            <path
              d="M48 18 C44 12 38 14 36 17"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Intertwined Golden Ring */}
            <circle cx="32" cy="34" r="8" fill="none" stroke="#fbbf24" strokeWidth="3" />
            <circle cx="32" cy="34" r="8" fill="none" stroke="#fef08a" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
    );
  }

  // Unit 3: Números & Horas (Relógio de Bolso Dourado)
  if (badge === 'unit-clock') {
    return (
      <div className={`relative shrink-0 ${sizeClasses} ${className}`}>
        <div className="w-full h-full rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-400 border-b-4 border-b-amber-600 p-1 shadow-xs flex items-center justify-center">
          <svg viewBox="0 0 64 64" className="w-full h-full">
            <defs>
              <linearGradient id="goldClock" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
            </defs>
            {/* Watch Top Loop */}
            <circle cx="32" cy="9" r="5" fill="none" stroke="#b45309" strokeWidth="3" />
            <rect x="29" y="11" width="6" height="5" fill="#f59e0b" rx="1" />
            {/* Clock Body */}
            <circle cx="32" cy="36" r="22" fill="url(#goldClock)" stroke="#92400e" strokeWidth="2.5" />
            <circle cx="32" cy="36" r="17" fill="#ffffff" stroke="#b45309" strokeWidth="1.5" />
            {/* Clock Hands */}
            <line x1="32" y1="36" x2="32" y2="24" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
            <line x1="32" y1="36" x2="41" y2="36" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="32" cy="36" r="2" fill="#ef4444" />
          </svg>
        </div>
      </div>
    );
  }

  // Unit 4: Na Casa & Cores (Casa Acolhedora do Paçoca)
  if (badge === 'unit-home') {
    return (
      <div className={`relative shrink-0 ${sizeClasses} ${className}`}>
        <div className="w-full h-full rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 border-2 border-purple-400 border-b-4 border-b-purple-600 p-1 shadow-xs flex items-center justify-center">
          <svg viewBox="0 0 64 64" className="w-full h-full">
            <defs>
              <linearGradient id="roofGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#7e22ce" />
              </linearGradient>
            </defs>
            {/* Roof */}
            <polygon points="32,8 6,30 58,30" fill="url(#roofGrad)" stroke="#6b21a8" strokeWidth="2.5" strokeLinejoin="round" />
            {/* Chimney */}
            <rect x="42" y="12" width="6" height="10" fill="#9333ea" stroke="#6b21a8" strokeWidth="1.5" />
            {/* House Body */}
            <rect x="14" y="29" width="36" height="27" rx="3" fill="#f3e8ff" stroke="#6b21a8" strokeWidth="2.5" />
            {/* Door */}
            <rect x="26" y="38" width="12" height="18" rx="2" fill="#7e22ce" />
            <circle cx="35" cy="47" r="1.5" fill="#facc15" />
            {/* Cozy Warm Window */}
            <rect x="18" y="35" width="6" height="6" rx="1" fill="#fef08a" stroke="#a855f7" strokeWidth="1" />
          </svg>
        </div>
      </div>
    );
  }

  // Unit 5: Restaurante & Café (Cloche Gourmet & Talheres)
  if (badge === 'unit-restaurant') {
    return (
      <div className={`relative shrink-0 ${sizeClasses} ${className}`}>
        <div className="w-full h-full rounded-2xl bg-gradient-to-br from-rose-100 to-amber-100 border-2 border-rose-400 border-b-4 border-b-rose-600 p-1 shadow-xs flex items-center justify-center">
          <svg viewBox="0 0 64 64" className="w-full h-full">
            <defs>
              <linearGradient id="dishGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fecdd3" />
                <stop offset="100%" stopColor="#f43f5e" />
              </linearGradient>
            </defs>
            {/* Dish Cover (Cloche) */}
            <circle cx="32" cy="18" r="4" fill="#fb7185" stroke="#be123c" strokeWidth="2" />
            <path
              d="M12 42 Q32 14 52 42 Z"
              fill="url(#dishGrad)"
              stroke="#be123c"
              strokeWidth="2.5"
            />
            {/* Serving Plate */}
            <rect x="6" y="42" width="52" height="6" rx="3" fill="#fda4af" stroke="#be123c" strokeWidth="2" />
            {/* Steam Trails */}
            <path d="M26 14 Q28 8 26 4" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
            <path d="M38 14 Q40 8 38 4" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    );
  }

  // Unit 6: Aeroporto & Imigração (Avião do Paçoca Cruzando o Globo)
  if (badge === 'unit-travel') {
    return (
      <div className={`relative shrink-0 ${sizeClasses} ${className}`}>
        <div className="w-full h-full rounded-2xl bg-gradient-to-br from-amber-100 to-sky-100 border-2 border-amber-400 border-b-4 border-b-amber-600 p-1 shadow-xs flex items-center justify-center">
          <svg viewBox="0 0 64 64" className="w-full h-full">
            <defs>
              <linearGradient id="planeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
            </defs>
            {/* Passport Stamp Oval */}
            <ellipse cx="32" cy="34" rx="26" ry="20" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="4 3" />
            {/* Airplane in Flight */}
            <path
              d="M10 24 L28 32 L54 18 L50 36 L34 42 L38 52 L30 48 L24 44 L16 46 L20 38 Z"
              fill="url(#planeGrad)"
              stroke="#0369a1"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <circle cx="50" cy="20" r="2" fill="#ffffff" />
          </svg>
        </div>
      </div>
    );
  }

  // Unit 7: Hotel & Wi-Fi (Chaveiro de Hotel Vintage do Paçoca)
  if (badge === 'unit-hotel') {
    return (
      <div className={`relative shrink-0 ${sizeClasses} ${className}`}>
        <div className="w-full h-full rounded-2xl bg-gradient-to-br from-sky-100 to-indigo-100 border-2 border-sky-400 border-b-4 border-b-sky-600 p-1 shadow-xs flex items-center justify-center">
          <svg viewBox="0 0 64 64" className="w-full h-full">
            <defs>
              <linearGradient id="hotelFob" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
            </defs>
            {/* Ring */}
            <circle cx="32" cy="12" r="6" fill="none" stroke="#f59e0b" strokeWidth="3" />
            {/* Classic Diamond Hotel Key Fob */}
            <polygon points="32,18 48,36 32,54 16,36" fill="url(#hotelFob)" stroke="#38bdf8" strokeWidth="2" />
            {/* Room 101 Number & Wi-Fi symbol */}
            <path d="M26 32 Q32 27 38 32" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
            <path d="M28 36 Q32 32 36 36" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
            <circle cx="32" cy="40" r="1.5" fill="#facc15" />
          </svg>
        </div>
      </div>
    );
  }

  // Unit 8: Direções & Banheiro (Placa Direcional & Bússola)
  if (badge === 'unit-city') {
    return (
      <div className={`relative shrink-0 ${sizeClasses} ${className}`}>
        <div className="w-full h-full rounded-2xl bg-gradient-to-br from-teal-100 to-emerald-100 border-2 border-teal-400 border-b-4 border-b-teal-600 p-1 shadow-xs flex items-center justify-center">
          <svg viewBox="0 0 64 64" className="w-full h-full">
            {/* Wooden Signpost */}
            <rect x="30" y="8" width="4" height="48" rx="2" fill="#78350f" />
            {/* Left Sign (Restroom / Banheiro) */}
            <path d="M12 18 L32 18 L32 28 L12 28 L6 23 Z" fill="#0d9488" stroke="#042f2e" strokeWidth="1.5" />
            <text x="12" y="25" fill="#ffffff" fontSize="7" fontWeight="bold">WC</text>
            {/* Right Sign (City / Downtown) */}
            <path d="M32 30 L52 30 L58 35 L52 40 L32 40 Z" fill="#14b8a6" stroke="#042f2e" strokeWidth="1.5" />
            <circle cx="48" cy="35" r="2" fill="#fef08a" />
          </svg>
        </div>
      </div>
    );
  }

  // Unit 9: Trabalho & Carreira (Pasta Executiva com Fecho de Ouro)
  if (badge === 'unit-career') {
    return (
      <div className={`relative shrink-0 ${sizeClasses} ${className}`}>
        <div className="w-full h-full rounded-2xl bg-gradient-to-br from-indigo-100 to-blue-200 border-2 border-indigo-400 border-b-4 border-b-indigo-600 p-1 shadow-xs flex items-center justify-center">
          <svg viewBox="0 0 64 64" className="w-full h-full">
            <defs>
              <linearGradient id="caseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4338ca" />
                <stop offset="100%" stopColor="#1e1b4b" />
              </linearGradient>
            </defs>
            {/* Handle */}
            <path d="M24 18 V12 Q32 8 40 12 V18" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
            {/* Briefcase Body */}
            <rect x="8" y="18" width="48" height="34" rx="6" fill="url(#caseGrad)" stroke="#1e1b4b" strokeWidth="2.5" />
            {/* Center Lock */}
            <rect x="28" y="24" width="8" height="8" rx="2" fill="#fbbf24" stroke="#b45309" strokeWidth="1.5" />
            <line x1="8" y1="28" x2="56" y2="28" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="3 2" />
          </svg>
        </div>
      </div>
    );
  }

  // Unit 10: Gírias Nativas (Megafone de Expressões do Paçoca)
  if (badge === 'unit-slang') {
    return (
      <div className={`relative shrink-0 ${sizeClasses} ${className}`}>
        <div className="w-full h-full rounded-2xl bg-gradient-to-br from-pink-100 to-rose-200 border-2 border-pink-400 border-b-4 border-b-pink-600 p-1 shadow-xs flex items-center justify-center">
          <svg viewBox="0 0 64 64" className="w-full h-full">
            <defs>
              <linearGradient id="megaphoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#be123c" />
              </linearGradient>
            </defs>
            {/* Megaphone Cone */}
            <polygon points="18,32 46,16 46,48" fill="url(#megaphoneGrad)" stroke="#881337" strokeWidth="2" />
            <ellipse cx="46" cy="32" rx="4" ry="16" fill="#fb7185" stroke="#881337" strokeWidth="2" />
            {/* Handle */}
            <rect x="18" y="32" width="10" height="18" rx="3" fill="#f59e0b" stroke="#b45309" strokeWidth="2" transform="rotate(-20 18 32)" />
            {/* Sound blast waves */}
            <path d="M52 24 Q58 32 52 40" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
            <path d="M56 18 Q64 32 56 46" fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    );
  }

  // Unit 11: Debates & Opiniões (Lâmpada de Ideias 3D com Estrela)
  if (badge === 'unit-ideas') {
    return (
      <div className={`relative shrink-0 ${sizeClasses} ${className}`}>
        <div className="w-full h-full rounded-2xl bg-gradient-to-br from-amber-100 to-yellow-200 border-2 border-amber-400 border-b-4 border-b-amber-600 p-1 shadow-xs flex items-center justify-center">
          <svg viewBox="0 0 64 64" className="w-full h-full">
            <defs>
              <linearGradient id="bulbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#facc15" />
                <stop offset="100%" stopColor="#eab308" />
              </linearGradient>
            </defs>
            {/* Light Rays */}
            <line x1="32" y1="4" x2="32" y2="8" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
            <line x1="12" y1="14" x2="16" y2="17" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
            <line x1="52" y1="14" x2="48" y2="17" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
            {/* Bulb Glass */}
            <path
              d="M22 36 C14 30 14 16 32 16 C50 16 50 30 42 36 L40 44 L24 44 Z"
              fill="url(#bulbGrad)"
              stroke="#b45309"
              strokeWidth="2.5"
            />
            {/* Base */}
            <rect x="26" y="44" width="12" height="4" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
            <rect x="28" y="48" width="8" height="4" rx="2" fill="#64748b" />
          </svg>
        </div>
      </div>
    );
  }

  // Unit 12: Café & Conversação (Caneca do Paçoca com Vapor de Coração)
  return (
    <div className={`relative shrink-0 ${sizeClasses} ${className}`}>
      <div className="w-full h-full rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-200 border-2 border-purple-400 border-b-4 border-b-purple-600 p-1 shadow-xs flex items-center justify-center">
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <defs>
            <linearGradient id="mugGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#6b21a8" />
            </linearGradient>
          </defs>
          {/* Mug Handle */}
          <path d="M42 26 C52 26 52 44 42 44" fill="none" stroke="#6b21a8" strokeWidth="4" strokeLinecap="round" />
          {/* Mug Body */}
          <rect x="14" y="22" width="30" height="28" rx="6" fill="url(#mugGrad)" stroke="#581c87" strokeWidth="2.5" />
          {/* Steam heart */}
          <path
            d="M29 16 C27 12 23 12 23 15 C23 18 29 20 29 20 C29 20 35 18 35 15 C35 12 31 12 29 16 Z"
            fill="#e9d5ff"
            stroke="#a855f7"
            strokeWidth="1"
          />
          {/* Coffee surface */}
          <ellipse cx="29" cy="22" rx="15" ry="3" fill="#3b0764" />
        </svg>
      </div>
    </div>
  );
};
