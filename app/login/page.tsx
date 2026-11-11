"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import PageBanner from "@/components/page-banner";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("confirm") === "failed") {
      setError(
        "We could not confirm your email from that link. It may have expired. Enter your email below and we will send a new one."
      );
      setNeedsConfirmation(true);
    }
  }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    setNeedsConfirmation(false);
    setLoading(true);

    try {
      const supabase = createClient();

      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) {
        if (/not confirmed/i.test(loginError.message)) {
          setError(
            "Your email address has not been confirmed yet. Open the confirmation email we sent you, or get a new one below."
          );
          setNeedsConfirmation(true);
        } else if (/invalid login/i.test(loginError.message)) {
          setError("That email and password do not match. Please try again.");
        } else {
          setError(loginError.message);
        }
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function resendConfirmation() {
    setError("");
    setNotice("");

    if (!email.trim()) {
      setError("Please type your email address above first.");
      return;
    }

    setResending(true);
    try {
      const supabase = createClient();
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (resendError) {
        setError(resendError.message);
      } else {
        setNotice(
          "We have sent you a new confirmation email. Tap the link in it, and check your spam or junk folder if you cannot see it."
        );
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setResending(false);
  }

  return (
    <main className="min-h-screen bg-[#f7faf8]">
      <SiteHeader />

      <PageBanner
        image="https://images.unsplash.com/photo-1622352496174-9e1d969b1945?auto=format&fit=crop&w=1600&q=70"
        message="Welcome back."
        subtitle="Log in to continue your Travailaway journey."
      />

      <div className="px-4 py-10">
        <div className="mx-auto max-w-md">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <h1 className="text-3xl font-bold text-[#17231f]">Log in</h1>

            <p className="mt-2 text-sm text-gray-600">
              Enter your email and password to continue.
            </p>

            <form onSubmit={handleLogin} className="mt-7 space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#176b50] focus:ring-2 focus:ring-[#176b50]/20"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#176b50] focus:ring-2 focus:ring-[#176b50]/20"
                />
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
                >
                  {error}
                </p>
              )}

              {notice && (
                <p
                  role="status"
                  className="rounded-lg bg-green-50 p-3 text-sm text-green-800"
                >
                  {notice}
                </p>
              )}

              {needsConfirmation && (
                <button
                  type="button"
                  onClick={resendConfirmation}
                  disabled={resending}
                  className="w-full rounded-lg border border-[#176b50] px-5 py-3 font-semibold text-[#176b50] hover:bg-[#eaf4ef] disabled:opacity-60"
                >
                  {resending ? "Sending..." : "Send me a new confirmation email"}
                </button>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#176b50] px-5 py-3 font-semibold text-white transition hover:bg-[#104c3a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Log in"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              New to Travailaway?{" "}
              <Link
                href="/register"
                className="font-semibold text-[#176b50] hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-gray-500">
            Travel. Connect. Experience.
          </p>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
