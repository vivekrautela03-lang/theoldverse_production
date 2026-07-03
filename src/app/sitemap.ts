import { MetadataRoute } from "next";
import { mockMediaItems } from "@/lib/mockData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://theoldverse.com";

  // Static site paths
  const staticPaths = [
    "",
    "/about",
    "/contact",
    "/terms",
    "/privacy",
    "/cookies",
    "/accessibility",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.6,
  }));

  // Dynamic catalog paths based on our media database
  const mediaPaths = mockMediaItems.map((item) => ({
    url: `${baseUrl}/watch/${item.id}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPaths, ...mediaPaths];
}
