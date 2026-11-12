import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

// Adds the TravailAway header and footer around the create and edit opportunity pages.
export default function OpportunitiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
