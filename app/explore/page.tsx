"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Clock, Compass, MapPin, Menu, Search, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import ContactHost from "@/components/contact-host";

type Listing = {
  id: string;
  host_id: string | null;
  title: string;
  description: string;
  category: string;
  country: string;
  city: string | null;
  accommodation: string | null;
  meals: string | null;
  hours_per_week: number | null;
  min_stay_weeks: number | null;
  max_stay_weeks: number | null;
  skills: string[] | null;
  benefits: string[] | null;
  images: string[] | null;
  created_at: string;
};

const logo =
  "https://sbgfaplqdxejirqfqfpn.supabase.co/storage/v1/object/public/brand-assets/1000296575-removebg-preview.png";

// Same country lists as the "Create an opportunity" form, grouped by continent.
const CONTINENT_COUNTRIES: Record<string, string[]> = {
  Africa: [
    "Uganda", "Kenya", "Tanzania", "Rwanda", "Burundi", "Ethiopia", "South Sudan",
    "Ghana", "Nigeria", "Senegal", "The Gambia", "Sierra Leone", "Liberia", "Ivory Coast", "Benin", "Togo",
    "Egypt", "Morocco", "Tunisia", "Algeria", "Libya",
    "South Africa", "Namibia", "Botswana", "Zimbabwe", "Zambia", "Mozambique", "Malawi", "Lesotho", "Eswatini",
    "Cameroon", "DR Congo", "Republic of the Congo", "Gabon", "Chad", "Central African Republic",
  ],
  Europe: [
    "France", "Germany", "Netherlands", "Belgium", "Austria", "Switzerland", "Luxembourg",
    "United Kingdom", "Ireland", "Sweden", "Norway", "Denmark", "Finland", "Iceland",
    "Spain", "Italy", "Portugal", "Greece", "Croatia", "Malta", "Cyprus",
    "Poland", "Romania", "Hungary", "Czech Republic", "Slovakia", "Ukraine", "Bulgaria",
  ],
  Asia: [
    "China", "Japan", "South Korea", "Mongolia", "Taiwan",
    "India", "Pakistan", "Bangladesh", "Nepal", "Sri Lanka", "Maldives", "Bhutan",
    "Thailand", "Vietnam", "Indonesia", "Malaysia", "Philippines", "Cambodia", "Laos", "Singapore", "Myanmar",
    "United Arab Emirates", "Saudi Arabia", "Qatar", "Jordan", "Israel", "Turkey", "Oman", "Lebanon",
    "Kazakhstan", "Uzbekistan", "Kyrgyzstan", "Tajikistan", "Turkmenistan",
  ],
  "North America": [
    "United States", "Canada",
    "Mexico", "Guatemala", "Belize", "Costa Rica", "Panama", "Honduras", "El Salvador", "Nicaragua",
    "Jamaica", "Bahamas", "Barbados", "Trinidad and Tobago", "Dominican Republic", "Cuba",
  ],
  "South America": [
    "Brazil", "Argentina", "Chile", "Colombia", "Peru", "Ecuador",
    "Uruguay", "Paraguay", "Bolivia", "Venezuela", "Guyana", "Suriname",
  ],
  Oceania: [
    "Australia", "New Zealand", "Fiji", "Papua New Guinea", "Samoa", "Vanuatu", "Tonga",
  ],
};

const CONTINENTS = Object.keys(CONTINENT_COUNTRIES);

// The categories hosts can actually choose in the form.
const CATEGORIES = [
  { value: "Accommodation", label: "Accommodation" },
  { value: "Farming", label: "Farming" },
  { value: "Hospitality", label: "Hospitality" },
  { value: "Teaching", label: "Teaching" },
  { value: "Community", label: "Community projects" },
  { value: "Environment", label: "Environment" },
  { value: "Construction", label: "Construction" },
  { value: "Other", label: "Other" },
];

// Translates the homepage category tiles into the categories stored in the database.
// PLEASE REVIEW: several tiles have no exact match and fall back to "Other".
const HOMEPAGE_CATEGORY_MAP: Record<string, string> = {
  "Hostels & Guesthouses": "Accommodation",
  "Farms & Gardening": "Farming",
  "Animal Care": "Other",
  "Teaching & Education": "Teaching",
  "Arts & Creativity": "Other",
  "Sailing & Boats": "Other",
  "Community Projects": "Community",
  "Language Exchange": "Teaching",
  "Nature & Outdoors": "Environment",
  Hospitality: "Hospitality",
  Photography: "Other",
  "Music & Culture": "Other",
  "Learning & Skills": "Teaching",
  "Other Experiences": "Other",
};

function categoryLabel(value: string) {
  return CATEGORIES.find((item) => item.value === value)?.label ?? value;
}

function plural(count: number, word: string) {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

function formatStay(min: number | null, max: number | null) {
  if (min && max) {
    return min === max ? plural(min, "week") : `${min}–${max} weeks`;
  }
  if (min) return `From ${plural(min, "week")}`;
  if (max) return `Up to ${plural(max, "week")}`;
  return "";
}

function Chips({ items }: { items: string[] }) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export default function ExplorePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [continent, setContinent] = useState("");
  const [country, setCountry] = useState("");
  const [category, setCategory] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  // Read filters sent from the homepage, e.g. /explore?destination=Africa&category=Farms%20%26%20Gardening
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const destination = (params.get("destination") ?? "").trim();
    const categoryParam = (params.get("category") ?? "").trim();

    if (destination) {
      const matchedContinent = CONTINENTS.find(
        (item) => item.toLowerCase() === destination.toLowerCase()
      );
      if (matchedContinent) {
        setContinent(matchedContinent);
      } else {
        setSearch(destination);
      }
    }

    if (categoryParam) {
      const direct = CATEGORIES.find(
        (item) => item.value.toLowerCase() === categoryParam.toLowerCase()
      );
      const matchedCategory = direct?.value ?? HOMEPAGE_CATEGORY_MAP[categoryParam];
      if (matchedCategory) setCategory(matchedCategory);
    }
  }, []);

  // Load published opportunities (public: no login needed).
  useEffect(() => {
    let active = true;

    async function loadListings() {
      try {
        const supabase = createClient();

        const { data, error: queryError } = await supabase
          .from("listings")
          .select(
            "id, host_id, title, description, category, country, city, accommodation, meals, hours_per_week, min_stay_weeks, max_stay_weeks, skills, benefits, images, created_at"
          )
          .eq("status", "published")
          .order("created_at", { ascending: false })
          .limit(200);

        if (!active) return;

        if (queryError) {
          console.error("Explore listings error:", queryError);
          setError("We could not load opportunities right now. Please try again.");
        } else {
          setListings((data ?? []) as Listing[]);
        }
      } catch (err) {
        console.error("Explore listings error:", err);
        if (active) {
          setError("We could not load opportunities right now. Please try again.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadListings();

    return () => {
      active = false;
    };
  }, []);

  const countryOptions = useMemo(() => {
    const allowed = continent ? CONTINENT_COUNTRIES[continent] ?? [] : null;
    const names = listings
      .filter((item) => item.country && (!allowed || allowed.includes(item.country)))
      .map((item) => item.country);
    return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b));
  }, [listings, continent]);

  const filteredListings = useMemo(() => {
    const term = search.trim().toLowerCase();
    const allowedCountries = continent ? CONTINENT_COUNTRIES[continent] ?? [] : null;

    return listings.filter((item) => {
      if (category && item.category !== category) return false;
      if (country && item.country !== country) return false;
      if (allowedCountries && !allowedCountries.includes(item.country)) return false;
      if (!term) return true;

      return [
        item.title,
        item.description,
        item.country,
        item.city ?? "",
        categoryLabel(item.category),
        ...(item.skills ?? []),
      ].some((value) => value.toLowerCase().includes(term));
    });
  }, [listings, search, continent, country, category]);

  const hasFilters = Boolean(search.trim() || continent || country || category);

  function clearFilters() {
    setSearch("");
    setContinent("");
    setCountry("");
    setCategory("");
  }

  return (
    <main className="min-h-screen bg-white text-slate-800">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          <Link href="/" className="shrink-0">
            <img
              src={logo}
              alt="Travailaway"
              className="h-16 w-auto object-contain md:h-20 lg:h-24"
            />
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-semibold lg:flex">
            <Link href="/" className="hover:text-emerald-700">Home</Link>
            <Link href="/explore" className="text-emerald-700">Explore</Link>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link href="/login" className="px-4 py-2 text-sm font-semibold">
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-emerald-700 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-800"
            >
              Join Travailaway
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
              <Link href="/explore" onClick={() => setMenuOpen(false)} className="text-emerald-700">
                Explore opportunities
              </Link>
              <Link href="/login" onClick={() => setMenuOpen(false)}>Log in</Link>
              <Link href="/register" onClick={() => setMenuOpen(false)} className="text-emerald-700">
                Join Travailaway
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="bg-emerald-950 px-5 pb-24 pt-14 text-center text-white md:pb-28 md:pt-20">
        <span className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">
          Discover · Connect · Experience
        </span>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-extrabold leading-tight md:text-5xl">
          Explore opportunities
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-emerald-100/80">
          Find hosts and experiences around the world, and start a meaningful
          cultural exchange.
        </p>
      </section>

      {/* FILTERS */}
      <section className="relative z-20 mx-auto -mt-12 max-w-6xl px-4">
        <div className="rounded-2xl bg-white p-5 shadow-xl md:p-7">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <label className="flex items-center gap-3 rounded-xl border px-4 py-3">
              <Search className="shrink-0 text-emerald-700" />
              <span className="w-full">
                <span className="block text-xs font-bold text-gray-500">SEARCH</span>
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Country, city or keyword"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </span>
            </label>

            <label className="flex items-center gap-3 rounded-xl border px-4 py-3">
              <MapPin className="shrink-0 text-emerald-700" />
              <span className="w-full">
                <span className="block text-xs font-bold text-gray-500">REGION</span>
                <select
                  value={continent}
                  onChange={(event) => {
                    setContinent(event.target.value);
                    setCountry("");
                  }}
                  className="w-full bg-transparent text-sm outline-none"
                >
                  <option value="">Anywhere in the world</option>
                  {CONTINENTS.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </span>
            </label>

            <label className="flex items-center gap-3 rounded-xl border px-4 py-3">
              <MapPin className="shrink-0 text-emerald-700" />
              <span className="w-full">
                <span className="block text-xs font-bold text-gray-500">COUNTRY</span>
                <select
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                  className="w-full bg-transparent text-sm outline-none"
                >
                  <option value="">All countries</option>
                  {countryOptions.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </span>
            </label>

            <label className="flex items-center gap-3 rounded-xl border px-4 py-3">
              <Compass className="shrink-0 text-emerald-700" />
              <span className="w-full">
                <span className="block text-xs font-bold text-gray-500">EXPERIENCE</span>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="w-full bg-transparent text-sm outline-none"
                >
                  <option value="">All experiences</option>
                  {CATEGORIES.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              </span>
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
            <p className="text-gray-500">
              {loading || error
                ? " "
                : `${filteredListings.length} ${
                    filteredListings.length === 1 ? "opportunity" : "opportunities"
                  } found`}
            </p>
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="font-bold text-emerald-700 hover:text-emerald-800"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        {loading ? (
          <div className="rounded-2xl bg-gray-50 p-12 text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" />
            <p className="text-gray-600">Finding opportunities for you...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-gray-50 p-12 text-center">
            <h2 className="text-xl font-extrabold text-slate-900">Something went wrong</h2>
            <p className="mt-3 text-red-600">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-full bg-emerald-700 px-7 py-3 font-bold text-white hover:bg-emerald-800"
            >
              Try again
            </button>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/50 px-6 py-16 text-center">
            <Compass className="mx-auto text-emerald-700" size={42} />
            <h2 className="mt-5 text-xl font-extrabold text-slate-900">
              Your next adventure starts here
            </h2>
            <p className="mx-auto mt-3 max-w-lg leading-7 text-gray-600">
              {listings.length === 0
                ? "There are no published opportunities yet. Our first hosts are getting ready!"
                : "No opportunities match your filters. Try a different region, country or keyword."}
            </p>
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 rounded-full bg-emerald-700 px-7 py-3 font-bold text-white hover:bg-emerald-800"
              >
                Show all opportunities
              </button>
            )}
            <p className="mt-6 text-sm text-gray-600">
              Are you a host?{" "}
              <Link
                href="/register?type=host"
                className="font-bold text-emerald-700 underline"
              >
                Share an opportunity
              </Link>
            </p>
          </div>
        ) : (
          <div className="grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredListings.map((listing) => {
              const cover = listing.images?.find(Boolean);
              const stay = formatStay(listing.min_stay_weeks, listing.max_stay_weeks);
              const hours =
                listing.hours_per_week !== null
                  ? `${listing.hours_per_week} hrs/week`
                  : "";
              const location = [listing.city, listing.country].filter(Boolean).join(", ");
              const isOpen = openId === listing.id;
              const skills = (listing.skills ?? []).filter(Boolean);
              const benefits = (listing.benefits ?? []).filter(Boolean);

              return (
                <article
                  key={listing.id}
                  className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md"
                >
                  <div className="h-52 bg-emerald-50">
                    {cover ? (
                      <img
                        src={cover}
                        alt={listing.title}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Compass className="text-emerald-700/40" size={52} />
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <span className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-700">
                      {categoryLabel(listing.category)}
                    </span>

                    <h2 className="mt-2 text-xl font-extrabold text-slate-900">
                      {listing.title}
                    </h2>

                    {location && (
                      <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                        <MapPin size={16} className="shrink-0 text-emerald-700" />
                        {location}
                      </p>
                    )}

                    {(hours || stay) && (
                      <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                        <Clock size={16} className="shrink-0 text-emerald-700" />
                        {[hours, stay].filter(Boolean).join(" · ")}
                      </p>
                    )}

                    <p
                      className={`mt-3 text-sm leading-6 text-gray-600 ${
                        isOpen ? "whitespace-pre-line" : "line-clamp-3"
                      }`}
                    >
                      {listing.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                      {listing.accommodation && (
                        <span className="rounded-full bg-gray-100 px-3 py-1.5 text-gray-700">
                          {listing.accommodation}
                        </span>
                      )}
                      {listing.meals && (
                        <span className="rounded-full bg-gray-100 px-3 py-1.5 text-gray-700">
                          {listing.meals}
                        </span>
                      )}
                    </div>

                    {isOpen && (
                      <div className="mt-5 space-y-4 border-t pt-5">
                        {skills.length > 0 && (
                          <div>
                            <h3 className="text-sm font-bold text-slate-900">Skills needed</h3>
                            <Chips items={skills} />
                          </div>
                        )}

                        {benefits.length > 0 && (
                          <div>
                            <h3 className="text-sm font-bold text-slate-900">Benefits</h3>
                            <Chips items={benefits} />
                          </div>
                        )}

                        <ContactHost
                          listingId={listing.id}
                          hostId={listing.host_id}
                          title={listing.title}
                        />
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen ? null : listing.id)}
                      aria-expanded={isOpen}
                      className="mt-5 w-full rounded-full bg-emerald-700 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-800"
                    >
                      {isOpen ? "Show less" : "View details"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 px-5 pb-8 pt-12 text-gray-300">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row md:items-center">
          <Link href="/">
            <img src={logo} alt="Travailaway" className="h-16 w-auto object-contain" />
          </Link>
          <div className="flex flex-wrap gap-6 text-sm">
            <Link href="/" className="hover:text-emerald-300">Home</Link>
            <Link href="/explore" className="hover:text-emerald-300">Explore</Link>
            <Link href="/register?type=host" className="hover:text-emerald-300">Become a host</Link>
            <Link href="/login" className="hover:text-emerald-300">Log in</Link>
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-7xl border-t border-white/10 pt-6 text-xs text-gray-500">
          © {new Date().getFullYear()} Travailaway. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
