import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./logout-button";

type MyListing = {
  id: string;
  title: string;
  status: string;
  country: string;
  city: string | null;
  created_at: string;
};

function statusLabel(status: string) {
  if (status === "published") return "Live";
  if (status === "draft") return "Awaiting review";
  if (status === "paused") return "Paused";
  return status;
}

function statusClass(status: string) {
  if (status === "published") return "bg-[#e8f3ed] text-[#176b50]";
  if (status === "paused" || status === "draft") return "bg-amber-50 text-amber-700";
  return "bg-gray-100 text-gray-600";
}

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

  const { data: profileData, error: profileQueryError } = await supabase
    .from("profiles")
    .select("country, bio")
    .eq("id", user.id)
    .maybeSingle();

  const profileComplete =
    Boolean(profileData?.bio?.trim()) && Boolean(profileData?.country?.trim());

  let myListings: MyListing[] = [];
  let listingsError = "";

  if (isHost) {
    const { data: listingsData, error: listingsQueryError } = await supabase
      .from("listings")
      .select("id, title, status, country, city, created_at")
      .eq("host_id", user.id)
      .order("created_at", { ascending: false });

    if (listingsQueryError) {
      listingsError = "We could not load your opportunities right now. Please refresh the page.";
    } else {
      myListings = (listingsData ?? []) as MyListing[];
    }
  }

  const hasListing = myListings.length > 0;

  const showChecklist =
    !profileQueryError &&
    !listingsError &&
    (!profileComplete || (isHost && !hasListing));

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

        {showChecklist && (
          <div className="mt-8 rounded-2xl border border-[#176b50]/20 bg-[#eaf4ef] p-6">
            <h2 className="text-xl font-bold text-[#17231f]">
              {isHost
                ? "Get your host profile ready"
                : "Get ready for your first adventure"}
            </h2>
            <p className="mt-2 text-sm text-gray-700">
              {isHost
                ? "Two quick steps and travellers can start discovering your opportunity."
                : "Complete your profile so hosts can get to know you."}
            </p>

            <ol className="mt-5 space-y-3">
              <OnboardingStep
                number={1}
                done={profileComplete}
                title={
                  isHost
                    ? "Complete your host profile"
                    : "Complete your traveller profile"
                }
                description={
                  isHost
                    ? "Tell travellers about you, your place and your local area."
                    : "Share your interests, skills and why you love to travel."
                }
                href="/dashboard/profile"
                actionLabel={profileComplete ? "Edit profile" : "Complete profile"}
              />
              {isHost ? (
                <OnboardingStep
                  number={2}
                  done={hasListing}
                  title="Create your first opportunity"
                  description="Describe the help you need and what you offer in exchange."
                  href="/opportunities/new"
                  actionLabel="Create opportunity"
                />
              ) : (
                <OnboardingStep
                  number={2}
                  done={false}
                  title="Explore opportunities"
                  description="Browse hosts and experiences around the world."
                  href="/explore"
                  actionLabel="Explore"
                />
              )}
            </ol>
          </div>
        )}

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {isHost ? (
            <>
              <DashboardCard
                title="Create an opportunity"
                description="Share your project and welcome travellers."
                href="/opportunities/new"
              />
              <DashboardCard
                title="My opportunities"
                description="Manage the opportunities you offer."
                href="#my-opportunities"
              />
              <DashboardCard
                title="Messages"
                description="Read and reply to travellers interested in your project."
                href="/messages"
              />
            </>
          ) : (
            <>
              <DashboardCard
                title="Explore opportunities"
                description="Discover hosts and experiences around the world."
                href="/explore"
              />
              <DashboardCard
                title="Travel companions"
                description="Find a travel companion or share your own travel plans."
                href="/travel-buddies"
              />
              <DashboardCard
                title="Messages"
                description="Your conversations with hosts."
                href="/messages"
              />
            </>
          )}
          <DashboardCard
            title="Your profile"
            description="Tell the community a little about yourself."
            href="/dashboard/profile"
          />
        </div>

        {isHost && (
          <div
            id="my-opportunities"
            className="mt-10 scroll-mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-[#17231f]">
                Your opportunities
              </h2>
              <Link
                href="/opportunities/new"
                className="rounded-lg bg-[#176b50] px-4 py-2 text-sm font-semibold text-white hover:bg-[#104c3a]"
              >
                + Create an opportunity
              </Link>
            </div>

            {listingsError ? (
              <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {listingsError}
              </p>
            ) : myListings.length === 0 ? (
              <p className="mt-5 text-sm leading-6 text-gray-600">
                You have not created any opportunities yet. Tap the button above
                to share your first one with travellers.
              </p>
            ) : (
              <ul className="mt-5 divide-y divide-gray-100">
                {myListings.map((listing) => (
                  <li
                    key={listing.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-4"
                  >
                    <div>
                      <p className="font-semibold text-[#17231f]">
                        {listing.title}
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        {[listing.city, listing.country]
                          .filter(Boolean)
                          .join(", ")}
                        {" · "}
                        Created{" "}
                        {new Date(listing.created_at).toLocaleDateString(
                          "en-GB",
                          { day: "numeric", month: "short", year: "numeric" }
                        )}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                        listing.status
                      )}`}
                    >
                      {statusLabel(listing.status)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

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
  href,
}: {
  title: string;
  description: string;
  href?: string;
}) {
  const content = (
    <>
      <h2 className="text-lg font-bold text-[#17231f]">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-gray-600">
        {description}
      </p>
      <p className="mt-5 text-sm font-medium text-[#176b50]">
        {href ? "Open →" : "Coming soon"}
      </p>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-[#176b50] hover:shadow-md"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {content}
    </div>
  );
}

function OnboardingStep({
  number,
  done,
  title,
  description,
  href,
  actionLabel,
}: {
  number: number;
  done: boolean;
  title: string;
  description: string;
  href: string;
  actionLabel: string;
}) {
  return (
    <li className="flex flex-wrap items-start gap-4 rounded-xl bg-white p-4 shadow-sm">
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
          done
            ? "bg-[#176b50] text-white"
            : "border border-[#176b50] text-[#176b50]"
        }`}
      >
        {done ? "✓" : number}
      </span>
      <div className="min-w-[12rem] flex-1">
        <p className="font-semibold text-[#17231f]">{title}</p>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      </div>
      <Link
        href={href}
        className={`shrink-0 rounded-lg px-3 py-2 text-sm font-semibold ${
          done
            ? "border border-gray-200 text-gray-700"
            : "bg-[#176b50] text-white hover:bg-[#104c3a]"
        }`}
      >
        {actionLabel}
      </Link>
    </li>
  );
}
