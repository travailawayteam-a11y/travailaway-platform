
import {
  Globe2,
  Search,
  MapPin,
  ArrowRight,
  Heart,
  ShieldCheck,
  Users,
  Compass,
  Menu,
} from "lucide-react";

const destinations = [
  {
    name: "Europe",
    detail: "Discover culture and new experiences",
    image:
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=900",
  },
  {
    name: "Africa",
    detail: "Connect with communities and nature",
    image:
      "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=900",
  },
  {
    name: "Asia",
    detail: "Experience traditions and hospitality",
    image:
      "https://images.unsplash.com/photo-1528181304800-259b08848526?w=900",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-800">
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="#" className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-800 text-white">
              <Globe2 size={23} />
            </span>
            <span className="text-2xl font-bold tracking-tight text-emerald-900">
              travailaway
            </span>
          </a>

          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            <a href="#explore" className="hover:text-emerald-700">Explore</a>
            <a href="#how-it-works" className="hover:text-emerald-700">How it works</a>
            <a href="#hosts" className="hover:text-emerald-700">For hosts</a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <a href="#signin" className="px-4 py-2 text-sm font-semibold">Log in</a>
            <a href="#join" className="rounded-full bg-emerald-800 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-900">
              Join Travailaway
            </a>
          </div>

          <button className="rounded-lg border p-2 md:hidden" aria-label="Open menu">
            <Menu size={22} />
          </button>
        </div>
      </header>

      <section className="relative isolate overflow-hidden bg-emerald-950">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center opacity-40"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=2000')",
          }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-950 via-emerald-950/80 to-emerald-900/30" />

        <div className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-2">
          <div className="max-w-2xl text-white">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm text-emerald-50">
              <Globe2 size={16} /> A world of meaningful experiences
            </span>
            <h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Travel beyond the ordinary.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-emerald-50/90">
              Connect with welcoming hosts, discover new cultures and
              experience the world in a more meaningful way.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <a href="#explore" className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-7 py-4 font-bold text-emerald-950 hover:bg-amber-300">
                Explore opportunities <ArrowRight size={18} />
              </a>
              <a href="#hosts" className="rounded-full border border-white/60 px-7 py-4 font-semibold text-white hover:bg-white/10">
                Become a host
              </a>
            </div>
            <p className="mt-8 text-sm text-emerald-100/80">
              Travel. Connect. Experience.
            </p>
          </div>

          <div className="hidden lg:block">
            <div className="ml-auto max-w-md rounded-3xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur">
              <img
                src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1000"
                alt="Beautiful mountain landscape"
                className="h-80 w-full rounded-2xl object-cover"
              />
              <div className="flex items-center justify-between px-2 pb-2 pt-5 text-white">
                <div>
                  <p className="text-lg font-bold">A different way to travel</p>
                  <p className="mt-1 text-sm text-emerald-100">Meet people. Share experiences.</p>
                </div>
                <Globe2 size={30} className="text-amber-300" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="explore" className="mx-auto max-w-7xl px-5 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
            Find your experience
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Where would you like to go?
          </h2>
          <p className="mt-4 leading-7 text-slate-500">
            Discover places, people and opportunities waiting to be explored.
          </p>
        </div>

        <div className="mx-auto mt-9 grid max-w-4xl gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl md:grid-cols-[1fr_1fr_auto]">
          <div className="flex items-center gap-3 rounded-xl px-4 py-3">
            <MapPin className="text-emerald-700" />
            <div className="flex-1">
              <label htmlFor="destination" className="block text-xs font-bold text-slate-500">DESTINATION</label>
              <input id="destination" placeholder="Where do you want to go?" className="w-full bg-transparent text-sm outline-none" />
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl px-4 py-3">
            <Compass className="text-emerald-700" />
            <div className="flex-1">
              <label htmlFor="experience" className="block text-xs font-bold text-slate-500">EXPERIENCE</label>
              <select id="experience" className="w-full bg-transparent text-sm outline-none">
                <option>All opportunities</option>
                <option>Farms and agriculture</option>
                <option>Hotels and hostels</option>
                <option>Community projects</option>
                <option>Nature and conservation</option>
                <option>Family and cultural exchange</option>
              </select>
            </div>
          </div>
          <button className="flex items-center justify-center gap-2 rounded-xl bg-emerald-800 px-7 py-4 font-semibold text-white hover:bg-emerald-900">
            <Search size={18} /> Search
          </button>
        </div>

        <div className="mt-16 flex items-end justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">Explore the world</p>
            <h3 className="mt-2 text-2xl font-bold">Discover by destination</h3>
          </div>
          <a href="#explore" className="hidden items-center gap-2 text-sm font-semibold text-emerald-800 sm:flex">
            Explore all <ArrowRight size={16} />
          </a>
        </div>

        <div className="mt-7 grid gap-6 md:grid-cols-3">
          {destinations.map((destination) => (
            <a key={destination.name} href="#explore" className="group relative h-80 overflow-hidden rounded-2xl bg-slate-200">
              <img
                src={destination.image}
                alt={destination.name}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute bottom-0 p-7 text-white">
                <h4 className="text-2xl font-bold">{destination.name}</h4>
                <p className="mt-2 text-sm text-white/85">{destination.detail}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="bg-emerald-50 px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">Simple and meaningful</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">A journey that connects us.</h2>
            <p className="mt-4 leading-7 text-slate-600">
              Travailaway brings travellers and hosts together through cultural exchange and shared experiences.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <Search className="text-emerald-800" size={30} />
              <h3 className="mt-5 text-xl font-bold">1. Discover</h3>
              <p className="mt-3 leading-7 text-slate-500">Explore host opportunities in destinations around the world.</p>
            </div>
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <Users className="text-emerald-800" size={30} />
              <h3 className="mt-5 text-xl font-bold">2. Connect</h3>
              <p className="mt-3 leading-7 text-slate-500">Get to know hosts and agree on expectations before travelling.</p>
            </div>
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <Heart className="text-emerald-800" size={30} />
              <h3 className="mt-5 text-xl font-bold">3. Experience</h3>
              <p className="mt-3 leading-7 text-slate-500">Share skills, learn from others and create lasting memories.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="hosts" className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 md:grid-cols-2">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">For hosts</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Open your doors to the world.</h2>
          <p className="mt-5 leading-8 text-slate-600">
            Welcome travellers, exchange knowledge and share your local way of life. Whether you run a lodge, farm, hostel or community project, your story can become part of someone's journey.
          </p>
          <a href="#join" className="mt-7 inline-flex items-center gap-2 rounded-full bg-emerald-800 px-7 py-4 font-semibold text-white hover:bg-emerald-900">
            Become a host <ArrowRight size={18} />
          </a>
        </div>
        <img
          src="https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1100"
          alt="Peaceful countryside landscape"
          className="h-80 w-full rounded-3xl object-cover shadow-lg"
        />
      </section>

      <section id="join" className="bg-emerald-950 px-5 py-16 text-center text-white">
        <ShieldCheck size={36} className="mx-auto text-amber-300" />
        <h2 className="mt-5 text-3xl font-bold">Your next chapter starts here.</h2>
        <p className="mx-auto mt-4 max-w-xl leading-7 text-emerald-100">
          Become part of a global community built around travel, connection and cultural exchange.
        </p>
        <a href="#signin" className="mt-7 inline-flex items-center gap-2 rounded-full bg-amber-400 px-7 py-4 font-bold text-emerald-950 hover:bg-amber-300">
          Join the community <ArrowRight size={18} />
        </a>
      </section>

      <footer className="bg-slate-950 px-5 py-10 text-slate-300">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 sm:flex-row">
          <div>
            <div className="flex items-center gap-2 text-xl font-bold text-white">
              <Globe2 className="text-emerald-400" /> travailaway
            </div>
            <p className="mt-3 text-sm text-slate-400">Travel. Connect. Experience.</p>
          </div>
          <div className="text-sm leading-7 text-slate-400 sm:text-right">
            <p>© {new Date().getFullYear()} Travailaway.</p>
            <p>A platform by Molongi Investments Company SMC Limited.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
