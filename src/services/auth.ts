export interface CoupleInvite {
  id: string;
  fromEmail: string;
  fromName: string;
  fromAvatar?: string;
  fromCode: string;
  toEmail: string;
  createdAt: number;
  status: 'pending' | 'accepted' | 'declined';
}

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
  incomingInvites?: CoupleInvite[];
  sentInvite?: CoupleInvite | null;
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

/**
 * Redirect browser directly to accounts.google.com OAuth 2.0 flow
 */
export function redirectToGoogleOAuth(clientId: string) {
  const redirectUri = window.location.origin + window.location.pathname;
  const scope = 'openid email profile';
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
    clientId
  )}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${encodeURIComponent(
    scope
  )}&prompt=select_account`;
  window.location.href = url;
}

/**
 * Check if the current URL hash contains an OAuth access token from accounts.google.com
 */
export async function checkGoogleOAuthCallback(): Promise<{
  email: string;
  name: string;
  avatar?: string;
} | null> {
  const hash = window.location.hash;
  if (!hash || !hash.includes('access_token')) return null;

  try {
    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get('access_token');
    if (!accessToken) return null;

    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (res.ok) {
      const data = await res.json();
      window.history.replaceState(null, '', window.location.pathname);
      return {
        email: data.email,
        name: data.name || data.given_name || data.email.split('@')[0],
        avatar: data.picture,
      };
    }
  } catch (err) {
    console.warn('Error fetching Google profile from access token:', err);
  }
  return null;
}
