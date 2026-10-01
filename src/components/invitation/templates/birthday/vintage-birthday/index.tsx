import { dateParts, fitSize, formatTime, joinText } from "@/lib/invitationFormat";
import { pickReadable } from "@/lib/color";
import { resolveFont } from "@/lib/fonts";
import type { TemplateProps } from "@/types/invitation";
import { Kit } from "../../../kit/Kit";
import { FitBox } from "../../../layouts/FitBox";

/** A vintage poster: a wreath, a fat display name, a ribbon banner and engraved small caps. */
export function VintageBirthday({ content, design }: TemplateProps) {
  const d = dateParts(content.date);
  const heading = { fontFamily: resolveFont(design.headingFont) };
  const has = (id: string) => design.decorations?.includes(id) ?? false;
  const dateLine = d ? `${d.weekday}, ${d.month} ${d.day}, ${d.year}` : content.date;
  const corner = "absolute size-[11cqw]";

  return (
    <>
      {has("laurel") && <Kit kind="ornament" id="laurel" design={design} className="absolute left-1/2 top-[19cqw] size-[74cqw] -translate-x-1/2" opacity={0.28} />}
      {has("corners") && (
        <>
          <Kit kind="ornament" id="corner-flourish" design={design} className={`${corner} left-[8cqw] top-[8cqw]`} />
          <Kit kind="ornament" id="corner-flourish" design={design} className={`${corner} right-[8cqw] top-[8cqw] rotate-90`} />
          <Kit kind="ornament" id="corner-flourish" design={design} className={`${corner} bottom-[8cqw] right-[8cqw] rotate-180`} />
          <Kit kind="ornament" id="corner-flourish" design={design} className={`${corner} bottom-[8cqw] left-[8cqw] -rotate-90`} />
        </>
      )}
      <FitBox className={has("corners") ? "absolute inset-x-0 inset-y-[21cqw]" : "absolute inset-x-0 inset-y-[11cqw]"} innerClassName="flex flex-col items-center justify-center px-[15cqw] text-center">
        <p className="text-[2.4cqw] uppercase tracking-[0.32em]" style={{ color: design.accentColor }}>
          You are cordially invited
        </p>
        <Kit kind="ornament" id="divider-dots" design={design} className="my-[3cqw] h-auto w-[26cqw]" />
        <h3 className="max-w-full leading-[0.95]" style={{ ...heading, fontSize: fitSize(15, content.hostNames, 9) }}>
          {content.hostNames}
        </h3>
        {content.eventTitle && (
          <div className="relative mt-[5cqw] w-[66cqw]">
            <Kit kind="ornament" id="ribbon" design={design} className="block h-auto w-full" />
            <FitBox className="absolute inset-x-[12cqw] inset-y-[3cqw]" innerClassName="grid place-items-center text-center uppercase tracking-[0.12em]">
              <span style={{ ...heading, color: pickReadable(design.accentColor, design.backgroundColor, design.textColor), fontSize: "4.2cqw" }}>{content.eventTitle}</span>
            </FitBox>
          </div>
        )}
        <p className="mt-[6cqw] leading-tight" style={{ ...heading, fontSize: fitSize(4.6, dateLine, 26) }}>
          {dateLine}
        </p>
        <p className="mt-[1.6cqw] text-[2.7cqw] uppercase tracking-[0.2em] opacity-80">{joinText([content.time && formatTime(content.time), content.venue])}</p>
        {content.address && <p className="mt-[0.8cqw] text-[2.4cqw] opacity-65">{content.address}</p>}
        {content.message && <p className="mt-[4cqw] max-w-[64cqw] text-[3cqw] italic leading-relaxed opacity-85">{content.message}</p>}
        {content.additionalDetails && <p className="mt-[2cqw] max-w-[64cqw] text-[2.3cqw] uppercase tracking-[0.14em] opacity-60">{content.additionalDetails}</p>}
      </FitBox>
      {has("seal") && <Kit kind="ornament" id="seal" design={design} className="absolute bottom-[10cqw] right-[11cqw] size-[15cqw] rotate-12" />}
    </>
  );
}
