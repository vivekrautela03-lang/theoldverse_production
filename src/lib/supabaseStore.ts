import { supabase } from "./supabaseBrowserClient";
import { mockCreators, mockMediaItems, mockCommunityPosts, mockCastingCalls, Creator, MediaItem, CommunityPost, CastingCall, Review, JobApplication } from "./mockData";

const STORAGE_KEYS = {
  CREATORS: "oldverse_creators_v2",
  MEDIA: "oldverse_media_v22",
  COMMUNITY: "oldverse_community",
  CASTING: "oldverse_casting",
  FOLLOWED: "oldverse_followed_ids", // set of creator-ids user follows
  APPLICATIONS: "oldverse_casting_applications", // casting-id -> applied status
  WATCHLIST: "oldverse_watchlist_ids_v2", // set of media-ids user saved
  LIKES: "oldverse_liked_ids_v2", // set of media-ids user liked
  HISTORY: "oldverse_history_logs_v4", // array of watch history entries
  DOWNLOADS: "oldverse_offline_downloads_v4", // list of offline download items
  REVIEWS: "oldverse_media_reviews_v1",
  JOBS: "oldverse_jobs_v1",
  JOB_APPLICATIONS: "oldverse_job_applications_v1",
  CONTINUE_WATCHING: "oldverse_continue_watching_v2",
  NOTIFICATIONS: "oldverse_notifications_v2"
};

// Helper to check if window is available (SSR protection)
const isBrowser = () => typeof window !== "undefined";

export const getStoreData = {
  creators: (): Creator[] => {
    if (!isBrowser()) return mockCreators;
    const stored = localStorage.getItem(STORAGE_KEYS.CREATORS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.CREATORS, JSON.stringify(mockCreators));
      return mockCreators;
    }
    return JSON.parse(stored);
  },

  media: (): MediaItem[] => {
    if (!isBrowser()) return mockMediaItems;
    const stored = localStorage.getItem(STORAGE_KEYS.MEDIA);
    if (!stored) {
      const initialApproved = mockMediaItems.map(item => ({ ...item, isApproved: true }));
      localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(initialApproved));
      return initialApproved;
    }
    return JSON.parse(stored);
  },

  community: (): CommunityPost[] => {
    if (!isBrowser()) return mockCommunityPosts;
    const stored = localStorage.getItem(STORAGE_KEYS.COMMUNITY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.COMMUNITY, JSON.stringify(mockCommunityPosts));
      return mockCommunityPosts;
    }
    return JSON.parse(stored);
  },

  casting: (): CastingCall[] => {
    if (!isBrowser()) return mockCastingCalls;
    const stored = localStorage.getItem(STORAGE_KEYS.CASTING);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.CASTING, JSON.stringify(mockCastingCalls));
      return mockCastingCalls;
    }
    return JSON.parse(stored);
  },

  followedIds: (): string[] => {
    if (!isBrowser()) return [];
    const stored = localStorage.getItem(STORAGE_KEYS.FOLLOWED);
    try {
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  applications: (): Record<string, boolean> => {
    if (!isBrowser()) return {};
    const stored = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    try {
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  },

  watchlistIds: (): string[] => {
    if (!isBrowser()) return [];
    const stored = localStorage.getItem(STORAGE_KEYS.WATCHLIST);
    try {
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  likedIds: (): string[] => {
    if (!isBrowser()) return [];
    const stored = localStorage.getItem(STORAGE_KEYS.LIKES);
    try {
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  history: (): { id: string; mediaId: string; title: string; posterUrl: string; date: string; percentage?: number }[] => {
    if (!isBrowser()) return [];
    const stored = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!stored) {
      const defaultHistory = [
        { id: "hist-1", mediaId: "media-love-1", title: "SILENCE GLANCES, GOLDEN MOMENTS", posterUrl: "/silence_glances_golden_moments.jpg", date: "Just now", percentage: 90 },
        { id: "hist-2", mediaId: "media-love-2", title: "DESTINED", posterUrl: "/destined.jpg", date: "Yesterday", percentage: 40 }
      ];
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(defaultHistory));
      return defaultHistory;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  },

  continueWatching: (): { id: string; mediaId: string; progressSeconds: number; durationSeconds: number; percentage: number }[] => {
    if (!isBrowser()) return [];
    const stored = localStorage.getItem(STORAGE_KEYS.CONTINUE_WATCHING);
    try {
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  notifications: (): { id: string; title: string; message: string; type: string; isRead: boolean; date: string }[] => {
    if (!isBrowser()) return [];
    const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    try {
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  downloads: (): { mediaId: string; title: string; size: string; progress: number }[] => {
    if (!isBrowser()) return [];
    const stored = localStorage.getItem(STORAGE_KEYS.DOWNLOADS);
    if (!stored) {
      const defaultDownloads = [
        { mediaId: "media-love-1", title: "SILENCE GLANCES, GOLDEN MOMENTS", size: "432 MB", progress: 100 },
        { mediaId: "media-love-2", title: "DESTINED", size: "320 MB", progress: 100 }
      ];
      localStorage.setItem(STORAGE_KEYS.DOWNLOADS, JSON.stringify(defaultDownloads));
      return defaultDownloads;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  },

  comments: (mediaId: string): { author: string; avatar: string; text: string; date: string }[] => {
    if (!isBrowser()) return [];
    const key = `oldverse_comments_${mediaId}`;
    const stored = localStorage.getItem(key);
    if (!stored) {
      const defaultComments = [
        { author: "Devin Miller", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&h=100&fit=crop", text: "This looks absolutely breathtaking. The lighting is unreal!", date: "Yesterday" },
        { author: "Aria Blake", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&h=100&fit=crop", text: "The score fits the dark, melancholic vibe perfectly. Beautifully edited.", date: "2 days ago" }
      ];
      localStorage.setItem(key, JSON.stringify(defaultComments));
      return defaultComments;
    }
    return JSON.parse(stored);
  },

  reviews: (mediaId: string): Review[] => {
    if (!isBrowser()) return [];
    const stored = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    if (!stored) {
      const defaultReviews: Review[] = [
        {
          id: "rev-1",
          mediaId: "media-love-1",
          author: "Daniel Craig",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&h=100&fit=crop",
          rating: 5.0,
          text: "Absolutely stunning. The monochrome tones are so rich, and the chemistry is electric. Shivanshi is a genius.",
          date: "Yesterday",
          likes: 24
        },
        {
          id: "rev-2",
          mediaId: "media-love-1",
          author: "Keira Knightley",
          avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&h=100&fit=crop",
          rating: 4.5,
          text: "A beautiful, moody piece of cinema. The silence says so much more than dialogues could. The music cue at the end is perfect.",
          date: "2 days ago",
          likes: 12
        }
      ];
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(defaultReviews));
      return defaultReviews.filter(r => r.mediaId === mediaId);
    }
    const allReviews: Review[] = JSON.parse(stored);
    return allReviews.filter(r => r.mediaId === mediaId);
  },

  allReviews: (): Review[] => {
    if (!isBrowser()) return [];
    const stored = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    if (!stored) return [];
    return JSON.parse(stored);
  },

  jobApplications: (): JobApplication[] => {
    if (!isBrowser()) return [];
    const stored = localStorage.getItem(STORAGE_KEYS.JOB_APPLICATIONS);
    return stored ? JSON.parse(stored) : [];
  }
};

export const syncWithSupabase = async () => {
  if (!isBrowser()) return;
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const userId = session.user.id;

    // 1. Sync User Profile details
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profile) {
      localStorage.setItem(
        "oldverse_user",
        JSON.stringify({
          id: profile.id,
          name: profile.full_name || session.user.email?.split("@")[0],
          email: profile.email,
          username: profile.username,
          avatar: profile.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&h=100&fit=crop",
          bio: profile.bio || "Storyteller on TheOldverse",
          isCreator: profile.role === "creator" || profile.role === "admin",
          isAdmin: profile.role === "admin",
          subscriptionPlan: profile.subscription_plan || "free",
          notificationPreferences: profile.notification_preferences
        })
      );
    }

    // 2. Sync Watchlist
    const { data: watchlist } = await supabase
      .from("watchlist")
      .select("media_id")
      .eq("user_id", userId);
    
    if (watchlist) {
      localStorage.setItem(
        STORAGE_KEYS.WATCHLIST,
        JSON.stringify(watchlist.map(w => w.media_id))
      );
    }

    // 3. Sync Watch History
    const { data: history } = await supabase
      .from("watch_history")
      .select("*")
      .eq("user_id", userId)
      .order("last_watched_at", { ascending: false });

    if (history) {
      const mappedHistory = history.map(h => {
        const item = mockMediaItems.find(m => m.id === h.media_id);
        return {
          id: h.id,
          mediaId: h.media_id,
          title: item?.title || h.media_id,
          posterUrl: item?.posterUrl || "/logo.png",
          date: new Date(h.last_watched_at).toLocaleDateString(),
          percentage: h.percentage
        };
      });
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(mappedHistory));
    }

    // 4. Sync Continue Watching
    const { data: continueWatching } = await supabase
      .from("continue_watching")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (continueWatching) {
      const mappedCw = continueWatching.map(cw => ({
        id: cw.id,
        mediaId: cw.media_id,
        progressSeconds: cw.progress_seconds,
        durationSeconds: cw.duration_seconds,
        percentage: cw.percentage
      }));
      localStorage.setItem(STORAGE_KEYS.CONTINUE_WATCHING, JSON.stringify(mappedCw));
    }

    // 5. Sync Notifications
    const { data: notifications } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (notifications) {
      const mappedNotif = notifications.map(n => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.type,
        isRead: n.is_read,
        date: new Date(n.created_at).toLocaleDateString()
      }));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(mappedNotif));
    }

    window.dispatchEvent(new Event("oldverse_store_update"));
  } catch (error) {
    console.error("[Sync] Error syncing with Supabase:", error);
  }
};

if (isBrowser()) {
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (session) {
      // Synchronize Supabase tokens to cookies for Middleware validation
      document.cookie = `session_at=${session.access_token}; path=/; max-age=${session.expires_in}; SameSite=Lax; Secure`;
      document.cookie = `session_rt=${session.refresh_token}; path=/; max-age=604800; SameSite=Lax; Secure`;
      await syncWithSupabase();
    } else {
      // Clear cookies
      document.cookie = "session_at=; path=/; max-age=0";
      document.cookie = "session_rt=; path=/; max-age=0";
      localStorage.removeItem("oldverse_user");
      localStorage.removeItem(STORAGE_KEYS.WATCHLIST);
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
      localStorage.removeItem(STORAGE_KEYS.CONTINUE_WATCHING);
      localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    }
    window.dispatchEvent(new Event("oldverse_store_update"));
  });
}

export const mutateStore = {
  followCreator: (creatorId: string): boolean => {
    if (!isBrowser()) return false;
    const followed = getStoreData.followedIds();
    const isFollowing = followed.includes(creatorId);
    let newFollowed: string[];

    if (isFollowing) {
      newFollowed = followed.filter(id => id !== creatorId);
    } else {
      newFollowed = [...followed, creatorId];
    }
    localStorage.setItem(STORAGE_KEYS.FOLLOWED, JSON.stringify(newFollowed));

    const creators = getStoreData.creators();
    const updatedCreators = creators.map(creator => {
      if (creator.id === creatorId) {
        return {
          ...creator,
          followers: creator.followers + (isFollowing ? -1 : 1)
        };
      }
      return creator;
    });
    localStorage.setItem(STORAGE_KEYS.CREATORS, JSON.stringify(updatedCreators));
    
    window.dispatchEvent(new Event("oldverse_store_update"));
    return !isFollowing;
  },

  addComment: (mediaId: string, author: string, text: string): void => {
    if (!isBrowser()) return;
    const key = `oldverse_comments_${mediaId}`;
    const comments = getStoreData.comments(mediaId);
    const newComment = {
      author,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&h=100&fit=crop",
      text,
      date: "Just now"
    };
    localStorage.setItem(key, JSON.stringify([newComment, ...comments]));
    window.dispatchEvent(new Event("oldverse_store_update"));
  },

  addMedia: (media: Omit<MediaItem, "id" | "rating" | "releaseDate" | "cast" | "crew" | "gallery" | "creatorId" | "creatorName"> & { creatorId?: string; creatorName?: string }): MediaItem => {
    const list = getStoreData.media();
    const cName = media.creatorName || "Current User";
    const cId = media.creatorId || (cName === "Current User" ? "creator-current-user" : `creator-custom-${Date.now()}`);

    const creators = getStoreData.creators();
    const creatorExists = creators.some(c => c.id === cId || c.name.toLowerCase() === cName.toLowerCase());
    
    if (!creatorExists && cName !== "Current User") {
      const newCreator: Creator = {
        id: cId,
        name: cName,
        username: cName.toLowerCase().replace(/\s+/g, ""),
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&h=200&fit=crop",
        banner: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1200&auto=format&fit=crop",
        bio: `Cinematic Director & Visual Artist on The OldVerse.`,
        followers: 142,
        isVerified: false,
        categories: [media.category],
        links: {},
        about: `${cName} is a visual creator who publishes original work on The OldVerse.`,
        verificationRequested: false
      } as any;
      localStorage.setItem(STORAGE_KEYS.CREATORS, JSON.stringify([newCreator, ...creators]));
    }

    const newMedia: MediaItem = {
      ...media,
      id: `media-custom-${Date.now()}`,
      rating: "0.0",
      releaseDate: "Just Now",
      cast: [],
      crew: [{ role: "Director", name: cName }],
      gallery: [media.posterUrl],
      creatorId: cId,
      creatorName: cName,
      isApproved: false
    } as any;

    localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify([newMedia, ...list]));
    window.dispatchEvent(new Event("oldverse_store_update"));
    return newMedia;
  },

  addCommunityPost: (content: string, category: CommunityPost["category"], imageUrl?: string): CommunityPost => {
    const posts = getStoreData.community();
    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      creatorId: "creator-current-user",
      creatorName: "Current User",
      creatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&h=100&fit=crop",
      isVerified: true,
      content,
      imageUrl,
      likes: 0,
      commentsCount: 0,
      timestamp: "Just now",
      category
    };

    localStorage.setItem(STORAGE_KEYS.COMMUNITY, JSON.stringify([newPost, ...posts]));
    window.dispatchEvent(new Event("oldverse_store_update"));
    return newPost;
  },

  applyToCasting: (castingId: string): void => {
    if (!isBrowser()) return;
    const apps = getStoreData.applications();
    apps[castingId] = true;
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
    window.dispatchEvent(new Event("oldverse_store_update"));
  },

  // USER LISTS MUTATORS
  toggleWatchlist: async (mediaId: string): Promise<boolean> => {
    if (!isBrowser()) return false;
    const list = getStoreData.watchlistIds();
    const exists = list.includes(mediaId);
    let newList: string[];

    if (exists) {
      newList = list.filter(id => id !== mediaId);
    } else {
      newList = [...list, mediaId];
    }

    localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(newList));
    window.dispatchEvent(new Event("oldverse_store_update"));

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        if (exists) {
          await supabase
            .from("watchlist")
            .delete()
            .eq("user_id", session.user.id)
            .eq("media_id", mediaId);
        } else {
          await supabase
            .from("watchlist")
            .insert({ user_id: session.user.id, media_id: mediaId });
        }
      }
    } catch (err) {
      console.error("[Watchlist Sync] Failed:", err);
    }

    return !exists;
  },

  toggleLike: (mediaId: string): boolean => {
    if (!isBrowser()) return false;
    const list = getStoreData.likedIds();
    const exists = list.includes(mediaId);
    let newList: string[];

    if (exists) {
      newList = list.filter(id => id !== mediaId);
    } else {
      newList = [...list, mediaId];
    }

    localStorage.setItem(STORAGE_KEYS.LIKES, JSON.stringify(newList));
    window.dispatchEvent(new Event("oldverse_store_update"));
    return !exists;
  },

  addToHistory: async (mediaId: string, title: string, posterUrl: string, percentage = 100): Promise<void> => {
    if (!isBrowser()) return;
    const history = getStoreData.history();
    const filtered = history.filter(h => h.mediaId !== mediaId);
    const newEntry = {
      id: `hist-${Date.now()}`,
      mediaId,
      title,
      posterUrl,
      date: "Just now",
      percentage
    };

    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify([newEntry, ...filtered]));
    window.dispatchEvent(new Event("oldverse_store_update"));

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase
          .from("watch_history")
          .upsert({
            user_id: session.user.id,
            media_id: mediaId,
            percentage,
            last_watched_at: new Date().toISOString()
          }, { onConflict: "user_id,media_id" });
      }
    } catch (err) {
      console.error("[History Sync] Failed:", err);
    }
  },

  updateContinueWatching: async (mediaId: string, progressSeconds: number, durationSeconds: number): Promise<void> => {
    if (!isBrowser()) return;
    const cw = getStoreData.continueWatching();
    const filtered = cw.filter(c => c.mediaId !== mediaId);
    const percentage = Math.round((progressSeconds / durationSeconds) * 100);

    const newEntry = {
      id: `cw-${Date.now()}`,
      mediaId,
      progressSeconds,
      durationSeconds,
      percentage
    };

    localStorage.setItem(STORAGE_KEYS.CONTINUE_WATCHING, JSON.stringify([newEntry, ...filtered]));
    window.dispatchEvent(new Event("oldverse_store_update"));

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase
          .from("continue_watching")
          .upsert({
            user_id: session.user.id,
            media_id: mediaId,
            progress_seconds: progressSeconds,
            duration_seconds: durationSeconds,
            percentage,
            updated_at: new Date().toISOString()
          }, { onConflict: "user_id,media_id" });
      }
    } catch (err) {
      console.error("[Continue Watching Sync] Failed:", err);
    }
  },

  removeContinueWatching: async (mediaId: string): Promise<void> => {
    if (!isBrowser()) return;
    const cw = getStoreData.continueWatching();
    const updated = cw.filter(c => c.mediaId !== mediaId);
    localStorage.setItem(STORAGE_KEYS.CONTINUE_WATCHING, JSON.stringify(updated));
    window.dispatchEvent(new Event("oldverse_store_update"));

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase
          .from("continue_watching")
          .delete()
          .eq("user_id", session.user.id)
          .eq("media_id", mediaId);
      }
    } catch (err) {
      console.error("[Continue Watching Remove Sync] Failed:", err);
    }
  },

  removeHistoryItem: async (mediaId: string): Promise<void> => {
    if (!isBrowser()) return;
    const history = getStoreData.history();
    const updated = history.filter(h => h.mediaId !== mediaId);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
    window.dispatchEvent(new Event("oldverse_store_update"));

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase
          .from("watch_history")
          .delete()
          .eq("user_id", session.user.id)
          .eq("media_id", mediaId);
      }
    } catch (err) {
      console.error("[History Remove Sync] Failed:", err);
    }
  },

  clearHistory: async (): Promise<void> => {
    if (!isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify([]));
    window.dispatchEvent(new Event("oldverse_store_update"));

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase
          .from("watch_history")
          .delete()
          .eq("user_id", session.user.id);
      }
    } catch (err) {
      console.error("[History Clear Sync] Failed:", err);
    }
  },

  markNotificationAsRead: async (notificationId: string): Promise<void> => {
    if (!isBrowser()) return;
    const notifs = getStoreData.notifications();
    const updated = notifs.map(n => n.id === notificationId ? { ...n, isRead: true } : n);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    window.dispatchEvent(new Event("oldverse_store_update"));

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase
          .from("notifications")
          .update({ is_read: true })
          .eq("id", notificationId)
          .eq("user_id", session.user.id);
      }
    } catch (err) {
      console.error("[Notification Read Sync] Failed:", err);
    }
  },

  deleteNotification: async (notificationId: string): Promise<void> => {
    if (!isBrowser()) return;
    const notifs = getStoreData.notifications();
    const updated = notifs.filter(n => n.id !== notificationId);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    window.dispatchEvent(new Event("oldverse_store_update"));

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase
          .from("notifications")
          .delete()
          .eq("id", notificationId)
          .eq("user_id", session.user.id);
      }
    } catch (err) {
      console.error("[Notification Delete Sync] Failed:", err);
    }
  },

  // ADMIN OPERATIONS
  approveMedia: (mediaId: string): void => {
    if (!isBrowser()) return;
    const media = getStoreData.media();
    const updated = media.map(m => {
      if (m.id === mediaId) {
        return { ...m, isApproved: true };
      }
      return m;
    });
    localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(updated));
    window.dispatchEvent(new Event("oldverse_store_update"));
  },

  declineMedia: (mediaId: string): void => {
    if (!isBrowser()) return;
    const media = getStoreData.media();
    const updated = media.filter(m => m.id !== mediaId);
    localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(updated));
    window.dispatchEvent(new Event("oldverse_store_update"));
  },

  requestVerification: (creatorId: string): void => {
    if (!isBrowser()) return;
    const creators = getStoreData.creators();
    const updated = creators.map(c => {
      if (c.id === creatorId) {
        return { ...c, verificationRequested: true };
      }
      return c;
    });
    localStorage.setItem(STORAGE_KEYS.CREATORS, JSON.stringify(updated));
    window.dispatchEvent(new Event("oldverse_store_update"));
  },

  approveVerification: (creatorId: string): void => {
    if (!isBrowser()) return;
    const creators = getStoreData.creators();
    const updated = creators.map(c => {
      if (c.id === creatorId) {
        return { ...c, isVerified: true, verificationRequested: false };
      }
      return c;
    });
    localStorage.setItem(STORAGE_KEYS.CREATORS, JSON.stringify(updated));
    window.dispatchEvent(new Event("oldverse_store_update"));
  },

  addReview: (mediaId: string, author: string, rating: number, text: string): void => {
    if (!isBrowser()) return;
    const stored = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    const reviews: Review[] = stored ? JSON.parse(stored) : [];
    
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      mediaId,
      author,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&h=100&fit=crop",
      rating,
      text,
      date: "Just now",
      likes: 0
    };

    const updatedReviews = [newReview, ...reviews];
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(updatedReviews));

    const media = getStoreData.media();
    const updatedMedia = media.map(m => {
      if (m.id === mediaId) {
        const movieReviews = updatedReviews.filter(r => r.mediaId === mediaId);
        const sum = movieReviews.reduce((acc, r) => acc + r.rating, 0);
        const avg = movieReviews.length > 0 ? (sum / movieReviews.length) : rating;
        
        const displayRating = (avg * 2).toFixed(1);
        return { ...m, rating: displayRating };
      }
      return m;
    });
    localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(updatedMedia));

    window.dispatchEvent(new Event("oldverse_store_update"));
  },

  postJob: (job: Omit<CastingCall, "id" | "datePosted" | "creatorId" | "creatorName" | "creatorAvatar">): CastingCall => {
    const list = getStoreData.casting();
    const newJob: CastingCall = {
      ...job,
      id: `job-custom-${Date.now()}`,
      datePosted: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      creatorId: "creator-current-user",
      creatorName: "Current User",
      creatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&h=100&fit=crop"
    };
    localStorage.setItem(STORAGE_KEYS.CASTING, JSON.stringify([newJob, ...list]));
    window.dispatchEvent(new Event("oldverse_store_update"));
    return newJob;
  },

  applyToJob: (
    jobId: string,
    jobTitle: string,
    creatorId: string,
    applicantName: string,
    applicantEmail: string,
    portfolioUrl: string,
    coverLetter: string
  ): void => {
    if (!isBrowser()) return;
    const apps = getStoreData.jobApplications();
    const newApp: JobApplication = {
      id: `app-${Date.now()}`,
      jobId,
      jobTitle,
      creatorId,
      applicantName,
      applicantEmail,
      portfolioUrl,
      coverLetter,
      status: "pending",
      createdAt: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    };
    localStorage.setItem(STORAGE_KEYS.JOB_APPLICATIONS, JSON.stringify([newApp, ...apps]));
    
    const castingApps = getStoreData.applications();
    castingApps[jobId] = true;
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(castingApps));

    window.dispatchEvent(new Event("oldverse_store_update"));
  },

  updateApplicationStatus: (appId: string, status: "approved" | "declined"): void => {
    if (!isBrowser()) return;
    const apps = getStoreData.jobApplications();
    const updated = apps.map(app => {
      if (app.id === appId) {
        return { ...app, status };
      }
      return app;
    });
    localStorage.setItem(STORAGE_KEYS.JOB_APPLICATIONS, JSON.stringify(updated));
    window.dispatchEvent(new Event("oldverse_store_update"));
  }
};
