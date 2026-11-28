import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import PageBanner from "@/components/page-banner";

export const metadata: Metadata = {
  title: "Free travel tools | Travailaway",
  description:
    "Free tools for travellers: trip planner, budget planner, currency converter, packing list, time zone planner, travel journal and a checklist of questions to ask your host.",
};

const TOOLS: { title: string; text: string; href: string }[] = [
  {
    title: "My trip",
    text: "A countdown to your departure, a before-you-go checklist and your notes in one place.",
    href: "/my-trip",
  },
  {
    title: "Travel budget planner",
    text: "Add up flights, food, transport and activities, and see the total in another currency.",
    href: "/budget-planner",
  },
  {
    title: "Currency converter",
    text: "Convert between more than 35 currencies using the latest reference rates.",
    href: "/currency-converter",
  },
  {
    title: "Packing list",
    text: "A checklist for a stay with a host. Tick items off and add your own.",
    href: "/packing-list",
  },
  {
    title: "What to ask your host",
    text: "The questions to ask before you confirm a stay: work, hours, food, costs and safety.",
    href: "/host-checklist",
  },
  {
    title: "Time zone planner",
    text: "See the time at your host's place and find a good time to talk.",
    href: "/time-zones",
  },
  {
    title: "Travel journal",
    text: "A private diary with a new question every day. Saved on your own device.",
    href: "/travel-journal",
  },
];

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-white text-slate-800">
      <SiteHeader />

      <PageBanner
        image="https://images.unsplash.com/photo-1530047139082-5435ca3c4614?auto=format&fit=crop&w=1600&q=70"
        message="Plan it. Pack it. Go."
        subtitle="Free tools for your next adventure"
      />

      <section className="mx-auto max-w-4xl px-5 py-12 md:py-16">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#176b50]">
          Free travel tools
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[#17231f] sm:text-4xl">
          Tools to plan your trip
        </h1>
        <p className="mt-4 text-lg leading-8 text-gray-600">
          Simple, free tools to help you plan, budget and prepare for a stay
          with a host.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="block rounded-2xl border border-gray-200 p-5 transition hover:border-[#176b50] hover:shadow-sm"
            >
              <h2 className="text-lg font-bold text-[#17231f]">{tool.title}</h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">{tool.text}</p>
              <span className="mt-3 inline-block text-sm font-semibold text-[#176b50]">
                Open tool
              </span>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
