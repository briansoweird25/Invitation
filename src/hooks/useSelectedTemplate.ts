import { useSearchParams } from "react-router-dom";
import { DEFAULT_TEMPLATE_ID, isTemplateId, type TemplateId } from "@/components/invitation/templateRegistry";

/** Reads `?template=<id>` from the URL. Missing or unknown ids fall back to the default template. */
export function useSelectedTemplate(): TemplateId {
  const [params] = useSearchParams();
  const id = params.get("template");
  return isTemplateId(id) ? id : DEFAULT_TEMPLATE_ID;
}
