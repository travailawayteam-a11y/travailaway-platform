"use client";

import { useEffect, useState } from "react";
import { Globe } from "lucide-react";

// Languages offered on Travailaway. "code" is the language code used by the
// translation service; "label" is the language written in its own language.
const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "it", label: "Italiano" },
  { code: "el", label: "Ελληνικά" },
  { code: "zh-CN", label: "中文" },
  { code: "sw", label: "Kiswahili" },
  { code: "pt", label: "Português" },
  { code: "de", label: "Deutsch" },
  { code: "nl", label: "Nederlands" },
  { code: "da", label: "Dansk" },
  { code: "sv", label: "Svenska" },
];

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: new (
          options: { pageLanguage: string; includedLanguages: string; autoDisplay: boolean },
          elementId: string
        ) => unknown;
      };
    };
  }
}

const STORAGE_KEY = "travailaway-language";

// The visitor's choice is remembered in the browser. This is the main record;
// the translation cookie below is only there for the translation service.
function readLanguage(): string {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
  } catch {
    // Browser storage is blocked, so fall back to the cookie.
  }
  const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]*)/);
  if (!match) return "en";
  const parts = decodeURIComponent(match[1]).split("/");
  return parts[2] || "en";
}

// Removes the translation cookie everywhere it might have been saved.
function clearTranslationCookie() {
  const expired = "Thu, 01 Jan 1970 00:00:00 GMT";
  const host = window.location.hostname;
  const pieces = host.split(".");
  const domains: string[] = [host];
  for (let i = 0; i < pieces.length - 1; i++) {
    const part = pieces.slice(i).join(".");
    domains.push(part, "." + part);
  }
  document.cookie = `googtrans=; expires=${expired}; path=/`;
  for (const domain of domains) {
    document.cookie = `googtrans=; expires=${expired}; path=/; domain=${domain}`;
  }
}

function chooseLanguage(code: string) {
  clearTranslationCookie();

  try {
    window.localStorage.setItem(STORAGE_KEY, code);
  } catch {
    // Ignore: the cookie still works for this visit.
  }

  if (code !== "en") {
    document.cookie = `googtrans=/en/${code}; path=/; max-age=31536000`;
  }

  window.location.reload();
}

// The translation service changes the page text directly, which can confuse
// React when it later updates the same text. These two guards stop that from
// causing errors. They are only switched on when a language other than
// English is chosen.
function protectAgainstTranslationClashes() {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(this: Node, child: T): T {
    if (child.parentNode !== this) {
      return child;
    }
    return originalRemoveChild.call(this, child) as T;
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(
    this: Node,
    newNode: T,
    referenceNode: Node | null
  ): T {
    if (referenceNode && referenceNode.parentNode !== this) {
      return newNode;
    }
    return originalInsertBefore.call(this, newNode, referenceNode) as T;
  };
}

export default function LanguageSwitcher() {
  const [current, setCurrent] = useState("en");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const code = readLanguage();
    setCurrent(code);

    // Only load the translation service when a visitor has chosen a language.
    if (code === "en") return;

    protectAgainstTranslationClashes();

    window.googleTranslateElementInit = () => {
      if (!window.google) return;
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: LANGUAGES.map((item) => item.code).join(","),
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    const script = document.createElement("script");
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const currentLabel =
    LANGUAGES.find((item) => item.code === current)?.label || "English";

  return (
    <div className="notranslate" translate="no">
      <style>{`
        .goog-te-banner-frame, .goog-te-balloon-frame, #goog-gt-tt, .goog-tooltip,
        iframe.skiptranslate { display: none !important; }
        body { top: 0 !important; }
        .goog-text-highlight { background: none !important; box-shadow: none !important; }
      `}</style>

      <div id="google_translate_element" className="hidden" />

      <div className="fixed bottom-4 left-4 z-[60]">
        {open && (
          <ul className="mb-2 max-h-[70vh] w-48 overflow-y-auto rounded-2xl border border-gray-200 bg-white p-2 shadow-xl">
            {LANGUAGES.map((item) => (
              <li key={item.code}>
                <button
                  type="button"
                  onClick={() => chooseLanguage(item.code)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-emerald-50 ${
                    item.code === current
                      ? "bg-emerald-50 font-bold text-emerald-800"
                      : "text-slate-700"
                  }`}
                >
                  {item.label}
                  {item.code === current && <span>✓</span>}
                </button>
              </li>
            ))}
          </ul>
        )}

        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label="Choose language"
          aria-expanded={open}
          className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-lg hover:bg-gray-50"
        >
          <Globe size={18} className="text-emerald-700" />
          {currentLabel}
        </button>
      </div>
    </div>
  );
}
