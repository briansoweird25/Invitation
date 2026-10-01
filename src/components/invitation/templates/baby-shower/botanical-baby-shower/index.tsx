import { dateParts, fitSize, formatTime, joinText } from "@/lib/invitationFormat";
import { accentText } from "@/lib/color";
import { resolveFont } from "@/lib/fonts";
import type { TemplateProps } from "@/types/invitation";
import { Kit } from "../../../kit/Kit";
import { FitBox } from "../../../layouts/FitBox";

/** An arched window with the details inside and soft foliage growing up from the corners. */
export function BotanicalBabyShower({ content, design }: TemplateProps) {
  const d = dateParts(content.date);
  const heading = { fontFamily: resolveFont(design.headingFont) };
  const names = design.scriptFont ? { fontFamily: resolveFont(design.scriptFont), fontStyle: "normal" as const } : { ...heading, fontStyle: "italic" as const };
  const has = (id: string) => design.decorations?.includes(id) ?? false;
  const dateLine = d ? `${d.weekday}, ${d.month} ${d.day}` : content.date;

  return (
    <>
      {has("branches") && (
        <>
          <Kit kind="botanical" id="eucalyptus" design={design} className="absolute -left-[5cqw] bottom-[3cqw] w-[36cqw]" />
          <Kit kind="botanical" id="fern" design={design} className="absolute -right-[5cqw] bottom-[3cqw] w-[34cqw] -scale-x-100" />
        </>
      )}
      {has("bouquet") && <Kit kind="botanical" id="corner-bouquet" design={design} className="absolute -bottom-[3cqw] -left-[4cqw] w-[42cqw]" />}
      {content.eventTitle && (
        <FitBox className="absolute inset-x-[14cqw] top-[8cqw] h-[11cqw]" innerClassName="grid place-items-center text-center">
          <p className="text-[2.6cqw] uppercase tracking-[0.28em]" style={{ color: accentText(design) }}>
            {content.eventTitle}
          </p>
        </FitBox>
      )}
      <FitBox className="absolute inset-x-[27cqw] bottom-[16cqw] top-[33cqw]" innerClassName="flex flex-col items-center justify-center text-center">
        <h3 className="max-w-full leading-[1.02]" style={{ ...names, fontSize: fitSize(10.5, content.hostNames, 9) }}>
          {content.hostNames}
        </h3>
        <div className="my-[4cqw] h-px w-[10cqw]" style={{ backgroundColor: design.accentColor }} />
        <p className="leading-tight" style={{ ...heading, fontSize: fitSize(4.4, dateLine, 18) }}>
          {dateLine}
        </p>
        <p className="mt-[1.4cqw] text-[2.6cqw] uppercase tracking-[0.16em] opacity-80">{joinText([content.time && formatTime(content.time), content.venue])}</p>
        {content.message && <p className="mt-[4cqw] text-[2.8cqw] leading-relaxed opacity-85">{content.message}</p>}
        {content.additionalDetails && <p className="mt-[2cqw] text-[2.2cqw] opacity-65">{content.additionalDetails}</p>}
      </FitBox>
    </>
  );
}
