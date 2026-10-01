import { dateParts, fitSize, formatTime, joinText } from "@/lib/invitationFormat";
import { pickReadable } from "@/lib/color";
import { resolveFont } from "@/lib/fonts";
import type { TemplateProps } from "@/types/invitation";
import { Kit } from "../../../kit/Kit";

/** Centered party card: a ribbon, a bouncy name, a squiggle and a dashed ticket for the details. */
export function ConfettiBirthday({ content, design }: TemplateProps) {
  const d = dateParts(content.date);
  const heading = { fontFamily: resolveFont(design.headingFont) };
  const has = (id: string) => design.decorations?.includes(id) ?? false;
  const dateLine = d ? `${d.weekdayShort} ${d.day} ${d.monthShort}` : content.date;

  return (
    <>
      {has("starbursts") && (
        <>
          <Kit kind="shape" id="starburst" design={design} className="absolute left-[5cqw] top-[6cqw] size-[12cqw] -rotate-12" />
          <Kit kind="shape" id="starburst" design={design} color={design.secondaryColor} className="absolute bottom-[6cqw] right-[6cqw] size-[10cqw] rotate-12" />
        </>
      )}
      {has("squiggles") && (
        <>
          <Kit kind="shape" id="squiggle" design={design} color={design.secondaryColor} className="absolute right-[8cqw] top-[12cqw] h-[8cqw] w-[20cqw] rotate-12" />
          <Kit kind="shape" id="squiggle" design={design} className="absolute bottom-[12cqw] left-[8cqw] h-[8cqw] w-[20cqw] -rotate-6" />
        </>
      )}
      <div className="absolute inset-x-0 inset-y-[10cqw] flex flex-col items-center justify-center overflow-hidden px-[13cqw] text-center">
        <div className="relative w-[58cqw]">
          <Kit kind="ornament" id="ribbon" design={design} className="block h-auto w-full" />
          <span className="absolute inset-0 grid place-items-center text-[3.2cqw] font-bold uppercase tracking-[0.18em]" style={{ color: pickReadable(design.accentColor, design.backgroundColor, design.textColor) }}>
            You&apos;re invited
          </span>
        </div>
        <h3 className="mt-[7cqw] max-w-full break-words font-bold leading-[0.95] -rotate-2" style={{ ...heading, fontSize: fitSize(17, content.hostNames, 8) }}>
          {content.hostNames}
        </h3>
        {content.eventTitle && (
          <p className="mt-[2cqw] line-clamp-2 font-semibold leading-tight" style={{ ...heading, fontSize: fitSize(7.4, content.eventTitle, 14) }}>
            {content.eventTitle}
          </p>
        )}
        <Kit kind="shape" id="squiggle" design={design} color={design.secondaryColor ?? design.accentColor} className="mt-[3cqw] h-[5cqw] w-[24cqw]" />
        <div className="mt-[6cqw] w-full border-y-2 border-dashed py-[3cqw]" style={{ borderColor: design.accentColor }}>
          <p className="font-bold leading-none" style={{ ...heading, fontSize: fitSize(7.4, dateLine, 12) }}>
            {dateLine}
          </p>
          <p className="mt-[1.6cqw] text-[3.4cqw] font-medium">{joinText([content.time && formatTime(content.time), content.venue])}</p>
        </div>
        {content.message && <p className="mt-[4cqw] line-clamp-2 max-w-[66cqw] text-[3.1cqw] leading-snug">{content.message}</p>}
        {content.additionalDetails && <p className="mt-[2cqw] line-clamp-2 max-w-[66cqw] text-[2.6cqw] opacity-70">{content.additionalDetails}</p>}
      </div>
    </>
  );
}
