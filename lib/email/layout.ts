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
            <a href="${attr(content.button.url)}" target="_blank" style="display:inline-block;padding:16px 48px;font-family:${font};font-size:20px;line-height:24px;font-weight:700;color:${c.white};text-decoration:none;border-radius:32px;">${content.button.label}</a>
          </td>
        </tr></table>
      </td></tr>`
    : "";

  const extra = content.extraHtml
    ? `<tr><td align="center" style="padding:0 36px 18px 36px;font-family:${font};font-size:16px;line-height:24px;color:${c.text};">${content.extraHtml}</td></tr>`
    : "";

  const note = content.note
    ? `<tr><td align="center" style="padding:0 36px 30px 36px;font-family:${font};font-size:15px;line-height:22px;font-style:italic;color:${c.ink};">${content.note}</td></tr>`
    : "";

  const subheadline = content.subheadline
    ? `<tr><td align="center" style="padding:0 36px 22px 36px;font-family:${font};font-size:28px;line-height:34px;font-weight:700;color:${c.ink};">${content.subheadline}</td></tr>`
    : "";

  const unsubscribe = content.unsubscribeUrl
    ? `<tr><td align="center" style="padding:0 24px 8px 24px;font-family:${font};font-size:12px;line-height:18px;color:#ffffff;">You are receiving this because you subscribed to our newsletter. <a href="${attr(content.unsubscribeUrl)}" style="color:#ffffff;text-decoration:underline;">Unsubscribe</a></td></tr>`
    : "";

  const reason = content.reason
    ? `<tr><td align="center" style="padding:0 24px 8px 24px;font-family:${font};font-size:12px;line-height:18px;color:#ffffff;">${content.reason}</td></tr>`
    : "";

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light only">
<title>${esc(BRAND.name)}</title>
</head>
<body style="margin:0;padding:0;background-color:${c.page};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${c.page};font-size:1px;line-height:1px;">${content.preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${c.page}" style="background-color:${c.page};">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:${c.cream};">

<!-- Logo -->
<tr><td align="center" bgcolor="${c.white}" style="background-color:${c.white};padding:26px 20px 18px 20px;">
<a href="${attr(BRAND.website)}" target="_blank"><img src="${attr(BRAND.logoUrl)}" width="${BRAND.logoWidth}" alt="${esc(BRAND.name)}" style="display:block;width:${BRAND.logoWidth}px;max-width:100%;height:auto;border:0;"></a>
</td></tr>

<!-- Message -->
<tr><td style="padding-top:14px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td align="center" style="padding:0 36px 8px 36px;font-family:${font};font-size:34px;line-height:40px;font-weight:700;color:${c.orange};">${content.headline}</td></tr>
${subheadline}
${paragraphs}
${extra}
${button}
${note}
</table>
</td></tr>

<!-- Footer picture -->
<tr><td style="font-size:0;line-height:0;background-color:${c.cream};">
<img src="${attr(BRAND.footerArtUrl)}" width="600" alt="" style="display:block;width:100%;max-width:600px;height:auto;border:0;">
</td></tr>

<!-- Footer -->
<tr><td bgcolor="${c.orangeFooter}" style="background-color:${c.orangeFooter};padding:6px 0 26px 0;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td align="center" style="padding:6px 24px 4px 24px;font-family:${font};font-size:28px;line-height:34px;font-weight:700;color:#ffffff;">${esc(BRAND.name)}</td></tr>
<tr><td align="center" style="padding:0 24px 14px 24px;font-family:${font};font-size:16px;line-height:22px;font-style:italic;color:#ffffff;">${esc(BRAND.tagline)}</td></tr>
<tr><td align="center" style="padding:0 24px 14px 24px;font-family:${font};font-size:18px;line-height:24px;font-weight:700;"><a href="${attr(BRAND.website)}" target="_blank" style="color:#ffffff;text-decoration:none;">${esc(BRAND.websiteLabel)}</a></td></tr>
${reason}
${unsubscribe}
<tr><td align="center" style="padding:0 24px;font-family:${font};font-size:12px;line-height:18px;color:#ffffff;">${esc(BRAND.company)}</td></tr>
</table>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  const lines: string[] = [];
  lines.push(htmlToText(content.headline));
  if (content.subheadline) lines.push(htmlToText(content.subheadline));
  lines.push("");
  content.paragraphs.forEach((p) => lines.push(htmlToText(p), ""));
  if (content.extraHtml) lines.push(htmlToText(content.extraHtml), "");
  if (content.button) lines.push(`${htmlToText(content.button.label)}: ${content.button.url}`, "");
  if (content.note) lines.push(htmlToText(content.note), "");
  lines.push("--");
  lines.push(`${BRAND.name} - ${BRAND.tagline}`);
  lines.push(BRAND.website);
  lines.push(BRAND.company);
  if (content.reason) lines.push(htmlToText(content.reason));
  if (content.unsubscribeUrl) lines.push(`Unsubscribe: ${content.unsubscribeUrl}`);

  return { html, text: lines.join("\n").replace(/\n{3,}/g, "\n\n") };
}
