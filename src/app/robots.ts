import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin-console/",
        "/api/",
        "/dashboard/",
        "/upload/",
        "/profile/",
      ],
    },
    sitemap: "https://theoldverse.com/sitemap.xml",
  };
}
