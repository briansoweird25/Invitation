import { accentText } from "@/lib/color";
import { fitSize, formatDate, whenWhere } from "@/lib/invitationFormat";
import { resolveFont } from "@/lib/fonts";
import type { TemplateProps } from "@/types/invitation";
import { Kit } from "../../../kit/Kit";
import { FitBox } from "../../../layouts/FitBox";

/** Left-aligned and earthy: an olive branch climbs the right edge beside names set in a script. */
export function OliveEngagement({ content, design }: TemplateProps) {
  const heading = { fontFamily: resolveFont(design.headingFont) };
  const names = design.scriptFont ? { fontFamily: resolveFont(design.scriptFont), fontStyle: "normal" as const } : heading;
  const has = (id: string) => design.decorations?.includes(id) ?? false;

  return (
    <>
      {has("olive") && <Kit kind="botanical" id="olive-branch" design={design} className="absolute -right-[6cqw] bottom-[6cqw] w-[52cqw]" />}
      {has("olive") && <Kit kind="botanical" id="olive-branch" design={design} className="absolute -right-[10cqw] top-[2cqw] w-[30cqw] -scale-y-100" />}
      <FitBox className="absolute inset-x-[11cqw] inset-y-[11cqw]" origin="top left" innerClassName="flex flex-col justify-center">
        <p className="max-w-[56cqw] text-[2.7cqw] uppercase tracking-[0.3em]" style={{ color: accentText(design) }}>
          {content.eventTitle}
        </p>
        <h3 className="mt-[3cqw] max-w-[62cqw] leading-[1]" style={{ ...names, fontSize: fitSize(15, content.hostNames, 9) }}>
          {content.hostNames}
        </h3>
        {has("rule") && <div className="my-[5cqw] h-px w-[22cqw]" style={{ backgroundColor: design.accentColor }} aria-hidden="true" />}
        <p className="max-w-[56cqw] leading-tight" style={{ ...heading, fontSize: fitSize(5.6, formatDate(content.date, "long-us"), 16) }}>
          {formatDate(content.date, "long-us")}
        </p>
        <p className="mt-[1.6cqw] max-w-[56cqw] text-[3cqw] opacity-85">{whenWhere(content)}</p>
        {content.address && <p className="max-w-[56cqw] text-[2.5cqw] opacity-65">{content.address}</p>}
        {content.message && <p className="mt-[4cqw] max-w-[54cqw] text-[2.8cqw] leading-relaxed">{content.message}</p>}
        {content.additionalDetails && <p className="mt-[1.5cqw] max-w-[54cqw] text-[2.3cqw] opacity-65">{content.additionalDetails}</p>}
      </FitBox>
    </>
  );
}
