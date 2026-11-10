import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy | Travailaway",
  description:
    "How Travailaway collects, uses and protects your personal information.",
};

const SECTIONS: LegalSection[] = [
  {
    heading: "Who is responsible for your information",
    paragraphs: [
      "Travailaway is operated by Molongi Investments Company SMC Limited, a company in Uganda. We are responsible for the personal information described in this policy. You can reach us through our Contact page.",
    ],
  },
  {
    heading: "What we collect",
    bullets: [
      "Account details: your name, email address, password (stored securely, never in plain text) and whether you joined as a traveller or a host.",
      "Profile details you choose to add: your country, city, a short bio and a photo.",
      "Content you post: opportunities, travel plans, events, applications, ambassador and volunteer forms, and messages you send through Travailaway.",
      "Membership details: your plan and its dates. When card payments are available, payments will be handled by a payment provider and we will not store your full card number.",
      "Messages you send us through the Contact page.",
      "Basic technical information, such as your browser and device type, which our hosting and service providers may log to keep the site secure and working.",
    ],
  },
  {
    heading: "How we use your information",
    bullets: [
      "To create and run your account and show your profile and listings.",
      "To let travellers and hosts contact each other.",
      "To review listings and community posts before they go live and keep the community safe.",
      "To manage memberships and, when payments are available, to confirm them.",
      "To reply to your questions and applications.",
      "To improve Travailaway and fix problems.",
    ],
  },
  {
    heading: "Who can see your information",
    paragraphs: [
      "Your public profile details and your listings can be seen by other members, depending on the page. Travel plans and events are shown to logged-in members. Your messages are visible only to you and the person you are writing to, and to our team where needed to keep the platform safe or to help with a problem.",
      "We do not sell your personal information.",
    ],
  },
  {
    heading: "Services that help us run Travailaway",
    paragraphs: [
      "We use trusted providers to run the platform. Your information is stored and processed with them only so that Travailaway can work:",
    ],
    bullets: [
      "Supabase, which stores our database, accounts and uploaded photos.",
      "Our website hosting providers, which deliver the site to your browser.",
      "Google Translate, only if you choose a language other than English. The text of the page is then sent to Google so it can be translated.",
      "A payment provider, once card payments are available.",
      "Photo websites such as Unsplash and Pexels, from which some pictures on our pages are loaded. Their servers may see your IP address when a picture loads.",
    ],
  },
  {
    heading: "Cookies and similar storage",
    paragraphs: [
      "We use cookies and browser storage that are needed for the site to work: to keep you logged in, and to remember the language you choose. If you pick a language other than English, the translation service also sets a cookie. You can clear these in your browser settings, but you may then need to log in or choose your language again.",
    ],
  },
  {
    heading: "How long we keep information",
    paragraphs: [
      "We keep your information while your account is open and for as long as needed to run Travailaway, resolve disputes and meet legal duties. When you ask us to close your account, we will delete or anonymise your personal information, except where we must keep some of it by law.",
    ],
  },
  {
    heading: "Keeping your information safe",
    paragraphs: [
      "We use reasonable technical and organisational measures to protect your information, including access rules in our database so people can only see what they are meant to see. No online service can be completely secure, so please use a strong password and keep it private.",
    ],
  },
  {
    heading: "Your rights",
    paragraphs: [
      "Under the Data Protection and Privacy Act, 2019 of Uganda, and similar laws that may apply to you, you can ask to see the personal information we hold about you, to correct it, or to have it deleted. You can edit your profile at any time from your dashboard. For anything else, contact us through our Contact page and we will respond as soon as we can.",
    ],
  },
  {
    heading: "Children",
    paragraphs: [
      "Travailaway is for people aged 18 and over. We do not knowingly collect information from children. If you believe a child has given us information, please tell us so that we can remove it.",
    ],
  },
  {
    heading: "Changes to this policy",
    paragraphs: [
      "We may update this policy from time to time. When we do, we will change the date at the top of this page.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="10 November 2026"
      intro="Your privacy matters to us. This policy explains what personal information Travailaway collects, why we collect it, and the choices you have."
      sections={SECTIONS}
    />
  );
}
