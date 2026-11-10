import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service | Travailaway",
  description:
    "The terms that apply when you use Travailaway, the cultural exchange platform run by Molongi Investments Company SMC Limited.",
};

const SECTIONS: LegalSection[] = [
  {
    heading: "Who we are",
    paragraphs: [
      "Travailaway is operated by Molongi Investments Company SMC Limited (\"Travailaway\", \"we\", \"us\"). Travailaway is an online platform that helps travellers and hosts around the world find each other for cultural exchange and shared experiences.",
    ],
  },
  {
    heading: "Using Travailaway",
    bullets: [
      "You must be at least 18 years old to create an account.",
      "You must give accurate information and keep your login details safe. You are responsible for what happens under your account.",
      "You may use Travailaway only for lawful purposes and in line with these terms.",
    ],
  },
  {
    heading: "What Travailaway is, and is not",
    paragraphs: [
      "Travailaway is a platform that connects people. We are not an employer, a recruitment agency, a travel agent or a party to any arrangement between a traveller and a host.",
      "Opportunities on Travailaway are cultural exchange and volunteer experiences. They are not offers of paid employment, and nothing on the platform is a promise of work, pay, accommodation or meals unless a host states it clearly in their listing.",
    ],
  },
  {
    heading: "Arrangements between travellers and hosts",
    paragraphs: [
      "Any arrangement is made directly between the traveller and the host. Before travelling, you should agree clearly on what is offered and expected, including accommodation, meals, working hours, length of stay and any costs.",
      "We encourage you to read profiles carefully, communicate before you travel, and check important details yourself. We do not guarantee the accuracy of any listing, profile or message, and we do not guarantee that any experience will take place or meet your expectations.",
    ],
  },
  {
    heading: "Hosts and listings",
    bullets: [
      "Hosts must describe their opportunity honestly and keep it up to date.",
      "Listings are reviewed by our team before they go live. We may decline, edit, pause or remove a listing at any time, for example if it is unclear, unsafe or against these terms.",
      "Hosts are responsible for complying with the laws that apply to them and their activities, including any rules about hosting visitors or volunteers.",
    ],
  },
  {
    heading: "Traveller membership",
    paragraphs: [
      "You can create an account and explore Travailaway for free. Contacting hosts and applying to opportunities requires an active traveller membership.",
      "Membership is available as Solo, Couple or Family, and each plan covers one year. The current prices are shown on our Membership page. The membership fee is paid to Travailaway to help run the platform. It is not a payment to any host.",
      "Details about payment and any refunds will be confirmed when you join. If a membership expires, you can still log in and read your messages, but you will need to renew to contact hosts or apply to new opportunities.",
    ],
  },
  {
    heading: "Messages and community behaviour",
    paragraphs: [
      "Please be honest, kind and respectful of local customs, in your profile, your messages and your stays.",
      "You must not use Travailaway to harass, threaten, discriminate against or deceive anyone, to send spam, to ask for payments or personal financial details outside what a listing states, or to post anything unlawful or harmful.",
    ],
  },
  {
    heading: "Your content",
    paragraphs: [
      "You keep ownership of the text, photos and other material you post. By posting it on Travailaway you give us a non-exclusive licence to display and use it on the platform and in connection with running and promoting Travailaway.",
      "You promise that you have the right to post what you share and that it does not break anyone else's rights.",
    ],
  },
  {
    heading: "Suspending or closing accounts",
    paragraphs: [
      "We may suspend or close an account, or remove content, if we believe these terms have been broken or if it is needed to protect other people or the platform. You can ask us to close your account at any time by contacting us.",
    ],
  },
  {
    heading: "Our responsibility",
    paragraphs: [
      "We work to keep Travailaway available and accurate, but we provide it \"as it is\" and cannot promise it will always be free of errors or interruptions.",
      "To the fullest extent the law allows, we are not responsible for what happens during or because of an arrangement between a traveller and a host, including loss, injury or damage, or for the actions of any user. Nothing in these terms limits any right you have under the law that cannot be limited.",
    ],
  },
  {
    heading: "Changes to these terms",
    paragraphs: [
      "We may update these terms from time to time. When we do, we will change the date at the top of this page. If you keep using Travailaway after an update, you accept the new terms.",
    ],
  },
  {
    heading: "Law and contact",
    paragraphs: [
      "These terms are governed by the laws of Uganda. If you have a question about them, please reach us through our Contact page.",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="10 November 2026"
      intro="These terms explain the rules for using Travailaway. By creating an account or using the platform, you agree to them. Please read them carefully."
      sections={SECTIONS}
    />
  );
}
