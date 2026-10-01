import { dateParts, formatTime, joinText, splitHostNames } from "@/lib/invitationFormat";
import { resolveFont } from "@/lib/fonts";
import type { TemplateProps } from "@/types/invitation";
import { Kit } from "../../../kit/Kit";

export function ElegantWedding({ content, design }: TemplateProps) {
  const [first, second] = splitHostNames(content.hostNames);
  const d = dateParts(content.date);
  const dateText = d ? `${d.weekday}, ${d.day} ${d.month} ${d.year}` : content.date;
  const heading = { fontFamily: resolveFont(design.headingFont) };
  const flourish = design.decorations?.includes("flourish") ?? false;
  const corners = design.decorations?.includes("corner-flourish") ?? false;

  return (
    <>
      {corners && (
        <>
          <Kit kind="ornament" id="corner-flourish" design={design} className="absolute left-[8cqw] top-[8cqw] size-[12cqw]" />
          <Kit kind="ornament" id="corner-flourish" design={design} className="absolute right-[8cqw] top-[8cqw] size-[12cqw] rotate-90" />
          <Kit kind="ornament" id="corner-flourish" design={design} className="absolute bottom-[8cqw] right-[8cqw] size-[12cqw] rotate-180" />
          <Kit kind="ornament" id="corner-flourish" design={design} className="absolute bottom-[8cqw] left-[8cqw] size-[12cqw] -rotate-90" />
        </>
      )}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-[14cqw] text-center">
        {content.eventTitle && (
          <p className="text-[2.6cqw] uppercase tracking-[0.3em]" style={{ color: design.accentColor }}>
            {content.eventTitle}
          </p>
        )}
        <h3 className="mt-[7cqw] text-[13cqw] font-medium leading-[0.95]" style={heading}>
          {first}
          {second && (
            <>
              <span className="block text-[6cqw] font-normal italic" style={{ color: design.accentColor, fontFamily: design.scriptFont ? resolveFont(design.scriptFont) : undefined }}>
                and
              </span>
              {second}
            </>
          )}
        </h3>
        {flourish ? (
          <Kit kind="ornament" id="divider-flourish" design={design} className="my-[5cqw] h-auto w-[30cqw]" />
        ) : (
          <div className="my-[6cqw] h-px w-[12cqw] opacity-70" style={{ backgroundColor: design.accentColor }} />
        )}
        <p className="text-[5cqw]" style={heading}>
          {dateText}
        </p>
        <p className="mt-[1.5cqw] text-[2.8cqw] uppercase tracking-[0.2em] opacity-70">
          {joinText([content.venue, content.time && formatTime(content.time)])}
        </p>
        {content.message && (
          <p className="mt-[5cqw] line-clamp-4 text-[3.2cqw] italic leading-relaxed opacity-80">{content.message}</p>
        )}
      </div>
    </>
  );
}
