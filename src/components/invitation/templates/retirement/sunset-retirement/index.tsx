import { accentText } from "@/lib/color";
import { fitSize, formatDate, whenWhere } from "@/lib/invitationFormat";
import { resolveFont } from "@/lib/fonts";
import type { TemplateProps } from "@/types/invitation";
import { FitBox } from "../../../layouts/FitBox";

/** A low sun with soft rings rises from the foot of the card; the name and details sit above it. */
export function SunsetRetirement({ content, design }: TemplateProps) {
  const heading = { fontFamily: resolveFont(design.headingFont) };
  const has = (id: string) => design.decorations?.includes(id) ?? false;
  const second = design.secondaryColor ?? design.accentColor;
  const sun = (width: number, color: string, opacity: number) => (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-full" style={{ width: `${width}cqw`, height: `${width / 2}cqw`, backgroundColor: color, opacity }} aria-hidden="true" />
  );

  return (
    <>
      {has("rings") && (
        <>
          {sun(118, second, 0.14)}
          {sun(92, second, 0.22)}
          {sun(66, design.accentColor, 0.35)}
        </>
      )}
      {has("sun") && sun(40, design.accentColor, 1)}
      <FitBox className="absolute inset-x-[10cqw] bottom-[52cqw] top-[12cqw]" origin="top left" innerClassName="flex flex-col justify-start">
        <p className="text-[2.7cqw] uppercase tracking-[0.3em]" style={{ color: accentText(design) }}>
          Please join us to celebrate
        </p>
        <h3 className="mt-[3cqw] max-w-full uppercase leading-[0.92] tracking-tight" style={{ ...heading, fontSize: fitSize(15, content.hostNames, 10) }}>
          {content.hostNames}
        </h3>
        <p className="mt-[2.5cqw] italic leading-tight" style={{ ...heading, fontSize: fitSize(8, content.eventTitle, 14) }}>
          {content.eventTitle}
        </p>
        <p className="mt-[5cqw] uppercase tracking-[0.12em]" style={{ ...heading, fontSize: fitSize(4.2, formatDate(content.date, "full-us"), 18) }}>
          {formatDate(content.date, "full-us")}
        </p>
        <p className="mt-[1.4cqw] text-[3cqw] opacity-85">{whenWhere(content)}</p>
        {content.address && <p className="text-[2.5cqw] opacity-65">{content.address}</p>}
        {content.message && <p className="mt-[3cqw] max-w-[70cqw] text-[2.8cqw] leading-relaxed">{content.message}</p>}
        {content.additionalDetails && <p className="mt-[1.5cqw] max-w-[70cqw] text-[2.3cqw] opacity-65">{content.additionalDetails}</p>}
      </FitBox>
    </>
  );
}
