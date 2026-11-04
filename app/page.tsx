"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  Globe2,
  Heart,
  MapPin,
  Menu,
  Search,
  ShieldCheck,
  Users,
  X,
  Sprout,
  Home,
  PawPrint,
  GraduationCap,
  Palette,
  Sailboat,
  Leaf,
  HandHeart,
  Languages,
  Compass,
  CalendarDays,
  BookOpen,
  MessageCircle,
  Star,
  ChevronDown,
} from "lucide-react";

const logo =
  "https://sbgfaplqdxejirqfqfpn.supabase.co/storage/v1/object/public/brand-assets/1000296575-removebg-preview.png";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=1800",
    title: "Travel beyond the ordinary.",
    subtitle:
      "Discover meaningful experiences, connect with people and explore the world through cultural exchange.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1800",
    title: "Discover. Connect. Experience.",
    subtitle:
      "Find welcoming hosts and unforgettable opportunities in destinations around the world.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1800",
    title: "Make the world your home.",
    subtitle:
      "Share your skills, learn new cultures and create memories that last a lifetime.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1800",
    title: "Your journey starts here.",
    subtitle:
      "From farms and family homes to hostels and community projects, find your next adventure.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1800",
    title: "Travel with purpose.",
    subtitle:
      "Meet local communities, exchange experiences and see the world differently.",
  },
];

const destinations = [
  {
    name: "Africa",
    detail: "Discover culture, nature and community",
    image:
      "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=900",
  },
  {
    name: "Europe",
    detail: "Explore historic towns and diverse cultures",
    image:
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=900",
  },
  {
    name: "Asia",
    detail: "Experience traditions and new adventures",
    image:
      "https://images.unsplash.com/photo-1528181304800-259b08848526?w=900",
  },
  {
    name: "North America",
    detail: "Discover cities, nature and new communities",
    image:
      "https://images.unsplash.com/photo-1556146385-97d8a0b5e66b?w=900",
  },
  {
    name: "South America",
    detail: "Explore vibrant cultures and landscapes",
    image:
      "https://images.unsplash.com/photo-1578746401323-f997c71f4096?w=900",
  },
  {
    name: "Oceania",
    detail: "Discover islands, coastlines and nature",
    image:
      "https://images.unsplash.com/photo-1596428025491-662bbaf50351?w=900",
  },
];

const categories = [
  { name: "Farmstays & gardening", icon: Sprout },
  { name: "Hostels & guesthouses", icon: Home },
  { name: "Hotels & lodges", icon: Compass },
  { name: "NGOs & charities", icon: HandHeart },
  { name: "Families & homestays", icon: Heart },
  { name: "House & pet sitting", icon: PawPrint },
  { name: "Teaching & education", icon: GraduationCap },
  { name: "Environment & conservation", icon: Leaf },
  { name: "Animal care", icon: PawPrint },
  { name: "Construction & renovation", icon: Home },
  { name: "Community development", icon: Users },
  { name: "Arts & culture", icon: Palette },
  { name: "Boats & sailing", icon: Sailboat },
  { name: "Eco-tourism", icon: Globe2 },
];

const languages = [
  "English",
  "French",
  "Spanish",
  "Portuguese",
  "German",
  "Italian",
  "Dutch",
  "Arabic",
  "Chinese",
  "Russian",
  "Swahili",
];

const languageCopy: Record<
  string,
  {
    explore: string;
    how: string;
    community: string;
    login: string;
    join: string;
    headline: string;
    intro: string;
    exploreButton: string;
    hostButton: string;
  }
> = {
  English: {
    explore: "Explore",
    how: "How it works",
    community: "Community",
    login: "Log in",
    join: "Join Travailaway",
    headline: "Travel beyond the ordinary.",
    intro:
      "Discover meaningful experiences, connect with people and explore the world through cultural exchange.",
    exploreButton: "Find an experience",
    hostButton: "Become a host",
  },
  French: {
    explore: "Explorer",
    how: "Comment ça marche",
    community: "Communauté",
    login: "Connexion",
    join: "Rejoindre Travailaway",
    headline: "Voyagez autrement.",
    intro:
      "Découvrez des expériences enrichissantes, rencontrez des personnes et explorez le monde grâce aux échanges culturels.",
    exploreButton: "Trouver une expérience",
    hostButton: "Devenir hôte",
  },
  Spanish: {
    explore: "Explorar",
    how: "Cómo funciona",
    community: "Comunidad",
    login: "Iniciar sesión",
    join: "Únete a Travailaway",
    headline: "Viaja más allá de lo habitual.",
    intro:
      "Descubre experiencias significativas, conecta con personas y explora el mundo mediante el intercambio cultural.",
    exploreButton: "Encontrar una experiencia",
    hostButton: "Ser anfitrión",
  },
  Portuguese: {
    explore: "Explorar",
    how: "Como funciona",
    community: "Comunidade",
    login: "Entrar",
    join: "Junte-se à Travailaway",
    headline: "Viaje além do comum.",
    intro:
      "Descubra experiências significativas, conecte-se com pessoas e explore o mundo através do intercâmbio cultural.",
    exploreButton: "Encontrar uma experiência",
    hostButton: "Tornar-se anfitrião",
  },
  German: {
    explore: "Entdecken",
    how: "So funktioniert es",
    community: "Gemeinschaft",
    login: "Anmelden",
    join: "Travailaway beitreten",
    headline: "Reisen Sie über das Gewöhnliche hinaus.",
    intro:
      "Entdecken Sie besondere Erfahrungen, lernen Sie Menschen kennen und erkunden Sie die Welt durch kulturellen Austausch.",
    exploreButton: "Erlebnis finden",
    hostButton: "Gastgeber werden",
  },
  Italian: {
    explore: "Esplora",
    how: "Come funziona",
    community: "Comunità",
    login: "Accedi",
    join: "Unisciti a Travailaway",
    headline: "Viaggia oltre l'ordinario.",
    intro:
      "Scopri esperienze significative, incontra persone ed esplora il mondo attraverso lo scambio culturale.",
    exploreButton: "Trova un'esperienza",
    hostButton: "Diventa ospitante",
  },
  Dutch: {
    explore: "Ontdekken",
    how: "Hoe het werkt",
    community: "Gemeenschap",
    login: "Inloggen",
    join: "Word lid van Travailaway",
    headline: "Reis buiten het gewone.",
    intro:
      "Ontdek bijzondere ervaringen, ontmoet mensen en verken de wereld door culturele uitwisseling.",
    exploreButton: "Vind een ervaring",
    hostButton: "Word gastheer",
  },
  Arabic: {
    explore: "استكشف",
    how: "كيف يعمل",
    community: "المجتمع",
    login: "تسجيل الدخول",
    join: "انضم إلى Travailaway",
    headline: "سافر إلى ما هو أبعد من المعتاد.",
    intro:
      "اكتشف تجارب مميزة وتواصل مع الناس واستكشف العالم من خلال التبادل الثقافي.",
    exploreButton: "ابحث عن تجربة",
    hostButton: "كن مضيفاً",
  },
  Chinese: {
    explore: "探索",
    how: "使用方法",
    community: "社区",
    login: "登录",
    join: "加入 Travailaway",
    headline: "开启不一样的旅行。",
    intro: "发现有意义的体验，结识新朋友，通过文化交流探索世界。",
    exploreButton: "寻找体验",
    hostButton: "成为房东",
  },
  Russian: {
    explore: "Исследовать",
    how: "Как это работает",
    community: "Сообщество",
    login: "Войти",
    join: "Присоединиться",
    headline: "Путешествуйте за пределами обычного.",
    intro:
      "Откройте для себя новые впечатления, знакомьтесь с людьми и исследуйте мир через культурный обмен.",
    exploreButton: "Найти опыт",
    hostButton: "Стать хозяином",
  },
  Swahili: {
    explore: "Gundua",
    how: "Jinsi inavyofanya kazi",
    community: "Jumuiya",
    login: "Ingia",
    join: "Jiunge na Travailaway",
    headline: "Safiri zaidi ya kawaida.",
    intro:
      "Gundua uzoefu wenye maana, kutana na watu na chunguza dunia kupitia kubadilishana tamaduni.",
    exploreButton: "Tafuta uzoefu",
    hostButton: "Kuwa mwenyeji",
  },
};

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [language, setLanguage] = useState("English");
  const [destination, setDestination] = useState("");
  const [exchangeType, setExchangeType] = useState("");
  const [activeCategory, setActiveCategory] = useState("");

  const copy = languageCopy[language] || languageCopy.English;

  useEffect(() => {
    const savedLanguage = localStorage.getItem("travailaway-language");
    if (savedLanguage && languageCopy[savedLanguage]) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("travailaway-language", language);
    document.documentElement.lang = language.toLowerCase();
    document.documentElement.dir = language === "Arabic" ? "rtl" : "ltr";
  }, [language]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const exploreOpportunities = () => {
    const params = new URLSearchParams();

    if (destination.trim()) {
      params.set("destination", destination.trim());
    }

    if (exchangeType) {
      params.set("category", exchangeType);
    }

    if (activeCategory) {
      params.set("category", activeCategory);
    }

    window.location.href = `/explore?${params.toString()}`;
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          <a href="/" className="flex shrink-0 items-center">
            <img
              src={logo}
              alt="Travailaway"
              className="h-16 w-auto max-w-[230px] object-contain md:h-20 md:max-w-[280px] lg:h-24"
            />
          </a>

          <nav className="hidden items-center gap-7 lg:flex">
            <a
              href="#destinations"
              className="font-medium text-gray-700 transition hover:text-amber-700"
            >
              {copy.explore}
            </a>

            <a
              href="#how-it-works"
              className="font-medium text-gray-700 transition hover:text-amber-700"
            >
              {copy.how}
            </a>

            <div className="relative">
              <button
                onClick={() => setInfoOpen(!infoOpen)}
                className="flex items-center gap-1 font-medium text-gray-700 hover:text-amber-700"
              >
                Information Centre
                <ChevronDown size={16} />
              </button>

              {infoOpen && (
                <div className="absolute left-0 top-9 w-56 rounded-xl border bg-white p-3 shadow-xl">
                  <a
                    href="/safety"
                    className="block rounded-lg px-3 py-2 hover:bg-amber-50"
                  >
                    Safety information
                  </a>
                  <a
                    href="/faq"
                    className="block rounded-lg px-3 py-2 hover:bg-amber-50"
                  >
                    Frequently asked questions
                  </a>
                  <a
                    href="/about"
                    className="block rounded-lg px-3 py-2 hover:bg-amber-50"
                  >
                    About Travailaway
                  </a>
                  <a
                    href="/contact"
                    className="block rounded-lg px-3 py-2 hover:bg-amber-50"
                  >
                    Contact us
                  </a>
                </div>
              )}
            </div>

            <a
              href="#community"
              className="font-medium text-gray-700 transition hover:text-amber-700"
            >
              {copy.community}
            </a>
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-2 py-2 text-sm outline-none"
              aria-label="Choose language"
            >
              {languages.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <a
              href="/login"
              className="font-semibold text-gray-700 hover:text-amber-700"
            >
              {copy.login}
            </a>

            <a
              href="/register"
              className="rounded-full bg-amber-700 px-5 py-3 font-semibold text-white transition hover:bg-amber-800"
            >
              {copy.join}
            </a>
          </div>

          <button
            className="rounded-lg p-2 lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Open menu"
          >
            {menuOpen ? <X size={27} /> : <Menu size={27} />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t bg-white px-5 py-5 shadow-lg lg:hidden">
            <div className="flex flex-col gap-4">
              <a href="#destinations" onClick={() => setMenuOpen(false)}>
                {copy.explore}
              </a>
              <a href="#how-it-works" onClick={() => setMenuOpen(false)}>
                {copy.how}
              </a>
              <a href="#travellers" onClick={() => setMenuOpen(false)}>
                For travellers
              </a>
              <a href="#hosts" onClick={() => setMenuOpen(false)}>
                For hosts
              </a>
              <a href="#community" onClick={() => setMenuOpen(false)}>
                {copy.community}
              </a>
              <a href="/safety">Safety information</a>
              <a href="/faq">FAQs</a>

              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-lg border p-3"
                aria-label="Choose language"
              >
                {languages.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <a href="/login" className="font-semibold">
                {copy.login}
              </a>

              <a
                href="/register"
                className="rounded-full bg-amber-700 px-5 py-3 text-center font-semibold text-white"
              >
                {copy.join}
              </a>
            </div>
          </div>
        )}
      </header>

      {/* HERO SLIDESHOW */}
      <section className="relative flex min-h-[620px] items-center overflow-hidden md:min-h-[700px]">
        {slides.map((slide, index) => (
          <div
            key={slide.image}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              activeSlide === index ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        ))}

        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-24 text-white md:px-8">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-4 py-2 text-sm backdrop-blur">
              <Globe2 size={17} />
              Meaningful travel. Global connections.
            </div>

            <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl lg:text-7xl">
              {activeSlide === 0
                ? copy.headline
                : slides[activeSlide].title}
            </h1>

            <p className="mb-9 max-w-2xl text-lg leading-relaxed text-white/90 md:text-xl">
              {activeSlide === 0
                ? copy.intro
                : slides[activeSlide].subtitle}
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#search"
                className="inline-flex items-center gap-2 rounded-full bg-amber-600 px-7 py-4 font-bold text-white transition hover:bg-amber-700"
              >
                {copy.exploreButton}
                <ArrowRight size={19} />
              </a>

              <a
                href="/register?role=host"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white px-7 py-4 font-bold text-white transition hover:bg-white hover:text-gray-900"
              >
                {copy.hostButton}
              </a>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.image}
                onClick={() => setActiveSlide(index)}
                aria-label={`Show slide ${index + 1}`}
                className={`h-2.5 rounded-full transition-all ${
                  activeSlide === index ? "w-9 bg-amber-500" : "w-2.5 bg-white/70"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <section id="search" className="relative z-20 mx-auto -mt-10 max-w-6xl px-4">
        <div className="rounded-2xl bg-white p-5 shadow-2xl md:p-7">
          <div className="mb-5">
            <h2 className="text-2xl font-bold">Find your next experience</h2>
            <p className="mt-1 text-gray-500">
              Where would you like your journey to take you?
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Destination
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-3">
                <MapPin className="text-amber-700" size={20} />
                <input
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Country or destination"
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Type of exchange
              </label>
              <select
                value={exchangeType}
                onChange={(e) => setExchangeType(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none"
              >
                <option value="">All experiences</option>
                {categories.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={exploreOpportunities}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-700 px-5 py-3.5 font-bold text-white transition hover:bg-amber-800"
              >
                <Search size={19} />
                Search opportunities
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="mx-auto max-w-7xl px-5 py-20 text-center md:px-8">
        <span className="font-semibold uppercase tracking-widest text-amber-700">
          Welcome to Travailaway
        </span>
        <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-bold leading-tight md:text-5xl">
          More than travelling. It's about connecting with the world.
        </h2>
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-gray-600">
          Travailaway brings travellers and hosts together through cultural
          exchange, shared experiences, learning and meaningful connections.
          Discover places differently while becoming part of the communities
          you visit.
        </p>
      </section>

      {/* DESTINATIONS */}
      <section id="destinations" className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="font-semibold uppercase tracking-widest text-amber-700">
                Explore the world
              </span>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">
                Where will you go?
              </h2>
              <p className="mt-3 text-gray-600">
                Explore opportunities across six global regions.
              </p>
            </div>

            <a
              href="/explore"
              className="inline-flex items-center gap-2 font-semibold text-amber-800 hover:text-amber-900"
            >
              Explore all <ArrowRight size={18} />
            </a>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((place) => (
              <a
                key={place.name}
                href={`/explore?destination=${encodeURIComponent(place.name)}`}
                className="group relative h-72 overflow-hidden rounded-2xl shadow-md"
              >
                <img
                  src={place.image}
                  alt={place.name}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute bottom-0 p-7 text-white">
                  <h3 className="text-2xl font-bold">{place.name}</h3>
                  <p className="mt-2 text-white/90">{place.detail}</p>
                  <span className="mt-4 inline-flex items-center gap-2 font-semibold">
                    Discover opportunities <ArrowRight size={17} />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* EXCHANGE CATEGORIES */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="mb-12 text-center">
          <span className="font-semibold uppercase tracking-widest text-amber-700">
            Find your experience
          </span>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            Different ways to experience the world
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Whether you love nature, education, hospitality or community work,
            discover an exchange that matches your interests.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <button
                key={category.name}
                onClick={() => {
                  setActiveCategory(category.name);
                  window.location.href = `/explore?category=${encodeURIComponent(
                    category.name
                  )}`;
                }}
                className="group rounded-2xl border border-gray-200 p-5 text-left transition hover:-translate-y-1 hover:border-amber-500 hover:shadow-lg md:p-7"
              >
                <div className="mb-4 inline-flex rounded-xl bg-amber-50 p-3 text-amber-800 transition group-hover:bg-amber-700 group-hover:text-white">
                  <Icon size={27} />
                </div>
                <h3 className="font-bold leading-snug">{category.name}</h3>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-amber-800">
                  Explore <ArrowRight size={15} />
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-amber-50 py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-12 text-center">
            <span className="font-semibold uppercase tracking-widest text-amber-800">
              Simple and meaningful
            </span>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              How Travailaway works
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "Discover",
                description:
                  "Explore hosts, destinations and exchange opportunities that match your interests.",
                icon: Search,
              },
              {
                number: "02",
                title: "Connect",
                description:
                  "Create your profile, contact hosts and discuss your exchange before making plans.",
                icon: MessageCircle,
              },
              {
                number: "03",
                title: "Experience",
                description:
                  "Travel, share your skills, learn from others and create unforgettable memories.",
                icon: Compass,
              },
            ].map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="rounded-2xl bg-white p-8 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-4xl font-bold text-amber-200">
                      {step.number}
                    </span>
                    <Icon size={32} className="text-amber-700" />
                  </div>
                  <h3 className="mt-6 text-2xl font-bold">{step.title}</h3>
                  <p className="mt-3 leading-relaxed text-gray-600">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TRAVELLERS */}
      <section id="travellers" className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="overflow-hidden rounded-3xl">
            <img
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200"
              alt="Friends travelling together"
              className="h-[420px] w-full object-cover"
            />
          </div>

          <div>
            <span className="font-semibold uppercase tracking-widest text-amber-700">
              For travellers
            </span>
            <h2 className="mt-4 text-3xl font-bold md:text-5xl">
              Travel differently. Discover more.
            </h2>
            <p className="mt-6 leading-relaxed text-gray-600">
              Go beyond sightseeing. Find opportunities to experience local
              life, learn new skills, meet welcoming people and discover
              destinations through the eyes of their communities.
            </p>

            <ul className="mt-6 space-y-4">
              {[
                "Discover opportunities around the world",
                "Connect directly with hosts",
                "Experience different cultures",
                "Learn and share valuable skills",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <ShieldCheck
                    className="mt-0.5 shrink-0 text-amber-700"
                    size={20}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <a
              href="/register?role=traveller"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-amber-700 px-7 py-4 font-bold text-white hover:bg-amber-800"
            >
              Join as a traveller <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* HOSTS */}
      <section id="hosts" className="bg-gray-50 py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:grid-cols-2 md:px-8">
          <div className="order-2 md:order-1">
            <span className="font-semibold uppercase tracking-widest text-amber-700">
              For hosts
            </span>
            <h2 className="mt-4 text-3xl font-bold md:text-5xl">
              Welcome the world into your community.
            </h2>
            <p className="mt-6 leading-relaxed text-gray-600">
              Are you a farm, hostel, lodge, family, community organisation or
              project? Connect with travellers who want to contribute, learn
              and experience local life.
            </p>

            <ul className="mt-6 space-y-4">
              {[
                "Create a host profile",
                "Showcase your project and opportunities",
                "Connect with travellers from different countries",
                "Build meaningful cultural relationships",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Heart
                    className="mt-0.5 shrink-0 text-amber-700"
                    size={20}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <a
              href="/register?role=host"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-amber-700 px-7 py-4 font-bold text-white hover:bg-amber-800"
            >
              Become a host <ArrowRight size={18} />
            </a>
          </div>

          <div className="order-1 overflow-hidden rounded-3xl md:order-2">
            <img
              src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200"
              alt="People sharing a community experience"
              className="h-[420px] w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* COMMUNITY */}
      <section id="community" className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="mb-12 text-center">
          <span className="font-semibold uppercase tracking-widest text-amber-700">
            Beyond the exchange
          </span>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            Be part of a global community
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Travailaway is about the people you meet and the connections you
            create along the way.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Travel mates",
              description:
                "Meet other travellers, share experiences and discover journeys together.",
              icon: Users,
            },
            {
              title: "Language exchange",
              description:
                "Learn languages through real conversations and cultural connections.",
              icon: Languages,
            },
            {
              title: "Local events",
              description:
                "Discover activities, meetups and experiences in communities around the world.",
              icon: CalendarDays,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-gray-200 p-8"
              >
                <Icon size={34} className="text-amber-700" />
                <h3 className="mt-5 text-xl font-bold">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-gray-600">
                  {item.description}
                </p>
                <span className="mt-5 inline-block rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800">
                  Coming soon
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* OUR STORY */}
      <section className="bg-amber-50 py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <span className="font-semibold uppercase tracking-widest text-amber-800">
                Our vision
              </span>
              <h2 className="mt-4 text-3xl font-bold md:text-5xl">
                A world connected through experiences.
              </h2>
              <p className="mt-6 leading-relaxed text-gray-700">
                We believe travel should create more than photographs. It
                should build understanding, friendships and opportunities.
                Travailaway aims to bring people together across borders
                through meaningful cultural exchange.
              </p>
              <a
                href="/about"
                className="mt-8 inline-flex items-center gap-2 font-bold text-amber-900"
              >
                Learn about us <ArrowRight size={18} />
              </a>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800"
                alt="Nature and wildlife"
                className="h-64 w-full rounded-2xl object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800"
                alt="People working together"
                className="mt-10 h-64 w-full rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SAFETY */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="rounded-3xl bg-gray-900 p-8 text-white md:p-12">
          <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-amber-400" size={32} />
                <span className="font-semibold uppercase tracking-widest text-amber-300">
                  Safety matters
                </span>
              </div>
              <h2 className="mt-5 text-3xl font-bold md:text-4xl">
                Travel with awareness. Connect with confidence.
              </h2>
              <p className="mt-5 max-w-2xl leading-relaxed text-gray-300">
                Take time to communicate with hosts, understand exchange
                arrangements, research destinations and make informed travel
                decisions. Always follow local laws and trust your judgement.
              </p>
            </div>

            <a
              href="/safety"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-600 px-7 py-4 font-bold text-white hover:bg-amber-700"
            >
              Visit safety centre <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-4xl px-5 md:px-8">
          <div className="mb-10 text-center">
            <span className="font-semibold uppercase tracking-widest text-amber-700">
              Need to know?
            </span>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Frequently asked questions
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "What is Travailaway?",
                a: "Travailaway is a platform designed to connect travellers and hosts through cultural exchange, shared experiences and opportunities to learn.",
              },
              {
                q: "Who can become a host?",
                a: "Families, farms, hostels, lodges, NGOs, community projects and other suitable hosts can apply to create a profile.",
              },
              {
                q: "Can I travel to another country?",
                a: "You can explore opportunities internationally, but you are responsible for checking visa, immigration and entry requirements before travelling.",
              },
              {
                q: "Do I need experience to join?",
                a: "Requirements depend on each host and opportunity. Read each listing carefully before making contact.",
              },
              {
                q: "How do I contact a host?",
                a: "Create an account, explore available opportunities and follow the contact instructions provided on the platform.",
              },
              {
                q: "Is Travailaway a travel agency?",
                a: "Travailaway is a connection platform. Travellers and hosts must discuss and agree on their own exchange arrangements.",
              },
            ].map((faq) => (
              <details
                key={faq.q}
                className="group rounded-xl border border-gray-200 bg-white p-5"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                  {faq.q}
                  <ChevronDown className="shrink-0 text-amber-700 transition group-open:rotate-180" />
                </summary>
                <p className="mt-4 leading-relaxed text-gray-600">{faq.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-8 text-center">
            <a
              href="/faq"
              className="font-bold text-amber-800 hover:text-amber-900"
            >
              Visit our information centre →
            </a>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden bg-amber-800 py-20 text-center text-white">
        <div className="relative z-10 mx-auto max-w-4xl px-5">
          <Star className="mx-auto text-amber-300" size={38} />
          <h2 className="mt-6 text-3xl font-bold md:text-5xl">
            Your next great experience starts here.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/90">
            Join a growing world of travellers and hosts discovering the value
            of meaningful connections.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="/register"
              className="rounded-full bg-white px-8 py-4 font-bold text-amber-900 hover:bg-amber-50"
            >
              Join Travailaway
            </a>
            <a
              href="/explore"
              className="rounded-full border-2 border-white px-8 py-4 font-bold text-white hover:bg-white hover:text-amber-900"
            >
              Explore opportunities
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-950 py-14 text-gray-300">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:grid-cols-2 lg:grid-cols-4 md:px-8">
          <div>
            <a href="/">
              <img
                src={logo}
                alt="Travailaway"
                className="mb-5 h-20 w-auto max-w-[240px] object-contain"
              />
            </a>
            <p className="max-w-xs leading-relaxed text-gray-400">
              Travel. Connect. Experience. Discover the world through
              meaningful cultural exchange.
            </p>
          </div>

          <div>
            <h3 className="mb-5 font-bold text-white">Discover</h3>
            <ul className="space-y-3">
              <li><a href="/explore" className="hover:text-amber-400">Explore opportunities</a></li>
              <li><a href="#destinations" className="hover:text-amber-400">Destinations</a></li>
              <li><a href="#categories" className="hover:text-amber-400">Exchange categories</a></li>
              <li><a href="#community" className="hover:text-amber-400">Community</a></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 font-bold text-white">Join us</h3>
            <ul className="space-y-3">
              <li><a href="/register?role=traveller" className="hover:text-amber-400">Become a traveller</a></li>
              <li><a href="/register?role=host" className="hover:text-amber-400">Become a host</a></li>
              <li><a href="/login" className="hover:text-amber-400">Log in</a></li>
              <li><a href="/register" className="hover:text-amber-400">Create an account</a></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 font-bold text-white">Information</h3>
            <ul className="space-y-3">
              <li><a href="/about" className="hover:text-amber-400">About us</a></li>
              <li><a href="/safety" className="hover:text-amber-400">Safety centre</a></li>
              <li><a href="/faq" className="hover:text-amber-400">FAQs</a></li>
              <li><a href="/contact" className="hover:text-amber-400">Contact</a></li>
              <li><a href="/terms" className="hover:text-amber-400">Terms of service</a></li>
              <li><a href="/privacy" className="hover:text-amber-400">Privacy policy</a></li>
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-7xl border-t border-gray-800 px-5 pt-7 text-center text-sm text-gray-500 md:px-8">
          <p>
            © {new Date().getFullYear()} Travailaway. All rights reserved.
          </p>
          <p className="mt-2">
            A project by Molongi Investments Company SMC Limited.
          </p>
        </div>
      </footer>
    </main>
  );
}
