import { accentText } from "@/lib/color";
import { fitSize, formatDate, whenWhere } from "@/lib/invitationFormat";
import { resolveFont } from "@/lib/fonts";
import type { TemplateProps } from "@/types/invitation";
import { Kit } from "../../../kit/Kit";
import { FitBox } from "../../../layouts/FitBox";

/** A formal, centered card: a laurel wreath above the name, hairline rules and a small seal at the foot. */
export function GoldenGraduation({ content, design }: TemplateProps) {
  const heading = { fontFamily: resolveFont(design.headingFont) };
  const names = design.scriptFont ? { fontFamily: resolveFont(design.scriptFont), fontStyle: "normal" as const } : heading;
  const has = (id: string) => design.decorations?.includes(id) ?? false;

  return (
    <>
      {has("laurel") && <Kit kind="ornament" id="laurel" design={design} className="absolute left-1/2 top-[10cqw] h-auto w-[34cqw] -translate-x-1/2" />}
      {has("seal") && <Kit kind="ornament" id="seal" design={design} className="absolute bottom-[8cqw] left-1/2 size-[12cqw] -translate-x-1/2" />}
      {has("corners") && (
        <>
          <Kit kind="ornament" id="corner-flourish" design={design} className="absolute left-[8cqw] top-[8cqw] size-[10cqw]" />
          <Kit kind="ornament" id="corner-flourish" design={design} className="absolute right-[8cqw] top-[8cqw] size-[10cqw] scale-x-[-1]" />
        </>
      )}
      <FitBox className="absolute inset-x-0 bottom-[22cqw] top-[40cqw]" innerClassName="flex flex-col items-center justify-center px-[14cqw] text-center">
        <p className="text-[2.7cqw] uppercase tracking-[0.34em]" style={{ color: accentText(design) }}>
          {content.eventTitle}
        </p>
        <h3 className="mt-[2.5cqw] max-w-full leading-[1.05]" style={{ ...names, fontSize: fitSize(11.5, content.hostNames, 11) }}>
          {content.hostNames}
        </h3>
        <Kit kind="ornament" id="divider-diamond" design={design} className="my-[3.5cqw] h-auto w-[40cqw]" />
        <p className="uppercase tracking-[0.2em]" style={{ ...heading, fontSize: fitSize(3.8, formatDate(content.date, "full-us"), 18) }}>
          {formatDate(content.date, "full-us")}
        </p>
        <p className="mt-[1.6cqw] text-[2.7cqw] tracking-wide opacity-85">{whenWhere(content)}</p>
        {content.address && <p className="text-[2.3cqw] opacity-65">{content.address}</p>}
        {content.message && <p className="mt-[3cqw] max-w-[62cqw] text-[2.8cqw] italic leading-relaxed opacity-90">{content.message}</p>}
        {content.additionalDetails && <p className="mt-[1.5cqw] max-w-[62cqw] text-[2.3cqw] opacity-65">{content.additionalDetails}</p>}
      </FitBox>
    </>
  );
}

