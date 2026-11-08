import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import PageBanner from "@/components/page-banner";
import { INFO_PAGES } from "@/lib/info-pages";

export const dynamicParams = false;

const IMG = "?auto=format&fit=crop&w=1600&q=70";

const BANNERS: Record<
  string,
  { image: string; message: string; subtitle: string; credit: string }
> = {
  "how-it-works": {
    image: "https://images.unsplash.com/photo-1697222564107-2ea14363f70d" + IMG,
    message: "Share your time. Gain a world.",
    subtitle: "A simple exchange between travellers and welcoming hosts.",
    credit: "Adrià Sánchez Roqué",
  },
  "travel-buddies": {
    image: "https://images.unsplash.com/photo-1741789596805-2ec6fffd2002" + IMG,
    message: "The best journeys are shared.",
    subtitle: "Find someone to walk the road with.",
    credit: "Yoav Aziz",
  },
  meetups: {
    image: "https://images.unsplash.com/photo-1683772769298-b77177c029d8" + IMG,
    message: "Good company makes every place feel like home.",
    subtitle: "Meet fellow travellers and hosts in person.",
    credit: "Jon Tyson",
  },
  "travel-and-learn": {
    image: "https://images.unsplash.com/photo-1697222564107-2ea14363f70d" + IMG,
    message: "Every stay is a lesson worth keeping.",
    subtitle: "Pick up new skills, languages and traditions.",
    credit: "Adrià Sánchez Roqué",
  },
  community: {
    image: "https://images.unsplash.com/photo-1686574086026-9f02b82f4765" + IMG,
    message: "Many cultures. One table.",
    subtitle: "Travellers and hosts, side by side.",
    credit: "Tobias Tullius",
  },
  "giving-back": {
    image: "https://images.unsplash.com/photo-1686574086026-9f02b82f4765" + IMG,
    message: "Leave every place better than you found it.",
    subtitle: "Travel that benefits the people who welcome you.",
    credit: "Tobias Tullius",
  },
  safety: {
    image: "https://images.unsplash.com/photo-1741789596805-2ec6fffd2002" + IMG,
    message: "Feel safe. Travel with confidence.",
    subtitle: "How we help everyone feel secure and respected.",
    credit: "Yoav Aziz",
  },
};

export function generateStaticParams() {
  return Object.keys(INFO_PAGES).map((slug) => ({ slug }));
}

export default async function InfoPageRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = INFO_PAGES[slug];

  if (!page) {
    notFound();
  }

  const banner = BANNERS[slug];

  return (
    <main className="min-h-screen bg-white text-slate-800">
      <SiteHeader />

      {banner && (
        <PageBanner
          image={banner.image}
          message={banner.message}
          subtitle={banner.subtitle}
          credit={banner.credit}
        />
      )}

      <section className="mx-auto max-w-3xl px-5 py-12 md:py-16">
        {page.comingSoon && (
          <span className="mb-4 inline-block rounded-full bg-amber-50 px-4 py-1 text-sm font-semibold text-amber-700">
            Coming soon
          </span>
        )}

        <h1 className="text-3xl font-bold text-[#17231f] sm:text-4xl">
          {page.title}
        </h1>
        <p className="mt-4 text-lg leading-8 text-gray-600">{page.intro}</p>

        <div className="mt-10 space-y-8">
          {page.sections.map((section) => (
            <div key={section.heading}>
              <h2 className="text-xl font-bold text-[#17231f]">
                {section.heading}
              </h2>
              <p className="mt-2 leading-7 text-gray-600">{section.body}</p>
            </div>
          ))}
        </div>

        <Link
          href={page.cta.href}
          className="mt-12 inline-block rounded-full bg-emerald-700 px-7 py-3 font-bold text-white hover:bg-emerald-800"
        >
          {page.cta.label}
        </Link>
      </section>

      <SiteFooter />
    </main>
  );
}
