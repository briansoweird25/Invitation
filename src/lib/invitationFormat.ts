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
