"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import PageBanner from "@/components/page-banner";

type CompanionPost = {
  id: string;
  user_id: string;
  destination: string;
  from_country: string | null;
  start_date: string | null;
  end_date: string | null;
  flexible_dates: boolean;
  message: string;
  contact_method: string;
  status: string;
  created_at: string;
};

function formatDate(value: string | null) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function whenText(post: CompanionPost) {
  if (post.start_date && post.end_date) {
    return `${formatDate(post.start_date)} to ${formatDate(post.end_date)}`;
  }
  if (post.start_date) return `From ${formatDate(post.start_date)}`;
  return "Dates open";
}

export default function TravelBuddiesPage() {
  const [checking, setChecking] = useState(true);
  const [userId, setUserId] = useState("");
  const [posts, setPosts] = useState<CompanionPost[]>([]);
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
          .from("companion_posts")
          .select(
            "id, user_id, destination, from_country, start_date, end_date, flexible_dates, message, contact_method, status, created_at"
          )
          .order("created_at", { ascending: false });

        if (loadError) {
          setError("We could not load the listings right now.");
        } else {
          setPosts((data || []) as CompanionPost[]);
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
        image="https://images.unsplash.com/photo-1741789596805-2ec6fffd2002?auto=format&fit=crop&w=1600&q=70"
        message="The best journeys are shared."
        subtitle="Find someone to walk the road with."
        credit="Yoav Aziz"
      />

      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold text-[#17231f] md:text-4xl">
          Meet a travel companion
        </h1>
        <p className="mt-4 text-lg leading-8 text-gray-700">
          Planning a trip and would love some company? Post a listing about
          where you are heading and when, and let other travellers find you.
        </p>

        <Link
          href="/travel-buddies/new"
          className="mt-6 inline-block rounded-full bg-[#176b50] px-7 py-4 font-bold text-white hover:bg-[#104c3a]"
        >
          Post a listing to find a travel companion
        </Link>

        <h2 className="mt-14 text-2xl font-bold text-[#17231f]">
          Travellers looking for company
        </h2>

        {checking ? (
          <p className="mt-6 text-gray-600">Loading...</p>
        ) : !userId ? (
          <div className="mt-6 rounded-xl bg-[#eaf4ef] p-5 text-[#104c3a]">
            <p className="font-semibold">
              Log in or join Travailaway to see travellers looking for company.
            </p>
            <div className="mt-3 flex flex-wrap gap-5 font-semibold">
              <Link href="/login" className="underline">
                Log in
              </Link>
              <Link href="/register?type=traveller" className="underline">
                Join as a traveller
              </Link>
            </div>
          </div>
        ) : error ? (
          <p className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">{error}</p>
        ) : posts.length === 0 ? (
          <p className="mt-6 rounded-xl bg-white p-6 text-gray-600 shadow-sm">
            No listings yet. Be the first to post one!
          </p>
        ) : (
          <div className="mt-6 space-y-5">
            {posts.map((post) => (
              <article
                key={post.id}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                {post.status === "pending" && (
                  <p className="mb-3 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                    Awaiting review (only you can see this)
                  </p>
                )}
                {post.status === "closed" && (
                  <p className="mb-3 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                    Closed
                  </p>
                )}
                <h3 className="text-xl font-bold text-[#17231f]">
                  Heading to {post.destination}
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  {whenText(post)}
                  {post.flexible_dates ? " · Flexible dates" : ""}
                  {post.from_country ? ` · From ${post.from_country}` : ""}
                </p>
                <p className="mt-4 whitespace-pre-line leading-7 text-gray-700">
                  {post.message}
                </p>
                <p className="mt-4 rounded-lg bg-[#eaf4ef] p-3 text-sm text-[#104c3a]">
                  <span className="font-semibold">How to reach them: </span>
                  {post.contact_method}
                </p>
              </article>
            ))}
          </div>
        )}

        <p className="mt-10 text-sm leading-6 text-gray-600">
          Only logged-in members can see these listings. Our team reviews every
          new listing before it appears. Take care when you meet someone new:
          chat first, share plans with a friend and read our{" "}
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
