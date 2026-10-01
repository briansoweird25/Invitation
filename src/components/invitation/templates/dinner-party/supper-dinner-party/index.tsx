import { accentText } from "@/lib/color";
import { fitSize, formatDate, formatTime } from "@/lib/invitationFormat";
import { resolveFont } from "@/lib/fonts";
import type { TemplateProps } from "@/types/invitation";
import { Kit } from "../../../kit/Kit";
import { FitBox } from "../../../layouts/FitBox";

/** Set like a menu card: the evening's headline, then date, time and place as three centered courses. */
export function SupperDinnerParty({ content, design }: TemplateProps) {
  const heading = { fontFamily: resolveFont(design.headingFont) };
  const names = design.scriptFont ? { fontFamily: resolveFont(design.scriptFont), fontStyle: "normal" as const } : heading;
  const has = (id: string) => design.decorations?.includes(id) ?? false;
  const label = "text-[2.1cqw] uppercase tracking-[0.3em]";
  const course = (name: string, lines: (string | undefined)[]) => {
    const shown = lines.filter(Boolean);
    return shown.length === 0 ? null : (
      <div className="mt-[4.5cqw]">
        <p className={label} style={{ color: accentText(design) }}>{name}</p>
        {shown.map((line, i) => (
          <p key={i} className={i === 0 ? "mt-[1cqw] text-[3.4cqw]" : "text-[2.5cqw] opacity-70"} style={i === 0 ? heading : undefined}>{line}</p>
        ))}
      </div>
    );
  };

  return (
    <>
      {has("flourish") && <Kit kind="ornament" id="divider-flourish" design={design} className="absolute left-1/2 top-[11cqw] h-auto w-[30cqw] -translate-x-1/2" />}
      <FitBox className="absolute inset-x-0 bottom-[10cqw] top-[24cqw]" innerClassName="flex flex-col items-center justify-center px-[14cqw] text-center">
        <p className="max-w-full uppercase leading-snug tracking-[0.16em]" style={{ ...heading, fontSize: fitSize(4.4, content.eventTitle, 26) }}>
          {content.eventTitle}
        </p>
        <Kit kind="ornament" id="divider-diamond" design={design} className="my-[3cqw] h-auto w-[34cqw]" />
        <h3 className="max-w-full leading-[1.05]" style={{ ...names, fontSize: fitSize(10, content.hostNames, 14) }}>
          {content.hostNames}
        </h3>
        {course("Date", [formatDate(content.date, "long-us")])}
        {course("Time", [content.time && formatTime(content.time)])}
        {course("Place", [content.venue, content.address])}
        {content.message && <p className="mt-[5cqw] max-w-[58cqw] text-[2.7cqw] italic leading-relaxed opacity-90">{content.message}</p>}
        {content.additionalDetails && <p className="mt-[1.5cqw] max-w-[58cqw] text-[2.3cqw] opacity-65">{content.additionalDetails}</p>}
      </FitBox>
    </>
  );
}
