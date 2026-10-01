import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { categoryConfigs } from "@/data/categories";
import { escapeHtml, stressContent } from "@/lib/testContent";
import { getPreset, sampleContentFor, templateList } from "./templateCatalog";
import { loadTemplateComponent } from "./templateLoader";

describe.each(templateList.map((t) => [t.id, t] as const))("template %s", (id, template) => {
  it("renders every preset with the category sample, with all text present", async () => {
    const Component = (await loadTemplateComponent(id))!;
    expect(Component).toBeTruthy();
    for (const preset of template.presets) {
      const content = sampleContentFor(template);
      const html = renderToStaticMarkup(<Component content={content} design={preset.design} />);
      expect(html.length).toBeGreaterThan(50);
      expect(html).toContain(escapeHtml(content.hostNames.split(/\s+(?:&|and)\s+/i)[0]));
    }
  });

  it("renders every other category it suits with that category's sample", async () => {
    const Component = (await loadTemplateComponent(id))!;
    for (const category of template.alsoSuits ?? []) {
      const content = sampleContentFor(template, category);
      expect(content.eventTitle).toBe(categoryConfigs[category].sampleContent.eventTitle);
      expect(() => renderToStaticMarkup(<Component content={content} design={getPreset(template).design} />)).not.toThrow();
    }
  });

  it("never truncates long user content: all of it is in the markup, none of it clamped", async () => {
    const Component = (await loadTemplateComponent(id))!;
    const content = stressContent("long");
    for (const preset of template.presets) {
      const html = renderToStaticMarkup(<Component content={content} design={preset.design} />);
      for (const text of [content.message, content.venue, content.eventTitle, content.additionalDetails ?? ""]) {
        if (text) expect(html, `${preset.id} lost "${text.slice(0, 30)}"`).toContain(escapeHtml(text));
      }
      expect(html).not.toMatch(/line-clamp|truncate|text-ellipsis/);
    }
  });

  it("handles missing optional content, an unparseable date and unbroken words without throwing", async () => {
    const Component = (await loadTemplateComponent(id))!;
    for (const kind of ["empty", "baddate", "unbroken"] as const) {
      for (const preset of template.presets) {
        expect(() => renderToStaticMarkup(<Component content={stressContent(kind)} design={preset.design} />), `${kind} / ${preset.id}`).not.toThrow();
      }
    }
  });

  it("wraps user text instead of letting long words overflow", async () => {
    const Component = (await loadTemplateComponent(id))!;
    const html = renderToStaticMarkup(<Component content={stressContent("unbroken")} design={getPreset(template).design} />);
    expect(html).toContain("overflow-wrap:anywhere");
  });
});
