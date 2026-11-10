"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import PageBanner from "@/components/page-banner";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState<"traveller" | "host">("traveller");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registeredType, setRegisteredType] = useState<"traveller" | "host" | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type");

    if (type === "host" || type === "traveller") {
      setAccountType(type);
    }
  }, []);

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    setRegisteredType(null);

    if (password.length < 8) {
      setError("Your password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: fullName.trim(),
            account_type: accountType,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
      } else {
        setMessage(
          "Your account has been created! We have sent a confirmation link to your email. Tap it to confirm your address, and check your spam or junk folder if you cannot see it."
        );
        setRegisteredType(accountType);
        setFullName("");
        setEmail("");
        setPassword("");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7faf8]">
      <SiteHeader />

      {accountType === "host" ? (
        <PageBanner
          image="https://images.unsplash.com/photo-1758599668294-8d13c0942601?auto=format&fit=crop&w=1600&q=70"
          message="Open your door to the world."
          subtitle="Share your place and welcome travellers."
        />
      ) : (
        <PageBanner
          image="https://images.unsplash.com/photo-1758599667717-27c61bcdd14b?auto=format&fit=crop&w=1600&q=70"
          message="Your next adventure starts here."
          subtitle="Join a community that travels to connect."
        />
      )}

      <div className="px-4 py-10">
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-3xl font-bold text-[#17231f]">
            {accountType === "host" ? "Join as a host" : "Join as a traveller"}
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            {accountType === "host"
              ? "Create your host account to share your place or project and welcome travellers from around the world."
              : "Create your traveller account to discover opportunities and connect with hosts around the world."}
          </p>

          <form onSubmit={handleRegister} className="mt-7 space-y-5">
            <div>
              <label
                htmlFor="fullName"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Full name
              </label>
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                required
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Enter your full name"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#176b50] focus:ring-2 focus:ring-[#176b50]/20"
              />
            </div>

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
                autoComplete="new-password"
                minLength={8}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 8 characters"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#176b50] focus:ring-2 focus:ring-[#176b50]/20"
              />
            </div>

            <div>
              <p className="mb-3 text-sm font-medium text-gray-700">
                I want to join as a:
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAccountType("traveller")}
                  aria-pressed={accountType === "traveller"}
                  className={`rounded-lg border p-4 text-left ${
                    accountType === "traveller"
                      ? "border-[#176b50] bg-[#eaf4ef] text-[#104c3a]"
                      : "border-gray-200 text-gray-700"
                  }`}
                >
                  <span className="block font-semibold">Traveller</span>
                  <span className="mt-1 block text-xs">
                    Explore opportunities
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setAccountType("host")}
                  aria-pressed={accountType === "host"}
                  className={`rounded-lg border p-4 text-left ${
                    accountType === "host"
                      ? "border-[#176b50] bg-[#eaf4ef] text-[#104c3a]"
                      : "border-gray-200 text-gray-700"
                  }`}
                >
                  <span className="block font-semibold">Host</span>
                  <span className="mt-1 block text-xs">
                    Welcome travellers
                  </span>
                </button>
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            {message && (
              <p
                role="status"
                className="rounded-lg bg-green-50 p-3 text-sm text-green-800"
              >
                {message}
              </p>
            )}

            {registeredType && (
              <div className="rounded-lg border border-[#176b50]/20 bg-[#eaf4ef] p-4 text-sm text-[#104c3a]">
                <p className="font-semibold">What happens next</p>
                <ol className="mt-2 list-decimal space-y-1 pl-5">
                  <li>Open the email from us and tap the confirmation link.</li>
                  <li>You will be taken straight to your account.</li>
                  {registeredType === "host" ? (
                    <li>Open your dashboard and create your first opportunity.</li>
                  ) : (
                    <>
                      <li>Complete your profile from your dashboard.</li>
                      <li>Explore opportunities and find a host.</li>
                    </>
                  )}
                </ol>
                <div className="mt-3 flex flex-wrap gap-4 font-semibold">
                  <Link href="/login" className="underline">
                    Log in
                  </Link>
                  {registeredType === "traveller" && (
                    <Link href="/explore" className="underline">
                      Explore opportunities
                    </Link>
                  )}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#176b50] px-5 py-3 font-semibold text-white transition hover:bg-[#104c3a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create my account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            By joining, you agree to use Travailaway respectfully and honestly.
          </p>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#176b50] hover:underline"
            >
              Log in
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
