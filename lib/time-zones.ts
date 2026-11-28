// Cities offered in the clocks, with their official time-zone names.
export const CITIES: { name: string; zone: string }[] = [
  { name: "Kampala", zone: "Africa/Kampala" },
  { name: "Nairobi", zone: "Africa/Nairobi" },
  { name: "Lagos", zone: "Africa/Lagos" },
  { name: "Cairo", zone: "Africa/Cairo" },
  { name: "Johannesburg", zone: "Africa/Johannesburg" },
  { name: "London", zone: "Europe/London" },
  { name: "Lisbon", zone: "Europe/Lisbon" },
  { name: "Madrid", zone: "Europe/Madrid" },
  { name: "Paris", zone: "Europe/Paris" },
  { name: "Berlin", zone: "Europe/Berlin" },
  { name: "Rome", zone: "Europe/Rome" },
  { name: "Athens", zone: "Europe/Athens" },
  { name: "Istanbul", zone: "Europe/Istanbul" },
  { name: "Dubai", zone: "Asia/Dubai" },
  { name: "Mumbai", zone: "Asia/Kolkata" },
  { name: "Bangkok", zone: "Asia/Bangkok" },
  { name: "Bali", zone: "Asia/Makassar" },
  { name: "Tokyo", zone: "Asia/Tokyo" },
  { name: "Sydney", zone: "Australia/Sydney" },
  { name: "Auckland", zone: "Pacific/Auckland" },
  { name: "Toronto", zone: "America/Toronto" },
  { name: "New York", zone: "America/New_York" },
  { name: "Chicago", zone: "America/Chicago" },
  { name: "Denver", zone: "America/Denver" },
  { name: "Los Angeles", zone: "America/Los_Angeles" },
  { name: "Mexico City", zone: "America/Mexico_City" },
  { name: "Bogotá", zone: "America/Bogota" },
  { name: "Lima", zone: "America/Lima" },
  { name: "São Paulo", zone: "America/Sao_Paulo" },
  { name: "Buenos Aires", zone: "America/Argentina/Buenos_Aires" },
];

export function timeIn(zone: string, date: Date): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: zone,
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).format(date);
  } catch {
    return "--:--";
  }
}

export function dayIn(zone: string, date: Date): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: zone,
      weekday: "short",
      day: "numeric",
      month: "short",
    }).format(date);
  } catch {
    return "";
  }
}

// How many minutes the zone is ahead of UTC at this moment.
function offsetMinutes(zone: string, date: Date): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(date);
  const get = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value || 0);
  const asUtc = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    get("hour"),
    get("minute"),
    get("second")
  );
  return (asUtc - Math.floor(date.getTime() / 1000) * 1000) / 60000;
}

// The exact moment when the wall clock in `zone` shows the given date and time.
export function zonedToInstant(
  zone: string,
  y: number,
  m: number,
  d: number,
  h: number,
  mi: number
): Date {
  const guess = Date.UTC(y, m - 1, d, h, mi);
  const first = offsetMinutes(zone, new Date(guess));
  let t = guess - first * 60000;
  const second = offsetMinutes(zone, new Date(t));
  if (second !== first) t = guess - second * 60000;
  return new Date(t);
}
