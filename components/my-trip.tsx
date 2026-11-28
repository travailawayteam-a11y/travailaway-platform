"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSavedState } from "@/lib/use-saved-state";

type Todo = { id: number; text: string; done: boolean };
type Trip = {
  destination: string;
  start: string;
  end: string;
  notes: string;
  todos: Todo[];
};

const START_TODOS = [
  "Agree dates and work hours with your host",
  "Check your passport is valid",
  "Book your flights or transport",
  "Get travel insurance",
  "Download offline maps",
  "Tell your bank you are travelling",
];

const EMPTY: Trip = {
  destination: "",
  start: "",
  end: "",
  notes: "",
  todos: START_TODOS.map((text, i) => ({ id: i + 1, text, done: false })),
};

function daysBetween(from: Date, to: Date) {
  const a = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const b = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((b - a) / 86400000);
}

function parseDate(value: string) {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

export default function MyTrip() {
  const [trip, setTrip] = useSavedState<Trip>("ta_my_trip", EMPTY);
  const [newTodo, setNewTodo] = useState("");
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    setToday(new Date());
  }, []);

  const start = parseDate(trip.start);
  const end = parseDate(trip.end);
  const doneCount = trip.todos.filter((t) => t.done).length;

  let countdown = "Choose your start date to see the countdown.";
  if (today && start) {
    const toStart = daysBetween(today, start);
    if (toStart > 1) countdown = toStart + " days to go";
    else if (toStart === 1) countdown = "Tomorrow!";
    else if (toStart === 0) countdown = "Today is the day!";
    else if (end && daysBetween(today, end) >= 0) {
      countdown = "Your trip is happening now";
    } else countdown = "Your trip has finished. Welcome home!";
  }

  let length = "";
  if (start && end) {
    const n = daysBetween(start, end) + 1;
    if (n > 0) length = n + (n === 1 ? " day" : " days") + " in total";
  }

  function update(patch: Partial<Trip>) {
    setTrip({ ...trip, ...patch });
  }

  function toggle(id: number) {
    update({
      todos: trip.todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    });
  }

  function remove(id: number) {
    update({ todos: trip.todos.filter((t) => t.id !== id) });
  }

  function add() {
    const text = newTodo.trim();
    if (!text) return;
    const id = trip.todos.reduce((m, t) => Math.max(m, t.id), 0) + 1;
    update({ todos: [...trip.todos, { id, text, done: false }] });
    setNewTodo("");
  }

  const field =
    "mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:border-[#176b50] focus:outline-none";

  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-2xl bg-[#104c3a] p-6 text-white">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-200">
          {trip.destination.trim() || "Your next trip"}
        </p>
        <p className="mt-2 text-3xl font-extrabold sm:text-4xl">{countdown}</p>
        {length && <p className="mt-2 text-emerald-100">{length}</p>}
      </div>

      <div className="rounded-2xl border border-gray-200 p-5">
        <h2 className="text-lg font-bold text-[#17231f]">Trip details</h2>
        <label className="mt-4 block text-sm font-semibold text-gray-700">
          Where are you going?
          <input
            className={field}
            value={trip.destination}
            onChange={(e) => update({ destination: e.target.value })}
            placeholder="For example: Tuscany, Italy"
          />
        </label>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-gray-700">
            Start date
            <input
              type="date"
              className={field}
              value={trip.start}
              onChange={(e) => update({ start: e.target.value })}
            />
          </label>
          <label className="block text-sm font-semibold text-gray-700">
            End date
            <input
              type="date"
              className={field}
              value={trip.end}
              onChange={(e) => update({ end: e.target.value })}
            />
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-[#17231f]">Before you go</h2>
          <span className="text-sm font-semibold text-[#176b50]">
            {doneCount} of {trip.todos.length} done
          </span>
        </div>
        <ul className="mt-4 space-y-2">
          {trip.todos.map((t) => (
            <li
              key={t.id}
              className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3"
            >
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => toggle(t.id)}
                className="h-5 w-5 shrink-0 accent-emerald-700"
              />
              <span
                className={
                  "flex-1 " + (t.done ? "text-gray-400 line-through" : "text-gray-800")
                }
              >
                {t.text}
              </span>
              <button
                type="button"
                onClick={() => remove(t.id)}
                className="text-sm font-semibold text-red-600"
                aria-label={"Remove " + t.text}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex gap-2">
          <input
            className={field + " mt-0 flex-1"}
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") add();
            }}
            placeholder="Add your own task"
          />
          <button
            type="button"
            onClick={add}
            className="rounded-xl bg-emerald-700 px-5 font-bold text-white hover:bg-emerald-800"
          >
            Add
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 p-5">
        <h2 className="text-lg font-bold text-[#17231f]">My notes</h2>
        <textarea
          className={field + " min-h-[120px]"}
          value={trip.notes}
          onChange={(e) => update({ notes: e.target.value })}
          placeholder="Host address, flight numbers, things to remember..."
        />
      </div>

      <div className="rounded-2xl bg-[#eaf4ef] p-5">
        <h2 className="text-lg font-bold text-[#104c3a]">Plan more</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link href="/budget-planner" className="rounded-full border border-emerald-700 px-5 py-2 font-semibold text-emerald-800 hover:bg-white">
            Budget planner
          </Link>
          <Link href="/packing-list" className="rounded-full border border-emerald-700 px-5 py-2 font-semibold text-emerald-800 hover:bg-white">
            Packing list
          </Link>
          <Link href="/host-checklist" className="rounded-full border border-emerald-700 px-5 py-2 font-semibold text-emerald-800 hover:bg-white">
            Questions for your host
          </Link>
        </div>
      </div>

      <p className="text-sm text-gray-500">
        Your trip is saved on this phone or computer only. We do not store it
        on our servers.
      </p>
    </div>
  );
}
