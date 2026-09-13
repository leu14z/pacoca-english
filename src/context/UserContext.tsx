import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginWithGooglePopup, logoutFirebase, isFirebaseConfigured } from '../services/firebase';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  xp: number;
  hearts: number;
  maxHearts: number;
  diamonds: number;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  completedLessons: string[];
  completedToday: boolean;
  coupleCode: string;
  partnerCode?: string;
}

export interface PartnerData {
  name: string;
  email?: string;
  avatar: string;
  xp: number;
  streak: number;
  completedToday: boolean;
  coupleCode: string;
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
  currentUser: UserProfile | null;
  partner: PartnerData | null;
  isAuthenticated: boolean;
  coupleStats: CoupleStats;
  loginAsUser: (preset: 'leo' | 'partner') => void;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
  linkPartnerCode: (code: string) => boolean;
  completeLesson: (lessonId: string, xpGained: number) => void;
  loseHeart: () => void;
  refillHearts: () => boolean;
  sendCoupleNudge: (message: string) => void;
  clearNudge: () => void;
  updateUserName: (newName: string) => void;
  resetAllData: () => void;
}

const getTodayString = () => new Date().toISOString().split('T')[0];

const INITIAL_LEO: UserProfile = {
  id: 'user_leo',
  name: 'Leo',
  email: 'leo@exemplo.com',
  avatar: './mascot/mascoteoficial.png',
  xp: 140,
  hearts: 5,
  maxHearts: 5,
  diamonds: 320,
  streak: 5,
  lastActiveDate: getTodayString(),
  completedLessons: ['lesson-1-1'],
  completedToday: true,
  coupleCode: 'LEO-2026',
  partnerCode: 'AMOR-2026',
};

const INITIAL_PARTNER_PROFILE: UserProfile = {
  id: 'user_partner',
  name: 'Amor ❤️',
  email: 'amor@exemplo.com',
  avatar: './mascot/certinho.png',
  xp: 110,
  hearts: 5,
  maxHearts: 5,
  diamonds: 280,
  streak: 4,
  lastActiveDate: getTodayString(),
  completedLessons: ['lesson-1-1'],
  completedToday: false,
  coupleCode: 'AMOR-2026',
  partnerCode: 'LEO-2026',
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current logged-in user in this specific browser/phone
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('pacoca_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    // Default to Leo on first launch
    return INITIAL_LEO;
  });

  // Partner data (synced or linked)
  const [partner, setPartner] = useState<PartnerData | null>(() => {
    const saved = localStorage.getItem('pacoca_partner_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      name: 'Amor ❤️',
      avatar: './mascot/certinho.png',
      xp: 110,
      streak: 4,
      completedToday: false,
      coupleCode: 'AMOR-2026',
    };
  });

  const [coupleStats, setCoupleStats] = useState<CoupleStats>(() => {
    const saved = localStorage.getItem('pacoca_couple_stats_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return { sharedStreak: 4 };
  });

  // Save current user to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('pacoca_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('pacoca_current_user');
    }
  }, [currentUser]);

  // Save partner data to localStorage
  useEffect(() => {
    if (partner) {
      localStorage.setItem('pacoca_partner_data', JSON.stringify(partner));
    }
  }, [partner]);

  // Save couple stats to localStorage
  useEffect(() => {
    localStorage.setItem('pacoca_couple_stats_v2', JSON.stringify(coupleStats));
  }, [coupleStats]);

  const loginAsUser = (preset: 'leo' | 'partner') => {
    if (preset === 'leo') {
      setCurrentUser(INITIAL_LEO);
      setPartner({
        name: 'Amor ❤️',
        avatar: './mascot/certinho.png',
        xp: 110,
        streak: 4,
        completedToday: false,
        coupleCode: 'AMOR-2026',
      });
    } else {
      setCurrentUser(INITIAL_PARTNER_PROFILE);
      setPartner({
        name: 'Leo',
        avatar: './mascot/mascoteoficial.png',
        xp: 140,
        streak: 5,
        completedToday: true,
        coupleCode: 'LEO-2026',
      });
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      if (isFirebaseConfigured()) {
        const user = await loginWithGooglePopup();
        if (user) {
          const newUser: UserProfile = {
            id: user.uid,
            name: user.name,
            email: user.email,
            avatar: user.photoURL,
            xp: 0,
            hearts: 5,
            maxHearts: 5,
            diamonds: 100,
            streak: 1,
            lastActiveDate: getTodayString(),
            completedLessons: [],
            completedToday: false,
            coupleCode: `PAIR-${user.uid.slice(0, 4).toUpperCase()}`,
          };
          setCurrentUser(newUser);
          return true;
        }
      } else {
        // Simulated Google Login for Leo or Partner when Firebase isn't configured with keys yet
        setCurrentUser(INITIAL_LEO);
        return true;
      }
      return false;
    } catch (err) {
      console.warn('Google login failed, falling back to local Leo account:', err);
      setCurrentUser(INITIAL_LEO);
      return true;
    }
  };

  const logout = () => {
    logoutFirebase();
    setCurrentUser(null);
  };

  const linkPartnerCode = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) return false;

    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        partnerCode: cleanCode,
      });

      // Update partner display name
      const isPartnerAmor = cleanCode.includes('AMOR');
      setPartner({
        name: isPartnerAmor ? 'Amor ❤️' : `Par (${cleanCode})`,
        avatar: isPartnerAmor ? './mascot/certinho.png' : './mascot/orgulhoso.png',
        xp: 110,
        streak: 4,
        completedToday: true,
        coupleCode: cleanCode,
      });
      return true;
    }
    return false;
  };

  const completeLesson = (lessonId: string, xpGained: number) => {
    if (!currentUser) return;
    const today = getTodayString();
    const isNew = !currentUser.completedLessons.includes(lessonId);
    const updatedLessons = isNew ? [...currentUser.completedLessons, lessonId] : currentUser.completedLessons;
    const updatedXp = currentUser.xp + xpGained;
    const updatedGems = currentUser.diamonds + 15;
    const wasCompletedToday = currentUser.completedToday;
    const newStreak = wasCompletedToday ? currentUser.streak : currentUser.streak + 1;

    setCurrentUser({
      ...currentUser,
      xp: updatedXp,
      diamonds: updatedGems,
      streak: newStreak,
      lastActiveDate: today,
      completedToday: true,
      completedLessons: updatedLessons,
    });

    // Check couple streak
    if (partner?.completedToday) {
      setCoupleStats((prev) => ({
        ...prev,
        sharedStreak: prev.sharedStreak + 1,
      }));
    }
  };

  const loseHeart = () => {
    if (!currentUser || currentUser.hearts <= 0) return;
    setCurrentUser({
      ...currentUser,
      hearts: Math.max(0, currentUser.hearts - 1),
    });
  };

  const refillHearts = (): boolean => {
    if (!currentUser || currentUser.diamonds < 100) return false;
    setCurrentUser({
      ...currentUser,
      hearts: currentUser.maxHearts,
      diamonds: currentUser.diamonds - 100,
    });
    return true;
  };

  const sendCoupleNudge = (message: string) => {
    if (!currentUser) return;
    setCoupleStats((prev) => ({
      ...prev,
      lastNudge: {
        from: currentUser.name,
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

  const updateUserName = (newName: string) => {
    if (!currentUser || !newName.trim()) return;
    setCurrentUser({
      ...currentUser,
      name: newName.trim(),
    });
  };

  const resetAllData = () => {
    setCurrentUser(INITIAL_LEO);
    setPartner({
      name: 'Amor ❤️',
      avatar: './mascot/certinho.png',
      xp: 110,
      streak: 4,
      completedToday: false,
      coupleCode: 'AMOR-2026',
    });
    setCoupleStats({ sharedStreak: 4 });
    localStorage.removeItem('pacoca_current_user');
    localStorage.removeItem('pacoca_partner_data');
    localStorage.removeItem('pacoca_couple_stats_v2');
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        partner,
        isAuthenticated: Boolean(currentUser),
        coupleStats,
        loginAsUser,
        loginWithGoogle,
        logout,
        linkPartnerCode,
        completeLesson,
        loseHeart,
        refillHearts,
        sendCoupleNudge,
        clearNudge,
        updateUserName,
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
