import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { sampleContentFor, getTemplate } from "./templateCatalog";
import { InvitationRenderer } from "./InvitationRenderer";

const t = getTemplate("elegant-wedding")!;
const html = (backgroundImage?: string) =>
  renderToStaticMarkup(<InvitationRenderer templateId={t.id} content={sampleContentFor(t)} design={{ ...t.presets[0].design, backgroundImage }} />);

describe("InvitationRenderer background images", () => {
  it("draws http(s) links and embedded raster images (what export uses)", () => {
    expect(html("https://example.com/a.png")).toContain("background-image:url(&quot;https://example.com/a.png&quot;)");
    expect(html("data:image/png;base64,AAAA")).toContain("data:image/png;base64,AAAA");
    expect(html("data:image/jpeg;base64,AAAA")).toContain("data:image/jpeg;base64,AAAA");
  });

  it("refuses everything else, including SVG data and script URLs", () => {
    for (const bad of ["data:image/svg+xml;base64,AAAA", "data:text/html;base64,AAAA", "javascript:alert(1)", "file:///etc/passwd", "//example.com/a.png"]) {
      expect(html(bad)).not.toContain("background-image");
    }
  });
});
