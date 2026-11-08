"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const logo =
  "https://sbgfaplqdxejirqfqfpn.supabase.co/storage/v1/object/public/brand-assets/1000296575-removebg-preview.png";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState<"traveller" | "host">("traveller");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registeredType, setRegisteredType] = useState<"traveller" | "host" | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

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
          "Registration submitted! Check your email for a confirmation link if email confirmation is enabled."
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
      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          <Link href="/" className="shrink-0">
            <img
              src={logo}
              alt="Travailaway"
              className="h-16 w-auto object-contain md:h-20"
            />
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-semibold lg:flex">
            <Link href="/" className="hover:text-emerald-700">Home</Link>
            <Link href="/explore" className="hover:text-emerald-700">Explore</Link>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link href="/login" className="px-4 py-2 text-sm font-semibold">
              Log in
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg p-2 lg:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={27} /> : <Menu size={27} />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t bg-white px-6 py-5 lg:hidden">
            <nav className="flex flex-col gap-5 font-semibold">
              <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
              <Link href="/explore" onClick={() => setMenuOpen(false)}>
                Explore opportunities
              </Link>
              <Link href="/login" onClick={() => setMenuOpen(false)}>Log in</Link>
            </nav>
          </div>
        )}
      </header>

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
                  <li>Confirm your email if you receive a confirmation link.</li>
                  <li>Log in to your account.</li>
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
    </main>
  );
}
