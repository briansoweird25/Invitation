import { pickReadable } from "@/lib/color";
import { fitSize, formatDate, whenWhere } from "@/lib/invitationFormat";
import { resolveFont } from "@/lib/fonts";
import type { TemplateProps } from "@/types/invitation";
import { Kit } from "../../../kit/Kit";
import { FitBox } from "../../../layouts/FitBox";

/** A split card: a rounded color panel with the headline and name on top, light details below. */
export function BubblyBridalShower({ content, design }: TemplateProps) {
  const heading = { fontFamily: resolveFont(design.headingFont) };
  const names = design.scriptFont ? { fontFamily: resolveFont(design.scriptFont), fontStyle: "normal" as const } : heading;
  const has = (id: string) => design.decorations?.includes(id) ?? false;
  const onPanel = pickReadable(design.accentColor, design.backgroundColor, design.textColor);
  const bubble = design.secondaryColor ?? design.backgroundColor;

  return (
    <>
      <div className="absolute inset-x-0 top-0 h-[66cqw] rounded-b-[26cqw]" style={{ backgroundColor: design.accentColor }} aria-hidden="true" />
      {has("bubbles") && (
        <>
          <Kit kind="shape" id="circle" design={design} color={bubble} opacity={0.35} className="absolute -left-[6cqw] top-[6cqw] size-[24cqw]" />
          <Kit kind="shape" id="circle" design={design} color={bubble} opacity={0.35} className="absolute right-[3cqw] top-[30cqw] size-[13cqw]" />
          <Kit kind="shape" id="circle" design={design} color={bubble} opacity={0.35} className="absolute right-[18cqw] top-[3cqw] size-[8cqw]" />
        </>
      )}
      {has("hearts") && <Kit kind="shape" id="heart" design={design} className="absolute bottom-[9cqw] left-1/2 size-[6cqw] -translate-x-1/2" />}
      <FitBox className="absolute inset-x-0 top-[11cqw] h-[44cqw]" innerClassName="flex flex-col items-center justify-center px-[13cqw] text-center" >
        <p className="text-[2.6cqw] uppercase tracking-[0.3em]" style={{ color: onPanel }}>
          {content.eventTitle}
        </p>
        <h3 className="mt-[2cqw] max-w-full leading-[1.02]" style={{ ...names, color: onPanel, fontSize: fitSize(15, content.hostNames, 8) }}>
          {content.hostNames}
        </h3>
      </FitBox>
      <FitBox className="absolute inset-x-0 bottom-[17cqw] top-[72cqw]" innerClassName="flex flex-col items-center justify-center px-[13cqw] text-center">
        <p className="uppercase tracking-[0.14em]" style={{ ...heading, fontSize: fitSize(4.6, formatDate(content.date, "long-us"), 18) }}>
          {formatDate(content.date, "long-us")}
        </p>
        <p className="mt-[1.6cqw] text-[3cqw] opacity-85">{whenWhere(content)}</p>
        {content.address && <p className="text-[2.5cqw] opacity-65">{content.address}</p>}
        {content.message && <p className="mt-[3cqw] max-w-[66cqw] text-[2.8cqw] leading-relaxed">{content.message}</p>}
        {content.additionalDetails && <p className="mt-[1.5cqw] max-w-[66cqw] text-[2.3cqw] opacity-65">{content.additionalDetails}</p>}
      </FitBox>
    </>
  );
}
