import { dateParts, fitSize, formatTime, joinText, splitHostNames } from "@/lib/invitationFormat";
import { resolveFont } from "@/lib/fonts";
import type { TemplateProps } from "@/types/invitation";
import { FitBox } from "../../../layouts/FitBox";

export function MinimalWedding({ content, design }: TemplateProps) {
  const [first, second] = splitHostNames(content.hostNames);
  const d = dateParts(content.date);
  const longest = Math.max(first?.length ?? 0, second?.length ?? 0);
  const dateText = d ? `${d.mm} · ${d.dd} · ${d.yy}` : content.date;

  return (
    <FitBox className="absolute inset-[9cqw]" origin="top" innerClassName="flex flex-col justify-between gap-[6cqw]">
      <div className="flex justify-between gap-[4cqw] text-[2.8cqw] uppercase tracking-[0.2em] opacity-70">
        <span className="min-w-0">{content.eventTitle}</span>
        <span className="shrink-0">{dateText}</span>
      </div>
      <h3 className="font-light leading-[0.9] tracking-tight" style={{ fontFamily: resolveFont(design.headingFont), fontSize: fitSize(17, "x".repeat(longest), 7) }}>
        {first}
        {second && (
          <span className="block" style={{ color: design.accentColor }}>
            {second}
          </span>
        )}
      </h3>
      <div
        className={`pt-[3cqw] text-[3.2cqw] leading-snug ${design.decorations?.includes("rule") ? "border-t" : ""}`}
        style={{ borderColor: design.textColor }}
      >
        <p>{content.venue}</p>
        <p className="opacity-70">{joinText([content.address, content.time && formatTime(content.time)])}</p>
        {content.message && <p className="mt-[3cqw] opacity-70">{content.message}</p>}
        {content.additionalDetails && <p className="mt-[2cqw] opacity-60">{content.additionalDetails}</p>}
      </div>
    </FitBox>
  );
}
