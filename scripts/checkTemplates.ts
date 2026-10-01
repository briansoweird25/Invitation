/**
 * Validates the template catalog and the decoration kit against the rules in docs/TEMPLATE_SYSTEM.md.
 * Run with: npm run check:templates
 */
import { getKitPiece, kitPieces } from "../src/components/invitation/kit/registry";
import { templateList } from "../src/components/invitation/templateCatalog";
import { categories, isTemplateStyle, layouts } from "../src/data/taxonomy";
import { getTemplateComponent } from "../src/components/invitation/templateLoader";
import { contrastRatio } from "../src/lib/color";

const errors: string[] = [];
const warnings: string[] = [];
const fail = (msg: string) => errors.push(msg);
const warn = (msg: string) => warnings.push(msg);

// Kit
const seen = new Set<string>();
for (const piece of kitPieces) {
  const key = `${piece.kind}:${piece.id}`;
  if (seen.has(key)) fail(`kit: duplicate piece ${key}`);
  seen.add(key);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(piece.id)) fail(`kit: ${key} is not kebab-case`);
  if (piece.tags.length === 0 || !piece.tags.every(isTemplateStyle)) fail(`kit: ${key} has missing or unknown style tags`);
}

// Templates
const ids = new Set<string>();
for (const t of templateList) {
  const at = `template ${t.id}`;
  if (ids.has(t.id)) fail(`${at}: duplicate id`);
  ids.add(t.id);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(t.id)) fail(`${at}: id is not kebab-case`);
  if (!(categories as readonly string[]).includes(t.category)) fail(`${at}: unknown category ${t.category}`);
  for (const c of t.alsoSuits ?? []) if (!(categories as readonly string[]).includes(c)) fail(`${at}: unknown alsoSuits ${c}`);
  if (t.styles.length < 1 || t.styles.length > 4 || !t.styles.every(isTemplateStyle)) fail(`${at}: needs 1 to 4 known style tags`);
  if (!(layouts as readonly string[]).includes(t.layout)) fail(`${at}: unknown layout ${t.layout}`);
  if (!getTemplateComponent(t.id)) fail(`${at}: no component registered in templateLoader.ts`);

  const caps = t.capabilities;
  for (const [kind, list] of [["frame", caps.frames], ["pattern", caps.patterns], ["background", caps.backgrounds]] as const) {
    for (const id of list) if (!getKitPiece(kind, id)) fail(`${at}: capabilities list unknown ${kind} "${id}"`);
  }
  const decorationIds = caps.decorations.map((d) => d.id);

  if (t.presets.length === 0) fail(`${at}: needs at least one preset`);
  else if (t.presets.length < 3) warn(`${at}: has ${t.presets.length} preset(s); aim for 3 to 5`);
  const presetIds = new Set<string>();
  for (const p of t.presets) {
    const pat = `${at} preset ${p.id}`;
    if (presetIds.has(p.id)) fail(`${pat}: duplicate preset id`);
    presetIds.add(p.id);
    const d = p.design;
    if (d.frame && !caps.frames.includes(d.frame.id)) fail(`${pat}: frame "${d.frame.id}" is not in capabilities`);
    if (d.pattern && !caps.patterns.includes(d.pattern.id)) fail(`${pat}: pattern "${d.pattern.id}" is not in capabilities`);
    if (d.background && !caps.backgrounds.includes(d.background.id)) fail(`${pat}: background "${d.background.id}" is not in capabilities`);
    for (const deco of d.decorations ?? []) if (!decorationIds.includes(deco)) fail(`${pat}: decoration "${deco}" is not in capabilities`);
    const text = contrastRatio(d.textColor, d.backgroundColor);
    const accent = contrastRatio(d.accentColor, d.backgroundColor);
    if (text === null || text < 4.5) fail(`${pat}: text contrast ${text?.toFixed(2)} is below 4.5`);
    if (accent === null) fail(`${pat}: invalid accent color`);
    else if (accent < 3) warn(`${pat}: accent contrast ${accent.toFixed(2)} is below 3 (fine for shapes, not for text)`);
  }
}

for (const w of warnings) console.warn(`warning: ${w}`);
if (errors.length > 0) {
  for (const e of errors) console.error(`error: ${e}`);
  process.exit(1);
}
console.log(`ok: ${templateList.length} templates, ${kitPieces.length} kit pieces`);
