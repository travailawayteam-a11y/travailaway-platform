"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type PendingReview = {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer_id: string;
  reviewee_id: string;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ReviewsPanel() {
  const [reviews, setReviews] = useState<PendingReview[]>([]);
  const [names, setNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data, error: loadError } = await supabase
        .from("reviews")
        .select("id, rating, comment, created_at, reviewer_id, reviewee_id")
        .eq("status", "pending")
        .order("created_at", { ascending: true });

      if (loadError) {
        setError(loadError.message);
        setLoading(false);
        return;
      }

      const rows = (data || []) as PendingReview[];
      setReviews(rows);

      const ids = Array.from(
        new Set(rows.flatMap((row) => [row.reviewer_id, row.reviewee_id]))
      );
      if (ids.length > 0) {
        const { data: people } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", ids);
        const map: Record<string, string> = {};
        ((people || []) as { id: string; full_name: string | null }[]).forEach((person) => {
          map[person.id] = person.full_name || "Name not added";
        });
        setNames(map);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function decide(id: string, status: "approved" | "rejected") {
    setError("");
    setNotice("");
    setBusyId(id);

    const supabase = createClient();
    const { data, error: updateError } = await supabase
      .from("reviews")
      .update({ status })
      .eq("id", id)
      .select("status")
      .maybeSingle();

    if (updateError) {
      setError(updateError.message);
    } else if (!data || data.status !== status) {
      setError("The change was not saved. Please refresh the page and try again.");
    } else {
      setReviews((current) => current.filter((row) => row.id !== id));
      setNotice(status === "approved" ? "Review approved. It is now public." : "Review rejected.");
    }
    setBusyId("");
  }

  return (
    <section>
      <h2 className="text-2xl font-bold text-[#0f3d2e]">
        Reviews waiting for approval ({reviews.length})
      </h2>

      {error && (
        <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="mt-4 rounded-xl bg-[#e3f1e9] p-3 text-sm font-medium text-[#0f5a3f]">
          {notice}
        </p>
      )}

      {loading ? (
        <p className="mt-4 text-gray-600">Loading...</p>
      ) : reviews.length === 0 ? (
        <p className="mt-4 text-gray-600">Nothing waiting.</p>
      ) : (
        <div className="mt-4 space-y-4">
          {reviews.map((item) => (
            <article
              key={item.id}
              className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm"
            >
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-[#17231f]">
                  {names[item.reviewer_id] || "Traveller"}
                </span>{" "}
                reviewed host{" "}
                <span className="font-semibold text-[#17231f]">
                  {names[item.reviewee_id] || "Host"}
                </span>{" "}
                · {formatDate(item.created_at)}
              </p>
              <p className="mt-2 text-lg font-bold text-[#b7791f]">
                {"★".repeat(item.rating)}
                <span className="text-gray-300">{"★".repeat(5 - item.rating)}</span>
                <span className="ml-2 text-sm font-semibold text-gray-600">{item.rating} / 5</span>
              </p>
              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-700">
                {item.comment || "No written comment."}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={busyId === item.id}
                  onClick={() => decide(item.id, "approved")}
                  className="rounded-full bg-[#176b50] px-5 py-2 text-sm font-bold text-white hover:bg-[#0f3d2e] disabled:opacity-50"
                >
                  Approve
                </button>
                <button
                  type="button"
                  disabled={busyId === item.id}
                  onClick={() => decide(item.id, "rejected")}
                  className="rounded-full border border-red-300 px-5 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
