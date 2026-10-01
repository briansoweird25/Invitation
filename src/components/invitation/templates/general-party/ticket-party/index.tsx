import { accentText, pickReadable } from "@/lib/color";
import { fitSize, formatDate, formatTime } from "@/lib/invitationFormat";
import { resolveFont } from "@/lib/fonts";
import type { TemplateProps } from "@/types/invitation";
import { Kit } from "../../../kit/Kit";
import { FitBox } from "../../../layouts/FitBox";

/** A big admit-one ticket: a headline, a perforated line and a stub with the date and place. */
export function TicketParty({ content, design }: TemplateProps) {
  const heading = { fontFamily: resolveFont(design.headingFont) };
  const has = (id: string) => design.decorations?.includes(id) ?? false;
  const stubText = pickReadable(design.accentColor, design.backgroundColor, design.textColor);
  const dateText = formatDate(content.date, "month-day");

  return (
    <>
      {has("burst") && <Kit kind="shape" id="starburst" design={design} color={design.secondaryColor ?? design.accentColor} className="absolute right-[7cqw] top-[24cqw] size-[24cqw] rotate-12" />}
      {has("sparkles") && <Kit kind="ornament" id="sparkle" design={design} className="absolute right-[11cqw] top-[15cqw] size-[6cqw]" />}
      <FitBox className="absolute inset-x-0 bottom-[66cqw] top-[10cqw]" origin="top" innerClassName="flex flex-col px-[11cqw]">
        <div className="flex justify-between gap-[3cqw] border-b border-dashed pb-[2.4cqw] text-[2.5cqw] uppercase tracking-[0.28em]" style={{ borderColor: design.textColor }}>
          <span>Admit all</span>
          <span style={{ color: accentText(design) }}>One night only</span>
        </div>
        <p className="mt-[5cqw] max-w-[66cqw] uppercase leading-[0.9]" style={{ ...heading, fontSize: fitSize(13, content.eventTitle, 14) }}>
          {content.eventTitle}
        </p>
        <p className="mt-[3.5cqw] text-[2.6cqw] uppercase tracking-[0.22em] opacity-70">Hosted by</p>
        <p className="leading-tight" style={{ ...heading, fontSize: fitSize(6.2, content.hostNames, 18) }}>
          {content.hostNames}
        </p>
      </FitBox>
      <div className="absolute inset-x-[7cqw] top-[63cqw] border-t-[0.5cqw] border-dashed" style={{ borderColor: design.accentColor }} aria-hidden="true" />
      <FitBox className="absolute inset-x-0 bottom-[11cqw] top-[67cqw]" origin="top" innerClassName="flex flex-col justify-center px-[11cqw]">
        <div className="grid grid-cols-[auto_1fr] items-center gap-[5cqw]">
          <div className="px-[3.5cqw] py-[3cqw] text-center leading-none" style={{ ...heading, backgroundColor: design.accentColor, color: stubText, fontSize: fitSize(6.4, dateText, 9) }}>
            {dateText}
            <span className="mt-[1.4cqw] block text-[2.6cqw] tracking-[0.2em]">{d4(content.date)}</span>
          </div>
          <div className="min-w-0 text-[3.2cqw] leading-snug">
            {content.time && <p style={heading}>{formatTime(content.time)}</p>}
            <p>{content.venue}</p>
            {content.address && <p className="text-[2.6cqw] opacity-70">{content.address}</p>}
          </div>
        </div>
        {content.message && <p className="mt-[4cqw] max-w-[68cqw] text-[2.9cqw] leading-snug">{content.message}</p>}
        {content.additionalDetails && <p className="mt-[1.5cqw] max-w-[68cqw] text-[2.3cqw] opacity-70">{content.additionalDetails}</p>}
      </FitBox>
    </>
  );
}

/** The year of an ISO date, or an empty string for text that is not a date. */
function d4(date: string): string {
  return /^\d{4}/.test(date) ? date.slice(0, 4) : "";
}
