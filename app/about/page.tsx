import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

/*
  PHOTO CREDITS (real photographs, free licences)
  1. Hero: "a multicultural lunch or dinner with friends around a welcome table"
     DJ Paine, Unsplash (Unsplash License)
     https://unsplash.com/photos/a-group-of-people-sitting-around-a-table-eating-food-G4QFpOsoS7w
  2. Why we exist: "A multiracial couple works on their farm in rural Washington state"
     Land O'Lakes, Inc., Unsplash (Unsplash License)
     https://unsplash.com/photos/two-people-working-with-a-laptop-outside-greenhouse-JUivXruBs2U
  3. More than a journey: "African woman carrying a basin in a vibrant field"
     Safari Consoler, Pexels (Pexels License)
     https://www.pexels.com/photo/woman-working-on-a-plantation-18970098/
*/

const PHOTOS = {
  hero: {
    src: "https://images.unsplash.com/photo-1721180672399-0ff1a0d96abc?auto=format&fit=crop&w=1800&q=70",
    alt: "Friends from different backgrounds sharing a meal around a long welcome table",
    credit: "DJ Paine",
    source: "Unsplash",
    href: "https://unsplash.com/photos/a-group-of-people-sitting-around-a-table-eating-food-G4QFpOsoS7w",
  },
  farm: {
    src: "https://images.unsplash.com/photo-1761839258575-038fef381ee7?auto=format&fit=crop&w=1200&q=70",
    alt: "A couple working together on a farm",
    credit: "Land O'Lakes, Inc.",
    source: "Unsplash",
    href: "https://unsplash.com/photos/two-people-working-with-a-laptop-outside-greenhouse-JUivXruBs2U",
  },
  field: {
    src: "https://images.pexels.com/photos/18970098/pexels-photo-18970098.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "A woman carrying a basin through a green field",
    credit: "Safari Consoler",
    source: "Pexels",
    href: "https://www.pexels.com/photo/woman-working-on-a-plantation-18970098/",
  },
};

const WHO_WE_CONNECT = [
  "Travellers who want meaningful experiences abroad",
  "Hosts who welcome travellers into their homes, farms, businesses and communities",
  "Independent hostels, guesthouses, eco-lodges and sustainable projects",
  "Community organisations and cultural initiatives",
  "People who want to exchange skills, knowledge, languages and experiences",
];

const BELIEFS = [
  {
    title: "Cultural Exchange",
    body: "Every culture has something to teach and something to share. We believe genuine connections begin when people are willing to learn from one another.",
  },
  {
    title: "Shared Experiences",
    body: "We believe in exchanging skills, knowledge, ideas and experiences while contributing positively to the places we visit.",
  },
  {
    title: "Opportunities for Everyone",
    body: "We want independent hosts, small businesses, families and community projects to have an opportunity to connect with people from around the world.",
  },
  {
    title: "Responsible Travel",
    body: "We encourage respect for local communities, the environment, traditions and the people who make every destination unique.",
  },
  {
    title: "Learning Without Borders",
    body: "We believe some of life's greatest lessons happen outside classrooms: through people, cultures, nature and shared everyday experiences.",
  },
];

function Credit({ photo }: { photo: { credit: string; source: string; href: string } }) {
  return (
    <p className="mt-2 text-xs text-gray-500">
      Photo:{" "}
      <a
        href={photo.href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-emerald-700"
      >
        {photo.credit} on {photo.source}
      </a>
    </p>
  );
}

export default function MissionPage() {
  return (
    <main className="min-h-screen bg-white text-slate-800">
      <SiteHeader />

      {/* HERO */}
      <section className="relative flex min-h-[460px] items-end overflow-hidden bg-slate-900 md:min-h-[600px]">
        <img
          src={PHOTOS.hero.src}
          alt={PHOTOS.hero.alt}
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/50 to-slate-900/20" />
        <div className="relative z-10 mx-auto w-full max-w-5xl px-5 pb-14 pt-32 text-white md:pb-20">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">
            Our mission
          </span>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-6xl">
            Travel beyond places. Connect beyond borders.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/90 md:text-xl">
            Our mission is to bring people, cultures and communities closer
            together through meaningful travel and cultural exchange.
          </p>
          <p className="mt-6 text-[11px] text-white/70">
            Photo:{" "}
            <a
              href={PHOTOS.hero.href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {PHOTOS.hero.credit} on {PHOTOS.hero.source}
            </a>
          </p>
        </div>
      </section>

      {/* INTRO */}
      <section className="mx-auto max-w-3xl px-5 py-16 md:py-20">
        <p className="text-lg leading-8 text-gray-700">
          We believe travel should be more than visiting new destinations,
          taking photographs and moving on. It should be about meeting people,
          sharing experiences, learning from different ways of life and creating
          connections that stay with us long after the journey ends.
        </p>
        <p className="mt-6 text-2xl font-bold text-[#17231f]">
          TravailAway exists to make those connections possible.
        </p>
      </section>

      {/* WHO WE CONNECT */}
      <section className="bg-emerald-50 py-16">
        <div className="mx-auto max-w-5xl px-5">
          <h2 className="text-center text-2xl font-bold text-[#17231f] md:text-3xl">
            Who we bring together
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center leading-7 text-gray-600">
            TravailAway is a global travel and cultural-exchange platform,
            inspired by the idea that travel should be about more than tourism.
          </p>
          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {WHO_WE_CONNECT.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-2xl bg-white p-5 shadow-sm"
              >
                <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-emerald-600" />
                <span className="leading-7 text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
          <p className="mx-auto mt-10 max-w-2xl text-center text-lg font-semibold text-[#17231f]">
            Our goal is to bring people and cultures closer together through
            meaningful travel and shared experiences.
          </p>
        </div>
      </section>

      {/* WHY WE EXIST */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:grid-cols-2">
        <div>
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
            Why we exist
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">
            Some people have something special to share. Others want to find it.
          </h2>
          <p className="mt-6 leading-8 text-gray-600">
            The world is full of people, families, farms, hostels, community
            projects and independent initiatives that have something special to
            share.
          </p>
          <p className="mt-4 leading-8 text-gray-600">
            At the same time, there are millions of people who want to explore
            the world differently, not simply as tourists, but as participants
            in local life.
          </p>
          <p className="mt-4 leading-8 text-gray-600">
            Yet these people and opportunities don&apos;t always find each other.
            We want to bridge that gap.
          </p>
          <p className="mt-4 leading-8 text-gray-600">
            Through TravailAway, we aim to create a space where hosts can
            welcome travellers, travellers can discover meaningful
            opportunities, and people from different backgrounds can learn from
            one another.
          </p>
        </div>
        <figure>
          <img
            src={PHOTOS.farm.src}
            alt={PHOTOS.farm.alt}
            loading="lazy"
            className="h-[380px] w-full rounded-3xl object-cover md:h-[480px]"
          />
          <figcaption>
            <Credit photo={PHOTOS.farm} />
          </figcaption>
        </figure>
      </section>

      {/* WHAT WE BELIEVE */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
              What we believe in
            </span>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">
              Five ideas that guide us
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BELIEFS.map((item, index) => (
              <div
                key={item.title}
                className="rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <span className="text-sm font-extrabold text-emerald-600">
                  0{index + 1}
                </span>
                <h3 className="mt-3 text-xl font-bold text-[#17231f]">
                  {item.title}
                </h3>
                <p className="mt-3 leading-7 text-gray-600">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VISION */}
      <section className="bg-slate-900 px-5 py-20 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">
            Our vision
          </span>
          <p className="mt-6 text-2xl font-bold leading-10 md:text-3xl md:leading-[1.5]">
            A world where meaningful travel is accessible to more people, where
            cultural differences bring us together rather than divide us, and
            where even the smallest community can welcome the world.
          </p>
          <p className="mt-8 leading-8 text-slate-300">
            We want TravailAway to grow into a global community connecting
            travellers and hosts across continents, creating opportunities for
            discovery, contribution, friendship and mutual understanding.
          </p>
        </div>
      </section>

      {/* MORE THAN A JOURNEY */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:grid-cols-2">
        <figure className="order-2 md:order-1">
          <img
            src={PHOTOS.field.src}
            alt={PHOTOS.field.alt}
            loading="lazy"
            className="h-[380px] w-full rounded-3xl object-cover md:h-[480px]"
          />
          <figcaption>
            <Credit photo={PHOTOS.field} />
          </figcaption>
        </figure>
        <div className="order-1 md:order-2">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
            More than a journey
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">
            You don&apos;t have to go far to discover something extraordinary.
          </h2>
          <p className="mt-6 leading-8 text-gray-600">
            We are building TravailAway around a simple belief: you don&apos;t
            have to travel far to make a difference, and you don&apos;t have to
            go far to discover something extraordinary.
          </p>
          <p className="mt-4 leading-8 text-gray-600">
            Sometimes, the most meaningful part of travelling isn&apos;t where
            you go. It&apos;s who you meet, what you share and what you learn
            along the way.
          </p>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="bg-emerald-800 px-5 py-20 text-center text-white">
        <h2 className="text-3xl font-extrabold md:text-5xl">
          The world is better when we share it.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-emerald-100">
          Discover opportunities. Share your skills. Experience cultures. Build
          connections.
        </p>
        <p className="mt-4 text-xl font-bold">Welcome to TravailAway.</p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Link
            href="/explore"
            className="rounded-full bg-white px-8 py-4 font-bold text-emerald-800 hover:bg-gray-100"
          >
            Explore opportunities
          </Link>
          <Link
            href="/register?type=host"
            className="rounded-full border border-white px-8 py-4 font-bold text-white hover:bg-white/10"
          >
            Become a host
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
