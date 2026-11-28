import type { Metadata } from "next";
import ToolShell from "@/components/tool-shell";
import PackingList from "@/components/packing-list";

export const metadata: Metadata = {
  title: "Packing list for volunteering abroad | Travailaway",
  description:
    "A free packing checklist for volunteering and cultural exchange trips. Tick items off and come back to it later.",
};

export default function Page() {
  return (
    <ToolShell
      kicker="Free travel tool"
      title="Packing list for volunteering abroad"
      intro="A simple checklist for a stay with a host. Tick things off, add your own items, and come back whenever you like."
    >
      <PackingList />
    </ToolShell>
  );
}
