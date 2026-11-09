"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export default function NewCompanionPostPage() {
  const [checking, setChecking] = useState(true);
  const [userId, setUserId] = useState("");
  const [destination, setDestination] = useState("");
  const [fromCountry, setFromCountry] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [flexible, setFlexible] = useState(false);
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
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
          .select("country")
          .eq("id", user.id)
          .maybeSingle();

        if (data && data.country) setFromCountry(data.country);
      }

      setChecking(false);
    }

    load();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (startDate && endDate && endDate < startDate) {
      setError("The end date cannot be before the start date.");
      return;
    }

    if (message.trim().length < 20) {
      setError("Please tell us a little more about your plans.");
      return;
    }

    setSaving(true);

    const supabase = createClient();

    const { error: insertError } = await supabase
      .from("companion_posts")
      .insert({
        user_id: userId,
        destination: destination.trim(),
        from_country: fromCountry.trim() || null,
        start_date: startDate || null,
        end_date: endDate || null,
        flexible_dates: flexible,
        message: message.trim(),
        contact_method: contact.trim(),
        status: "pending",
      });

    if (insertError) {
      setError(insertError.message);
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
          <Link href="/travel-buddies" className="font-bold text-[#176b50]">
            ← Travel companions
          </Link>

          <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <h1 className="text-3xl font-bold text-[#17231f]">
              Post a listing to find a travel companion
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Tell other travellers where you are going and how to reach you.
            </p>

            {checking ? (
              <p className="mt-8 text-gray-600">Loading...</p>
            ) : !userId ? (
              <div className="mt-8 rounded-lg bg-[#eaf4ef] p-4 text-sm text-[#104c3a]">
                <p className="font-semibold">
                  Please log in or join Travailaway to post a listing.
                </p>
                <div className="mt-3 flex flex-wrap gap-4 font-semibold">
                  <Link href="/login" className="underline">
                    Log in
                  </Link>
                  <Link href="/register?type=traveller" className="underline">
                    Join as a traveller
                  </Link>
                </div>
              </div>
            ) : done ? (
              <div className="mt-8 rounded-lg bg-green-50 p-4 text-sm text-green-800">
                <p className="font-semibold">Thank you! Your listing is in.</p>
                <p className="mt-1">
                  Our team reviews every new listing before it appears. You can
                  already see it, marked &quot;Awaiting review&quot;, on the
                  travel companions page.
                </p>
                <Link
                  href="/travel-buddies"
                  className="mt-3 inline-block font-semibold underline"
                >
                  Back to travel companions
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Where are you going?
                  </label>
                  <input
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#176b50]"
                    placeholder="e.g. Kenya, or Nairobi to Mombasa"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Where are you travelling from? (optional)
                  </label>
                  <input
                    type="text"
                    value={fromCountry}
                    onChange={(e) => setFromCountry(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#176b50]"
                    placeholder="e.g. Uganda"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      From date (optional)
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#176b50]"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      To date (optional)
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#176b50]"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-3 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={flexible}
                    onChange={(e) => setFlexible(e.target.checked)}
                    className="h-5 w-5"
                  />
                  My dates are flexible
                </label>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    About your plans
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#176b50]"
                    placeholder="What do you plan to do, what kind of companion would you like, and anything else people should know..."
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    How should people reach you?
                  </label>
                  <input
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#176b50]"
                    placeholder="e.g. WhatsApp +256..., or your email"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Only logged-in Travailaway members can see this.
                  </p>
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
                  {saving ? "Posting..." : "Post my listing"}
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
