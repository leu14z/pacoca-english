import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthUserProfile, CoupleInvite } from '../services/auth';
import { getRegisteredUsers, saveRegisteredUser } from '../services/auth';
import {
  supabase,
  syncUserProfile,
  signOutSupabase,
  fetchRealtimeLeaderboard,
  fetchUserProfileByEmail,
  sendCoupleInviteToSupabase,
  acceptCoupleInviteInSupabase,
  removeCoupleInviteInSupabase,
  clearCouplePartnerInSupabase,
} from '../services/supabase';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

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
  incomingInvites: CoupleInvite[];
  sentInvite: CoupleInvite | null;
  loginUser: (email: string, name: string, avatar?: string, id?: string) => void;
  logout: () => void;
  linkPartnerCode: (codeOrEmail: string) => Promise<{ success: boolean; message: string }>;
  sendCoupleInvite: (codeOrEmail: string) => Promise<{ success: boolean; message: string }>;
  acceptCoupleInvite: (invite: CoupleInvite) => Promise<{ success: boolean; message: string }>;
  declineCoupleInvite: (inviteId: string) => Promise<void>;
  cancelSentInvite: () => Promise<void>;
  unlinkPartner: () => void;
  completeLesson: (lessonId: string, xpGained: number) => void;
  loseHeart: () => void;
  refillHearts: () => boolean;
  addDiamonds: (amount: number) => void;
  sendCoupleNudge: (message: string) => void;
  clearNudge: () => void;
  updateUserName: (newName: string) => void;
  updateUserAvatar: (newAvatar: string) => void;
  setPlacementLevel: (level: 'A1' | 'A2' | 'B1') => void;
  refreshLeaderboard: () => Promise<void>;
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
        const parsed = JSON.parse(saved);
        if (parsed) {
          if (!parsed.maxHearts || parsed.maxHearts < 10) {
            parsed.maxHearts = 10;
            parsed.hearts = 10;
          }
          const today = getTodayString();
          if (parsed.lastActiveDate !== today && parsed.hearts < 10) {
            parsed.hearts = 10;
          }
          if (typeof parsed.id === 'string' && (!parsed.id.includes('-') || parsed.id.length < 32)) {
            parsed.id = crypto.randomUUID();
          }
          if (parsed?.id) {
            const cleanIdPart = parsed.id.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase();
            parsed.coupleCode = `PACOCA-${cleanIdPart || '7777'}`;
          }
        }
        localStorage.setItem('pacoca_current_user_v3', JSON.stringify(parsed));
        return parsed;
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

  // Refresh leaderboard from Supabase real database
  const refreshLeaderboard = async () => {
    if (!supabase) return;
    try {
      const remoteUsers = await fetchRealtimeLeaderboard();
      if (remoteUsers && remoteUsers.length > 0) {
        setAllLearners((_prev) => {
          // Merge remote users with current local user if local user has higher/newer XP
          const currentEmail = currentUser?.email.toLowerCase();
          const currentId = currentUser?.id;

          const updated = remoteUsers.map((remote) => {
            if (currentUser && (remote.id === currentId || remote.email.toLowerCase() === currentEmail)) {
              return {
                ...remote,
                ...currentUser,
                xp: Math.max(remote.xp, currentUser.xp),
              };
            }
            return remote;
          });

          // If currentUser is not in remoteUsers list yet, include them
          if (currentUser && !updated.some((u) => u.id === currentId || u.email.toLowerCase() === currentEmail)) {
            updated.push(currentUser);
          }

          return updated;
        });
      }
    } catch (err) {
      console.warn('Erro ao atualizar ranking em tempo real:', err);
    }
  };

  // Sync currentUser to localStorage and to global registry
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('pacoca_current_user_v3', JSON.stringify(currentUser));
      saveRegisteredUser(currentUser);
      setAllLearners((prev) => {
        const copy = [...prev];
        const idx = copy.findIndex(
          (u) =>
            u.id === currentUser.id ||
            u.email.toLowerCase() === currentUser.email.toLowerCase()
        );
        if (idx >= 0) {
          copy[idx] = { ...copy[idx], ...currentUser };
          return copy;
        } else {
          return [currentUser, ...copy];
        }
      });
      syncUserProfile(currentUser);
    } else {
      localStorage.removeItem('pacoca_current_user_v3');
    }
  }, [currentUser]);

  // Live Supabase Realtime subscription for ranking updates
  useEffect(() => {
    refreshLeaderboard();
    if (!supabase) return;

    const currentSupabase = supabase;
    const channel = currentSupabase
      .channel('public:profiles:realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
        },
        (payload) => {
          console.log('[Realtime] Mudança nos perfis detectada:', payload);
          refreshLeaderboard();
        }
      )
      .subscribe((status) => {
        console.log('[Realtime] Status da conexão de ranking:', status);
      });

    // Polling de segurança a cada 15 segundos caso a conexão do celular oscile
    const interval = setInterval(() => {
      refreshLeaderboard();
    }, 15000);

    return () => {
      currentSupabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [currentUser?.id]);

  // Sync couple stats to localStorage
  useEffect(() => {
    localStorage.setItem('pacoca_couple_stats_v3', JSON.stringify(coupleStats));
  }, [coupleStats]);

  // Find linked partner from real registered users
  const partner = React.useMemo(() => {
    if (!currentUser?.partnerCode) return null;
    const target = currentUser.partnerCode.trim().toLowerCase();
    return (
      allLearners.find((u) => {
        if (u.id === currentUser.id || u.email.toLowerCase() === currentUser.email.toLowerCase()) return false;
        if (u.id.toLowerCase() === target) return true;
        const uCode = (u.coupleCode || `PACOCA-${u.id.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase()}`).toLowerCase();
        if (uCode === target || uCode.replace('pacoca-', '') === target.replace('pacoca-', '')) return true;
        if (u.email.toLowerCase() === target) return true;
        return false;
      }) || null
    );
  }, [currentUser?.partnerCode, currentUser?.id, currentUser?.email, allLearners]);

  // If partner is configured but not yet in allLearners, fetch directly from Supabase
  useEffect(() => {
    if (!currentUser?.partnerCode || partner || !supabase) return;
    const target = currentUser.partnerCode.trim().toLowerCase();

    (async () => {
      try {
        let remote: AuthUserProfile | null = null;
        if (target.includes('@')) {
          remote = await fetchUserProfileByEmail(target);
        } else {
          const prefix = target.replace('pacoca-', '').replace(/[^a-z0-9]/g, '');
          if (prefix.length >= 3) {
            const { data } = await supabase
              .from('profiles')
              .select('*')
              .ilike('id', `${prefix}%`)
              .maybeSingle();

            if (data) {
              const today = getTodayString();
              const cleanIdPart = (data.id || '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase();
              remote = {
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
                completedToday: data.last_activity_date === today,
                level: data.level || 'A1',
                placementCompleted: data.placement_completed || false,
                coupleCode: `PACOCA-${cleanIdPart || '7777'}`,
              };
            }
          }
        }

        if (remote && remote.email.toLowerCase() !== currentUser.email.toLowerCase()) {
          setAllLearners((prev) => [remote!, ...prev.filter((p) => p.id !== remote!.id)]);
        }
      } catch (err) {
        console.warn('Erro ao restaurar perfil do parceiro:', err);
      }
    })();
  }, [currentUser?.partnerCode, partner, currentUser?.email]);

  // Login or Register a user (preserves stats across devices if found in Supabase)
  const loginUser = async (email: string, name: string, avatar?: string, id?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim() || cleanEmail.split('@')[0];
    const registered = getRegisteredUsers();
    let existing = registered.find((u) => u.email.toLowerCase() === cleanEmail);

    // If not found in localStorage, fetch from Supabase to preserve cross-device stats
    if (!existing && supabase) {
      try {
        const remoteProfile = await fetchUserProfileByEmail(cleanEmail);
        if (remoteProfile) {
          const cleanIdPart = (remoteProfile.id || '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase();
          existing = {
            ...remoteProfile,
            coupleCode: `PACOCA-${cleanIdPart || '7777'}`,
          };
        }
      } catch (err) {
        console.warn('Erro ao restaurar perfil do Supabase:', err);
      }
    }

    // Ensure valid UUID for Postgres profiles table
    const safeId =
      id ||
      (existing?.id && existing.id.includes('-') ? existing.id : crypto.randomUUID());

    const cleanIdPart = safeId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase();
    const deterministicCode = `PACOCA-${cleanIdPart || '7777'}`;

    if (existing) {
      if (!existing.maxHearts || existing.maxHearts < 10) {
        existing.maxHearts = 10;
        existing.hearts = 10;
      }
      // Existing user: preserve their real progress and ensure valid UUID id
      const updatedExisting: AuthUserProfile = {
        ...existing,
        id: id || safeId,
        avatar: avatar || existing.avatar,
        coupleCode: existing.coupleCode || deterministicCode,
      };
      saveRegisteredUser(updatedExisting);
      setCurrentUser(updatedExisting);
    } else {
      // New user: START COMPLETELY ZEROED!
      const newUser: AuthUserProfile = {
        id: safeId,
        name: cleanName,
        email: cleanEmail,
        avatar: avatar || './mascot/mascoteoficial.png',
        xp: 0,                   // ZERO XP
        hearts: 10,              // 10 Hearts
        maxHearts: 10,
        diamonds: 0,             // ZERO Gems
        streak: 0,               // ZERO Streak
        lastActiveDate: getTodayString(),
        completedLessons: [],    // ZERO completed lessons
        completedToday: false,   // ZERO daily progress
        coupleCode: deterministicCode,
      };
      saveRegisteredUser(newUser);
      setCurrentUser(newUser);
    }

    refreshLeaderboard();
  };

  // Listen for live Supabase Google OAuth session
  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const email = session.user.email || '';
        const name =
          session.user.user_metadata?.full_name ||
          session.user.user_metadata?.name ||
          email.split('@')[0];
        const avatar =
          session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture;
        loginUser(email, name, avatar, session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const email = session.user.email || '';
        const name =
          session.user.user_metadata?.full_name ||
          session.user.user_metadata?.name ||
          email.split('@')[0];
        const avatar =
          session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture;
        loginUser(email, name, avatar, session.user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const logout = () => {
    signOutSupabase();
    setCurrentUser(null);
  };

  const sendCoupleInvite = async (codeOrEmail: string): Promise<{ success: boolean; message: string }> => {
    const clean = codeOrEmail.trim().toLowerCase();
    if (!clean || !currentUser) {
      return { success: false, message: 'Digite um código ou e-mail válido.' };
    }

    if (clean === currentUser.email.toLowerCase() || clean === currentUser.coupleCode?.toLowerCase()) {
      return { success: false, message: 'Você não pode enviar um convite para você mesmo!' };
    }

    // 1. Check if target user already sent us an invite -> auto accept!
    const existingIncoming = (currentUser.incomingInvites || []).find((inv) => {
      const fromC = (inv.fromCode || '').toLowerCase();
      return (
        inv.fromEmail.toLowerCase() === clean ||
        fromC === clean ||
        fromC.replace('pacoca-', '') === clean.replace('pacoca-', '')
      );
    });
    if (existingIncoming) {
      return await acceptCoupleInvite(existingIncoming);
    }

    // 2. Find target in allLearners or Supabase
    let target = allLearners.find((u) => {
      if (u.id === currentUser.id || u.email.toLowerCase() === currentUser.email.toLowerCase()) return false;
      const uCode = (u.coupleCode || `PACOCA-${u.id.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase()}`).toLowerCase();
      if (uCode === clean || uCode.replace('pacoca-', '') === clean.replace('pacoca-', '')) return true;
      if (u.email.toLowerCase() === clean) return true;
      return false;
    });

    if (!target && supabase) {
      try {
        if (clean.includes('@')) {
          const remote = await fetchUserProfileByEmail(clean);
          if (remote && remote.email.toLowerCase() !== currentUser.email.toLowerCase()) {
            target = remote;
            setAllLearners((prev) => [remote, ...prev.filter((p) => p.id !== remote.id)]);
          }
        } else {
          const prefix = clean.replace('pacoca-', '').replace(/[^a-z0-9]/g, '');
          if (prefix.length >= 3) {
            const { data } = await supabase
              .from('profiles')
              .select('*')
              .ilike('id', `${prefix}%`)
              .maybeSingle();

            if (data && data.email.toLowerCase() !== currentUser.email.toLowerCase()) {
              const today = getTodayString();
              const cleanIdPart = (data.id || '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase();
              target = {
                id: data.id,
                name: data.full_name || 'Aluno',
                email: data.email,
                avatar: data.avatar_url || './mascot/mascoteoficial.png',
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
              };
              setAllLearners((prev) => [target!, ...prev.filter((p) => p.id !== target!.id)]);
            }
          }
        }
      } catch (err) {
        console.warn('Erro ao buscar parceiro no Supabase:', err);
      }
    }

    if (!target) {
      return {
        success: false,
        message: 'Nenhum aluno encontrado com este código ou e-mail. Peça para seu amor entrar no app pelo menos uma vez!',
      };
    }

    const newInvite: CoupleInvite = {
      id: `inv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      fromEmail: currentUser.email,
      fromName: currentUser.name,
      fromAvatar: currentUser.avatar,
      fromCode: currentUser.coupleCode || '',
      toEmail: target.email,
      createdAt: Date.now(),
      status: 'pending',
    };

    // Save invite to target in Supabase
    await sendCoupleInviteToSupabase(target.email, newInvite);

    // Save sent invite locally
    const updated = {
      ...currentUser,
      sentInvite: newInvite,
    };
    setCurrentUser(updated);
    saveRegisteredUser(updated);

    // Broadcast Realtime notification
    if (supabase) {
      const channel = supabase.channel('pacoca_couple_invites');
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          channel.send({
            type: 'broadcast',
            event: 'invite_sent',
            payload: newInvite,
          });
        }
      });
    }

    sound.playSuccess();
    return {
      success: true,
      message: `Convite de casal enviado com sucesso para ${target.name}! Ele(a) verá o convite no Correio para aceitar.`,
    };
  };

  const acceptCoupleInvite = async (invite: CoupleInvite): Promise<{ success: boolean; message: string }> => {
    if (!currentUser) return { success: false, message: 'Usuário não autenticado.' };

    const remaining = (currentUser.incomingInvites || []).filter((inv) => inv.id !== invite.id);
    const updatedUser = {
      ...currentUser,
      partnerCode: invite.fromCode || invite.fromEmail,
      incomingInvites: remaining,
    };
    setCurrentUser(updatedUser);
    saveRegisteredUser(updatedUser);

    // 2-way sync: update both users in Supabase so BOTH are linked!
    await acceptCoupleInviteInSupabase(
      currentUser.email,
      currentUser.coupleCode || '',
      invite.fromEmail,
      invite.fromCode
    );

    // Broadcast to the sender that the invite was accepted in real time
    if (supabase) {
      const channel = supabase.channel('pacoca_couple_invites');
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          channel.send({
            type: 'broadcast',
            event: 'invite_accepted',
            payload: {
              fromEmail: currentUser.email,
              fromName: currentUser.name,
              fromCode: currentUser.coupleCode,
              fromAvatar: currentUser.avatar,
              toEmail: invite.fromEmail,
            },
          });
        }
      });
    }

    sound.playVictory();
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 },
    });

    refreshLeaderboard();
    return {
      success: true,
      message: `Convite aceito! Você e ${invite.fromName} agora são parceiros e estão sincronizados!`,
    };
  };

  const declineCoupleInvite = async (inviteId: string) => {
    if (!currentUser) return;
    const inv = (currentUser.incomingInvites || []).find((i) => i.id === inviteId);
    const remaining = (currentUser.incomingInvites || []).filter((i) => i.id !== inviteId);
    const updatedUser = {
      ...currentUser,
      incomingInvites: remaining,
    };
    setCurrentUser(updatedUser);
    saveRegisteredUser(updatedUser);
    await removeCoupleInviteInSupabase(currentUser.email, inviteId);

    if (inv && supabase) {
      const channel = supabase.channel('pacoca_couple_invites');
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          channel.send({
            type: 'broadcast',
            event: 'invite_declined',
            payload: {
              toEmail: inv.fromEmail,
              fromEmail: currentUser.email,
            },
          });
        }
      });
    }
  };

  const cancelSentInvite = async () => {
    if (!currentUser || !currentUser.sentInvite) return;
    const targetEmail = currentUser.sentInvite.toEmail;
    const inviteId = currentUser.sentInvite.id;
    const updatedUser = {
      ...currentUser,
      sentInvite: null,
    };
    setCurrentUser(updatedUser);
    saveRegisteredUser(updatedUser);
    await removeCoupleInviteInSupabase(targetEmail, inviteId);
  };

  const linkPartnerCode = async (codeOrEmail: string): Promise<{ success: boolean; message: string }> => {
    return await sendCoupleInvite(codeOrEmail);
  };

  const unlinkPartner = async () => {
    if (!currentUser) return;
    const oldPartner = currentUser.partnerCode;
    const updatedUser = {
      ...currentUser,
      partnerCode: undefined,
    };
    setCurrentUser(updatedUser);
    saveRegisteredUser(updatedUser);
    await clearCouplePartnerInSupabase(currentUser.email, oldPartner);

    if (supabase) {
      const channel = supabase.channel('pacoca_couple_invites');
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          channel.send({
            type: 'broadcast',
            event: 'partner_unlinked',
            payload: {
              toEmail: partner?.email || oldPartner,
              fromEmail: currentUser.email,
            },
          });
        }
      });
    }
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

  const addDiamonds = (amount: number) => {
    if (!currentUser || amount <= 0) return;
    const updated: AuthUserProfile = {
      ...currentUser,
      diamonds: (currentUser.diamonds || 0) + amount,
    };
    setCurrentUser(updated);
    saveRegisteredUser(updated);
  };

  // Real-time listener for romantic love nudges across devices
  useEffect(() => {
    if (!supabase || !currentUser) return;
    const currentSupabase = supabase;
    const myCode = (currentUser.coupleCode || '').toLowerCase();
    const myEmail = currentUser.email.toLowerCase();

    const nudgeChannel = currentSupabase
      .channel('pacoca_couple_nudges')
      .on('broadcast', { event: 'nudge' }, ({ payload }) => {
        if (!payload) return;
        const target = (payload.toCode || '').toLowerCase();
        if (
          target === myCode ||
          target === myEmail ||
          target.replace('pacoca-', '') === myCode.replace('pacoca-', '')
        ) {
          setCoupleStats((prev) => ({
            ...prev,
            lastNudge: {
              from: payload.fromName,
              message: payload.message,
              timestamp: payload.timestamp || Date.now(),
            },
          }));
        }
      })
      .subscribe();

    return () => {
      currentSupabase.removeChannel(nudgeChannel);
    };
  }, [currentUser?.coupleCode, currentUser?.email]);

  const sendCoupleNudge = (message: string) => {
    if (!currentUser) return;
    const newNudge = {
      from: currentUser.name,
      message,
      timestamp: Date.now(),
    };
    setCoupleStats((prev) => ({
      ...prev,
      lastNudge: newNudge,
    }));

    if (supabase) {
      const channel = supabase.channel('pacoca_couple_nudges');
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          channel.send({
            type: 'broadcast',
            event: 'nudge',
            payload: {
              toCode: currentUser.partnerCode,
              fromName: currentUser.name,
              fromEmail: currentUser.email,
              message,
              timestamp: Date.now(),
            },
          });
        }
      });
    }
  };

  // Real-time listener for couple invites across devices
  useEffect(() => {
    if (!supabase || !currentUser) return;
    const currentSupabase = supabase;
    const myEmail = currentUser.email.toLowerCase();

    const inviteChannel = currentSupabase
      .channel('pacoca_couple_invites')
      .on('broadcast', { event: 'invite_sent' }, ({ payload }) => {
        if (!payload) return;
        const targetEmail = (payload.toEmail || '').toLowerCase();
        if (targetEmail === myEmail) {
          sound.playSuccess();
          setCurrentUser((prev) => {
            if (!prev) return null;
            const existing = (prev.incomingInvites || []).filter((inv) => inv.id !== payload.id);
            return {
              ...prev,
              incomingInvites: [payload, ...existing],
            };
          });
        }
      })
      .on('broadcast', { event: 'invite_accepted' }, ({ payload }) => {
        if (!payload) return;
        const targetEmail = (payload.toEmail || '').toLowerCase();
        if (targetEmail === myEmail) {
          sound.playVictory();
          confetti({
            particleCount: 90,
            spread: 80,
            origin: { y: 0.6 },
          });
          setCurrentUser((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              partnerCode: payload.fromCode || payload.fromEmail,
              sentInvite: null,
            };
          });
          refreshLeaderboard();
        }
      })
      .on('broadcast', { event: 'invite_declined' }, ({ payload }) => {
        if (!payload) return;
        const targetEmail = (payload.toEmail || '').toLowerCase();
        if (targetEmail === myEmail) {
          setCurrentUser((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              sentInvite: null,
            };
          });
        }
      })
      .on('broadcast', { event: 'partner_unlinked' }, ({ payload }) => {
        if (!payload) return;
        const targetEmail = (payload.toEmail || '').toLowerCase();
        if (targetEmail === myEmail) {
          setCurrentUser((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              partnerCode: undefined,
            };
          });
        }
      })
      .subscribe();

    return () => {
      currentSupabase.removeChannel(inviteChannel);
    };
  }, [currentUser?.email]);

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

  const updateUserAvatar = (newAvatar: string) => {
    if (!currentUser || !newAvatar) return;
    const updated: AuthUserProfile = {
      ...currentUser,
      avatar: newAvatar,
    };
    setCurrentUser(updated);
    saveRegisteredUser(updated);
    syncUserProfile(updated);
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
        incomingInvites: currentUser?.incomingInvites || [],
        sentInvite: currentUser?.sentInvite || null,
        loginUser,
        logout,
        linkPartnerCode,
        sendCoupleInvite,
        acceptCoupleInvite,
        declineCoupleInvite,
        cancelSentInvite,
        unlinkPartner,
        completeLesson,
        loseHeart,
        refillHearts,
        addDiamonds,
        sendCoupleNudge,
        clearNudge,
        updateUserName,
        updateUserAvatar,
        setPlacementLevel,
        refreshLeaderboard,
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
