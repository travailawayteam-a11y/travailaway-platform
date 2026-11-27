import type { Metadata } from "next";
import GuidePage from "@/components/guide-page";

export const metadata: Metadata = {
  title: "List your place for free as a host | Travailaway",
  description:
    "List your farm, hostel, guesthouse or project for free and meet travellers who want to help and learn. Set up your listing in about five minutes.",
};

export default function ListYourPlacePage() {
  return (
    <GuidePage
      kicker="For hosts"
      title="List your place for free and meet travellers who want to help"
      intro="Travailaway connects hosts with travellers who want real cultural exchange. Listing your place is free, and you stay in control of who you welcome and what you ask for."
      sections={[
        {
          heading: "Set up in about five minutes",
          body: [
            "Create your host account, then add your opportunity: where you are, what help you need, how many hours, how long people can stay, and what you offer in return.",
            "Our team reviews each listing before it goes live, so travellers see places they can trust.",
          ],
        },
        {
          heading: "You choose who stays",
          body: [
            "Travellers send you a message. You read their profile, ask questions and decide if it is a good fit. Nothing is agreed until you are happy with it.",
          ],
        },
        {
          heading: "What helps your listing stand out",
          body: [
            "Clear photos, honest details about the tasks and hours, and a friendly description of the place and the people. Mention what makes your home or project special, such as local food, a view, or something travellers can learn.",
          ],
        },
        {
          heading: "Messages and notifications",
          body: [
            "When a traveller contacts you, we send a notice to your email, so you do not miss anyone. You can reply from your Travailaway messages.",
          ],
        },
        {
          heading: "We are growing with our first hosts",
          body: [
            "Travailaway is new, and we are building the community together with our first hosts. If you have ideas or questions, you can contact us at any time.",
          ],
        },
      ]}
      ctaTitle="Ready to welcome travellers?"
      ctaText="Create your free host account and publish your first opportunity today."
      primary={{ label: "Create host account", href: "/register?type=host" }}
      secondary={{ label: "Read the host guide", href: "/host-volunteers" }}
    />
  );
}
