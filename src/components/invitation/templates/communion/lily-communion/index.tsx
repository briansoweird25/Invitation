import { accentText } from "@/lib/color";
import { fitSize, formatDate, whenWhere } from "@/lib/invitationFormat";
import { resolveFont } from "@/lib/fonts";
import type { TemplateProps } from "@/types/invitation";
import { Kit } from "../../../kit/Kit";
import { FitBox } from "../../../layouts/FitBox";

/** A leaf garland across the top, a small cross beneath it and the child's name in script. */
export function LilyCommunion({ content, design }: TemplateProps) {
  const heading = { fontFamily: resolveFont(design.headingFont) };
  const names = design.scriptFont ? { fontFamily: resolveFont(design.scriptFont), fontStyle: "normal" as const } : heading;
  const has = (id: string) => design.decorations?.includes(id) ?? false;

  return (
    <>
      {has("garland") && <Kit kind="botanical" id="leaf-garland" design={design} className="absolute inset-x-0 top-[4cqw] h-auto w-full" />}
      {has("cross") && <Kit kind="ornament" id="cross" design={design} className="absolute left-1/2 top-[27cqw] h-[13cqw] w-auto -translate-x-1/2" />}
      {has("wildflowers") && <Kit kind="botanical" id="wildflower" design={design} className="absolute -bottom-[3cqw] left-1/2 w-[34cqw] -translate-x-1/2" />}
      <FitBox className="absolute inset-x-0 bottom-[26cqw] top-[46cqw]" innerClassName="flex flex-col items-center justify-center px-[14cqw] text-center">
        <p className="max-w-full uppercase leading-snug tracking-[0.22em]" style={{ ...heading, color: accentText(design), fontSize: fitSize(3.6, content.eventTitle, 22) }}>
          {content.eventTitle}
        </p>
        <h3 className="mt-[2.5cqw] max-w-full leading-[1.05]" style={{ ...names, fontSize: fitSize(13, content.hostNames, 10) }}>
          {content.hostNames}
        </h3>
        <p className="mt-[4cqw]" style={{ ...heading, fontSize: fitSize(4.4, formatDate(content.date, "long-us"), 18) }}>{formatDate(content.date, "long-us")}</p>
        <p className="mt-[1.4cqw] text-[2.8cqw] tracking-wide opacity-85">{whenWhere(content)}</p>
        {content.address && <p className="text-[2.4cqw] opacity-65">{content.address}</p>}
        {content.message && <p className="mt-[3cqw] max-w-[60cqw] text-[2.8cqw] italic leading-relaxed opacity-90">{content.message}</p>}
        {content.additionalDetails && <p className="mt-[1.5cqw] max-w-[60cqw] text-[2.3cqw] opacity-65">{content.additionalDetails}</p>}
      </FitBox>
    </>
  );
}
