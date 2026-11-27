"use client";

import { useEffect, useState } from "react";

const CURRENCIES = [
  "USD", "EUR", "GBP", "UGX", "KES", "TZS", "RWF", "ZAR", "NGN", "GHS",
  "EGP", "MAD", "INR", "AUD", "CAD", "CHF", "BRL", "MXN", "THB", "JPY",
];

type Rate = { date: string; base: string; quote: string; rate: number };

function num(value: string): number {
  const n = parseFloat(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function money(value: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${Math.round(value).toLocaleString("en")} ${currency}`;
  }
}

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-[#176b50] focus:ring-2 focus:ring-[#176b50]/20";

export default function BudgetPlanner() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [days, setDays] = useState("14");
  const [currency, setCurrency] = useState("USD");
  const [flights, setFlights] = useState("");
  const [stayPerNight, setStayPerNight] = useState("");
  const [foodPerDay, setFoodPerDay] = useState("");
  const [transportPerDay, setTransportPerDay] = useState("");
  const [activities, setActivities] = useState("");
  const [other, setOther] = useState("");
  const [target, setTarget] = useState("EUR");
  const [rate, setRate] = useState<Rate | null>(null);
  const [rateError, setRateError] = useState(false);

  const d = num(days);
  const rows = [
    { label: "Flights", amount: num(flights), note: "one-off" },
    { label: "Accommodation", amount: num(stayPerNight) * d, note: `${d} nights` },
    { label: "Food", amount: num(foodPerDay) * d, note: `${d} days` },
    { label: "Local transport", amount: num(transportPerDay) * d, note: `${d} days` },
    { label: "Activities and entertainment", amount: num(activities), note: "one-off" },
    { label: "Other expenses", amount: num(other), note: "one-off" },
  ];
  const total = rows.reduce((sum, row) => sum + row.amount, 0);

  useEffect(() => {
    setRate(null);
    setRateError(false);
    if (target === currency) return;
    const controller = new AbortController();
    const url = `https://api.frankfurter.dev/v2/rates?base=${currency}&quotes=${target}`;
    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("bad response");
        return res.json();
      })
      .then((data: Rate[]) => {
        const found = Array.isArray(data)
          ? data.find((item) => item.quote === target && item.rate > 0)
          : undefined;
        if (found) setRate(found);
        else setRateError(true);
      })
      .catch((err) => {
        if (err?.name !== "AbortError") setRateError(true);
      });
    return () => controller.abort();
  }, [currency, target]);

  function field(
    label: string,
    value: string,
    set: (v: string) => void,
    hint?: string
  ) {
    return (
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">
          {label}
        </span>
        <input
          type="number"
          inputMode="decimal"
          min="0"
          value={value}
          onChange={(e) => set(e.target.value)}
          placeholder="0"
          className={inputClass}
        />
        {hint && <span className="mt-1 block text-xs text-gray-500">{hint}</span>}
      </label>
    );
  }

  return (
    <div className="mt-8 space-y-8">
      <section className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">
            Travelling from (optional)
          </span>
          <input
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="City or country"
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">
            Travelling to (optional)
          </span>
          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="City or country"
            className={inputClass}
          />
        </label>
        {field("Trip length (days)", days, setDays)}
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">
            Your currency
          </span>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className={inputClass}
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section>
        <h2 className="text-xl font-bold text-[#17231f]">
          Your estimates ({currency})
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {field("Flights (total)", flights, setFlights)}
          {field("Accommodation (per night)", stayPerNight, setStayPerNight, "Many Travailaway hosts offer a bed, so this may be 0.")}
          {field("Food (per day)", foodPerDay, setFoodPerDay, "Many hosts offer meals, so this may be low.")}
          {field("Local transport (per day)", transportPerDay, setTransportPerDay)}
          {field("Activities and entertainment (total)", activities, setActivities)}
          {field("Other expenses (total)", other, setOther)}
        </div>
      </section>

      <section className="rounded-2xl bg-[#eaf4ef] p-5">
        <h2 className="text-xl font-bold text-[#104c3a]">Estimated total</h2>
        <ul className="mt-3 space-y-1 text-sm text-[#104c3a]">
          {rows.map((row) => (
            <li key={row.label} className="flex justify-between gap-3">
              <span>
                {row.label} <span className="opacity-70">({row.note})</span>
              </span>
              <span className="font-semibold">{money(row.amount, currency)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex justify-between gap-3 border-t border-[#176b50]/20 pt-3 text-lg font-bold text-[#104c3a]">
          <span>
            Total{from || to ? ` (${[from, to].filter(Boolean).join(" to ")})` : ""}
          </span>
          <span>{money(total, currency)}</span>
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium text-[#104c3a]" htmlFor="target">
            Show total in
          </label>
          <select
            id="target"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {target !== currency && rate && (
          <p className="mt-3 text-lg font-bold text-[#104c3a]">
            About {money(total * rate.rate, target)}
          </p>
        )}
        {target !== currency && rate && (
          <p className="mt-1 text-xs text-[#104c3a]/80">
            Rate: 1 {currency} = {rate.rate} {target}. Source: Frankfurter
            (frankfurter.dev), rate dated {rate.date}. Exchange rates change
            during the day.
          </p>
        )}
        {target !== currency && !rate && !rateError && (
          <p className="mt-3 text-sm text-[#104c3a]">Loading exchange rate...</p>
        )}
        {rateError && (
          <p className="mt-3 text-sm text-red-700">
            We could not load the exchange rate right now. Your total above is
            still correct in {currency}.
          </p>
        )}
      </section>

      <p className="text-sm leading-6 text-gray-500">
        All amounts are your own estimates, not guaranteed prices. Check
        flights, transport and accommodation costs with the provider before you
        book.
      </p>
    </div>
  );
}
