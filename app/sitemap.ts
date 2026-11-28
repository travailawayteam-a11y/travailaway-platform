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
  "/host-volunteers",
  "/list-your-place",
  "/guides",
  "/budget-planner",
  "/tools",
  "/currency-converter",
  "/packing-list",
  "/host-checklist",
  "/my-trip",
  "/time-zones",
  "/travel-journal",
  "/volunteer-in-italy",
  "/volunteer-in-france",
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
