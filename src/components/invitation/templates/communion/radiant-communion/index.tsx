import { accentText } from "@/lib/color";
import { fitSize, formatDate, whenWhere } from "@/lib/invitationFormat";
import { resolveFont } from "@/lib/fonts";
import type { TemplateProps } from "@/types/invitation";
import { Kit } from "../../../kit/Kit";
import { FitBox } from "../../../layouts/FitBox";

/** Radiating light behind a cross at the top, then engraved capitals and ruled details. */
export function RadiantCommunion({ content, design }: TemplateProps) {
  const heading = { fontFamily: resolveFont(design.headingFont) };
  const has = (id: string) => design.decorations?.includes(id) ?? false;
  const second = design.secondaryColor ?? design.accentColor;

  return (
    <>
      {has("rays") && <Kit kind="ornament" id="sun-rays" design={design} color={second} opacity={0.55} className="absolute left-1/2 top-[7cqw] size-[46cqw] -translate-x-1/2" />}
      {has("cross") && <Kit kind="ornament" id="cross" design={design} color={design.backgroundColor} className="absolute left-1/2 top-[14.5cqw] h-[16cqw] w-auto -translate-x-1/2" />}
      <FitBox className="absolute inset-x-0 bottom-[12cqw] top-[58cqw]" innerClassName="flex flex-col items-center justify-center px-[13cqw] text-center">
        <p className="max-w-full uppercase leading-snug tracking-[0.16em]" style={{ ...heading, color: accentText(design), fontSize: fitSize(5, content.eventTitle, 20) }}>
          {content.eventTitle}
        </p>
        <h3 className="mt-[3cqw] max-w-full uppercase leading-[1.05] tracking-[0.1em]" style={{ ...heading, fontSize: fitSize(7.8, content.hostNames, 12) }}>
          {content.hostNames}
        </h3>
        <Kit kind="ornament" id="divider-diamond" design={design} className="my-[3.5cqw] h-auto w-[34cqw]" />
        <p className="tracking-[0.12em]" style={{ ...heading, fontSize: fitSize(3.8, formatDate(content.date, "full-us"), 18) }}>{formatDate(content.date, "full-us")}</p>
        <p className="mt-[1.4cqw] text-[2.7cqw] tracking-wide opacity-85">{whenWhere(content)}</p>
        {content.address && <p className="text-[2.3cqw] opacity-65">{content.address}</p>}
        {content.message && <p className="mt-[3cqw] max-w-[62cqw] text-[2.7cqw] leading-relaxed opacity-90">{content.message}</p>}
        {content.additionalDetails && <p className="mt-[1.5cqw] max-w-[62cqw] text-[2.3cqw] opacity-65">{content.additionalDetails}</p>}
      </FitBox>
    </>
  );
}
