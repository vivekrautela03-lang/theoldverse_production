import { MetadataRoute } from "next";
import { mockMediaItems } from "@/lib/mockData";
import { ARTICLES_REGISTRY } from "@/data/resources";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://theoldverse-productions.in"; // Using the user's requested domain

  // Static site paths
  const staticPaths = [
    "",
    "/about",
    "/contact",
    "/terms",
    "/privacy",
    "/cookies",
    "/accessibility",
    "/resources",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : route === "/resources" ? 0.9 : 0.6,
  }));

  // Dynamic catalog paths based on our media database
  const mediaPaths = mockMediaItems.map((item) => ({
    url: `${baseUrl}/watch/${item.id}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Dynamic resource paths based on our SEO Knowledge Hub registry
  const resourcePaths = ARTICLES_REGISTRY.map((article) => ({
    url: `${baseUrl}/resources/${article.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPaths, ...mediaPaths, ...resourcePaths];
}
