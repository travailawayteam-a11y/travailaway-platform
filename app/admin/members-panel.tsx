"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Found = {
  user_id: string;
  email: string;
  full_name: string | null;
  account_type: string | null;
  plan: string | null;
  expires_at: string | null;
  active: boolean;
};

type LiveListing = {
  id: string;
  title: string;
  city: string | null;
  country: string;
};

function formatDate(value: string | null) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function MembersPanel() {
  const [email, setEmail] = useState("");
  const [found, setFound] = useState<Found | null>(null);
  const [searched, setSearched] = useState(false);
  const [listings, setListings] = useState<LiveListing[]>([]);
  const [plan, setPlan] = useState("solo");
  const [reference, setReference] = useState("");
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    async function loadListings() {
      const supabase = createClient();
      const { data } = await supabase
        .from("listings")
        .select("id, title, city, country")
        .eq("status", "published")
        .order("created_at", { ascending: true });
      setListings((data || []) as LiveListing[]);
    }
    loadListings();
  }, []);

  async function findTraveller() {
    setError("");
    setNotice("");
    setFound(null);
    setSearched(false);

    if (!email.trim()) {
      setError("Please type the traveller's email.");
      return;
    }

    setBusy("find");
    const supabase = createClient();
    const { data, error: rpcError } = await supabase.rpc("admin_find_traveller", {
      p_email: email.trim(),
    });

    if (rpcError) {
      setError(rpcError.message);
    } else {
      const rows = (data || []) as Found[];
      setFound(rows.length > 0 ? rows[0] : null);
      setSearched(true);
    }
    setBusy("");
  }

  async function grantMembership() {
    if (!found) return;
    setError("");
    setNotice("");

    if (!reference.trim()) {
      setError("Please enter the payment reference first.");
      return;
    }

    setBusy("grant");
    const supabase = createClient();
    const { data, error: rpcError } = await supabase.rpc("admin_grant_membership", {
      p_user_id: found.user_id,
      p_plan: plan,
      p_reference: reference.trim(),
    });

    if (rpcError) {
      setError(rpcError.message);
    } else {
      const expires = typeof data === "string" ? data : null;
      setFound({ ...found, plan, expires_at: expires, active: true });
      setReference("");
      setNotice(`Membership activated until ${formatDate(expires)}.`);
    }
    setBusy("");
  }

  async function connect() {
    if (!found) return;
    setError("");
    setNotice("");

    setBusy("connect");
    const supabase = createClient();
    const { data, error: rpcError } = await supabase.rpc("admin_connect_traveller_to_all", {
      p_traveller_id: found.user_id,
    });

    if (rpcError) {
      setError(rpcError.message);
    } else {
      const added = typeof data === "number" ? data : 0;
      setNotice(
        added > 0
          ? `Connected to ${added} new opportunit${added === 1 ? "y" : "ies"}. The conversations now show in Messages for the traveller and the hosts.`
          : "Already connected to every live opportunity. Nothing new to add."
      );
    }
    setBusy("");
  }

  const isHost = found?.account_type === "host";

  return (
    <section>
      <h2 className="text-2xl font-bold text-[#0f3d2e]">Members and connections</h2>
      <p className="mt-1 text-sm text-gray-600">
        After a traveller has paid, activate their membership here and connect them to a host.
      </p>

      <div className="mt-4 rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
        <label className="block text-sm font-bold text-[#17231f]">Traveller's email</label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="traveller@example.com"
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#176b50]"
          />
          <button
            type="button"
            onClick={findTraveller}
            disabled={busy === "find"}
            className="shrink-0 rounded-full bg-[#176b50] px-6 py-2 text-sm font-bold text-white hover:bg-[#0f3d2e] disabled:opacity-50"
          >
            {busy === "find" ? "Searching..." : "Find"}
          </button>
        </div>

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

        {searched && !found && (
          <p className="mt-4 text-sm text-gray-600">
            No account was found with that email. Ask the traveller to sign up first.
          </p>
        )}

        {found && (
          <div className="mt-5 space-y-5">
            <div className="rounded-2xl bg-[#f3ecd9] p-4 text-sm text-[#4a3a12]">
              <p className="font-semibold">{found.full_name || "Name not added"}</p>
              <p>{found.email}</p>
              <p className="mt-1">
                Account type: {found.account_type || "unknown"}
              </p>
              <p>
                Membership:{" "}
                {found.active
                  ? `Active (${found.plan}) until ${formatDate(found.expires_at)}`
                  : found.plan
                    ? `Expired on ${formatDate(found.expires_at)}`
                    : "None"}
              </p>
            </div>

            {isHost ? (
              <p className="text-sm text-gray-600">
                This is a host account. Hosts do not need a membership.
              </p>
            ) : (
              <>
                {!found.active && (
                  <div className="rounded-2xl border border-[#e8dfc8] p-4">
                    <p className="text-sm font-bold text-[#17231f]">1. Activate membership</p>
                    <p className="mt-1 text-xs text-gray-500">
                      Only do this after you have confirmed the payment.
                    </p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <select
                        value={plan}
                        onChange={(event) => setPlan(event.target.value)}
                        className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm"
                      >
                        <option value="solo">Solo ($49, one year)</option>
                        <option value="couple">Couple ($59, one year)</option>
                        <option value="family">Family ($69, one year)</option>
                      </select>
                      <input
                        type="text"
                        value={reference}
                        onChange={(event) => setReference(event.target.value)}
                        placeholder="Payment reference"
                        className="rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#176b50]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={grantMembership}
                      disabled={busy === "grant"}
                      className="mt-3 rounded-full bg-[#176b50] px-6 py-2 text-sm font-bold text-white hover:bg-[#0f3d2e] disabled:opacity-50"
                    >
                      {busy === "grant" ? "Saving..." : "Activate membership"}
                    </button>
                  </div>
                )}

                {found.active && (
                  <div className="rounded-2xl border border-[#e8dfc8] p-4">
                    <p className="text-sm font-bold text-[#17231f]">Connect to hosts</p>
                    <p className="mt-1 text-xs text-gray-500">
                      A paid member can reach every host. This opens a conversation with each
                      live opportunity ({listings.length} right now). Run it again later to add
                      newly approved ones.
                    </p>
                    {listings.length === 0 ? (
                      <p className="mt-2 text-sm text-gray-600">
                        There are no live opportunities yet. Approve one first.
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={connect}
                        disabled={busy === "connect"}
                        className="mt-3 rounded-full bg-[#176b50] px-6 py-2 text-sm font-bold text-white hover:bg-[#0f3d2e] disabled:opacity-50"
                      >
                        {busy === "connect" ? "Connecting..." : "Connect to all live opportunities"}
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
