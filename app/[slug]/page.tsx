import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/site-header";
import { INFO_PAGES } from "@/lib/info-pages";

export const dynamicParams = false;

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

  return (
    <main className="min-h-screen bg-white text-slate-800">
      <SiteHeader />

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

      <footer className="border-t bg-[#f7faf8] px-5 py-8 text-center text-sm text-gray-500">
        Travel. Connect. Experience.
      </footer>
    </main>
  );
}
