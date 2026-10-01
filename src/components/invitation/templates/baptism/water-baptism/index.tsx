import { accentText } from "@/lib/color";
import { fitSize, formatDate, whenWhere } from "@/lib/invitationFormat";
import { resolveFont } from "@/lib/fonts";
import type { TemplateProps } from "@/types/invitation";
import { Kit } from "../../../kit/Kit";
import { FitBox } from "../../../layouts/FitBox";

/** Droplets gather in the upper right and the name and details sit low and left, like a calm page. */
export function WaterBaptism({ content, design }: TemplateProps) {
  const heading = { fontFamily: resolveFont(design.headingFont) };
  const has = (id: string) => design.decorations?.includes(id) ?? false;
  const second = design.secondaryColor ?? design.accentColor;

  return (
    <>
      {has("droplets") && (
        <>
          <Kit kind="shape" id="droplet" design={design} color={design.accentColor} opacity={0.9} className="absolute right-[12cqw] top-[10cqw] size-[22cqw]" />
          <Kit kind="shape" id="droplet" design={design} color={second} opacity={0.7} className="absolute right-[36cqw] top-[22cqw] size-[12cqw]" />
          <Kit kind="shape" id="droplet" design={design} color={second} opacity={0.5} className="absolute right-[9cqw] top-[38cqw] size-[8cqw]" />
        </>
      )}
      {has("eucalyptus") && <Kit kind="botanical" id="eucalyptus" design={design} className="absolute -bottom-[4cqw] -right-[6cqw] w-[44cqw]" />}
      <FitBox className="absolute inset-x-[11cqw] bottom-[12cqw] top-[52cqw]" origin="top left" innerClassName="flex flex-col justify-end">
        <p className="max-w-[56cqw] text-[2.7cqw] uppercase tracking-[0.3em]" style={{ color: accentText(design) }}>
          {content.eventTitle}
        </p>
        <h3 className="mt-[2.5cqw] max-w-[60cqw] leading-[1]" style={{ ...heading, fontSize: fitSize(12, content.hostNames, 10) }}>
          {content.hostNames}
        </h3>
        <div className="my-[4cqw] h-px w-[20cqw]" style={{ backgroundColor: design.accentColor }} aria-hidden="true" />
        <p className="max-w-[56cqw]" style={{ ...heading, fontSize: fitSize(4.6, formatDate(content.date, "full-us"), 16) }}>{formatDate(content.date, "full-us")}</p>
        <p className="mt-[1.4cqw] max-w-[56cqw] text-[2.9cqw] opacity-85">{whenWhere(content)}</p>
        {content.address && <p className="max-w-[56cqw] text-[2.4cqw] opacity-65">{content.address}</p>}
        {content.message && <p className="mt-[3.5cqw] max-w-[56cqw] text-[2.8cqw] leading-relaxed">{content.message}</p>}
        {content.additionalDetails && <p className="mt-[1.5cqw] max-w-[56cqw] text-[2.3cqw] opacity-65">{content.additionalDetails}</p>}
      </FitBox>
    </>
  );
}
