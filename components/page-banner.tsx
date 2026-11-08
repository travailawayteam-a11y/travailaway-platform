type PageBannerProps = {
  image: string;
  message: string;
  subtitle?: string;
  credit?: string;
};

export default function PageBanner({
  image,
  message,
  subtitle,
  credit,
}: PageBannerProps) {
  return (
    <section className="relative flex h-64 items-center justify-center overflow-hidden bg-emerald-900 md:h-80">
      <img
        src={image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        loading="eager"
      />
      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-10 mx-auto max-w-3xl px-5 text-center text-white">
        <h2 className="text-3xl font-bold leading-tight md:text-5xl">
          {message}
        </h2>
        {subtitle && (
          <p className="mt-3 text-base text-white/90 md:text-lg">{subtitle}</p>
        )}
      </div>

      {credit && (
        <p className="absolute bottom-2 right-3 z-10 text-[11px] text-white/70">
          Photo: {credit} on Unsplash
        </p>
      )}
    </section>
  );
}
