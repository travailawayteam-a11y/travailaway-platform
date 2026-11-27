"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Subscriber = {
  email: string;
  source: string | null;
  created_at: string;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// A spreadsheet can run text that starts with these characters as a formula,
// so we put a quote in front of it when we build the download.
function safeCell(value: string) {
  const text = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${text.replace(/"/g, '""')}"`;
}

export default function NewsletterPanel() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data, error: loadError } = await supabase
        .from("newsletter_subscribers")
        .select("email, source, created_at")
        .is("unsubscribed_at", null)
        .order("created_at", { ascending: false })
        .limit(5000);

      if (loadError) {
        setError(loadError.message);
      } else {
        setSubscribers((data || []) as Subscriber[]);
      }
      setLoading(false);
    }
    load();
  }, []);

  function download() {
    const lines = ["email,source,subscribed_on"].concat(
      subscribers.map((item) =>
        [safeCell(item.email), safeCell(item.source || ""), safeCell(item.created_at.slice(0, 10))].join(",")
      )
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "travailaway-newsletter-subscribers.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <>
    <section>
      <h2 className="text-2xl font-bold text-[#0f3d2e]">Ambassador links</h2>
      <p className="mt-2 text-gray-600">
        Give each ambassador their own link and see who signed up through it.
      </p>
      <Link
        href="/admin/referrals"
        className="mt-4 inline-block rounded-full bg-[#176b50] px-6 py-2 text-sm font-bold text-white hover:bg-[#0f3d2e]"
      >
        Open ambassador links
      </Link>
    </section>

    <section>
      <h2 className="text-2xl font-bold text-[#0f3d2e]">
        Newsletter subscribers ({subscribers.length})
      </h2>

      {error && (
        <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-4 text-gray-600">Loading...</p>
      ) : subscribers.length === 0 ? (
        <p className="mt-4 text-gray-600">No subscribers yet.</p>
      ) : (
        <div className="mt-4 rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-600">Latest sign-ups:</p>
          <ul className="mt-2 space-y-1 text-sm text-[#17231f]">
            {subscribers.slice(0, 5).map((item) => (
              <li key={item.email}>
                <span className="font-semibold">{item.email}</span>{" "}
                <span className="text-gray-500">· {formatDate(item.created_at)}</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={download}
            className="mt-4 rounded-full bg-[#176b50] px-6 py-2 text-sm font-bold text-white hover:bg-[#0f3d2e]"
          >
            Download the full list (CSV)
          </button>
        </div>
      )}
    </section>
    </>
  );
}
