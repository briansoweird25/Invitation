import { accentText } from "@/lib/color";
import { fitSize, formatDate, whenWhere } from "@/lib/invitationFormat";
import { resolveFont } from "@/lib/fonts";
import type { TemplateProps } from "@/types/invitation";
import { FitBox } from "../../../layouts/FitBox";

/** A big round plate holds the headline; the host and details are set below, like place cards. */
export function PlateDinnerParty({ content, design }: TemplateProps) {
  const heading = { fontFamily: resolveFont(design.headingFont) };
  const has = (id: string) => design.decorations?.includes(id) ?? false;
  const second = design.secondaryColor ?? design.accentColor;

  return (
    <>
      <div className="absolute left-1/2 top-[10cqw] size-[68cqw] -translate-x-1/2 rounded-full" style={{ backgroundColor: has("plate") ? second : "transparent", opacity: 0.28 }} aria-hidden="true" />
      <div className="absolute left-1/2 top-[10cqw] size-[68cqw] -translate-x-1/2 rounded-full border-[0.9cqw]" style={{ borderColor: design.accentColor }} aria-hidden="true" />
      {has("rim") && <div className="absolute left-1/2 top-[15cqw] size-[58cqw] -translate-x-1/2 rounded-full border" style={{ borderColor: design.accentColor }} aria-hidden="true" />}
      <FitBox className="absolute left-[27cqw] right-[27cqw] top-[24cqw] h-[40cqw]" innerClassName="flex items-center justify-center text-center">
        <p className="leading-[1.05]" style={{ ...heading, fontSize: fitSize(7.6, content.eventTitle, 18) }}>
          {content.eventTitle}
        </p>
      </FitBox>
      <FitBox className="absolute inset-x-0 bottom-[10cqw] top-[84cqw]" innerClassName="flex flex-col items-center justify-center px-[13cqw] text-center">
        <p className="text-[3.2cqw] uppercase tracking-[0.24em]" style={{ color: accentText(design), ...heading }}>
          {content.hostNames}
        </p>
        <p className="mt-[3cqw] uppercase tracking-[0.14em]" style={{ ...heading, fontSize: fitSize(4.2, formatDate(content.date, "long-us"), 18) }}>
          {formatDate(content.date, "long-us")}
        </p>
        <p className="mt-[1.4cqw] text-[2.9cqw] opacity-85">{whenWhere(content)}</p>
        {content.address && <p className="text-[2.4cqw] opacity-65">{content.address}</p>}
        {content.message && <p className="mt-[3cqw] max-w-[62cqw] text-[2.7cqw] leading-relaxed">{content.message}</p>}
        {content.additionalDetails && <p className="mt-[1.5cqw] max-w-[62cqw] text-[2.3cqw] opacity-65">{content.additionalDetails}</p>}
      </FitBox>
    </>
  );
}
