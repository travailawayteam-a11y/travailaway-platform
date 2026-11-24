"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

type TravellerProfile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  country: string | null;
  city: string | null;
  bio: string | null;
  languages: string[] | null;
  skills: string[] | null;
  interests: string[] | null;
  created_at: string | null;
};

function memberSince(value: string | null) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

function Chips({ text }: { text: string[] | null }) {
  const items = (text || []).filter(Boolean).slice(0, 20);
  if (items.length === 0) return <p className="mt-2 text-sm text-gray-500">Not added yet.</p>;
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full bg-[#e3f1e9] px-3 py-1 text-sm font-medium text-[#0f5a3f]"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export default function TravellerPage() {
  const params = useParams<{ id: string }>();
  const travellerId = params?.id;

  const [profile, setProfile] = useState<TravellerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!travellerId) return;
      const supabase = createClient();
      const { data } = await supabase.rpc("get_traveller_profile", { p_id: travellerId });
      if (!active) return;
      const row = Array.isArray(data) ? data[0] : null;
      setProfile((row as TravellerProfile) || null);
      setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, [travellerId]);

  const place = profile ? [profile.city, profile.country].filter(Boolean).join(", ") : "";

  return (
    <main className="min-h-screen bg-[#fbf6ea] text-[#1f2a26]">
      <SiteHeader />

      <section className="mx-auto max-w-3xl px-4 py-10">
        <Link href="/messages" className="font-bold text-[#176b50]">
          ← Back to messages
        </Link>

        {loading ? (
          <p className="mt-8 text-gray-600">Loading...</p>
        ) : !profile ? (
          <div className="mt-8 rounded-3xl border border-[#e8dfc8] bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-[#0f3d2e]">Profile not available</h1>
            <p className="mt-2 text-gray-600">
              You can open the profile of a traveller who has written to you. Please log in with
              the right account, or go back to your messages.
            </p>
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-5">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name || "Traveller"}
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#e3f1e9] text-3xl font-bold text-[#176b50]">
                  {((profile.full_name || "T").trim()[0] || "T").toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <h1 className="break-words text-3xl font-bold text-[#0f3d2e]">
                  {profile.full_name || "Traveller"}
                </h1>
                {place && <p className="mt-1 text-gray-600">{place}</p>}
                {profile.created_at && (
                  <p className="mt-1 text-sm text-gray-500">
                    Travailaway member since {memberSince(profile.created_at)}
                  </p>
                )}
              </div>
            </div>

            <h2 className="mt-8 text-lg font-bold text-[#0f3d2e]">About</h2>
            <p className="mt-2 whitespace-pre-line leading-7 text-gray-700">
              {profile.bio || "This traveller has not written about themselves yet."}
            </p>

            <h2 className="mt-8 text-lg font-bold text-[#0f3d2e]">Languages</h2>
            <Chips text={profile.languages} />

            <h2 className="mt-6 text-lg font-bold text-[#0f3d2e]">Skills they can offer</h2>
            <Chips text={profile.skills} />

            <h2 className="mt-6 text-lg font-bold text-[#0f3d2e]">Interests</h2>
            <Chips text={profile.interests} />
          </div>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}
