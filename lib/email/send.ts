// Sends an email through Resend. Use this only on the server (an API route
// or a server action), never in a browser component.
//
// It needs two settings in Hostless (Environment variables). They are secrets:
//   RESEND_API_KEY   the key that starts with re_
//   EMAIL_FROM       optional, for example: TravailAway <info@travailaway.info>
//
// Supabase account emails (confirm, reset and so on) do NOT use this file.
// Supabase sends those itself through its own Resend connection.

import type { RenderedEmail } from "./layout";
import { BRAND } from "./brand";

export type SendEmailInput = {
  to: string | string[];
  subject: string;
  email: RenderedEmail;
  replyTo?: string;
};

export type SendEmailResult = { ok: true; id: string } | { ok: false; error: string };

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY is not set" };
  }

  const from = process.env.EMAIL_FROM || `${BRAND.name} <${BRAND.supportEmail}>`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: input.to,
        subject: input.subject,
        html: input.email.html,
        text: input.email.text,
        reply_to: input.replyTo || BRAND.supportEmail,
      }),
    });

    const data = (await response.json().catch(() => ({}))) as { id?: string; message?: string };

    if (!response.ok || !data.id) {
      return { ok: false, error: data.message || `Resend returned status ${response.status}` };
    }
    return { ok: true, id: data.id };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Could not reach Resend" };
  }
}
