import { dateParts, fitSize, formatTime, joinText } from "@/lib/invitationFormat";
import { resolveFont } from "@/lib/fonts";
import type { TemplateProps } from "@/types/invitation";
import { Kit } from "../../../kit/Kit";
import { FitBox } from "../../../layouts/FitBox";

/** Magazine-style card: tiny labels, a huge name, strong rules and a two-column details grid. */
export function EditorialBirthday({ content, design }: TemplateProps) {
  const d = dateParts(content.date);
  const heading = { fontFamily: resolveFont(design.headingFont) };
  const has = (id: string) => design.decorations?.includes(id) ?? false;
  const numeric = d ? `${d.dd}.${d.mm}.${d.yy}` : content.date;
  const rule = { borderColor: design.textColor };

  return (
    <>
      {has("ring") && <Kit kind="shape" id="ring" design={design} className="absolute -right-[22cqw] top-[14cqw] size-[62cqw]" opacity={0.9} />}
      {has("half-circle") && <Kit kind="shape" id="half-circle" design={design} className="absolute bottom-[40cqw] right-[10cqw] w-[28cqw]" opacity={0.9} />}
      <FitBox className="absolute inset-[9cqw]" origin="top" innerClassName="flex flex-col">
        <div className="flex justify-between gap-[4cqw] border-b pb-[2.5cqw] text-[2.4cqw] uppercase tracking-[0.2em]" style={rule}>
          <span>Invitation</span>
          <span className="shrink-0">{numeric}</span>
        </div>
        <div className="mt-[9cqw] min-h-0 flex-1">
          <h3 className="max-w-full leading-[0.86] tracking-tight" style={{ ...heading, fontSize: fitSize(24, content.hostNames, 6) }}>
            {content.hostNames}
          </h3>
          {content.eventTitle && (
            <p className="mt-[3cqw] max-w-[56cqw] leading-tight" style={{ ...heading, color: design.accentColor, fontSize: fitSize(8.6, content.eventTitle, 12) }}>
              {content.eventTitle}
            </p>
          )}
          {content.message && <p className="mt-[6cqw] max-w-[48cqw] text-[3.3cqw] leading-snug">{content.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-[5cqw] border-t pt-[3cqw] text-[3cqw] leading-snug" style={rule}>
          <div>
            <p className="text-[2.2cqw] uppercase tracking-[0.2em] opacity-60">When</p>
            <p className="mt-[1cqw]">{d ? `${d.weekday}, ${d.day} ${d.month}` : content.date}</p>
            {content.time && <p className="opacity-70">{formatTime(content.time)}</p>}
          </div>
          <div>
            <p className="text-[2.2cqw] uppercase tracking-[0.2em] opacity-60">Where</p>
            <p className="mt-[1cqw]">{content.venue}</p>
            <p className="opacity-70">{joinText([content.address, content.additionalDetails], ", ")}</p>
          </div>
        </div>
      </FitBox>
    </>
  );
}
