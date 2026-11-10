import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import PageBanner from "@/components/page-banner";

export const metadata: Metadata = {
  title: "Membership | Travailaway",
  description:
    "Travailaway traveller membership: Solo $49, Couple $59 or Family $69 for a full year. Your fee helps us run Travailaway.",
};

// Banner photo: Unsplash (Unsplash License), same free photo used on the
// Travel companions page.
const BANNER =
  "https://images.unsplash.com/photo-1758599668974-6da5d7cc6cc4?auto=format&fit=crop&w=1800&q=70";

const PLANS = [
  {
    name: "Solo",
    price: "$49",
    who: "For one traveller exploring on their own.",
  },
  {
    name: "Couple",
    price: "$59",
    who: "For two people travelling and sharing the experience together.",
    highlight: true,
  },
  {
    name: "Family",
    price: "$69",
    who: "For a family travelling and learning together.",
  },
];

const WHY_YOU_PAY = [
  {
    title: "Running Travailaway every day",
    body: "Your membership helps pay for the website, the hosting and the everyday operations that keep Travailaway online and working for everyone.",
  },
  {
    title: "Reviewing what goes on the site",
    body: "Our team reviews host opportunities and travel plans before they go live, so the community is made of real, thoughtful people.",
  },
  {
    title: "Support for our members",
    body: "Your fee supports the people who answer your questions and look after the community.",
  },
  {
    title: "Building what comes next",
    body: "Membership helps us keep improving Travailaway, adding new features and welcoming people from more countries.",
  },
];

const FAQ = [
