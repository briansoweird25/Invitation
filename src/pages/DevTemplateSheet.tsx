import { InvitationRenderer } from "@/components/invitation/InvitationRenderer";
import { getTemplate, sampleContentFor, templateList } from "@/components/invitation/templateCatalog";
import { stressContent, type StressKind } from "@/lib/testContent";

/**
 * Development-only contact sheet: every template and preset on one page, for visual review.
 *   /dev/templates                       all templates with sample content
 *   /dev/templates?ids=a,b               only these templates
 *   /dev/templates?content=long          stress content (long, unbroken, empty, baddate)
 *   /dev/templates?width=240&cols=8      card width in px and columns
 * Not part of the production build.
 */
export default function DevTemplateSheet() {
  const params = new URLSearchParams(location.search);
  const ids = params.get("ids")?.split(",").filter(Boolean);
  const kind = params.get("content") as StressKind | null;
  const width = Number(params.get("width") ?? 220);
  const cols = Number(params.get("cols") ?? 6);
  const templates = ids ? ids.map((id) => getTemplate(id)).filter((t) => t !== undefined) : templateList;

  return (
    <div className="grid gap-3 bg-[#ccc] p-3" style={{ gridTemplateColumns: `repeat(${cols}, ${width}px)` }}>
      {templates.flatMap((t) =>
        t.presets.map((p) => (
          <figure key={`${t.id}/${p.id}`} className="m-0">
            <InvitationRenderer templateId={t.id} content={kind ? stressContent(kind) : sampleContentFor(t)} design={p.design} />
            <figcaption className="text-xs">
              {t.id} / {p.id}
            </figcaption>
          </figure>
        )),
      )}
    </div>
  );
}
