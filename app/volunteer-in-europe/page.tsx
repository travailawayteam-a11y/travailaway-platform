import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Volunteer in Europe with free accommodation | Travailaway",
  description:
    "How to travel Europe on a small budget by helping hosts in return for a bed and meals. What to expect, how to choose a host, and how to start.",
};

const SECTIONS: { heading: string; body: string[] }[] = [
  {
    heading: "How it works",
    body: [
      "Many hosts across Europe welcome travellers who give a few hours of help a day. In return the host usually offers a bed, often meals, and a real look at local life. It is an exchange of time and skills, not a paid job and not a holiday rental.",
      "Hosts include family farms, vineyards, guesthouses, hostels, community gardens, language schools and small projects. Every host sets their own terms, so always read the listing and agree the details before you travel.",
    ],
  },
  {
    heading: "What kind of help do hosts ask for?",
    body: [
      "Typical tasks include gardening and farm work, helping in a guesthouse or hostel, painting and light building work, caring for animals, cooking, helping with a family's children by speaking your language, and helping with simple online tasks such as photos or social media.",
      "Hours differ from host to host. Many ask for a few hours a day on most days of the week, which leaves time to explore. Ask for the exact hours, days off and tasks in writing before you agree.",
    ],
  },
  {
    heading: "Where to start",
    body: [
      "Warm, rural areas with many small farms and guesthouses, such as parts of Italy, Spain, Portugal and France, are popular starting points. Smaller towns often have hosts who value long stays and are happy to teach you something local.",
      "Choose by what you want to learn or do, not only by the country. A two to four week stay usually lets you settle in, be useful, and still travel afterwards.",
    ],
  },
  {
    heading: "How to choose a good host",
    body: [
      "Read the whole listing. Look for clear hours, a clear description of the room and meals, and honest photos. Send a friendly message with a few lines about yourself, your skills and your dates, and ask any questions you have.",
      "A good host replies clearly, is open about expectations, and does not ask you to pay for a place to work. If anything feels unclear or uncomfortable, ask more questions or choose another host.",
    ],
  },
  {
    heading: "Rules and paperwork",
    body: [
      "Rules about volunteering and unpaid stays are different in every country, and they depend on your nationality and how long you stay. Before you book, check the official government website for the country you plan to visit, and keep your passport, visa if needed, travel insurance and emergency contacts in order.",
      "Travailaway introduces travellers and hosts. We cannot give legal or immigration advice, so please check the rules that apply to you.",
    ],
  },
  {
    heading: "Staying safe and happy",
    body: [
      "Tell someone you trust where you are staying. Agree on tasks, hours and what is provided before you arrive, keep your documents and money secure, and trust your instincts. You are always free to leave if something is not right.",
    ],
  },
];

export default function VolunteerInEuropePage() {
  return (
    <main className="min-h-screen bg-white text-slate-800">
      <SiteHeader />

      <article className="mx-auto max-w-3xl px-5 py-12 md:py-16">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#176b50]">
          Travel guide
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[#17231f] sm:text-4xl">
          Volunteer in Europe with free accommodation
        </h1>
        <p className="mt-4 text-lg leading-8 text-gray-600">
          You can travel Europe on a small budget by sharing a little of your
          time and skills with a welcoming host. Here is how it works, what to
          expect, and how to find a stay that suits you.
        </p>

        <div className="mt-10 space-y-8">
          {SECTIONS.map((section) => (
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
          <h2 className="text-xl font-bold text-[#104c3a]">
            Ready to find your host?
          </h2>
          <p className="mt-2 leading-7 text-[#104c3a]">
            Create a free traveller profile, browse hosts and start a
            conversation. Are you a host in Europe? List your place for free
            and meet travellers who want to help and learn.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/explore"
              className="rounded-full bg-emerald-700 px-6 py-3 font-bold text-white hover:bg-emerald-800"
            >
              Explore hosts
            </Link>
            <Link
              href="/register?type=host"
              className="rounded-full border border-emerald-700 px-6 py-3 font-bold text-emerald-800 hover:bg-white"
            >
              Become a host
            </Link>
          </div>
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}
