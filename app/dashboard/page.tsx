
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./logout-button";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const fullName =
    user.user_metadata?.full_name ||
    user.email ||
    "Traveller";

  const accountType =
    user.user_metadata?.account_type || "traveller";

  const isHost = accountType === "host";

  return (
    <main className="min-h-screen bg-[#f7faf8]">
      <header className="border-b border-gray-200 bg-white px-5 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-[#176b50]"
          >
            travailaway
          </Link>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-[#e8f3ed] px-4 py-2 text-sm font-medium capitalize text-[#176b50]">
              {accountType} account
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-12">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#176b50]">
          Your personal space
        </p>

        <h1 className="mt-3 text-3xl font-bold text-[#17231f] sm:text-4xl">
          Welcome, {fullName}!
        </h1>

        <p className="mt-3 max-w-2xl text-gray-600">
          {isHost
            ? "Welcome to your host dashboard. Get ready to connect with travellers from around the world."
            : "Your next meaningful travel experience starts here. Discover new places, meet welcoming hosts and explore the world."}
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {isHost ? (
            <>
              <DashboardCard
                title="Create an opportunity"
                description="Share your project and welcome travellers."
              />
              <DashboardCard
                title="My opportunities"
                description="Manage the opportunities you offer."
              />
              <DashboardCard
                title="Traveller applications"
                description="Connect with people interested in your project."
              />
            </>
          ) : (
            <>
              <DashboardCard
                title="Explore opportunities"
                description="Discover hosts and experiences around the world."
              />
              <DashboardCard
                title="Saved opportunities"
                description="Keep track of places you would love to visit."
              />
              <DashboardCard
                title="My applications"
                description="Follow your applications to host opportunities."
              />
            </>
          )}
        </div>

        <div className="mt-10 rounded-2xl bg-[#176b50] p-8 text-white">
          <h2 className="text-2xl font-bold">
            Travel. Connect. Experience.
          </h2>
          <p className="mt-2 max-w-xl text-white/85">
            Travailaway is building a global community where travel creates
            meaningful connections.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-lg bg-white px-5 py-3 font-semibold text-[#176b50]"
          >
            Back to homepage
          </Link>
        </div>
      </section>
    </main>
  );
}

function DashboardCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-[#17231f]">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-gray-600">
        {description}
      </p>
      <p className="mt-5 text-sm font-medium text-[#176b50]">
        Coming soon
      </p>
    </div>
  );
}
