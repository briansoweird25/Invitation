import { accentText } from "@/lib/color";
import { fitSize, formatDate, formatTime } from "@/lib/invitationFormat";
import { resolveFont } from "@/lib/fonts";
import type { TemplateProps } from "@/types/invitation";
import { Kit } from "../../../kit/Kit";
import { FitBox } from "../../../layouts/FitBox";

/** A certificate: "in honor of", a large name, then a two-column When and Where above a seal. */
export function DistinguishedRetirement({ content, design }: TemplateProps) {
  const heading = { fontFamily: resolveFont(design.headingFont) };
  const has = (id: string) => design.decorations?.includes(id) ?? false;
  const label = "text-[2.1cqw] uppercase tracking-[0.24em]";

  return (
    <>
      {has("corners") && (
        <>
          <Kit kind="ornament" id="corner-flourish" design={design} className="absolute left-[8cqw] top-[8cqw] size-[10cqw]" />
          <Kit kind="ornament" id="corner-flourish" design={design} className="absolute right-[8cqw] top-[8cqw] size-[10cqw] scale-x-[-1]" />
        </>
      )}
      {has("seal") && <Kit kind="ornament" id="seal" design={design} className="absolute bottom-[8cqw] left-1/2 size-[11cqw] -translate-x-1/2" />}
      <FitBox className="absolute inset-x-0 bottom-[21cqw] top-[20cqw]" innerClassName="flex flex-col items-center justify-center px-[13cqw] text-center">
        <p className={label} style={{ color: accentText(design) }}>
          In honor of
        </p>
        <h3 className="mt-[3cqw] max-w-full leading-[1.05]" style={{ ...heading, fontSize: fitSize(11, content.hostNames, 14) }}>
          {content.hostNames}
        </h3>
        <p className="mt-[2cqw] italic leading-tight" style={{ ...heading, fontSize: fitSize(6, content.eventTitle, 16) }}>
          {content.eventTitle}
        </p>
        <Kit kind="ornament" id="divider-diamond" design={design} className="my-[4cqw] h-auto w-[40cqw]" />
        <div className="grid w-full grid-cols-2 gap-[5cqw] text-[2.9cqw] leading-snug">
          <div>
            <p className={label} style={{ color: accentText(design) }}>When</p>
            <p className="mt-[1cqw]">{formatDate(content.date, "long-us")}</p>
            {content.time && <p className="opacity-75">{formatTime(content.time)}</p>}
          </div>
          <div>
            <p className={label} style={{ color: accentText(design) }}>Where</p>
            <p className="mt-[1cqw]">{content.venue}</p>
            {content.address && <p className="opacity-75">{content.address}</p>}
          </div>
        </div>
        {content.message && <p className="mt-[4cqw] max-w-[62cqw] text-[2.7cqw] italic leading-relaxed opacity-90">{content.message}</p>}
        {content.additionalDetails && <p className="mt-[1.5cqw] max-w-[62cqw] text-[2.3cqw] opacity-65">{content.additionalDetails}</p>}
      </FitBox>
    </>
  );
}
