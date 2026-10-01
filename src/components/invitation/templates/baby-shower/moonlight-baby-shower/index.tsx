import { dateParts, fitSize, formatTime, joinText } from "@/lib/invitationFormat";
import { accentText } from "@/lib/color";
import { resolveFont } from "@/lib/fonts";
import type { TemplateProps } from "@/types/invitation";
import { useUid } from "../../../kit/types";
import { Kit } from "../../../kit/Kit";

/** A crescent moon is the circle minus a second, offset circle, so washes and patterns still show through the cut. */
function Crescent({ color, className }: { color: string; className?: string }) {
  const id = useUid();
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 100 100" className={className}>
      <defs>
        <mask id={id}>
          <rect width="100" height="100" fill="#fff" />
          <circle cx="68" cy="38" r="40" fill="#000" />
        </mask>
      </defs>
      <circle cx="50" cy="50" r="50" fill={color} mask={`url(#${id})`} />
    </svg>
  );
}

/** A night-sky card: a crescent moon, a few sparkles and calm centered details below. */
export function MoonlightBabyShower({ content, design }: TemplateProps) {
  const d = dateParts(content.date);
  const heading = { fontFamily: resolveFont(design.headingFont) };
  const names = design.scriptFont ? { fontFamily: resolveFont(design.scriptFont), fontStyle: "normal" as const } : heading;
  const has = (id: string) => design.decorations?.includes(id) ?? false;
  const dateLine = d ? `${d.day} ${d.month} ${d.year}` : content.date;

  return (
    <>
      {has("moon") && <Crescent color={design.accentColor} className="absolute left-1/2 top-[9cqw] size-[40cqw] -translate-x-1/2 -rotate-12" />}
      {has("stars") && (
        <>
          <Kit kind="ornament" id="sparkle" design={design} color={design.secondaryColor} className="absolute left-[12cqw] top-[20cqw] size-[11cqw]" />
          <Kit kind="ornament" id="sparkle" design={design} color={design.secondaryColor} className="absolute right-[11cqw] top-[30cqw] size-[9cqw]" />
          <Kit kind="ornament" id="sparkle" design={design} className="absolute left-[24cqw] top-[44cqw] size-[5cqw]" />
        </>
      )}
      <div className="absolute inset-x-0 bottom-[10cqw] top-[56cqw] flex flex-col items-center justify-center overflow-hidden px-[14cqw] text-center">
        {content.eventTitle && (
          <p className="line-clamp-2 text-[2.6cqw] uppercase tracking-[0.3em]" style={{ color: accentText(design) }}>
            {content.eventTitle}
          </p>
        )}
        <h3 className="mt-[2.5cqw] max-w-full break-words leading-[1.02]" style={{ ...names, fontSize: fitSize(11, content.hostNames, 10) }}>
          {content.hostNames}
        </h3>
        <Kit kind="ornament" id="divider-dots" design={design} className="my-[3.5cqw] h-auto w-[24cqw]" />
        <p className="uppercase tracking-[0.18em]" style={{ ...heading, fontSize: fitSize(4, dateLine, 18) }}>
          {dateLine}
        </p>
        <p className="mt-[1.6cqw] line-clamp-2 text-[2.6cqw] uppercase tracking-[0.18em] opacity-80">{joinText([content.time && formatTime(content.time), content.venue])}</p>
        {content.message && <p className="mt-[3.5cqw] line-clamp-2 max-w-[62cqw] text-[2.8cqw] italic leading-relaxed opacity-85">{content.message}</p>}
        {content.additionalDetails && <p className="mt-[1.6cqw] line-clamp-1 max-w-[62cqw] text-[2.2cqw] opacity-65">{content.additionalDetails}</p>}
      </div>
    </>
  );
}
