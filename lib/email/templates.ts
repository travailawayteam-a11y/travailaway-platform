// Every Travailaway email. Each one fills in the shared layout (layout.ts).
//
// Two groups:
//  1. AUTH_TEMPLATES: sent by Supabase. The {{ .Something }} tags are filled
//     in by Supabase itself, so they must stay exactly as written.
//  2. App emails: built with real values and sent through sendEmail() (send.ts).

import { BRAND } from "./brand";
import { esc, renderEmail, type RenderedEmail } from "./layout";

const site = BRAND.website.replace(/\/$/, "");

// ---------------------------------------------------------------------------
// 1. Supabase account emails
// ---------------------------------------------------------------------------

export type AuthTemplate = {
  file: string; // file name in supabase/email-templates
  supabaseName: string; // name of the template in the Supabase dashboard
  subject: string;
  email: RenderedEmail;
};

export const AUTH_TEMPLATES: AuthTemplate[] = [
  {
    file: "confirm-signup.html",
    supabaseName: "Confirm sign up",
    subject: "Welcome to TravailAway! Please confirm your email",
    email: renderEmail({
      preheader: "Confirm your email address to activate your TravailAway account.",
      headline: "Welcome to TravailAway!",
      subheadline: "Your journey starts here.",
      paragraphs: [
        "Thank you for joining TravailAway, a community connecting travellers and hosts around the world.",
        "We&rsquo;re excited to have you with us! Please confirm your email address to activate your account.",
      ],
      button: { label: "Confirm Email", url: "{{ .ConfirmationURL }}" },
      note: "If you didn&rsquo;t create this account, you can safely ignore this email.",
    }),
  },
  {
    file: "invite-user.html",
    supabaseName: "Invite user",
    subject: "You have been invited to TravailAway",
    email: renderEmail({
      preheader: "Accept your invitation to join TravailAway.",
      headline: "You&rsquo;re invited!",
      subheadline: "Join the TravailAway community.",
      paragraphs: [
        "You have been invited to create an account on TravailAway, where travellers and hosts share places, skills and stories.",
        "Tap the button below to accept your invitation and set up your account.",
      ],
      button: { label: "Accept Invitation", url: "{{ .ConfirmationURL }}" },
      note: "If you weren&rsquo;t expecting this invitation, you can safely ignore this email.",
    }),
  },
  {
    file: "magic-link.html",
    supabaseName: "Magic link",
    subject: "Your TravailAway sign-in link",
    email: renderEmail({
      preheader: "Use this secure link to sign in to TravailAway.",
      headline: "Sign in to TravailAway",
      subheadline: "Welcome back.",
      paragraphs: ["Tap the button below to sign in. This link can only be used once and will expire soon."],
      button: { label: "Sign In", url: "{{ .ConfirmationURL }}" },
      note: "If you didn&rsquo;t ask to sign in, you can safely ignore this email.",
    }),
  },
  {
    file: "change-email.html",
    supabaseName: "Change email address",
    subject: "Confirm your new TravailAway email address",
    email: renderEmail({
      preheader: "Confirm the new email address for your TravailAway account.",
      headline: "Confirm your new email",
      subheadline: "One quick step.",
      paragraphs: [
        "You asked to change the email address of your TravailAway account from <strong>{{ .Email }}</strong> to <strong>{{ .NewEmail }}</strong>.",
        "Please confirm the change with the button below.",
      ],
      button: { label: "Confirm New Email", url: "{{ .ConfirmationURL }}" },
      note: "If you didn&rsquo;t ask for this change, please ignore this email and keep your account secure by choosing a new password.",
    }),
  },
  {
    file: "reset-password.html",
    supabaseName: "Reset password",
    subject: "Reset your TravailAway password",
    email: renderEmail({
      preheader: "Choose a new password for your TravailAway account.",
      headline: "Reset your password",
      subheadline: "Let&rsquo;s get you back in.",
      paragraphs: [
        "We received a request to reset the password for your TravailAway account.",
        "Tap the button below to choose a new password.",
      ],
      button: { label: "Reset Password", url: "{{ .ConfirmationURL }}" },
      note: "If you didn&rsquo;t ask for this, you can safely ignore this email. Your password will stay the same.",
    }),
  },
  {
    file: "reauthentication.html",
    supabaseName: "Reauthentication",
    subject: "Your TravailAway security code",
    email: renderEmail({
      preheader: "Your one-time security code for TravailAway.",
      headline: "Your security code",
      subheadline: "Enter this code to continue.",
      paragraphs: ["Use the code below to confirm it&rsquo;s really you. It can only be used once."],
      extraHtml:
        '<span style="display:inline-block;padding:14px 30px;border-radius:14px;background-color:#ffffff;border:2px solid #f97a04;font-size:32px;line-height:38px;font-weight:700;letter-spacing:8px;color:#1f1f1f;">{{ .Token }}</span>',
      note: "Never share this code with anyone. TravailAway will never ask you for it.",
    }),
  },
];

// ---------------------------------------------------------------------------
// 2. Emails sent by the website (through Resend)
// ---------------------------------------------------------------------------

type Person = { name?: string | null };

function hello(name?: string | null): string {
  return name && name.trim() ? `Hello ${esc(name.trim())},` : "Hello,";
}

// Welcome email, sent once an account is confirmed.
export function welcomeEmail(p: Person & { role: "traveller" | "host" }): RenderedEmail {
  const traveller = p.role === "traveller";
  return renderEmail({
    preheader: "Your TravailAway account is ready.",
    headline: "Welcome to TravailAway!",
    subheadline: "Your journey starts here.",
    paragraphs: [
      hello(p.name),
      traveller
        ? "Your account is confirmed. Explore hosts around the world, save the opportunities you love and get ready to share a new place and its people."
        : "Your account is confirmed. Tell travellers about your place and create your opportunity so people can find you.",
    ],
    button: traveller
      ? { label: "Explore Opportunities", url: `${site}/explore` }
      : { label: "Create Your Opportunity", url: `${site}/opportunities/new` },
    note: "Need help? Just reply to this email.",
  });
}

// A host has submitted a listing. Sent to the host.
export function listingSubmittedEmail(p: Person & { title: string }): RenderedEmail {
  return renderEmail({
    preheader: "We received your opportunity and will review it soon.",
    headline: "We received your listing",
    subheadline: "Thank you for sharing your place.",
    paragraphs: [
      hello(p.name),
      `Your opportunity <strong>${esc(p.title)}</strong> has been submitted. Our team reviews every listing to keep TravailAway safe and welcoming. We will email you as soon as it has been reviewed.`,
    ],
    button: { label: "View My Dashboard", url: `${site}/dashboard` },
  });
}

// The team approved a listing. Sent to the host.
export function listingApprovedEmail(p: Person & { title: string }): RenderedEmail {
  return renderEmail({
    preheader: "Your opportunity is now live on TravailAway.",
    headline: "Your listing is live!",
    subheadline: "Travellers can now find you.",
    paragraphs: [
      hello(p.name),
      `Good news! Your opportunity <strong>${esc(p.title)}</strong> has been approved and is now visible to travellers on TravailAway.`,
    ],
    button: { label: "See Your Listing", url: `${site}/explore` },
    note: "When a traveller writes to you, you will find the message in your dashboard.",
  });
}

// The team asked for changes. Sent to the host.
export function listingRejectedEmail(p: Person & { title: string; reason: string }): RenderedEmail {
  return renderEmail({
    preheader: "Your opportunity needs a few changes before it can go live.",
    headline: "A few changes needed",
    subheadline: "Almost there.",
    paragraphs: [
      hello(p.name),
      `Thank you for submitting <strong>${esc(p.title)}</strong>. Before we can publish it, we need a few changes:`,
    ],
    extraHtml: `<div style="padding:16px 20px;border-radius:12px;background-color:#ffffff;border:1px solid #f3d3b0;text-align:left;font-size:16px;line-height:24px;color:#333333;">${esc(
      p.reason
    ).replace(/\n/g, "<br>")}</div>`,
    button: { label: "Update My Listing", url: `${site}/dashboard` },
    note: "Once you have made the changes, send it again and we will take another look.",
  });
}

// Something happened on a traveller's account (for example membership). Sent to the traveller.
export function travellerNoticeEmail(p: Person & { headline: string; message: string; buttonLabel?: string; buttonUrl?: string }): RenderedEmail {
  return renderEmail({
    preheader: p.headline,
    headline: esc(p.headline),
    subheadline: "An update on your account.",
    paragraphs: [hello(p.name), esc(p.message)],
    button: p.buttonLabel && p.buttonUrl ? { label: esc(p.buttonLabel), url: p.buttonUrl } : { label: "Go To My Dashboard", url: `${site}/dashboard` },
  });
}

// Reply to someone who used the contact form. Sent to that person.
export function contactReplyEmail(p: Person & { theirMessage: string; reply: string }): RenderedEmail {
  return renderEmail({
    preheader: "A reply from the TravailAway team.",
    headline: "Thank you for contacting us",
    subheadline: "Here is our reply.",
    paragraphs: [hello(p.name), esc(p.reply).replace(/\n/g, "<br>")],
    extraHtml: `<div style="padding:14px 18px;border-radius:12px;background-color:#ffffff;border:1px solid #eadfce;text-align:left;font-size:14px;line-height:21px;color:#6b6b6b;"><strong style="color:#333333;">Your message</strong><br>${esc(
      p.theirMessage
    ).replace(/\n/g, "<br>")}</div>`,
    note: "You can reply to this email if you have more questions.",
  });
}

// Important security notices. Sent to the account owner.
export function securityNoticeEmail(p: Person & { headline: string; message: string }): RenderedEmail {
  return renderEmail({
    preheader: p.headline,
    headline: esc(p.headline),
    subheadline: "Account security.",
    paragraphs: [hello(p.name), esc(p.message)],
    button: { label: "Review My Account", url: `${site}/dashboard` },
    note: `If this wasn&rsquo;t you, please reset your password and contact us at ${esc(BRAND.supportEmail)}.`,
  });
}

// "Your email address was changed" notice, sent to the OLD address.
export function emailChangedNoticeEmail(p: Person & { newEmail: string }): RenderedEmail {
  return renderEmail({
    preheader: "The email address on your TravailAway account was changed.",
    headline: "Your email address was changed",
    subheadline: "Account security.",
    paragraphs: [
      hello(p.name),
      `The email address on your TravailAway account was changed to <strong>${esc(p.newEmail)}</strong>.`,
    ],
    note: `If you didn&rsquo;t make this change, please contact us straight away at ${esc(BRAND.supportEmail)}.`,
  });
}

// Newsletter and promotional emails.
export function newsletterEmail(p: {
  subject: string; // used by the sender; kept here so one object describes the email
  headline: string;
  intro: string;
  body: string[];
  buttonLabel: string;
  buttonUrl: string;
  unsubscribeUrl: string;
}): RenderedEmail {
  return renderEmail({
    preheader: p.intro,
    headline: esc(p.headline),
    paragraphs: [esc(p.intro), ...p.body.map((line) => esc(line))],
    button: { label: esc(p.buttonLabel), url: p.buttonUrl },
    unsubscribeUrl: p.unsubscribeUrl,
  });
}

// A traveller or host wrote a message. Sent to the person who receives it.
export function newMessageEmail(p: Person & { fromName: string; listingTitle?: string | null; excerpt: string }): RenderedEmail {
  const about = p.listingTitle ? ` about <strong>${esc(p.listingTitle)}</strong>` : "";
  return renderEmail({
    preheader: `${p.fromName} sent you a message on TravailAway.`,
    headline: "You have a new message",
    subheadline: `From ${esc(p.fromName)}`,
    paragraphs: [hello(p.name), `<strong>${esc(p.fromName)}</strong> wrote to you${about}:`],
    extraHtml: `<div style="padding:16px 20px;border-radius:12px;background-color:#ffffff;border:1px solid #f3d3b0;text-align:left;font-size:16px;line-height:24px;color:#333333;">${esc(
      p.excerpt
    ).replace(/\n/g, "<br>")}</div>`,
    button: { label: "Read And Reply", url: `${site}/messages` },
    note: "Please reply from your Messages page on TravailAway so your answer reaches them.",
  });
}

// Tells our own team that a new listing is waiting for review.
export function staffNewListingEmail(p: { title: string; hostName?: string | null }): RenderedEmail {
  return renderEmail({
    preheader: "A new opportunity is waiting for review.",
    headline: "New listing to review",
    subheadline: "Waiting for approval.",
    paragraphs: [
      `<strong>${esc(p.title)}</strong>${p.hostName ? ` by ${esc(p.hostName)}` : ""} has just been submitted and is waiting in the admin page.`,
    ],
    button: { label: "Open Admin Page", url: `${site}/admin` },
  });
}
