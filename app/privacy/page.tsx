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
