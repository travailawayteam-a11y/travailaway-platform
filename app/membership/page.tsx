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
  {
    q: "How long does my membership last?",
    a: "The price covers a full year.",
  },
  {
    q: "Who receives my membership fee?",
    a: "Your fee goes to Travailaway to help run our operations. It is not a payment to hosts.",
  },
  {
    q: "Which plan should I choose?",
    a: "Choose Solo if you travel alone, Couple if you travel with a partner, and Family if you travel as a family.",
  },
];

export default function MembershipPage() {
  return (
    <main className="min-h-screen bg-[#f7faf8]">
      <SiteHeader />

      <PageBanner
        image={BANNER}
        message="One simple membership for travellers"
        subtitle="Choose the plan that fits how you travel."
      />

      <section className="px-4 py-14">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold text-[#17231f]">
            Choose your plan
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-gray-600">
            Every plan is a one-year membership for travellers.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-3xl border bg-white p-8 text-center shadow-sm ${
                  plan.highlight
                    ? "border-emerald-600 ring-2 ring-emerald-600"
                    : "border-gray-100"
                }`}
              >
                <h3 className="text-xl font-bold text-[#17231f]">{plan.name}</h3>
                <p className="mt-4 text-5xl font-extrabold text-[#104c3a]">
                  {plan.price}
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-500">
                  for one year
                </p>
                <p className="mt-5 leading-7 text-gray-600">{plan.who}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/register"
              className="inline-block rounded-full bg-emerald-700 px-8 py-4 font-bold text-white hover:bg-emerald-800"
            >
              Join Travailaway
            </Link>
            <p className="mt-3 text-sm text-gray-500">
              Create your account to get started.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-14">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold text-[#17231f]">
            What your membership fee is for
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-gray-600">
            We believe you should know exactly why you are paying. Your fee
            helps us run Travailaway.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {WHY_YOU_PAY.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-gray-100 bg-[#f7faf8] p-6"
              >
                <h3 className="font-bold text-[#17231f]">{item.title}</h3>
                <p className="mt-2 leading-7 text-gray-600">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-bold text-[#17231f]">
            Good to know
          </h2>
          <div className="mt-8 space-y-4">
            {FAQ.map((item) => (
              <div
                key={item.q}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <h3 className="font-bold text-[#17231f]">{item.q}</h3>
                <p className="mt-2 leading-7 text-gray-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
