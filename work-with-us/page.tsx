import type { Metadata } from "next";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import VolunteerApplicationForm, {
  CONTRIBUTION_AREAS,
} from "@/components/volunteer-application-form";

export const metadata: Metadata = {
  title: "Work with us | Travailaway",
  description:
    "Volunteer your skills and help us build Travailaway. Different skills, different countries, one shared vision.",
};

const areaDescriptions: Record<string, string> = {
  technology: "Help us shape and improve the platform people use every day.",
  design: "Bring our brand, our pages and our stories to life visually.",
  marketing: "Help us reach travellers and hosts across the world.",
  travel_hospitality: "Share what you know about hosting, travel and welcoming guests.",
  business_partnerships: "Open doors to organisations that share our values.",
  community_impact: "Help us build a community that gives something back.",
  writing: "Tell the stories that make cultural exchange come alive.",
};

export default function WorkWithUsPage() {
  return (
    <main className="min-h-screen bg-[#f7faf8]">
      <SiteHeader />

      <section className="bg-[#104c3a] px-4 py-16 text-white md:py-24">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold leading-tight md:text-5xl">
            Different Skills. Different Countries. One Shared Vision.
            <span className="mt-2 block">
              Let&rsquo;s Build Travailaway Together.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-emerald-50">
            Travailaway is growing because of people who believe that travel
            can connect communities and cultures. If you would like to lend
            your skills to that vision, we would love to meet you, wherever in
            the world you are.
          </p>
          <a
            href="#apply"
            className="mt-8 inline-block rounded-full bg-white px-6 py-3 font-bold text-[#104c3a] hover:bg-emerald-50"
          >
            Apply to join us
          </a>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto max-w-4xl rounded-2xl border border-emerald-200 bg-[#eaf4ef] p-6 sm:p-8">
          <h2 className="text-xl font-bold text-[#104c3a]">
            Volunteer and collaboration opportunities, not paid jobs
          </h2>
          <p className="mt-3 leading-7 text-[#104c3a]">
            We want to be honest from the start: Travailaway is a young
            company and these are not paid job vacancies. We are inviting
            volunteers and collaborators who want to contribute their skills,
            grow their experience and help shape something from the beginning.
            Any future business partnership or equity arrangement would be
            discussed separately and transparently, and nothing on this page
            is a promise of payment, equity or employment.
          </p>
        </div>
      </section>

      <section className="px-4 pb-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-[#17231f]">
            Where you can contribute
          </h2>
          <p className="mt-2 text-gray-600">
            Choose the area that fits you best. If your skills cross several,
            tell us in your application.
          </p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {CONTRIBUTION_AREAS.map((area) => (
              <li
                key={area.value}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <h3 className="font-semibold text-[#17231f]">{area.label}</h3>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  {areaDescriptions[area.value]}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="apply" className="scroll-mt-24 px-4 pb-16">
        <div className="mx-auto max-w-xl">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-3xl font-bold text-[#17231f]">
              Tell us about yourself
            </h2>
            <p className="mt-2 mb-7 text-sm text-gray-600">
              It takes a few minutes. We read every application personally and
              will reply by email.
            </p>
            <VolunteerApplicationForm />
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
