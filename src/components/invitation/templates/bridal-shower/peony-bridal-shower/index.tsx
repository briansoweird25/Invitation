import { accentText } from "@/lib/color";
import { fitSize, formatDate, whenWhere } from "@/lib/invitationFormat";
import { resolveFont } from "@/lib/fonts";
import type { TemplateProps } from "@/types/invitation";
import { Kit } from "../../../kit/Kit";
import { FitBox } from "../../../layouts/FitBox";

/** Names and details on top, with two bouquets meeting along the foot of the card. */
export function PeonyBridalShower({ content, design }: TemplateProps) {
  const heading = { fontFamily: resolveFont(design.headingFont) };
  const names = design.scriptFont ? { fontFamily: resolveFont(design.scriptFont), fontStyle: "normal" as const } : heading;
  const has = (id: string) => design.decorations?.includes(id) ?? false;

  return (
    <>
      {has("garland") && <Kit kind="botanical" id="leaf-garland" design={design} className="absolute inset-x-0 top-[3cqw] h-auto w-full" />}
      {has("bouquets") && (
        <>
          <Kit kind="botanical" id="corner-bouquet" design={design} className="absolute -bottom-[4cqw] -left-[5cqw] w-[50cqw] -scale-y-100 rotate-90" />
          <Kit kind="botanical" id="corner-bouquet" design={design} className="absolute -bottom-[4cqw] -right-[5cqw] w-[50cqw] rotate-180" />
        </>
      )}
      <FitBox className="absolute inset-x-0 bottom-[38cqw] top-[18cqw]" innerClassName="flex flex-col items-center justify-center px-[14cqw] text-center">
        <p className="text-[2.6cqw] uppercase tracking-[0.3em]" style={{ color: accentText(design) }}>
          {content.eventTitle}
        </p>
        <h3 className="mt-[2.5cqw] max-w-full leading-[1.05]" style={{ ...names, fontSize: fitSize(15, content.hostNames, 9) }}>
          {content.hostNames}
        </h3>
        {has("hearts") && (
          <div className="my-[3.5cqw] flex items-center gap-[2cqw]" aria-hidden="true">
            <span className="h-px w-[12cqw]" style={{ backgroundColor: design.accentColor }} />
            <Kit kind="shape" id="heart" design={design} className="size-[3.6cqw]" />
            <span className="h-px w-[12cqw]" style={{ backgroundColor: design.accentColor }} />
          </div>
        )}
        <p style={{ ...heading, fontSize: fitSize(4.6, formatDate(content.date, "long-us"), 18) }}>{formatDate(content.date, "long-us")}</p>
        <p className="mt-[1.4cqw] text-[2.9cqw] tracking-wide opacity-85">{whenWhere(content)}</p>
        {content.address && <p className="text-[2.4cqw] opacity-65">{content.address}</p>}
        {content.message && <p className="mt-[3cqw] max-w-[62cqw] text-[2.8cqw] italic leading-relaxed opacity-90">{content.message}</p>}
        {content.additionalDetails && <p className="mt-[1.5cqw] max-w-[62cqw] text-[2.3cqw] opacity-65">{content.additionalDetails}</p>}
      </FitBox>
    </>
  );
}
