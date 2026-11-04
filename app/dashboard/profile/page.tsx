
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ProfilePage() {
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [accountType, setAccountType] = useState("traveller");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUserId(user.id);

      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, country, city, bio, account_type")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        setError(profileError.message);
      } else if (data) {
        setFullName(data.full_name || "");
        setCountry(data.country || "");
        setCity(data.city || "");
        setBio(data.bio || "");
        setAccountType(data.account_type || "traveller");
      }

      setLoading(false);
    }

    loadProfile();
  }, [router]);

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    const supabase = createClient();

    const { error: saveError } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim(),
        country: country.trim(),
        city: city.trim(),
        bio: bio.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (saveError) {
      setError(saveError.message);
    } else {
      setMessage("Your profile has been updated successfully!");
    }

    setSaving(false);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7faf8]">
        <p className="text-gray-600">Loading your profile...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7faf8] px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/dashboard"
          className="font-bold text-[#176b50]"
        >
          ← Back to dashboard
        </Link>

        <div className="mt-7 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-3xl font-bold text-[#17231f]">
            Your Travailaway profile
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Tell hosts and travellers a little about yourself.
          </p>

          <form onSubmit={handleSave} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Account type
              </label>
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 capitalize text-gray-600">
                {accountType}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Full name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#176b50]"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#176b50]"
                placeholder="e.g. Uganda"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                City or town
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#176b50]"
                placeholder="Your city or town"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                About me
              </label>
              <textarea
                rows={5}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#176b50]"
                placeholder="Tell the Travailaway community about yourself, your interests and what brings you here..."
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}

            {message && (
              <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={saving || !userId}
              className="w-full rounded-lg bg-[#176b50] px-5 py-3 font-semibold text-white hover:bg-[#104c3a] disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save my profile"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
