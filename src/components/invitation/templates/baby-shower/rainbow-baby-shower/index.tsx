import { dateParts, fitSize, formatTime, joinText } from "@/lib/invitationFormat";
import { accentText } from "@/lib/color";
import { resolveFont } from "@/lib/fonts";
import type { TemplateProps } from "@/types/invitation";
import { Kit } from "../../../kit/Kit";

/** A rainbow over soft clouds, with the details centered underneath. */
export function RainbowBabyShower({ content, design }: TemplateProps) {
  const d = dateParts(content.date);
  const heading = { fontFamily: resolveFont(design.headingFont) };
  const has = (id: string) => design.decorations?.includes(id) ?? false;
  const second = design.secondaryColor ?? design.accentColor;
  const bands: [string, number][] = [
    [design.accentColor, 1],
    [second, 1],
    [design.accentColor, 0.55],
    [second, 0.55],
  ];
  const dateLine = d ? `${d.monthShort} ${d.day}, ${d.year}` : content.date;

  return (
    <>
      <svg aria-hidden="true" focusable="false" viewBox="0 0 100 56" className="absolute left-1/2 top-[8cqw] w-[86cqw] -translate-x-1/2" fill="none">
        {bands.map(([color, opacity], i) => {
          const r = 46 - i * 8.5;
          return <path key={i} d={`M${50 - r} 52A${r} ${r} 0 0 1 ${50 + r} 52`} stroke={color} strokeWidth="7.4" opacity={opacity} />;
        })}
        {has("clouds") && (
          <g fill="#fff" opacity="0.95">
            <ellipse cx="9" cy="52" rx="10" ry="5" />
            <ellipse cx="16" cy="49" rx="7" ry="5" />
            <ellipse cx="91" cy="52" rx="10" ry="5" />
            <ellipse cx="84" cy="49" rx="7" ry="5" />
          </g>
        )}
      </svg>
      {has("sparkles") && (
        <>
          <Kit kind="ornament" id="sparkle" design={design} color={design.secondaryColor} className="absolute left-[8cqw] top-[40cqw] size-[10cqw]" />
          <Kit kind="ornament" id="sparkle" design={design} className="absolute right-[9cqw] top-[44cqw] size-[8cqw]" />
        </>
      )}
      <div className="absolute inset-x-0 bottom-[10cqw] top-[55cqw] flex flex-col items-center justify-center overflow-hidden px-[14cqw] text-center">
        {content.eventTitle && (
          <p className="line-clamp-2 text-[3cqw] font-semibold uppercase tracking-[0.2em]" style={{ color: accentText(design) }}>
            {content.eventTitle}
          </p>
        )}
        <h3 className="mt-[2cqw] max-w-full break-words font-bold leading-[1]" style={{ ...heading, fontSize: fitSize(13, content.hostNames, 10) }}>
          {content.hostNames}
        </h3>
        <p className="mt-[4cqw] font-semibold" style={{ ...heading, fontSize: fitSize(5, dateLine, 16) }}>
          {dateLine}
        </p>
        <p className="mt-[1.4cqw] line-clamp-2 text-[3cqw] font-medium">{joinText([content.time && formatTime(content.time), content.venue])}</p>
        {content.message && <p className="mt-[3.5cqw] line-clamp-2 max-w-[66cqw] text-[3cqw] leading-snug opacity-85">{content.message}</p>}
        {content.additionalDetails && <p className="mt-[1.6cqw] line-clamp-1 max-w-[66cqw] text-[2.4cqw] opacity-65">{content.additionalDetails}</p>}
      </div>
    </>
  );
}
