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
  "https://sbgfaplqdxejirqfqfpn.supabase.co/storage/v1/object/public/homepage-images/omar-ramadan-y_OLIOot4VU-unsplash.jpg",
  "https://sbgfaplqdxejirqfqfpn.supabase.co/storage/v1/object/public/homepage-images/elya-foll-u9ZSmQNuhuw-unsplash.jpg",
  "https://sbgfaplqdxejirqfqfpn.supabase.co/storage/v1/object/public/homepage-images/duy-pham-Cecb0_8Hx-o-unsplash%20(1).jpg",
  "https://sbgfaplqdxejirqfqfpn.supabase.co/storage/v1/object/public/homepage-images/chermiti-mohamed-CD2Y9kMmCIQ-unsplash.jpg",
  "https://sbgfaplqdxejirqfqfpn.supabase.co/storage/v1/object/public/homepage-images/alexander-schimmeck-MraFXV3v7Ts-unsplash.jpg",
];

const destinations = [
  {
    name: "Africa",
    detail: "Connect with communities and nature",
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=900",
  },
  {
    name: "Europe",
    detail: "Discover culture and new experiences",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=900",
  },
  {
    name: "Asia",
    detail: "Experience traditions and hospitality",
    image: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=900",
  },
  {
    name: "North America",
    detail: "Explore iconic cities and landscapes",
    image: "https://images.unsplash.com/photo-1556146385-97d8a0b5e66b?w=900",
  },
  {
    name: "South America",
    detail: "Discover ancient wonders and adventure",
    image: "https://images.unsplash.com/photo-1578746401323-f997c71f4096?w=900",
  },
  {
    name: "Central America",
    detail: "Explore colourful towns and cultures",
    image: "https://images.unsplash.com/photo-1628128594359-25d5e30661dd?w=900",
  },
  {
    name: "Oceania",
    detail: "Experience islands and coastal beauty",
    image: "https://images.unsplash.com/photo-1596428025491-662bbaf50351?w=900",
  },
];

const categories = [
  { title: "Farmstays & gardening", icon: Sprout, text: "Learn about growing, harvesting and life close to the land." },
  { title: "Hostels & guesthouses", icon: Home, text: "Join welcoming teams and meet travellers from everywhere." },
  { title: "Hotels & lodges", icon: Compass, text: "Discover hospitality and the places that make travel special." },
  { title: "NGOs & charities", icon: HandHeart, text: "Support community-led initiatives and meaningful causes." },
  { title: "Families & homestays", icon: Users, text: "Experience everyday life, traditions and local culture." },
  { title: "House & pet sitting", icon: PawPrint, text: "Care for homes and animals while discovering somewhere new." },
  { title: "Teaching & education", icon: GraduationCap, text: "Share knowledge, practise languages and learn together." },
  { title: "Environment & conservation", icon: Leaf, text: "Take part in projects that care for nature and wildlife." },
  { title: "Animal care", icon: PawPrint, text: "Help care for animals through responsible local projects." },
  { title: "Construction & renovation", icon: Home, text: "Contribute practical skills to suitable community projects." },
  { title: "Community development", icon: HandHeart, text: "Connect with people working to strengthen their communities." },
  { title: "Arts & culture", icon: Palette, text: "Exchange creativity, stories, music and cultural traditions." },
  { title: "Boats & sailing", icon: Sailboat, text: "Discover life on the water and maritime experiences." },
  { title: "Eco-tourism", icon: Globe2, text: "Explore thoughtful travel and locally rooted experiences." },
];

const languages = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
  { code: "pt", label: "Português" },
  { code: "de", label: "Deutsch" },
  { code: "it", label: "Italiano" },
  { code: "nl", label: "Nederlands" },
  { code: "ar", label: "العربية" },
  { code: "zh", label: "简体中文" },
  { code: "ru", label: "Русский" },
  { code: "sw", label: "Kiswahili" },
];

const languageCopy: Record<string, {
  explore: string;
  how: string;
  community: string;
  login: string;
  join: string;
  headline: string;
  intro: string;
  exploreButton: string;
  hostButton: string;
}> = {
  en: {
    explore: "Explore",
    how: "How it works",
    community: "Community",
    login: "Log in",
    join: "Join Travailaway",
    headline: "Discover Places. Share Experiences. Belong Anywhere.",
    intro: "Connect with welcoming hosts, discover new cultures and create unforgettable experiences wherever your journey takes you.",
    exploreButton: "Explore opportunities",
    hostButton: "Become a host",
  },
  fr: {
    explore: "Explorer",
    how: "Comment ça marche",
    community: "Communauté",
    login: "Connexion",
    join: "Rejoindre Travailaway",
    headline: "Découvrez des lieux. Partagez des expériences. Sentez-vous chez vous partout.",
    intro: "Rencontrez des hôtes accueillants, découvrez de nouvelles cultures et vivez des expériences inoubliables.",
    exploreButton: "Voir les opportunités",
    hostButton: "Devenir hôte",
  },
  es: {
    explore: "Explorar",
    how: "Cómo funciona",
    community: "Comunidad",
    login: "Iniciar sesión",
    join: "Únete a Travailaway",
    headline: "Descubre lugares. Comparte experiencias. Siéntete en casa en cualquier lugar.",
    intro: "Conecta con anfitriones acogedores, descubre nuevas culturas y crea recuerdos inolvidables.",
    exploreButton: "Explorar oportunidades",
    hostButton: "Ser anfitrión",
  },
  pt: {
    explore: "Explorar",
    how: "Como funciona",
    community: "Comunidade",
    login: "Entrar",
    join: "Junte-se à Travailaway",
    headline: "Descubra lugares. Partilhe experiências. Sinta-se em casa em qualquer lugar.",
    intro: "Conheça anfitriões acolhedores, descubra novas culturas e viva experiências inesquecíveis.",
    exploreButton: "Explorar oportunidades",
    hostButton: "Tornar-se anfitrião",
  },
  de: {
    explore: "Entdecken",
    how: "So funktioniert es",
    community: "Community",
    login: "Anmelden",
    join: "Travailaway beitreten",
    headline: "Orte entdecken. Erfahrungen teilen. Überall dazugehören.",
    intro: "Lerne gastfreundliche Gastgeber kennen, entdecke neue Kulturen und sammle unvergessliche Erfahrungen.",
    exploreButton: "Möglichkeiten entdecken",
    hostButton: "Gastgeber werden",
  },
  it: {
    explore: "Esplora",
    how: "Come funziona",
    community: "Comunità",
    login: "Accedi",
    join: "Unisciti a Travailaway",
    headline: "Scopri luoghi. Condividi esperienze. Sentiti a casa ovunque.",
    intro: "Connettiti con ospiti accoglienti, scopri nuove culture e crea ricordi indimenticabili.",
    exploreButton: "Esplora opportunità",
    hostButton: "Diventa host",
  },
  nl: {
    explore: "Ontdekken",
    how: "Hoe het werkt",
    community: "Gemeenschap",
    login: "Inloggen",
    join: "Word lid van Travailaway",
    headline: "Ontdek plekken. Deel ervaringen. Voel je overal thuis.",
    intro: "Ontmoet gastvrije hosts, ontdek nieuwe culturen en beleef onvergetelijke ervaringen.",
    exploreButton: "Bekijk mogelijkheden",
    hostButton: "Word host",
  },
  ar: {
    explore: "استكشف",
    how: "كيف تعمل",
    community: "المجتمع",
    login: "تسجيل الدخول",
    join: "انضم إلى Travailaway",
    headline: "اكتشف أماكن جديدة. شارك التجارب. اشعر بالانتماء أينما كنت.",
    intro: "تواصل مع مضيفين مرحبين، واكتشف ثقافات جديدة، واصنع ذكريات لا تُنسى.",
    exploreButton: "استكشف الفرص",
    hostButton: "كن مضيفاً",
  },
  zh: {
    explore: "探索",
    how: "运作方式",
    community: "社区",
    login: "登录",
    join: "加入 Travailaway",
    headline: "探索世界，分享体验，无论身在何处都找到归属。",
    intro: "结识热情好客的房东，发现不同文化，创造难忘的旅行体验。",
    exploreButton: "探索机会",
    hostButton: "成为房东",
  },
  ru: {
    explore: "Исследовать",
    how: "Как это работает",
    community: "Сообщество",
    login: "Войти",
    join: "Присоединиться к Travailaway",
    headline: "Открывайте места. Делитесь опытом. Чувствуйте себя как дома везде.",
    intro: "Знакомьтесь с гостеприимными хозяевами, открывайте новые культуры и создавайте незабываемые воспоминания.",
    exploreButton: "Найти возможности",
    hostButton: "Стать хозяином",
  },
  sw: {
    explore: "Gundua",
    how: "Jinsi inavyofanya kazi",
    community: "Jumuiya",
    login: "Ingia",
    join: "Jiunge na Travailaway",
    headline: "Gundua maeneo. Shiriki uzoefu. Jisikie nyumbani popote.",
    intro: "Kutana na wenyeji wakarimu, gundua tamaduni mpya na tengeneza kumbukumbu zisizosahaulika.",
    exploreButton: "Gundua fursa",
    hostButton: "Kuwa mwenyeji",
  },
};export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [language, setLanguage] = useState("en");
  const [destination, setDestination] = useState("");
  const [exchangeType, setExchangeType] = useState("All experiences");
  const [activeCategory, setActiveCategory] = useState("All");

  const copy = languageCopy[language] || languageCopy.en;
  const isArabic = language === "ar";

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("travailaway-language");
    if (savedLanguage && languageCopy[savedLanguage]) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("travailaway-language", language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, []);

  const exploreOpportunities = () => {
    setActiveCategory(exchangeType === "All experiences" ? "All" : exchangeType);
    document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-800">
      <header className="absolute z-40 w-full">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10">
          <a href="/" className="flex items-center">
            <img src={logo} alt="Travailaway" className="h-12 w-auto md:h-14" />
          </a>

          <nav className="hidden items-center gap-6 text-sm font-semibold text-white lg:flex">
            <a href="#explore" className="transition hover:text-yellow-300">
              {copy.explore}
            </a>

            <a href="#how-it-works" className="transition hover:text-yellow-300">
              {copy.how}
            </a>

            <div className="relative">
              <button
                onClick={() => setInfoOpen(!infoOpen)}
                className="flex items-center gap-1 transition hover:text-yellow-300"
              >
                Information Centre <ChevronDown size={15} />
              </button>

              {infoOpen && (
                <div className="absolute left-0 top-9 w-64 rounded-xl bg-white p-3 text-slate-800 shadow-2xl">
                  <a href="#travellers" className="block rounded-lg p-3 hover:bg-slate-100">
                    <strong>For travellers</strong>
                    <span className="mt-1 block text-xs text-slate-500">
                      Discover exchanges and prepare your journey.
                    </span>
                  </a>
                  <a href="#hosts" className="block rounded-lg p-3 hover:bg-slate-100">
                    <strong>For hosts</strong>
                    <span className="mt-1 block text-xs text-slate-500">
                      Welcome travellers and share your opportunity.
                    </span>
                  </a>
                  <a href="#safety" className="block rounded-lg p-3 hover:bg-slate-100">
                    <strong>Safety and trust</strong>
                    <span className="mt-1 block text-xs text-slate-500">
                      Read important travel and community guidance.
                    </span>
                  </a>
                  <a href="#faq" className="block rounded-lg p-3 hover:bg-slate-100">
                    <strong>Frequently asked questions</strong>
                  </a>
                </div>
              )}
            </div>

            <a href="#community" className="transition hover:text-yellow-300">
              {copy.community}
            </a>

            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              aria-label="Choose language"
              className="max-w-28 rounded-lg border border-white/40 bg-slate-900/50 px-2 py-2 text-white outline-none"
            >
              {languages.map((item) => (
                <option key={item.code} value={item.code} className="bg-white text-slate-900">
                  {item.label}
                </option>
              ))}
            </select>

            <a href="/login" className="transition hover:text-yellow-300">
              {copy.login}
            </a>

            <a
              href="/register"
              className="rounded-full bg-yellow-400 px-5 py-3 font-bold text-slate-900 transition hover:bg-yellow-300"
            >
              {copy.join}
            </a>
          </nav>

          <button
            className="text-white lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {menuOpen && (
          <nav className="mx-4 rounded-2xl bg-white p-5 text-slate-800 shadow-2xl lg:hidden">
            <div className="flex flex-col gap-4">
              <a href="#explore" onClick={() => setMenuOpen(false)}>{copy.explore}</a>
              <a href="#how-it-works" onClick={() => setMenuOpen(false)}>{copy.how}</a>
              <a href="#travellers" onClick={() => setMenuOpen(false)}>For travellers</a>
              <a href="#hosts" onClick={() => setMenuOpen(false)}>For hosts</a>
              <a href="#community" onClick={() => setMenuOpen(false)}>{copy.community}</a>
              <a href="#safety" onClick={() => setMenuOpen(false)}>Safety and trust</a>

              <label className="text-sm font-semibold">
                Language
                <select
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 p-3"
                >
                  {languages.map((item) => (
                    <option key={item.code} value={item.code}>{item.label}</option>
                  ))}
                </select>
              </label>

              <a href="/login" className="font-semibold">{copy.login}</a>
              <a href="/register" className="rounded-full bg-yellow-400 px-5 py-3 text-center font-bold">
                {copy.join}
              </a>
            </div>
          </nav>
        )}
      </header>

      <section className="relative flex min-h-[720px] items-center overflow-hidden bg-slate-900 md:min-h-[790px]">
        {slides.map((slide, index) => (
          <img
            key={slide}
            src={slide}
            alt="Travellers discovering new places and cultures"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              activeSlide === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />

        <div className={`relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 pt-36 text-white md:px-12 ${isArabic ? "text-right" : "text-left"}`}>
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.25em] text-yellow-300">
            Travel. Connect. Experience.
          </p>

          <h1 className="max-w-4xl text-4xl font-extrabold leading-tight md:text-6xl lg:text-7xl">
            {copy.headline}
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/90 md:text-xl">
            {copy.intro}
          </p>

          <div className={`mt-9 flex flex-wrap gap-4 ${isArabic ? "justify-start" : "justify-start"}`}>
            <a
              href="#explore"
              className="rounded-full bg-yellow-400 px-7 py-4 font-bold text-slate-900 transition hover:bg-yellow-300"
            >
              {copy.exploreButton} <ArrowRight className="ml-2 inline" size={18} />
            </a>

            <a
              href="/register"
              className="rounded-full border border-white/80 px-7 py-4 font-bold text-white transition hover:bg-white/15"
            >
              {copy.hostButton}
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

      <section className="relative z-20 mx-auto -mt-12 max-w-6xl px-5">
        <div className="grid gap-3 rounded-2xl bg-white p-5 shadow-2xl md:grid-cols-[1fr_1fr_auto] md:p-7">
          <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
            <MapPin className="shrink-0 text-emerald-700" />
            <span className="min-w-0 flex-1">
              <span className="block text-xs text-slate-500">Where do you want to go?</span>
              <input
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
                placeholder="Enter a country or destination"
                className="mt-1 w-full bg-transparent font-medium outline-none placeholder:font-normal placeholder:text-slate-400"
              />
            </span>
          </label>

          <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
            <Compass className="shrink-0 text-emerald-700" />
            <span className="min-w-0 flex-1">
              <span className="block text-xs text-slate-500">What are you looking for?</span>
              <select
                value={exchangeType}
                onChange={(event) => setExchangeType(event.target.value)}
                className="mt-1 w-full bg-transparent font-medium outline-none"
              >
                <option>All experiences</option>
                {categories.map((category) => (
                  <option key={category.title}>{category.title}</option>
                ))}
              </select>
            </span>
          </label>

          <button
            onClick={exploreOpportunities}
            className="rounded-xl bg-emerald-800 px-8 py-4 font-bold text-white transition hover:bg-emerald-700"
          >
            <Search className="mr-2 inline" size={18} /> Explore
          </button>
        </div>
      </section>      <section id="explore" className="mx-auto max-w-7xl px-6 py-24 md:px-12">
        <div className="mb-12 text-center">
          <p className="font-bold uppercase tracking-widest text-emerald-700">
            The world is waiting
          </p>
          <h2 className="mt-3 text-3xl font-extrabold md:text-5xl">
            Where will your journey take you?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-slate-600">
            Discover destinations, connect with welcoming hosts and find
            opportunities to experience everyday life in different cultures.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((destination) => (
            <a
              key={destination.name}
              href={`/register`}
              className="group relative h-80 overflow-hidden rounded-2xl"
            >
              <img
                src={destination.image}
                alt={destination.name}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute bottom-7 left-7 text-white">
                <h3 className="text-3xl font-extrabold">{destination.name}</h3>
                <p className="mt-2 text-sm text-white/90">{destination.detail}</p>
                <span className="mt-4 inline-flex items-center font-semibold text-yellow-300">
                  Discover opportunities <ArrowRight className="ml-2" size={17} />
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="font-bold uppercase tracking-widest text-emerald-700">
              Find your kind of experience
            </p>
            <h2 className="mt-3 text-3xl font-extrabold md:text-5xl">
              Explore exchange opportunities
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-slate-600">
              From farms and family homes to conservation projects and
              community initiatives, discover different ways to connect.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => {
              const CategoryIcon = category.icon;

              return (
                <a
                  key={category.title}
                  href="/register"
                  className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800 transition group-hover:bg-emerald-800 group-hover:text-white">
                    <CategoryIcon size={25} />
                  </div>
                  <h3 className="mt-5 text-lg font-bold">{category.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {category.text}
                  </p>
                  <span className="mt-5 inline-flex items-center text-sm font-bold text-emerald-800">
                    Explore <ArrowRight className="ml-2" size={16} />
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="px-6 py-24 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="font-bold uppercase tracking-widest text-emerald-700">
              Your journey begins here
            </p>
            <h2 className="mt-3 text-3xl font-extrabold md:text-5xl">
              How Travailaway works
            </h2>
          </div>

          <div className="mt-16 grid gap-12 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                <Search size={34} />
              </div>
              <h3 className="mt-6 text-xl font-bold">1. Discover</h3>
              <p className="mt-3 leading-relaxed text-slate-600">
                Explore destinations, find hosts and discover opportunities
                that match your interests.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                <MessageCircle size={34} />
              </div>
              <h3 className="mt-6 text-xl font-bold">2. Connect</h3>
              <p className="mt-3 leading-relaxed text-slate-600">
                Get to know hosts, ask questions and discuss the details
                before arranging an exchange.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                <Heart size={34} />
              </div>
              <h3 className="mt-6 text-xl font-bold">3. Experience</h3>
              <p className="mt-3 leading-relaxed text-slate-600">
                Share skills, discover cultures and create meaningful
                memories along the way.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="travellers" className="bg-emerald-950 px-6 py-24 text-white md:px-12">
        <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
          <div>
            <p className="font-bold uppercase tracking-widest text-yellow-300">
              More than just a trip
            </p>
            <h2 className="mt-4 text-3xl font-extrabold md:text-5xl">
              Travel differently. Connect more deeply.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-emerald-100">
              Meet people beyond the usual tourist routes. Discover local
              traditions, exchange skills and become part of experiences
              that make every journey special.
            </p>
            <a
              href="/register"
              className="mt-8 inline-flex items-center rounded-full bg-yellow-400 px-7 py-4 font-bold text-slate-900 hover:bg-yellow-300"
            >
              Start your journey <ArrowRight className="ml-2" size={18} />
            </a>
          </div>

          <div className="overflow-hidden rounded-3xl">
            <img
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200"
              alt="Friends sharing a travel experience"
              className="h-[420px] w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section id="hosts" className="px-6 py-24 md:px-12">
        <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
          <div className="overflow-hidden rounded-3xl">
            <img
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200"
              alt="People working together on a shared project"
              className="h-[420px] w-full object-cover"
            />
          </div>

          <div>
            <p className="font-bold uppercase tracking-widest text-emerald-700">
              Open your doors to the world
            </p>
            <h2 className="mt-4 text-3xl font-extrabold md:text-5xl">
              Become a host. Share what makes your place special.
            </h2>
            <p className="mt-6 leading-relaxed text-slate-600">
              Welcome travellers, share your culture, exchange knowledge and
              introduce people to your community. Whether you run a guesthouse,
              a farm, a family homestay or a community project, your story
              deserves to be discovered.
            </p>
            <a
              href="/register"
              className="mt-8 inline-flex items-center rounded-full bg-emerald-800 px-7 py-4 font-bold text-white hover:bg-emerald-700"
            >
              Become a host <ArrowRight className="ml-2" size={18} />
            </a>
          </div>
        </div>
      </section>

      <section id="community" className="bg-slate-50 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="font-bold uppercase tracking-widest text-emerald-700">
              A world of connections
            </p>
            <h2 className="mt-3 text-3xl font-extrabold md:text-5xl">
              More ways to connect
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-slate-600">
              Travailaway is about the people you meet, the knowledge you
              exchange and the communities you discover.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-7 shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                <Users size={28} />
              </div>
              <h3 className="mt-5 text-xl font-bold">Travel Mates</h3>
              <p className="mt-3 leading-relaxed text-slate-600">
                Meet other adult travellers, discover shared interests and
                explore the possibility of travelling together.
              </p>
              <span className="mt-5 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                Coming soon
              </span>
            </div>

            <div className="rounded-2xl bg-white p-7 shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                <Languages size={28} />
              </div>
              <h3 className="mt-5 text-xl font-bold">Language exchange</h3>
              <p className="mt-3 leading-relaxed text-slate-600">
                Practise languages, learn expressions and connect with people
                from different backgrounds.
              </p>
              <span className="mt-5 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                Coming soon
              </span>
            </div>

            <div className="rounded-2xl bg-white p-7 shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                <CalendarDays size={28} />
              </div>
              <h3 className="mt-5 text-xl font-bold">Local events</h3>
              <p className="mt-3 leading-relaxed text-slate-600">
                Discover cultural gatherings, community activities and
                experiences shared by members.
              </p>
              <span className="mt-5 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                Coming soon
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <p className="font-bold uppercase tracking-widest text-emerald-700">
                Stories that bring us together
              </p>
              <h2 className="mt-4 text-3xl font-extrabold md:text-5xl">
                Every journey has a story.
              </h2>
              <p className="mt-6 leading-relaxed text-slate-600">
                Discover travel inspiration, cultural perspectives and
                stories about the people and places that make the world
                extraordinary.
              </p>
              <a
                href="/register"
                className="mt-8 inline-flex items-center font-bold text-emerald-800 hover:text-emerald-600"
              >
                Be part of the community <ArrowRight className="ml-2" size={18} />
              </a>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800"
                alt="Beautiful natural landscape"
                className="h-64 w-full rounded-2xl object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800"
                alt="People enjoying time together"
                className="mt-10 h-64 w-full rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="safety" className="bg-slate-50 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <ShieldCheck className="mx-auto text-emerald-800" size={42} />
            <p className="mt-5 font-bold uppercase tracking-widest text-emerald-700">
              Safety matters
            </p>
            <h2 className="mt-3 text-3xl font-extrabold md:text-5xl">
              Build connections with care.
            </h2>
            <p className="mt-5 leading-relaxed text-slate-600">
              Good experiences begin with informed decisions. Take time to
              communicate, understand exchange arrangements and make choices
              that feel right for you.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-7">
              <ShieldCheck className="text-emerald-800" size={30} />
              <h3 className="mt-4 text-lg font-bold">Know who you connect with</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Read profiles carefully, ask questions and confirm important
                details directly before making arrangements.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-7">
              <MessageCircle className="text-emerald-800" size={30} />
              <h3 className="mt-4 text-lg font-bold">Communicate clearly</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Discuss expectations, duties, accommodation, meals, dates
                and any costs before agreeing to an exchange.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-7">
              <Heart className="text-emerald-800" size={30} />
              <h3 className="mt-4 text-lg font-bold">Respect each other</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Respect boundaries, local laws, cultural differences and
                the right of every person to feel safe.
              </p>
            </div>
          </div>

          <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-slate-500">
            Travailaway is developing its community and safety features.
            These general guidelines are not a guarantee of identity,
            accommodation quality, personal safety or travel arrangements.
            Always make independent checks before travelling.
          </p>
        </div>
      </section>

      <section id="faq" className="px-6 py-24 md:px-12">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="font-bold uppercase tracking-widest text-emerald-700">
              Need to know more?
            </p>
            <h2 className="mt-3 text-3xl font-extrabold md:text-5xl">
              Frequently asked questions
            </h2>
          </div>

          <div className="mt-12 space-y-4">
            {[
              {
                question: "What is Travailaway?",
                answer: "Travailaway is a platform designed to connect travellers and hosts for cultural exchange, shared experiences and opportunities to learn from one another.",
              },
              {
                question: "Who can become a host?",
                answer: "Individuals, families, farms, guesthouses, lodges, organisations and community projects can explore joining as hosts, subject to the platform's registration and policies.",
              },
              {
                question: "How do I find an opportunity?",
                answer: "Explore the destinations and experience categories, create an account and look for opportunities that match your interests.",
              },
              {
                question: "Are Travel Mates available now?",
                answer: "The Travel Mates feature is planned for a future release. It is not yet available for creating profiles or sending connection requests.",
              },
              {
                question: "Does Travailaway guarantee an exchange?",
                answer: "No. Travellers and hosts must communicate directly and agree on the details. Always check arrangements carefully before making travel plans.",
              },
              {
                question: "Can I use Travailaway in another language?",
                answer: "The homepage includes a language selector. More translated pages and platform features are planned as the service develops.",
              },
            ].map((item) => (
              <details key={item.question} className="group rounded-xl border border-slate-200 bg-white p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                  {item.question}
                  <ChevronDown className="shrink-0 text-emerald-800 transition group-open:rotate-180" />
                </summary>
                <p className="mt-4 leading-relaxed text-slate-600">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-emerald-900 px-6 py-20 text-center text-white md:px-12">
        <Globe2 className="mx-auto text-yellow-300" size={42} />
        <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-extrabold md:text-5xl">
          Your next meaningful journey starts here.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-emerald-100">
          Meet people, exchange experiences and discover a world of
          possibilities with Travailaway.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href="/register"
            className="rounded-full bg-yellow-400 px-8 py-4 font-bold text-slate-900 hover:bg-yellow-300"
          >
            Join Travailaway <ArrowRight className="ml-2 inline" size={18} />
          </a>
          <a
            href="/login"
            className="rounded-full border border-white/70 px-8 py-4 font-bold text-white hover:bg-white/10"
          >
            Log in
          </a>
        </div>
      </section>

      <footer className="bg-slate-950 px-6 py-14 text-white md:px-12">
        <div className="mx-auto grid max-w-7xl gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <img src={logo} alt="Travailaway" className="h-12 w-auto" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              Travel. Connect. Experience. Discover a world of cultural
              exchange and meaningful connections.
            </p>
          </div>

          <div>
            <h3 className="font-bold">Discover</h3>
            <div className="mt-5 flex flex-col gap-3 text-sm text-slate-400">
              <a href="#explore" className="hover:text-yellow-300">Explore destinations</a>
              <a href="#explore" className="hover:text-yellow-300">Exchange categories</a>
              <a href="#community" className="hover:text-yellow-300">Community</a>
              <a href="#how-it-works" className="hover:text-yellow-300">How it works</a>
            </div>
          </div>

          <div>
            <h3 className="font-bold">Join Travailaway</h3>
            <div className="mt-5 flex flex-col gap-3 text-sm text-slate-400">
              <a href="/register" className="hover:text-yellow-300">Join as a traveller</a>
              <a href="/register" className="hover:text-yellow-300">Become a host</a>
              <a href="/login" className="hover:text-yellow-300">Log in</a>
              <a href="#faq" className="hover:text-yellow-300">FAQs</a>
            </div>
          </div>

          <div>
            <h3 className="font-bold">Information</h3>
            <div className="mt-5 flex flex-col gap-3 text-sm text-slate-400">
              <a href="#safety" className="hover:text-yellow-300">Safety guidance</a>
              <a href="#travellers" className="hover:text-yellow-300">For travellers</a>
              <a href="#hosts" className="hover:text-yellow-300">For hosts</a>
              <a href="#community" className="hover:text-yellow-300">Our community</a>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 flex max-w-7xl flex-col justify-between gap-4 border-t border-white/10 pt-7 text-xs text-slate-500 md:flex-row">
          <p>
            © {new Date().getFullYear()} Travailaway. All rights reserved.
          </p>
          <p>
            An initiative by Molongi Investments Company SMC Limited.
          </p>
        </div>
      </footer>
    </main>
  );
}
