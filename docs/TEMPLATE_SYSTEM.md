# Template System

This document is the architecture reference for invitation templates: how they are described, rendered, extended and added at scale.

It has two parts:

- **Current implementation** is what exists in the code today. Steps T1 (Template System v2), T2 (Kit v1), T3 (palettes, font pairings, pickers) and T4 (gallery upgrade) are done.
- **Target architecture** is where the template system is going. Parts that are not built yet are marked *(planned)*.

Read `CLAUDE.md` for the rules that apply to the whole product and `DESIGN.md` (Part B) for the visual language of the templates.

---

# 1. Goals

1. Adding a template should mean writing one component and one catalog entry. Nothing else changes: not the editor, not the renderer, not the database.
2. The catalog should be able to hold hundreds of templates across 13 categories and 13 style tags without slowing the app down.
3. Templates should look genuinely different from each other: different layouts, decorations, backgrounds, type and mood. Changing colors is not a new template.
4. One layout should be able to produce many gallery entries through **presets** (curated variations).
5. Everything a template draws comes from invitation data (`content` and `design`). Templates never contain event-specific text.
6. Existing saved invitations must keep working. Template ids are permanent.

---

# 2. Current implementation

```text
src/data/
├── taxonomy.ts             13 categories, 13 style tags, 10 layouts, category fallback
├── categories.ts           per-category config: labels, helpers, sample content, suggestions
├── palettes.ts             13 curated palettes with style tags
└── fontPairings.ts         15 curated heading, body and script pairings
src/lib/
├── fonts.ts                22 fonts, loaded on demand; ensureFontLoaded
└── templateFilters.ts      gallery filters, sorting and URL parsing
src/components/invitation/
├── InvitationRenderer.tsx  canvas, background, wash, pattern, frame, then the template
├── templateTypes.ts        TemplateMeta, DesignPreset, TemplateCapabilities
├── templateCatalog.ts      metadata for every template (no components)
├── templateLoader.ts       lazy component per template id
├── kit/                    51 shared decoration pieces
│   ├── frames.tsx  botanicals.tsx  patterns.tsx  ornaments.tsx  shapes.tsx  backgrounds.tsx
│   ├── registry.ts         kit metadata and lookup
│   ├── Kit.tsx             draws a piece with the invitation's colors
│   └── types.ts
└── templates/<category>/<template-id>/
    ├── index.tsx           the component
    └── meta.ts             the catalog entry
scripts/checkTemplates.ts   validates the catalog and kit (npm run check:templates)
```

**Catalog.** `TemplateMeta` (see 3.3) is small and always loaded. Components load on demand through `templateLoader.ts`, so adding templates does not grow the main bundle. Retired templates still resolve through `getTemplate` but are left out of `templateList`.

**Renderer.** `InvitationRenderer` draws the card (fixed 4:5 ratio, `@container`, so sizes use `cqw` units) and these layers, back to front: background color or image, kit background wash, kit pattern, kit frame, then the template. The template draws decorations, content and ornaments. A template component suspends briefly while its chunk loads, and the card background shows meanwhile, so there is no layout shift.

**Legacy designs.** Invitations saved before frames existed used the `"border"` decoration. The renderer treats a design with that decoration and no `frame` as having the `thin-line` frame. Choosing a frame in the editor (including None) removes `"border"`, so None really means none.

**Presets.** Each template has three presets. A preset is `{ id, name, design }` where `design` is a complete, resolved `InvitationDesign`. The first preset is the default. `/editor/new?template=<id>&preset=<id>` starts from a preset, and an unknown preset falls back to the default. The starting design records `presetId` as an editor hint.

**Capabilities.** The editor builds its panels from `capabilities`: template decorations (toggles), allowed frames, patterns and background washes (kit ids), allowed palettes and font pairings (ids or `"any"`), and whether the template accepts a background image. The Decorations panel is hidden when a template offers nothing.

**Editor pickers (T3).** Design controls show the result instead of names:

- **Looks:** the template's presets as thumbnails of the invitation itself, drawn with the current content. Choosing one replaces the design (fonts, colors, frame, pattern, wash, decorations) and keeps the user's background image. The `presetId` hint marks the active look.
- **Colors:** curated palettes as small colored cards, with palettes that match the template's styles first. Custom colors (text, accent, second accent) sit behind a "Custom colors" toggle. Picking a palette sets `paletteId`; editing a color by hand clears it.
- **Typography:** font pairings as cards that render the real fonts in the invitation's colors. "Choose fonts yourself" opens grouped selects for heading, body and an optional script font. A pairing sets `fontPairingId`; editing a font by hand clears it.
- **Frame, pattern and texture or wash:** tiles drawn with the invitation's own colors.
- A palette or pairing is highlighted when its values match the design.

**Fonts.** `lib/fonts.ts` lists 22 open-licensed fonts. Inter and Cormorant Garamond are bundled because the application UI uses them. All others load on demand through `ensureFontLoaded`, which `InvitationRenderer` calls for the fonts a design uses, so a font is only downloaded when it first appears. The renderer sets `font-synthesis: none`, so a font that lacks a weight or style shows its regular face instead of a faked one. A pairing's `script` font is used for names in templates that support it (Floral Wedding) and for the "and" in Elegant Wedding.

**Categories.** Event details labels and helper text come from `data/categories.ts`, so there are no hardcoded `category === "birthday"` checks. A template's sample content is the category sample plus the template's own overrides. The gallery lists only categories that have templates.

**Validation.** Stored rows are validated on load. An unknown `category` falls back to `general-party`. The design schema accepts the new optional keys.

**Templates.** Thirty-three templates, each with three or more presets, built from the kit:

| Template | Category | Styles | Layout | Tier |
| --- | --- | --- | --- | --- |
| Elegant Wedding | wedding | elegant, traditional | centered classic | free |
| Floral Wedding | wedding | floral, romantic, botanical | asymmetric | premium |
| Minimal Wedding | wedding | minimal, modern | editorial grid | free |
| Luxury Wedding | wedding | luxury, elegant | framed card | premium |
| Modern Birthday | birthday | modern, playful, colorful | typographic poster | free |
| Confetti Birthday | birthday | playful, colorful | ticket label | free |
| Vintage Birthday | birthday | vintage, traditional | badge and seal | premium |
| Editorial Birthday | birthday | editorial, modern | editorial grid | free |
| Botanical Baby Shower | baby-shower | botanical, romantic, minimal | arch window | premium |
| Rainbow Baby Shower | baby-shower | playful, colorful | split | free |
| Moonlight Baby Shower | baby-shower | romantic, modern, minimal | centered classic | free |
| Varsity Graduation | graduation | traditional, editorial, colorful | typographic poster | free |
| Golden Graduation | graduation | luxury, elegant, traditional | framed card | premium |
| Chalkboard Graduation | graduation | playful, modern, colorful | asymmetric | free |
| Ticket Party | general-party | playful, colorful, vintage | ticket label | free |
| Garden Party | general-party | floral, botanical, rustic | arch window | free |
| Deco Party | general-party | luxury, vintage, elegant | centered classic | premium |
| Bubbly Bridal Shower | bridal-shower | modern, playful, colorful | split | free |
| Peony Bridal Shower | bridal-shower | romantic, floral, elegant | framed card | free |
| Ring Engagement | engagement | minimal, modern, elegant | centered classic | free |
| Olive Engagement | engagement | rustic, botanical, romantic | asymmetric | free |
| Gilded Anniversary | anniversary | luxury, traditional, elegant | badge and seal | premium |
| Heart Anniversary | anniversary | romantic, vintage, editorial | typographic poster | free |
| Blessing Baptism | baptism | traditional, elegant, minimal | centered classic | free |
| Water Baptism | baptism | minimal, botanical, modern | asymmetric | free |
| Lily Communion | communion | floral, romantic, traditional | centered classic | free |
| Radiant Communion | communion | traditional, vintage, luxury | badge and seal | premium |
| Sunset Retirement | retirement | modern, colorful, minimal | typographic poster | free |
| Distinguished Retirement | retirement | traditional, elegant, vintage | framed card | free |
| Supper Dinner Party | dinner-party | elegant, vintage, editorial | framed card | free |
| Plate Dinner Party | dinner-party | rustic, modern, colorful | badge and seal | free |
| Summit Corporate | corporate-event | modern, minimal, editorial | editorial grid | free |
| Gala Corporate | corporate-event | luxury, elegant, modern | split | premium |

The first four are the reference templates that proved the architecture. The next four are the first batch (T5) the next three are the Baby Shower batch (T6), and the rest are the Graduation, General Party, Bridal Shower, Engagement, Anniversary, Baptism, Communion, Retirement, Dinner Party and Corporate Event batches (T7 to T13). Each has a clearly different layout, type, decoration and mood.

**Helpers for content robustness.** `fitSize(base, text, comfortableChars)` in `lib/invitationFormat.ts` shrinks a font size for long names so they stay inside the card. `pickReadable(background, ...candidates)` in `lib/color.ts` picks the most readable text color for text drawn on an accent-colored shape (a ribbon, a seal). `accentText(design)` returns the accent color when it is readable as text on the background and the main text color otherwise, so a soft pastel accent never makes a label unreadable. The T5 and T6 templates also clamp optional lines and keep their content in a padded box that clips instead of running over the frame.

**Database.** `invitations.template_id` and `category` are plain text with no foreign key and no enum. `content`, `design` and `rsvp_settings` are JSONB. See section 9.

**Gallery (T4).** `/templates` and `/templates/:category` support:

- Category tabs for categories that have templates, with counts. The bar scrolls horizontally on small screens.
- Style chips for styles that at least one template (after the category and price filters) has, with counts. Selecting several shows templates that have **any** of them.
- A price filter and a sort (Featured, New, A to Z). Ties keep catalog order.
- URL state: `?style=floral,vintage&access=free&sort=new`. Defaults are left out of the URL, and the category tabs keep the other filters.
- Cards sit on a backdrop tinted with the template's own background color, show the category and up to two style tags, and reveal with a short staggered fade.
- Card previews render only when they are within about 400px of the viewport (`LazyMount`), with a same-sized placeholder so nothing shifts.
- The preview dialog shows a template's presets as variation swatches. Choosing one switches the large preview and starts the editor with it: `/editor/new?template=<id>&preset=<id>`.
- The landing page has an "Occasions" section: a card with a real preview for each category that has templates, and a list of the categories that are on the way.

**Still to do:** more templates (T5+), kit illustrations, layout primitives, collections in the gallery, search, and lazy loading of kit pieces if the kit grows large.

---

# 3. Target architecture

```text
data/taxonomy.ts            categories, style tags (single source of truth)
data/categories.ts          per-category content config (labels, samples, defaults)
data/palettes.ts            curated palette library
data/fontPairings.ts        curated typography pairings
components/invitation/
├── InvitationRenderer.tsx  canvas + background + pattern, then the template
├── templateCatalog.ts      light metadata for every template (always loaded)
├── templateLoader.ts       lazy loading of template components
├── kit/                    shared decoration library (SVG components)
│   ├── frames.tsx botanicals.tsx patterns.tsx ornaments.tsx shapes.tsx backgrounds.tsx
│   ├── illustrations.tsx   (planned)
│   └── registry.ts         kit metadata (id, kind, label, tags, color slots)
├── layouts/                reusable layout primitives (planned)
└── templates/
    └── <category>/<template-id>/
        ├── index.tsx       the component
        ├── meta.ts         catalog entry (name, styles, presets, capabilities)
        └── thumbnail.*     optional static thumbnail
```

Section 2 shows what is built. Section 11 gives the order for the rest.

## 3.1 Taxonomy

`data/taxonomy.ts` is the only place categories and style tags are defined. Everything else (gallery, editor, validation, landing page) derives from it.

```ts
export const categories = [
  "wedding", "birthday", "baby-shower", "bridal-shower", "engagement",
  "anniversary", "graduation", "baptism", "communion", "retirement",
  "dinner-party", "corporate-event", "general-party",
] as const;
export type InvitationCategory = (typeof categories)[number];

export const styleTags = [
  "elegant", "romantic", "floral", "modern", "minimal", "luxury", "vintage",
  "rustic", "botanical", "playful", "colorful", "traditional", "editorial",
] as const;
export type TemplateStyle = (typeof styleTags)[number];
```

Rules:

- Category ids are lowercase kebab-case. They are stored in `invitations.category`, so **an id is permanent once any invitation uses it**.
- Add new categories and tags by appending. Never rename or remove one.
- A template has one primary category and may list extra categories it also suits. A template has one to four style tags.
- Style tags describe the look, not the occasion. They power gallery filters.

## 3.2 Category configuration

`data/categories.ts` makes the editor and gallery data-driven instead of hardcoding checks like `category === "birthday"`.

```ts
interface CategoryConfig {
  id: InvitationCategory;
  label: string;                 // "Baby Shower"
  description: string;           // gallery and landing copy
  icon: LucideIconName;
  fields: {
    hostNames: { label: string; helper?: string };      // "Names", "Honoree", "Company"
    eventTitle: { label: string; helper?: string };     // "Opening line", "Headline"
    // Fields can be hidden or relabeled per category.
  };
  suggestedStyles: TemplateStyle[];
  rsvpDefault: boolean;
  messageSuggestions: string[];  // starter copy; also feeds the future AI writer
  sampleContent: InvitationContent;  // fallback sample for previews
}
```

Per-category content guidance is in `DESIGN.md` (B2). The `InvitationContent` model stays the same for every category. Fields keep their names and change only their labels.

## 3.3 Template catalog entry

Metadata is separate from the component so the gallery can list hundreds of templates without loading hundreds of components.

```ts
interface TemplateMeta {
  id: string;                         // permanent, kebab-case, unique
  name: string;
  description: string;
  category: InvitationCategory;       // primary
  alsoSuits?: InvitationCategory[];
  styles: TemplateStyle[];            // 1 to 4 tags
  layout: LayoutId;                   // see DESIGN.md B4
  tier: "free" | "premium";           // maps to the current isPremium flag
  status: "active" | "retired";       // retired templates still render for existing invitations
  featured?: boolean;
  addedAt: string;                    // ISO date, drives "New"
  capabilities: TemplateCapabilities;
  presets: DesignPreset[];            // first preset is the default
  sampleContent?: Partial<InvitationContent>;  // overrides the category sample
}
```

`TemplateDefinition` is the `TemplateMeta` plus the lazily loaded component.

## 3.4 Capabilities

A template declares what it can do. The editor builds its panels from this list. A template never has controls that do nothing.

```ts
interface TemplateCapabilities {
  decorations: { id: string; label: string }[];  // template-specific toggles (design.decorations)
  frames: string[];                   // kit frame ids
  patterns: string[];                 // kit pattern ids
  backgrounds: string[];              // kit background ids (washes and textures)
  backgroundImage: boolean;           // accepts an uploaded or linked image
  palettes: string[] | "any";
  fontPairings: string[] | "any";
  // Planned: contentFields
}
```

Panels are hidden when a template offers nothing for them.

## 3.5 Presets (variations)

A **preset** is a complete, curated design: palette, font pairing, decorations, frame, pattern and background. A template has several. Presets are how one layout becomes many gallery entries.

```ts
interface DesignPreset {
  id: string;                         // unique within the template
  name: string;                       // "Ivory & Gold"
  design: InvitationDesign;           // resolved values: fonts, colors, frame, pattern, decorations
}
```

Presets store resolved values, which is what an invitation stores. Starting from a preset records `presetId` as a hint. The editor records `paletteId` and `fontPairingId` when someone picks a palette or pairing, and clears them when colors or fonts are edited by hand.

- The gallery shows each template with its default preset. The preview dialog offers the other presets as swatches.
- Choosing a preset starts the editor with that design: `/editor/new?template=<id>&preset=<presetId>`. A missing or unknown preset means the default one.
- Applying a preset writes ordinary values into `design`. After that the user is free to change anything.
- A new look that needs a different layout is a new template. A new look on the same layout is a new preset.

## 3.6 Design data

`InvitationDesign` gains optional keys. Every existing key stays and keeps its meaning, so saved invitations keep working.

```ts
interface InvitationDesign {
  // Existing keys (resolved values; the renderer uses these)
  headingFont: string;
  bodyFont: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  backgroundImage?: string;
  borderStyle?: string;
  decorations?: string[];

  // New optional keys
  secondaryColor?: string;            // second accent for richer palettes
  scriptFont?: string;                // names and flourishes only
  paletteId?: string;                 // editor hint: which palette is selected
  fontPairingId?: string;             // editor hint
  presetId?: string;                  // editor hint
  frame?: { id: string; color?: string };
  pattern?: { id: string; color?: string; opacity?: number };
  background?: BackgroundSpec;        // gradient, texture or image details
}
```

Rules:

- **Resolved values win.** Templates render from the concrete colors and fonts. Palette, pairing and preset ids are only hints for the editor, so a template never needs a lookup to draw itself and an invitation survives a palette being edited or retired.
- Unknown ids and unknown keys are ignored, never an error.
- New keys must be optional. Do not make an existing optional key required.
- All of it lives in the `design` JSONB column. See section 9.

## 3.6.1 Palettes

Palettes are curated, not free-form. Each has:

```ts
interface Palette {
  id: PaletteId;
  name: string;
  tags: TemplateStyle[];
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  secondaryColor?: string;
  decorationColors?: string[];       // botanical greens, foil tones and so on
}
```

A palette must meet the contrast rule in `DESIGN.md` (B11). Color pickers stay available as an advanced option and show the existing low-contrast warning.

## 3.6.2 Font pairings

```ts
interface FontPairing {
  id: FontPairingId;
  name: string;
  heading: string;
  body: string;
  script?: string;
  tags: TemplateStyle[];
}
```

`lib/fonts.ts` stays the font resolver. Fonts load lazily and only for the pairings actually in use (see section 8).

## 3.7 Rendering pipeline

The renderer draws in layers. Layers 0 to 2 are generic and driven by `design`. Layers 3 to 5 belong to the template and are built from kit pieces.

| Layer | What | Owner |
| --- | --- | --- |
| 0 | Background: color or image, plus an optional kit wash or texture | Renderer |
| 1 | Pattern | Renderer |
| 2 | Frame or border | Renderer, from `design.frame` |
| 3 | Decorations behind the text: botanicals, shapes, illustrations | Template, using the kit |
| 4 | Content layout: names, date, venue, message | Template |
| 5 | Foreground ornaments: corners, seals, flourishes | Template, using the kit |

The renderer keeps its current contract: it fills the width it is given, scales everything through `cqw` units and is the **only** place an invitation is drawn. The editor preview, the public page, thumbnails and exports all go through it.

## 3.8 The kit

Kit pieces are small SVG React components shared by every template.

```ts
interface KitPiece {
  id: string;
  kind: "frame" | "botanical" | "pattern" | "ornament" | "shape" | "background";  // "illustration" is planned
  label: string;
  tags: TemplateStyle[];
  colorSlots: ("accent" | "secondary" | "text" | "background")[];  // the first slot supplies `color`
  component: ComponentType<KitPieceProps>;
}
```

Kit v1.1 holds 51 pieces: 8 frames, 7 botanicals, 8 patterns, 10 ornaments (dividers, corner flourish, laurel, seal, sparkles, ribbon, cross, sun rays), 10 shapes (adds heart and droplet) and 8 backgrounds (soft, dawn and diagonal washes, vignette, paper grain, linen, watercolor, foil sheen). Templates draw a piece with `<Kit kind="botanical" id="sprig" design={design} className="..." />`, which picks the right design color.

Pieces are bundled together for now because each is tiny. Revisit lazy loading when the kit passes about a hundred pieces.

Rules for kit pieces:

- Colors come from `design`, never hardcoded, so every piece recolors with every palette.
- Size and position come from the parent, in `cqw` units. A piece fills the box it is given. Full-card layers (frame, pattern, background) use the card's 100 x 125 coordinate space, so they look the same at every size.
- SVG `<pattern>`, `<filter>` and gradient ids come from `useUid()`, so many cards on one page never collide.
- Pure inline SVG or CSS. No raster images, no network requests, no external fonts.
- Decorative pieces are `aria-hidden`.
- Each piece is original work or uses a permissive license (see `DESIGN.md` B12).

## 3.9 Layouts

A layout is a reusable arrangement of the content fields (centered classic, asymmetric, split, editorial grid and so on, listed in `DESIGN.md` B4). Layouts handle spacing, alignment and text overflow. Templates choose a layout and style it. Two templates on the same layout must still differ in decoration, type and background so they do not feel like palette swaps.

## 3.10 Code splitting

- `templateCatalog.ts` holds only `TemplateMeta`. It is small and always available.
- Template components load on demand through `templateLoader.ts`, one chunk per template.
- `InvitationRenderer` shows the card background while the component loads, then the template.
- The gallery renders previews only for cards that are on or near the screen.
- Fonts load on demand, only when a design that uses them is drawn.

---

# 4. Naming and ids

- Template id: `{descriptor}-{category}`, lowercase kebab-case. Examples: `elegant-wedding`, `botanical-baby-shower`, `neon-birthday`. If a descriptor repeats, add a qualifier: `classic-wedding-script`.
- An id is **permanent**. Never rename or reuse one. A template that should disappear gets `status: "retired"`, which hides it from the gallery but still renders for invitations that use it.
- Preset, palette, pairing, frame, pattern and kit ids follow the same rules.
- The four current templates keep their ids.

---

# 5. Content robustness

Use `fitSize` for names and headlines, `pickReadable` for text on accent shapes, `line-clamp` on optional lines, and keep content inside a padded, clipped box so it never reaches the frame. Test every template with the stress cases below.

Every template must stay presentable with:

- very long and very short names, and names that wrap onto several lines
- missing optional fields (no message, no address, no time)
- an unparseable date (the raw text is shown)
- a background image under the text
- the largest and the smallest preview sizes

The details are in `DESIGN.md` B10. Text is clamped rather than allowed to overflow the card.

---

# 6. Editor integration

The editor stays one set of panels. What changes is where their options come from.

- **Event details** and **Message** take their labels, helpers and starter copy from `CategoryConfig`.
- **Typography** offers the template's allowed font pairings as cards that show a live sample, with the individual font selects as an advanced option.
- **Colors** offers the template's allowed palettes first, then custom colors.
- **Background** offers the template's allowed background kinds (solid, gradient, texture, image).
- **Decorations** offers the template's decorations, frames and patterns as thumbnails.
- A panel with nothing to offer is hidden.

The invitation stays the visual focus. Pickers use small thumbnails of the actual result, not text lists.

---

# 7. Gallery integration

- Categories come from the taxonomy. Only categories that have at least one active template are listed.
- With 13 categories the category bar scrolls horizontally on small screens.
- Style tags become filter chips (multi-select).
- Price filter, sort (Featured, New, A to Z) and later search.
- URL state: `/templates/:category?style=floral,vintage&access=free`.
- Cards show the default preset. The preview dialog shows variations.
- The landing page shows categories with a representative preview each.

---

# 8. Performance

- Catalog metadata is small and eager. Components, kit pieces and fonts are lazy.
- Kit pieces are inline SVG, which keeps previews light and prints cleanly for export.
- Previews in a grid render only when visible.
- No template may add a raster asset to the bundle. Backgrounds and textures are CSS or SVG. Uploaded images go through Supabase Storage.
- Keep per-template code small by composing kit pieces and layouts.

---

# 9. Persistence and database

**No schema change is needed.**

- `invitations.category` is plain text (1 to 40 characters, no enum), so new categories such as `baby-shower` work as they are.
- `invitations.template_id` is plain text with no foreign key, so new templates need no migration.
- New design keys (frame, pattern, background, ids) go inside the `design` JSONB column.
- Template metadata for the catalogue (style tags, featured flag, preset names) can optionally be mirrored into `templates.configuration` (JSONB). The in-app catalog is the source of truth. The `templates` table is a read-only mirror that may be seeded by a migration if the data is ever needed server-side.
- The `design` size limit (20,000 characters) is large enough for the new keys.

Done in T1: `src/lib/invitationApi.ts` maps any stored `category` through the taxonomy with a `general-party` fallback, `src/lib/validation.ts` accepts the new optional design keys, and the `Invitation` type takes its category from `data/taxonomy.ts`.

---

# 10. Adding a template (checklist)

1. Pick the category, the style tags and the layout. Check the gallery for overlap. The new template must have a clearly different look.
2. Create `templates/<category>/<id>/` with `index.tsx` (a named export) and `meta.ts`.
3. Build it from kit pieces (and layouts, once they exist). Add a new kit piece only when several templates could use it.
4. Draw every piece from `content` and `design`. No event text, no hardcoded colors that should follow the palette.
5. Define 3 to 5 presets. At least one should be noticeably different in mood.
6. Declare capabilities honestly. Only list what the template really supports.
7. Add sample content only when the category sample does not fit.
8. Add the meta to `templateCatalog.ts` and the lazy import to `templateLoader.ts`.
9. Run `npm run check:templates`. It checks ids, categories, style tags, layouts, loader registration, preset capabilities, kit ids, palette and pairing ids, fonts and contrast.
10. Run the quality checklist in `DESIGN.md` B13, including the stress cases in section 5 above.
11. Check the gallery card, the preview dialog, the editor at desktop and mobile widths, and the dashboard thumbnail.

Nothing in the editor, the renderer, the database or the dashboard should need to change. If it does, the architecture needs fixing, not the template.

---

# 11. Roadmap

Template work runs as its own track alongside the numbered phases in `CLAUDE.md`.

| Step | Work | Notes |
| --- | --- | --- |
| T1 | Taxonomy, category config, catalog/loader split, presets, migrate the four reference templates | **Done.** |
| T2 | Kit v1: frames, botanicals, patterns, ornaments and dividers, shapes, backgrounds | **Done.** 47 pieces, used by the reference templates. |
| T3 | Palette and font-pairing libraries, plus the editor pickers | **Done.** 21 palettes (8 added in T7), 18 pairings (3 added), 22 fonts, Looks, thumbnail pickers. |
| T4 | Gallery upgrade: 13 categories, style filters, variations in the preview, lazy previews | **Done.** Plus sort, URL state and the landing Occasions section. |
| T5 | First template batch: Wedding and Birthday to four templates each | **Done.** Luxury Wedding, Confetti Birthday, Vintage Birthday, Editorial Birthday. |
| T6 | Baby Shower batch | **Done.** Botanical, Rainbow and Moonlight Baby Shower. |
| T7 | Graduation batch | **Done.** Varsity, Golden and Chalkboard Graduation. Kit v1.1 (heart, droplet, cross, sun rays), new palettes and pairings. |
| T8 | General Party batch | **Done.** Ticket, Garden and Deco Party. |
| T9 | Bridal Shower and Engagement | **Done.** Bubbly and Peony Bridal Shower; Ring and Olive Engagement. |
| T10 | Anniversary | **Done.** Gilded and Heart Anniversary. |
| T11 | Baptism and Communion | **Done.** Blessing and Water Baptism; Lily and Radiant Communion. |
| T12 | Retirement | **Done.** Sunset and Distinguished Retirement. |
| T13 | Dinner Party and Corporate Event | **Done.** Supper and Plate Dinner Party; Summit and Gala Corporate. |
| Next | Third templates for the two-template categories, illustrations, layout primitives, collections and search | Not started. |

T1 and T2 are in place, so Phase 9 (public invitations) and Phase 11 (export) render the richer templates from day one.

## Exports

`lib/exportInvitation.ts` draws the invitation with `InvitationRenderer` at 1200 CSS px wide off screen and rasterises it (PNG 2400 x 3000, PDF 8 x 10 in). Template authors get exports for free if they keep to the existing rules: draw only with the kit, CSS and the fonts in `lib/fonts.ts` (fonts are embedded from the page's own font rules), use `cqw` units and `FitBox`, and use no external images or `<img>` elements. A template that loads a remote resource would need a CORS-enabled source to appear in exports. The only external image is the owner's background image, which the exporter embeds itself; `InvitationRenderer` accepts embedded `data:image/png|jpeg|webp|gif` for that purpose and never SVG.

## Category discovery

A template has one primary `category` and may list more in `alsoSuits`. `lib/templateFilters.ts` is the single place that decides discoverability: `suitsCategory`, `templatesInCategory` and `categoriesInUse` count a template once per category it suits, never as a duplicate record. Category pages list primary templates first. A template opened from another category's page starts with that category's sample content and saves that category (the editor URL carries `?category=` only when it differs from the primary). Templates without `alsoSuits` appear only in their primary category.

## Long content: FitBox

Every template places its text in one or more `FitBox` regions (`components/invitation/layouts/FitBox.tsx`). Text wraps at the region's width, with `overflow-wrap: anywhere` so unbroken words wrap too. If the content is still taller than the region, the whole block shrinks uniformly (never below 0.4) rather than being truncated or running over a frame. User text is never clipped. Rules for template authors:

- Place the region inside the frame margin (frames sit 4 to 7.5% in). Put horizontal padding on the region, not on the inner block, when `origin="top left"`, because inner padding scales with the content.
- Use `fitSize(base, text, comfortableChars)` on names and titles, then let `FitBox` handle the rest.
- Never use `truncate`, `line-clamp` or `break-words` (it overrides `anywhere`).
- Show every field the category offers, including `additionalDetails`, and skip empty ones.

## Reviewing templates

`npm run dev`, then open `/dev/templates?ids=a,b&content=long&cols=4&width=300`. It renders every Look of the chosen templates with sample or stress content (`long`, `unbroken`, `empty`, `baddate`). The route exists only in development.

## Tests

Unit tests (`npm run test`) cover the taxonomy, filters, catalog invariants (ids and categories are stable, at least two primary templates per category, three Looks each, every style tag used), date formatting, fit math and a static render of every template, Look, category and stress content. Browser tests (`npm run test:e2e`) cover the gallery, editor capabilities for every template, Looks, autosave and reload, legacy invitations, mobile overflow, and long content in four font sets at desktop and mobile widths. They run against a mocked Supabase.

Do not build all templates at once. Build a batch, test it in the gallery, the editor and the dashboard, then continue.
