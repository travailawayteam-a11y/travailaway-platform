import Link from "next/link";

const logo =
  "https://sbgfaplqdxejirqfqfpn.supabase.co/storage/v1/object/public/brand-assets/1000296575-removebg-preview.png";

const columns = [
  {
    title: "Explore",
    links: [
      { label: "Discover hosts", href: "/explore" },
      { label: "How it works", href: "/how-it-works" },
      { label: "Travel companions", href: "/travel-buddies" },
      { label: "Events", href: "/meetups" },
    ],
  },
  {
    title: "Join us",
    links: [
      { label: "Join as a traveller", href: "/register?type=traveller" },
      { label: "Become a host", href: "/register?type=host" },
      { label: "Log in", href: "/login" },
    ],
  },
  {
    title: "Our world",
    links: [
      { label: "Learn on the road", href: "/travel-and-learn" },
      { label: "Our community", href: "/community" },
      { label: "Our impact", href: "/giving-back" },
      { label: "Safety & trust", href: "/safety" },
    ],
  },
];

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-4 md:px-8">
        <div>
          <Link href="/">
            <img
              src={logo}
              alt="Travailaway"
              className="h-16 w-auto object-contain"
            />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6">
            Travel. Connect. Experience. A community where travel creates
            meaningful connections between people and places.
          </p>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <h3 className="font-semibold text-white">{column.title}</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-emerald-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-700 px-5 py-5 text-center text-xs text-slate-400">
        © {year} Travailaway · Molongi Investments Company SMC Limited
      </div>
    </footer>
  );
}
