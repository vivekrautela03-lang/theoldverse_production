import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://theoldverse.com";
  
  const routes = [
    "",
    "/about",
    "/contact",
    "/projects",
    "/privacy",
    "/terms",
    "/cookies",
    "/accessibility",
    "/auth"
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
    changeFrequency: route === "" ? "daily" : "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));
}
