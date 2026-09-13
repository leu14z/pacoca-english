// Firebase Authentication & Cloud Sync Service for Paçoca English
import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as fbSignOut,
} from 'firebase/auth';

// Default / fallback Firebase config (Can be configured in app or via VITE_ env variables)
const getSavedFirebaseConfig = () => {
  try {
    const saved = localStorage.getItem('pacoca_firebase_config');
    if (saved) return JSON.parse(saved);
  } catch {
    // ignore
  }
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  };
};

let app: any = null;
let auth: any = null;
const googleProvider = new GoogleAuthProvider();

export const isFirebaseConfigured = () => {
  const config = getSavedFirebaseConfig();
  return Boolean(config.apiKey && config.projectId);
};

export const initFirebase = () => {
  if (typeof window === 'undefined') return null;
  const config = getSavedFirebaseConfig();
  if (!config.apiKey) return null;

  if (!getApps().length) {
    app = initializeApp(config);
  } else {
    app = getApps()[0];
  }
  auth = getAuth(app);
  return auth;
};

export const saveFirebaseConfig = (config: any) => {
  localStorage.setItem('pacoca_firebase_config', JSON.stringify(config));
  initFirebase();
};

export const loginWithGooglePopup = async (): Promise<{
  uid: string;
  name: string;
  email: string;
  photoURL: string;
} | null> => {
  try {
    const currentAuth = auth || initFirebase();
    if (!currentAuth) {
      throw new Error('Firebase não configurado');
    }
    const result = await signInWithPopup(currentAuth, googleProvider);
    const user = result.user;
    return {
      uid: user.uid,
      name: user.displayName || 'Estudante',
      email: user.email || '',
      photoURL: user.photoURL || './mascot/mascoteoficial.png',
    };
  } catch (err) {
    console.warn('Google sign in popup failed or not configured, using fallback:', err);
    throw err;
  }
};

export const logoutFirebase = async () => {
  if (auth) {
    await fbSignOut(auth);
  }
};
