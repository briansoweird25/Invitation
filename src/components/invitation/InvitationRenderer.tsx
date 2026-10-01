import { resolveFont } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import type { InvitationContent, InvitationDesign } from "@/types/invitation";
import { getTemplate } from "./templateRegistry";

/** Only http(s) links are drawn, and quotes are escaped so the value cannot break out of url(). */
function safeImageUrl(url: string | undefined): string | undefined {
  if (!url || !/^https?:\/\//i.test(url)) return undefined;
  return `url("${url.replace(/["\\\n]/g, encodeURIComponent)}")`;
}

interface InvitationRendererProps {
  templateId: string;
  content: InvitationContent;
  design: InvitationDesign;
  className?: string;
}

/**
 * The single place an invitation is drawn: editor preview, public page and future export.
 * It fills the width it is given; template sizes scale with that width.
 */
export function InvitationRenderer({ templateId, content, design, className }: InvitationRendererProps) {
  const template = getTemplate(templateId);

  if (!template) {
    return (
      <div role="status" className="grid aspect-[4/5] w-full place-items-center bg-muted p-6 text-center text-sm text-muted-foreground">
        This template is no longer available.
      </div>
    );
  }

  const Template = template.component;

  return (
    <div className={cn("@container w-full", className)}>
      <div
        className="relative aspect-[4/5] w-full overflow-hidden"
        style={{
          backgroundColor: design.backgroundColor,
          backgroundImage: safeImageUrl(design.backgroundImage),
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: design.textColor,
          fontFamily: resolveFont(design.bodyFont),
        }}
      >
        <Template content={content} design={design} />
      </div>
    </div>
  );
}
