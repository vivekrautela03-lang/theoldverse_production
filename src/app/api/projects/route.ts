import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { mockMediaItems } from "@/lib/mockData";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    let query = supabaseAdmin
      .from("projects")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (featured === "true") {
      query = query.eq("is_featured", true);
    }

    if (category && category !== "All") {
      query = query.ilike("category", `%${category}%`);
    }

    const { data: dbProjects, error } = await query;

    if (error || !dbProjects || dbProjects.length === 0) {
      // Fallback to mock catalog if database table is empty or error
      let items = mockMediaItems;
      if (featured === "true") {
        items = items.filter(item => (item as any).isFeatured || item.isHeroSlide);
      }
      if (category && category !== "All") {
        items = items.filter(item => item.category.toLowerCase().includes(category.toLowerCase()));
      }
      return NextResponse.json({ success: true, projects: items, source: "fallback" });
    }

    // Map Supabase DB projects to public MediaItem structure
    const formattedProjects = dbProjects.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.short_description || p.full_description || p.description || "",
      category: p.category || "Film",
      rating: p.rating ? String(p.rating) : "9.0",
      year: p.release_date || (p.year ? String(p.year) : "2026"),
      duration: p.duration || "1h 45m",
      posterUrl: p.poster_url || "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=600&fit=crop",
      bannerUrl: p.banner_url || p.poster_url || "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200&fit=crop",
      videoUrl: p.trailer_url || p.video_url || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      director: p.director || "TheOldverse Studio",
      creatorId: "theoldverse-studio",
      creatorName: "TheOldverse Productions",
      creatorAvatar: "/favicon.png",
      views: p.views ? `${p.views}` : "1.2K",
      likes: p.likes ? `${p.likes}` : "950",
      isOriginal: p.is_original ?? true,
      isHeroSlide: p.is_featured || p.is_hero_slide || false,
      isFeatured: p.is_featured ?? false,
      isApproved: true,
      synopsis: p.full_description || p.short_description || p.description || "",
      cast: p.credits || p.cast || ["TheOldverse Ensemble"],
      crew: p.crew || [{ role: "Director", name: p.director || "Vivek Rautela" }]
    }));

    return NextResponse.json({ success: true, projects: formattedProjects, source: "database" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message, projects: mockMediaItems }, { status: 500 });
  }
}
