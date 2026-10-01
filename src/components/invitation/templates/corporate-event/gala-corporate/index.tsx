import { accentText, pickReadable } from "@/lib/color";
import { dateParts, fitSize, formatTime } from "@/lib/invitationFormat";
import { resolveFont } from "@/lib/fonts";
import type { TemplateProps } from "@/types/invitation";
import { Kit } from "../../../kit/Kit";
import { FitBox } from "../../../layouts/FitBox";

/** A tall date column on the left, in the accent color, and the invitation text on the right. */
export function GalaCorporate({ content, design }: TemplateProps) {
  const heading = { fontFamily: resolveFont(design.headingFont) };
  const d = dateParts(content.date);
  const onPanel = pickReadable(design.accentColor, design.backgroundColor, design.textColor);

  return (
    <>
      <div className="absolute inset-y-0 left-0 w-[34cqw]" style={{ backgroundColor: design.accentColor }} aria-hidden="true" />
      <FitBox className="absolute inset-y-[12cqw] left-[8cqw] w-[20cqw]" innerClassName="flex flex-col items-center justify-start text-center">
        {d ? (
          <div style={{ ...heading, color: onPanel }}>
            <p className="text-[2.6cqw] uppercase tracking-[0.2em]">{d.weekdayShort}</p>
            <p className="mt-[1cqw] leading-none" style={{ fontSize: "15cqw" }}>{d.day}</p>
            <p className="mt-[2cqw] text-[3.2cqw] uppercase tracking-[0.2em]">{d.monthShort}</p>
            <p className="mt-[1cqw] text-[2.6cqw] tracking-[0.2em] opacity-80">{d.year}</p>
          </div>
        ) : (
          <p className="text-[3cqw]" style={{ ...heading, color: onPanel }}>{content.date}</p>
        )}
      </FitBox>
      <FitBox className="absolute inset-y-[12cqw] left-[42cqw] right-[9cqw]" innerClassName="flex flex-col justify-center">
        <p className="text-[2.5cqw] uppercase tracking-[0.3em]" style={{ color: accentText(design) }}>
          {content.hostNames}
        </p>
        <Kit kind="ornament" id="divider-diamond" design={design} className="my-[3cqw] h-auto w-[24cqw] self-start" />
        <h3 className="max-w-full uppercase leading-[1.02] tracking-[0.04em]" style={{ ...heading, fontSize: fitSize(8, content.eventTitle, 14) }}>
          {content.eventTitle}
        </h3>
        <p className="mt-[5cqw] text-[3cqw] leading-snug opacity-90">{content.time && formatTime(content.time)}</p>
        <p className="text-[3cqw] leading-snug">{content.venue}</p>
        {content.address && <p className="text-[2.5cqw] opacity-65">{content.address}</p>}
        {content.message && <p className="mt-[4cqw] text-[2.7cqw] italic leading-relaxed opacity-90">{content.message}</p>}
        {content.additionalDetails && <p className="mt-[1.5cqw] text-[2.3cqw] opacity-65">{content.additionalDetails}</p>}
      </FitBox>
    </>
  );
}
