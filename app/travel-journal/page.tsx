import type { Metadata } from "next";
import ToolShell from "@/components/tool-shell";
import TravelJournal from "@/components/travel-journal";

export const metadata: Metadata = {
  title: "Free travel journal | Travailaway",
  description:
    "A private travel journal with a daily question. Write about the people you meet and the places you stay. Saved on your own device.",
};

export default function TravelJournalPage() {
  return (
    <ToolShell
      kicker="Free travel tool"
      title="Travel journal"
      intro="Write a few lines about each day: the people you met, the food you ate, what you learned. A new question every day helps you start."
    >
      <TravelJournal />
    </ToolShell>
  );
}
