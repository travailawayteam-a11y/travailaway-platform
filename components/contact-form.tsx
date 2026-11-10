"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#176b50]";
const labelClass = "mb-2 block text-sm font-medium text-gray-700";

const TOPICS = [
  "General question",
  "Help with my account",
  "Membership",
  "Hosting",
  "Report a problem",
  "Partnership or media",
];

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState(TOPICS[0]);
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // hidden spam trap
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");

    // Real people never fill in the hidden field. Pretend it worked.
    if (company) {
      setDone(true);
      return;
    }

    if (name.trim().length < 2) {
      setError("Please enter your name.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (message.trim().length < 10) {
      setError("Please write a little more so we can help you.");
      return;
    }

    setSending(true);
    try {
      const supabase = createClient();
      const { error: insertError } = await supabase
        .from("contact_messages")
        .insert({
          full_name: name.trim(),
          email: email.trim(),
          topic,
          message: message.trim(),
        });

      if (insertError) {
        console.error("contact_messages insert failed:", insertError.message);
        setError("We could not send your message. Please try again in a moment.");
      } else {
        setDone(true);
      }
    } catch (err) {
      console.error("contact_messages insert failed:", err);
      setError("Something went wrong. Please try again.");
    }
    setSending(false);
  }

  if (done) {
    return (
      <div className="rounded-2xl bg-[#eaf4ef] p-8 text-center">
        <h2 className="text-2xl font-bold text-[#104c3a]">Thank you!</h2>
        <p className="mt-3 leading-7 text-[#104c3a]">
          We have received your message and will reply by email as soon as we
          can.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="contact-name" className={labelClass}>
          Your name
        </label>
        <input
          id="contact-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={120}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="contact-email" className={labelClass}>
          Your email
        </label>
        <input
          id="contact-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          maxLength={200}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="contact-topic" className={labelClass}>
          What is it about?
        </label>
        <select
          id="contact-topic"
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
          className={inputClass}
        >
          {TOPICS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClass}>
          Your message
        </label>
        <textarea
          id="contact-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={6}
          maxLength={3000}
          className={inputClass}
        />
      </div>

      {/* Hidden spam trap */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-company">Company</label>
        <input
          id="contact-company"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
        />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="w-full rounded-full bg-[#176b50] px-6 py-4 font-bold text-white hover:bg-[#104c3a] disabled:opacity-60"
      >
        {sending ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
