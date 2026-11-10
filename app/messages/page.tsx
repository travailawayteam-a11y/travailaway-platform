"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

type Conversation = {
  id: string;
  listing_id: string | null;
  traveller_id: string;
  host_id: string;
  created_at: string;
};

type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  created_at: string;
};

function formatWhen(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MessagesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [titles, setTitles] = useState<Record<string, string>>({});
  const [names, setNames] = useState<Record<string, string>>({});
  const [openId, setOpenId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [replyError, setReplyError] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const supabase = createClient();
        const { data: userData } = await supabase.auth.getUser();
        const user = userData.user;

        if (!user) {
          window.location.href = "/login";
          return;
        }
        if (!active) return;
        setUserId(user.id);

        const { data, error: convoError } = await supabase
          .from("conversations")
          .select("id, listing_id, traveller_id, host_id, created_at")
          .order("created_at", { ascending: false });

        if (!active) return;
        if (convoError) {
          console.error("Load conversations failed:", convoError.message);
          setError("We could not load your messages. Please try again.");
          setLoading(false);
          return;
        }

        const list = (data ?? []) as Conversation[];
        setConversations(list);

        const listingIds = Array.from(
          new Set(list.map((item) => item.listing_id).filter(Boolean))
        ) as string[];
        if (listingIds.length > 0) {
          const { data: listingRows } = await supabase
            .from("listings")
            .select("id, title")
            .in("id", listingIds);
          if (active && listingRows) {
            const map: Record<string, string> = {};
            listingRows.forEach((row) => {
              map[row.id as string] = row.title as string;
            });
            setTitles(map);
          }
        }

        const otherIds = Array.from(
          new Set(
            list.map((item) =>
              item.traveller_id === user.id ? item.host_id : item.traveller_id
            )
          )
        );
        if (otherIds.length > 0) {
          const { data: people } = await supabase
            .from("profiles")
            .select("id, full_name")
            .in("id", otherIds);
          if (active && people) {
            const map: Record<string, string> = {};
            people.forEach((row) => {
              if (row.full_name) map[row.id as string] = row.full_name as string;
            });
            setNames(map);
          }
        }
      } catch (err) {
        console.error("Load messages failed:", err);
        if (active) setError("We could not load your messages. Please try again.");
      }
      if (active) setLoading(false);
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const openConversation = useCallback(async (id: string) => {
    setOpenId(id);
    setReply("");
    setReplyError("");
    setLoadingMessages(true);
    try {
      const supabase = createClient();
      const { data, error: messageError } = await supabase
        .from("messages")
        .select("id, conversation_id, sender_id, message, created_at")
        .eq("conversation_id", id)
        .order("created_at", { ascending: true });

      if (messageError) {
        console.error("Load thread failed:", messageError.message);
        setMessages([]);
      } else {
        setMessages((data ?? []) as Message[]);
      }
    } catch (err) {
      console.error("Load thread failed:", err);
      setMessages([]);
    }
    setLoadingMessages(false);
  }, []);

  async function sendReply(event: FormEvent) {
    event.preventDefault();
    setReplyError("");

    const text = reply.trim();
    if (!text || !openId || !userId) return;

    setSending(true);
    try {
      const supabase = createClient();
      const { error: sendError } = await supabase.from("messages").insert({
        conversation_id: openId,
        sender_id: userId,
        message: text,
      });

      if (sendError) {
        console.error("Send reply failed:", sendError.message);
        setReplyError(
          "We could not send your reply. If you are a traveller, check that your membership is active."
        );
      } else {
        setReply("");
        await openConversation(openId);
      }
    } catch (err) {
      console.error("Send reply failed:", err);
      setReplyError("Something went wrong. Please try again.");
    }
    setSending(false);
  }

  const openConvo = conversations.find((item) => item.id === openId) ?? null;

  function otherPerson(item: Conversation) {
    const otherId = item.traveller_id === userId ? item.host_id : item.traveller_id;
    const fallback = item.traveller_id === userId ? "The host" : "The traveller";
    return names[otherId] || fallback;
  }

  function topic(item: Conversation) {
    return (item.listing_id && titles[item.listing_id]) || "Conversation";
  }

  return (
    <main className="min-h-screen bg-[#f7faf8]">
      <SiteHeader />

      <section className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-3xl font-bold text-[#17231f]">Messages</h1>
        <p className="mt-2 text-gray-600">
          Your conversations with hosts and travellers.
        </p>

        {loading ? (
          <div className="mt-8 rounded-2xl bg-white p-10 text-center text-gray-600 shadow-sm">
            Loading your messages...
          </div>
        ) : error ? (
          <div className="mt-8 rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="text-red-600">{error}</p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-emerald-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-bold text-[#17231f]">No messages yet</h2>
            <p className="mt-2 text-gray-600">
              When you write to a host, or a traveller writes to you, the
              conversation appears here.
            </p>
            <Link
              href="/explore"
              className="mt-5 inline-block rounded-full bg-emerald-700 px-6 py-3 font-bold text-white hover:bg-emerald-800"
            >
              Explore opportunities
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-[320px_1fr]">
            <ul className="space-y-3">
              {conversations.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => openConversation(item.id)}
                    className={`w-full rounded-2xl border p-4 text-left shadow-sm transition hover:border-emerald-400 ${
                      openId === item.id
                        ? "border-emerald-600 bg-emerald-50"
                        : "border-gray-100 bg-white"
                    }`}
                  >
                    <span className="block font-bold text-[#17231f]">
                      {otherPerson(item)}
                    </span>
                    <span className="mt-1 block text-sm text-gray-600">
                      {topic(item)}
                    </span>
                    <span className="mt-1 block text-xs text-gray-400">
                      Started {formatWhen(item.created_at)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              {!openConvo ? (
                <p className="py-16 text-center text-gray-500">
                  Choose a conversation to read it.
                </p>
              ) : (
                <>
                  <div className="border-b pb-3">
                    <h2 className="font-bold text-[#17231f]">
                      {otherPerson(openConvo)}
                    </h2>
                    <p className="text-sm text-gray-600">{topic(openConvo)}</p>
                  </div>

                  <div className="mt-4 max-h-[420px] space-y-3 overflow-y-auto">
                    {loadingMessages ? (
                      <p className="text-gray-500">Loading...</p>
                    ) : messages.length === 0 ? (
                      <p className="text-gray-500">No messages in this conversation.</p>
                    ) : (
                      messages.map((item) => {
                        const mine = item.sender_id === userId;
                        return (
                          <div
                            key={item.id}
                            className={`flex ${mine ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                                mine
                                  ? "bg-emerald-700 text-white"
                                  : "bg-gray-100 text-slate-800"
                              }`}
                            >
                              <p className="whitespace-pre-line">{item.message}</p>
                              <p
                                className={`mt-1 text-[11px] ${
                                  mine ? "text-emerald-100" : "text-gray-500"
                                }`}
                              >
                                {formatWhen(item.created_at)}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <form onSubmit={sendReply} className="mt-4 border-t pt-4">
                    <textarea
                      value={reply}
                      onChange={(event) => setReply(event.target.value)}
                      rows={3}
                      maxLength={2000}
                      placeholder="Write a reply..."
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-emerald-600"
                    />
                    {replyError && (
                      <p className="mt-2 text-sm font-semibold text-red-700">{replyError}</p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-3">
                      <button
                        type="submit"
                        disabled={sending || !reply.trim()}
                        className="rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-800 disabled:opacity-60"
                      >
                        {sending ? "Sending..." : "Send reply"}
                      </button>
                      <button
                        type="button"
                        onClick={() => openConversation(openConvo.id)}
                        className="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50"
                      >
                        Refresh
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}
