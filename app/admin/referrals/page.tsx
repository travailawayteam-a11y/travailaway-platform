"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

type Row = {
  code: string;
  ambassador_name: string;
  active: boolean;
  created_at: string;
  signups: number;
  hosts: number;
  travellers: number;
  live_listings: number;
  members: number;
};

type Person = {
  user_id: string;
  full_name: string | null;
  account_type: string | null;
  joined_at: string;
  live_listings: number;
  has_membership: boolean;
};

const SITE = "https://www.travailaway.info";

export default function ReferralsPage() {
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [openCode, setOpenCode] = useState<string | null>(null);
  const [people, setPeople] = useState<Person[]>([]);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data, error: err } = await supabase.rpc("admin_referral_report");
    if (err) {
      setError(err.message);
      return;
    }
    setRows(
      ((data || []) as Row[]).map((r) => ({
        ...r,
        signups: Number(r.signups),
        hosts: Number(r.hosts),
        travellers: Number(r.travellers),
        live_listings: Number(r.live_listings),
        members: Number(r.members),
      }))
    );
  }, []);

  useEffect(() => {
    async function start() {
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
      await load();
      setChecking(false);
    }
    start();
  }, [load]);

  async function createCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setBusy(true);
    const supabase = createClient();
    const { data, error: err } = await supabase.rpc("admin_create_referral_code", {
      p_code: code,
      p_name: name,
    });
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    setMessage(`Link created: ${SITE}/?ref=${data}`);
    setName("");
    setCode("");
    await load();
  }

  async function toggle(r: Row) {
    setError("");
    const supabase = createClient();
    const { error: err } = await supabase.rpc("admin_set_referral_active", {
      p_code: r.code,
      p_active: !r.active,
    });
    if (err) setError(err.message);
    await load();
  }

  async function copyLink(c: string) {
    const link = `${SITE}/?ref=${c}`;
    try {
      await navigator.clipboard.writeText(link);
      setMessage(`Copied: ${link}`);
    } catch {
      setMessage(`Copy this link: ${link}`);
    }
  }

  async function showPeople(c: string) {
    if (openCode === c) {
      setOpenCode(null);
      return;
    }
    setError("");
    const supabase = createClient();
    const { data, error: err } = await supabase.rpc("admin_referral_people", { p_code: c });
    if (err) {
      setError(err.message);
      return;
    }
    setPeople((data || []) as Person[]);
    setOpenCode(c);
  }
    const btn =
    "rounded-full border border-[#e8dfc8] bg-white px-3 py-1 text-xs font-bold text-[#1f2a26] hover:bg-[#f3ecd9]";

  if (checking) {
    return (
      <main className="min-h-screen bg-[#fbf6ea]">
        <SiteHeader />
        <p className="p-10 text-center text-sm text-[#4a5a52]">Loading...</p>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-[#fbf6ea]">
        <SiteHeader />
        <p className="p-10 text-center text-sm text-[#4a5a52]">This page is for the Travailaway team only.</p>
        <SiteFooter />
      </main>
    );
  }

  const total = rows.reduce((n, r) => n + r.signups, 0);

  return (
    <main className="min-h-screen bg-[#fbf6ea]">
      <SiteHeader />
      <div className="mx-auto max-w-5xl px-4 py-10">
        <Link href="/admin" className="text-sm font-bold text-[#176b50] hover:underline">
          Back to admin
        </Link>
        <h1 className="mt-3 text-3xl font-extrabold text-[#0f3d2e]">Ambassador links</h1>
        <p className="mt-2 text-sm text-[#4a5a52]">
          Give each ambassador their own link. Everyone who signs up through it is counted for them.
          {total > 0 ? ` ${total} signups so far.` : ""}
        </p>

        <form onSubmit={createCode} className="mt-6 grid gap-3 rounded-2xl border border-[#e8dfc8] bg-white p-4 sm:grid-cols-[1fr_1fr_auto]">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ambassador name"
            required
            className="rounded-xl border border-[#e8dfc8] px-3 py-2 text-sm"
          />
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""))}
            placeholder="Code, e.g. amina"
            required
            minLength={3}
            maxLength={20}
            className="rounded-xl border border-[#e8dfc8] px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-[#176b50] px-5 py-2 text-sm font-bold text-white hover:bg-[#0f3d2e] disabled:opacity-50"
          >
            {busy ? "Creating..." : "Create link"}
          </button>
        </form>

        {message && (
          <p role="status" className="mt-4 break-all rounded-xl bg-[#e3f1e9] p-3 text-sm font-medium text-[#0f5a3f]">
            {message}
          </p>
        )}
        {error && (
          <p role="alert" className="mt-4 rounded-xl bg-[#fde8e4] p-3 text-sm font-medium text-[#9a2a18]">
            {error}
          </p>
        )}

        <div className="mt-6 space-y-3">
          {rows.length === 0 && (
            <p className="rounded-2xl border border-[#e8dfc8] bg-white p-4 text-sm text-[#4a5a52]">
              No ambassador links yet. Create the first one above.
            </p>
          )}
          {rows.map((r) => (
            <div key={r.code} className="rounded-2xl border border-[#e8dfc8] bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-extrabold text-[#0f3d2e]">
                    {r.ambassador_name}{" "}
                    {!r.active && <span className="text-xs font-bold text-[#9a2a18]">(switched off)</span>}
                  </p>
                  <p className="break-all text-xs text-[#4a5a52]">
                    {SITE}/?ref={r.code}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => copyLink(r.code)} className={btn}>
                    Copy link
                  </button>
                  <button type="button" onClick={() => showPeople(r.code)} className={btn}>
                    {openCode === r.code ? "Hide people" : "See people"}
                  </button>
                  <button type="button" onClick={() => toggle(r)} className={btn}>
                    {r.active ? "Switch off" : "Switch on"}
                  </button>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs sm:grid-cols-5">
                {[
                  ["Signups", r.signups],
                  ["Hosts", r.hosts],
                  ["Travellers", r.travellers],
                  ["Live listings", r.live_listings],
                  ["Members", r.members],
                ].map(([label, value]) => (
                  <div key={label as string} className="rounded-xl bg-[#f3ecd9] p-2">
                    <p className="text-lg font-extrabold text-[#0f3d2e]">{value}</p>
                    <p className="text-[#4a3a12]">{label}</p>
                  </div>
                ))}
              </div>
              {openCode === r.code && (
                <ul className="mt-3 divide-y divide-[#e8dfc8] text-sm">
                  {people.length === 0 && <li className="py-2 text-[#4a5a52]">No one has joined yet.</li>}
                  {people.map((p) => (
                    <li key={p.user_id} className="flex flex-wrap justify-between gap-2 py-2">
                      <span className="font-medium text-[#1f2a26]">{p.full_name || "No name yet"}</span>
                      <span className="text-[#4a5a52]">
                        {p.account_type || "traveller"} · joined {new Date(p.joined_at).toLocaleDateString()}
                        {p.live_listings > 0 ? ` · ${p.live_listings} live listing(s)` : ""}
                        {p.has_membership ? " · member" : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
