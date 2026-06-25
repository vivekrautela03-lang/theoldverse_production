import { mockCreators, mockMediaItems, mockCommunityPosts, mockCastingCalls, Creator, MediaItem, CommunityPost, CastingCall, Review, JobApplication } from "./mockData";


const STORAGE_KEYS = {
  CREATORS: "oldverse_creators_v2",
  MEDIA: "oldverse_media_v5",
  COMMUNITY: "oldverse_community",
  CASTING: "oldverse_casting",
  FOLLOWED: "oldverse_followed_ids", // set of creator-ids user follows
  APPLICATIONS: "oldverse_casting_applications", // casting-id -> applied status
  WATCHLIST: "oldverse_watchlist_ids", // set of media-ids user saved
  LIKES: "oldverse_liked_ids", // set of media-ids user liked
  HISTORY: "oldverse_history_logs", // array of watch history entries
  DOWNLOADS: "oldverse_offline_downloads", // list of offline download items
  REVIEWS: "oldverse_media_reviews_v1",
  JOBS: "oldverse_jobs_v1",
  JOB_APPLICATIONS: "oldverse_job_applications_v1"
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
      // Set all initial media items as approved
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
    return stored ? JSON.parse(stored) : [];
  },

  applications: (): Record<string, boolean> => {
    if (!isBrowser()) return {};
    const stored = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    return stored ? JSON.parse(stored) : {};
  },

  watchlistIds: (): string[] => {
    if (!isBrowser()) return [];
    const stored = localStorage.getItem(STORAGE_KEYS.WATCHLIST);
    return stored ? JSON.parse(stored) : [];
  },

  likedIds: (): string[] => {
    if (!isBrowser()) return [];
    const stored = localStorage.getItem(STORAGE_KEYS.LIKES);
    return stored ? JSON.parse(stored) : [];
  },

  history: (): { id: string; mediaId: string; title: string; posterUrl: string; date: string }[] => {
    if (!isBrowser()) return [];
    const stored = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!stored) {
      const defaultHistory = [
        { id: "hist-1", mediaId: "media-2", title: "Silent Reflections", posterUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=600", date: "Just now" },
        { id: "hist-2", mediaId: "media-3", title: "Neon Monsoon", posterUrl: "https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?q=80&w=600", date: "Yesterday" }
      ];
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(defaultHistory));
      return defaultHistory;
    }
    return JSON.parse(stored);
  },

  downloads: (): { mediaId: string; title: string; size: string; progress: number }[] => {
    if (!isBrowser()) return [];
    const stored = localStorage.getItem(STORAGE_KEYS.DOWNLOADS);
    if (!stored) {
      const defaultDownloads = [
        { mediaId: "media-2", title: "Silent Reflections", size: "432 MB", progress: 100 },
        { mediaId: "media-6", title: "The Sound of Stone", size: "112 MB", progress: 100 }
      ];
      localStorage.setItem(STORAGE_KEYS.DOWNLOADS, JSON.stringify(defaultDownloads));
      return defaultDownloads;
    }
    return JSON.parse(stored);
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
        },
        {
          id: "rev-3",
          mediaId: "media-love-2",
          author: "Daniel Craig",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&h=100&fit=crop",
          rating: 4.0,
          text: "Gorgeous cinematography on the road. Truly captures the nostalgia of returning to a past love.",
          date: "3 days ago",
          likes: 8
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
    if (!stored) {
      const defaultApps: JobApplication[] = [];
      localStorage.setItem(STORAGE_KEYS.JOB_APPLICATIONS, JSON.stringify(defaultApps));
      return defaultApps;
    }
    return JSON.parse(stored);
  }
};

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

    // Update creator followers count in creators database
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
    return !isFollowing; // returns true if followed, false if unfollowed
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

    // If new creator, dynamically register them in local storage creators table
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
        verificationRequested: false // field for verification approvals queue
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
      isApproved: false // Set as pending admin approval!
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
  toggleWatchlist: (mediaId: string): boolean => {
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

  addToHistory: (mediaId: string, title: string, posterUrl: string): void => {
    if (!isBrowser()) return;
    const history = getStoreData.history();
    const exists = history.some(h => h.mediaId === mediaId);
    
    // Remove if exists to push it to the top
    const filtered = history.filter(h => h.mediaId !== mediaId);
    const newEntry = {
      id: `hist-${Date.now()}`,
      mediaId,
      title,
      posterUrl,
      date: "Just now"
    };

    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify([newEntry, ...filtered]));
    window.dispatchEvent(new Event("oldverse_store_update"));
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

    // Recalculate average rating of the media item and update media store
    const media = getStoreData.media();
    const updatedMedia = media.map(m => {
      if (m.id === mediaId) {
        // Filter reviews for this media item (including the new one)
        const movieReviews = updatedReviews.filter(r => r.mediaId === mediaId);
        const sum = movieReviews.reduce((acc, r) => acc + r.rating, 0);
        const avg = movieReviews.length > 0 ? (sum / movieReviews.length) : rating;
        
        // Convert to a 10-point scale for main display
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
    
    // Mark in standard applications record
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
