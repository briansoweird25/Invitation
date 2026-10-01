import { useState } from "react";
import { filterReplies, rsvpStats, type RsvpFilter } from "@/lib/rsvp";
import { cn } from "@/lib/utils";
import type { RsvpReply } from "@/types/invitation";

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

function Answer({ attendance }: { attendance: RsvpReply["attendance"] }) {
  const yes = attendance === "attending";
  // Text plus a filled or hollow dot, so the answer never relies on color alone.
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-sm border px-1.5 py-0.5 text-xs", yes ? "border-accent/50 text-accent" : "text-muted-foreground")}>
      <span aria-hidden="true" className={cn("size-1.5 rounded-full border", yes ? "border-accent bg-accent" : "border-current")} />
      {yes ? "Attending" : "Not attending"}
    </span>
  );
}

/** Replies with a filter. One column of rows that works the same on a phone and a desktop. */
export function RsvpGuestList({ replies }: { replies: RsvpReply[] }) {
  const [filter, setFilter] = useState<RsvpFilter>("all");
  const stats = rsvpStats(replies);
  const shown = filterReplies(replies, filter);
  const tabs: { value: RsvpFilter; label: string; count: number }[] = [
    { value: "all", label: "All", count: stats.replies },
    { value: "attending", label: "Attending", count: stats.attending },
    { value: "declined", label: "Not attending", count: stats.declined },
  ];

  return (
    <section aria-labelledby="guest-list-heading" className="mt-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="guest-list-heading" className="text-sm font-medium">
          Guest list
        </h2>
        <div role="group" aria-label="Filter replies" className="flex gap-1">
          {tabs.map((t) => (
            <button
              key={t.value}
              type="button"
              aria-pressed={filter === t.value}
              onClick={() => setFilter(t.value)}
              className={cn("rounded-md border px-3 py-1.5 text-xs", filter === t.value ? "border-foreground bg-foreground text-background" : "text-muted-foreground hover:bg-muted")}
            >
              {t.label} <span className="opacity-70">{t.count}</span>
            </button>
          ))}
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="mt-6 border-t py-10 text-center text-sm text-muted-foreground">No replies in this view.</p>
      ) : (
        <ul className="mt-4 divide-y border-y">
          {shown.map((r) => (
            <li key={r.id} className="grid grid-cols-[minmax(0,1fr)] gap-1.5 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-x-6">
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="[overflow-wrap:anywhere] font-medium">{r.guestName}</span>
                  <Answer attendance={r.attendance} />
                  {r.attendance === "attending" && (
                    <span className="text-sm text-muted-foreground">
                      {r.guestCount} {r.guestCount === 1 ? "guest" : "guests"}
                    </span>
                  )}
                </p>
                {r.guestEmail && (
                  <p className="mt-1 text-sm [overflow-wrap:anywhere]">
                    <a href={`mailto:${r.guestEmail}`} className="text-muted-foreground underline-offset-4 hover:underline">
                      {r.guestEmail}
                    </a>
                  </p>
                )}
                {r.message && <p className="mt-2 whitespace-pre-line text-sm [overflow-wrap:anywhere]">{r.message}</p>}
              </div>
              <p className="text-xs text-muted-foreground sm:text-right">{dateFormat.format(new Date(r.createdAt))}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
