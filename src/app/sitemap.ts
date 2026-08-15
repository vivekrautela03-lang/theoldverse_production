import { MetadataRoute } from "next";
import { mockMediaItems } from "@/lib/mockData";
import { ARTICLES_REGISTRY } from "@/data/resources";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://theoldverse-productions.in";

  // Founder profile paths
  const founderPaths: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/founders/vivek-rautela`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
      images: [
        `${baseUrl}/images/founders/vivek-rautela-founder-theoldverse-productions.webp`
      ]
    },
    {
      url: `${baseUrl}/founders/shivanshi-rauthan`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }
  ];

  // Static site paths
  const staticPaths: MetadataRoute.Sitemap = [
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

  // Dynamic catalog paths based on media database
  const mediaPaths: MetadataRoute.Sitemap = mockMediaItems.map((item) => ({
    url: `${baseUrl}/watch/${item.id}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Dynamic resource paths
  const resourcePaths: MetadataRoute.Sitemap = ARTICLES_REGISTRY.map((article) => ({
    url: `${baseUrl}/resources/${article.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPaths, ...founderPaths, ...mediaPaths, ...resourcePaths];
}
