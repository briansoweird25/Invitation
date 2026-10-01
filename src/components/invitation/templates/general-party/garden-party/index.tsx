import { accentText } from "@/lib/color";
import { fitSize, formatDate, whenWhere } from "@/lib/invitationFormat";
import { resolveFont } from "@/lib/fonts";
import type { TemplateProps } from "@/types/invitation";
import { Kit } from "../../../kit/Kit";
import { FitBox } from "../../../layouts/FitBox";

/** A soft arch tinted with the secondary color, wildflowers at the foot and centered details inside. */
export function GardenParty({ content, design }: TemplateProps) {
  const heading = { fontFamily: resolveFont(design.headingFont) };
  const names = design.scriptFont ? { fontFamily: resolveFont(design.scriptFont), fontStyle: "normal" as const } : heading;
  const has = (id: string) => design.decorations?.includes(id) ?? false;
  const dateLine = formatDate(content.date, "long-us");

  return (
    <>
      {has("arch") && <div className="absolute bottom-0 left-[12cqw] top-[9cqw] w-[76cqw] rounded-t-full opacity-30" style={{ backgroundColor: design.secondaryColor ?? design.accentColor }} aria-hidden="true" />}
      {has("wildflowers") && (
        <>
          <Kit kind="botanical" id="wildflower" design={design} className="absolute -bottom-[3cqw] -left-[5cqw] w-[38cqw]" />
          <Kit kind="botanical" id="wildflower" design={design} className="absolute -bottom-[3cqw] -right-[5cqw] w-[38cqw] -scale-x-100" />
        </>
      )}
      <FitBox className="absolute bottom-[20cqw] left-[18cqw] right-[18cqw] top-[24cqw]" innerClassName="flex flex-col items-center justify-center text-center">
        <p className="text-[2.5cqw] uppercase tracking-[0.3em]" style={{ color: accentText(design) }}>
          {content.eventTitle}
        </p>
        <h3 className="mt-[3cqw] max-w-full leading-[1.05]" style={{ ...names, fontSize: fitSize(12, content.hostNames, 10) }}>
          {content.hostNames}
        </h3>
        <Kit kind="ornament" id="divider-flourish" design={design} className="my-[3.5cqw] h-auto w-[30cqw]" />
        <p style={{ ...heading, fontSize: fitSize(5.2, dateLine, 18) }}>{dateLine}</p>
        <p className="mt-[1.4cqw] text-[3.1cqw] tracking-wide opacity-85">{whenWhere(content)}</p>
        {content.address && <p className="text-[2.4cqw] opacity-65">{content.address}</p>}
        {content.message && <p className="mt-[3.5cqw] text-[2.8cqw] italic leading-relaxed opacity-90">{content.message}</p>}
        {content.additionalDetails && <p className="mt-[1.5cqw] text-[2.3cqw] opacity-65">{content.additionalDetails}</p>}
      </FitBox>
    </>
  );
}
