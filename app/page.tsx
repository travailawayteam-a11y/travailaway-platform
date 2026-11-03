"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  Compass,
  Globe2,
  Heart,
  MapPin,
  Menu,
  Search,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

const logo =
  "https://sbgfaplqdxejirqfqfpn.supabase.co/storage/v1/object/public/brand-assets/1000296575-removebg-preview.png";

const slides = [
  "https://sbgfaplqdxejirqfqfpn.supabase.co/storage/v1/object/public/homepage-images/omar-ramadan-y_OLIOot4VU-unsplash.jpg",
  "https://sbgfaplqdxejirqfqfpn.supabase.co/storage/v1/object/public/homepage-images/elya-foll-u9ZSmQNuhuw-unsplash.jpg",
  "https://sbgfaplqdxejirqfqfpn.supabase.co/storage/v1/object/public/homepage-images/duy-pham-Cecb0_8Hx-o-unsplash%20(1).jpg",
  "https://sbgfaplqdxejirqfqfpn.supabase.co/storage/v1/object/public/homepage-images/chermiti-mohamed-CD2Y9kMmCIQ-unsplash.jpg",
  "https://sbgfaplqdxejirqfqfpn.supabase.co/storage/v1/object/public/homepage-images/alexander-schimmeck-MraFXV3v7Ts-unsplash.jpg",
];

const destinations = [
  {
    name: "Europe",
    detail: "Discover culture and new experiences",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=900",
  },
  {
    name: "Africa",
    detail: "Connect with communities and nature",
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=900",
  },
  {
    name: "Asia",
    detail: "Experience traditions and hospitality",
    image: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=900",
  },
];

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-white text-slate-800">
      <header className="absolute z-30 flex w-full items-center justify-between px-5 py-5 text-white md:px-12">
        <a href="/" className="flex items-center gap-2">
          <img src={logo} alt="Travailaway" className="h-12 w-auto" />
        </a>

        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <a href="#explore" className="hover:text-yellow-300">Explore</a>
          <a href="#how-it-works" className="hover:text-yellow-300">How it works</a>
          <a href="/register" className="hover:text-yellow-300">Become a host</a>
          <a href="/login" className="hover:text-yellow-300">Log in</a>
          <a href="/register" className="rounded-full bg-yellow-400 px-5 py-3 text-slate-900 hover:bg-yellow-300">
            Join Travailaway
          </a>
        </nav>

        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={27} /> : <Menu size={27} />}
        </button>
      </header>

      {menuOpen && (
        <nav className="absolute right-4 top-20 z-40 flex w-56 flex-col gap-5 rounded-xl bg-white p-6 text-slate-800 shadow-xl md:hidden">
          <a href="#explore" onClick={() => setMenuOpen(false)}>Explore</a>
          <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a>
          <a href="/register">Become a host</a>
          <a href="/login">Log in</a>
          <a href="/register" className="font-semibold text-emerald-700">Join Travailaway</a>
        </nav>
      )}

      <section className="relative flex min-h-[680px] items-center overflow-hidden bg-slate-900 md:min-h-[760px]">
        {slides.map((slide, index) => (
          <img
            key={slide}
            src={slide}
            alt="Travelling and cultural experiences"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              activeSlide === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-12 pt-32 text-white md:px-12">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-yellow-300">
            Travel. Connect. Experience.
          </p>

          <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl lg:text-7xl">
            Discover Places. Share Experiences. Belong Anywhere.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/90 md:text-xl">
            Connect with welcoming hosts, discover new cultures and create
            unforgettable experiences wherever your journey takes you.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <a href="#explore" className="rounded-full bg-yellow-400 px-7 py-4 font-semibold text-slate-900 hover:bg-yellow-300">
              Explore opportunities <ArrowRight className="ml-2 inline" size={18} />
            </a>
            <a href="/register" className="rounded-full border border-white/80 px-7 py-4 font-semibold text-white hover:bg-white/15">
              Become a host
            </a>
          </div>

          <div className="mt-12 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                aria-label={`Show slide ${index + 1}`}
                className={`h-2 rounded-full transition-all ${
                  activeSlide === index ? "w-9 bg-yellow-400" : "w-2 bg-white/70"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-20 mx-auto -mt-8 max-w-6xl px-5">
        <div className="grid gap-3 rounded-2xl bg-white p-4 shadow-xl md:grid-cols-[1fr_1fr_auto] md:p-6">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
            <MapPin className="text-emerald-700" />
            <div>
              <p className="text-xs text-slate-500">Where do you want to go?</p>
              <p className="font-medium">Explore destinations</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
            <Compass className="text-emerald-700" />
            <div>
              <p className="text-xs text-slate-500">What are you looking for?</p>
              <p className="font-medium">Experiences and opportunities</p>
            </div>
          </div>
          <button
            onClick={() => document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" })}
            className="rounded-xl bg-emerald-800 px-8 py-4 font-semibold text-white hover:bg-emerald-700"
          >
            <Search className="mr-2 inline" size={18} /> Explore
          </button>
        </div>
      </section>
            <section id="explore" className="mx-auto max-w-7xl px-6 py-24 md:px-12">
        <div className="mb-10 text-center">
          <p className="font-semibold uppercase tracking-widest text-emerald-700">
            The world is waiting
          </p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            Explore places and experiences
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Find opportunities to connect with local people, learn new skills
            and experience everyday life in different cultures.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {destinations.map((destination) => (
            <a
              key={destination.name}
              href="/register"
              className="group relative h-80 overflow-hidden rounded-2xl"
            >
              <img
                src={destination.image}
                alt={destination.name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
              <div className="absolute bottom-7 left-7 text-white">
                <h3 className="text-3xl font-bold">{destination.name}</h3>
                <p className="mt-2 text-white/90">{destination.detail}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="bg-slate-50 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="font-semibold uppercase tracking-widest text-emerald-700">
              Simple beginnings
            </p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              How Travailaway works
            </h2>
          </div>

          <div className="mt-14 grid gap-10 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                <Search size={28} />
              </div>
              <h3 className="mt-5 text-xl font-bold">1. Discover</h3>
              <p className="mt-3 text-slate-600">
                Explore welcoming hosts and opportunities in destinations
                around the world.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                <Users size={28} />
              </div>
              <h3 className="mt-5 text-xl font-bold">2. Connect</h3>
              <p className="mt-3 text-slate-600">
                Get to know hosts, share your interests and arrange an
                experience together.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                <Heart size={28} />
              </div>
              <h3 className="mt-5 text-xl font-bold">3. Experience</h3>
              <p className="mt-3 text-slate-600">
                Share skills, discover cultures and create lasting memories.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 md:px-12">
        <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
          <div>
            <p className="font-semibold uppercase tracking-widest text-emerald-700">
              Open your doors to the world
            </p>
            <h2 className="mt-3 text-3xl font-bold md:text-5xl">
              Become a host. Share what makes your place special.
            </h2>
            <p className="mt-6 leading-relaxed text-slate-600">
              Welcome travellers, share your culture, exchange knowledge and
              introduce people to your community. Create your host profile
              and let the world discover your opportunity.
            </p>
            <a
              href="/register"
              className="mt-8 inline-flex items-center rounded-full bg-emerald-800 px-7 py-4 font-semibold text-white hover:bg-emerald-700"
            >
              Become a host <ArrowRight className="ml-2" size={18} />
            </a>
          </div>

          <div className="overflow-hidden rounded-3xl">
            <img
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200"
              alt="People sharing an experience together"
              className="h-[400px] w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-emerald-900 px-6 py-20 text-center text-white md:px-12">
        <ShieldCheck className="mx-auto text-yellow-300" size={38} />
        <h2 className="mt-5 text-3xl font-bold md:text-4xl">
          Your next meaningful journey starts here.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-emerald-100">
          Meet people, exchange experiences and discover a world of
          possibilities with Travailaway.
        </p>
        <a
          href="/register"
          className="mt-8 inline-block rounded-full bg-yellow-400 px-8 py-4 font-semibold text-slate-900 hover:bg-yellow-300"
        >
          Join Travailaway <ArrowRight className="ml-2 inline" size={18} />
        </a>
      </section>

      <footer className="bg-slate-950 px-6 py-12 text-white md:px-12">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row">
          <div>
            <img src={logo} alt="Travailaway" className="h-12 w-auto" />
            <p className="mt-3 text-sm text-slate-400">
              Travel. Connect. Experience.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-slate-300">
            <a href="#explore" className="hover:text-yellow-300">Explore</a>
            <a href="/register" className="hover:text-yellow-300">Become a host</a>
            <a href="/login" className="hover:text-yellow-300">Log in</a>
            <a href="/register" className="hover:text-yellow-300">Join us</a>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-xs text-slate-500">
          © {new Date().getFullYear()} Travailaway. An initiative by Molongi
          Investments Company SMC Limited.
        </div>
      </footer>
    </main>
  );
}
