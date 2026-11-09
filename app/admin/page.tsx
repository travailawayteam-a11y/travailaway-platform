"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

type Listing = {
  id: string;
  title: string;
  category: string;
  country: string;
  city: string | null;
  description: string;
  images: string[] | null;
  created_at: string;
};

type CompanionPost = {
  id: string;
  destination: string;
  from_country: string | null;
  start_date: string | null;
  end_date: string | null;
  message: string;
  contact_method: string;
  created_at: string;
};

type Ambassador = {
  id: string;
  full_name: string;
  country: string;
  social_link: string | null;
  motivation: string;
  created_at: string;
};

export default function AdminPage() {
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [posts, setPosts] = useState<CompanionPost[]>([]);
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([]);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setChecking(false);
        return;
      }

      const { data: adminRow } = await supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!adminRow) {
        setChecking(false);
        return;
      }

      setIsAdmin(true);

      const [l, p, a] = await Promise.all([
        supabase
          .from("listings")
          .select("id, title, category, country, city, description, images, created_at")
          .eq("status", "draft")
          .order("created_at", { ascending: true }),
        supabase
          .from("companion_posts")
          .select("id, destination, from_country, start_date, end_date, message, contact_method, created_at")
          .eq("status", "pending")
          .order("created_at", { ascending: true }),
        supabase
          .from("ambassador_applications")
          .select("id, full_name, country, social_link, motivation, created_at")
          .eq("status", "pending")
          .order("created_at", { ascending: true }),
      ]);

      if (l.error || p.error || a.error) {
        setError("Some items could not be loaded. Please refresh the page.");
      }

      setListings((l.data || []) as Listing[]);
      setPosts((p.data || []) as CompanionPost[]);
      setAmbassadors((a.data || []) as Ambassador[]);
      setChecking(false);
    }

    load();
  }, []);

  async function setStatus(
    table: "listings" | "companion_posts" | "ambassador_applications",
    id: string,
    status: string
  ) {
    setError("");
    setBusyId(id);

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from(table)
      .update({ status })
      .eq("id", id);

    if (updateError) {
      setError(updateError.message);
    } else if (table === "listings") {
      setListings((current) => current.filter((item) => item.id !== id));
    } else if (table === "companion_posts") {
      setPosts((current) => current.filter((item) => item.id !== id));
    } else {
      setAmbassadors((current) => current.filter((item) => item.id !== id));
    }

    setBusyId("");
  }

  const approveClass =
    "rounded-lg bg-[#176b50] px-4 py-2 text-sm font-semibold text-white hover:bg-[#104c3a] disabled:opacity-50";
  const declineClass =
    "rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50";

  return (
    <main className="min-h-screen bg-[#f7faf8]">
      <SiteHeader />

      <div className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-bold text-[#17231f]">Team review</h1>
        <p className="mt-2 text-gray-600">
          Approve what is ready to go live on Travailaway.
        </p>

        {checking ? (
          <p className="mt-8 text-gray-600">Loading...</p>
        ) : !isAdmin ? (
          <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
            <p className="font-semibold text-[#17231f]">
              This page is for the Travailaway team.
            </p>
            <p className="mt-2 text-sm text-gray-600">
              If you are on the team, please log in with your team account.
            </p>
            <div className="mt-4 flex gap-5 font-semibold text-[#176b50]">
              <Link href="/login" className="underline">
                Log in
              </Link>
              <Link href="/" className="underline">
                Home
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-8 space-y-12">
            {error && (
              <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
                {error}
              </p>
            )}

            <section>
              <h2 className="text-2xl font-bold text-[#17231f]">
                Opportunities awaiting review ({listings.length})
              </h2>
              {listings.length === 0 ? (
                <p className="mt-4 text-gray-600">Nothing waiting.</p>
              ) : (
                <div className="mt-4 space-y-4">
                  {listings.map((item) => (
                    <article key={item.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                      {item.images && item.images.length > 0 && (
                        <img
                          src={item.images[0]}
                          alt=""
                          className="mb-4 h-48 w-full rounded-xl object-cover"
                        />
                      )}
                      <h3 className="text-xl font-bold text-[#17231f]">{item.title}</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {item.category} · {item.city ? `${item.city}, ` : ""}
                        {item.country}
                      </p>
                      <p className="mt-3 whitespace-pre-line text-sm leading-6 text-gray-700">
                        {item.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <button
                          type="button"
                          disabled={busyId === item.id}
                          onClick={() => setStatus("listings", item.id, "published")}
                          className={approveClass}
                        >
                          Approve and publish
                        </button>
                        <button
                          type="button"
                          disabled={busyId === item.id}
                          onClick={() => setStatus("listings", item.id, "paused")}
                          className={declineClass}
                        >
                          Not now (pause)
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#17231f]">
                Travel companion listings awaiting review ({posts.length})
              </h2>
              {posts.length === 0 ? (
                <p className="mt-4 text-gray-600">Nothing waiting.</p>
              ) : (
                <div className="mt-4 space-y-4">
                  {posts.map((item) => (
                    <article key={item.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                      <h3 className="text-xl font-bold text-[#17231f]">
                        Heading to {item.destination}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {item.start_date || "Dates open"}
                        {item.end_date ? ` to ${item.end_date}` : ""}
                        {item.from_country ? ` · From ${item.from_country}` : ""}
                      </p>
                      <p className="mt-3 whitespace-pre-line text-sm leading-6 text-gray-700">
                        {item.message}
                      </p>
                      <p className="mt-3 text-sm text-gray-600">
                        Contact: {item.contact_method}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <button
                          type="button"
                          disabled={busyId === item.id}
                          onClick={() => setStatus("companion_posts", item.id, "open")}
                          className={approveClass}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          disabled={busyId === item.id}
                          onClick={() => setStatus("companion_posts", item.id, "closed")}
                          className={declineClass}
                        >
                          Decline
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#17231f]">
                Ambassador applications ({ambassadors.length})
              </h2>
              {ambassadors.length === 0 ? (
                <p className="mt-4 text-gray-600">Nothing waiting.</p>
              ) : (
                <div className="mt-4 space-y-4">
                  {ambassadors.map((item) => (
                    <article key={item.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                      <h3 className="text-xl font-bold text-[#17231f]">{item.full_name}</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {item.country}
                        {item.social_link ? ` · ${item.social_link}` : ""}
                      </p>
                      <p className="mt-3 whitespace-pre-line text-sm leading-6 text-gray-700">
                        {item.motivation}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <button
                          type="button"
                          disabled={busyId === item.id}
                          onClick={() => setStatus("ambassador_applications", item.id, "approved")}
                          className={approveClass}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          disabled={busyId === item.id}
                          onClick={() => setStatus("ambassador_applications", item.id, "declined")}
                          className={declineClass}
                        >
                          Decline
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>

      <SiteFooter />
    </main>
  );
}
