import { dateParts, fitSize, formatTime, joinText, splitHostNames } from "@/lib/invitationFormat";
import { resolveFont } from "@/lib/fonts";
import type { TemplateProps } from "@/types/invitation";
import { Kit } from "../../../kit/Kit";
import { FitBox } from "../../../layouts/FitBox";

export function FloralWedding({ content, design }: TemplateProps) {
  const [first, second] = splitHostNames(content.hostNames);
  const d = dateParts(content.date);
  const dateText = d ? `${d.month} ${d.day}, ${d.year}` : content.date;
  const heading = { fontFamily: resolveFont(design.headingFont) };
  const names = design.scriptFont ? { fontFamily: resolveFont(design.scriptFont), fontStyle: "normal" as const } : heading;
  const longest = Math.max(first?.length ?? 0, (second?.length ?? 0) + 2);
  const has = (id: string) => design.decorations?.includes(id) ?? false;

  return (
    <>
      {has("sprigs") && (
        <>
          <Kit kind="botanical" id="sprig" design={design} className="absolute -left-[3cqw] -top-[3cqw] w-[36cqw] -scale-x-100" />
          <Kit kind="botanical" id="sprig" design={design} className="absolute -bottom-[3cqw] -right-[3cqw] w-[36cqw] rotate-180 -scale-x-100" />
        </>
      )}
      {has("corner-bouquet") && <Kit kind="botanical" id="corner-bouquet" design={design} className="absolute -right-[4cqw] -top-[4cqw] w-[44cqw] -scale-y-100 -scale-x-100" />}
      {has("garland") && <Kit kind="botanical" id="leaf-garland" design={design} className="absolute inset-x-0 top-[2cqw] h-auto w-full" />}
      <FitBox className="absolute inset-x-0 bottom-[9cqw] top-[24cqw]" origin="top left" innerClassName="flex flex-col justify-center pl-[12cqw] pr-[24cqw]">
        {content.eventTitle && (
          <p className="text-[2.6cqw] uppercase tracking-[0.28em]" style={{ color: design.accentColor }}>
            {content.eventTitle}
          </p>
        )}
        <h3 className="mt-[5cqw] font-normal italic leading-[0.95]" style={{ ...names, fontSize: fitSize(14, "x".repeat(longest), 9) }}>
          {first}
          {second && <span className="block pl-[10cqw]">&amp; {second}</span>}
        </h3>
        <p className="mt-[8cqw] text-[5cqw]" style={heading}>
          {dateText}
        </p>
        <p className="text-[3.8cqw] opacity-75" style={heading}>
          {joinText([content.venue, content.time && formatTime(content.time)])}
        </p>
        {content.message && (
          <p className="mt-[5cqw] max-w-[48cqw] text-[3cqw] leading-relaxed opacity-80">{content.message}</p>
        )}
        {content.additionalDetails && <p className="mt-[3cqw] max-w-[48cqw] text-[2.5cqw] opacity-65">{content.additionalDetails}</p>}
      </FitBox>
    </>
  );
}
