import type { ReactNode } from "react";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

type Props = {
  kicker: string;
  title: string;
  intro: string;
  children: ReactNode;
};

// Shared page layout for our free travel tools.
export default function ToolShell({ kicker, title, intro, children }: Props) {
  return (
    <main className="min-h-screen bg-white text-slate-800">
      <SiteHeader />

      <section className="mx-auto max-w-3xl px-5 py-12 md:py-16">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#176b50]">
          {kicker}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[#17231f] sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 text-lg leading-8 text-gray-600">{intro}</p>

        {children}

        <div className="mt-12 rounded-2xl bg-[#eaf4ef] p-6">
          <h2 className="text-xl font-bold text-[#104c3a]">
            Ready to find your host?
          </h2>
          <p className="mt-2 leading-7 text-[#104c3a]">
            Browse welcoming hosts and start a conversation. It is free to
            create a profile.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/explore"
              className="rounded-full bg-emerald-700 px-6 py-3 font-bold text-white hover:bg-emerald-800"
            >
              Explore hosts
            </Link>
            <Link
              href="/tools"
              className="rounded-full border border-emerald-700 px-6 py-3 font-bold text-emerald-800 hover:bg-white"
            >
              More free tools
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
