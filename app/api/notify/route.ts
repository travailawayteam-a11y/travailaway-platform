import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/send";
import {
  listingApprovedEmail,
  listingRejectedEmail,
  listingSubmittedEmail,
  newMessageEmail,
  staffNewListingEmail,
} from "@/lib/email/templates";
import { BRAND } from "@/lib/email/brand";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KINDS = ["message", "listing_decision", "listing_submitted"] as const;
type Kind = (typeof KINDS)[number];

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Target = {
  to?: string;
  to_name?: string | null;
  from_name?: string | null;
  title?: string | null;
  excerpt?: string | null;
  status?: string | null;
  reason?: string | null;
};

// The database decides who may email whom (see get_notification_target).
// This route only sends what the database allows.
export async function POST(request: Request) {
  let kind: Kind;
  let id: string;
  try {
    const body = (await request.json()) as { kind?: string; id?: string };
    if (!body.kind || !KINDS.includes(body.kind as Kind) || !body.id || !UUID.test(body.id)) {
      return NextResponse.json({ sent: false }, { status: 400 });
    }
    kind = body.kind as Kind;
    id = body.id;
  } catch {
    return NextResponse.json({ sent: false }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ sent: false }, { status: 401 });
  }

  const { data, error } = await supabase.rpc("get_notification_target", {
    p_kind: kind,
    p_id: id,
  });
  const target = data as Target | null;
  if (error || !target || !target.to) {
    return NextResponse.json({ sent: false });
  }

  let subject = "";
  let email;

  if (kind === "message") {
    const fromName = target.from_name || "Someone";
    subject = `New message from ${fromName} on TravailAway`;
    email = newMessageEmail({
      name: target.to_name,
      fromName,
      listingTitle: target.title,
      excerpt: (target.excerpt || "").slice(0, 300),
    });
  } else if (kind === "listing_decision") {
    const title = target.title || "your opportunity";
    if (target.status === "published") {
      subject = "Your TravailAway listing is live!";
      email = listingApprovedEmail({ name: target.to_name, title });
    } else if (target.status === "rejected") {
      subject = "A few changes are needed on your TravailAway listing";
      email = listingRejectedEmail({
        name: target.to_name,
        title,
        reason: target.reason || "Please review your listing and update it.",
      });
    } else {
      return NextResponse.json({ sent: false });
    }
  } else {
    const title = target.title || "your opportunity";
    subject = "We received your TravailAway listing";
    email = listingSubmittedEmail({ name: target.to_name, title });

    // Tell our own team there is something to review.
    const staff = await sendEmail({
      to: BRAND.supportEmail,
      subject: `New listing to review: ${title}`,
      email: staffNewListingEmail({ title, hostName: target.to_name }),
    });
    if (!staff.ok) console.error("Staff email failed:", staff.error);
  }

  const result = await sendEmail({ to: target.to, subject, email });
  if (!result.ok) {
    console.error("Email failed:", result.error);
  }
  return NextResponse.json({ sent: result.ok });
}
