import { dateParts, formatTime, joinText } from "@/lib/invitationFormat";
import { resolveFont } from "@/lib/fonts";
import type { TemplateProps } from "@/types/invitation";

export function ModernBirthday({ content, design }: TemplateProps) {
  const d = dateParts(content.date);
  const dateText = d ? `${d.weekdayShort} ${d.day} ${d.monthShort}` : content.date;
  const showShapes = design.decorations?.includes("shapes") ?? false;

  return (
    <>
      {showShapes && (
        <>
          <div className="absolute -right-[14cqw] -top-[14cqw] size-[62cqw] rounded-full" style={{ backgroundColor: design.accentColor }} />
          <div className="absolute -bottom-[10cqw] left-[8cqw] size-[26cqw] rotate-12" style={{ backgroundColor: design.textColor }} />
        </>
      )}
      <div className="absolute inset-0 flex flex-col justify-end px-[9cqw] pt-[9cqw]">
        <p className="text-[3cqw] font-semibold uppercase tracking-[0.2em]">You&apos;re invited</p>
        <h3 className="mt-[2cqw] text-[19cqw] font-extrabold leading-[0.85] tracking-tighter" style={{ fontFamily: resolveFont(design.headingFont) }}>
          {content.hostNames}
          {content.eventTitle && <span className="block">{content.eventTitle}</span>}
        </h3>
        {content.message && <p className="mt-[4cqw] line-clamp-2 max-w-[70cqw] text-[3cqw] leading-snug">{content.message}</p>}
        <p className="mt-[3cqw] text-[3.6cqw] font-medium">
          {joinText([dateText, content.time && formatTime(content.time), content.venue])}
        </p>
        <div className="h-[22cqw]" />
      </div>
    </>
  );
}
