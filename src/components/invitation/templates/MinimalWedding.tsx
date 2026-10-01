import { dateParts, formatTime, joinText, splitHostNames } from "@/lib/invitationFormat";
import { resolveFont } from "@/lib/fonts";
import type { TemplateProps } from "@/types/invitation";

export function MinimalWedding({ content, design }: TemplateProps) {
  const [first, second] = splitHostNames(content.hostNames);
  const d = dateParts(content.date);
  const dateText = d ? `${d.mm} · ${d.dd} · ${d.yy}` : content.date;

  return (
    <div className="absolute inset-[9cqw] flex flex-col justify-between">
      <div className="flex justify-between gap-[4cqw] text-[2.8cqw] uppercase tracking-[0.2em] opacity-70">
        <span>{content.eventTitle}</span>
        <span className="shrink-0">{dateText}</span>
      </div>
      <h3 className="text-[17cqw] font-light leading-[0.9] tracking-tight" style={{ fontFamily: resolveFont(design.headingFont) }}>
        {first}
        {second && (
          <span className="block" style={{ color: design.accentColor }}>
            {second}
          </span>
        )}
      </h3>
      <div className="border-t pt-[3cqw] text-[3.2cqw] leading-snug" style={{ borderColor: design.textColor }}>
        <p>{content.venue}</p>
        <p className="opacity-70">{joinText([content.address, content.time && formatTime(content.time)])}</p>
        {content.message && <p className="mt-[3cqw] line-clamp-2 opacity-70">{content.message}</p>}
      </div>
    </div>
  );
}
