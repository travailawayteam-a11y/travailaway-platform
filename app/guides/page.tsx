import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Travel guides | Travailaway",
  description:
    "Free guides for travellers and hosts: volunteering in Europe, staying with hosts in Italy and France, and how to welcome volunteers.",
};

const GUIDES: { title: string; text: string; href: string; tag: string }[] = [
  {
    title: "Volunteer in Europe with free accommodation",
    text: "How to travel Europe on a small budget by helping hosts in return for a bed and meals.",
    href: "/volunteer-in-europe",
    tag: "For travellers",
  },
  {
    title: "Volunteer in Italy with free accommodation",
    text: "Farms, vineyards and guesthouses across the Italian countryside, and how to choose a host.",
    href: "/volunteer-in-italy",
    tag: "For travellers",
  },
  {
    title: "Volunteer in France with free accommodation",
    text: "From countryside farms to village projects: what to expect and how to find a good stay.",
    href: "/volunteer-in-france",
    tag: "For travellers",
  },
  {
    title: "How to get volunteers for your farm, hostel or project",
    text: "A simple guide for hosts: write a trusted listing, choose the right people and make every stay work.",
    href: "/host-volunteers",
    tag: "For hosts",
  },
  {
    title: "List your place for free",
    text: "Set up your host listing in about five minutes and meet travellers who want to help and learn.",
    href: "/list-your-place",
    tag: "For hosts",
  },
];

export default function GuidesPage() {
  return (
    <main className="min-h-screen bg-white text-slate-800">
      <SiteHeader />

      <section className="mx-auto max-w-4xl px-5 py-12 md:py-16">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#176b50]">
          Travel guides
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[#17231f] sm:text-4xl">
          Guides for travellers and hosts
        </h1>
        <p className="mt-4 text-lg leading-8 text-gray-600">
          Simple, honest advice on travelling through cultural exchange and on
          welcoming travellers into your home or project.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {GUIDES.map((guide) => (
            <Link
              key={guide.href}
              href={guide.href}
              className="block rounded-2xl border border-gray-200 p-5 transition hover:border-[#176b50] hover:shadow-sm"
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-[#176b50]">
                {guide.tag}
              </span>
              <h2 className="mt-2 text-lg font-bold text-[#17231f]">
                {guide.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">{guide.text}</p>
              <span className="mt-3 inline-block text-sm font-semibold text-[#176b50]">
                Read the guide
              </span>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
