"use client";

import { useState } from "react";
import { useSavedState } from "@/lib/use-saved-state";

const GROUPS: { title: string; items: string[] }[] = [
  {
    title: "Documents",
    items: [
      "Passport (check it is valid for your whole trip)",
      "Visa or entry permission, if needed",
      "Travel insurance details",
      "Printed and digital copies of your documents",
      "Host's address and phone number",
      "Emergency contacts",
    ],
  },
  {
    title: "Money",
    items: [
      "Bank card that works abroad",
      "Some cash in local currency",
      "A backup card kept separately",
    ],
  },
  {
    title: "Health",
    items: [
      "Any medicine you take, with the prescription",
      "Basic first-aid kit",
      "Sunscreen and insect repellent",
      "Required vaccinations (check official health advice)",
    ],
  },
  {
    title: "Clothes for helping out",
    items: [
      "Sturdy shoes or boots for work",
      "Work clothes you do not mind getting dirty",
      "A hat",
      "Warm layer and rain jacket",
      "Modest clothes for local customs",
    ],
  },
  {
    title: "Tech",
    items: [
      "Phone and charger",
      "Plug adapter for your destination",
      "Power bank",
      "Headphones",
    ],
  },
  {
    title: "Small extras",
    items: [
      "Reusable water bottle",
      "Small towel",
      "A small gift from your home country for your host",
      "Notebook and pen",
      "Photos or something to share about your culture",
    ],
  },
];

export default function PackingList() {
  const [done, setDone] = useSavedState<Record<string, boolean>>("ta_pack_done", {});
  const [custom, setCustom] = useSavedState<string[]>("ta_pack_custom", []);
  const [text, setText] = useState("");

  const all = [...GROUPS.flatMap((g) => g.items), ...custom];
  const ticked = all.filter((item) => done[item]).length;

  function toggle(item: string) {
    setDone({ ...done, [item]: !done[item] });
  }

  function addItem() {
    const item = text.trim();
    if (!item || all.includes(item)) return;
    setCustom([...custom, item]);
    setText("");
  }

  function row(item: string) {
    return (
      <li key={item}>
        <label className="flex cursor-pointer items-start gap-3 py-1.5">
          <input
            type="checkbox"
            checked={Boolean(done[item])}
            onChange={() => toggle(item)}
            className="mt-1 h-5 w-5 shrink-0 accent-[#176b50]"
          />
          <span className={done[item] ? "text-gray-400 line-through" : ""}>
            {item}
          </span>
        </label>
      </li>
    );
  }

  return (
    <div className="mt-8 space-y-8">
      <div className="rounded-2xl bg-[#eaf4ef] p-4 text-[#104c3a]">
        <p className="font-semibold">
          {ticked} of {all.length} packed
        </p>
        <p className="mt-1 text-sm">
          Your ticks are saved on this phone or computer, so you can come back
          later.
        </p>
      </div>

      {GROUPS.map((group) => (
        <section key={group.title}>
          <h2 className="text-xl font-bold text-[#17231f]">{group.title}</h2>
          <ul className="mt-2">{group.items.map(row)}</ul>
        </section>
      ))}

      <section>
        <h2 className="text-xl font-bold text-[#17231f]">Your own items</h2>
        <ul className="mt-2">{custom.map(row)}</ul>
        <div className="mt-3 flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addItem();
            }}
            placeholder="Add something"
            className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-[#176b50]"
          />
          <button
            type="button"
            onClick={addItem}
            className="rounded-full bg-emerald-700 px-5 py-2.5 font-bold text-white hover:bg-emerald-800"
          >
            Add
          </button>
        </div>
      </section>

      <button
        type="button"
        onClick={() => setDone({})}
        className="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-semibold hover:bg-gray-50"
      >
        Clear all ticks
      </button>
    </div>
  );
}
