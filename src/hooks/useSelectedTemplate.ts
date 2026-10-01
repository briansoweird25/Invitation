import { useSearchParams } from "react-router-dom";
import { DEFAULT_TEMPLATE_ID, getPreset, getTemplate, isTemplateId, type TemplateId } from "@/components/invitation/templateCatalog";

/**
 * Reads `?template=<id>` and `?preset=<id>` from the URL.
 * A missing or unknown template falls back to the default one, and an unknown preset to the template's default preset.
 */
export function useSelectedTemplate(): { templateId: TemplateId; presetId: string } {
  const [params] = useSearchParams();
  const requested = params.get("template");
  const templateId = isTemplateId(requested) ? requested : DEFAULT_TEMPLATE_ID;
  const presetId = getPreset(getTemplate(templateId)!, params.get("preset")).id;
  return { templateId, presetId };
}
