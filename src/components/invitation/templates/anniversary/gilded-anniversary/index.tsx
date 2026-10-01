import { accentText } from "@/lib/color";
import { fitSize, formatDate, whenWhere } from "@/lib/invitationFormat";
import { resolveFont } from "@/lib/fonts";
import type { TemplateProps } from "@/types/invitation";
import { Kit } from "../../../kit/Kit";
import { FitBox } from "../../../layouts/FitBox";

/** A round medallion carries the milestone; the names and details sit beneath it. */
export function GildedAnniversary({ content, design }: TemplateProps) {
  const heading = { fontFamily: resolveFont(design.headingFont) };
  const names = design.scriptFont ? { fontFamily: resolveFont(design.scriptFont), fontStyle: "normal" as const } : heading;
  const has = (id: string) => design.decorations?.includes(id) ?? false;
  const second = design.secondaryColor ?? design.accentColor;

  return (
    <>
      {has("rays") && <Kit kind="shape" id="starburst" design={design} color={second} opacity={0.14} className="absolute left-1/2 top-[6cqw] size-[76cqw] -translate-x-1/2" />}
      <div className="absolute left-1/2 top-[12cqw] size-[58cqw] -translate-x-1/2 rounded-full border-[0.8cqw]" style={{ borderColor: design.accentColor }} aria-hidden="true" />
      <div className="absolute left-1/2 top-[15cqw] size-[52cqw] -translate-x-1/2 rounded-full border" style={{ borderColor: second }} aria-hidden="true" />
      {has("sparkles") && (
        <>
          <Kit kind="ornament" id="sparkle" design={design} className="absolute left-[10cqw] top-[16cqw] size-[8cqw]" />
          <Kit kind="ornament" id="sparkle" design={design} color={second} className="absolute right-[11cqw] top-[56cqw] size-[6cqw]" />
        </>
      )}
      <FitBox className="absolute left-[26cqw] right-[26cqw] top-[24cqw] h-[36cqw]" innerClassName="flex items-center justify-center text-center">
        <p className="leading-[1.05]" style={{ ...heading, fontSize: fitSize(10.4, content.eventTitle, 11), color: accentText(design) }}>
          {content.eventTitle}
        </p>
      </FitBox>
      <FitBox className="absolute inset-x-0 bottom-[10cqw] top-[76cqw]" innerClassName="flex flex-col items-center justify-center px-[13cqw] text-center">
        <h3 className="max-w-full leading-[1.05]" style={{ ...names, fontSize: fitSize(9.6, content.hostNames, 16) }}>
          {content.hostNames}
        </h3>
        <Kit kind="ornament" id="divider-flourish" design={design} className="my-[2.8cqw] h-auto w-[30cqw]" />
        <p className="uppercase tracking-[0.2em]" style={{ ...heading, fontSize: fitSize(3.6, formatDate(content.date, "full-us"), 18) }}>
          {formatDate(content.date, "full-us")}
        </p>
        <p className="mt-[1.4cqw] text-[2.7cqw] tracking-wide opacity-85">{whenWhere(content)}</p>
        {content.address && <p className="text-[2.3cqw] opacity-65">{content.address}</p>}
        {content.message && <p className="mt-[3cqw] max-w-[62cqw] text-[2.7cqw] italic leading-relaxed opacity-90">{content.message}</p>}
        {content.additionalDetails && <p className="mt-[1.5cqw] max-w-[62cqw] text-[2.3cqw] opacity-65">{content.additionalDetails}</p>}
      </FitBox>
    </>
  );
}
