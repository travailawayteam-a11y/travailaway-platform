import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

// The page people land on after tapping the link in their confirmation email.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;

  // Behind a hosting proxy the real address is in these headers.
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";
  const base = forwardedHost ? `${forwardedProto}://${forwardedHost}` : url.origin;

  let confirmed = false;

  try {
    const supabase = await createClient();

    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      confirmed = !error;
    } else if (tokenHash && type) {
      const { error } = await supabase.auth.verifyOtp({
        type,
        token_hash: tokenHash,
      });
      confirmed = !error;
    }
  } catch (err) {
    console.error("Email confirmation failed:", err);
  }

  return NextResponse.redirect(
    `${base}${confirmed ? "/dashboard" : "/login?confirm=failed"}`
  );
}
