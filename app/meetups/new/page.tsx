"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export default function NewEventPage() {
  const [checking, setChecking] = useState(true);
  const [userId, setUserId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [venue, setVenue] = useState("");
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

        if (data && data.country) setCountry(data.country);
      }

      setChecking(false);
    }

    load();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const when = new Date(startsAt);

    if (!startsAt || Number.isNaN(when.getTime())) {
      setError("Please choose the date and time of your event.");
      return;
    }

    if (when.getTime() < Date.now()) {
      setError("The event date must be in the future.");
      return;
    }

    if (description.trim().length < 30) {
      setError("Please describe your event in a little more detail.");
      return;
    }

    setSaving(true);

    const supabase = createClient();

    const { error: insertError } = await supabase.from("events").insert({
      organiser_id: userId,
      title: title.trim(),
      description: description.trim(),
      starts_at: when.toISOString(),
      country: country.trim(),
      city: city.trim() || null,
      venue: venue.trim() || null,
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

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#176b50]";
  const labelClass = "mb-2 block text-sm font-medium text-gray-700";

  return (
    <main className="min-h-screen bg-[#f7faf8]">
      <SiteHeader />

      <div className="px-4 py-10">
        <div className="mx-auto max-w-xl">
          <Link href="/meetups" className="font-bold text-[#176b50]">
            ← Gatherings &amp; events
          </Link>

          <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <h1 className="text-3xl font-bold text-[#17231f]">Host an event</h1>
            <p className="mt-2 text-sm text-gray-600">
              Tell travellers and hosts about your gathering and how to join.
            </p>

            {checking ? (
              <p className="mt-8 text-gray-600">Loading...</p>
            ) : !userId ? (
              <div className="mt-8 rounded-lg bg-[#eaf4ef] p-4 text-sm text-[#104c3a]">
                <p className="font-semibold">
                  Please log in or join Travailaway to host an event.
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
                <p className="font-semibold">Thank you! Your event is in.</p>
                <p className="mt-1">
                  Our team reviews every new event before it appears. You can
                  already see it, marked &quot;Awaiting review&quot;, on the
                  events page.
                </p>
                <Link
                  href="/meetups"
                  className="mt-3 inline-block font-semibold underline"
                >
                  Back to events
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                <div>
                  <label className={labelClass}>Event name</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Sunday lunch for travellers and hosts"
                  />
                </div>

                <div>
                  <label className={labelClass}>Date and time</label>
                  <input
                    type="datetime-local"
                    required
                    value={startsAt}
                    onChange={(e) => setStartsAt(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Country</label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Uganda"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>City (optional)</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Place (optional)</label>
                    <input
                      type="text"
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                      className={inputClass}
                      placeholder="e.g. a cafe or guesthouse"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>About the event</label>
                  <textarea
                    rows={5}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={inputClass}
                    placeholder="What will happen, who is it for, and anything people should bring or know..."
                  />
                </div>

                <div>
                  <label className={labelClass}>How can people join?</label>
                  <input
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className={inputClass}
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
                  {saving ? "Sending..." : "Submit my event"}
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
