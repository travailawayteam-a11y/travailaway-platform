import type { MetadataRoute } from "next";
import { INFO_PAGES } from "@/lib/info-pages";

const SITE = "https://www.travailaway.info";

// Pages Google should know about. Add new public pages here.
const PAGES = [
  "/",
  "/explore",
  "/membership",
  "/about",
  "/contact",
  "/ambassador",
  "/volunteer",
  "/volunteer-in-europe",
  "/register",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const info = Object.entries(INFO_PAGES)
    .filter(([, page]) => !page.comingSoon)
    .map(([slug]) => `/${slug}`);

  return Array.from(new Set([...PAGES, ...info])).map((path) => ({
    url: `${SITE}${path === "/" ? "" : path}`,
    lastModified: new Date(),
  }));
}
