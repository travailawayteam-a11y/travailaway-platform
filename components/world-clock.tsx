"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CITIES, timeIn, dayIn } from "@/lib/time-zones";

const SHOWN = ["Kampala", "London", "Rome", "New York", "Dubai", "Tokyo"];

// A small strip of live clocks for the home page.
export default function WorldClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const cities = CITIES.filter((c) => SHOWN.includes(c.name));

  return (
    <section className="mx-auto max-w-7xl px-5 pt-16 md:px-8">
      <div className="rounded-3xl bg-slate-900 p-6 text-white md:p-8">
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
