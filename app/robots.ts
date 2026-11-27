import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/dashboard", "/messages", "/api", "/auth"],
    },
    sitemap: "https://www.travailaway.info/sitemap.xml",
  };
}
