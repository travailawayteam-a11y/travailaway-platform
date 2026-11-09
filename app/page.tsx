"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight, Globe2, Heart, MapPin, Menu, Search, ShieldCheck,
  Users, X, Home, PawPrint, GraduationCap, Palette, Sailboat,
  Leaf, HandHeart, Languages, Compass, Utensils, Camera,
  Mountain, Music, BookOpen, MessageCircle, Plane, CheckCircle2, Link2
} from "lucide-react";

const logo = "https://sbgfaplqdxejirqfqfpn.supabase.co/storage/v1/object/public/brand-assets/1000296575-removebg-preview.png";

// Social logos: Font Awesome Free (CC BY 4.0), https://fontawesome.com
const BRAND_ICONS: Record<string, { vb: string; d: string }> = {
  whatsapp: { vb: "0 0 448 512", d: "M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" },
  facebook: { vb: "0 0 320 512", d: "M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z" },
  x: { vb: "0 0 512 512", d: "M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" },
  linkedin: { vb: "0 0 448 512", d: "M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" },
  telegram: { vb: "0 0 496 512", d: "M248,8C111.033,8,0,119.033,0,256S111.033,504,248,504,496,392.967,496,256,384.967,8,248,8ZM362.952,176.66c-3.732,39.215-19.881,134.378-28.1,178.3-3.476,18.584-10.322,24.816-16.948,25.425-14.4,1.326-25.338-9.517-39.287-18.661-21.827-14.308-34.158-23.215-55.346-37.177-24.485-16.135-8.612-25,5.342-39.5,3.652-3.793,67.107-61.51,68.335-66.746.153-.655.3-3.1-1.154-4.384s-3.59-.849-5.135-.5q-3.283.746-104.608,69.142-14.845,10.194-26.894,9.934c-8.855-.191-25.888-5.006-38.551-9.123-15.531-5.048-27.875-7.717-26.8-16.291q.84-6.7,18.45-13.7,108.446-47.248,144.628-62.3c68.872-28.647,83.183-33.623,92.511-33.789,2.052-.034,6.639.474,9.61,2.885a10.452,10.452,0,0,1,3.53,6.716A43.765,43.765,0,0,1,362.952,176.66Z" },
  email: { vb: "0 0 512 512", d: "M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM0 176L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-208L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" },
};

function BrandIcon({ name, size = 18 }: { name: string; size?: number }) {
  const icon = BRAND_ICONS[name];
  return (
    <svg viewBox={icon.vb} width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d={icon.d} />
    </svg>
  );
}

const slides = [
  {
    image: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=2000&q=85",
    title: "Discover the world differently.",
    subtitle: "Travel beyond the ordinary. Connect with people, share experiences and discover new cultures."
  },
  {
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=85",
    title: "Find your place in the world.",
    subtitle: "Explore meaningful opportunities and experience everyday life in places you've always dreamed of visiting."
  },
  {
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=2000&q=85",
    title: "Meet people. Share skills. Grow.",
    subtitle: "Build friendships across borders through cultural exchange, learning and shared experiences."
  },
  {
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2000&q=85",
    title: "Make travel mean more.",
    subtitle: "From nature and farms to hostels and community projects, find an experience that inspires you."
  }
];

const destinations = [
  { name: "Africa", image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=900&q=85", description: "Discover communities, wildlife and rich cultures." },
  { name: "Europe", image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=900&q=85", description: "Experience historic cities and beautiful countryside." },
  { name: "Asia", image: "https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&w=900&q=85", description: "Explore diverse traditions and inspiring places." },
  { name: "North America", image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=900&q=85", description: "Discover new landscapes and local lifestyles." },
  { name: "South America", image: "https://images.unsplash.com/photo-1512813195386-6cf811ad3542?auto=format&fit=crop&w=900&q=85", description: "Connect with vibrant cultures and communities." },
  { name: "Oceania", image: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=900&q=85", description: "Experience island life and natural wonders." }
];

const categories = [
  { name: "Hostels & Guesthouses", icon: Home },
  { name: "Farms & Gardening", icon: Leaf },
  { name: "Animal Care", icon: PawPrint },
  { name: "Teaching & Education", icon: GraduationCap },
  { name: "Arts & Creativity", icon: Palette },
  { name: "Sailing & Boats", icon: Sailboat },
  { name: "Community Projects", icon: HandHeart },
  { name: "Language Exchange", icon: Languages },
  { name: "Nature & Outdoors", icon: Mountain },
  { name: "Hospitality", icon: Utensils },
  { name: "Photography", icon: Camera },
  { name: "Music & Culture", icon: Music },
  { name: "Learning & Skills", icon: BookOpen },
  { name: "Other Experiences", icon: Compass }
];

const steps = [
  { number: "01", title: "Discover opportunities", description: "Explore hosts and experiences in countries and communities around the world.", icon: Search },
  { number: "02", title: "Connect with hosts", description: "Create your profile, find a suitable opportunity and contact hosts directly.", icon: MessageCircle },
  { number: "03", title: "Share the experience", description: "Travel, exchange skills, learn from others and create unforgettable memories.", icon: Globe2 }
];

const faqs = [
  { question: "What is Travailaway?", answer: "Travailaway is a cultural exchange platform connecting travellers with hosts around the world for shared experiences, learning and cultural connection." },
  { question: "How does cultural exchange work?", answer: "Hosts publish opportunities describing the experience, expectations and arrangements. Travellers can explore opportunities and contact hosts to discuss details before making plans." },
  { question: "Can I become a host?", answer: "Yes. Individuals, farms, guesthouses, community projects and other suitable hosts can create a profile and share their opportunities." },
  { question: "Is accommodation or food guaranteed?", answer: "Not automatically. Each host must clearly explain what they offer, including accommodation, meals, working hours and other expectations. Travellers should agree on all details before travelling." },
  { question: "How can I stay safe?", answer: "Read host profiles carefully, communicate with hosts, verify important details and agree on expectations before travelling. Never travel without a clear arrangement." }
];

export default function HomePage() {
  const [slide, setSlide] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [destination, setDestination] = useState("");
  const [category, setCategory] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [shareUrl, setShareUrl] = useState("https://travailaway-platform.hostless.app");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setShareUrl(window.location.origin);
  }, []);

  const shareText = "Travailaway: travel, connect and experience. Join a community built on cultural exchange.";

  const shareLinks = [
    { name: "WhatsApp", icon: "whatsapp", color: "bg-[#25D366] hover:bg-[#1ebe5b]", href: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}` },
    { name: "Facebook", icon: "facebook", color: "bg-[#1877F2] hover:bg-[#1464cc]", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
    { name: "X", icon: "x", color: "bg-black hover:bg-neutral-800", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}` },
    { name: "LinkedIn", icon: "linkedin", color: "bg-[#0A66C2] hover:bg-[#08529b]", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` },
    { name: "Telegram", icon: "telegram", color: "bg-[#26A5E4] hover:bg-[#1d8ac0]", href: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}` },
    { name: "Email", icon: "email", color: "bg-gray-500 hover:bg-gray-600", href: `mailto:?subject=${encodeURIComponent("Have a look at Travailaway")}&body=${encodeURIComponent(`${shareText} ${shareUrl}`)}` }
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt("Copy this link:", shareUrl);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide(current => (current + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const searchHosts = () => {
    const params = new URLSearchParams();
    if (destination) params.set("destination", destination);
    if (category) params.set("category", category);
    window.location.href = `/explore?${params.toString()}`;
  };

  return (
    <main className="min-h-screen bg-white text-slate-800">

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          <a href="/" className="shrink-0">
            <img src={logo} alt="Travailaway" className="h-16 w-auto object-contain md:h-20 lg:h-24" />
          </a>

          <nav className="hidden items-center gap-7 text-sm font-semibold lg:flex">
            <a href="/" className="text-emerald-700">Home</a>
            <a href="/explore" className="hover:text-emerald-700">Explore</a>
            <a href="/how-it-works" className="hover:text-emerald-700">How it works</a>
            <a href="/about" className="hover:text-emerald-700">Our mission</a>
            <a href="/safety" className="hover:text-emerald-700">Safety</a>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a href="/login" className="px-4 py-2 text-sm font-semibold">Log in</a>
            <a href="/register" className="rounded-full bg-emerald-700 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-800">Join Travailaway</a>
          </div>

          <button onClick={() => setMobileMenu(!mobileMenu)} className="rounded-lg p-2 lg:hidden" aria-label="Toggle menu">
            {mobileMenu ? <X size={27} /> : <Menu size={27} />}
          </button>
        </div>

        {mobileMenu && (
          <div className="border-t bg-white px-6 py-5 lg:hidden">
            <nav className="flex flex-col gap-5 font-semibold">
              <a href="/" onClick={() => setMobileMenu(false)}>Home</a>
              <a href="/explore" onClick={() => setMobileMenu(false)}>Explore opportunities</a>
              <a href="/how-it-works" onClick={() => setMobileMenu(false)}>How it works</a>
              <a href="/about" onClick={() => setMobileMenu(false)}>Our mission</a>
              <a href="/safety" onClick={() => setMobileMenu(false)}>Safety</a>
              <a href="/login" onClick={() => setMobileMenu(false)}>Log in</a>
              <a href="/register" onClick={() => setMobileMenu(false)} className="text-emerald-700">Join Travailaway</a>
            </nav>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="relative flex min-h-[590px] items-center overflow-hidden md:min-h-[680px]">
        {slides.map((item, index) => (
          <div key={item.title} className={`absolute inset-0 transition-opacity duration-1000 ${slide === index ? "opacity-100" : "opacity-0"}`} style={{ backgroundImage: `url(${item.image})`, backgroundPosition: "center", backgroundSize: "cover" }} />
        ))}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-24 text-white md:px-8">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-4 py-2 text-sm font-semibold">
              <Globe2 size={17} /> A world of cultural exchange
            </div>
            <h1 className="text-4xl font-extrabold leading-tight md:text-6xl lg:text-7xl">{slides[slide].title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/90 md:text-xl">{slides[slide].subtitle}</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <a href="/register?type=traveller" className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-7 py-4 font-bold text-white hover:bg-emerald-700">Join as a traveller <ArrowRight size={19} /></a>
              <a href="/register?type=host" className="rounded-full border border-white px-7 py-4 font-bold text-white hover:bg-white hover:text-slate-900">Join as a host</a>
            </div>
            <a href="/explore" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white/90 underline underline-offset-4 hover:text-white">Or browse opportunities first <ArrowRight size={16} /></a>
          </div>
          <div className="mt-14 flex gap-2">
            {slides.map((item, index) => (
              <button key={item.title} onClick={() => setSlide(index)} aria-label={`Show slide ${index + 1}`} className={`h-2 rounded-full transition-all ${slide === index ? "w-10 bg-white" : "w-3 bg-white/50"}`} />
            ))}
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <section className="relative z-20 mx-auto -mt-10 max-w-6xl px-4">
        <div className="rounded-2xl bg-white p-5 shadow-xl md:p-7">
          <h2 className="text-xl font-extrabold md:text-2xl">Find your next experience</h2>
          <p className="mt-1 text-sm text-gray-500">Where would you like your journey to take you?</p>
          <div className="mt-5 grid gap-4 md:grid-cols-[1fr_1fr_auto]">
            <label className="flex items-center gap-3 rounded-xl border px-4 py-3">
              <MapPin className="shrink-0 text-emerald-700" />
              <span className="w-full">
                <span className="block text-xs font-bold text-gray-500">DESTINATION</span>
                <select value={destination} onChange={e => setDestination(e.target.value)} className="w-full bg-transparent text-sm outline-none">
                  <option value="">Anywhere in the world</option>
                  {destinations.map(place => <option key={place.name} value={place.name}>{place.name}</option>)}
                </select>
              </span>
            </label>
            <label className="flex items-center gap-3 rounded-xl border px-4 py-3">
              <Compass className="shrink-0 text-emerald-700" />
              <span className="w-full">
                <span className="block text-xs font-bold text-gray-500">EXPERIENCE</span>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-transparent text-sm outline-none">
                  <option value="">All experiences</option>
                  {categories.map(item => <option key={item.name} value={item.name}>{item.name}</option>)}
                </select>
              </span>
            </label>
            <button onClick={searchHosts} className="flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-8 py-4 font-bold text-white hover:bg-emerald-800">
              <Search size={19} /> Search
            </button>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="mx-auto max-w-7xl px-5 py-24 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">Welcome to Travailaway</span>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-900 md:text-5xl">Travel is better when you connect.</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">Discover a different way to experience the world. Connect with hosts, share your skills, learn from local communities and build friendships that go beyond borders.</p>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl bg-emerald-50 p-8 text-center">
            <Globe2 className="mx-auto text-emerald-700" size={38} />
            <h3 className="mt-5 text-xl font-bold">Explore the world</h3>
            <p className="mt-3 leading-7 text-gray-600">Discover places and experiences beyond the usual tourist routes.</p>
          </div>
          <div className="rounded-2xl bg-amber-50 p-8 text-center">
            <Heart className="mx-auto text-amber-600" size={38} />
            <h3 className="mt-5 text-xl font-bold">Build connections</h3>
            <p className="mt-3 leading-7 text-gray-600">Meet people, understand cultures and create lasting friendships.</p>
          </div>
          <div className="rounded-2xl bg-sky-50 p-8 text-center">
            <Users className="mx-auto text-sky-700" size={38} />
            <h3 className="mt-5 text-xl font-bold">Share experiences</h3>
            <p className="mt-3 leading-7 text-gray-600">Exchange knowledge, contribute your skills and learn together.</p>
          </div>
        </div>
      </section>

      {/* DESTINATIONS */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-5">
            <div>
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">Go somewhere new</span>
              <h2 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">Explore by destination</h2>
              <p className="mt-3 text-gray-600">Your next adventure could be anywhere.</p>
            </div>
            <a href="/explore" className="inline-flex items-center gap-2 font-bold text-emerald-700">Explore all <ArrowRight size={18} /></a>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map(place => (
              <a key={place.name} href={`/explore?destination=${encodeURIComponent(place.name)}`} className="group relative h-72 overflow-hidden rounded-2xl shadow-md">
                <img src={place.image} alt={place.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute bottom-0 p-7 text-white">
                  <h3 className="text-2xl font-extrabold">{place.name}</h3>
                  <p className="mt-2 text-sm text-white/85">{place.description}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold">Discover <ArrowRight size={17} /></span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-5 py-24 md:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">Find what inspires you</span>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">Discover experiences</h2>
          <p className="mt-4 text-gray-600">From helping on a farm to learning a new language, there are many ways to connect with the world.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {categories.map(item => {
            const Icon = item.icon;
            return (
              <a key={item.name} href={`/explore?category=${encodeURIComponent(item.name)}`} className="group rounded-2xl border border-gray-100 p-5 text-center transition hover:-translate-y-1 hover:border-emerald-200 hover:bg-emerald-50 hover:shadow-md">
                <Icon className="mx-auto text-emerald-700" size={30} />
                <h3 className="mt-4 text-sm font-bold">{item.name}</h3>
              </a>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-emerald-950 py-24 text-white">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">Simple to get started</span>
            <h2 className="mt-3 text-3xl font-extrabold md:text-5xl">How Travailaway works</h2>
            <p className="mt-5 leading-7 text-emerald-100/80">Your journey from discovery to a meaningful cultural exchange.</p>
          </div>
          <div className="grid gap-12 md:grid-cols-3">
            {steps.map(step => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-800"><Icon size={35} className="text-emerald-200" /></div>
                  <span className="mt-6 block text-sm font-extrabold text-emerald-300">STEP {step.number}</span>
                  <h3 className="mt-3 text-xl font-bold">{step.title}</h3>
                  <p className="mx-auto mt-4 max-w-sm leading-7 text-emerald-100/80">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TRAVELLERS */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 md:grid-cols-2 md:px-8">
        <div className="overflow-hidden rounded-3xl">
          <img src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1200&q=85" alt="Travellers enjoying an outdoor experience" className="h-[420px] w-full object-cover" />
        </div>
        <div>
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">For travellers</span>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight text-slate-900 md:text-5xl">See more. Learn more. Experience more.</h2>
          <p className="mt-6 leading-8 text-gray-600">Go beyond sightseeing. Discover local life, develop new skills, meet welcoming people and experience destinations from a different perspective.</p>
          <ul className="mt-7 space-y-4">
            {["Discover opportunities around the world", "Connect with hosts and local communities", "Share your interests, skills and experiences", "Build friendships across cultures"].map(item => (
              <li key={item} className="flex items-center gap-3"><CheckCircle2 className="shrink-0 text-emerald-700" size={20} /><span className="text-gray-700">{item}</span></li>
            ))}
          </ul>
          <a href="/register?type=traveller" className="mt-9 inline-flex items-center gap-2 rounded-full bg-emerald-700 px-7 py-4 font-bold text-white hover:bg-emerald-800">Start exploring <ArrowRight size={18} /></a>
        </div>
      </section>

      {/* HOSTS */}
      <section className="bg-amber-50 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:grid-cols-2 md:px-8">
          <div className="order-2 md:order-1">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-amber-700">For hosts</span>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-slate-900 md:text-5xl">Open your world to new connections.</h2>
            <p className="mt-6 leading-8 text-gray-600">Welcome travellers, exchange knowledge and introduce people to your community, culture and way of life.</p>
            <ul className="mt-7 space-y-4">
              {["Share your project or hosting opportunity", "Meet travellers from different backgrounds", "Exchange knowledge and cultural experiences", "Build an international community"].map(item => (
                <li key={item} className="flex items-center gap-3"><CheckCircle2 className="shrink-0 text-amber-700" size={20} /><span className="text-gray-700">{item}</span></li>
              ))}
            </ul>
            <a href="/register?type=host" className="mt-9 inline-flex items-center gap-2 rounded-full bg-amber-600 px-7 py-4 font-bold text-white hover:bg-amber-700">Become a host <ArrowRight size={18} /></a>
          </div>
          <div className="order-1 overflow-hidden rounded-3xl md:order-2">
            <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=85" alt="People sharing an experience together" className="h-[420px] w-full object-cover" />
          </div>
        </div>
      </section>

      {/* COMMUNITY */}
      <section className="mx-auto max-w-7xl px-5 py-24 md:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-7 py-16 text-center text-white md:px-16">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-emerald-700/30 blur-3xl" />
          <div className="relative mx-auto max-w-3xl">
            <Users size={42} className="mx-auto text-emerald-300" />
            <h2 className="mt-6 text-3xl font-extrabold md:text-5xl">One world. Countless connections.</h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">Every journey starts with a connection. Join an international community built around cultural exchange, discovery and shared experiences.</p>
            <a href="/register" className="mt-9 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-8 py-4 font-bold text-white hover:bg-emerald-700">Join the community <ArrowRight size={18} /></a>
          </div>
        </div>
      </section>

      {/* TRAVEL COMPANION */}
      <section className="mx-auto max-w-7xl px-5 pb-24 md:px-8">
        <a href="/travel-buddies" className="group grid overflow-hidden rounded-3xl bg-amber-50 transition hover:bg-amber-100 md:grid-cols-2">
          <div className="relative h-72 md:order-2 md:h-auto">
            <img src="https://images.unsplash.com/photo-1758599668974-6da5d7cc6cc4?auto=format&fit=crop&w=1200&q=70" alt="Two smiling friends with backpacks setting out together" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
          </div>
          <div className="flex flex-col justify-center px-7 py-12 text-center md:order-1 md:px-12 md:text-left">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-amber-700">Travel better together</span>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-900 md:text-5xl">Find a travel companion</h2>
            <p className="mt-5 text-lg leading-8 text-gray-600">Heading somewhere soon? Share your plans and meet other travellers who would love to walk the road with you.</p>
            <span className="mt-8 inline-flex items-center justify-center gap-2 font-bold text-amber-800 md:justify-start">Post a listing to connect with your travel companion <ArrowRight size={18} className="shrink-0 transition group-hover:translate-x-1" /></span>
          </div>
        </a>
      </section>

      {/* AMBASSADOR */}
      <section className="mx-auto max-w-7xl px-5 pb-24 md:px-8">
        <a href="/ambassador" className="group grid overflow-hidden rounded-3xl bg-emerald-50 transition hover:bg-emerald-100 md:grid-cols-2">
          <div className="relative h-72 md:h-auto">
            <img src="https://images.unsplash.com/photo-1758599668294-8d13c0942601?auto=format&fit=crop&w=1200&q=70" alt="Smiling volunteers sharing a moment together" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
          </div>
          <div className="flex flex-col justify-center px-7 py-12 text-center md:px-12 md:text-left">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">Be the face of the community</span>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-900 md:text-5xl">Become a Travailaway Ambassador</h2>
            <p className="mt-5 text-lg leading-8 text-gray-600">Share your story, inspire other travellers and help grow a community built on cultural exchange.</p>
            <span className="mt-8 inline-flex items-center justify-center gap-2 font-bold text-emerald-800 md:justify-start">Learn more <ArrowRight size={18} className="transition group-hover:translate-x-1" /></span>
          </div>
        </a>
      </section>

      {/* SAFETY */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-7 px-5 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100"><ShieldCheck size={42} className="text-emerald-700" /></div>
          <div>
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">Travel thoughtfully</span>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">Your safety matters.</h2>
            <p className="mx-auto mt-5 max-w-2xl leading-8 text-gray-600">Good experiences begin with clear communication and informed decisions. Learn how to evaluate opportunities, communicate with hosts and prepare for your journey.</p>
          </div>
          <a href="/safety" className="inline-flex items-center gap-2 rounded-full border-2 border-emerald-700 px-7 py-3 font-bold text-emerald-800 hover:bg-emerald-700 hover:text-white">Visit our safety guide <ArrowRight size={18} /></a>
        </div>
      </section>

      {/* SHARE */}
      <section className="mx-auto max-w-4xl px-5 pt-24 text-center">
        <span className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">Spread the word</span>
        <h2 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-5xl">Share the Travailaway idea</h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-600">Know someone who would love to travel differently? Share Travailaway with your friends and followers on your favourite social networks.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {shareLinks.map(item => (
            <a key={item.name} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={`Share on ${item.name}`} title={`Share on ${item.name}`} className={`flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-sm transition hover:-translate-y-1 hover:shadow-md ${item.color}`}>
              <BrandIcon name={item.icon} size={26} />
            </a>
          ))}
          <button onClick={copyLink} aria-label="Copy link" title="Copy link" className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-emerald-700 text-emerald-700 transition hover:-translate-y-1 hover:bg-emerald-50">
            <Link2 size={22} />
          </button>
        </div>
        <p className="mt-4 h-5 text-sm font-semibold text-emerald-700">{copied ? "Link copied!" : ""}</p>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-5 py-24">
        <div className="mb-12 text-center">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">Need to know more?</span>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">Frequently asked questions</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={faq.question} className="overflow-hidden rounded-xl border border-gray-200">
              <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="flex w-full items-center justify-between gap-4 p-5 text-left font-bold text-slate-900">
                {faq.question}
                <span className="text-2xl text-emerald-700">{openFaq === index ? "−" : "+"}</span>
              </button>
              {openFaq === index && <div className="px-5 pb-5 leading-7 text-gray-600">{faq.answer}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-emerald-800 px-5 py-20 text-center text-white">
        <Plane className="mx-auto" size={42} />
        <h2 className="mt-5 text-3xl font-extrabold md:text-5xl">Your journey starts here.</h2>
        <p className="mx-auto mt-5 max-w-2xl leading-8 text-emerald-100">Discover new places, meet remarkable people and make every experience count.</p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <a href="/explore" className="rounded-full bg-white px-8 py-4 font-bold text-emerald-800 hover:bg-gray-100">Explore opportunities</a>
          <a href="/register" className="rounded-full border border-white px-8 py-4 font-bold text-white hover:bg-white/10">Join Travailaway</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 px-5 pb-8 pt-16 text-gray-300">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <a href="/"><img src={logo} alt="Travailaway" className="h-20 w-auto object-contain" /></a>
            <p className="mt-5 max-w-xs text-sm leading-7 text-gray-400">Travel. Connect. Experience. Bringing travellers and hosts together through meaningful cultural exchange.</p>
          </div>
          <div>
            <h3 className="mb-5 font-bold text-white">Explore</h3>
            <div className="space-y-3 text-sm">
              <a className="block hover:text-emerald-300" href="/explore">Find opportunities</a>
              <a className="block hover:text-emerald-300" href="/explore">Destinations</a>
              <a className="block hover:text-emerald-300" href="/how-it-works">How it works</a>
              <a className="block hover:text-emerald-300" href="/register?type=traveller">Join as a traveller</a>
            </div>
          </div>
          <div>
            <h3 className="mb-5 font-bold text-white">For hosts</h3>
            <div className="space-y-3 text-sm">
              <a className="block hover:text-emerald-300" href="/register?type=host">Become a host</a>
              <a className="block hover:text-emerald-300" href="/login">Host login</a>
              <a className="block hover:text-emerald-300" href="/safety">Safety guide</a>
              <a className="block hover:text-emerald-300" href="/contact">Contact us</a>
            </div>
          </div>
          <div>
            <h3 className="mb-5 font-bold text-white">Travailaway</h3>
            <div className="space-y-3 text-sm">
              <a className="block hover:text-emerald-300" href="/about">Our mission</a>
              <a className="block hover:text-emerald-300" href="/safety">Safety</a>
              <a className="block hover:text-emerald-300" href="/privacy">Privacy policy</a>
              <a className="block hover:text-emerald-300" href="/terms">Terms of service</a>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-14 flex max-w-7xl flex-col justify-between gap-4 border-t border-white/10 pt-7 text-xs text-gray-500 md:flex-row">
          <p>© {new Date().getFullYear()} Travailaway. All rights reserved.</p>
          <p>Created with a world of possibilities in mind.</p>
        </div>
      </footer>
    </main>
  );
}
