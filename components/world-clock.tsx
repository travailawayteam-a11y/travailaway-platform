"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CITIES, timeIn, dayIn } from "@/lib/time-zones";

const SHOWN = ["Kampala", "London", "Rome", "New York", "Dubai", "Tokyo"];

const TOOLS: { title: string; text: string; href: string }[] = [
  { title: "My trip", text: "Countdown, checklist and notes in one place.", href: "/my-trip" },
  { title: "Budget planner", text: "Add up what your trip will cost.", href: "/budget-planner" },
  { title: "Currency converter", text: "Latest rates for 35+ currencies.", href: "/currency-converter" },
  { title: "Packing list", text: "Tick off what to bring to your host.", href: "/packing-list" },
  { title: "Questions for your host", text: "What to ask before you confirm.", href: "/host-checklist" },
  { title: "Time zone planner", text: "Find a time to talk with your host.", href: "/time-zones" },
  { title: "Travel journal", text: "A private diary with a daily question.", href: "/travel-journal" },
  { title: "Travel guides", text: "Volunteer in Europe, Italy and France.", href: "/guides" },
];

// Home page section: links to our free tools, plus a strip of live clocks.
export default function WorldClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const cities = CITIES.filter((c) => SHOWN.includes(c.name));

  return (
    <section className="mx-auto max-w-7xl px-5 pt-20 md:px-8">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Free for every traveller
        </p>
        <h2 className="mt-2 text-3xl font-extrabold text-slate-900 md:text-4xl">
          Free tools for your trip
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-gray-600">
          Plan, budget and prepare. No sign-up needed.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="block rounded-2xl border border-gray-200 bg-white p-5 transition hover:-translate-y-1 hover:border-emerald-600 hover:shadow-md"
          >
            <h3 className="font-bold text-slate-900">{tool.title}</h3>
            <p className="mt-1 text-sm leading-6 text-gray-600">{tool.text}</p>
            <span className="mt-3 inline-block text-sm font-semibold text-emerald-700">
              Open
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-3xl bg-slate-900 p-6 text-white md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold md:text-2xl">
            What time is it where your host lives?
          </h2>
          <Link
            href="/time-zones"
            className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-bold text-slate-900 hover:bg-emerald-400"
          >
            Time zone planner
          </Link>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {cities.map((c) => (
            <div key={c.name} className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm text-emerald-200">{c.name}</p>
              <p className="mt-1 text-2xl font-extrabold">
                {now ? timeIn(c.zone, now) : "--:--"}
              </p>
              <p className="text-xs text-slate-300">
                {now ? dayIn(c.zone, now) : ""}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
