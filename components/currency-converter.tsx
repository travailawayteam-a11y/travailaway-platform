"use client";

import { useEffect, useState } from "react";

const CURRENCIES: [string, string][] = [
  ["USD", "US dollar"], ["EUR", "Euro"], ["GBP", "British pound"],
  ["UGX", "Ugandan shilling"], ["KES", "Kenyan shilling"],
  ["TZS", "Tanzanian shilling"], ["RWF", "Rwandan franc"],
  ["ZAR", "South African rand"], ["NGN", "Nigerian naira"],
  ["GHS", "Ghanaian cedi"], ["EGP", "Egyptian pound"],
  ["MAD", "Moroccan dirham"], ["ETB", "Ethiopian birr"],
  ["XOF", "West African CFA franc"], ["INR", "Indian rupee"],
  ["AUD", "Australian dollar"], ["CAD", "Canadian dollar"],
  ["NZD", "New Zealand dollar"], ["CHF", "Swiss franc"],
  ["SEK", "Swedish krona"], ["NOK", "Norwegian krone"],
  ["DKK", "Danish krone"], ["PLN", "Polish zloty"],
  ["CZK", "Czech koruna"], ["HUF", "Hungarian forint"],
  ["TRY", "Turkish lira"], ["AED", "UAE dirham"],
  ["BRL", "Brazilian real"], ["MXN", "Mexican peso"],
  ["ARS", "Argentine peso"], ["COP", "Colombian peso"],
  ["THB", "Thai baht"], ["VND", "Vietnamese dong"],
  ["IDR", "Indonesian rupiah"], ["MYR", "Malaysian ringgit"],
  ["PHP", "Philippine peso"], ["JPY", "Japanese yen"],
  ["CNY", "Chinese yuan"], ["KRW", "South Korean won"],
];

type Rate = { date: string; base: string; quote: string; rate: number };

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-[#176b50] focus:ring-2 focus:ring-[#176b50]/20";

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [rate, setRate] = useState<Rate | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setRate(null);
    setFailed(false);
    if (from === to) return;
    const controller = new AbortController();
    fetch(`https://api.frankfurter.dev/v2/rates?base=${from}&quotes=${to}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("bad response");
        return res.json();
      })
      .then((data: Rate[]) => {
        const found = Array.isArray(data)
          ? data.find((item) => item.quote === to && item.rate > 0)
          : undefined;
        if (found) setRate(found);
        else setFailed(true);
      })
      .catch((err) => {
        if (err?.name !== "AbortError") setFailed(true);
      });
    return () => controller.abort();
  }, [from, to]);

  const value = parseFloat(amount);
  const valid = Number.isFinite(value) && value >= 0;
  const effectiveRate = from === to ? 1 : rate?.rate;
  const result = valid && effectiveRate ? value * effectiveRate : null;

  function swap() {
    setFrom(to);
    setTo(from);
  }

  const options = CURRENCIES.map(([code, name]) => (
    <option key={code} value={code}>
      {code} - {name}
    </option>
  ));

  return (
    <div className="mt-8 space-y-5">
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">
          Amount
        </span>
        <input
          type="number"
          inputMode="decimal"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={inputClass}
        />
      </label>

      <div className="grid items-end gap-3 sm:grid-cols-[1fr_auto_1fr]">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">
            From
          </span>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className={inputClass}
          >
            {options}
          </select>
        </label>
        <button
          type="button"
          onClick={swap}
          className="rounded-full border border-gray-300 px-4 py-2.5 text-sm font-semibold hover:bg-gray-50"
        >
          Swap
        </button>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">To</span>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className={inputClass}
          >
            {options}
          </select>
        </label>
      </div>

      <div className="rounded-2xl bg-[#eaf4ef] p-5 text-[#104c3a]">
        {result !== null ? (
          <>
            <p className="text-sm">
              {value.toLocaleString("en")} {from} =
            </p>
            <p className="mt-1 text-3xl font-bold">
              {result.toLocaleString("en", { maximumFractionDigits: 2 })} {to}
            </p>
            {from !== to && rate && (
              <p className="mt-3 text-xs opacity-80">
                Rate: 1 {from} = {rate.rate} {to}. Source: Frankfurter
                (frankfurter.dev), dated {rate.date}. Rates change during the
                day, so your bank or transfer service may differ.
              </p>
            )}
          </>
        ) : failed ? (
          <p className="text-sm text-red-700">
            We could not load the exchange rate right now. Please try again in
            a moment.
          </p>
        ) : valid ? (
          <p className="text-sm">Loading exchange rate...</p>
        ) : (
          <p className="text-sm">Enter an amount to convert.</p>
        )}
      </div>
    </div>
  );
}
