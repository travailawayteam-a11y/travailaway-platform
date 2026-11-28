import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import BudgetPlanner from "@/components/budget-planner";
import PageBanner from "@/components/page-banner";

export const metadata: Metadata = {
  title: "Travel budget planner | Travailaway",
  description:
    "Plan the cost of your trip: flights, food, transport and activities, with automatic currency conversion. Free and made for phones.",
};

export default function BudgetPlannerPage() {
  return (
    <main className="min-h-screen bg-white text-slate-800">
      <SiteHeader />

      <PageBanner
        image="https://images.unsplash.com/photo-1530047139082-5435ca3c4614?auto=format&fit=crop&w=1600&q=70"
        message="Plan it. Pack it. Go."
        subtitle="Free tools for your next adventure"
      />

      <section className="mx-auto max-w-3xl px-5 py-12 md:py-16">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#176b50]">
          Plan your trip
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[#17231f] sm:text-4xl">
          Travel budget planner
        </h1>
        <p className="mt-4 text-lg leading-8 text-gray-600">
          Add up what your trip might cost and see the total in another
          currency. Travelling through cultural exchange can lower your
          accommodation and food costs, so try it with a stay at a host.
        </p>

        <BudgetPlanner />

        <div className="mt-12 rounded-2xl border border-gray-200 p-5">
          <h2 className="text-lg font-bold text-[#17231f]">
            Looking for a host to stay with?
          </h2>
          <Link
            href="/explore"
            className="mt-3 inline-block rounded-full bg-emerald-700 px-6 py-3 font-bold text-white hover:bg-emerald-800"
          >
            Explore hosts
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
