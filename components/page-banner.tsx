type PageBannerProps = {
  image: string;
  message: string;
  subtitle?: string;
  credit?: string;
};

// The photo credit is still accepted (so existing pages keep working) but it
// is no longer shown on the banner.
export default function PageBanner({
  image,
  message,
  subtitle,
}: PageBannerProps) {
  return (
    <section className="relative flex h-64 items-center justify-center overflow-hidden bg-emerald-900 md:h-80">
      <img
        src={image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        loading="eager"
      />
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 mx-auto max-w-3xl px-5 text-center text-white">
        <h2 className="text-3xl font-bold leading-tight drop-shadow-lg md:text-5xl">
          {message}
        </h2>
        {subtitle && (
          <p className="mt-3 text-base text-white drop-shadow-md md:text-lg">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
