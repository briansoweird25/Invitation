import { accentText, pickReadable } from "@/lib/color";
import { fitSize, formatDate, formatTime, joinText } from "@/lib/invitationFormat";
import { resolveFont } from "@/lib/fonts";
import type { TemplateProps } from "@/types/invitation";
import { Kit } from "../../../kit/Kit";
import { FitBox } from "../../../layouts/FitBox";

/** A varsity poster: a solid banner for the headline, a huge stacked name and stripe bands along the foot. */
export function VarsityGraduation({ content, design }: TemplateProps) {
  const heading = { fontFamily: resolveFont(design.headingFont) };
  const has = (id: string) => design.decorations?.includes(id) ?? false;
  const bannerText = pickReadable(design.accentColor, design.backgroundColor, design.textColor);
  const second = design.secondaryColor ?? design.textColor;

  return (
    <>
      <div className="absolute inset-x-0 top-0 h-[32cqw]" style={{ backgroundColor: design.accentColor }} aria-hidden="true" />
      <FitBox className="absolute inset-x-0 top-[9.6cqw] h-[12.8cqw]" innerClassName="flex items-center justify-center px-[9cqw] text-center">
        <p className="uppercase leading-none tracking-[0.06em]" style={{ ...heading, color: bannerText, fontSize: fitSize(10, content.eventTitle, 14) }}>
          {content.eventTitle}
        </p>
      </FitBox>
      {has("stars") && (
        <>
          <Kit kind="ornament" id="sparkle" design={design} color={design.accentColor} className="absolute bottom-[14cqw] right-[7cqw] size-[8cqw]" />
          <Kit kind="ornament" id="sparkle" design={design} color={second} className="absolute bottom-[19cqw] right-[15cqw] size-[4.5cqw]" />
        </>
      )}
      {has("stripes") && (
        <div className="absolute inset-x-0 bottom-0" aria-hidden="true">
          <div className="h-[1cqw]" style={{ backgroundColor: second }} />
          <div className="h-[1.6cqw]" />
          <div className="h-[3.4cqw]" style={{ backgroundColor: design.accentColor }} />
        </div>
      )}
      <FitBox className="absolute inset-x-0 bottom-[14cqw] top-[36cqw]" origin="top" innerClassName="flex flex-col justify-between gap-[6cqw] px-[9cqw]">
        <div>
          <p className="text-[2.6cqw] uppercase tracking-[0.3em]" style={{ color: accentText(design) }}>
            Please join us to celebrate
          </p>
          <h3 className="mt-[3cqw] max-w-full uppercase leading-[0.9] tracking-tight" style={{ ...heading, fontSize: fitSize(19, content.hostNames, 14) }}>
            {content.hostNames}
          </h3>
        </div>
        <div className="border-t-[0.6cqw] pt-[3.5cqw]" style={{ borderColor: design.textColor }}>
          <p className="uppercase tracking-[0.08em]" style={{ ...heading, fontSize: fitSize(5.4, formatDate(content.date, "full-us"), 16) }}>
            {formatDate(content.date, "full-us")}
          </p>
          <p className="mt-[1cqw] text-[3.1cqw] leading-snug">{joinText([content.time && formatTime(content.time), content.venue], " at ")}</p>
          {content.address && <p className="text-[2.7cqw] opacity-70">{content.address}</p>}
          {content.message && <p className="mt-[3.5cqw] max-w-[66cqw] text-[3cqw] leading-snug">{content.message}</p>}
          {content.additionalDetails && <p className="mt-[1.5cqw] max-w-[66cqw] text-[2.4cqw] opacity-70">{content.additionalDetails}</p>}
        </div>
      </FitBox>
    </>
  );
}
