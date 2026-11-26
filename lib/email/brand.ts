// ONE place to change the look of every Travailaway email.
// Logo, colours, website, footer wording and picture addresses all live here.

// Pictures are stored in the repo folder public/email/ and served from the site.
const ASSET_BASE = "https://www.travailaway.info/email";

export const BRAND = {
  name: "TravailAway",
  website: "https://www.travailaway.info/",
  websiteLabel: "www.travailaway.info",
  tagline: "Discover cultures. Share experiences. Make connections.",
  logoTagline: "Travel. Connect. Experience.",
  supportEmail: "info@travailaway.info",
  company: "Molongi Investments Company SMC Limited, Uganda",

  // Pictures (change the file or the address here and every email follows).
  logoUrl: `${ASSET_BASE}/logo%20(1).png`,
  logoWidth: 190,
  footerArtUrl: `${ASSET_BASE}/footer%20(2).jpg`,

  // Colours.
  colors: {
    orange: "#f97a04",
    orangeDark: "#e06a00",
    orangeFooter: "#fb7c04",
    cream: "#fef9f4",
    page: "#fef9f4",
    ink: "#1f1f1f",
    text: "#333333",
    muted: "#6b6b6b",
    white: "#ffffff",
  },

  // Fonts. Email apps ignore unknown fonts, so the list ends with safe ones.
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
} as const;

export type Brand = typeof BRAND;
