// The one shared Travailaway email layout.
// Every template builds its content and passes it to renderEmail().
// Tables and inline styles are used on purpose: they work in Gmail, Outlook,
// Apple Mail and phone mail apps.

import { BRAND } from "./brand";

export type EmailButton = {
  label: string;
  // A normal address, or a Supabase tag such as {{ .ConfirmationURL }}.
  url: string;
};

export type EmailContent = {
  // Short grey preview text shown beside the subject in the inbox.
  preheader: string;
  // Big orange heading, e.g. "Welcome to TravailAway!".
  headline: string;
  // Dark bold line under it, e.g. "Your journey starts here."
  subheadline?: string;
  // Paragraphs. Simple HTML such as <strong> is allowed. Escape anything
  // that came from a person with esc() before you pass it in.
  paragraphs: string[];
  button?: EmailButton;
  // Small italic line under the button.
  note?: string;
  // Optional extra HTML block between the paragraphs and the button
  // (for example a quoted message or a one-time code).
  extraHtml?: string;
  // Newsletter emails: address of the unsubscribe link.
  unsubscribeUrl?: string;
  // Why the person is getting this email (shown small in the footer).
  reason?: string;
};

export type RenderedEmail = { html: string; text: string };

// Makes text safe to place inside HTML.
export function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Supabase tags like {{ .ConfirmationURL }} must stay exactly as written.
function attr(value: string): string {
  if (value.includes("{{")) return value;
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function htmlToText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<a [^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gi, "$2 ($1)")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function renderEmail(content: EmailContent): RenderedEmail {
  const c = BRAND.colors;
  const font = BRAND.fontFamily;

  const paragraphs = content.paragraphs
    .map(
      (p) =>
        `<tr><td align="center" style="padding:0 36px 18px 36px;font-family:${font};font-size:18px;line-height:28px;color:${c.text};">${p}</td></tr>`
    )
    .join("\n");

  const button = content.button
    ? `<tr><td align="center" style="padding:12px 36px 22px 36px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
          <td align="center" bgcolor="${c.orange}" style="border-radius:32px;background-color:${c.orange};">
            <a href="${attr(content.button.url)}" target="_blank" style="display:inline-block;
