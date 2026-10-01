import { accentText } from "@/lib/color";
import { fitSize, formatDate, formatTime, joinText } from "@/lib/invitationFormat";
import { resolveFont } from "@/lib/fonts";
import type { TemplateProps } from "@/types/invitation";
import { Kit } from "../../../kit/Kit";
import { FitBox } from "../../../layouts/FitBox";

/** A relaxed, hand-lettered card: big chalk-style headline, a squiggle underline and left-aligned details. */
export function ChalkboardGraduation({ content, design }: TemplateProps) {
  const heading = { fontFamily: resolveFont(design.headingFont) };
  const hand = { fontFamily: resolveFont(design.scriptFont ?? design.headingFont) };
  const has = (id: string) => design.decorations?.includes(id) ?? false;

  return (
    <>
      {has("sparkles") && (
        <>
          <Kit kind="ornament" id="sparkle" design={design} className="absolute right-[9cqw] top-[9cqw] size-[12cqw]" />
          <Kit kind="ornament" id="sparkle" design={design} color={design.secondaryColor} className="absolute right-[22cqw] top-[17cqw] size-[6cqw]" />
        </>
      )}
      <FitBox className="absolute inset-x-0 inset-y-[10cqw]" origin="top" innerClassName="flex flex-col px-[10cqw]">
        <p className="mt-[6cqw] max-w-[72cqw] uppercase leading-[0.85]" style={{ ...heading, color: accentText(design), fontSize: fitSize(21, content.eventTitle, 14) }}>
          {content.eventTitle}
        </p>
        {has("squiggle") && <Kit kind="shape" id="squiggle" design={design} color={design.secondaryColor ?? design.accentColor} className="mt-[3cqw] h-auto w-[34cqw]" />}
        <p className="mt-[6cqw] text-[3.6cqw] uppercase tracking-[0.25em] opacity-70">We are celebrating</p>
        <h3 className="mt-[1.5cqw] max-w-full leading-[0.95]" style={{ ...hand, fontSize: fitSize(13, content.hostNames, 12) }}>
          {content.hostNames}
        </h3>
        <div className="mt-[7cqw] grid gap-[1.5cqw]" style={heading}>
          <p style={{ fontSize: fitSize(8.4, formatDate(content.date, "long-us"), 20) }}>{formatDate(content.date, "long-us")}</p>
          <p className="text-[5.6cqw] opacity-85">{joinText([content.time && formatTime(content.time), content.venue])}</p>
          {content.address && <p className="text-[4.6cqw] opacity-70">{content.address}</p>}
        </div>
        {content.message && <p className="mt-[5cqw] max-w-[66cqw] text-[3cqw] leading-snug" style={hand}>{content.message}</p>}
        {content.additionalDetails && <p className="mt-[1.5cqw] max-w-[66cqw] text-[2.4cqw] opacity-70">{content.additionalDetails}</p>}
      </FitBox>
    </>
  );
}
