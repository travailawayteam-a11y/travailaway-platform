import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export type GuideSection = { heading: string; body: string[] };

type Props = {
  kicker: string;
  title: string;
  intro: string;
  sections: GuideSection[];
  ctaTitle: string;
  ctaText: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
};

// One shared layout for our guide pages, so each guide is only its words.
export default function GuidePage({
  kicker,
  title,
  intro,
  sections,
  ctaTitle,
  ctaText,
  primary,
  secondary,
}: Props) {
  return (
    <main className="min-h-screen bg-white text-slate-800">
      <SiteHeader />

      <article className="mx-auto max-w-3xl px-5 py-12 md:py-16">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#176b50]">
          {kicker}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[#17231f] sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 text-lg leading-8 text-gray-600">{intro}</p>

        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-bold text-[#17231f]">
                {section.heading}
              </h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="mt-2 leading-7 text-gray-600">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-[#eaf4ef] p-6">
          <h2 className="text-xl font-bold text-[#104c3a]">{ctaTitle}</h2>
          <p className="mt-2 leading-7 text-[#104c3a]">{ctaText}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={primary.href}
              className="rounded-full bg-emerald-700 px-6 py-3 font-bold text-white hover:bg-emerald-800"
            >
              {primary.label}
            </Link>
            {secondary && (
              <Link
                href={secondary.href}
                className="rounded-full border border-emerald-700 px-6 py-3 font-bold text-emerald-800 hover:bg-white"
              >
                {secondary.label}
              </Link>
            )}
          </div>
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}
