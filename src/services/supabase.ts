import { createClient } from '@supabase/supabase-js';
import type { AuthUserProfile, CoupleInvite } from './auth';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface UserMetadata {
  partnerCode?: string;
  incomingInvites?: CoupleInvite[];
  sentInvite?: CoupleInvite | null;
}

export function serializeAvatarWithMeta(avatar: string, meta?: UserMetadata): string {
  const clean = (avatar || './mascot/mascoteoficial.png').split('#meta=')[0];
  if (!meta || (!meta.partnerCode && (!meta.incomingInvites || meta.incomingInvites.length === 0) && !meta.sentInvite)) {
    return clean;
  }
  return `${clean}#meta=${encodeURIComponent(JSON.stringify(meta))}`;
}

export function parseAvatarWithMeta(rawAvatar: string): { avatar: string; meta: UserMetadata } {
  if (!rawAvatar) return { avatar: './mascot/mascoteoficial.png', meta: {} };
  const [avatar, hash] = rawAvatar.split('#meta=');
  let meta: UserMetadata = {};
  if (hash) {
    try {
      meta = JSON.parse(decodeURIComponent(hash));
    } catch {
      // fallback
    }
  }
  return { avatar: avatar || './mascot/mascoteoficial.png', meta };
}

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

  let partnerCode = profile.partnerCode;
  let incomingInvites = profile.incomingInvites || [];
  let sentInvite = profile.sentInvite;

  // Safeguard: Check if remote has existing invites or partner so local sync does not overwrite them
  try {
    const { data: existingRow } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('email', profile.email.toLowerCase().trim())
      .maybeSingle();

    if (existingRow?.avatar_url) {
      const { meta } = parseAvatarWithMeta(existingRow.avatar_url);
      if (incomingInvites.length === 0 && meta.incomingInvites && meta.incomingInvites.length > 0) {
        incomingInvites = meta.incomingInvites;
      }
      if (!partnerCode && meta.partnerCode) {
        partnerCode = meta.partnerCode;
      }
      if (sentInvite === undefined && meta.sentInvite) {
        sentInvite = meta.sentInvite;
      }
    }
  } catch (err) {
    console.warn('Could not read existing remote metadata:', err);
  }

  const serializedAvatar = serializeAvatarWithMeta(profile.avatar, {
    partnerCode,
    incomingInvites,
    sentInvite,
  });

  try {
    const { error } = await supabase.from('profiles').upsert(
      {
        id: validId,
        full_name: profile.name,
        email: profile.email.toLowerCase().trim(),
        avatar_url: serializedAvatar,
        level: profile.level || 'A1',
        total_xp: profile.xp ?? 0,
        hearts: Math.min(5, Math.max(0, profile.hearts ?? 5)), // Satisfies Postgres constraint <= 5
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

    const today = new Date().toISOString().split('T')[0];
    const cleanIdPart = (data.id || '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase();
    const { avatar, meta } = parseAvatarWithMeta(data.avatar_url);

    return {
      id: data.id,
      name: data.full_name || 'Aluno',
      email: data.email,
      avatar,
      xp: data.total_xp ?? 0,
      hearts: 10,
      maxHearts: 10,
      diamonds: 100,
      streak: data.streak_count ?? 0,
      lastActiveDate: data.last_activity_date || '',
      completedLessons: [],
      completedToday: data.last_activity_date === today,
      level: data.level || 'A1',
      placementCompleted: data.placement_completed || false,
      coupleCode: `PACOCA-${cleanIdPart || '7777'}`,
      partnerCode: meta.partnerCode,
      incomingInvites: meta.incomingInvites || [],
      sentInvite: meta.sentInvite || null,
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

    const today = new Date().toISOString().split('T')[0];

    return data
      .filter((row: any) => row.email && row.full_name)
      .map((row: any) => {
        const cleanIdPart = (row.id || '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase();
        const { avatar, meta } = parseAvatarWithMeta(row.avatar_url);
        return {
          id: row.id,
          name: row.full_name,
          email: row.email,
          avatar,
          xp: row.total_xp ?? 0,
          hearts: 10,
          maxHearts: 10,
          diamonds: 100,
          streak: row.streak_count ?? 0,
          lastActiveDate: row.last_activity_date || '',
          completedLessons: [],
          completedToday: row.last_activity_date === today,
          level: row.level || 'A1',
          placementCompleted: row.placement_completed || false,
          coupleCode: `PACOCA-${cleanIdPart || '7777'}`,
          partnerCode: meta.partnerCode,
          incomingInvites: meta.incomingInvites || [],
          sentInvite: meta.sentInvite || null,
        };
      });
  } catch (err) {
    console.warn('Supabase leaderboard fetch error:', err);
    return [];
  }
}

/**
 * Send/Deliver an invite to target user in Supabase
 */
export async function sendCoupleInviteToSupabase(targetEmail: string, invite: CoupleInvite): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('email', targetEmail.toLowerCase().trim())
      .maybeSingle();

    if (error || !data) return false;

    const { avatar, meta } = parseAvatarWithMeta(data.avatar_url);
    const existingInvites = (meta.incomingInvites || []).filter(
      (inv) => inv.fromEmail.toLowerCase() !== invite.fromEmail.toLowerCase()
    );
    existingInvites.unshift(invite);

    const updatedMeta: UserMetadata = {
      ...meta,
      incomingInvites: existingInvites,
    };

    const newAvatar = serializeAvatarWithMeta(avatar, updatedMeta);
    const { error: updateErr } = await supabase
      .from('profiles')
      .update({ avatar_url: newAvatar })
      .eq('email', targetEmail.toLowerCase().trim());

    return !updateErr;
  } catch (err) {
    console.warn('Error sending couple invite to Supabase:', err);
    return false;
  }
}

/**
 * Accept invite in Supabase for BOTH users simultaneously
 */
export async function acceptCoupleInviteInSupabase(
  acceptorEmail: string,
  acceptorCode: string,
  senderEmail: string,
  senderCode: string
): Promise<boolean> {
  if (!supabase) return false;

  try {
    // 1. Update Sender (Leo): link to Acceptor (Yasmin) and clear sent invite
    const { data: senderData } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('email', senderEmail.toLowerCase().trim())
      .maybeSingle();

    if (senderData) {
      const { avatar: senderAvatar, meta: senderMeta } = parseAvatarWithMeta(senderData.avatar_url);
      const updatedSenderMeta: UserMetadata = {
        ...senderMeta,
        partnerCode: acceptorCode || acceptorEmail,
        sentInvite: null,
      };
      await supabase
        .from('profiles')
        .update({ avatar_url: serializeAvatarWithMeta(senderAvatar, updatedSenderMeta) })
        .eq('email', senderEmail.toLowerCase().trim());
    }

    // 2. Update Acceptor (Yasmin): link to Sender (Leo) and remove from incoming
    const { data: acceptorData } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('email', acceptorEmail.toLowerCase().trim())
      .maybeSingle();

    if (acceptorData) {
      const { avatar: acceptorAvatar, meta: acceptorMeta } = parseAvatarWithMeta(acceptorData.avatar_url);
      const remainingInvites = (acceptorMeta.incomingInvites || []).filter(
        (inv) => inv.fromEmail.toLowerCase() !== senderEmail.toLowerCase()
      );
      const updatedAcceptorMeta: UserMetadata = {
        ...acceptorMeta,
        partnerCode: senderCode || senderEmail,
        incomingInvites: remainingInvites,
      };
      await supabase
        .from('profiles')
        .update({ avatar_url: serializeAvatarWithMeta(acceptorAvatar, updatedAcceptorMeta) })
        .eq('email', acceptorEmail.toLowerCase().trim());
    }

    return true;
  } catch (err) {
    console.warn('Error accepting couple invite in Supabase:', err);
    return false;
  }
}

/**
 * Remove or decline an invite in Supabase
 */
export async function removeCoupleInviteInSupabase(userEmail: string, inviteId: string): Promise<void> {
  if (!supabase) return;
  try {
    const { data } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('email', userEmail.toLowerCase().trim())
      .maybeSingle();

    if (data) {
      const { avatar, meta } = parseAvatarWithMeta(data.avatar_url);
      const filtered = (meta.incomingInvites || []).filter((inv) => inv.id !== inviteId);
      const updatedMeta: UserMetadata = { ...meta, incomingInvites: filtered };
      await supabase
        .from('profiles')
        .update({ avatar_url: serializeAvatarWithMeta(avatar, updatedMeta) })
        .eq('email', userEmail.toLowerCase().trim());
    }
  } catch (err) {
    console.warn('Error removing invite in Supabase:', err);
  }
}

/**
 * Clear partner link in Supabase for both users if needed
 */
export async function clearCouplePartnerInSupabase(userEmail: string, partnerEmailOrCode?: string): Promise<void> {
  if (!supabase) return;
  try {
    // 1. Clear this user
    const { data } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('email', userEmail.toLowerCase().trim())
      .maybeSingle();

    if (data) {
      const { avatar, meta } = parseAvatarWithMeta(data.avatar_url);
      const updatedMeta: UserMetadata = { ...meta, partnerCode: undefined };
      await supabase
        .from('profiles')
        .update({ avatar_url: serializeAvatarWithMeta(avatar, updatedMeta) })
        .eq('email', userEmail.toLowerCase().trim());
    }

    // 2. If partner email is provided, clear partner as well
    if (partnerEmailOrCode && partnerEmailOrCode.includes('@')) {
      const { data: partnerData } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('email', partnerEmailOrCode.toLowerCase().trim())
        .maybeSingle();

      if (partnerData) {
        const { avatar: partnerAvatar, meta: partnerMeta } = parseAvatarWithMeta(partnerData.avatar_url);
        const updatedPartnerMeta: UserMetadata = { ...partnerMeta, partnerCode: undefined };
        await supabase
          .from('profiles')
          .update({ avatar_url: serializeAvatarWithMeta(partnerAvatar, updatedPartnerMeta) })
          .eq('email', partnerEmailOrCode.toLowerCase().trim());
      }
    }
  } catch (err) {
    console.warn('Error clearing partner in Supabase:', err);
  }
}

