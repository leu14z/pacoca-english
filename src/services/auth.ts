// Google Authentication & User Registry Service

export interface AuthUserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  xp: number;
  hearts: number;
  maxHearts: number;
  diamonds: number;
  streak: number;
  lastActiveDate: string;
  completedLessons: string[];
  completedToday: boolean;
  coupleCode?: string;
  partnerCode?: string;
  level?: 'A1' | 'A2' | 'B1';
  placementCompleted?: boolean;
}

// Global registry of all real users on the platform
export const getRegisteredUsers = (): AuthUserProfile[] => {
  try {
    const saved = localStorage.getItem('pacoca_registered_users_v3');
    if (saved) return JSON.parse(saved);
  } catch {
    // fallback
  }
  return [];
};

export const saveRegisteredUser = (user: AuthUserProfile) => {
  try {
    const current = getRegisteredUsers();
    const existingIndex = current.findIndex((u) => u.id === user.id || u.email === user.email);
    if (existingIndex >= 0) {
      current[existingIndex] = user;
    } else {
      current.push(user);
    }
    localStorage.setItem('pacoca_registered_users_v3', JSON.stringify(current));
  } catch (err) {
    console.error('Error saving registered user:', err);
  }
};

// Decode Google JWT
export function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

// Load Google Identity Services SDK script
export const loadGoogleGsiScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if ((window as any).google?.accounts?.id) return resolve(true);

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
};
