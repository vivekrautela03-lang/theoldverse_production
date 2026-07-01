import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://theoldverse.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin-console/",
        "/dashboard/",
        "/profile/",
        "/upload/",
        "/api/"
      ]
    },
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
