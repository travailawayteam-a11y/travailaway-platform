"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Props = {
  id: string;
  status: string;
  hostPaused: boolean;
};

export default function ListingActions({ id, status, hostPaused }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function changeStatus(next: "paused" | "published") {
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data, error: updateError } = await supabase
      .from("listings")
      .update({ status: next })
      .eq("id", id)
      .select("status")
      .maybeSingle();

    setLoading(false);

    if (updateError) {
      setError("We could not update this opportunity. Please try again.");
      return;
    }

    if (!data || data.status !== next) {
      setError(
        "This change was not allowed. If our team paused this opportunity, please contact us."
      );
      return;
    }

    router.refresh();
  }

  const buttonClass =
    "rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50";

  return (
    <div>
      {status === "published" && (
        <button
          type="button"
          onClick={() => changeStatus("paused")}
          disabled={loading}
          className={buttonClass}
        >
          {loading ? "Pausing..." : "Pause"}
        </button>
      )}

      {status === "paused" && hostPaused && (
        <button
          type="button"
          onClick={() => changeStatus("published")}
          disabled={loading}
          className="rounded-lg bg-[#176b50] px-4 py-2 text-sm font-semibold text-white hover:bg-[#104c3a] disabled:opacity-50"
        >
          {loading ? "Reactivating..." : "Reactivate"}
        </button>
      )}

      {error && (
        <p className="mt-2 rounded-lg bg-red-50 p-2 text-xs text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
