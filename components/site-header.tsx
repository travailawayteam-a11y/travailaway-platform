"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

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

type Account = { type: string; admin: boolean } | null;

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  // undefined = still checking, null = logged out
  const [account, setAccount] = useState<Account | undefined>(undefined);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    async function load() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          if (active) setAccount(null);
          return;
        }

        const [profileResult, adminResult] = await Promise.all([
          supabase.from("profiles").select("account_type").eq("id", user.id).maybeSingle(),
          supabase.from("admins").select("user_id").eq("user_id", user.id).maybeSingle(),
        ]);

        if (active) {
          setAccount({
            type: profileResult.data?.account_type ?? user.user_metadata?.account_type ?? "traveller",
            admin: Boolean(adminResult.data),
          });
        }
      } catch {
        if (active) setAccount(null);
      }
    }

    load();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      load();
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const accountLinks = account
    ? [
        { label: "My dashboard", href: "/dashboard" },
        { label: "Messages", href: "/messages" },
        ...(account.admin ? [{ label: "Team review", href: "/admin" }] : []),
      ]
    : [];

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

        <nav className="hidden items-center gap-5 text-[13px] font-semibold 2xl:flex">
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
          {account === null && (
            <>
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
            </>
          )}
          {account && (
            <>
              <Link
                href="/dashboard"
                className="hidden rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-800 sm:block"
              >
                My dashboard
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="hidden px-3 py-2 text-sm font-semibold text-slate-700 hover:text-emerald-700 sm:block"
              >
                Log out
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label="Toggle menu"
            className="rounded-lg p-2 2xl:hidden"
          >
            {open ? <X size={27} /> : <Menu size={27} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="max-h-[80vh] overflow-y-auto border-t bg-white px-4 py-5 md:px-8 2xl:hidden">
          {account && (
            <div className="mx-auto mb-4 flex max-w-7xl flex-wrap gap-2 border-b pb-4">
              {accountLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-bold text-white"
                >
                  {item.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold"
              >
                Log out
              </button>
            </div>
          )}

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

          {account === null && (
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
          )}
        </div>
      )}
    </header>
  );
}
