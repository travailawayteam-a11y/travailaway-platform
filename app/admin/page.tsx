"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { notify } from "@/lib/notify";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import MembersPanel from "./members-panel";

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
  const [deleteId, setDeleteId] = useState("");
  const [deleteText, setDeleteText] = useState("");

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
        setError("Could not load: " + [l.error?.message, p.error?.message, a.error?.message].filter(Boolean).join(" | "));
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
    doneMessage: string,
    notifyHost = false
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
      if (notifyHost) notify("listing_decision", item.id);
      setNotice(doneMessage);
      setRejectId("");
      setRejectReason("");
    }

    setBusyId("");
  }

  async function removeListing(item: Listing) {
    setError("");
    setNotice("");
    setBusyId(item.id);

    const supabase = createClient();
    const { error: rpcError } = await supabase.rpc("admin_delete_listing", {
      p_listing_id: item.id,
    });

    if (rpcError) {
      setError(rpcError.message);
    } else {
      setListings((current) => current.filter((row) => row.id !== item.id));
      setDeleteId("");
      setDeleteText("");
      setNotice("The opportunity was permanently removed.");
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
