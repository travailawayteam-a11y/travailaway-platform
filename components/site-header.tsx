"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const logo =
  "https://sbgfaplqdxejirqfqfpn.supabase.co/storage/v1/object/public/brand-assets/1000296575-removebg-preview.png";

export const MENU_ITEMS = [
  {
    label: "Discover hosts",
    short: "Discover hosts",
    description: "Browse welcoming hosts and projects around the world.",
    href: "/explore",
  },
  {
    label: "Meet a travel companion",
    short: "Travel companions",
    description: "Planning a trip? Find someone to share the road with.",
    href: "/travel-buddies",
  },
  {
    label: "How Travailaway works",
    short: "How it works",
    description: "A simple guide for travellers and hosts.",
    href: "/how-it-works",
  },
  {
    label: "Gatherings & events",
    short: "Events",
    description: "Meet fellow travellers and hosts in person.",
    href: "/meetups",
  },
  {
    label: "Learn on the road",
    short: "Learn on the road",
    description: "Pick up new skills, languages and traditions as you travel.",
    href: "/travel-and-learn",
  },
  {
    label: "Our community",
    short: "Community",
    description: "The people who make Travailaway what it is.",
    href: "/community",
  },
  {
    label: "Making a difference",
    short: "Our impact",
    description: "How cultural exchange can leave a place better than you found it.",
    href: "/giving-back",
  },
  {
    label: "Work with us",
    short: "Work with us",
    description: "Volunteer your skills and help us build Travailaway.",
    href: "/work-with-us",
  },
  {
    label: "Safety & trust",
    short: "Safety",
    description: "How we help everyone feel secure and respected.",
    href: "/safety",
  },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <Link href="/" className="shrink-0">
          <img
            src={logo}
            alt="Travailaway"
            className="h-16 w-auto object-contain md:h-20"
          />
        </Link>

        <nav className="hidden items-center gap-4 text-[13px] font-semibold xl:flex">
          {MENU_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap hover:text-emerald-700"
            >
              {item.short}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <Link
            href="/login"
            className="hidden px-4 py-2 text-sm font-semibold sm:block"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="hidden rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-800 sm:block"
          >
            Join Travailaway
          </Link>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label="Toggle menu"
            className="rounded-lg p-2 xl:hidden"
          >
            {open ? <X size={27} /> : <Menu size={27} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="max-h-[80vh] overflow-y-auto border-t bg-white px-4 py-5 md:px-8 xl:hidden">
          <nav className="mx-auto grid max-w-7xl gap-1 sm:grid-cols-2 lg:grid-cols-4">
            {MENU_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl p-3 hover:bg-emerald-50"
              >
                <span className="block font-semibold text-slate-800">
                  {item.label}
                </span>
                <span className="mt-1 block text-sm text-gray-600">
                  {item.description}
                </span>
              </Link>
            ))}
          </nav>

          <div className="mx-auto mt-4 flex max-w-7xl gap-3 border-t pt-4 sm:hidden">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-full border border-gray-300 px-4 py-3 text-center text-sm font-semibold"
            >
              Log in
            </Link>
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-full bg-emerald-700 px-4 py-3 text-center text-sm font-bold text-white"
            >
              Join Travailaway
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
