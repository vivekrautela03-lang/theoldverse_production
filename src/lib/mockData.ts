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
  screenplay?: ScreenplaySegment[];
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

export interface ScreenplaySegment {
  id: string;
  time: number; // time in seconds
  character?: string; // character name, or undefined/empty for actions
  text: string;
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
  roleType: "casting" | "crew";
  budget: string;
  locationType: "Remote" | "On-Set" | "Hybrid";
}

export interface Review {
  id: string;
  mediaId: string;
  author: string;
  avatar: string;
  rating: number; // e.g. 0.5 to 5.0
  text: string;
  date: string;
  likes: number;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  creatorId: string; // creator who posted the job
  applicantName: string;
  applicantEmail: string;
  portfolioUrl: string;
  coverLetter: string;
  status: "pending" | "approved" | "declined";
  createdAt: string;
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

export const mockMediaItems: MediaItem[] = [
  {
    id: "media-coming-1",
    title: "THE LIGHT FROM NOWHERE",
    type: "original",
    category: "Originals",
    description: "Revolves around an unknown message that haunts the guy because of something from his past. A thriller / horror video.",
    duration: "Coming Soon",
    rating: "0.0",
    posterUrl: "/the_light_from_nowhere.jpg",
    bannerUrl: "/the_light_from_nowhere.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    creatorId: "creator-love",
    creatorName: "Shivanshi",
    isTrending: true,
    isOriginal: true,
    isHeroSlide: false,
    releaseDate: "Coming Soon",
    cast: ["Amarjeet"],
    crew: [
      { role: "Director", name: "Vivek Rautela" },
      { role: "Direct & Producer", name: "Shivanshi and Vivek Rautela" },
      { role: "Editor", name: "Shivansh Mourya" },
      { role: "Cameraman", name: "Prince and Ujjwal Gurung" },
      { role: "Production Team", name: "Ujjwal Gurung, Ujjwal Sangal and Prince" }
    ],
    gallery: ["/the_light_from_nowhere.jpg"]
  },
  {
    id: "media-coming-2",
    title: "NISHAAN",
    type: "original",
    category: "Originals",
    description: "A murder mystery thriller series. Some marks don't fade.",
    duration: "Coming Soon",
    rating: "0.0",
    posterUrl: "/chest_pain.jpg",
    bannerUrl: "/chest_pain.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    creatorId: "creator-love",
    creatorName: "Shivanshi",
    isTrending: true,
    isOriginal: true,
    isHeroSlide: false,
    releaseDate: "Coming Soon",
    cast: ["Amarjeet"],
    crew: [
      { role: "Director & Producer", name: "Vivek Rautela" },
      { role: "Assistant Director", name: "Priya Karanwal" },
      { role: "Editors", name: "Shivanshi, Shivansh Mourya" },
      { role: "Cinematography", name: "Prince, Ujjwal Gurung" },
      { role: "Production Team", name: "Shivanshi (DOP), Ujjwal Gurung, Ujjwal Sangal" }
    ],
    gallery: ["/chest_pain.jpg"]
  },
  {
    id: "media-coming-3",
    title: "DESTINY",
    type: "original",
    category: "Originals",
    description: "In the pursuit of a love never meant to be... we find the one destiny always promised. Song: Line Without a Hook.",
    duration: "Coming Soon",
    rating: "0.0",
    posterUrl: "/nishaan.jpg",
    bannerUrl: "/nishaan.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    creatorId: "creator-love",
    creatorName: "Shivanshi",
    isTrending: true,
    isOriginal: true,
    isHeroSlide: true,
    releaseDate: "Coming Soon",
    cast: ["Sumit Chauhan", "Soundarya", "Soni", "Sonu", "Harendra"],
    crew: [
      { role: "Directed & Produced by", name: "Shivanshi & Vivek Rautela" },
      { role: "Assistant Director", name: "Rishika" },
      { role: "Editors", name: "Shivanshi & Shivansh Mourya" },
      { role: "Cinematography", name: "Prince & Ujjwal Gurung" },
      { role: "Production Team", name: "Ujjwal Gurung, Ujjwal Sangal & Prince" }
    ],
    gallery: ["/nishaan.jpg"]
  },
  {
    id: "media-love-1",
    title: "SILENCE GLANCES, GOLDEN MOMENTS",
    type: "original",
    category: "Music",
    description: "Where Hearts Meet and Time Stands Still. Destined to meet. The world felt the same, but everything changed in that one glance. Vibes shifted. Hearts knew. Time stood still. Love was all around. Song: Golden Brown by The Stranglers.",
    duration: "4m 15s",
    rating: "9.8",
    posterUrl: "/silence_glances_golden_moments.jpg",
    bannerUrl: "/silence_glances_golden_moments.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    creatorId: "creator-love",
    creatorName: "Shivanshi",
    isTrending: true,
    isOriginal: true,
    isHeroSlide: false,
    releaseDate: "Coming Soon",
    cast: ["Amarjeet", "Soundarya"],
    crew: [
      { role: "Director & Producer", name: "Shivanshi & Vivek Rautela" },
      { role: "Editor", name: "Shivanshi & Shivansh Mourya" },
      { role: "Cameramen", name: "Prince & Ujjwal Gurung" },
      { role: "Assistant Director", name: "Rishika" },
      { role: "Production Team", name: "Ujjwal Gurung, Ujjwal Sangal, Prince" }
    ],
    gallery: ["/silence_glances_golden_moments.jpg"],
    screenplay: [
      { id: "s1-1", time: 0, text: "[SCENE START] The steam rises slowly from a single cup of black coffee. The neon street light flickers through the rain-streaked window." },
      { id: "s1-2", time: 5, character: "AMARJEET (V.O.)", text: "They always tell you that love is a fire. A sudden blaze that consumes everything." },
      { id: "s1-3", time: 15, character: "SOUNDARYA", text: "Do you think it's going to rain all night?" },
      { id: "s1-4", time: 25, character: "AMARJEET", text: "I hope so. The city looks cleaner when it rains. Less... crowded." },
      { id: "s1-5", time: 35, character: "SOUNDARYA", text: "Or maybe it's just that people stay inside, hiding from each other." },
      { id: "s1-6", time: 48, text: "[ACTION] Soundarya wraps her hands around the warm mug, looking down. Amarjeet watches the reflection of the neon sign in her eyes." },
      { id: "s1-7", time: 60, character: "AMARJEET (V.O.)", text: "But I think they call this love... the silence. The electric gaps between words." },
      { id: "s1-8", time: 75, character: "SOUNDARYA", text: "Why did you come back?" },
      { id: "s1-9", time: 90, character: "AMARJEET", text: "Because I forgot how to breathe out there." },
      { id: "s1-10", time: 105, text: "[ACTION] A train rumbles on the elevated tracks outside, casting moving shadows across their faces." },
      { id: "s1-11", time: 120, character: "SOUNDARYA", text: "We can't stay here forever, Amar." },
      { id: "s1-12", time: 135, character: "AMARJEET", text: "Just until the coffee gets cold." }
    ]
  },
  {
    id: "media-love-2",
    title: "DESTINED",
    type: "original",
    category: "Music",
    description: "Based on the song 'I thought I saw your face today', revolving around how we are destined to someone and I couldn't help but fall in love again.",
    duration: "3m 50s",
    rating: "9.7",
    posterUrl: "/destined.jpg",
    bannerUrl: "/destined.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    creatorId: "creator-love",
    creatorName: "Shivanshi",
    isTrending: true,
    isOriginal: true,
    isHeroSlide: true,
    releaseDate: "Coming Soon",
    cast: ["Akshit Semwal", "Anjali Negi"],
    crew: [
      { role: "Directed & Produced by", name: "Shivanshi & Vivek Rautela" },
      { role: "Editor", name: "Shivanshi & Shivansh Mourya" },
      { role: "Cameraman", name: "Prince & Ujjwal Gurung" },
      { role: "Assistant Director", name: "Priya Karanwal" },
      { role: "Production Team", name: "Ujjwal Gurung, Ujjwal Sangal, Prince, Soundarya" }
    ],
    gallery: ["/destined.jpg"],
    screenplay: [
      { id: "s2-1", time: 0, text: "[SCENE START] An open road stretches under a golden, late-afternoon sky. Dry leaves blow across the tarmac." },
      { id: "s2-2", time: 6, character: "ANJALI (V.O.)", text: "I thought I saw your face today, in a crowd on the street. It was just a stranger with your jacket." },
      { id: "s2-3", time: 15, character: "AKSHIT", text: "You haven't changed the radio station. It's still playing that same song." },
      { id: "s2-4", time: 28, character: "ANJALI", text: "Some songs don't get old. They just get heavy." },
      { id: "s2-5", time: 40, character: "AKSHIT", text: "I missed you, Anjali." },
      { id: "s2-6", time: 50, text: "[ACTION] Anjali turns her head towards the passing trees, a faint smile playing on her lips." },
      { id: "s2-7", time: 62, character: "ANJALI (V.O.)", text: "And I couldn't help but fall in love again... with the memory of who we were." },
      { id: "s2-8", time: 80, character: "ANJALI", text: "We aren't those kids anymore, Akshit." },
      { id: "s2-9", time: 95, character: "AKSHIT", text: "Maybe not. But we're still driving the same road." }
    ]
  },
  {
    id: "media-music-1",
    title: "CHEST PAIN (I Love)",
    type: "original",
    category: "Music",
    description: "A music short clip. Destined to someone. Happy, childish, joyful.",
    duration: "Coming Soon",
    rating: "0.0",
    posterUrl: "/chest_pain_i_love.jpg",
    bannerUrl: "/chest_pain_i_love.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    creatorId: "creator-love",
    creatorName: "Shivanshi",
    isTrending: true,
    isOriginal: true,
    isHeroSlide: false,
    releaseDate: "Coming Soon",
    cast: ["Amarjeet", "Soni"],
    crew: [
      { role: "Directed & Produced by", name: "Shivanshi & Vivek Rautela" },
      { role: "Editor", name: "Shivanshi & Shivansh Mourya" },
      { role: "Cameraman", name: "Prince & Ujjwal Gurung" },
      { role: "Assistant Director", name: "Rishika" },
      { role: "Production Team", name: "Ujjwal Gurung, Ujjwal Sangal, Prince" }
    ],
    gallery: ["/chest_pain_i_love.jpg"]
  },
  {
    id: "media-music-2",
    title: "NAADANIYA",
    type: "original",
    category: "Music",
    description: "A music clip based on the song 'Dooron Dooron', capturing a serene story by the tower.",
    duration: "Coming Soon",
    rating: "0.0",
    posterUrl: "/naadaniya.png",
    bannerUrl: "/naadaniya.png",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    creatorId: "creator-love",
    creatorName: "Shivanshi",
    isTrending: true,
    isOriginal: true,
    isHeroSlide: false,
    releaseDate: "Coming Soon",
    cast: ["Harendra", "Jiya"],
    crew: [
      { role: "Directed & Produced by", name: "Shivanshi & Vivek Rautela" },
      { role: "Editor", name: "Vivek Rautela & Shivansh Mourya" },
      { role: "Cameraman", name: "Prince & Ujjwal Gurung" },
      { role: "Assistant Director", name: "Priya Karanwal" },
      { role: "Production Team", name: "Ujjwal Gurung, Ujjwal Sangal, Prince, Soundarya" }
    ],
    gallery: ["/naadaniya.png"]
  },
  {
    id: "media-music-3",
    title: "Chai or tum",
    type: "original",
    category: "Music",
    description: "A music clip based on the song 'Bade ache lagte hai'. Revolves around how we randomly met that one person with a cup of tea.",
    duration: "Coming Soon",
    rating: "0.0",
    posterUrl: "/chai_or_tum.jpg",
    bannerUrl: "/chai_or_tum.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    creatorId: "creator-love",
    creatorName: "Shivanshi",
    isTrending: true,
    isOriginal: true,
    isHeroSlide: false,
    releaseDate: "Coming Soon",
    cast: ["Soundarya", "Amarjeet"],
    crew: [
      { role: "Directed & Produced by", name: "Shivanshi & Vivek Rautela" },
      { role: "Editor", name: "AMANDHAMI & Shivansh Mourya" },
      { role: "Cameraman", name: "Prince & Ujjwal Gurung" },
      { role: "Assistant Director", name: "Rishika" },
      { role: "Production Team", name: "Ujjwal Gurung, Ujjwal Sangal, Prince, Soundarya" }
    ],
    gallery: ["/chai_or_tum.jpg"]
  },
  {
    id: "media-music-4",
    title: "OTHAIYADI PATHAYILA",
    type: "original",
    category: "Music",
    description: "A music clip based on the song, revolving around how we are destined to someone.",
    duration: "Coming Soon",
    rating: "0.0",
    posterUrl: "/othaiyadi_pathayila.jpg",
    bannerUrl: "/othaiyadi_pathayila.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    creatorId: "creator-love",
    creatorName: "Shivanshi",
    isTrending: true,
    isOriginal: true,
    isHeroSlide: false,
    releaseDate: "Coming Soon",
    cast: ["Soni", "Sumit Chauhan"],
    crew: [
      { role: "Directed & Produced by", name: "Shivanshi & Vivek Rautela" },
      { role: "Editor", name: "Shivanshi & Shivansh Mourya" },
      { role: "Cameraman", name: "Ujjwal Gurung & Prince" },
      { role: "Assistant Director", name: "Rishika" },
      { role: "Production Team", name: "Ujjwal Gurung, Ujjwal Sangal, Prince, Soundarya, Rishika" }
    ],
    gallery: ["/othaiyadi_pathayila.jpg"]
  },
  {
    id: "media-series-1",
    title: "KIRDAR AUR KHAT",
    type: "series",
    category: "Originals",
    description: "A series revolving around how we are destined to someone and the new journey of life.",
    duration: "Coming Soon",
    rating: "0.0",
    posterUrl: "/kirdar_aur_khat.jpg",
    bannerUrl: "/kirdar_aur_khat.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    creatorId: "creator-love",
    creatorName: "Shivanshi",
    isTrending: true,
    isOriginal: true,
    isHeroSlide: false,
    releaseDate: "Coming Soon",
    cast: ["Shivansh Mourya", "Sumit Chauhan", "That Girl (Secret)"],
    crew: [
      { role: "Directed & Produced by", name: "Shivanshi & Vivek Rautela" },
      { role: "Editor", name: "Shivansh Mourya" },
      { role: "Cameraman", name: "Prince & Ujjwal Gurung" },
      { role: "Assistant Director", name: "Rishika" },
      { role: "Production Team", name: "Ujjwal Gurung, Ujjwal Sangal, Prince, Soundarya" }
    ],
    gallery: ["/kirdar_aur_khat.jpg"]
  },
  {
    id: "media-music-5",
    title: "HERSELF",
    type: "original",
    category: "Music",
    description: "A music clip based on the song 'Until I found her' featuring Apeksha.",
    duration: "Coming Soon",
    rating: "0.0",
    posterUrl: "/herself.jpg",
    bannerUrl: "/herself.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    creatorId: "creator-love",
    creatorName: "Shivanshi",
    isTrending: true,
    isOriginal: true,
    isHeroSlide: false,
    releaseDate: "Coming Soon",
    cast: ["Apeksha"],
    crew: [
      { role: "Directed & Produced by", name: "Shivanshi & Vivek Rautela" },
      { role: "Editor", name: "Shivanshi & Shivansh Mourya" },
      { role: "Cameraman", name: "Shivanshi, Ujjwal Gurung & Prince" },
      { role: "Assistant Director", name: "Soundarya" },
      { role: "Production Team", name: "Ujjwal Gurung, Ujjwal Sangal & Prince, Soundarya, Priya Karanwal" }
    ],
    gallery: ["/herself.jpg"]
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
    datePosted: "June 20, 2026",
    roleType: "casting",
    budget: "$350 / Day",
    locationType: "On-Set"
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
    datePosted: "June 22, 2026",
    roleType: "crew",
    budget: "Profit Share",
    locationType: "Remote"
  },
  {
    id: "casting-3",
    title: "Director of Photography for 'Echoes of Silence'",
    creatorId: "creator-love",
    creatorName: "Shivanshi",
    creatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&h=100&fit=crop",
    project: "Echoes of Silence (Artistic indie drama)",
    role: "Cinematographer / DP",
    description: "Seeking a DP with an eye for high-contrast monochrome cinematography and natural lighting setups. You will collaborate closely with the director to establish the visual language of the short film.",
    requirements: [
      "Must own or have access to a cinema package (RED, ARRI, or Sony FX series)",
      "Strong portfolio of narrative short films",
      "Available for a 5-day shoot in Shimla, India"
    ],
    location: "Shimla, India (On-Location)",
    type: "Contract",
    datePosted: "June 24, 2026",
    roleType: "crew",
    budget: "$300 / Day",
    locationType: "On-Set"
  },
  {
    id: "casting-4",
    title: "Film Editor & Colorist for Neon Thriller",
    creatorId: "creator-2",
    creatorName: "Marcus Vance",
    creatorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&h=100&fit=crop",
    project: "Neon Monsoon: Director's Cut",
    role: "Lead Editor & Colorist",
    description: "Looking for an editor who excels at fast-paced action sequencing and color grading neon-drenched cyberpunk aesthetic. Experience with DaVinci Resolve is highly preferred.",
    requirements: [
      "Advanced knowledge of DaVinci Resolve & Premiere Pro",
      "Experience with visual effects integration and sound syncing",
      "Ability to handle 4K ProRes footage"
    ],
    location: "Remote",
    type: "Contract",
    datePosted: "June 25, 2026",
    roleType: "crew",
    budget: "$2,500 Flat",
    locationType: "Remote"
  }
];
