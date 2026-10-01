import { useSearchParams } from "react-router-dom";
import { DEFAULT_TEMPLATE_ID, getPreset, getTemplate, isTemplateId, resolveCategory, type TemplateId } from "@/components/invitation/templateCatalog";
import type { InvitationCategory } from "@/data/taxonomy";

/**
 * Reads `?template=<id>`, `?preset=<id>` and `?category=<id>` from the URL.
 * A missing or unknown template falls back to the default one, an unknown preset to the template's default preset,
 * and a category the template does not suit to its primary category.
 */
export function useSelectedTemplate(): { templateId: TemplateId; presetId: string; category: InvitationCategory } {
  const [params] = useSearchParams();
  const requested = params.get("template");
  const templateId = isTemplateId(requested) ? requested : DEFAULT_TEMPLATE_ID;
  const template = getTemplate(templateId)!;
  const presetId = getPreset(template, params.get("preset")).id;
  return { templateId, presetId, category: resolveCategory(template, params.get("category")) };
}
