import type { Metadata } from "next";
import ToolShell from "@/components/tool-shell";
import HostChecklist from "@/components/host-checklist";

export const metadata: Metadata = {
  title: "What to ask your host before you go | Travailaway",
  description:
    "A free checklist of questions to ask a host before you travel: work, hours, food, costs and safety.",
};

export default function Page() {
  return (
    <ToolShell
      kicker="Free travel tool"
      title="What to ask your host before you go"
      intro="Good stays start with clear answers. Use this checklist to ask the right questions before you confirm."
    >
      <HostChecklist />
    </ToolShell>
  );
}
