"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Status = "idle" | "sending" | "done" | "error";

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export default function NewsletterForm({ source = "footer" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [trap, setTrap] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function subscribe(event: FormEvent) {
    event.preventDefault();
    setMessage("");

    // Real people never see this hidden field. Bots tend to fill it in.
    if (trap) {
      setStatus("done");
      return;
    }

    const clean = email.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(clean) || clean.length > 254) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("sending");
    const supabase = createClient();
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: clean, source });

    // 23505 means this email is already on the list. We treat it as a success
    // so nobody can use the form to find out who is subscribed.
    if (error && error.code !== "23505") {
      setStatus("error");
      setMessage("We could not sign you up just now. Please try again in a moment.");
      return;
    }

    setEmail("");
    setStatus("done");
  }

  if (status === "done") {
    return (
      <p role="status" className="rounded-xl bg-emerald-900/40 p-4 text-sm font-semibold text-emerald-200">
        Thank you! You are on the list. We will send you travel stories and news of new hosts.
      </p>
    );
  }

  return (
    <form onSubmit={subscribe} noValidate>
      <label htmlFor={`newsletter-${source}`} className="sr-only">
        Email address
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id={`newsletter-${source}`}
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Your email address"
          className="w-full rounded-full border border-slate-600 bg-white px-5 py-3 text-sm text-slate-900 outline-none focus:border-amber-300"
        />
        <input
          type="text"
          name="website"
          value={trap}
          onChange={(event) => setTrap(event.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute left-[-9999px] h-0 w-0 opacity-0"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="shrink-0 rounded-full bg-amber-400 px-7 py-3 text-sm font-bold text-[#3b2a00] hover:bg-amber-300 disabled:opacity-60"
        >
          {status === "sending" ? "Signing up..." : "Subscribe"}
        </button>
      </div>

      {message && (
        <p role="alert" className="mt-3 text-sm font-semibold text-red-300">
          {message}
        </p>
      )}

      <p className="mt-3 text-xs leading-5 text-slate-400">
        By subscribing you agree to receive our newsletter. You can unsubscribe at any time. See
        our{" "}
        <Link href="/privacy" className="underline hover:text-emerald-300">
          Privacy policy
        </Link>
        .
      </p>
    </form>
  );
}
