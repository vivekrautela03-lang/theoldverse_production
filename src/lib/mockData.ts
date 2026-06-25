export interface Creator {
  id: string;
  name: string;
  username: string;
  avatar: string;
  banner: string;
  bio: string;
  followers: number;
  isVerified: boolean;
  categories: string[];
  links: {
    instagram?: string;
    youtube?: string;
    twitter?: string;
    website?: string;
  };
  about: string;
}

export interface Episode {
  id: string;
  title: string;
  episodeNumber: number;
  duration: string;
  thumbnail: string;
  description: string;
  videoUrl: string;
}

export interface MediaItem {
  id: string;
  title: string;
  type: "movie" | "series" | "bts" | "original";
  category: string;
  description: string;
  duration: string;
  rating: string;
  posterUrl: string;
  bannerUrl: string;
  videoUrl: string;
  creatorId: string;
  creatorName: string;
  isTrending: boolean;
  isOriginal: boolean;
  continueWatchingProgress?: number; // 0 to 100
  releaseDate: string;
  cast: string[];
  crew: { role: string; name: string }[];
  gallery: string[];
  episodes?: Episode[];
  isApproved?: boolean;
  isHeroSlide?: boolean;
}

export interface CommunityPost {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  isVerified: boolean;
  content: string;
  imageUrl?: string;
  likes: number;
  commentsCount: number;
  timestamp: string;
  category: "behind-the-scenes" | "casting-call" | "announcement" | "discussion" | "writing-room" | "photography";
}

export interface CastingCall {
  id: string;
  title: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  project: string;
  role: string;
  description: string;
  requirements: string[];
  location: string;
  type: "Full-Time" | "Part-Time" | "Contract" | "Collaboration";
  datePosted: string;
}

// 1. Initial Creators
export const mockCreators: Creator[] = [
  {
    id: "creator-love",
    name: "Shivanshi",
    username: "shivanshi",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&h=200&fit=crop",
    banner: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1200&auto=format&fit=crop",
    bio: "Director & Producer. Crafting visual melodies and cinematic music clips that linger in the heart.",
    followers: 18500,
    isVerified: true,
    categories: ["Drama", "Originals", "Music"],
    links: { instagram: "https://instagram.com", website: "https://shivanshi.film" },
    about: "Shivanshi is an independent filmmaker and producer specialized in highly emotional, atmospheric music videos and visual art clips."
  },
  {
    id: "creator-1",
    name: "Elena Rostova",
    username: "elenarostova",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&fit=crop",
    banner: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1200&auto=format&fit=crop",
    bio: "Cinematic Storyteller & Director. Capturing human emotions in wide lenses. Award-winning director of 'Silent Reflections'.",
    followers: 124500,
    isVerified: true,
    categories: ["Drama", "Experimental", "Originals"],
    links: { instagram: "https://instagram.com", youtube: "https://youtube.com", website: "https://elena.film" },
    about: "Elena Rostova is a Russian-born, London-based filmmaker who specializes in deeply intimate character studies and rich, visual symbolism. Her work explores memory, isolation, and redemption. Winner of the 2024 OldVerse Indie Film Festival Grand Jury Prize."
  },
  {
    id: "creator-2",
    name: "Marcus Vance",
    username: "marcusvance",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&fit=crop",
    banner: "https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?q=80&w=1200&auto=format&fit=crop",
    bio: "Action Director & Visual Effects Architect. Exploring cyberpunk futures and neon-drenched dystopias.",
    followers: 89400,
    isVerified: true,
    categories: ["Action", "Animation", "Experimental"],
    links: { youtube: "https://youtube.com", twitter: "https://twitter.com" },
    about: "Marcus Vance combines practical stunt work with cutting-edge visual effects to build immersive sci-fi landscapes. Formerly a VFX supervisor for major Hollywood studios, Marcus now leads independent production house Vance Interactive, releasing sci-fi shorts on The OldVerse."
  },
  {
    id: "creator-3",
    name: "Sarah Chen",
    username: "sarahchen_photo",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&fit=crop",
    banner: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?q=80&w=1200&auto=format&fit=crop",
    bio: "Travel Filmmaker & Street Photographer. Documenting raw street culture and breathtaking landscapes worldwide.",
    followers: 245000,
    isVerified: true,
    categories: ["Documentary", "Photography", "Travel"],
    links: { instagram: "https://instagram.com", website: "https://sarahchen.co" },
    about: "Sarah Chen has traversed over 60 countries with a single backpack and a camera. Her documentaries capture the unsung heroes of daily life in remote areas, emphasizing raw, unscripted human stories and high-contrast street photography."
  },
  {
    id: "creator-4",
    name: "Vikram Malhotra",
    username: "vikramfilms",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&fit=crop",
    banner: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
    bio: "Documentarian & Sound Scaper. Creating immersive auditory and visual experiences of nature and industry.",
    followers: 67300,
    isVerified: false,
    categories: ["Documentary", "Music", "Experimental"],
    links: { twitter: "https://twitter.com", website: "https://vikramsound.org" },
    about: "Vikram Malhotra is an audio-visual artist based in Mumbai. He is known for using custom binaural audio microphones to capture soundscapes that serve as the foundation for his visually hypnotic documentaries on mega-cities and ancient forests."
  }
];

// 2. Initial Media Items
export const mockMediaItems: MediaItem[] = [
  {
    id: "media-love-1",
    title: "I Think they call this love....",
    type: "original",
    category: "Originals",
    description: "Deep, raw, and monochromatic. A music clip capturing the silent, electric glances and unspoken bonds between two souls over a warm drink in a cold city.",
    duration: "4m 15s",
    rating: "9.8",
    posterUrl: "/media_1.jpg",
    bannerUrl: "/media_1_landscape.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    creatorId: "creator-love",
    creatorName: "Shivanshi",
    isTrending: true,
    isOriginal: true,
    isHeroSlide: true,
    releaseDate: "Coming Soon",
    cast: ["Amarjeet", "Soundarya"],
    crew: [
      { role: "Director & Producer", name: "Shivanshi" },
      { role: "Editor", name: "Shivansh Mourya" },
      { role: "Cameraman", name: "Prince" },
      { role: "Assistant Director", name: "Rishika" }
    ],
    gallery: ["/media_1.jpg"]
  },
  {
    id: "media-love-2",
    title: "And I Couldn't Help But Fall In Love Again",
    type: "original",
    category: "Originals",
    description: "Based on the song 'I thought I saw your face today'. An evocative music clip documenting a nostalgic road reconnecting two estranged paths.",
    duration: "3m 50s",
    rating: "9.7",
    posterUrl: "/media_2.jpg",
    bannerUrl: "/media_2_landscape.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    creatorId: "creator-love",
    creatorName: "Shivanshi",
    isTrending: true,
    isOriginal: true,
    isHeroSlide: true,
    releaseDate: "Coming Soon",
    cast: ["Anjali Negi", "Akshit Semwal"],
    crew: [
      { role: "Director & Producer", name: "Shivanshi" },
      { role: "Assistant Director", name: "Priya Karanwal" },
      { role: "Cameraman", name: "Prince" },
      { role: "Editor", name: "Shivansh Mourya" }
    ],
    gallery: ["/media_2.jpg"]
  },
  {
    id: "media-1",
    title: "Silent Connections",
    type: "original",
    category: "Drama",
    description: "Deep inside the silent ancient redwood forests, a quiet, unspoken bond between two distant souls faces a sudden test of truth when a single phone call echoes through the trees. An award-winning film capturing memory, proximity, and choices.",
    duration: "1h 42m",
    rating: "9.6",
    posterUrl: "/media_1.jpg",
    bannerUrl: "/media_1_landscape.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    creatorId: "creator-1",
    creatorName: "Elena Rostova",
    isTrending: true,
    isOriginal: true,
    releaseDate: "June 2026",
    cast: ["Sofia Larson", "Mikael Blomqvist"],
    crew: [
      { role: "Director", name: "Elena Rostova" },
      { role: "Director of Photography", name: "Sarah Chen" },
      { role: "Composer", name: "Vikram Malhotra" }
    ],
    gallery: [
      "/media_1_landscape.jpg",
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=400&fit=crop",
      "https://images.unsplash.com/photo-1460881680858-30d872d5b530?q=80&w=400&fit=crop"
    ]
  },
  {
    id: "media-2",
    title: "Silent Reflections",
    type: "movie",
    category: "Drama",
    description: "An elegant, dialogue-free exploration of grief and reconciliation. Following the sudden passing of her mother, a classical pianist travels to a remote cabin in Norway, seeking silence, only to find herself haunted by the melodies of her past.",
    duration: "1h 15m",
    rating: "8.9",
    posterUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=600&auto=format&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1460881680858-30d872d5b530?q=80&w=1200&auto=format&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    creatorId: "creator-1",
    creatorName: "Elena Rostova",
    isTrending: true,
    isOriginal: false,
    continueWatchingProgress: 35,
    releaseDate: "Jan 2026",
    cast: ["Sofia Larson", "Mikael Blomqvist"],
    crew: [
      { role: "Director", name: "Elena Rostova" },
      { role: "Composer", name: "Vikram Malhotra" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=400&fit=crop",
      "https://images.unsplash.com/photo-1460881680858-30d872d5b530?q=80&w=400&fit=crop"
    ]
  },
  {
    id: "media-3",
    title: "Neon Monsoon",
    type: "series",
    category: "Experimental",
    description: "A visually hypnotic episodic journey through Mumbai's neon-drenched alleys during the peak monsoon season. Mixing high frame-rate street footage with an electronic industrial score.",
    duration: "4 Episodes",
    rating: "9.1",
    posterUrl: "https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?q=80&w=600&auto=format&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?q=80&w=1200&auto=format&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    creatorId: "creator-4",
    creatorName: "Vikram Malhotra",
    isTrending: false,
    isOriginal: true,
    continueWatchingProgress: 80,
    releaseDate: "Mar 2026",
    cast: ["Bhim Sen", "Priya Nair"],
    crew: [
      { role: "Director & Sound", name: "Vikram Malhotra" },
      { role: "Editor", name: "Elena Rostova" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?q=80&w=400&fit=crop",
      "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?q=80&w=400&fit=crop"
    ],
    episodes: [
      {
        id: "ep-1",
        title: "The First Rain",
        episodeNumber: 1,
        duration: "25m",
        thumbnail: "https://images.unsplash.com/photo-1428908728789-d2de25dbd4e2?q=80&w=400&fit=crop",
        description: "The monsoon hits the coastline. The rhythm of the rain blends with local street vendors and train stations.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      },
      {
        id: "ep-2",
        title: "Midnight Alley",
        episodeNumber: 2,
        duration: "28m",
        thumbnail: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=400&fit=crop",
        description: "Exploring dark alleys under neon glow as rain pours. Synced synthesizers mirror the mechanical street beats.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
      },
      {
        id: "ep-3",
        title: "Flooded Tracks",
        episodeNumber: 3,
        duration: "22m",
        thumbnail: "https://images.unsplash.com/photo-1460881680858-30d872d5b530?q=80&w=400&fit=crop",
        description: "Trains halt. The community joins together. Immersive sound design capturing the collective warmth in the storm.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
      },
      {
        id: "ep-4",
        title: "Morning Mist",
        episodeNumber: 4,
        duration: "30m",
        thumbnail: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=400&fit=crop",
        description: "The city wakes up washed clean. Sunrise over the Arabian Sea, accompanied by sitar-electronic ambient tones.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
      }
    ]
  },
  {
    id: "media-4",
    title: "Chasing Shadows",
    type: "movie",
    category: "Documentary",
    description: "An intimate look into the hidden lives of street children in major capital cities, exploring their resilience, micro-communities, and their incredible ability to find play amidst urban chaos.",
    duration: "58m",
    rating: "8.7",
    posterUrl: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?q=80&w=600&auto=format&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=1200&auto=format&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    creatorId: "creator-3",
    creatorName: "Sarah Chen",
    isTrending: false,
    isOriginal: false,
    releaseDate: "Feb 2026",
    cast: ["Narrated by Sarah Chen"],
    crew: [
      { role: "Director", name: "Sarah Chen" },
      { role: "Sound Mixer", name: "Vikram Malhotra" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?q=80&w=400&fit=crop",
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=400&fit=crop"
    ]
  },
  {
    id: "media-5",
    title: "Cyberpunk Redux",
    type: "original",
    category: "Animation",
    description: "An animated futuristic epic tracing the collision of cybernetic enhancements and biological ancestry in Neo-Kyoto. Fully rendered using custom AI engine blending and traditional stop-motion.",
    duration: "1h 05m",
    rating: "9.2",
    posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1200&auto=format&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    creatorId: "creator-2",
    creatorName: "Marcus Vance",
    isTrending: true,
    isOriginal: true,
    releaseDate: "June 2026",
    cast: ["Takahashi Sato", "Lin Zhou"],
    crew: [
      { role: "VFX Supervisor", name: "Marcus Vance" },
      { role: "Co-writer", name: "Sarah Chen" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=400&fit=crop",
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=400&fit=crop"
    ]
  },
  {
    id: "media-6",
    title: "The Sound of Stone",
    type: "bts",
    category: "Documentary",
    description: "A behind-the-scenes masterclass showing how the ambient noise, echoing winds, and running streams of Vikram Malhotra's latest film were recorded using experimental sub-surface microphones.",
    duration: "18m",
    rating: "8.5",
    posterUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=600&auto=format&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=1200&auto=format&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    creatorId: "creator-4",
    creatorName: "Vikram Malhotra",
    isTrending: false,
    isOriginal: false,
    releaseDate: "April 2026",
    cast: ["Vikram Malhotra"],
    crew: [
      { role: "Director", name: "Vikram Malhotra" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=400&fit=crop",
      "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=400&fit=crop"
    ]
  }
];

// 3. Initial Community Posts
export const mockCommunityPosts: CommunityPost[] = [
  {
    id: "post-1",
    creatorId: "creator-1",
    creatorName: "Elena Rostova",
    creatorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&h=100&fit=crop",
    isVerified: true,
    content: "Working on the screen adaptation of 'Glass Memories' this morning. Here's a quick look at the storyboard. What do you think about doing the entire first act in soft focus?",
    imageUrl: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=600&auto=format&fit=crop",
    likes: 843,
    commentsCount: 94,
    timestamp: "2 hours ago",
    category: "behind-the-scenes"
  },
  {
    id: "post-2",
    creatorId: "creator-3",
    creatorName: "Sarah Chen",
    creatorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&h=100&fit=crop",
    isVerified: true,
    content: "Just landed in Kyoto for a new photo series: 'Ghosts of Gion'. Here's a raw frame captured in the rain at 3:00 AM. Shot on Leica M11, 35mm f/1.4.",
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600&auto=format&fit=crop",
    likes: 1240,
    commentsCount: 154,
    timestamp: "6 hours ago",
    category: "photography"
  },
  {
    id: "post-3",
    creatorId: "creator-2",
    creatorName: "Marcus Vance",
    creatorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&h=100&fit=crop",
    isVerified: true,
    content: "We are officially hosting a screening & live Q&A in London next Friday for 'Echoes of the Wasteland'. Ticket details inside! Exclusive to OldVerse supporters.",
    likes: 531,
    commentsCount: 42,
    timestamp: "1 day ago",
    category: "announcement"
  }
];

// 4. Initial Casting Calls
export const mockCastingCalls: CastingCall[] = [
  {
    id: "casting-1",
    title: "Lead Actress for Sci-Fi Short 'Vector Zero'",
    creatorId: "creator-2",
    creatorName: "Marcus Vance",
    creatorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&h=100&fit=crop",
    project: "Vector Zero (Production starts Aug 2026)",
    role: "Aria (Age 22-30) - Cybernetic engineer fighting isolation.",
    description: "Seeking a dynamic actress with experience in physically active roles. Aria is intensely focused, carrying emotional scars. She requires subtle expressions. The project will feature heavy VFX and greenscreen.",
    requirements: [
      "Must be based in London/willing to travel",
      "Prior acting experience in indie or theatrical productions",
      "Stunt or basic athletic choreography is a plus"
    ],
    location: "London, UK (Studio & On-location)",
    type: "Contract",
    datePosted: "June 20, 2026"
  },
  {
    id: "casting-2",
    title: "Composer / Sound Designer for 'Winter Melodies'",
    creatorId: "creator-1",
    creatorName: "Elena Rostova",
    creatorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&h=100&fit=crop",
    project: "Winter Melodies (Indie drama film)",
    role: "Lead Composer / Foley Artist",
    description: "Looking for an experimental pianist/ambient composer who can build a melancholic, soft, textured soundtrack using prepared pianos, cello, and field recordings. Sound design must mimic cold, snowy landscapes.",
    requirements: [
      "High-quality sample library & home studio setup",
      "Ability to sync audio to fine cut drafts",
      "Experience with ambient and neoclassical genres"
    ],
    location: "Remote",
    type: "Collaboration",
    datePosted: "June 22, 2026"
  }
];
