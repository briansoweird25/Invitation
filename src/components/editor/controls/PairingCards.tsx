import { fontPairings, type FontPairing } from "@/data/fontPairings";
import { useInvitationFonts } from "@/hooks/useInvitationFonts";
import { resolveFont } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import type { InvitationDesign } from "@/types/invitation";

interface PairingCardsProps {
  /** Pairing ids to offer, or "any". */
  allowed: string[] | "any";
  styles: string[];
  design: InvitationDesign;
  onSelect: (pairing: FontPairing) => void;
}

const isActive = (p: FontPairing, d: InvitationDesign) =>
  p.heading === d.headingFont && p.body === d.bodyFont && (p.script ?? undefined) === (d.scriptFont ?? undefined);

function PairingCard({ pairing, design, active, onSelect }: { pairing: FontPairing; design: InvitationDesign; active: boolean; onSelect: () => void }) {
  useInvitationFonts({ headingFont: pairing.heading, bodyFont: pairing.body, scriptFont: pairing.script });
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={pairing.name}
      onClick={onSelect}
      className={cn("rounded-md border px-3 py-2.5 text-left", active ? "border-foreground ring-1 ring-foreground" : "hover:border-subtle-foreground")}
      style={{ backgroundColor: design.backgroundColor, color: design.textColor }}
    >
      <span aria-hidden="true" className="block">
        <span className="block truncate text-xl leading-tight" style={{ fontFamily: resolveFont(pairing.script ?? pairing.heading) }}>
          Eleanor &amp; James
        </span>
        <span className="mt-0.5 block truncate text-xs opacity-80" style={{ fontFamily: resolveFont(pairing.body) }}>
          Saturday, 14 June · The Garden Pavilion
        </span>
      </span>
      <span className="mt-1.5 block text-[11px] opacity-60" style={{ fontFamily: "var(--font-sans)" }}>
        {pairing.name}
      </span>
    </button>
  );
}

/** Curated font pairings shown with a live sample in the invitation's own colors. */
export function PairingCards({ allowed, styles, design, onSelect }: PairingCardsProps) {
  const offered = fontPairings.filter((p) => allowed === "any" || allowed.includes(p.id));
  const score = (p: FontPairing) => p.tags.filter((t) => styles.includes(t)).length;
  const sorted = [...offered].sort((a, b) => score(b) - score(a));

  return (
    <div role="group" aria-label="Font pairings" className="grid gap-2">
      {sorted.map((p) => (
        <PairingCard key={p.id} pairing={p} design={design} active={isActive(p, design)} onSelect={() => onSelect(p)} />
      ))}
    </div>
  );
}
