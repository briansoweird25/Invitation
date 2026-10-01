import { accentText } from "@/lib/color";
import { fitSize, formatDate, whenWhere } from "@/lib/invitationFormat";
import { resolveFont } from "@/lib/fonts";
import type { TemplateProps } from "@/types/invitation";
import { Kit } from "../../../kit/Kit";
import { FitBox } from "../../../layouts/FitBox";

/** An oversized soft heart behind big italic names, set like a love letter. */
export function HeartAnniversary({ content, design }: TemplateProps) {
  const heading = { fontFamily: resolveFont(design.headingFont) };
  const has = (id: string) => design.decorations?.includes(id) ?? false;

  return (
    <>
      {has("heart") && <Kit kind="shape" id="heart" design={design} color={design.secondaryColor ?? design.accentColor} opacity={0.22} className="absolute left-1/2 top-[16cqw] size-[92cqw] -translate-x-1/2" />}
      <FitBox className="absolute inset-x-0 bottom-[14cqw] top-[30cqw]" innerClassName="flex flex-col items-center justify-center px-[15cqw] text-center">
        <p className="text-[2.7cqw] uppercase tracking-[0.34em]" style={{ color: accentText(design) }}>
          {content.eventTitle}
        </p>
        <h3 className="mt-[3cqw] max-w-full italic leading-[1.02]" style={{ ...heading, fontSize: fitSize(13, content.hostNames, 12) }}>
          {content.hostNames}
        </h3>
        <div className="my-[4cqw] h-px w-[26cqw]" style={{ backgroundColor: design.accentColor }} aria-hidden="true" />
        <p style={{ ...heading, fontSize: fitSize(4.4, formatDate(content.date, "full-us"), 18) }}>{formatDate(content.date, "full-us")}</p>
        <p className="mt-[1.4cqw] text-[2.8cqw] tracking-wide opacity-85">{whenWhere(content)}</p>
        {content.address && <p className="text-[2.4cqw] opacity-65">{content.address}</p>}
        {content.message && <p className="mt-[3.5cqw] max-w-[56cqw] text-[2.8cqw] leading-relaxed opacity-90">{content.message}</p>}
        {content.additionalDetails && <p className="mt-[1.5cqw] max-w-[56cqw] text-[2.3cqw] opacity-65">{content.additionalDetails}</p>}
      </FitBox>
      {has("small-hearts") && (
        <div className="absolute inset-x-0 bottom-[6cqw] flex justify-center gap-[2.4cqw]" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <Kit key={i} kind="shape" id="heart" design={design} className="size-[3.2cqw]" opacity={1 - i * 0.25} />
          ))}
        </div>
      )}
    </>
  );
}
