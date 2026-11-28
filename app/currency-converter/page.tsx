import type { Metadata } from "next";
import ToolShell from "@/components/tool-shell";
import CurrencyConverter from "@/components/currency-converter";

export const metadata: Metadata = {
  title: "Currency converter | Travailaway",
  description:
    "Convert between more than 35 currencies with the latest exchange rates. Free and simple, made for travellers.",
};

export default function Page() {
  return (
    <ToolShell
      kicker="Free travel tool"
      title="Currency converter"
      intro="Convert money between currencies using the latest reference exchange rates, so you know what things cost before you travel."
    >
      <CurrencyConverter />
    </ToolShell>
  );
}
