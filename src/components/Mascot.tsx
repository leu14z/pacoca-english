import React from 'react';
import { motion } from 'framer-motion';
import { MASCOT_DATA } from '../utils/mascot';
import type { MascotMood } from '../utils/mascot';
import { sound } from '../utils/audio';

interface MascotProps {
  mood?: MascotMood;
  speech?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  className?: string;
  animate?: boolean;
}

export const Mascot: React.FC<MascotProps> = ({
  mood = 'official',
  speech,
  size = 'md',
  interactive = true,
  className = '',
  animate = true,
}) => {
  const info = MASCOT_DATA[mood] || MASCOT_DATA.official;

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
    xl: 'w-64 h-64',
  }[size];

  const handleClick = () => {
    if (interactive) {
      sound.playClick();
    }
  };

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* Speech Bubble if provided */}
      {speech && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="relative mb-3 max-w-xs sm:max-w-sm px-4 py-3 bg-white border-2 border-slate-200 rounded-2xl shadow-sm text-slate-700 font-bold text-sm sm:text-base text-center"
        >
          {speech}
          {/* Bubble triangle pointer */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r-2 border-b-2 border-slate-200 rotate-45" />
        </motion.div>
      )}

      {/* Mascot Animated Character */}
      <motion.div
        whileHover={interactive ? { scale: 1.06, rotate: [-1, 2, -1] } : undefined}
        whileTap={interactive ? { scale: 0.94 } : undefined}
        animate={
          animate
            ? {
                y: [0, -5, 0],
              }
            : undefined
        }
        transition={{
          repeat: Infinity,
          duration: mood === 'frenzy' ? 0.6 : 3,
          ease: 'easeInOut',
        }}
        onClick={handleClick}
        className={`relative cursor-pointer transition-transform ${sizeClasses}`}
      >
        <img
          src={info.image}
          alt={info.alt}
          className="w-full h-full object-contain drop-shadow-md"
          loading="eager"
        />

        {/* Small badge or mood effect for frenzy or victory */}
        {mood === 'frenzy' && (
          <span className="absolute -top-1 -right-1 flex h-6 w-6">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-6 w-6 bg-amber-500 text-xs text-white items-center justify-center font-black">
              🔥
            </span>
          </span>
        )}
        {mood === 'proud' && (
          <span className="absolute -top-1 -right-1 text-xl animate-bounce">👑</span>
        )}
      </motion.div>
    </div>
  );
};
