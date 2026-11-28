"use client";

import { useState } from "react";
import { useSavedState } from "@/lib/use-saved-state";

type Entry = { id: number; date: string; place: string; text: string };

const PROMPTS = [
  "Who did you meet today, and what did they teach you?",
  "What was the best thing you ate today?",
  "What surprised you today?",
  "Write down one new word you learned.",
  "What did you do today that you were proud of?",
  "What would you tell a friend about today?",
  "What smell, sound or colour will you remember?",
];

function today() {
  const d = new Date();
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0")
  );
}

export default function TravelJournal() {
  const [entries, setEntries] = useSavedState<Entry[]>("ta_journal", []);
  const [date, setDate] = useState(today());
  const [place, setPlace] = useState("");
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const prompt = PROMPTS[Math.floor(Date.now() / 86400000) % PROMPTS.length];

  function save() {
    if (!text.trim()) return;
    const id = entries.reduce((m, e) => Math.max(m, e.id), 0) + 1;
    setEntries([{ id, date, place: place.trim(), text: text.trim() }, ...entries]);
    setText("");
  }

  function remove(id: number) {
    setEntries(entries.filter((e) => e.id !== id));
  }

  async function copyAll() {
    const all = [...entries]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((e) => e.date + (e.place ? " - " + e.place : "") + "\n" + e.text)
      .join("\n\n");
    try {
      await navigator.clipboard.writeText(all);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  const field =
    "mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:border-[#176b50] focus:outline-none";

  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-2xl bg-[#104c3a] p-6 text-white">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-200">
          Today&apos;s question
        </p>
        <p className="mt-2 text-xl font-bold">{prompt}</p>
      </div>

      <div className="rounded-2xl border border-gray-200 p-5">
        <h2 className="text-lg font-bold text-[#17231f]">New entry</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-gray-700">
            Date
            <input
              type="date"
              className={field}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
          <label className="block text-sm font-semibold text-gray-700">
            Place
            <input
              className={field}
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              placeholder="For example: Siena, Italy"
            />
          </label>
        </div>
        <label className="mt-4 block text-sm font-semibold text-gray-700">
          What happened today?
          <textarea
            className={field + " min-h-[140px]"}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write as much or as little as you like..."
          />
        </label>
        <button
          type="button"
          onClick={save}
          className="mt-4 rounded-full bg-emerald-700 px-7 py-3 font-bold text-white hover:bg-emerald-800"
        >
          Save entry
        </button>
      </div>

      <div>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-[#17231f]">
            My entries ({entries.length})
          </h2>
          {entries.length > 0 && (
            <button
              type="button"
              onClick={copyAll}
              className="rounded-full border border-emerald-700 px-5 py-2 text-sm font-bold text-emerald-800 hover:bg-emerald-50"
            >
              {copied ? "Copied!" : "Copy all"}
            </button>
          )}
        </div>
        {entries.length === 0 && (
          <p className="mt-3 text-gray-600">
            Your first entry will appear here.
          </p>
        )}
        <ul className="mt-4 space-y-4">
          {entries.map((e) => (
            <li key={e.id} className="rounded-2xl bg-gray-50 p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-bold text-[#176b50]">
                  {e.date}
                  {e.place ? " · " + e.place : ""}
                </p>
                <button
                  type="button"
                  onClick={() => remove(e.id)}
                  className="text-sm font-semibold text-red-600"
                >
                  Delete
                </button>
              </div>
              <p className="mt-2 whitespace-pre-wrap leading-7 text-gray-800">
                {e.text}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-sm text-gray-500">
        Your journal is private. It is saved on this phone or computer only and
        we cannot read it. If you clear your browser data it will be erased, so
        use Copy all to keep a backup.
      </p>
    </div>
  );
}
