"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

// Remembers the ambassador code from a link like travailaway.info/?ref=amina
// and attaches it to the account once the person has signed up and logged in.
// It never shows anything and never blocks the page.

const KEY = "ta_ref";
const PATTERN = /^[a-z0-9]{3,20}$/;
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

function readStored(): string | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw) as { code?: string; at?: number };
    if (
      typeof saved.code === "string" &&
      PATTERN.test(saved.code) &&
      typeof saved.at === "number" &&
      Date.now() - saved.at < THIRTY_DAYS
    ) {
      return saved.code;
    }
    window.localStorage.removeItem(KEY);
  } catch {
    // Storage can be blocked. Ignore.
  }
  return null;
}

export default function ReferralTracker() {
  useEffect(() => {
    try {
      const fromLink = new URLSearchParams(window.location.search).get("ref");
      if (fromLink) {
        const code = fromLink.trim().toLowerCase();
        if (PATTERN.test(code)) {
          window.localStorage.setItem(KEY, JSON.stringify({ code, at: Date.now() }));
        }
      }
    } catch {
      // Ignore.
    }

    const supabase = createClient();

    async function claim() {
      const code = readStored();
      if (!code) return;
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;
        const { error } = await supabase.rpc("claim_referral", { p_code: code });
        if (!error) window.localStorage.removeItem(KEY);
      } catch {
        // Try again next time.
      }
    }

    claim();
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") claim();
    });
    return () => data.subscription.unsubscribe();
  }, []);

  return null;
}
