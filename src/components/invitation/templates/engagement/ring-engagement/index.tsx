import { accentText } from "@/lib/color";
import { fitSize, formatDate, whenWhere } from "@/lib/invitationFormat";
import { resolveFont } from "@/lib/fonts";
import type { TemplateProps } from "@/types/invitation";
import { Kit } from "../../../kit/Kit";
import { FitBox } from "../../../layouts/FitBox";

/** Two interlocked rings above a quiet, centered block of names and details. */
export function RingEngagement({ content, design }: TemplateProps) {
  const heading = { fontFamily: resolveFont(design.headingFont) };
  const has = (id: string) => design.decorations?.includes(id) ?? false;
  const second = design.secondaryColor ?? design.accentColor;

  return (
    <>
      {has("rings") && (
        <div className="absolute left-1/2 top-[11cqw] h-[30cqw] w-[48cqw] -translate-x-1/2" aria-hidden="true">
          <Kit kind="shape" id="ring" design={design} color={design.accentColor} opacity={0.95} className="absolute left-0 top-0 size-[30cqw]" />
          <Kit kind="shape" id="ring" design={design} color={second} opacity={0.9} className="absolute right-0 top-0 size-[30cqw]" />
        </div>
      )}
      {has("gem") && <Kit kind="ornament" id="sparkle" design={design} className="absolute left-[68cqw] top-[10cqw] size-[8cqw]" />}
      <FitBox className="absolute inset-x-0 bottom-[11cqw] top-[48cqw]" innerClassName="flex flex-col items-center justify-center px-[14cqw] text-center">
        <p className="text-[2.7cqw] uppercase tracking-[0.34em]" style={{ color: accentText(design) }}>
          {content.eventTitle}
        </p>
        <h3 className="mt-[3cqw] max-w-full leading-[1.05] tracking-tight" style={{ ...heading, fontSize: fitSize(11, content.hostNames, 14) }}>
          {content.hostNames}
        </h3>
        <p className="mt-[5cqw] uppercase tracking-[0.22em]" style={{ fontSize: fitSize(3.3, formatDate(content.date, "full-us"), 18) }}>
          {formatDate(content.date, "full-us")}
        </p>
        <p className="mt-[1.6cqw] text-[2.8cqw] tracking-wide opacity-85">{whenWhere(content)}</p>
        {content.address && <p className="text-[2.4cqw] opacity-65">{content.address}</p>}
        {content.message && <p className="mt-[4cqw] max-w-[60cqw] text-[2.8cqw] leading-relaxed opacity-90">{content.message}</p>}
        {content.additionalDetails && <p className="mt-[1.5cqw] max-w-[60cqw] text-[2.3cqw] opacity-65">{content.additionalDetails}</p>}
      </FitBox>
    </>
  );
}
