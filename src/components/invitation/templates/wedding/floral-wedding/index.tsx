import { dateParts, formatTime, joinText, splitHostNames } from "@/lib/invitationFormat";
import { resolveFont } from "@/lib/fonts";
import type { TemplateProps } from "@/types/invitation";
import { Kit } from "../../../kit/Kit";

export function FloralWedding({ content, design }: TemplateProps) {
  const [first, second] = splitHostNames(content.hostNames);
  const d = dateParts(content.date);
  const dateText = d ? `${d.month} ${d.day}, ${d.year}` : content.date;
  const heading = { fontFamily: resolveFont(design.headingFont) };
  const names = design.scriptFont ? { fontFamily: resolveFont(design.scriptFont), fontStyle: "normal" as const } : heading;
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
      <div className="absolute inset-0 flex flex-col justify-center px-[12cqw] pb-[4cqw] pt-[24cqw]">
        {content.eventTitle && (
          <p className="text-[2.6cqw] uppercase tracking-[0.28em]" style={{ color: design.accentColor }}>
            {content.eventTitle}
          </p>
        )}
        <h3 className="mt-[5cqw] text-[14cqw] font-normal italic leading-[0.95]" style={names}>
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
          <p className="mt-[5cqw] line-clamp-3 max-w-[48cqw] text-[3cqw] leading-relaxed opacity-80">{content.message}</p>
        )}
      </div>
    </>
  );
}
