"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import PageBanner from "@/components/page-banner";

type EventItem = {
  id: string;
  title: string;
  description: string;
  starts_at: string;
  country: string;
  city: string | null;
  venue: string | null;
  contact_method: string;
  status: string;
};

function whenText(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MeetupsPage() {
  const [checking, setChecking] = useState(true);
  const [userId, setUserId] = useState("");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);

        const { data, error: loadError } = await supabase
          .from("events")
          .select(
            "id, title, description, starts_at, country, city, venue, contact_method, status"
          )
          .gte("starts_at", new Date().toISOString())
          .order("starts_at", { ascending: true });

        if (loadError) {
          setError("We could not load the events right now.");
        } else {
          setEvents((data || []) as EventItem[]);
        }
      }

      setChecking(false);
    }

    load();
  }, []);

  return (
    <main className="min-h-screen bg-[#f7faf8]">
      <SiteHeader />

      <PageBanner
        image="https://images.unsplash.com/photo-1683772769298-b77177c029d8?auto=format&fit=crop&w=1600&q=70"
        message="Good company makes every place feel like home."
        subtitle="Meet fellow travellers and hosts in person."
        credit="Jon Tyson"
      />

      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold text-[#17231f] md:text-4xl">
          Gatherings &amp; events
        </h1>
        <p className="mt-4 text-lg leading-8 text-gray-700">
          Some of the best moments on the road happen over a shared meal. Host
          a gathering for travellers and hosts in your area, or find one to
          join.
        </p>

        <Link
          href="/meetups/new"
          className="mt-6 inline-block rounded-full bg-[#176b50] px-7 py-4 font-bold text-white hover:bg-[#104c3a]"
        >
          Host an event
        </Link>

        <h2 className="mt-14 text-2xl font-bold text-[#17231f]">
          Upcoming events
        </h2>

        {checking ? (
          <p className="mt-6 text-gray-600">Loading...</p>
        ) : !userId ? (
          <div className="mt-6 rounded-xl bg-[#eaf4ef] p-5 text-[#104c3a]">
            <p className="font-semibold">
              Log in or join Travailaway to see upcoming events.
            </p>
            <div className="mt-3 flex flex-wrap gap-5 font-semibold">
              <Link href="/login" className="underline">
                Log in
              </Link>
              <Link href="/register" className="underline">
                Join Travailaway
              </Link>
            </div>
          </div>
        ) : error ? (
          <p className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">{error}</p>
        ) : events.length === 0 ? (
          <p className="mt-6 rounded-xl bg-white p-6 text-gray-600 shadow-sm">
            No upcoming events yet. Be the first to host one!
          </p>
        ) : (
          <div className="mt-6 space-y-5">
            {events.map((event) => (
              <article
                key={event.id}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                {event.status === "pending" && (
                  <p className="mb-3 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                    Awaiting review (only you can see this)
                  </p>
                )}
                {event.status === "cancelled" && (
                  <p className="mb-3 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                    Cancelled
                  </p>
                )}
                <h3 className="text-xl font-bold text-[#17231f]">
                  {event.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  {whenText(event.starts_at)}
                  {" · "}
                  {[event.venue, event.city, event.country]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                <p className="mt-4 whitespace-pre-line leading-7 text-gray-700">
                  {event.description}
                </p>
                <p className="mt-4 rounded-lg bg-[#eaf4ef] p-3 text-sm text-[#104c3a]">
                  <span className="font-semibold">How to join: </span>
                  {event.contact_method}
                </p>
              </article>
            ))}
          </div>
        )}

        <p className="mt-10 text-sm leading-6 text-gray-600">
          Only logged-in members can see these events. Our team reviews every
          new event before it appears. When you meet new people, choose public
          places, tell a friend where you are going and read our{" "}
          <Link href="/safety" className="font-semibold underline">
            safety guide
          </Link>
          .
        </p>
      </div>

      <SiteFooter />
    </main>
  );
}
