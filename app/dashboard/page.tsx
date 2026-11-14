import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ListingActions from "./listing-actions";
import ShareCard from "./share-card";

type MyListing = {
  id: string;
  title: string;
  status: string;
  country: string;
  city: string | null;
  created_at: string;
  images: string[] | null;
  rejection_reason: string | null;
  host_paused: boolean;
  published_at: string | null;
};

function statusLabel(listing: MyListing) {
  if (listing.status === "published") return "Live";
  if (listing.status === "draft") return "Pending review";
  if (listing.status === "rejected") return "Needs changes";
  if (listing.status === "paused") {
    return listing.host_paused ? "Paused by you" : "Paused by our team";
  }
  return listing.status;
}

function statusClass(status: string) {
  if (status === "published") return "bg-[#e3f1e9] text-[#0f5a3f]";
  if (status === "rejected") return "bg-red-50 text-red-700";
  if (status === "paused" || status === "draft") return "bg-amber-100 text-amber-800";
  return "bg-gray-100 text-gray-600";
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
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

  const { data: profileData, error: profileQueryError } = await supabase
    .from("profiles")
    .select("full_name, country, city, bio, account_type")
    .eq("id", user.id)
    .maybeSingle();

  // The profile is the source of truth for the account type.
  const accountType =
    profileData?.account_type ||
    user.user_metadata?.account_type ||
    "traveller";

  const isHost = accountType === "host";

  const fullName =
    profileData?.full_name || user.user_metadata?.full_name || user.email || "Traveller";
  const firstName = String(fullName).split(" ")[0];

  // Profile completion, based only on what is really saved.
  const profileChecks = [
    Boolean(profileData?.full_name?.trim()),
    Boolean(profileData?.country?.trim()),
    Boolean(profileData?.city?.trim()),
    Boolean(profileData?.bio?.trim()),
  ];
  const completion = Math.round(
    (profileChecks.filter(Boolean).length / profileChecks.length) * 100
  );
  const profileComplete = completion === 100;

  const emailVerified = Boolean(user.email_confirmed_at);

  // Number of conversations this person is part of (the database only returns their own).
  const { count: conversationCount } = await supabase
    .from("conversations")
    .select("id", { count: "exact", head: true });

  let myListings: MyListing[] = [];
  let listingsError = "";

  if (isHost) {
    const { data: listingsData, error: listingsQueryError } = await supabase
      .from("listings")
      .select(
        "id, title, status, country, city, created_at, images, rejection_reason, host_paused, published_at"
      )
      .eq("host_id", user.id)
      .order("created_at", { ascending: false });

    if (listingsQueryError) {
      listingsError = "We could not load your opportunity right now. Please refresh the page.";
    } else {
      myListings = (listingsData ?? []) as MyListing[];
    }
  }

  const myListing = myListings[0] ?? null;

  // Traveller membership (the database only returns their own).
  let membershipText = "No active membership";
  let membershipActive = false;

  if (!isHost) {
    const { data: membership } = await supabase
      .from("memberships")
      .select("plan, expires_at")
      .eq("user_id", user.id)
      .order("expires_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (membership && new Date(membership.expires_at).getTime() > Date.now()) {
      membershipActive = true;
      membershipText = `${String(membership.plan).charAt(0).toUpperCase()}${String(
        membership.plan
      ).slice(1)} plan until ${formatDate(membership.expires_at)}`;
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f3d2e] to-[#176b50] p-7 text-white shadow-sm md:p-10">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-amber-400/20 blur-2xl" />
        <p className="relative text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
          {isHost ? "Your host space" : "Your traveller space"}
        </p>
        <h1 className="relative mt-3 text-3xl font-extrabold md:text-4xl">
          Welcome, {firstName}!
        </h1>
        <p className="relative mt-3 max-w-2xl leading-7 text-emerald-50">
          {isHost
            ? "Welcome to your host dashboard. Manage your opportunity and connect with travellers from around the world."
            : "Your next meaningful travel experience starts here. Discover new places, meet welcoming hosts and explore the world."}
        </p>
        <div className="relative mt-6 flex flex-wrap gap-3">
          {isHost ? (
            myListing ? (
              <Link
                href={`/opportunities/${myListing.id}/edit`}
                className="rounded-full bg-amber-400 px-6 py-3 font-bold text-[#3b2a00] hover:bg-amber-300"
              >
                Edit my opportunity
              </Link>
            ) : (
              <Link
                href="/opportunities/new"
                className="rounded-full bg-amber-400 px-6 py-3 font-bold text-[#3b2a00] hover:bg-amber-300"
              >
                Create my opportunity
              </Link>
            )
          ) : (
            <Link
              href="/explore"
              className="rounded-full bg-amber-400 px-6 py-3 font-bold text-[#3b2a00] hover:bg-amber-300"
            >
              Explore opportunities
            </Link>
          )}
          <Link
            href="/dashboard/profile"
            className="rounded-full border border-white/60 px-6 py-3 font-bold text-white hover:bg-white/10"
          >
            {isHost ? "Edit host profile" : "Edit my profile"}
          </Link>
        </div>
      </section>

      {/* Quick facts */}
      <section className="grid gap-4 sm:grid-cols-3">
        {isHost ? (
          <>
            <StatTile
              label="Opportunity status"
              value={myListing ? statusLabel(myListing) : "Not created yet"}
            />
            <StatTile
              label="Visible to travellers"
              value={myListing?.status === "published" ? "Yes" : "No"}
            />
            <StatTile
              label="Conversations"
              value={String(conversationCount ?? 0)}
              href="/messages"
            />
          </>
        ) : (
          <>
            <StatTile
              label="Membership"
              value={membershipText}
              href="/membership"
              highlight={membershipActive}
            />
            <StatTile label="Profile completion" value={`${completion}%`} href="/dashboard/profile" />
            <StatTile
              label="Conversations"
              value={String(conversationCount ?? 0)}
              href="/messages"
            />
          </>
        )}
      </section>

      {!isHost && !membershipActive && (
        <section className="rounded-3xl border border-amber-300 bg-amber-50 p-6">
          <h2 className="text-lg font-bold text-[#0f3d2e]">Become a member to message hosts</h2>
          <p className="mt-2 text-sm leading-6 text-[#4a3a12]">
            Exploring is free. A traveller membership lets you message and apply to every host for a
            full year.
          </p>
          <Link
            href="/membership"
            className="mt-4 inline-block rounded-full bg-[#176b50] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0f3d2e]"
          >
            See membership plans
          </Link>
        </section>
      )}

      {/* Host: the one opportunity */}
      {isHost && (
        <section
          id="my-opportunities"
          className="scroll-mt-28 rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-[#0f3d2e]">Your opportunity</h2>
            {!myListing && !listingsError && (
              <Link
                href="/opportunities/new"
                className="rounded-full bg-[#176b50] px-5 py-2 text-sm font-bold text-white hover:bg-[#0f3d2e]"
              >
                Create your opportunity
              </Link>
            )}
          </div>

          {myListing && (
            <p className="mt-3 rounded-2xl bg-[#f3ecd9] p-3 text-sm leading-6 text-[#4a3a12]">
              Travailaway allows each host to have one opportunity listing. You can update your
              existing listing whenever your opportunity changes.
            </p>
          )}

          {listingsError ? (
            <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{listingsError}</p>
          ) : !myListing ? (
            <p className="mt-5 text-sm leading-6 text-gray-600">
              You have not created your opportunity yet. Tap the button above to share it with
              travellers.
            </p>
          ) : (
            <div className="mt-5 rounded-2xl border border-[#e8dfc8] p-4">
              <div className="flex gap-4">
                {myListing.images && myListing.images[0] ? (
                  <img
                    src={myListing.images[0]}
                    alt=""
                    className="h-24 w-24 shrink-0 rounded-2xl object-cover sm:h-28 sm:w-28"
                  />
                ) : (
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-xs text-gray-400 sm:h-28 sm:w-28">
                    No photo
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="font-bold text-[#1f2a26]">{myListing.title}</p>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass(
                        myListing.status
                      )}`}
                    >
                      {statusLabel(myListing)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    {[myListing.city, myListing.country].filter(Boolean).join(", ")}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Created {formatDate(myListing.created_at)}
                    {myListing.status === "published" && myListing.published_at
                      ? ` · Live since ${formatDate(myListing.published_at)}`
                      : ""}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm text-gray-700">
                <span className="font-semibold">Visible to travellers: </span>
                {myListing.status === "published"
                  ? "Yes. It appears on Explore."
                  : "No. Only you and our team can see it."}
              </p>

              {myListing.status === "draft" && (
                <p className="mt-3 rounded-2xl bg-amber-50 p-3 text-sm text-amber-900">
                  Our team is reviewing this opportunity. It will appear on Explore once it is
                  approved.
                </p>
              )}

              {myListing.status === "rejected" && (
                <p className="mt-3 rounded-2xl bg-red-50 p-3 text-sm text-red-800">
                  <span className="font-semibold">
                    This opportunity needs changes before it can go live.
                  </span>{" "}
                  {myListing.rejection_reason
                    ? `Reason: ${myListing.rejection_reason}`
                    : "Our team did not leave a reason. Please contact us if you need help."}
                </p>
              )}

              {myListing.status === "paused" && !myListing.host_paused && (
                <p className="mt-3 rounded-2xl bg-amber-50 p-3 text-sm text-amber-900">
                  Our team has paused this opportunity. Please contact us to find out more.
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Link
                  href={`/opportunities/${myListing.id}/edit`}
                  className="rounded-full bg-[#176b50] px-5 py-2 text-sm font-bold text-white hover:bg-[#0f3d2e]"
                >
                  {myListing.status === "rejected" ? "Edit and resubmit" : "Edit opportunity"}
                </Link>
                {myListing.status === "published" && (
                  <Link
                    href="/explore"
                    className="text-sm font-semibold text-[#176b50] hover:underline"
                  >
                    View on Explore →
                  </Link>
                )}
                <ListingActions
                  id={myListing.id}
                  status={myListing.status}
                  hostPaused={myListing.host_paused}
                />
              </div>
            </div>
          )}
        </section>
      )}

      {/* Profile and verification */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[#0f3d2e]">
            {isHost ? "Host profile" : "Your profile"}
          </h2>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-[#1f2a26]">Profile completion</span>
              <span className="font-bold text-[#176b50]">{completion}%</span>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-[#efe6cf]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#176b50] to-amber-400"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>
          <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-gray-500">Name</dt>
              <dd className="font-medium text-[#1f2a26]">{fullName}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Email</dt>
              <dd className="break-all font-medium text-[#1f2a26]">{user.email}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Location</dt>
              <dd className="font-medium text-[#1f2a26]">
                {[profileData?.city, profileData?.country].filter(Boolean).join(", ") ||
                  "Not added yet"}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Account type</dt>
              <dd className="font-medium capitalize text-[#1f2a26]">{accountType}</dd>
            </div>
          </dl>
          {profileQueryError && (
            <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              We could not load your profile details right now.
            </p>
          )}
          <Link
            href="/dashboard/profile"
            className="mt-5 inline-block rounded-full border border-[#176b50] px-5 py-2 text-sm font-bold text-[#176b50] hover:bg-[#176b50] hover:text-white"
          >
            {profileComplete ? "Edit profile" : "Complete your profile"}
          </Link>
        </div>

        <div className="rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[#0f3d2e]">Verification</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${
                  emailVerified ? "bg-[#176b50] text-white" : "bg-amber-100 text-amber-800"
                }`}
              >
                {emailVerified ? "✓" : "!"}
              </span>
              <span className="font-medium text-[#1f2a26]">
                {emailVerified ? "Email verified" : "Email not verified yet"}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${
                  profileComplete ? "bg-[#176b50] text-white" : "bg-amber-100 text-amber-800"
                }`}
              >
                {profileComplete ? "✓" : "!"}
              </span>
              <span className="font-medium text-[#1f2a26]">
                {profileComplete ? "Profile complete" : "Profile not complete yet"}
              </span>
            </li>
          </ul>
          <p className="mt-4 text-xs leading-5 text-gray-500">
            Badges are only shown for things that are really done. More verification steps will
            appear here as they become available.
          </p>
        </div>
      </section>

      {/* Quick links that really work */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isHost ? (
          <>
            <QuickCard
              title="Messages"
              text="Read and reply to travellers interested in your project."
              href="/messages"
            />
            <QuickCard
              title="Explore"
              text="See how other opportunities look to travellers."
              href="/explore"
            />
            <QuickCard
              title="Safety guide"
              text="Tips for welcoming travellers with confidence."
              href="/safety"
            />
          </>
        ) : (
          <>
            <QuickCard
              title="Messages"
              text="Your conversations with hosts."
              href="/messages"
            />
            <QuickCard
              title="Travel companions"
              text="Find a travel companion or share your own plans."
              href="/travel-buddies"
            />
            <QuickCard
              title="Events"
              text="Meet fellow travellers and hosts in person."
              href="/meetups"
            />
          </>
        )}
      </section>

      <ShareCard />
    </div>
  );
}

function StatTile({
  label,
  value,
  href,
  highlight,
}: {
  label: string;
  value: string;
  href?: string;
  highlight?: boolean;
}) {
  const body = (
    <>
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</p>
      <p
        className={`mt-2 text-lg font-extrabold leading-snug ${
          highlight ? "text-[#176b50]" : "text-[#0f3d2e]"
        }`}
      >
        {value}
      </p>
    </>
  );

  const classes =
    "block rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm";

  if (href) {
    return (
      <Link href={href} className={`${classes} transition hover:border-[#176b50] hover:shadow-md`}>
        {body}
      </Link>
    );
  }

  return <div className={classes}>{body}</div>;
}

function QuickCard({ title, text, href }: { title: string; text: string; href: string }) {
  return (
    <Link
      href={href}
      className="block rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm transition hover:border-[#176b50] hover:shadow-md"
    >
      <h2 className="text-lg font-bold text-[#0f3d2e]">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-gray-600">{text}</p>
      <p className="mt-4 text-sm font-bold text-[#176b50]">Open →</p>
    </Link>
  );
}
