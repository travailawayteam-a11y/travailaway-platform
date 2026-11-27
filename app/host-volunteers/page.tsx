import type { Metadata } from "next";
import GuidePage from "@/components/guide-page";

export const metadata: Metadata = {
  title: "How to get volunteers for your farm, hostel or project | Travailaway",
  description:
    "A simple guide for hosts: how to find reliable volunteers and travellers who help a few hours a day in exchange for a bed and meals.",
};

export default function HostVolunteersPage() {
  return (
    <GuidePage
      kicker="Host guide"
      title="How to get volunteers for your farm, hostel or project"
      intro="Many hosts around the world welcome travellers who give a few hours of help a day in return for a bed, meals and a real taste of local life. Here is how to find the right people and make every stay work well."
      sections={[
        {
          heading: "Who can host?",
          body: [
            "Farms and vineyards, guesthouses and hostels, family homes, community gardens, language schools, eco projects and small businesses all welcome volunteers. If you have a spare bed and a few tasks a traveller could help with, you can host.",
          ],
        },
        {
          heading: "Write a listing travellers trust",
          body: [
            "Describe the place, the tasks, the hours per week, the length of stay and exactly what you offer, such as a private room, meals and days off. Clear details bring better travellers and fewer misunderstandings.",
            "Add honest photos of the house, the room, the work area and the surroundings. Real photos help travellers trust your listing.",
          ],
        },
        {
          heading: "Choose the right volunteer",
          body: [
            "Read each traveller's profile and message. Ask a few simple questions about their skills, their dates and why they want to stay with you. A short chat before the stay helps both sides feel comfortable.",
            "Agree the hours, the tasks and the house rules in writing before they arrive.",
          ],
        },
        {
          heading: "Make the stay work",
          body: [
            "Give a clear welcome on the first day, show them around and explain the daily plan. Respect the agreed hours and days off. Travellers who feel welcome and fairly treated work well and often stay longer.",
          ],
        },
        {
          heading: "Rules and paperwork",
          body: [
            "Rules about volunteers and unpaid help are different in every country. Please check your local rules, insurance and any registration you need as a host. Travailaway introduces hosts and travellers, and we cannot give legal advice.",
          ],
        },
      ]}
      ctaTitle="List your place for free"
      ctaText="Create your host account, add your opportunity and start meeting travellers. It only takes a few minutes."
      primary={{ label: "Become a host", href: "/register?type=host" }}
      secondary={{ label: "See how it works", href: "/how-it-works" }}
    />
  );
}
