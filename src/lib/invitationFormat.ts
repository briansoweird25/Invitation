export interface DateParts {
  weekday: string;
  weekdayShort: string;
  month: string;
  monthShort: string;
  day: number;
  year: number;
  mm: string;
  dd: string;
  yy: string;
}

const part = (d: Date, opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-US", { timeZone: "UTC", ...opts }).format(d);

/** Parses an ISO date (YYYY-MM-DD). Returns null for anything else so callers can show the raw text. */
export function dateParts(iso: string): DateParts | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return null;
  const [year, month, day] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const d = new Date(Date.UTC(year, month - 1, day));
  if (Number.isNaN(d.getTime())) return null;
  return {
    weekday: part(d, { weekday: "long" }),
    weekdayShort: part(d, { weekday: "short" }),
    month: part(d, { month: "long" }),
    monthShort: part(d, { month: "short" }),
    day,
    year,
    mm: m[2],
    dd: m[3],
    yy: m[1].slice(2),
  };
}

/** "16:00" -> "4 pm", "16:30" -> "4:30 pm". Non-matching input is returned unchanged. */
export function formatTime(time: string): string {
  const m = /^(\d{1,2}):(\d{2})$/.exec(time);
  if (!m) return time;
  const hours = Number(m[1]);
  if (hours > 23) return time;
  const suffix = hours >= 12 ? "pm" : "am";
  const h12 = hours % 12 || 12;
  return m[2] === "00" ? `${h12} ${suffix}` : `${h12}:${m[2]} ${suffix}`;
}

/** "Eleanor & James" -> ["Eleanor", "James"]. A single name returns one entry. */
export function splitHostNames(hostNames: string): string[] {
  return hostNames
    .split(/\s+(?:&|and)\s+/i)
    .map((n) => n.trim())
    .filter(Boolean);
}

/** Joins non-empty strings with a separator. */
export function joinText(parts: (string | undefined)[], separator = " · "): string {
  return parts.filter((p): p is string => Boolean(p)).join(separator);
}

/**
 * Shrinks a font size (in cqw) for long text so it stays inside the card.
 * Text up to `comfortableChars` keeps the base size; longer text scales down, but never below `min` of the base.
 */
export function fitSize(base: number, text: string, comfortableChars: number, min = 0.4): string {
  const factor = text.length <= comfortableChars ? 1 : Math.max(min, comfortableChars / text.length);
  return `${(base * factor).toFixed(2)}cqw`;
}

export type DateStyle = "long" | "long-us" | "short" | "numeric" | "day-month" | "month-day" | "full-us";

/**
 * Formats an ISO date for display. An unparseable date is returned unchanged so the user's text still shows.
 *   long      Saturday, 14 June 2026        long-us   Saturday, June 14
 *   full-us   June 14, 2026                 month-day June 14
 *   day-month 14 June                       short     Sat 14 Jun
 *   numeric   14.06.26
 */
export function formatDate(iso: string, style: DateStyle): string {
  const d = dateParts(iso);
  if (!d) return iso;
  switch (style) {
    case "long":
      return `${d.weekday}, ${d.day} ${d.month} ${d.year}`;
    case "long-us":
      return `${d.weekday}, ${d.month} ${d.day}`;
    case "full-us":
      return `${d.month} ${d.day}, ${d.year}`;
    case "month-day":
      return `${d.month} ${d.day}`;
    case "day-month":
      return `${d.day} ${d.month}`;
    case "short":
      return `${d.weekdayShort} ${d.day} ${d.monthShort}`;
    case "numeric":
      return `${d.dd}.${d.mm}.${d.yy}`;
  }
}

/** "17:00 · The Garden Room" style line: the time (when set) and the venue, skipping whichever is empty. */
export function whenWhere(content: { time: string; venue: string }, separator = " · "): string {
  return joinText([content.time && formatTime(content.time), content.venue], separator);
}
