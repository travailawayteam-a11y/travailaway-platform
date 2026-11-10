"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Props = {
  listingId: string;
  hostId: string | null;
  title: string;
};

type Stage =
  | "loading"
  | "loggedOut"
  | "ownListing"
  | "hostAccount"
  | "needsMembership"
  | "ready"
  | "sent";

export default function ContactHost({ listingId, hostId, title }: Props) {
  const [stage, setStage] = useState<Stage>("loading");
  const [userId, setUserId] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function check() {
      try {
        const supabase = createClient();
        const { data: userData } = await supabase.auth.getUser();
        const user = userData.user;

        if (!active) return;
        if (!user) {
          setStage("loggedOut");
          return;
        }
        setUserId(user.id);

        if (hostId && user.id === hostId) {
          setStage("ownListing");
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("account_type")
          .eq("id", user.id)
          .maybeSingle();

        if (!active) return;
        if (profile?.account_type === "host") {
          setStage("hostAccount");
          return;
        }

        const { data: membership } = await supabase
          .from("memberships")
          .select("expires_at")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!active) return;
        const isMember =
          !!membership && new Date(membership.expires_at).getTime() > Date.now();
        setStage(isMember ? "ready" : "needsMembership");
      } catch (err) {
        console.error("Contact host check failed:", err);
        if (active) setStage("loggedOut");
      }
    }

    check();
    return () => {
      active = false;
    };
  }, [hostId]);

  async function send(event: FormEvent) {
    event.preventDefault();
    setError("");

    const message = text.trim();
    if (message.length < 10) {
      setError("Please write a little more, at least a couple of sentences.");
      return;
    }
    if (!userId || !hostId) {
      setError("We could not find the host for this opportunity.");
      return;
    }

    setSending(true);
    try {
      const supabase = createClient();

      // Reuse the conversation if this traveller already wrote to this host.
      const { data: existing } = await supabase
        .from("conversations")
        .select("id")
        .eq("listing_id", listingId)
        .eq("traveller_id", userId)
        .eq("host_id", hostId)
        .maybeSingle();

      let conversationId = existing?.id as string | undefined;

      if (!conversationId) {
        const { data: created, error: createError } = await supabase
          .from("conversations")
          .insert({ listing_id: listingId, traveller_id: userId, host_id: hostId })
          .select("id")
          .single();

        if (createError || !created) {
          console.error("Start conversation failed:", createError?.message);
          setError(
            "We could not send your message. A membership is needed to contact hosts."
          );
          setSending(false);
          return;
        }
        conversationId = created.id as string;
      }

      const { error: messageError } = await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_id: userId,
        message,
      });

      if (messageError) {
        console.error("Send message failed:", messageError.message);
        setError("We could not send your message. Please try again.");
        setSending(false);
        return;
      }

      setText("");
      setStage("sent");
    } catch (err) {
      console.error("Send message failed:", err);
      setError("Something went wrong. Please try again.");
    }
    setSending(false);
  }

  const box = "rounded-xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-900";

  if (stage === "loading") {
    return <div className={box}>One moment...</div>;
  }

  if (stage === "loggedOut") {
    return (
      <div className={box}>
        Interested in this opportunity? Create a traveller account or log in to
        get started.
        <div className="mt-3 flex flex-wrap gap-3 font-bold">
          <Link href="/register?type=traveller" className="underline">
            Create account
          </Link>
          <Link href="/login" className="underline">
            Log in
          </Link>
        </div>
      </div>
    );
  }

  if (stage === "ownListing") {
    return <div className={box}>This is your own opportunity.</div>;
  }

  if (stage === "hostAccount") {
    return (
      <div className={box}>
        Only traveller accounts can contact hosts. You are logged in with a host
        account.
      </div>
    );
  }

  if (stage === "needsMembership") {
    return (
      <div className={box}>
        <p className="font-bold">Become a member to contact this host.</p>
        <p className="mt-1">
          Your free account lets you explore. A traveller membership lets you
          message hosts and apply to opportunities.
        </p>
        <Link
          href="/membership"
          className="mt-3 inline-block rounded-full bg-emerald-700 px-5 py-2.5 font-bold text-white hover:bg-emerald-800"
        >
          See membership plans
        </Link>
      </div>
    );
  }

  if (stage === "sent") {
    return (
      <div className={box}>
        <p className="font-bold">Your message has been sent.</p>
        <p className="mt-1">The host will be able to read it and reply.</p>
      </div>
    );
  }

  return (
    <form onSubmit={send} className={box}>
      <label htmlFor={`message-${listingId}`} className="font-bold">
        Write to the host of &ldquo;{title}&rdquo;
      </label>
      <textarea
        id={`message-${listingId}`}
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={5}
        maxLength={2000}
        placeholder="Introduce yourself, say when you hope to visit and what you can offer."
        className="mt-2 w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-slate-800 outline-none focus:border-emerald-600"
      />
      {error && <p className="mt-2 font-semibold text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={sending}
        className="mt-3 rounded-full bg-emerald-700 px-5 py-2.5 font-bold text-white hover:bg-emerald-800 disabled:opacity-60"
      >
        {sending ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
