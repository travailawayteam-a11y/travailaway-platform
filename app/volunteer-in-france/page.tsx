import type { Metadata } from "next";
import GuidePage from "@/components/guide-page";

export const metadata: Metadata = {
  title: "Volunteer in France with free accommodation | Travailaway",
  description:
    "How to stay with hosts in France, from farms and vineyards to guesthouses, and help a few hours a day in exchange for a bed and meals.",
};

export default function VolunteerInFrancePage() {
  return (
    <GuidePage
      banner={{
        image:
          "https://images.unsplash.com/photo-1614918616986-d88642582e9b?auto=format&fit=crop&w=1600&q=70",
        message: "Share your time. Live France.",
        subtitle: "Stay with welcoming hosts from the countryside to the coast.",
      }}
      kicker="Travel guide"
      title="Volunteer in France with free accommodation"
      intro="From countryside farms and vineyards to guesthouses and village projects, many hosts in France welcome travellers who share a few hours of help a day. Here is how it works and how to choose a good stay."
      sections={[
        {
          heading: "What hosts in France offer",
          body: [
            "Many hosts offer a bed, often meals, and a real taste of local life. Typical places include family farms, vineyards, gites and chambres d'hotes, community gardens and small eco projects.",
            "Each host decides the terms. Always read the listing and agree tasks, hours and days off before you travel.",
          ],
        },
        {
          heading: "What you might help with",
          body: [
            "Help can include gardening and farm work, caring for animals, harvest time in vineyards and orchards, cooking, repairs and painting, helping in a guesthouse, or helping a family practise English.",
          ],
        },
        {
          heading: "Speaking some French helps",
          body: [
            "You do not always need fluent French, but a few words and a friendly attitude are appreciated, especially in rural areas. A stay is also a great way to learn the language in daily life.",
          ],
        },
        {
          heading: "Choosing the right host",
          body: [
            "Look for clear hours, honest photos and a clear description of your room and meals. Message the host about yourself, your skills and your dates, and ask questions before you agree.",
          ],
        },
        {
          heading: "Rules and paperwork",
          body: [
            "Rules about volunteering and unpaid stays depend on your nationality and how long you stay. Before you book, check the official French government website or your nearest embassy, and make sure your passport, any visa, travel insurance and emergency contacts are in order.",
            "Travailaway introduces travellers and hosts. We cannot give legal or immigration advice.",
          ],
        },
      ]}
      ctaTitle="Find your host in France"
      ctaText="Create a free traveller profile, browse hosts and start a conversation. Are you a host in France? List your place for free."
      primary={{ label: "Explore hosts", href: "/explore" }}
      secondary={{ label: "Become a host", href: "/register?type=host" }}
    />
  );
}
