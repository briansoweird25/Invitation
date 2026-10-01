import { dateParts, fitSize, formatTime, joinText, splitHostNames } from "@/lib/invitationFormat";
import { pickReadable } from "@/lib/color";
import { resolveFont } from "@/lib/fonts";
import type { TemplateProps } from "@/types/invitation";
import { Kit } from "../../../kit/Kit";
import { FitBox } from "../../../layouts/FitBox";

/** Framed card with a foil monogram seal, wide-tracked capitals and fine rules. */
export function LuxuryWedding({ content, design }: TemplateProps) {
  const [first = "", second] = splitHostNames(content.hostNames);
  const d = dateParts(content.date);
  const heading = { fontFamily: resolveFont(design.headingFont) };
  const has = (id: string) => design.decorations?.includes(id) ?? false;
  const initials = [first, second].filter(Boolean).map((n) => n.trim().charAt(0).toUpperCase());
  const dateLine = d ? `${d.day} ${d.month} ${d.year}` : content.date;
  const corner = "absolute size-[11cqw]";

  return (
    <>
      {has("corners") && (
        <>
          <Kit kind="ornament" id="corner-flourish" design={design} className={`${corner} left-[9cqw] top-[9cqw]`} />
          <Kit kind="ornament" id="corner-flourish" design={design} className={`${corner} right-[9cqw] top-[9cqw] rotate-90`} />
          <Kit kind="ornament" id="corner-flourish" design={design} className={`${corner} bottom-[9cqw] right-[9cqw] rotate-180`} />
          <Kit kind="ornament" id="corner-flourish" design={design} className={`${corner} bottom-[9cqw] left-[9cqw] -rotate-90`} />
        </>
      )}
      <FitBox className={has("corners") ? "absolute inset-x-0 inset-y-[22cqw]" : "absolute inset-x-0 inset-y-[11cqw]"} innerClassName="flex flex-col items-center justify-center px-[15cqw] text-center">
        {content.eventTitle && (
          <p className="text-[2.4cqw] uppercase tracking-[0.34em]" style={{ color: design.accentColor }}>
            {content.eventTitle}
          </p>
        )}
        {has("monogram") && initials.length > 0 && (
          <div className="relative mt-[5cqw] size-[19cqw]">
            <Kit kind="ornament" id="seal" design={design} className="absolute inset-0 size-full" />
            <span className="absolute inset-0 grid place-items-center text-[5.4cqw] tracking-[0.1em]" style={{ ...heading, color: pickReadable(design.accentColor, design.backgroundColor, design.textColor) }}>
              {initials.join(" ")}
            </span>
          </div>
        )}
        <h3 className="mt-[6cqw] uppercase leading-[1.15] tracking-[0.16em]" style={{ ...heading, fontSize: fitSize(8.6, first.length > (second?.length ?? 0) ? first : (second ?? ""), 9) }}>
          {first}
          {second && (
            <span className="my-[1.6cqw] block text-[3.4cqw] tracking-normal" style={{ color: design.accentColor }}>
              &amp;
            </span>
          )}
          {second}
        </h3>
        {has("divider") ? (
          <Kit kind="ornament" id="divider-diamond" design={design} className="my-[5cqw] h-auto w-[34cqw]" />
        ) : (
          <div className="my-[5cqw] h-px w-[16cqw]" style={{ backgroundColor: design.accentColor, opacity: 0.8 }} />
        )}
        {d && (
          <p className="text-[2.6cqw] uppercase tracking-[0.34em]" style={{ color: design.accentColor }}>
            {d.weekday}
          </p>
        )}
        <p className="mt-[1.4cqw] uppercase tracking-[0.14em]" style={{ ...heading, fontSize: fitSize(5, dateLine, 16) }}>
          {dateLine}
        </p>
        <p className="mt-[2cqw] text-[2.6cqw] uppercase tracking-[0.22em] opacity-80">{joinText([content.venue, content.time && formatTime(content.time)])}</p>
        {content.message && <p className="mt-[5cqw] max-w-[62cqw] text-[3cqw] italic leading-relaxed opacity-80">{content.message}</p>}
        {content.additionalDetails && <p className="mt-[3cqw] max-w-[62cqw] text-[2.3cqw] uppercase tracking-[0.16em] opacity-60">{content.additionalDetails}</p>}
      </FitBox>
    </>
  );
}
