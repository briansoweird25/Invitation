import { Suspense } from "react";
import { resolveFont } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import type { InvitationContent, InvitationDesign } from "@/types/invitation";
import { Kit } from "./kit/Kit";
import { getTemplate } from "./templateCatalog";
import { getTemplateComponent } from "./templateLoader";

/** Only http(s) links are drawn, and quotes are escaped so the value cannot break out of url(). */
function safeImageUrl(url: string | undefined): string | undefined {
  if (!url || !/^https?:\/\//i.test(url)) return undefined;
  return `url("${url.replace(/["\\\n]/g, encodeURIComponent)}")`;
}

/** Invitations saved before frames existed used the "border" decoration. They keep their thin frame. */
function withLegacyDefaults(design: InvitationDesign): InvitationDesign {
  if (!design.frame && design.decorations?.includes("border")) return { ...design, frame: { id: "thin-line" } };
  return design;
}

interface InvitationRendererProps {
  templateId: string;
  content: InvitationContent;
  design: InvitationDesign;
  className?: string;
}

/**
 * The single place an invitation is drawn: editor preview, public page, thumbnails and future export.
 * It fills the width it is given; template sizes scale with that width.
 *
 * Layers, back to front: background color or image, background wash, pattern, frame, then the template
 * (decorations, content and ornaments). Template components load on demand.
 */
export function InvitationRenderer({ templateId, content, design: rawDesign, className }: InvitationRendererProps) {
  const template = getTemplate(templateId);
  const Template = template ? getTemplateComponent(template.id) : undefined;

  if (!template || !Template) {
    return (
      <div role="status" className="grid aspect-[4/5] w-full place-items-center bg-muted p-6 text-center text-sm text-muted-foreground">
        This template is no longer available.
      </div>
    );
  }

  const design = withLegacyDefaults(rawDesign);

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
        <Kit kind="background" id={design.background?.id} design={design} color={design.background?.color} opacity={design.background?.opacity} />
        <Kit kind="pattern" id={design.pattern?.id} design={design} color={design.pattern?.color} opacity={design.pattern?.opacity} />
        <Kit kind="frame" id={design.frame?.id} design={design} color={design.frame?.color} />
        <Suspense fallback={null}>
          <Template content={content} design={design} />
        </Suspense>
      </div>
    </div>
  );
}
