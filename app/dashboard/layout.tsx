import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import AccountNav, { type AccountLink } from "@/components/account-nav";

// One shared frame for every account page: TravailAway header, side menu and footer.
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, account_type, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  const accountType =
    profile?.account_type || user.user_metadata?.account_type || "traveller";
  const isHost = accountType === "host";

  const { data: adminRow } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  let links: AccountLink[];

  if (isHost) {
    const { data: myListing } = await supabase
      .from("listings")
      .select("id")
      .eq("host_id", user.id)
      .limit(1)
      .maybeSingle();

    links = [
      { href: "/dashboard", label: "Overview", icon: "overview" },
      myListing
        ? { href: `/opportunities/${myListing.id}/edit`, label: "My opportunity", icon: "opportunity" }
        : { href: "/opportunities/new", label: "Create opportunity", icon: "create" },
      { href: "/messages", label: "Messages", icon: "messages" },
      { href: "/dashboard/profile", label: "Host profile", icon: "profile" },
      { href: "/explore", label: "Explore", icon: "explore" },
    ];
  } else {
    links = [
      { href: "/dashboard", label: "Overview", icon: "overview" },
      { href: "/dashboard/profile", label: "My profile", icon: "profile" },
      { href: "/explore", label: "Explore opportunities", icon: "explore" },
      { href: "/messages", label: "Messages", icon: "messages" },
      { href: "/travel-buddies", label: "Travel companions", icon: "companions" },
      { href: "/meetups", label: "Events", icon: "events" },
      { href: "/membership", label: "Membership", icon: "membership" },
    ];
  }

  if (adminRow) {
    links.push({ href: "/admin", label: "Team review", icon: "admin" });
  }

  const name = profile?.full_name || user.user_metadata?.full_name || user.email || "Member";

  return (
    <div className="min-h-screen bg-[#fbf6ea] text-[#1f2a26]">
      <SiteHeader />

      <div className="mx-auto max-w-7xl gap-8 px-4 py-8 md:px-8 lg:grid lg:grid-cols-[260px_1fr]">
        <AccountNav
          links={links}
          name={String(name)}
          avatarUrl={profile?.avatar_url ?? null}
          roleLabel={isHost ? "Host" : "Traveller"}
        />
        <div className="mt-6 min-w-0 lg:mt-0">{children}</div>
      </div>

      <SiteFooter />
    </div>
  );
}
