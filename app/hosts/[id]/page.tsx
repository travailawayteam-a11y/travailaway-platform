"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

type HostProfile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  country: string | null;
  city: string | null;
  bio: string | null;
  created_at: string | null;
  account_type: string | null;
};

type HostListing = {
  id: string;
  title: string;
  category: string;
  city: string | null;
  country: string;
  images: string[] | null;
};

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer_id: string;
};

type MyReview = {
  id: string;
  rating: number;
  comment: string | null;
  status: string;
};

type Stay = {
  id: string;
  listing_id: string;
};

function formatDate(value: string | null) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Stars({ value, size = "text-lg" }: { value: number; size?: string }) {
  const full = Math.round(value);
  return (
    <span className={`${size} font-bold text-[#d99a00]`} aria-label={`${value} out of 5`}>
      {"★".repeat(full)}
      <span className="text-gray-300">{"★".repeat(5 - full)}</span>
    </span>
  );
}

export default function HostPage() {
  const params = useParams<{ id: string }>();
  const hostId = String(params?.id ?? "");

  const [loading, setLoading] = useState(true);
  const [host, setHost] = useState<HostProfile | null>(null);
  const [listings, setListings] = useState<HostListing[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [names, setNames] = useState<Record<string, string>>({});
  const [meId, setMeId] = useState<string | null>(null);
  const [stay, setStay] = useState<Stay | null>(null);
  const [myReview, setMyReview] = useState<MyReview | null>(null);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const supabase = createClient();

        const { data: profile } = await supabase
          .from("profiles")
          .select("id, full_name, avatar_url, country, city, bio, created_at, account_type")
          .eq("id", hostId)
          .maybeSingle();

        if (!active) return;
        if (!profile || profile.account_type !== "host") {
          setHost(null);
          setLoading(false);
          return;
        }
        setHost(profile as HostProfile);

        const [listingResult, reviewResult, userResult] = await Promise.all([
          supabase
            .from("listings")
            .select("id, title, category, city, country, images")
            .eq("host_id", hostId)
            .eq("status", "published"),
          supabase
            .from("reviews")
            .select("id, rating, comment, created_at, reviewer_id")
            .eq("reviewee_id", hostId)
            .eq("status", "approved")
            .order("created_at", { ascending: false }),
          supabase.auth.getUser(),
        ]);

        if (!active) return;
        setListings((listingResult.data || []) as HostListing[]);

        const approved = (reviewResult.data || []) as Review[];
        setReviews(approved);

        const reviewerIds = Array.from(new Set(approved.map((item) => item.reviewer_id)));
        if (reviewerIds.length > 0) {
          const { data: people } = await supabase
            .from("profiles")
            .select("id, full_name")
            .in("id", reviewerIds);
          const map: Record<string, string> = {};
          ((people || []) as { id: string; full_name: string | null }[]).forEach((person) => {
            map[person.id] = person.full_name || "Traveller";
          });
          if (active) setNames(map);
        }

        const me = userResult.data.user;
        if (me && me.id !== hostId) {
          setMeId(me.id);

          const [stayResult, mineResult] = await Promise.all([
            supabase
              .from("stays")
              .select("id, listing_id")
              .eq("traveller_id", me.id)
              .eq("host_id", hostId)
              .limit(1)
              .maybeSingle(),
            supabase
              .from("reviews")
              .select("id, rating, comment, status")
              .eq("reviewer_id", me.id)
              .eq("reviewee_id", hostId)
              .order("created_at", { ascending: false })
              .limit(1)
              .maybeSingle(),
          ]);

          if (!active) return;
          setStay((stayResult.data as Stay | null) ?? null);
          setMyReview((mineResult.data as MyReview | null) ?? null);
        }
      } catch (err) {
        console.error("Host page failed:", err);
      }
      if (active) setLoading(false);
    }

    if (hostId) load();
    else setLoading(false);

    return () => {
      active = false;
    };
  }, [hostId]);

  async function submitReview(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (!meId || !stay) return;
    if (rating < 1) {
      setError("Please choose a star rating.");
      return;
    }
    const text = comment.trim();
    if (text.length < 10) {
      setError("Please write a few sentences about your experience.");
      return;
    }

    setSending(true);
    const supabase = createClient();
    const { error: insertError } = await supabase.from("reviews").insert({
      reviewer_id: meId,
      reviewee_id: hostId,
      listing_id: stay.listing_id,
      stay_id: stay.id,
      rating,
      comment: text,
    });

    if (insertError) {
      if (insertError.code === "23505") {
        setError("You have already reviewed this stay.");
      } else {
        setError("We could not send your review. Please try again.");
      }
    } else {
      setMyReview({ id: "new", rating, comment: text, status: "pending" });
      setComment("");
    }
    setSending(false);
  }

  const average =
    reviews.length > 0
      ? reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length
      : 0;

  const hostName = host?.full_name || "Host";
  const place = [host?.city, host?.country].filter(Boolean).join(", ");

  return (
    <main className="min-h-screen bg-[#fbf6ea] text-[#1f2a26]">
      <SiteHeader />

      <div className="mx-auto max-w-4xl px-4 py-10">
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : !host ? (
          <div className="rounded-3xl border border-[#e8dfc8] bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-[#0f3d2e]">Host not found</h1>
            <p className="mt-2 text-gray-600">This host page does not exist.</p>
            <Link
              href="/explore"
              className="mt-5 inline-block rounded-full bg-[#176b50] px-6 py-3 font-bold text-white hover:bg-[#0f3d2e]"
            >
              Explore opportunities
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <section className="rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
              <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
                {host.avatar_url ? (
                  <img
                    src={host.avatar_url}
                    alt={hostName}
                    className="h-28 w-28 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-[#176b50] text-4xl font-bold text-white">
                    {hostName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <h1 className="text-3xl font-bold text-[#0f3d2e]">{hostName}</h1>
                  {place && <p className="mt-1 text-gray-600">{place}</p>}
                  {host.created_at && (
                    <p className="mt-1 text-sm text-gray-500">
                      On Travailaway since {formatDate(host.created_at)}
                    </p>
                  )}
                  <p className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                    {reviews.length > 0 ? (
                      <>
                        <Stars value={average} />
                        <span className="text-sm font-semibold text-gray-700">
                          {average.toFixed(1)} · {reviews.length} review
                          {reviews.length === 1 ? "" : "s"}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm text-gray-500">No reviews yet</span>
                    )}
                  </p>
                </div>
              </div>

              {host.bio && (
                <p className="mt-6 whitespace-pre-line leading-7 text-gray-700">{host.bio}</p>
              )}
            </section>

            {listings.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-[#0f3d2e]">Opportunity</h2>
                <div className="mt-4 space-y-4">
                  {listings.map((item) => {
                    const cover = item.images?.find(Boolean);
                    return (
                      <Link
                        key={item.id}
                        href="/explore"
                        className="flex gap-4 rounded-3xl border border-[#e8dfc8] bg-white p-4 shadow-sm hover:bg-[#f3ecd9]"
                      >
                        {cover && (
                          <img
                            src={cover}
                            alt=""
                            className="h-24 w-32 shrink-0 rounded-2xl object-cover"
                          />
                        )}
                        <span className="min-w-0">
                          <span className="block text-xs font-bold uppercase tracking-wider text-[#176b50]">
                            {item.category}
                          </span>
                          <span className="mt-1 block font-bold text-[#17231f]">{item.title}</span>
                          <span className="mt-1 block text-sm text-gray-600">
                            {[item.city, item.country].filter(Boolean).join(", ")}
                          </span>
                          <span className="mt-2 block text-sm font-semibold text-[#176b50]">
                            View on Explore →
                          </span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            <section>
              <h2 className="text-2xl font-bold text-[#0f3d2e]">Reviews from travellers</h2>

              {reviews.length === 0 ? (
                <p className="mt-4 text-gray-600">
                  No reviews yet. Reviews appear here after a traveller completes a stay and the
                  Travailaway team approves the review.
                </p>
              ) : (
                <div className="mt-4 space-y-4">
                  {reviews.map((item) => (
                    <article
                      key={item.id}
                      className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-bold text-[#17231f]">
                          {names[item.reviewer_id] || "Traveller"}
                        </p>
                        <p className="text-xs text-gray-500">{formatDate(item.created_at)}</p>
                      </div>
                      <Stars value={item.rating} size="text-base" />
                      {item.comment && (
                        <p className="mt-2 whitespace-pre-line leading-7 text-gray-700">
                          {item.comment}
                        </p>
                      )}
                    </article>
                  ))}
                </div>
              )}

              {meId && (
                <div className="mt-6">
                  {myReview ? (
                    <div className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
                      <p className="font-bold text-[#17231f]">Your review</p>
                      <Stars value={myReview.rating} size="text-base" />
                      {myReview.comment && (
                        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-700">
                          {myReview.comment}
                        </p>
                      )}
                      <p className="mt-3 rounded-xl bg-[#f3ecd9] p-3 text-sm text-[#4a3a12]">
                        {myReview.status === "approved"
                          ? "Your review is published. Thank you!"
                          : myReview.status === "rejected"
                            ? "Your review was not published by our team."
                            : "Thank you! Your review is waiting for approval by the Travailaway team."}
                      </p>
                    </div>
                  ) : stay ? (
                    <form
                      onSubmit={submitReview}
                      className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm"
                    >
                      <p className="text-lg font-bold text-[#0f3d2e]">
                        Write a review of {hostName}
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        Your stay has been confirmed by our team. Share your honest experience to
                        help other travellers.
                      </p>

                      <div className="mt-4 flex items-center gap-1" role="radiogroup" aria-label="Rating">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <button
                            key={value}
                            type="button"
                            role="radio"
                            aria-checked={rating === value}
                            aria-label={`${value} star${value === 1 ? "" : "s"}`}
                            onClick={() => setRating(value)}
                            className={`text-4xl leading-none ${
                              value <= rating ? "text-[#d99a00]" : "text-gray-300"
                            }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>

                      <textarea
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        rows={5}
                        maxLength={1500}
                        placeholder="What was it like? What did you learn, and what did the host do well?"
                        className="mt-4 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#176b50]"
                      />

                      {error && (
                        <p role="alert" className="mt-3 text-sm font-semibold text-red-700">
                          {error}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={sending}
                        className="mt-4 rounded-full bg-[#176b50] px-6 py-2.5 font-bold text-white hover:bg-[#0f3d2e] disabled:opacity-60"
                      >
                        {sending ? "Sending..." : "Send review"}
                      </button>
                    </form>
                  ) : (
                    <p className="rounded-2xl bg-white p-4 text-sm text-gray-600 shadow-sm">
                      You can review this host after your stay has been confirmed by the
                      Travailaway team.
                    </p>
                  )}
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
