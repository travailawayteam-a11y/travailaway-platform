import type { Metadata } from "next";
import GuidePage from "@/components/guide-page";

export const metadata: Metadata = {
  title: "Volunteer in Italy with free accommodation | Travailaway",
  description:
    "How to stay with hosts in Italy, from farms and vineyards to guesthouses, and help a few hours a day in exchange for a bed and meals.",
};

export default function VolunteerInItalyPage() {
  return (
    <GuidePage
      kicker="Travel guide"
      title="Volunteer in Italy with free accommodation"
      intro="Italy is full of small farms, vineyards, guesthouses and family projects that welcome travellers who share a few hours of help a day. Here is what to expect and how to find a stay that suits you."
      sections={[
        {
          heading: "What hosts in Italy offer",
          body: [
            "Many hosts offer a bed, often home-cooked meals, and a real look at daily life. Typical places include family farms and agriturismi, vineyards and olive groves, guesthouses and hostels, and small village projects.",
            "Every host sets their own terms. Always read the listing and agree the tasks, hours and days off before you travel.",
          ],
        },
        {
          heading: "What you might help with",
          body: [
            "Depending on the season, help can include gardening and farm work, looking after animals, harvest time in vineyards and olive groves, cooking, painting and repairs, helping in a guesthouse, or practising English with a host family.",
          ],
        },
        {
          heading: "A little Italian goes a long way",
          body: [
            "You do not need to speak Italian, but learning a few words shows respect and helps you settle in. Many hosts enjoy sharing their language, their recipes and their traditions with you.",
          ],
        },
        {
          heading: "Choosing the right host",
          body: [
            "Look for clear hours, honest photos and a clear description of your room and meals. Send a friendly message about yourself, your skills and your dates, and ask any questions before you agree.",
          ],
        },
        {
          heading: "Rules and paperwork",
          body: [
            "Rules about volunteering and unpaid stays depend on your nationality and how long you stay. Before you book, check the official Italian government website or your nearest embassy, and make sure your passport, any visa, travel insurance and emergency contacts are in order.",
            "Travailaway introduces travellers and hosts. We cannot give legal or immigration advice.",
          ],
        },
      ]}
      ctaTitle="Find your host in Italy"
      ctaText="Create a free traveller profile, browse hosts and start a conversation. Are you a host in Italy? List your place for free."
      primary={{ label: "Explore hosts", href: "/explore" }}
      secondary={{ label: "Become a host", href: "/register?type=host" }}
    />
  );
}
