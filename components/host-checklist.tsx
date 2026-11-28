"use client";

import { useSavedState } from "@/lib/use-saved-state";

const GROUPS: { title: string; items: string[] }[] = [
  {
    title: "The work",
    items: [
      "What tasks will I be helping with?",
      "How many hours a day and days a week?",
      "Which days are my days off?",
      "Will I work alone or with others?",
      "Do I need any special skills or equipment?",
    ],
  },
  {
    title: "Where you will stay",
    items: [
      "Is my room private or shared?",
      "Are bedding and towels provided?",
      "Is there hot water, electricity and a good phone signal?",
      "Is there internet, and can I use it?",
    ],
  },
  {
    title: "Food",
    items: [
      "Which meals are included?",
      "Can you cater for my diet or allergies?",
      "Can I use the kitchen?",
    ],
  },
  {
    title: "Money and rules",
    items: [
      "Are there any costs for me, such as food or bills?",
      "What are the house rules?",
      "How long can I stay, and how much notice is needed to leave?",
    ],
  },
  {
    title: "Getting there and staying safe",
    items: [
      "How do I get to you, and can you meet me?",
      "Who else lives or stays there?",
      "What should I do in an emergency, and where is the nearest clinic?",
      "Have other travellers stayed with you before?",
    ],
  },
  {
    title: "Before you confirm",
    items: [
      "Have we agreed everything in writing?",
      "Do I have the host's phone number and exact address?",
      "Has someone I trust got my plans and the address?",
    ],
  },
];

export default function HostChecklist() {
  const [done, setDone] = useSavedState<Record<string, boolean>>("ta_host_done", {});
  const all = GROUPS.flatMap((g) => g.items);
  const ticked = all.filter((item) => done[item]).length;

  return (
    <div className="mt-8 space-y-8">
      <div className="rounded-2xl bg-[#eaf4ef] p-4 text-[#104c3a]">
        <p className="font-semibold">
          {ticked} of {all.length} questions asked
        </p>
        <p className="mt-1 text-sm">
          Tick each question once your host has answered. Your ticks are saved
          on this phone or computer.
        </p>
      </div>

      {GROUPS.map((group) => (
        <section key={group.title}>
          <h2 className="text-xl font-bold text-[#17231f]">{group.title}</h2>
          <ul className="mt-2">
            {group.items.map((item) => (
              <li key={item}>
                <label className="flex cursor-pointer items-start gap-3 py-1.5">
                  <input
                    type="checkbox"
                    checked={Boolean(done[item])}
                    onChange={() => setDone({ ...done, [item]: !done[item] })}
                    className="mt-1 h-5 w-5 shrink-0 accent-[#176b50]"
                  />
                  <span className={done[item] ? "text-gray-400 line-through" : ""}>
                    {item}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </section>
      ))}

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
