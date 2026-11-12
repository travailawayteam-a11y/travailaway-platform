"use client";

import { useEffect, useState } from "react";

const SHARE_TEXT =
  "Travailaway: travel, connect and experience. Join a community built on cultural exchange.";

export default function ShareCard() {
  const [url, setUrl] = useState("https://travailaway-platform.hostless.app");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(window.location.origin);
  }, []);

  const links = [
    {
      name: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`${SHARE_TEXT} ${url}`)}`,
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      name: "X",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(url)}`,
    },
    {
      name: "Telegram",
      href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(SHARE_TEXT)}`,
    },
    {
      name: "Email",
      href: `mailto:?subject=${encodeURIComponent("Have a look at Travailaway")}&body=${encodeURIComponent(`${SHARE_TEXT} ${url}`)}`,
    },
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt("Copy this link:", url);
    }
  }

  return (
    <div className="rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-[#0f3d2e]">Share TravailAway</h2>
      <p className="mt-2 text-sm leading-6 text-gray-600">
        Know someone who would love to travel differently, or a host who could welcome travellers?
        Share Travailaway with them.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {links.map((item) => (
          <a
            key={item.name}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-[#176b50] px-4 py-2 text-sm font-semibold text-[#176b50] hover:bg-[#176b50] hover:text-white"
          >
            {item.name}
          </a>
        ))}
        <button
          type="button"
          onClick={copyLink}
          className="rounded-full bg-amber-400 px-4 py-2 text-sm font-bold text-[#3b2a00] hover:bg-amber-300"
        >
          {copied ? "Link copied!" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
