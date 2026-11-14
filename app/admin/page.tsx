"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

type Listing = {
  id: string;
  host_id: string;
  title: string;
  category: string;
  continent: string | null;
  region: string | null;
  country: string;
  city: string | null;
  description: string;
  accommodation: string | null;
  meals: string | null;
  hours_per_week: number | null;
  min_stay_weeks: number | null;
  max_stay_weeks: number | null;
  skills: string[] | null;
  benefits: string[] | null;
  images: string[] | null;
  status: string;
  rejection_reason: string | null;
  host_paused: boolean;
  created_at: string;
  published_at: string | null;
};

type HostProfile = {
  id: string;
  full_name: string | null;
  country: string | null;
  city: string | null;
  bio: string | null;
  created_at: string | null;
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

type Tab = "draft" | "published" | "paused" | "rejected";

const TABS: { id: Tab; label: string }[] = [
  { id: "draft", label: "Awaiting review" },
  { id: "published", label: "Live" },
  { id: "paused", label: "Paused" },
  { id: "rejected", label: "Needs changes" },
];

function formatDate(value: string | null) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminPage() {
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [hosts, setHosts] = useState<Record<string, HostProfile>>({});
  const [posts, setPosts] = useState<CompanionPost[]>([]);
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([]);
  const [tab, setTab] = useState<Tab>("draft");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busyId, setBusyId] = useState("");
  const [rejectId, setRejectId] = useState("");
  const [rejectReason, setRejectReason] = useState("");

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
          .select(
            "id, host_id, title, category, continent, region, country, city, description, accommodation, meals, hours_per_week, min_stay_weeks, max_stay_weeks, skills, benefits, images, status, rejection_reason, host_paused, created_at, published_at"
          )
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

      const loaded = (l.data || []) as Listing[];
      setListings(loaded);
      setPosts((p.data || []) as CompanionPost[]);
      setAmbassadors((a.data || []) as Ambassador[]);

      const hostIds = Array.from(new Set(loaded.map((item) => item.host_id)));
      if (hostIds.length > 0) {
        const { data: hostRows } = await supabase
          .from("profiles")
          .select("id, full_name, country, city, bio, created_at")
          .in("id", hostIds);

        const map: Record<string, HostProfile> = {};
        ((hostRows || []) as HostProfile[]).forEach((row) => {
          map[row.id] = row;
        });
        setHosts(map);
      }

      setChecking(false);
    }

    load();
  }, []);

  async function changeListing(
    item: Listing,
    patch: { status: string; rejection_reason?: string },
    doneMessage: string
  ) {
    setError("");
    setNotice("");
    setBusyId(item.id);

    const supabase = createClient();
    const { data, error: updateError } = await supabase
      .from("listings")
      .update(patch)
      .eq("id", item.id)
      .select("status, rejection_reason, host_paused, published_at")
      .maybeSingle();

    if (updateError) {
      setError(updateError.message);
    } else if (!data || data.status !== patch.status) {
      setError("The change was not saved. Please refresh the page and try again.");
    } else {
      setListings((current) =>
        current.map((row) =>
          row.id === item.id
            ? {
                ...row,
                status: data.status,
                rejection_reason: data.rejection_reason ?? null,
                host_paused: Boolean(data.host_paused),
                published_at: data.published_at ?? null,
              }
            : row
        )
      );
      setNotice(doneMessage);
      setRejectId("");
      setRejectReason("");
    }

    setBusyId("");
  }

  async function setStatus(
    table: "companion_posts" | "ambassador_applications",
    id: string,
    status: string
  ) {
    setError("");
    setNotice("");
    setBusyId(id);

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from(table)
      .update({ status })
      .eq("id", id);

    if (updateError) {
      setError(updateError.message);
    } else if (table === "companion_posts") {
      setPosts((current) => current.filter((item) => item.id !== id));
    } else {
      setAmbassadors((current) => current.filter((item) => item.id !== id));
    }

    setBusyId("");
  }

  const approveClass =
    "rounded-full bg-[#176b50] px-5 py-2 text-sm font-bold text-white hover:bg-[#0f3d2e] disabled:opacity-50";
  const declineClass =
    "rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50";
  const rejectClass =
    "rounded-full border border-red-300 px-5 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50";

  const counts: Record<Tab, number> = {
    draft: listings.filter((item) => item.status === "draft").length,
    published: listings.filter((item) => item.status === "published").length,
    paused: listings.filter((item) => item.status === "paused").length,
    rejected: listings.filter((item) => item.status === "rejected").length,
  };

  const visible = listings.filter((item) => item.status === tab);

  return (
    <main className="min-h-screen bg-[#fbf6ea]">
      <SiteHeader />

      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-3xl font-bold text-[#0f3d2e]">Team review</h1>
        <p className="mt-2 text-gray-600">
          Review what is ready to go live on Travailaway. Only the Travailaway team can see this page.
        </p>

        {checking ? (
          <p className="mt-8 text-gray-600">Loading...</p>
        ) : !isAdmin ? (
          <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
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
              <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700">
                {error}
              </p>
            )}
            {notice && (
              <p role="status" className="rounded-xl bg-[#e3f1e9] p-4 text-sm font-medium text-[#0f5a3f]">
                {notice}
              </p>
            )}

            <section>
              <h2 className="text-2xl font-bold text-[#0f3d2e]">Opportunities</h2>

              <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                {TABS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setTab(item.id);
                      setRejectId("");
                      setRejectReason("");
                    }}
                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${
                      tab === item.id
                        ? "bg-[#176b50] text-white"
                        : "border border-[#e8dfc8] bg-white text-[#1f2a26] hover:bg-[#f3ecd9]"
                    }`}
                  >
                    {item.label} ({counts[item.id]})
                  </button>
                ))}
              </div>

              {visible.length === 0 ? (
                <p className="mt-6 text-gray-600">Nothing here.</p>
              ) : (
                <div className="mt-4 space-y-5">
                  {visible.map((item) => {
                    const host = hosts[item.host_id];
                    const busy = busyId === item.id;

                    return (
                      <article
                        key={item.id}
                        className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="text-xl font-bold text-[#17231f]">{item.title}</h3>
                            <p className="mt-1 text-sm text-gray-600">
                              {item.category} · {item.city ? `${item.city}, ` : ""}
                              {item.country}
                            </p>
                          </div>
                          <p className="text-xs text-gray-500">
                            Submitted {formatDate(item.created_at)}
                            {item.published_at ? ` · Live since ${formatDate(item.published_at)}` : ""}
                          </p>
                        </div>

                        <div className="mt-3 rounded-2xl bg-[#f3ecd9] p-3 text-sm text-[#4a3a12]">
                          <p className="font-semibold">
                            Host: {host?.full_name || "Name not added"}
                          </p>
                          <p>
                            {[host?.city, host?.country].filter(Boolean).join(", ") ||
                              "Location not added"}
                            {host?.created_at ? ` · Joined ${formatDate(host.created_at)}` : ""}
                          </p>
                          {host?.bio && <p className="mt-1 whitespace-pre-line">{host.bio}</p>}
                        </div>

                        {item.status === "rejected" && item.rejection_reason && (
                          <p className="mt-3 rounded-2xl bg-red-50 p-3 text-sm text-red-800">
                            <span className="font-semibold">Reason sent to host: </span>
                            {item.rejection_reason}
                          </p>
                        )}
                        {item.status === "paused" && (
                          <p className="mt-3 text-sm text-gray-600">
                            {item.host_paused ? "Paused by the host." : "Paused by the team."}
                          </p>
                        )}

                        <details className="mt-4" open={item.status === "draft"}>
                          <summary className="cursor-pointer text-sm font-bold text-[#176b50]">
                            Full details and photos
                          </summary>

                          {item.images && item.images.length > 0 ? (
                            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                              {item.images.map((url, index) => (
                                <a
                                  key={url}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block overflow-hidden rounded-xl border border-gray-200"
                                >
                                  <img
                                    src={url}
                                    alt={`Photo ${index + 1}${index === 0 ? " (cover)" : ""}`}
                                    className="h-28 w-full object-cover"
                                  />
                                </a>
                              ))}
                            </div>
                          ) : (
                            <p className="mt-3 text-sm text-gray-500">No photos uploaded.</p>
                          )}

                          <p className="mt-4 whitespace-pre-line text-sm leading-6 text-gray-700">
                            {item.description}
                          </p>

                          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                            <div>
                              <dt className="text-gray-500">Location</dt>
                              <dd className="font-medium text-[#17231f]">
                                {[item.city, item.region, item.country, item.continent]
                                  .filter(Boolean)
                                  .join(", ")}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-gray-500">Accommodation</dt>
                              <dd className="font-medium text-[#17231f]">{item.accommodation || "Not set"}</dd>
                            </div>
                            <div>
                              <dt className="text-gray-500">Meals</dt>
                              <dd className="font-medium text-[#17231f]">{item.meals || "Not set"}</dd>
                            </div>
                            <div>
                              <dt className="text-gray-500">Hours per week</dt>
                              <dd className="font-medium text-[#17231f]">
                                {item.hours_per_week ?? "Not set"}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-gray-500">Stay</dt>
                              <dd className="font-medium text-[#17231f]">
                                {item.min_stay_weeks ?? "?"} to {item.max_stay_weeks ?? "?"} weeks
                              </dd>
                            </div>
                            <div>
                              <dt className="text-gray-500">Skills</dt>
                              <dd className="font-medium text-[#17231f]">
                                {item.skills && item.skills.length > 0 ? item.skills.join(", ") : "None listed"}
                              </dd>
                            </div>
                            <div className="sm:col-span-2">
                              <dt className="text-gray-500">Benefits</dt>
                              <dd className="font-medium text-[#17231f]">
                                {item.benefits && item.benefits.length > 0
                                  ? item.benefits.join(", ")
                                  : "None listed"}
                              </dd>
                            </div>
                          </dl>
                        </details>

                        {rejectId === item.id ? (
                          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4">
                            <label className="block text-sm font-bold text-red-800">
                              Tell the host what to change (they will see this)
                            </label>
                            <textarea
                              value={rejectReason}
                              onChange={(event) => setRejectReason(event.target.value)}
                              rows={3}
                              maxLength={500}
                              className="mt-2 w-full rounded-xl border border-red-200 bg-white px-3 py-2 text-sm outline-none focus:border-red-400"
                              placeholder="For example: Please add clearer photos of the accommodation."
                            />
                            <div className="mt-3 flex flex-wrap gap-3">
                              <button
                                type="button"
                                disabled={busy || rejectReason.trim().length < 5}
                                onClick={() =>
                                  changeListing(
                                    item,
                                    { status: "rejected", rejection_reason: rejectReason.trim() },
                                    "Sent back to the host with your reason."
                                  )
                                }
                                className="rounded-full bg-red-700 px-5 py-2 text-sm font-bold text-white hover:bg-red-800 disabled:opacity-50"
                              >
                                {busy ? "Sending..." : "Send rejection"}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setRejectId("");
                                  setRejectReason("");
                                }}
                                className={declineClass}
                              >
                                Cancel
                              </button>
                            </div>
                            {rejectReason.trim().length < 5 && (
                              <p className="mt-2 text-xs text-red-700">
                                Please write a short reason (at least 5 characters).
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="mt-4 flex flex-wrap gap-3">
                            {(item.status === "draft" || item.status === "rejected") && (
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() =>
                                  changeListing(item, { status: "published" }, "Approved. It is now live on Explore.")
                                }
                                className={approveClass}
                              >
                                {busy ? "Saving..." : "Approve and publish"}
                              </button>
                            )}
                            {item.status === "draft" && (
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => {
                                  setRejectId(item.id);
                                  setRejectReason("");
                                }}
                                className={rejectClass}
                              >
                                Reject with reason
                              </button>
                            )}
                            {item.status === "published" && (
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() =>
                                  changeListing(item, { status: "paused" }, "Paused. It is hidden from Explore.")
                                }
                                className={declineClass}
                              >
                                {busy ? "Saving..." : "Pause"}
                              </button>
                            )}
                            {item.status === "paused" && (
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() =>
                                  changeListing(item, { status: "published" }, "Reactivated. It is live on Explore again.")
                                }
                                className={approveClass}
                              >
                                {busy ? "Saving..." : "Reactivate"}
                              </button>
                            )}
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0f3d2e]">
                Travel companion listings awaiting review ({posts.length})
              </h2>
              {posts.length === 0 ? (
                <p className="mt-4 text-gray-600">Nothing waiting.</p>
              ) : (
                <div className="mt-4 space-y-4">
                  {posts.map((item) => (
                    <article key={item.id} className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
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
              <h2 className="text-2xl font-bold text-[#0f3d2e]">
                Ambassador applications ({ambassadors.length})
              </h2>
              {ambassadors.length === 0 ? (
                <p className="mt-4 text-gray-600">Nothing waiting.</p>
              ) : (
                <div className="mt-4 space-y-4">
                  {ambassadors.map((item) => (
                    <article key={item.id} className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
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
