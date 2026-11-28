import type { Metadata } from "next";
import ToolShell from "@/components/tool-shell";
import TimeZoneTool from "@/components/time-zone-tool";

export const metadata: Metadata = {
  title: "Time zone planner for travellers | Travailaway",
  description:
    "See the time in your host's city and find a good time to talk. Free time zone converter for travellers and hosts.",
};

export default function TimeZonesPage() {
  return (
    <ToolShell
      kicker="Free travel tool"
      title="Time zone planner"
      intro="Check the time at your host's place and find a time that works for both of you before you send that first message."
    >
      <TimeZoneTool />
    </ToolShell>
  );
}
