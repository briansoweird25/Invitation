# Invitation Generator Design System

## Design Goal

Create a premium invitation creation platform where the **invitations are rich, expressive and varied**, and the **application around them is clean, warm and easy to use**.

The visual identity combines:

- Premium stationery
- Editorial design
- Modern SaaS usability
- Elegant, characterful typography
- Strong visual hierarchy
- A wide range of invitation styles, from restrained to exuberant

The invitation itself is always the visual hero.

## How this document is organized

- **Part A: Application UI.** Navigation, landing page, gallery, editor, dashboard. Clean and premium, with more warmth and personality than a plain tool.
- **Part B: Invitation Design System.** The templates themselves. This is where the product gets expressive: many categories, styles, layouts, decorations, palettes and typography.

The technical architecture behind Part B is in `docs/TEMPLATE_SYSTEM.md`. Product rules are in `CLAUDE.md`.

---

# Part A: Application UI

## A1. Design Principles

### Clean

The interface is organized, calm and uncluttered. Controls are easy to find and easy to understand.

### Warm

Clean does not mean plain. The application should feel like a stationery studio, not a utility. Use warm neutrals, characterful serif headings, generous imagery and small moments of delight.

### Premium

Details matter:
- spacing
- alignment
- typography
- image quality
- borders
- subtle motion

### Showcase-first

The application's color and energy come from the invitations it displays. Wherever the product shows templates, let them carry the page.

### Human

Avoid repetitive, predictable AI-generated UI patterns.

### Functional

Beauty must never interfere with usability.

---

## A2. Avoid Generic AI UI

Do not use:

- Purple-to-blue gradients as the primary visual identity
- Giant gradient blobs
- Excessive glassmorphism
- Excessive floating cards
- Every section inside a rounded rectangle
- Excessive pill buttons
- Random sparkles
- Excessive glowing effects
- Huge text with little information
- Generic "AI-powered" visual treatment

In the **application UI**, every visual element should have a purpose.

In the **invitations**, decoration is the point. The rule there is quality and fit, not restraint (see Part B).

---

## A3. Application Palette

Base neutrals stay warm and quiet so that invitations stand out:

```text
Background:      #FAF9F6
Primary Text:    #1D1D1B
Secondary Text:  #6F6C65
Muted:           #9B978F
Border:          #E7E3DC
Surface:         #FFFFFF
Accent:          #8A7352
```

These are starting values, not rigid requirements.

### Atmosphere tints

To make the application feel less plain, marketing and gallery surfaces may use soft **atmosphere tints** drawn from the invitation palettes:

```text
Sage wash:     #EEF0E8
Blush wash:    #FBEFEC
Sand wash:     #F3ECE0
Mist wash:     #EAF0F2
Ink (dark):    #1D1D1B
Deep forest:   #24332B
```

Use them for:

- section backgrounds on the landing page
- the backdrop behind a template card (tinted to match that template)
- empty states and category headers
- one dark section per page for rhythm (call-to-action, footer)

Rules:

- Tints are flat or very subtle. No colorful gradients in application chrome.
- At most one tint family per section.
- Text on a tint must still meet contrast.
- The editor and dashboard working surfaces stay on the base neutrals.

---

## A4. Application Typography

The application UI uses a clean sans-serif for controls and body text.

Recommended:

- Inter
- Geist
- DM Sans

Headings on marketing and gallery pages use an expressive serif (Cormorant Garamond today). Mix roman and italic inside a heading for emphasis. Large serif headings with a short sans-serif supporting line are the signature pairing.

Do not use decorative or script fonts for normal UI controls. Script fonts belong inside invitations.

Typography should create hierarchy without relying on excessive font sizes.

---

## A5. Type Hierarchy

Landing and gallery pages:

```text
Display
Large Heading
Section Heading
Body
Small Text
Caption
```

Editor:

```text
Page Title
Panel Title
Field Label
Input
Helper Text
```

Invitation:

```text
Event Title
Names
Date
Venue
Message
Additional Details
```

Do not make every heading oversized.

---

## A6. Spacing

Use a small set of spacing values:

```text
4 8 12 16 20 24 32 40 48 64 80 96
```

Use larger spacing between major sections and smaller spacing inside controls.

Whitespace is an important part of the visual identity.

---

## A7. Borders, Radius, Shadows

Borders are subtle: `1px solid #E7E3DC`.

Radius for application UI: `6px`, `8px`, `10px`, `12px`. Do not make every element extremely rounded.

Shadows are restrained: `0 4px 20px rgba(...)`. Template previews may use a slightly deeper, softer shadow so they read as paper lifted off the page.

Optional finishing touches that add warmth without clutter:

- a very subtle paper grain on large marketing sections
- a small ornamental divider (a thin line with a tiny flourish) under section headings on marketing pages

---

## A8. Buttons

Primary buttons are visually clear.

```text
Create Invitation
Use Template
Publish
Save
RSVP
```

Secondary actions are quieter. Avoid making every button visually dominant.

---

## A9. Landing Page

The landing page should immediately communicate:

1. What the product does.
2. How varied and beautiful the invitations are.
3. How easy it is to use.
4. Why users should try it.

Suggested structure:

```text
Navbar

Hero
    Headline
    Supporting text
    CTA
    A composed collage of real invitations in different styles

Style showcase
    A row or marquee of templates across styles (floral, luxury, playful, vintage, editorial)

Event categories
    Wedding, Birthday, Baby Shower, Graduation and more, each with a real preview

Template showcase (featured)

How It Works

Feature Showcase

Pricing

FAQ

CTA

Footer
```

The hero and showcases use **real renderer output**, never abstract graphics. Show range: at least one restrained design, one botanical, one bold and colorful, and one vintage or editorial, so visitors see that the product is not limited to one look.

Atmosphere tints (A3) give each section its own mood.

Avoid huge empty hero sections.

---

## A10. Template Gallery

The gallery feels like a design marketplace, and it must keep working with hundreds of templates.

```text
Category bar (scrolls horizontally)
        ↓
Style filters (multi-select chips) · Price filter · Sort
        ↓
Template grid
```

- **Categories** come from the taxonomy (B2). Only categories that have templates are shown.
- **Style filters** use the 13 style tags (B2).
- **Sort:** Featured, New, A to Z.
- **Cards** show the invitation first. Information: name, category, style tags (one or two), Free or Premium, "Use template".
- **Backdrop:** each card sits on a soft tint matched to the template's palette so the grid has color and rhythm.
- **Variations:** the preview dialog shows the template's presets as swatches. Choosing one switches the large preview.
- **Collections** (for example "Spring florals", "Black tie", "Kids' parties") can group templates across categories on the landing page and at the top of the gallery.
- **Hover:** a gentle lift. Never a distracting animation.
- **Loading:** previews render when they come into view, with a calm placeholder.

Avoid clutter.

---

## A11. Invitation Editor

The editor is the most important screen.

Desktop concept:

```text
┌──────────────────────────────────────────────────────┐
│ Logo    Invitation Name        Saved    Publish      │
├──────────────┬──────────────────────┬────────────────┤
│              │                      │                │
│ Controls     │      Preview         │ Design         │
│              │                      │                │
│ Event        │                      │ Typography     │
│ Message      │                      │ Colors         │
│ Photos       │                      │ Background     │
│ RSVP         │                      │ Decorations    │
│              │                      │                │
└──────────────┴──────────────────────┴────────────────┘
```

The preview stays prominent and the editor chrome stays calm.

### Visual pickers

Design controls show **the result**, not names in a list:

- **Palettes:** swatch strips (background, text, accent, secondary).
- **Font pairings:** cards that render the actual heading and body fonts.
- **Frames, patterns, decorations:** small thumbnails drawn with the current palette.
- **Backgrounds:** thumbnails of solid, gradient, texture and image options.
- **Presets:** a "Looks" strip at the top of the design column, one thumbnail per preset.

Group controls and use accordions or tabs. Do not display dozens of controls at once.

Panels that a template cannot use are hidden, not disabled.

---

## A12. Mobile Editor

Mobile prioritizes the invitation preview.

```text
Header
Invitation Preview
Bottom Toolbar
Control Drawer
```

Possible toolbar:

```text
Details
Design
Photos
RSVP
```

Do not simply squeeze the desktop editor into a phone. Visual pickers become horizontally scrolling strips in the drawer.

---

## A13. Public Invitation

The public invitation should feel immersive.

Avoid dashboard navigation. The page focuses entirely on the event and takes on the invitation's own palette and mood for its surroundings (the area around the card uses the invitation's background color).

Possible structure:

```text
Invitation

Names / Event Title

Date
Time

Venue

Message

Location

RSVP

Additional Details
```

Use subtle animations only where they improve the experience.

---

## A14. RSVP UI

The RSVP form is simple.

```text
Will you be joining us?

○ Joyfully accepts
○ Regretfully declines

Your name
[________________]

Number of guests
[-] 2 [+]

Message
[________________]

[Send RSVP]
```

The form takes on the invitation's palette and heading font so it feels like part of the invitation.

---

## A15. Dashboard

The dashboard is simpler than the editor.

```text
Welcome back

[Create Invitation]

Your Invitations

Invitation Cards
```

Cards show:

- Thumbnail (real renderer output)
- Event name
- Date
- Status
- Edit
- View
- More

With many invitations in many styles, the dashboard becomes colorful on its own. Keep its chrome neutral.

---

## A16. Motion

Motion is subtle but present.

Good uses:

- Page transitions
- Panel opening
- Modal appearance
- Button feedback
- Preview changes (a soft cross-fade when a preset or palette changes)
- Template hover
- Staggered reveal of gallery cards on first load

Avoid:

- Constant floating animations
- Excessive parallax
- Large bouncing elements
- Animations that slow down creation

Respect reduced-motion settings.

---

## A17. Imagery

Use real, high-quality visual assets. The best imagery in the product is the invitations themselves.

Template thumbnails must accurately represent the actual templates, and they should be rendered by the same renderer.

Do not use placeholder images in production UI.

---

## A18. Icons

Use Lucide icons consistently. Icons have a consistent stroke weight, are sized appropriately and support the label rather than replace it.

Categories may use Lucide icons in the application UI. Invitation ornaments are a separate system (B5).

---

## A19. Forms

Forms feel calm and simple.

Labels are visible. Placeholder text does not replace labels. Use helper text only when useful. Error messages appear close to the relevant field.

---

## A20. Empty States

Empty states are helpful and calm, and may use a soft tint or a small illustration from the ornament set.

```text
No invitations yet

Create your first invitation
and start designing something beautiful.

[Create Invitation]
```

---

## A21. Responsive Behavior

Every important screen is tested at:

- 375px
- 768px
- 1024px
- 1440px

The layout adapts rather than simply shrinking.

---

## A22. Application Quality Checklist

Before considering a page complete, check:

- Is the hierarchy obvious?
- Is there enough whitespace?
- Are elements aligned?
- Are fonts consistent?
- Are buttons appropriately weighted?
- Are borders subtle?
- Does the page feel warm and considered, not plain and not busy?
- Do the invitations carry the color and energy of the page?
- Is there unnecessary decoration in the application chrome?
- Does it look good on mobile?
- Does it look like a real product?
- Does it look different from generic AI-generated websites?

---

# Part B: Invitation Design System

## B1. Principle: expressive and varied

```text
APPLICATION
Clean
Warm
Professional
Functional

INVITATION
Expressive
Decorative
Personal
Varied
```

Invitations are where the product shows its range. They should look like they came from a stationery designer: considered layouts, rich decoration, confident typography and strong mood.

The product should offer a wide spread:

- **Premium and luxury:** foil tones, fine frames, high-contrast serif type.
- **Playful and colorful:** bold shapes, saturated palettes, energetic composition.
- **Vintage:** engraved ornaments, muted inks, old-style type.
- **Modern editorial:** big type, strong grids, asymmetry.
- **Botanical and floral:** illustrated foliage, soft palettes, organic layouts.
- **Minimal:** whitespace, precision, restraint (one style among many, not the default).

Every template has a **distinct identity**: its own layout, decoration, background, type and mood. A palette swap is a *preset*, not a new template.

---

## B2. Taxonomy

### Categories

Categories describe the occasion. Ids are permanent (they are stored with saved invitations).

| Id | Label | Tone | Typical content and notes | Natural styles |
| --- | --- | --- | --- | --- |
| `wedding` | Wedding | Romantic, formal | Two names, ceremony and reception, dress code | Elegant, Romantic, Floral, Luxury, Minimal, Botanical, Traditional |
| `birthday` | Birthday | Celebratory | One name, age or milestone, party theme | Playful, Colorful, Modern, Editorial, Luxury |
| `baby-shower` | Baby Shower | Soft, joyful | Parents-to-be, registry note, theme | Playful, Botanical, Romantic, Minimal |
| `bridal-shower` | Bridal Shower | Feminine, celebratory | Bride name, host, theme | Floral, Romantic, Elegant, Colorful |
| `engagement` | Engagement | Romantic, personal | Two names, party details | Romantic, Elegant, Modern, Floral |
| `anniversary` | Anniversary | Warm, nostalgic | Couple, number of years | Elegant, Luxury, Vintage, Romantic |
| `graduation` | Graduation | Proud, energetic | Graduate, school, degree, year | Modern, Editorial, Colorful, Traditional |
| `baptism` | Baptism | Gentle, reverent | Child's name, church, family | Traditional, Elegant, Minimal, Botanical |
| `communion` | Communion | Gentle, reverent | Child's name, church, family | Traditional, Elegant, Floral |
| `retirement` | Retirement | Warm, appreciative | Honoree, years of service, host | Editorial, Vintage, Elegant, Modern |
| `dinner-party` | Dinner Party | Refined, intimate | Host, menu or theme, dress code | Luxury, Editorial, Rustic, Vintage |
| `corporate-event` | Corporate Event | Professional, branded | Company, event name, agenda, RSVP | Modern, Minimal, Editorial |
| `general-party` | General Party | Fun, flexible | Free-form headline, host | Playful, Colorful, Modern, Vintage |

`general-party` is also the safe fallback for any unknown category.

Every category supplies its own labels, helper text, sample content and starter message suggestions so the editor never shows wedding wording on a graduation invitation.

### Style tags

Style tags describe the look. A template carries one to four.

| Tag | Character |
| --- | --- |
| Elegant | Refined serif type, thin lines, calm palettes, balanced symmetry |
| Romantic | Soft palettes, italic and script touches, delicate flourishes |
| Floral | Illustrated flowers, wreaths, garlands, painterly color |
| Modern | Clean geometry, sans-serif or sharp serif, bold simplicity |
| Minimal | Whitespace, strict grid, very few elements |
| Luxury | Foil and metallic tones, dark or ivory grounds, fine frames, high-contrast type |
| Vintage | Engraved ornaments, muted inks, aged paper, old-style or display type |
| Rustic | Kraft and linen tones, hand-drawn lines, wood and wild foliage, casual lettering |
| Botanical | Leaves, ferns, eucalyptus, greens and earth tones |
| Playful | Rounded shapes, confetti, stickers, friendly type |
| Colorful | Saturated, high-energy palettes and shape blocks |
| Traditional | Classic layouts, serif type, crests and borders, timeless |
| Editorial | Magazine-style type scale, asymmetric grids, strong typographic contrast |

Floral and Botanical overlap on purpose. Floral leads with blooms. Botanical leads with foliage.

---

## B3. Template Anatomy

Every invitation is built in layers, back to front:

```text
0  Background   solid, gradient, texture or image
1  Pattern      repeating motif at low opacity
2  Frame        border, frame or panel
3  Decoration   botanicals, shapes, illustrations behind the text
4  Content      names, date, venue, message
5  Ornaments    corners, seals, flourishes, dividers in front
```

A strong template uses three or more layers on purpose. A minimal template may deliberately use only two.

Rules:

- Layer order is consistent so palettes and presets behave predictably.
- Everything is drawn from invitation data (`content` and `design`). No event text lives in a template.
- Sizes are relative to the card, so a template looks identical in a thumbnail, the editor and the public page.

---

## B4. Layout Archetypes

Templates choose a layout. Different layouts are what make templates feel different, so a catalog should spread across them.

| Layout | Description | Suits |
| --- | --- | --- |
| Centered classic | Symmetric stack, central axis | Elegant, Traditional, Luxury |
| Framed card | Content inside an inset border or panel | Traditional, Luxury, Vintage |
| Asymmetric | Left-aligned text, decoration pushed to a corner | Floral, Romantic, Editorial |
| Split | Two zones: text and a large shape, image or color field | Modern, Colorful |
| Arch or window | Content inside an arch, circle or window shape | Botanical, Romantic, Baby Shower |
| Typographic poster | Oversized type fills the card | Editorial, Playful, Graduation |
| Editorial grid | Small caps labels, rules and columns | Editorial, Modern, Corporate |
| Badge or seal | Central emblem with text around it | Vintage, Traditional |
| Full bleed image | Photo or illustration across the card, text over it | Modern, Luxury |
| Ticket or label | Compact, boxed information blocks | Playful, Corporate, Colorful |

---

## B5. Decoration Library

Decorations are shared **kit pieces** (see `docs/TEMPLATE_SYSTEM.md`). They recolor with the palette and scale with the card. Kit v1 (47 pieces) covers frames, botanicals, patterns, ornaments, shapes and backgrounds; illustrations are still to come.

### Frames and borders

- Thin single line
- Double line
- Inset line with corner notches
- Ornate engraved border
- Scalloped edge
- Arch frame
- Circle or oval frame
- Floral wreath frame
- Ticket cut-out edge
- Wavy hand-drawn border
- Gold foil double rule

### Botanical and floral

- Eucalyptus sprig
- Olive branch
- Fern and monstera leaves
- Wildflower stem
- Peony, rose, ranunculus and anemone clusters
- Corner bouquet
- Garland and swag
- Full wreath
- Pampas grass and dried botanicals
- Watercolor leaf wash

### Patterns

- Small repeating florals
- Leaf toile
- Polka dots and confetti
- Stripes and checks
- Art-deco fans and chevrons
- Damask
- Terrazzo
- Stars and sparkles
- Hand-drawn doodles

### Shapes and ornaments

- Circles, blobs, arches, half-moons
- Starbursts and rays
- Squiggles and brush strokes
- Corner flourishes
- Dividers with a small center motif
- Laurel wreath
- Seals, stamps and badges
- Ribbons and banners
- Crests and monograms
- Sparkles and constellations (used sparingly)

### Illustrations

- Balloons, cake, candles, confetti cannon (birthday)
- Stork, bottles, rattles, clouds (baby shower)
- Rings, champagne glasses (engagement, anniversary)
- Cap and diploma, laurel (graduation)
- Dove, cross, chalice (baptism, communion)
- Wine glass, candlesticks (dinner party)

Illustrations are simple, flat or lightly textured, and use palette colors. They are original line and shape work, not stock clip art.

---

## B6. Backgrounds

Backgrounds set the mood. A template offers the kinds it handles well.

| Kind | Examples |
| --- | --- |
| Solid | Ivory, sage, midnight, tangerine |
| Gradient | Soft two-tone wash, dawn sky, ombré. Gentle and tonal, never neon |
| Texture | Paper grain, linen, kraft, watercolor wash, marble, foil |
| Pattern | Any pattern from B5 behind the content |
| Image | User photo or uploaded art, with an optional tint overlay for legibility |

Textures and washes are drawn with CSS or SVG (noise filters, gradients, masks), not heavy raster files.

When a background image sits behind text, add a tint or panel behind the text so contrast holds.

---

## B7. Curated Palettes

Palettes are curated, named and tagged by style. Users pick a palette first and fine-tune colors second.

A palette contains: background, text, accent, an optional secondary accent, and optional decoration colors.

Examples (starting points):

| Palette | Background | Text | Accent | Secondary | Styles |
| --- | --- | --- | --- | --- | --- |
| Ivory & Gold | `#F6F1E8` | `#3A3128` | `#8A7352` | `#C8A96A` | Elegant, Luxury |
| Midnight Foil | `#1F2430` | `#F2EDE4` | `#C8A96A` | `#8C7A4E` | Luxury, Elegant |
| Sage Garden | `#EEF0E8` | `#3E4A39` | `#7C8F6B` | `#C98F86` | Floral, Botanical |
| Blush Peony | `#FBEFEC` | `#4A3535` | `#B5736B` | `#D9A9A0` | Romantic, Floral |
| Eucalyptus | `#E9EFEA` | `#26362F` | `#5E7A6A` | `#B7C7B8` | Botanical, Minimal |
| Kraft & Linen | `#EDE3D2` | `#43352A` | `#9A6B3F` | `#6F7B4D` | Rustic, Vintage |
| Parchment Ink | `#F1E6CF` | `#2F2A22` | `#8B3A2F` | `#2F4A58` | Vintage, Traditional |
| Tangerine Pop | `#FF6B3D` | `#1D1D1B` | `#FFE9D6` | `#1D1D1B` | Playful, Colorful |
| Confetti Bright | `#FFF4D6` | `#23233F` | `#F0457A` | `#2BB3A6` | Playful, Colorful |
| Cobalt Editorial | `#F5F2EC` | `#10213F` | `#E4452B` | `#10213F` | Editorial, Modern |
| Paper & Ink | `#FBFBF9` | `#1D1D1B` | `#9B978F` | none | Minimal, Modern |
| Navy Heritage | `#F4F1EA` | `#1F2A44` | `#7A1F2B` | `#B79B5A` | Traditional, Elegant |

Rules:

- Each style should have at least four palettes.
- Palettes are the main driver of presets (B14).
- Avoid neon and purple-to-blue gradients as defaults. Saturated palettes belong to Playful and Colorful, used deliberately.
- Accent colors are for emphasis: a date, a rule, a motif. Do not use them for long text.

---

## B8. Typography Pairings

Pairings are curated sets of a **heading font**, a **body font** and an optional **script font**. Script fonts are for names and short flourishes only, never for dates, addresses or body text.

All fonts must be open-licensed (SIL OFL or similar) and available through the project's font packages.

| Pairing | Heading | Body | Script accent | Styles |
| --- | --- | --- | --- | --- |
| Classic serif | Cormorant Garamond | Inter | none | Elegant, Traditional |
| Romantic script | Playfair Display (italic) | Lora | Pinyon Script | Romantic, Floral |
| Luxe caps | Cinzel | Montserrat | none | Luxury |
| Deco display | Italiana | DM Sans | none | Luxury, Vintage |
| Engraved | Libre Baskerville | Lora | none | Traditional, Vintage |
| Poster serif | DM Serif Display | DM Sans | none | Vintage, Editorial, Playful |
| Fat display | Abril Fatface | Lora | none | Vintage, Editorial |
| Magazine | Fraunces | Inter | none | Editorial, Modern |
| Fashion serif | Bodoni Moda | DM Sans | none | Editorial, Luxury |
| Clean grotesk | Inter | Inter | none | Modern, Minimal |
| Geometric | Manrope | Inter | none | Modern, Corporate |
| Friendly round | Fredoka | Nunito | none | Playful, Colorful |
| Brush party | Baloo 2 | Nunito | Pacifico | Playful, Colorful |
| Rustic hand | Amatic SC | Lora | Caveat | Rustic |
| Garden | Cormorant Garamond | DM Sans | Great Vibes | Botanical, Floral, Romantic |

Rules:

- Keep body text highly legible at small sizes.
- Limit a template to two families plus at most one script.
- Large display type tolerates personality. Small text does not.
- Check that the heading font has the weights the template uses. A synthesized bold looks wrong.
- Fonts load on demand, only when a design that uses them is drawn. The renderer never fakes bold or italic.

---

## B9. Style Recipes

A quick guide to what each family of look is made of. These are recipes, not rules to copy.

### Premium and luxury

- Dark or ivory ground, with foil tones (gold, champagne, rose gold) as accent.
- Fine double-line frames, corner notches, art-deco motifs.
- High-contrast serif or all-caps display type with wide letter-spacing.
- Plenty of space. Few, precise elements.
- Foil effects with restrained gradients on the accent color.

### Playful and colorful

- Saturated palettes with two or three strong colors.
- Shapes, confetti, stickers, ribbons, doodles, squiggles.
- Rounded, friendly or heavy display type, tight leading.
- Energetic, off-axis composition. Rotated elements are welcome.
- Always keep the date and venue extremely legible.

### Vintage

- Warm paper tones, muted inks (oxblood, navy, forest).
- Engraved borders, seals, ribbons, banners.
- Old-style serif, fat-face display, small-caps labels.
- Texture: subtle grain, slight ink spread.

### Modern editorial

- Large type scale contrast, oversized names, tiny uppercase labels.
- Asymmetric grids, rules, columns, numbered details.
- Limited palette with one hot accent.
- Little or no ornament. The typography is the decoration.

### Botanical and floral

- Illustrated foliage and blooms at corners, along edges or as a wreath.
- Soft earthy or pastel palettes, sometimes a deep green ground.
- Serif with italic or a light script for names.
- Asymmetric or arch layouts. Leave breathing room around the text.

### Rustic

- Kraft, linen and wood tones, hand-drawn lines.
- Wild foliage, twine, simple frames.
- Casual hand-lettered accents with a sturdy serif.

### Romantic

- Soft blush, cream and sage.
- Delicate flourishes and sparse florals.
- Italic serif and script names.

### Minimal

- Large whitespace, strict grid, one accent.
- Light sans-serif or fine serif.
- Minimal is one style among many, not the house style.

### Traditional

- Symmetric layouts, crest or monogram, classic borders.
- Serif type, navy, burgundy, ivory and gold.

---

## B10. Content Robustness

Templates must hold up with real content:

- Long names (40+ characters) and names that wrap onto several lines
- Very short names
- Missing optional fields: no message, no address, no time
- Dates that are not valid (show the entered text)
- A message at its maximum length (clamp it)
- A background image behind the text

Rules:

- Text sizes use relative units tied to the card width.
- Clamp or ellipsize instead of letting text overflow the card.
- Decorations never cover text. Keep a safe area for content.
- The layout should degrade gracefully, not break, when fields are empty.

---

## B11. Accessibility and Contrast in Invitations

- Primary text on its background: at least 4.5:1 contrast. Large display text: at least 3:1.
- Accent colors used for text must meet the same thresholds.
- Patterns and textures sit behind text at low opacity, or behind a solid panel.
- Do not communicate information only through color or decoration.
- Decorative SVGs are `aria-hidden`. The text content stays real, selectable text.
- Curated palettes are checked against these thresholds before they are added. The editor warns when custom colors fall below them.

---

## B12. Asset Rules

- Decorations are **original SVG and CSS**, or use assets with a permissive license that allows commercial use. Record the source and license of anything not original.
- No trademarked logos, characters or brand imagery.
- No raster images in the bundle. Textures use SVG filters, gradients and CSS.
- Keep each piece light. A kit piece should be a few kilobytes at most.
- Use palette colors, not baked-in colors, so pieces recolor.
- Fonts must be open-licensed and served through the project's font packages.

---

## B13. Template Quality Checklist

Before a template is accepted:

**Design**

- Does it have a distinct identity from every other template?
- Is the layout different, not just the colors?
- Is the hierarchy clear (names, date, venue, message)?
- Are decorations balanced and intentional?
- Does the type pairing feel right for the style?

**Robustness**

- Long names, short names, empty optional fields, long message, invalid date: all fine?
- Does it look good as a gallery thumbnail, in the editor and on a phone?
- Does it scale cleanly from small to large?

**Palettes and presets**

- Three to five presets, at least one clearly different in mood?
- Every preset meets the contrast thresholds?

**Technical**

- Everything driven by `content` and `design`? No event text or hardcoded colors that should follow the palette?
- Built from kit pieces and layouts where they exist?
- Capabilities declared honestly?
- Lazy loaded, light, no raster assets?
- No console errors, no layout shift while loading?

**Accessibility**

- Contrast thresholds met?
- Decorations hidden from assistive technology?

---

## B14. Variations (Presets)

A **preset** is a curated, complete design for a template: palette, type pairing, decorations, frame, pattern and background.

- A template ships with three to five presets.
- Presets vary mood, not structure: for example Ivory & Gold, Blush Peony and Midnight Foil on the same elegant layout.
- The gallery card shows the default preset. The preview dialog lets people flip through the others.
- Choosing a preset sets ordinary design values. The user can then change anything.
- If a new look needs a different layout or different decoration, it is a new template, not a preset.

---

# Core Design Principle

The application is the stage. The invitations are the performance.

```text
APPLICATION
Clean, warm, calm and easy to use.
It frames the invitations without competing with them.

INVITATION
Expressive, decorative, personal and varied.
It carries the color, character and craft of the product.
```

When in doubt:

- Keep controls simple.
- Make invitations richer.
- Let real templates provide the color.
