"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export default function AmbassadorApplyPage() {
  const [checking, setChecking] = useState(true);
  const [userId, setUserId] = useState("");
  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("");
  const [socialLink, setSocialLink] = useState("");
  const [motivation, setMotivation] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);

        const { data } = await supabase
          .from("profiles")
          .select("full_name, country")
          .eq("id", user.id)
          .maybeSingle();

        if (data) {
          setFullName(data.full_name || "");
          setCountry(data.country || "");
        }
      }

      setChecking(false);
    }

    load();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (motivation.trim().length < 30) {
      setError("Please tell us a little more, at least a couple of sentences.");
      return;
    }

    setSaving(true);

    const supabase = createClient();

    const { error: insertError } = await supabase
      .from("ambassador_applications")
      .insert({
        user_id: userId,
        full_name: fullName.trim(),
        country: country.trim(),
        social_link: socialLink.trim() || null,
        motivation: motivation.trim(),
      });

    if (insertError) {
      if (insertError.code === "23505") {
        setError("You have already applied. Thank you, we will be in touch.");
      } else {
        setError(insertError.message);
      }
    } else {
      setDone(true);
    }

    setSaving(false);
  }

  return (
    <main className="min-h-screen bg-[#f7faf8]">
      <SiteHeader />

      <div className="px-4 py-10">
        <div className="mx-auto max-w-xl">
          <Link
            href="/ambassador"
            className="font-bold text-[#176b50]"
          >
            ← About Ambassadors
          </Link>

          <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <h1 className="text-3xl font-bold text-[#17231f]">
              Apply to become an Ambassador
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Tell us a little about yourself and why you would like to
              represent Travailaway.
            </p>

            {checking ? (
              <p className="mt-8 text-gray-600">Loading...</p>
            ) : !userId ? (
              <div className="mt-8 rounded-lg bg-[#eaf4ef] p-4 text-sm text-[#104c3a]">
                <p className="font-semibold">
                  Please log in or join Travailaway to apply.
                </p>
                <div className="mt-3 flex flex-wrap gap-4 font-semibold">
                  <Link href="/login" className="underline">
                    Log in
                  </Link>
                  <Link href="/register" className="underline">
                    Join Travailaway
                  </Link>
                </div>
              </div>
            ) : done ? (
              <div className="mt-8 rounded-lg bg-green-50 p-4 text-sm text-green-800">
                <p className="font-semibold">Thank you for applying!</p>
                <p className="mt-1">
                  We have received your application and will be in touch.
                </p>
                <Link
                  href="/dashboard"
                  className="mt-3 inline-block font-semibold underline"
                >
                  Back to your dashboard
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-7 space-y-5">
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
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#176b50]"
                    placeholder="e.g. Uganda"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Social media or blog link (optional)
                  </label>
                  <input
                    type="text"
                    value={socialLink}
                    onChange={(e) => setSocialLink(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#176b50]"
                    placeholder="Where you share your travels"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Why would you like to be an Ambassador?
                  </label>
                  <textarea
                    rows={6}
                    required
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#176b50]"
                    placeholder="Tell us about your travels or hosting, and how you would share the Travailaway spirit..."
                  />
                </div>

                {error && (
                  <p
                    role="alert"
                    className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-lg bg-[#176b50] px-5 py-3 font-semibold text-white hover:bg-[#104c3a] disabled:opacity-50"
                >
                  {saving ? "Sending..." : "Send my application"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
