import { accentText } from "@/lib/color";
import { fitSize, formatDate, formatTime } from "@/lib/invitationFormat";
import { resolveFont } from "@/lib/fonts";
import type { TemplateProps } from "@/types/invitation";
import { Kit } from "../../../kit/Kit";
import { FitBox } from "../../../layouts/FitBox";

/** A Swiss-style grid: the company in small type, a big left-aligned event name and a ruled detail table. */
export function SummitCorporate({ content, design }: TemplateProps) {
  const heading = { fontFamily: resolveFont(design.headingFont) };
  const has = (id: string) => design.decorations?.includes(id) ?? false;
  const rule = { borderColor: design.textColor };
  const row = (name: string, value: string | undefined, sub?: string) =>
    value ? (
      <div className="grid grid-cols-[18cqw_1fr] gap-[3cqw] border-t py-[2.4cqw]" style={rule}>
        <p className="text-[2.2cqw] uppercase tracking-[0.2em] opacity-60">{name}</p>
        <div className="min-w-0 text-[3.1cqw] leading-snug">
          <p>{value}</p>
          {sub && <p className="text-[2.5cqw] opacity-65">{sub}</p>}
        </div>
      </div>
    ) : null;

  return (
    <>
      {has("blocks") && (
        <>
          <Kit kind="shape" id="square" design={design} color={design.accentColor} className="absolute right-[9cqw] top-[9cqw] size-[10cqw]" />
          <Kit kind="shape" id="half-circle" design={design} color={design.textColor} opacity={0.9} className="absolute right-[20cqw] top-[7cqw] size-[10cqw]" />
        </>
      )}
      <FitBox className="absolute inset-x-[9cqw] inset-y-[9cqw]" origin="top left" innerClassName="flex flex-col justify-between gap-[6cqw]">
        <div>
          <p className="max-w-[56cqw] text-[2.6cqw] uppercase tracking-[0.24em]">{content.hostNames}</p>
          <h3 className="mt-[18cqw] max-w-full leading-[0.95] tracking-tight" style={{ ...heading, fontSize: fitSize(13.5, content.eventTitle, 14) }}>
            {content.eventTitle}
          </h3>
          {content.message && <p className="mt-[4cqw] max-w-[58cqw] text-[3cqw] leading-snug" style={{ color: accentText(design) }}>{content.message}</p>}
        </div>
        <div>
          {row("Date", formatDate(content.date, "long"))}
          {row("Time", content.time && formatTime(content.time))}
          {row("Venue", content.venue, content.address)}
          {content.additionalDetails && row("Notes", content.additionalDetails)}
          <div className="border-t" style={rule} />
        </div>
      </FitBox>
    </>
  );
}
