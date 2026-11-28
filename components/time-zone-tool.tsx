"use client";

import { useEffect, useState } from "react";
import { CITIES, timeIn, dayIn, zonedToInstant } from "@/lib/time-zones";
import { useSavedState } from "@/lib/use-saved-state";

type Pick = { from: string; to: string };

export default function TimeZoneTool() {
  const [pick, setPick] = useSavedState<Pick>("ta_tz", {
    from: "Africa/Kampala",
    to: "Europe/Rome",
  });
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00");
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const d = new Date();
    setNow(d);
    setDate(
      d.getFullYear() +
        "-" +
        String(d.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(d.getDate()).padStart(2, "0")
    );
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const cityName = (zone: string) =>
    CITIES.find((c) => c.zone === zone)?.name || zone;

  let converted = "";
  let convertedDay = "";
  const [y, m, d] = date.split("-").map(Number);
  const [h, mi] = time.split(":").map(Number);
  if (y && m && d && !Number.isNaN(h) && !Number.isNaN(mi)) {
    const instant = zonedToInstant(pick.from, y, m, d, h, mi);
    converted = timeIn(pick.to, instant);
    convertedDay = dayIn(pick.to, instant);
  }

  const field =
    "mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base focus:border-[#176b50] focus:outline-none";

  const options = CITIES.map((c) => (
    <option key={c.zone} value={c.zone}>
      {c.name}
    </option>
  ));

  return (
    <div className="mt-8 space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-gray-700">
          Your city
          <select
            className={field}
            value={pick.from}
            onChange={(e) => setPick({ ...pick, from: e.target.value })}
          >
            {options}
          </select>
        </label>
        <label className="block text-sm font-semibold text-gray-700">
          Your host&apos;s city
          <select
            className={field}
            value={pick.to}
            onChange={(e) => setPick({ ...pick, to: e.target.value })}
          >
            {options}
          </select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {[pick.from, pick.to].map((zone) => (
          <div key={zone} className="rounded-2xl bg-[#104c3a] p-5 text-white">
            <p className="text-sm text-emerald-200">Now in {cityName(zone)}</p>
            <p className="mt-1 text-4xl font-extrabold">
              {now ? timeIn(zone, now) : "--:--"}
            </p>
            <p className="text-sm text-emerald-100">
              {now ? dayIn(zone, now) : ""}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 p-5">
        <h2 className="text-lg font-bold text-[#17231f]">
          Find a time to talk
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Pick a date and a time in {cityName(pick.from)}. We show you the time
          in {cityName(pick.to)}.
        </p>
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
            Time
            <input
              type="time"
              className={field}
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </label>
        </div>
        {converted && (
          <p className="mt-5 rounded-xl bg-[#eaf4ef] p-4 text-lg font-bold text-[#104c3a]">
            {time} in {cityName(pick.from)} is {converted} in{" "}
            {cityName(pick.to)} ({convertedDay})
          </p>
        )}
      </div>
    </div>
  );
}
