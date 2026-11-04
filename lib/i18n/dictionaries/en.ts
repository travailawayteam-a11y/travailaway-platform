/**
 * English source dictionary. Every other language must provide exactly
 * the same keys (enforced by the `Dictionary` type).
 *
 * Placeholders such as {name} are replaced at runtime with `format()`.
 * User-generated content (listings, profiles) is never translated.
 */
export const en = {
  meta: {
    title: "Travailaway | Travel. Connect. Experience.",
    description:
      "Discover meaningful cultural exchange opportunities and connect with hosts around the world. By Molongi Investments Company SMC Limited.",
    howItWorksTitle: "How it works | Travailaway",
    opportunitiesTitle: "Explore opportunities | Travailaway",
  },

  common: {
    comingSoon: "Coming soon",
    learnMore: "Learn more",
    language: "Language",
    tagline: "Travel. Connect. Experience.",
    backToHome: "Back to homepage",
    traveller: "Traveller",
    host: "Host",
  },

  nav: {
    explore: "Explore",
    destinations: "Destinations",
    howItWorks: "How it works",
    becomeHost: "Become a host",
    login: "Log in",
    join: "Join Travailaway",
    dashboard: "My dashboard",
    toggleMenu: "Toggle menu",
  },

  footer: {
    explore: "Explore opportunities",
    howItWorks: "How it works",
    becomeHost: "Become a host",
    login: "Log in",
    join: "Join us",
    rights: "Travailaway. An initiative by Molongi Investments Company SMC Limited.",
    photoCredits: "Photo credits",
  },

  hero: {
    eyebrow: "Travel. Connect. Experience.",
    title: "Travel Beyond Borders. Connect Through Experiences.",
    subtitle:
      "Meet welcoming hosts, share your skills and discover everyday life in new cultures — wherever your journey takes you.",
    explore: "Explore opportunities",
    becomeHost: "Become a host",
    slideAlt: "Travelling and cultural experiences",
    showSlide: "Show slide {number}",
  },

  search: {
    whereLabel: "Where do you want to go?",
    wherePlaceholder: "Country, city or region",
    whatLabel: "What are you looking for?",
    anyExperience: "Any type of experience",
    submit: "Search",
  },

  categories: {
    eyebrow: "Find your kind of exchange",
    title: "Explore exchange experiences",
    subtitle:
      "Every host is different. Choose the kind of place and project that matches your interests, skills and travel style.",
    items: {
      "eco-lodges": {
        name: "Eco-lodges and guesthouses",
        description: "Help run welcoming, nature-friendly places to stay.",
      },
      farms: {
        name: "Farms and rural stays",
        description: "Learn about growing food and life in the countryside.",
      },
      homestays: {
        name: "Families and homestays",
        description: "Live with a local family and share daily routines.",
      },
      community: {
        name: "Community projects",
        description: "Support local initiatives that bring people together.",
      },
      ngos: {
        name: "NGOs and charities",
        description: "Lend your time to organisations working for change.",
      },
      teaching: {
        name: "Teaching and education",
        description: "Share languages, knowledge and skills with learners.",
      },
      animals: {
        name: "Animal care",
        description: "Look after animals on farms, sanctuaries and shelters.",
      },
      environment: {
        name: "Environmental projects",
        description: "Take part in conservation, planting and sustainability.",
      },
      hostels: {
        name: "Hostels and tourism projects",
        description: "Welcome guests and help travellers feel at home.",
      },
      "house-sitting": {
        name: "House and pet sitting",
        description: "Care for a home and its animals while hosts are away.",
      },
      cultural: {
        name: "Cultural exchange",
        description: "Swap stories, food, music and traditions.",
      },
    },
  },

  destinations: {
    eyebrow: "The world is waiting",
    title: "Explore destinations around the globe",
    subtitle:
      "From mountain villages to coastal towns, discover where your next exchange could take you.",
    cta: "See opportunities",
    regions: {
      africa: { name: "Africa", detail: "Connect with communities and nature" },
      europe: { name: "Europe", detail: "Discover culture and new experiences" },
      asia: { name: "Asia", detail: "Experience traditions and hospitality" },
      "north-america": { name: "North America", detail: "Big cities, open roads and wild landscapes" },
      "south-america": { name: "South America", detail: "Mountains, rainforests and vibrant cultures" },
      "central-america": { name: "Central America", detail: "Colourful towns, volcanoes and coastlines" },
      oceania: { name: "Oceania", detail: "Islands, oceans and outdoor living" },
    },
  },

  howTeaser: {
    eyebrow: "Simple beginnings",
    title: "How Travailaway works",
    steps: [
      {
        title: "1. Discover",
        text: "Explore welcoming hosts and opportunities in destinations around the world.",
      },
      {
        title: "2. Connect",
        text: "Get to know hosts, share your interests and arrange an experience together.",
      },
      {
        title: "3. Experience",
        text: "Share skills, discover cultures and create lasting memories.",
      },
    ],
    cta: "Read the full guide",
  },

  benefits: {
    eyebrow: "Why Travailaway",
    title: "The benefits of joining Travailaway",
    subtitle:
      "Travailaway is built around fair exchanges between people — not tourism packages.",
    items: [
      {
        title: "Travel more meaningfully",
        text: "Stay longer, live like a local and see places beyond the usual sights.",
      },
      {
        title: "Learn new skills",
        text: "Pick up practical experience, from gardening and cooking to hospitality and teaching.",
      },
      {
        title: "Reduce travel costs",
        text: "Hosts may offer accommodation or meals in return for your help, as agreed together.",
      },
      {
        title: "Practise languages",
        text: "Use and improve a new language through everyday conversations.",
      },
      {
        title: "Support local communities",
        text: "Your time and energy help families, small businesses and projects grow.",
      },
      {
        title: "Free to create a profile",
        text: "Creating a traveller or host account and profile costs nothing.",
      },
    ],
  },

  connect: {
    eyebrow: "Connect with travellers",
    title: "A community of travellers is on its way",
    subtitle:
      "We are building tools to help travellers find each other, swap tips and plan journeys together. These features are not live yet.",
    features: [
      "Find travellers heading to the same region",
      "Share advice about destinations and hosts",
      "Plan meet-ups and travel together",
    ],
    note: "No member profiles are shown here until real travellers choose to share them.",
    cta: "Create your profile",
    imageAlt: "Friends travelling together",
  },

  trust: {
    eyebrow: "Trust and safety",
    title: "How we look after your account today",
    subtitle:
      "We want you to know exactly what is in place now — and what is not yet available.",
    items: [
      {
        title: "Secure sign-in",
        text: "Accounts are protected by email and password authentication through our secure authentication provider. Passwords are never stored in plain text.",
      },
      {
        title: "You control your profile",
        text: "Only you can edit your profile. Database rules prevent other members from changing your information.",
      },
      {
        title: "Protected private data",
        text: "Data such as applications and messages is designed to be visible only to the people involved.",
      },
      {
        title: "Clear agreements",
        text: "We encourage hosts and travellers to agree hours, tasks, accommodation and meals in writing before travelling.",
      },
    ],
    notYetTitle: "Please note",
    notYet:
      "Travailaway does not currently offer identity verification, travel insurance or emergency assistance. Always research your host or traveller, keep someone you trust informed of your plans and arrange your own insurance.",
  },

  stories: {
    eyebrow: "Travel stories and inspiration",
    title: "Stories from the road",
    subtitle:
      "This is where genuine articles, guides and stories from the Travailaway community will appear.",
    empty: "The first stories are being prepared. Nothing is shown here until it is real.",
    topics: ["Destination guides", "Host spotlights", "Tips for first exchanges", "Community stories"],
    imageAlt: "Travel journal, map and camera",
  },

  hostCta: {
    eyebrow: "Open your doors to the world",
    title: "Become a host. Share what makes your place special.",
    text: "Welcome travellers, share your culture, exchange knowledge and introduce people to your community. Create your host profile and let the world discover your opportunity.",
    cta: "Become a host",
    imageAlt: "A peaceful guest room with a view of the mountains",
  },

  finalCta: {
    title: "Your next meaningful journey starts here.",
    text: "Meet people, exchange experiences and discover a world of possibilities with Travailaway.",
    cta: "Join Travailaway",
  },

  howItWorks: {
    heroEyebrow: "How it works",
    heroTitle: "Exchange your time and skills for unforgettable experiences",
    heroText:
      "Travailaway connects travellers who want to live and learn somewhere new with hosts who welcome help and cultural exchange.",
    heroImageAlt: "A traveller with a backpack looking over a mountain lake",
    jumpTravellers: "For travellers",
    jumpHosts: "For hosts",

    whatTitle: "What is a cultural exchange?",
    whatText:
      "A host offers something — usually accommodation, and sometimes meals or other benefits — and a traveller contributes a few hours of help each day or week. Both sides agree the details in advance. It is not paid employment: it is a fair exchange built on trust, learning and shared everyday life.",

    travellers: {
      eyebrow: "For travellers",
      title: "Travel deeper, not just further",
      imageAlt: "A group of travellers hiking together in the mountains",
      steps: [
        {
          title: "Create your free account",
          text: "Sign up as a traveller and complete your profile with your country, interests and a short introduction.",
        },
        {
          title: "Explore opportunities",
          text: "Browse published opportunities by destination and type of experience, and read what each host offers and expects.",
        },
        {
          title: "Get in touch with hosts",
          text: "Tell hosts why you are interested and what you can contribute. Applications and messaging are coming soon.",
        },
        {
          title: "Agree the details",
          text: "Confirm dates, daily hours, tasks, accommodation and meals before you travel, so everyone knows what to expect.",
        },
        {
          title: "Live the experience",
          text: "Contribute, learn and take part in local life — and leave as part of a growing global community.",
        },
      ],
      cta: "Join as a traveller",
    },

    hosts: {
      eyebrow: "For hosts",
      title: "Welcome the world to your door",
      imageAlt: "Host and guests cooking together in a kitchen",
      steps: [
        {
          title: "Create your host account",
          text: "Sign up as a host and introduce yourself, your place and your community in your profile.",
        },
        {
          title: "Describe your opportunity",
          text: "Explain the help you need, the hours involved, the accommodation and meals you provide and the minimum stay. Listing tools are coming soon.",
        },
        {
          title: "Meet interested travellers",
          text: "Review traveller profiles and get to know people before agreeing anything.",
        },
        {
          title: "Agree clear expectations",
          text: "Put the arrangement in writing: tasks, schedule, days off, house rules and what you offer in return.",
        },
        {
          title: "Share your world",
          text: "Welcome your guests, share your culture and benefit from fresh energy, skills and friendships.",
        },
      ],
      cta: "Become a host",
    },

    statusTitle: "What is available today",
    statusText:
      "Travailaway is a growing platform. Here is an honest overview of where things stand.",
    availableNow: "Available now",
    available: [
      "Traveller and host registration",
      "Secure log in and personal dashboard",
      "Editable member profile",
      "Browsing published opportunities",
      "Interface in five languages",
    ],
    comingSoonTitle: "Coming soon",
    upcoming: [
      "Creating and managing host listings",
      "Applications to opportunities",
      "Messaging between hosts and travellers",
      "Saved opportunities and reviews",
      "Connecting with other travellers",
    ],

    tipsTitle: "Tips for a great exchange",
    tips: [
      "Read the full opportunity description and ask questions early.",
      "Agree hours and days off before you arrive.",
      "Share your travel plans with someone you trust.",
      "Arrange your own travel insurance and check visa rules for your destination.",
      "Be respectful, honest and open to new ways of doing things.",
    ],

    ctaTitle: "Ready to begin?",
    ctaText: "Create your free account as a traveller or a host.",
  },

  opportunities: {
    eyebrow: "Explore",
    title: "Explore opportunities",
    subtitle:
      "Browse opportunities published by hosts. Listings are shown in the language they were written in.",
    destinationLabel: "Destination",
    allDestinations: "All destinations",
    typeLabel: "Type of experience",
    searchLabel: "Search",
    searchPlaceholder: "Country, city or keyword",
    filter: "Apply filters",
    clear: "Clear filters",
    resultsOne: "1 opportunity found",
    resultsMany: "{count} opportunities found",
    emptyTitle: "No published opportunities yet",
    emptyFilteredTitle: "No opportunities match your search",
    emptyText:
      "Travailaway is just getting started and hosts are preparing their first listings. Create your profile now so you are ready when they go live.",
    emptyHostText: "Are you a host? Be among the first to welcome travellers.",
    errorTitle: "Opportunities could not be loaded",
    errorText: "Please try again in a moment.",
    hoursPerWeek: "{hours} hours per week",
    minStay: "Minimum stay: {weeks} weeks",
    viewDetails: "View details",
    joinCta: "Create a free account",
  },

  listing: {
    back: "Back to opportunities",
    location: "Location",
    accommodation: "Accommodation",
    meals: "Meals",
    hours: "Hours per week",
    stay: "Length of stay",
    staySpan: "{min}–{max} weeks",
    stayMin: "From {weeks} weeks",
    skills: "Helpful skills",
    benefits: "What the host offers",
    applyTitle: "Interested in this opportunity?",
    applyText: "Applications and messaging are coming soon. Create your profile now so you are ready to apply.",
    originalLanguage: "This listing is shown in the language the host wrote it in.",
    notFound: "This opportunity could not be found or is no longer published.",
  },

  auth: {
    emailLabel: "Email address",
    emailPlaceholder: "you@example.com",
    passwordLabel: "Password",
    genericError: "Something went wrong. Please try again.",
    login: {
      title: "Welcome back",
      subtitle: "Log in to continue your Travailaway journey.",
      passwordPlaceholder: "Enter your password",
      submit: "Log in",
      submitting: "Logging in...",
      newHere: "New to Travailaway?",
      createAccount: "Create an account",
    },
    register: {
      title: "Join Travailaway",
      subtitle: "Create an account and start discovering meaningful connections around the world.",
      fullNameLabel: "Full name",
      fullNamePlaceholder: "Enter your full name",
      passwordPlaceholder: "At least 8 characters",
      passwordTooShort: "Your password must be at least 8 characters long.",
      joinAs: "I want to join as a:",
      travellerHint: "Explore opportunities",
      hostHint: "Welcome travellers",
      success:
        "Registration submitted! Check your email for a confirmation link if email confirmation is enabled.",
      submit: "Create my account",
      submitting: "Creating account...",
      agreement: "By joining, you agree to use Travailaway respectfully and honestly.",
      haveAccount: "Already have an account?",
      login: "Log in",
    },
  },

  dashboard: {
    personalSpace: "Your personal space",
    welcome: "Welcome, {name}!",
    accountBadge: "{type} account",
    hostIntro:
      "Welcome to your host dashboard. Get ready to connect with travellers from around the world.",
    travellerIntro:
      "Your next meaningful travel experience starts here. Discover new places, meet welcoming hosts and explore the world.",
    editProfile: "Edit my profile",
    editProfileText: "Tell hosts and travellers a little about yourself.",
    open: "Open",
    host: {
      create: { title: "Create an opportunity", text: "Share your project and welcome travellers." },
      manage: { title: "My opportunities", text: "Manage the opportunities you offer." },
      applications: { title: "Traveller applications", text: "Connect with people interested in your project." },
    },
    traveller: {
      explore: { title: "Explore opportunities", text: "Discover hosts and experiences around the world." },
      saved: { title: "Saved opportunities", text: "Keep track of places you would love to visit." },
      applications: { title: "My applications", text: "Follow your applications to host opportunities." },
    },
    bannerText: "Travailaway is building a global community where travel creates meaningful connections.",
    logout: "Log out",
    loggingOut: "Signing out...",
  },

  profile: {
    back: "← Back to dashboard",
    loading: "Loading your profile...",
    title: "Your Travailaway profile",
    subtitle: "Tell hosts and travellers a little about yourself.",
    accountType: "Account type",
    fullName: "Full name",
    fullNamePlaceholder: "Your full name",
    country: "Country",
    countryPlaceholder: "e.g. Uganda",
    city: "City or town",
    cityPlaceholder: "Your city or town",
    bio: "About me",
    bioPlaceholder:
      "Tell the Travailaway community about yourself, your interests and what brings you here...",
    saved: "Your profile has been updated successfully!",
    save: "Save my profile",
    saving: "Saving...",
  },
};

type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? Widen<U>[]
    : { [K in keyof T]: Widen<T[K]> };

export type Dictionary = Widen<typeof en>;
