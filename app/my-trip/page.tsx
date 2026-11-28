import type { Metadata } from "next";
import ToolShell from "@/components/tool-shell";
import MyTrip from "@/components/my-trip";

export const metadata: Metadata = {
  title: "My trip: countdown and checklist | Travailaway",
  description:
    "Plan your trip in one place: countdown to departure, a before-you-go checklist and notes. Free, and saved on your own device.",
};

export default function MyTripPage() {
  return (
    <ToolShell
      kicker="Free travel tool"
      title="My trip"
      intro="Set your destination and dates, tick off what you need to do before you go, and keep your notes in one place. Come back any time. It remembers."
    >
      <MyTrip />
    </ToolShell>
  );
}
