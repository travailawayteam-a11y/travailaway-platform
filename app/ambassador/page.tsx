import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import PageBanner from "@/components/page-banner";

const duties = [
  "Champion cultural exchange and responsible, giving-back travel",
  "Share your travel stories and photos to inspire others to set out on their own journeys",
  "Welcome new members and help them feel at home in the community",
  "Represent Travailaway with honesty, respect and kindness",
];

const perks = [
  "A feature on our Ambassadors page and community channels",
  "An Ambassador badge on your Travailaway profile",
  "The chance to contribute stories and photos to our content",
  "A network of like-minded travellers and hosts around the world",
];

export default function AmbassadorPage() {
  return (
    <main className="min-h-screen bg-white text-slate-800">
      <SiteHeader />

      <PageBanner
        image="https://images.unsplash.com/photo-1521070207300-13a93726542b?auto=format&fit=crop&w=1600&q=70"
        message="Be the face of a global community."
        subtitle="Travel with purpose and inspire others to follow."
      />

      <section className="mx-auto max-w-3xl px-5 py-12 md:py-16">
        <span className="mb-4 inline-block rounded-full bg-emerald-50 px-4 py-1 text-sm font-semibold text-emerald-700">
          Applications open
        </span>

        <h1 className="text-3xl font-bold text-[#17231f] sm:text-4xl">
          Travailaway Ambassadors
        </h1>
        <p className="mt-4 text-lg leading-8 text-gray-600">
          Ambassadors are travellers and hosts who live our values every day:
          cultural exchange, respect for local communities and travel that
          gives something back. They share their experiences, encourage others
          to explore responsibly and help our community grow.
        </p>

        <div className="mt-10 space-y-10">
          <div>
            <h2 className="text-xl font-bold text-[#17231f]">
              Who can become an Ambassador?
            </h2>
            <p className="mt-2 leading-7 text-gray-600">
              Any active, positive and respectful member of Travailaway. You do
              not need a big following, just a genuine passion for meaningful
              travel and a wish to share it. Both travellers and hosts are
              welcome.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#17231f]">
              What Ambassadors do
            </h2>
            <ul className="mt-3 space-y-3 text-gray-600">
              {duties.map((item) => (
                <li key={item} className="flex gap-3 leading-7">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-700" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#17231f]">
              What to expect in return
            </h2>
            <ul className="mt-3 space-y-3 text-gray-600">
              {perks.map((item) => (
                <li key={item} className="flex gap-3 leading-7">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-700" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#17231f]">
              Ambassadors are members like you
            </h2>
            <p className="mt-2 leading-7 text-gray-600">
              Every Ambassador started as an ordinary member who believed that
              responsible travel can make a real difference to the places and
              people it touches. If that sounds like you, tell us a little
              about yourself and apply today.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            href="/ambassador/apply"
            className="inline-block rounded-full bg-emerald-700 px-7 py-3 font-bold text-white hover:bg-emerald-800"
          >
            Apply to become an Ambassador
          </Link>
          <Link
            href="/community"
            className="inline-block rounded-full border-2 border-emerald-700 px-7 py-3 font-bold text-emerald-800 hover:bg-emerald-50"
          >
            Our community
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
