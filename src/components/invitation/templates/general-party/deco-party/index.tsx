import { accentText } from "@/lib/color";
import { fitSize, formatDate, whenWhere } from "@/lib/invitationFormat";
import { resolveFont } from "@/lib/fonts";
import type { TemplateProps } from "@/types/invitation";
import { Kit } from "../../../kit/Kit";
import { FitBox } from "../../../layouts/FitBox";

/** An art deco card: a sunrise motif, stepped rules and wide-set capitals. */
export function DecoParty({ content, design }: TemplateProps) {
  const heading = { fontFamily: resolveFont(design.headingFont) };
  const has = (id: string) => design.decorations?.includes(id) ?? false;
  const rule = { borderColor: design.accentColor };
  const dateLine = formatDate(content.date, "full-us");

  return (
    <>
      {has("sunrise") && <Kit kind="ornament" id="sun-rays" design={design} className="absolute left-1/2 top-[9cqw] size-[30cqw] -translate-x-1/2" />}
      <FitBox className="absolute inset-x-0 bottom-[11cqw] top-[41cqw]" innerClassName="flex flex-col items-center justify-center px-[13cqw] text-center">
        <p className="text-[2.6cqw] uppercase tracking-[0.4em]" style={{ color: accentText(design) }}>
          {content.eventTitle}
        </p>
        <div className="mt-[3cqw] h-[1.2cqw] w-[30cqw] border-y" style={rule} aria-hidden="true" />
        <h3 className="mt-[4cqw] max-w-full uppercase leading-[1.05] tracking-[0.12em]" style={{ ...heading, fontSize: fitSize(9.4, content.hostNames, 12) }}>
          {content.hostNames}
        </h3>
        <div className="mt-[4cqw] h-[1.2cqw] w-[30cqw] border-y" style={rule} aria-hidden="true" />
        <p className="mt-[5cqw] uppercase tracking-[0.24em]" style={{ ...heading, fontSize: fitSize(3.8, dateLine, 18) }}>
          {dateLine}
        </p>
        <p className="mt-[1.6cqw] text-[2.7cqw] uppercase tracking-[0.18em] opacity-85">{whenWhere(content)}</p>
        {content.address && <p className="text-[2.3cqw] tracking-wide opacity-65">{content.address}</p>}
        {content.message && <p className="mt-[3.5cqw] max-w-[62cqw] text-[2.8cqw] leading-relaxed opacity-90">{content.message}</p>}
        {content.additionalDetails && <p className="mt-[1.5cqw] max-w-[62cqw] text-[2.3cqw] opacity-65">{content.additionalDetails}</p>}
      </FitBox>
    </>
  );
}
