import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthUserProfile } from '../services/auth';
import { getRegisteredUsers, saveRegisteredUser } from '../services/auth';

export interface CoupleStats {
  sharedStreak: number;
  lastNudge?: {
    from: string;
    message: string;
    timestamp: number;
  };
}

interface UserContextType {
  currentUser: AuthUserProfile | null;
  allLearners: AuthUserProfile[];
  partner: AuthUserProfile | null;
  isAuthenticated: boolean;
  coupleStats: CoupleStats;
  loginUser: (email: string, name: string, avatar?: string) => void;
  logout: () => void;
  linkPartnerCode: (code: string) => boolean;
  completeLesson: (lessonId: string, xpGained: number) => void;
  loseHeart: () => void;
  refillHearts: () => boolean;
  sendCoupleNudge: (message: string) => void;
  clearNudge: () => void;
  updateUserName: (newName: string) => void;
  setPlacementLevel: (level: 'A1' | 'A2' | 'B1') => void;
  resetAllData: () => void;
}

const getTodayString = () => new Date().toISOString().split('T')[0];

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current logged in user (null by default on fresh visit)
  const [currentUser, setCurrentUser] = useState<AuthUserProfile | null>(() => {
    const saved = localStorage.getItem('pacoca_current_user_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return null;
  });

  // Global list of real registered users (starts empty, only real users added)
  const [allLearners, setAllLearners] = useState<AuthUserProfile[]>(() => {
    return getRegisteredUsers();
  });

  const [coupleStats, setCoupleStats] = useState<CoupleStats>(() => {
    const saved = localStorage.getItem('pacoca_couple_stats_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return { sharedStreak: 0 };
  });

  // Sync currentUser to localStorage and to global registry
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('pacoca_current_user_v3', JSON.stringify(currentUser));
      saveRegisteredUser(currentUser);
      setAllLearners(getRegisteredUsers());
    } else {
      localStorage.removeItem('pacoca_current_user_v3');
    }
  }, [currentUser]);

  // Sync couple stats to localStorage
  useEffect(() => {
    localStorage.setItem('pacoca_couple_stats_v3', JSON.stringify(coupleStats));
  }, [coupleStats]);

  // Find linked partner from real registered users
  const partner = React.useMemo(() => {
    if (!currentUser?.partnerCode) return null;
    return (
      allLearners.find(
        (u) =>
          u.id !== currentUser.id &&
          u.coupleCode?.toUpperCase() === currentUser.partnerCode?.toUpperCase()
      ) || null
    );
  }, [currentUser, allLearners]);

  // Login or Register a user with complete fresh zero stats
  const loginUser = (email: string, name: string, avatar?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim() || cleanEmail.split('@')[0];
    const registered = getRegisteredUsers();
    const existing = registered.find((u) => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      // Existing user: preserve their real progress
      setCurrentUser(existing);
    } else {
      // New user: START COMPLETELY ZEROED!
      const randomCode = `PACOCA-${Math.floor(1000 + Math.random() * 9000)}`;
      const newUser: AuthUserProfile = {
        id: `user_${Date.now()}`,
        name: cleanName,
        email: cleanEmail,
        avatar: avatar || './mascot/mascoteoficial.png',
        xp: 0,                   // ZERO XP
        hearts: 5,               // 5 Hearts
        maxHearts: 5,
        diamonds: 0,             // ZERO Gems
        streak: 0,               // ZERO Streak
        lastActiveDate: getTodayString(),
        completedLessons: [],    // ZERO completed lessons
        completedToday: false,   // ZERO daily progress
        coupleCode: randomCode,
      };
      saveRegisteredUser(newUser);
      setCurrentUser(newUser);
      setAllLearners(getRegisteredUsers());
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const linkPartnerCode = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode || !currentUser) return false;

    const updatedUser = {
      ...currentUser,
      partnerCode: cleanCode,
    };
    setCurrentUser(updatedUser);
    saveRegisteredUser(updatedUser);
    return true;
  };

  const completeLesson = (lessonId: string, xpGained: number) => {
    if (!currentUser) return;
    const today = getTodayString();
    const isNew = !currentUser.completedLessons.includes(lessonId);
    const updatedLessons = isNew ? [...currentUser.completedLessons, lessonId] : currentUser.completedLessons;
    const updatedXp = currentUser.xp + xpGained;
    const updatedGems = currentUser.diamonds + 15;
    const wasCompletedToday = currentUser.completedToday;
    const newStreak = wasCompletedToday ? currentUser.streak : (currentUser.streak === 0 ? 1 : currentUser.streak + 1);

    const updated: AuthUserProfile = {
      ...currentUser,
      xp: updatedXp,
      diamonds: updatedGems,
      streak: newStreak,
      lastActiveDate: today,
      completedToday: true,
      completedLessons: updatedLessons,
    };

    setCurrentUser(updated);
    saveRegisteredUser(updated);

    // Update couple streak if partner is linked and completed today
    if (partner?.completedToday) {
      setCoupleStats((prev) => ({
        ...prev,
        sharedStreak: prev.sharedStreak + 1,
      }));
    }
  };

  const loseHeart = () => {
    if (!currentUser || currentUser.hearts <= 0) return;
    const updated: AuthUserProfile = {
      ...currentUser,
      hearts: Math.max(0, currentUser.hearts - 1),
    };
    setCurrentUser(updated);
    saveRegisteredUser(updated);
  };

  const refillHearts = (): boolean => {
    if (!currentUser || currentUser.diamonds < 100) return false;
    const updated: AuthUserProfile = {
      ...currentUser,
      hearts: currentUser.maxHearts,
      diamonds: currentUser.diamonds - 100,
    };
    setCurrentUser(updated);
    saveRegisteredUser(updated);
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
    const updated: AuthUserProfile = {
      ...currentUser,
      name: newName.trim(),
    };
    setCurrentUser(updated);
    saveRegisteredUser(updated);
  };

  const setPlacementLevel = (level: 'A1' | 'A2' | 'B1') => {
    if (!currentUser) return;
    const updated: AuthUserProfile = {
      ...currentUser,
      level,
      placementCompleted: true,
    };
    setCurrentUser(updated);
    saveRegisteredUser(updated);
    localStorage.setItem('pacoca_current_user_v3', JSON.stringify(updated));
  };

  const resetAllData = () => {
    localStorage.removeItem('pacoca_current_user_v3');
    localStorage.removeItem('pacoca_registered_users_v3');
    localStorage.removeItem('pacoca_couple_stats_v3');
    setCurrentUser(null);
    setAllLearners([]);
    setCoupleStats({ sharedStreak: 0 });
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        allLearners,
        partner,
        isAuthenticated: Boolean(currentUser),
        coupleStats,
        loginUser,
        logout,
        linkPartnerCode,
        completeLesson,
        loseHeart,
        refillHearts,
        sendCoupleNudge,
        clearNudge,
        updateUserName,
        setPlacementLevel,
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
