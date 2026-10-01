import type { RsvpStats as Stats } from "@/lib/rsvp";

const ITEMS: { key: keyof Stats; label: string; hint: string }[] = [
  { key: "attending", label: "Attending", hint: "replies" },
  { key: "declined", label: "Not attending", hint: "replies" },
  { key: "guests", label: "Total guests", hint: "coming" },
  { key: "replies", label: "Replies", hint: "in all" },
];

/** The four numbers a host checks first. Plain numbers with labels, no chart. */
export function RsvpStats({ stats }: { stats: Stats }) {
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-4">
      {ITEMS.map((item) => (
        <div key={item.key} className="bg-surface p-4 sm:p-5">
          <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{item.label}</dt>
          <dd className="mt-2 font-serif text-4xl font-medium leading-none" data-testid={`stat-${item.key}`}>
            {stats[item.key]}
          </dd>
        </div>
      ))}
    </dl>
  );
}
