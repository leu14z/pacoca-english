import { createClient } from '@supabase/supabase-js';
import type { AuthUserProfile } from './auth';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Trigger Google OAuth Login via Supabase
 */
export async function signInWithGoogle() {
  if (!supabase) {
    console.warn('Supabase not configured. Using local profile simulation.');
    return { error: new Error('Supabase URL/Key não configurados no arquivo .env') };
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + window.location.pathname,
    },
  });

  return { data, error };
}

/**
 * Sign out
 */
export async function signOutSupabase() {
  if (supabase) {
    await supabase.auth.signOut();
  }
}

/**
 * Upsert user profile to Supabase 'profiles' table
 */
export async function syncUserProfile(profile: AuthUserProfile) {
  if (!supabase) return;

  const validId =
    profile.id && profile.id.includes('-') && profile.id.length >= 32
      ? profile.id
      : crypto.randomUUID();

  try {
    const { error } = await supabase.from('profiles').upsert(
      {
        id: validId,
        full_name: profile.name,
        email: profile.email.toLowerCase().trim(),
        avatar_url: profile.avatar,
        level: profile.level || 'A1',
        total_xp: profile.xp ?? 0,
        hearts: profile.hearts ?? 5,
        streak_count: profile.streak ?? 0,
        last_activity_date: profile.lastActiveDate,
        placement_completed: profile.placementCompleted || false,
      },
      { onConflict: 'email' }
    );

    if (error) {
      console.warn('Supabase sync profile warning:', error.message);
    } else {
      console.log('Profile successfully synced to Supabase:', profile.email, 'XP:', profile.xp);
    }
  } catch (err) {
    console.warn('Supabase sync profile exception:', err);
  }
}

/**
 * Fetch profile by email from Supabase
 */
export async function fetchUserProfileByEmail(email: string): Promise<AuthUserProfile | null> {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle();

    if (error || !data) return null;

    return {
      id: data.id,
      name: data.full_name || 'Aluno',
      email: data.email,
      avatar: data.avatar_url || './mascot/mascoteoficial.png',
      xp: data.total_xp ?? 0,
      hearts: data.hearts ?? 5,
      maxHearts: 5,
      diamonds: 100,
      streak: data.streak_count ?? 0,
      lastActiveDate: data.last_activity_date || '',
      completedLessons: [],
      completedToday: false,
      level: data.level || 'A1',
      placementCompleted: data.placement_completed || false,
    };
  } catch (err) {
    console.warn('Supabase fetch profile error:', err);
    return null;
  }
}

/**
 * Save completed lesson progress to 'user_progress' table
 */
export async function saveMissionProgress(userId: string, lessonId: string, scorePercentage: number = 100) {
  if (!supabase) return;

  try {
    const { error } = await supabase.from('user_progress').upsert({
      user_id: userId,
      mission_id: lessonId,
      score_percentage: scorePercentage,
      completed_at: new Date().toISOString(),
    });

    if (error) console.warn('Supabase save progress error:', error.message);
  } catch (err) {
    console.warn('Supabase save progress exception:', err);
  }
}

/**
 * Fetch real-time leaderboard of real users from Supabase
 */
export async function fetchRealtimeLeaderboard(): Promise<AuthUserProfile[]> {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('total_xp', { ascending: false })
      .limit(50);

    if (error || !data) return [];

    return data
      .filter((row: any) => row.email && row.full_name)
      .map((row: any) => ({
        id: row.id,
        name: row.full_name,
        email: row.email,
        avatar: row.avatar_url || './mascot/mascoteoficial.png',
        xp: row.total_xp ?? 0,
        hearts: row.hearts ?? 5,
        maxHearts: 5,
        diamonds: 100,
        streak: row.streak_count ?? 0,
        lastActiveDate: row.last_activity_date || '',
        completedLessons: [],
        completedToday: false,
        level: row.level || 'A1',
        placementCompleted: row.placement_completed || false,
      }));
  } catch (err) {
    console.warn('Supabase leaderboard fetch error:', err);
    return [];
  }
}
