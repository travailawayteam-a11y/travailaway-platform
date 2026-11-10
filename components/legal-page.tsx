import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

type Props = {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
};

export default function LegalPage({ title, updated, intro, sections }: Props) {
  return (
    <main className="min-h-screen bg-[#f7faf8]">
      <SiteHeader />

      <section className="bg-[#104c3a] px-4 py-14 text-white md:py-20">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold md:text-5xl">{title}</h1>
          <p className="mt-4 text-sm text-emerald-100">Last updated: {updated}</p>
        </div>
      </section>

      <section className="px-4 py-12">
        <article className="mx-auto max-w-3xl rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-10">
          <p className="text-lg leading-8 text-gray-700">{intro}</p>

          {sections.map((section, index) => (
            <div key={section.heading} className="mt-9">
              <h2 className="text-xl font-bold text-[#17231f]">
                {index + 1}. {section.heading}
              </h2>
              {section.paragraphs?.map((text) => (
                <p key={text} className="mt-3 leading-7 text-gray-700">
                  {text}
                </p>
              ))}
              {section.bullets && (
                <ul className="mt-3 list-disc space-y-2 pl-6 leading-7 text-gray-700">
                  {section.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </article>
      </section>

      <SiteFooter />
    </main>
  );
}
