import { accentText } from "@/lib/color";
import { fitSize, formatDate, whenWhere } from "@/lib/invitationFormat";
import { resolveFont } from "@/lib/fonts";
import type { TemplateProps } from "@/types/invitation";
import { Kit } from "../../../kit/Kit";
import { FitBox } from "../../../layouts/FitBox";

/** A quiet, traditional card: a small cross, a script name and calm centered details. */
export function BlessingBaptism({ content, design }: TemplateProps) {
  const heading = { fontFamily: resolveFont(design.headingFont) };
  const names = design.scriptFont ? { fontFamily: resolveFont(design.scriptFont), fontStyle: "normal" as const } : heading;
  const has = (id: string) => design.decorations?.includes(id) ?? false;

  return (
    <>
      {has("cross") && <Kit kind="ornament" id="cross" design={design} className="absolute left-1/2 top-[21cqw] h-[15cqw] w-auto -translate-x-1/2" />}
      {has("sparkles") && (
        <>
          <Kit kind="ornament" id="sparkle" design={design} color={design.secondaryColor} className="absolute left-[34cqw] top-[22cqw] size-[5cqw]" />
          <Kit kind="ornament" id="sparkle" design={design} color={design.secondaryColor} className="absolute right-[34cqw] top-[26cqw] size-[4cqw]" />
        </>
      )}
      <FitBox className="absolute inset-x-0 bottom-[13cqw] top-[42cqw]" innerClassName="flex flex-col items-center justify-center px-[14cqw] text-center">
        <p className="text-[2.7cqw] uppercase tracking-[0.34em]" style={{ color: accentText(design) }}>
          {content.eventTitle}
        </p>
        <h3 className="mt-[3cqw] max-w-full leading-[1.05]" style={{ ...names, fontSize: fitSize(13, content.hostNames, 10) }}>
          {content.hostNames}
        </h3>
        <Kit kind="ornament" id="divider-diamond" design={design} className="my-[4cqw] h-auto w-[36cqw]" />
        <p className="uppercase tracking-[0.18em]" style={{ ...heading, fontSize: fitSize(3.8, formatDate(content.date, "full-us"), 18) }}>
          {formatDate(content.date, "full-us")}
        </p>
        <p className="mt-[1.6cqw] text-[2.8cqw] tracking-wide opacity-85">{whenWhere(content)}</p>
        {content.address && <p className="text-[2.4cqw] opacity-65">{content.address}</p>}
        {content.message && <p className="mt-[3.5cqw] max-w-[60cqw] text-[2.8cqw] italic leading-relaxed opacity-90">{content.message}</p>}
        {content.additionalDetails && <p className="mt-[1.5cqw] max-w-[60cqw] text-[2.3cqw] opacity-65">{content.additionalDetails}</p>}
      </FitBox>
    </>
  );
}
