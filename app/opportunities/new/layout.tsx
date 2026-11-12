import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

// One host account = one opportunity listing.
// If this host already has a listing, we show an explanation instead of the form.
export default async function NewOpportunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: existing } = await supabase
      .from("listings")
      .select("id")
      .eq("host_id", user.id)
      .limit(1)
      .maybeSingle();

    if (existing) {
      return (
        <main className="min-h-screen bg-gray-50 px-4 py-10">
          <div className="mx-auto max-w-xl rounded-2xl border border-emerald-200 bg-white p-6 text-center shadow-sm sm:p-10">
            <h1 className="text-2xl font-bold text-gray-900">
              You already have an opportunity
            </h1>
            <p className="mt-3 leading-7 text-gray-600">
              Travailaway allows each host to have one opportunity listing. You
              can update your existing listing whenever your opportunity
              changes.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href={`/opportunities/${existing.id}/edit`}
                className="rounded-xl bg-emerald-700 px-6 py-3 font-bold text-white hover:bg-emerald-800"
              >
                Edit my opportunity
              </Link>
              <Link
                href="/dashboard"
                className="rounded-xl border border-emerald-700 px-6 py-3 font-bold text-emerald-700 hover:bg-emerald-50"
              >
                Back to dashboard
              </Link>
            </div>
          </div>
        </main>
      );
    }
  }

  return <>{children}</>;
}
