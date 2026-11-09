"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export const CONTRIBUTION_AREAS = [
  { value: "technology", label: "Technology and website development" },
  { value: "design", label: "Graphic design and creativity" },
  { value: "marketing", label: "Marketing and communications" },
  { value: "travel_hospitality", label: "Travel and hospitality" },
  { value: "business_partnerships", label: "Business development and partnerships" },
  { value: "community_impact", label: "Community development and social impact" },
  { value: "writing", label: "Writing, blogging and storytelling" },
];

const inputClass =
  "w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#176b50]";
const labelClass = "mb-2 block text-sm font-medium text-gray-700";

type FormState = {
  fullName: string;
  email: string;
  country: string;
  city: string;
  background: string;
  area: string;
  skills: string;
  availability: string;
  motivation: string;
  portfolio: string;
  consent: boolean;
  company: string; // hidden spam trap, real people never fill this in
};

const emptyForm: FormState = {
  fullName: "",
  email: "",
  country: "",
  city: "",
  background: "",
  area: "",
  skills: "",
  availability: "",
  motivation: "",
  portfolio: "",
  consent: false,
  company: "",
};

export default function VolunteerApplicationForm() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function validate(): string {
    const f = form;
    if (f.fullName.trim().length < 2) return "Please enter your full name.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.trim()))
      return "Please enter a valid email address.";
    if (f.country.trim().length < 2) return "Please enter your country.";
    if (!f.city.trim()) return "Please enter your city.";
    if (f.background.trim().length < 2)
      return "Please tell us about your education or professional background.";
    if (!f.area) return "Please choose the area where you can contribute.";
    if (f.skills.trim().length < 10)
      return "Please tell us a little more about your skills and experience.";
    if (f.availability.trim().length < 2)
      return "Please tell us when you are available.";
    if (f.motivation.trim().length < 10)
      return "Please tell us a little more about why you would like to join.";
    if (!f.consent)
      return "Please confirm that you agree to us storing your details.";
    return "";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    // Spam trap: pretend everything worked, but send nothing.
    if (form.company) {
      setDone(true);
      return;
    }

    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }

    let portfolio = form.portfolio.trim();
    if (portfolio && !/^https?:\/\//i.test(portfolio)) {
      portfolio = `https://${portfolio}`;
    }

    setSaving(true);

    const supabase = createClient();
    const { error: insertError } = await supabase
      .from("volunteer_applications")
      .insert({
        full_name: form.fullName.trim(),
        email: form.email.trim(),
        country: form.country.trim(),
        city: form.city.trim(),
        background: form.background.trim(),
        contribution_area: form.area,
        skills_experience: form.skills.trim(),
        availability: form.availability.trim(),
        motivation: form.motivation.trim(),
        portfolio_url: portfolio || null,
      });

    if (insertError) {
      setError(
        "We could not send your application. Please check your details and try again."
      );
      console.error("volunteer_applications insert failed:", insertError.message);
    } else {
      setDone(true);
      setForm(emptyForm);
    }

    setSaving(false);
  }

  if (done) {
    return (
      <div
        role="status"
        className="rounded-lg bg-green-50 p-6 text-sm text-green-800"
      >
        <p className="text-lg font-semibold">Thank you for offering your time!</p>
        <p className="mt-2 leading-6">
          We have received your application. We read every one personally and
          will be in touch by email.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="va-name" className={labelClass}>Full name</label>
        <input id="va-name" type="text" required maxLength={120} autoComplete="name"
          value={form.fullName} onChange={(e) => set("fullName", e.target.value)}
          className={inputClass} placeholder="Your full name" />
      </div>

      <div>
        <label htmlFor="va-email" className={labelClass}>Email address</label>
        <input id="va-email" type="email" required maxLength={254} autoComplete="email"
          value={form.email} onChange={(e) => set("email", e.target.value)}
          className={inputClass} placeholder="you@example.com" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="va-country" className={labelClass}>Country</label>
          <input id="va-country" type="text" required maxLength={100} autoComplete="country-name"
            value={form.country} onChange={(e) => set("country", e.target.value)}
            className={inputClass} placeholder="e.g. Uganda" />
        </div>
        <div>
          <label htmlFor="va-city" className={labelClass}>City</label>
          <input id="va-city" type="text" required maxLength={100} autoComplete="address-level2"
            value={form.city} onChange={(e) => set("city", e.target.value)}
            className={inputClass} placeholder="e.g. Kampala" />
        </div>
      </div>

      <div>
        <label htmlFor="va-background" className={labelClass}>
          Education or professional background
        </label>
        <textarea id="va-background" rows={3} required maxLength={2000}
          value={form.background} onChange={(e) => set("background", e.target.value)}
          className={inputClass}
          placeholder="Your studies, work or the field you come from" />
      </div>

      <div>
        <label htmlFor="va-area" className={labelClass}>
          Area in which you can contribute
        </label>
        <select id="va-area" required value={form.area}
          onChange={(e) => set("area", e.target.value)}
          className={`${inputClass} bg-white`}>
          <option value="">Choose an area</option>
          {CONTRIBUTION_AREAS.map((a) => (
            <option key={a.value} value={a.value}>{a.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="va-skills" className={labelClass}>
          Skills and experience
        </label>
        <textarea id="va-skills" rows={5} required maxLength={3000}
          value={form.skills} onChange={(e) => set("skills", e.target.value)}
          className={inputClass}
          placeholder="What can you do, and what have you done before?" />
      </div>

      <div>
        <label htmlFor="va-availability" className={labelClass}>Availability</label>
        <input id="va-availability" type="text" required maxLength={500}
          value={form.availability} onChange={(e) => set("availability", e.target.value)}
          className={inputClass}
          placeholder="e.g. About 5 hours a week, evenings and weekends" />
      </div>

      <div>
        <label htmlFor="va-motivation" className={labelClass}>
          Why would you like to join Travailaway?
        </label>
        <textarea id="va-motivation" rows={5} required maxLength={3000}
          value={form.motivation} onChange={(e) => set("motivation", e.target.value)}
          className={inputClass}
          placeholder="Tell us what draws you to our vision" />
      </div>

      <div>
        <label htmlFor="va-portfolio" className={labelClass}>
          Portfolio or LinkedIn profile (optional)
        </label>
        <input id="va-portfolio" type="text" maxLength={500}
          value={form.portfolio} onChange={(e) => set("portfolio", e.target.value)}
          className={inputClass} placeholder="A link to your work or profile" />
      </div>

      {/* Spam trap: hidden from people and screen readers */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="va-company">Company</label>
        <input id="va-company" type="text" tabIndex={-1} autoComplete="off"
          value={form.company} onChange={(e) => set("company", e.target.value)} />
      </div>

      <label className="flex items-start gap-3 text-sm text-gray-700">
        <input type="checkbox" checked={form.consent}
          onChange={(e) => set("consent", e.target.checked)}
          className="mt-1 h-4 w-4 accent-[#176b50]" />
        <span>
          I understand this is a volunteer opportunity, and I agree to
          Travailaway storing my details to review my application. See our{" "}
          <a href="/privacy" className="font-semibold text-[#176b50] underline">
            privacy policy
          </a>
          .
        </span>
      </label>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <button type="submit" disabled={saving}
        className="w-full rounded-lg bg-[#176b50] px-5 py-3 font-semibold text-white hover:bg-[#104c3a] disabled:opacity-50">
        {saving ? "Sending..." : "Send my application"}
      </button>
    </form>
  );
}
