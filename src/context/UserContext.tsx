import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  id: 'bryan' | 'partner';
  name: string;
  avatar: string;
  xp: number;
  hearts: number;
  maxHearts: number;
  diamonds: number;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  completedLessons: string[];
  completedToday: boolean;
  googleEmail?: string;
  googleName?: string;
  googlePhoto?: string;
}

export interface CoupleStats {
  sharedStreak: number;
  lastNudge?: {
    from: string;
    message: string;
    timestamp: number;
  };
}

interface UserContextType {
  activeUser: UserProfile;
  otherUser: UserProfile;
  activeId: 'bryan' | 'partner';
  switchUser: (id: 'bryan' | 'partner') => void;
  updateUserName: (id: 'bryan' | 'partner', newName: string) => void;
  coupleStats: CoupleStats;
  completeLesson: (lessonId: string, xpGained: number) => void;
  loseHeart: () => void;
  refillHearts: () => boolean;
  sendCoupleNudge: (message: string) => void;
  clearNudge: () => void;
  connectGoogleSimulated: (email: string, name: string) => void;
  logoutGoogle: () => void;
  resetAllData: () => void;
}

const getTodayString = () => new Date().toISOString().split('T')[0];

const INITIAL_BRYAN: UserProfile = {
  id: 'bryan',
  name: 'Bryan',
  avatar: './mascot/mascoteoficial.png',
  xp: 140,
  hearts: 5,
  maxHearts: 5,
  diamonds: 320,
  streak: 5,
  lastActiveDate: getTodayString(),
  completedLessons: ['lesson-1-1'],
  completedToday: true,
};

const INITIAL_PARTNER: UserProfile = {
  id: 'partner',
  name: 'Amor ❤️',
  avatar: './mascot/certinho.png',
  xp: 110,
  hearts: 5,
  maxHearts: 5,
  diamonds: 280,
  streak: 4,
  lastActiveDate: getTodayString(),
  completedLessons: ['lesson-1-1'],
  completedToday: false,
};

const INITIAL_COUPLE: CoupleStats = {
  sharedStreak: 4,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeId, setActiveId] = useState<'bryan' | 'partner'>(() => {
    return (localStorage.getItem('pacoca_active_user') as 'bryan' | 'partner') || 'bryan';
  });

  const [profiles, setProfiles] = useState<{ bryan: UserProfile; partner: UserProfile }>(() => {
    const saved = localStorage.getItem('pacoca_profiles_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return { bryan: INITIAL_BRYAN, partner: INITIAL_PARTNER };
  });

  const [coupleStats, setCoupleStats] = useState<CoupleStats>(() => {
    const saved = localStorage.getItem('pacoca_couple_stats_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_COUPLE;
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('pacoca_active_user', activeId);
  }, [activeId]);

  useEffect(() => {
    localStorage.setItem('pacoca_profiles_v1', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem('pacoca_couple_stats_v1', JSON.stringify(coupleStats));
  }, [coupleStats]);

  const activeUser = profiles[activeId];
  const otherUser = profiles[activeId === 'bryan' ? 'partner' : 'bryan'];

  const switchUser = (id: 'bryan' | 'partner') => {
    setActiveId(id);
  };

  const updateUserName = (id: 'bryan' | 'partner', newName: string) => {
    setProfiles((prev) => ({
      ...prev,
      [id]: { ...prev[id], name: newName },
    }));
  };

  const completeLesson = (lessonId: string, xpGained: number) => {
    const today = getTodayString();
    setProfiles((prev) => {
      const cur = prev[activeId];
      const isNew = !cur.completedLessons.includes(lessonId);
      const updatedLessons = isNew ? [...cur.completedLessons, lessonId] : cur.completedLessons;
      const updatedXp = cur.xp + xpGained;
      const updatedGems = cur.diamonds + 15;
      const wasCompletedToday = cur.completedToday;
      const newStreak = wasCompletedToday ? cur.streak : cur.streak + 1;

      const updatedUser: UserProfile = {
        ...cur,
        xp: updatedXp,
        diamonds: updatedGems,
        streak: newStreak,
        lastActiveDate: today,
        completedToday: true,
        completedLessons: updatedLessons,
      };

      return {
        ...prev,
        [activeId]: updatedUser,
      };
    });

    // Check couple streak
    setCoupleStats((prev) => {
      const otherCompleted = profiles[activeId === 'bryan' ? 'partner' : 'bryan'].completedToday;
      if (otherCompleted) {
        return {
          ...prev,
          sharedStreak: prev.sharedStreak + 1,
        };
      }
      return prev;
    });
  };

  const loseHeart = () => {
    setProfiles((prev) => {
      const cur = prev[activeId];
      if (cur.hearts <= 0) return prev;
      return {
        ...prev,
        [activeId]: {
          ...cur,
          hearts: Math.max(0, cur.hearts - 1),
        },
      };
    });
  };

  const refillHearts = (): boolean => {
    const cur = profiles[activeId];
    if (cur.diamonds < 100) return false;

    setProfiles((prev) => ({
      ...prev,
      [activeId]: {
        ...cur,
        hearts: cur.maxHearts,
        diamonds: cur.diamonds - 100,
      },
    }));
    return true;
  };

  const sendCoupleNudge = (message: string) => {
    setCoupleStats((prev) => ({
      ...prev,
      lastNudge: {
        from: activeUser.name,
        message,
        timestamp: Date.now(),
      },
    }));
  };

  const clearNudge = () => {
    setCoupleStats((prev) => ({
      ...prev,
      lastNudge: undefined,
    }));
  };

  const connectGoogleSimulated = (email: string, name: string) => {
    setProfiles((prev) => ({
      ...prev,
      [activeId]: {
        ...prev[activeId],
        googleEmail: email,
        googleName: name,
        name: name || prev[activeId].name,
      },
    }));
  };

  const logoutGoogle = () => {
    setProfiles((prev) => ({
      ...prev,
      [activeId]: {
        ...prev[activeId],
        googleEmail: undefined,
        googleName: undefined,
        googlePhoto: undefined,
      },
    }));
  };

  const resetAllData = () => {
    setProfiles({ bryan: INITIAL_BRYAN, partner: INITIAL_PARTNER });
    setCoupleStats(INITIAL_COUPLE);
    localStorage.removeItem('pacoca_profiles_v1');
    localStorage.removeItem('pacoca_couple_stats_v1');
  };

  return (
    <UserContext.Provider
      value={{
        activeUser,
        otherUser,
        activeId,
        switchUser,
        updateUserName,
        coupleStats,
        completeLesson,
        loseHeart,
        refillHearts,
        sendCoupleNudge,
        clearNudge,
        connectGoogleSimulated,
        logoutGoogle,
        resetAllData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
