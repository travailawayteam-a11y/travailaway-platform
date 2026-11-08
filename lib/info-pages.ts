export type InfoPage = {
  title: string;
  intro: string;
  comingSoon?: boolean;
  sections: { heading: string; body: string }[];
  cta: { label: string; href: string };
};

export const INFO_PAGES: Record<string, InfoPage> = {
  "how-it-works": {
    title: "How Travailaway works",
    intro:
      "Travailaway connects people who want to travel meaningfully with hosts who welcome them. You share a little of your time and skills, and your host shares their home, food and culture.",
    sections: [
      {
        heading: "If you are a traveller",
        body: "Create your account and complete your profile so hosts can get to know you. Browse opportunities, find a place and a project that feels right, and get in touch with the host to talk about dates and expectations.",
      },
      {
        heading: "If you are a host",
        body: "Create your host account, tell travellers about you and your place, then publish an opportunity describing the help you need and what you offer in return, such as a bed, meals and local experiences.",
      },
      {
        heading: "A fair exchange for everyone",
        body: "Opportunities describe the hours of help, the stay length and what is provided, so both sides know what to expect before anyone travels. Good communication and mutual respect are what make each stay work.",
      },
    ],
    cta: { label: "Explore opportunities", href: "/explore" },
  },
  "travel-buddies": {
    title: "Meet a travel companion",
    intro:
      "Planning a trip and would love company? We are building a way for travellers to find others heading in the same direction.",
    comingSoon: true,
    sections: [
      {
        heading: "What we are planning",
        body: "A friendly space to share where you are going and when, and to connect with people who would like to join part of the journey.",
      },
      {
        heading: "In the meantime",
        body: "Create your traveller profile and explore hosts. When companions launch, your profile will already be ready.",
      },
    ],
    cta: { label: "Join as a traveller", href: "/register?type=traveller" },
  },
  meetups: {
    title: "Gatherings & events",
    intro:
      "Some of the best moments on the road happen over a shared meal. We are planning ways for the community to meet in person.",
    comingSoon: true,
    sections: [
      {
        heading: "What we are planning",
        body: "Local meet-ups where travellers and hosts can swap stories, tips and friendships, wherever they happen to be.",
      },
      {
        heading: "Want to be first to know?",
        body: "Join Travailaway and complete your profile. We will announce gatherings to the community as they begin.",
      },
    ],
    cta: { label: "Join Travailaway", href: "/register" },
  },
  "travel-and-learn": {
    title: "Learn on the road",
    intro:
      "Every stay is a chance to learn something you cannot find in a classroom, from a new language to a family recipe or a traditional craft.",
    sections: [
      {
        heading: "Skills you can pick up",
        body: "Farming methods, cooking, building, teaching, hospitality and community work. Hosts often love to share what they know.",
      },
      {
        heading: "Knowledge goes both ways",
        body: "Travellers bring their own skills and stories too. The best exchanges leave both sides with something new.",
      },
      {
        heading: "Finding the right fit",
        body: "Browse opportunities by category and read what each host offers, then choose the experience that matches what you want to learn.",
      },
    ],
    cta: { label: "Browse opportunities", href: "/explore" },
  },
  community: {
    title: "Our community",
    intro:
      "Travailaway is more than a website. It is a growing circle of travellers and hosts who believe travel should create real connections.",
    sections: [
      {
        heading: "Built on respect",
        body: "We ask everyone to be honest, kind and respectful of local customs, in their profiles, their messages and their stays.",
      },
      {
        heading: "Hosts and travellers, side by side",
        body: "Hosts open their doors and share their culture. Travellers bring energy, skills and curiosity. Together they shape what Travailaway becomes.",
      },
      {
        heading: "Be part of it",
        body: "Join us as a traveller or a host and help build a community that welcomes people from everywhere.",
      },
    ],
    cta: { label: "Join Travailaway", href: "/register" },
  },
  "giving-back": {
    title: "Making a difference",
    intro:
      "Cultural exchange works best when everyone benefits. We want travel through Travailaway to leave places and people better off.",
    sections: [
      {
        heading: "Support for local projects",
        body: "Many opportunities are community, farming, teaching and environmental projects where a few weeks of help really matters.",
      },
      {
        heading: "Travel that is mindful",
        body: "Staying with local hosts and sharing their daily life keeps the benefits of travel within the community.",
      },
      {
        heading: "Share your project",
        body: "If you run a community project or family initiative, you can become a host and invite travellers to take part.",
      },
    ],
    cta: { label: "Become a host", href: "/register?type=host" },
  },
  safety: {
    title: "Safety & trust",
    intro:
      "Meeting new people is exciting, and feeling secure matters. Here is how we think about safety, and what we encourage everyone to do.",
    sections: [
      {
        heading: "Before you agree to anything",
        body: "Read the opportunity and the host's profile carefully. Ask questions about the work, the accommodation and the expectations, and agree on dates before you travel.",
      },
      {
        heading: "Trust your instincts",
        body: "If something does not feel right, you can say no or leave. Tell someone you trust where you are staying and keep your own travel documents and money secure.",
      },
      {
        heading: "Keep communication clear",
        body: "Agree on hours, tasks and what is provided in advance, so there are no surprises on arrival.",
      },
      {
        heading: "We are still growing",
        body: "Our safety features, including profile checks and reviews, are still being built. Until then, please use good judgement and report any concerns to the Travailaway team.",
      },
    ],
    cta: { label: "Explore opportunities", href: "/explore" },
  },
};
