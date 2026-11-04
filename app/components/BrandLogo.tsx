import Link from "next/link";

export default function BrandLogo() {
  return (
    <Link
      href="/"
      aria-label="Travailaway homepage"
      className="inline-flex items-center"
    >
      <img
        src="https://sbgfaplqdxejirqfqfpn.supabase.co/storage/v1/object/public/brand-assets/1000296575-removebg-preview.png"
        alt="Travailaway"
        className="h-20 w-auto max-w-[280px] object-contain sm:h-24 sm:max-w-[320px]"
      />
    </Link>
  );
}
