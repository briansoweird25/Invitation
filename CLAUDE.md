# Invitation Generator

## Project Overview

Build a polished, production-quality web application for creating, customizing, publishing, and sharing digital invitations.

The product allows users to:

1. Browse invitation templates.
2. Choose an invitation template.
3. Enter event information.
4. Customize the invitation design.
5. See changes in a live preview.
6. Save invitations.
7. Publish invitations through unique URLs.
8. Share invitations.
9. Collect RSVP responses.
10. Manage invitations from a dashboard.

The product should feel like a real premium design tool, not a generic CRUD application or an AI-generated website.

Related documents:

- `DESIGN.md` for the visual design system (application UI in Part A, invitation design in Part B).
- `docs/TEMPLATE_SYSTEM.md` for the template architecture: taxonomy, catalog, presets, decoration kit, renderer layers and how to add templates.

---

# 1. Product Philosophy

The invitation itself is the most important part of the product.

The experience should feel:

- Elegant
- Modern
- Simple
- Premium
- Warm
- Visual
- Easy to use
- Professional

The application UI is clean and easy to use. The invitations are expressive, decorative and varied. The invitations carry the color and personality of the product.

Prioritize:

1. Excellent user experience
2. Visual quality
3. Clean architecture
4. Maintainable code
5. Responsive design
6. Accessibility
7. Performance

Do not add features merely because they are technically possible.

Every feature should improve the invitation creation experience.

---

# 2. Core User Flow

Landing Page
→ Browse Templates
→ Select Template
→ Create Invitation
→ Customize
→ Live Preview
→ Save
→ Publish
→ Share
→ RSVP

The editor is the core product experience.

---

# 3. Technology Stack

Use the following unless there is a strong technical reason to change them.

## Frontend

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS

## UI

- shadcn/ui
- Lucide React

## State

- Zustand

## Backend

- Supabase

## Database

- PostgreSQL through Supabase

## Authentication

- Supabase Auth

## File Storage

- Supabase Storage

## Deployment

- Netlify

Do not introduce additional frameworks or libraries without first determining whether the existing stack can solve the problem.

---

# 4. Architecture Principles

The application must be data-driven.

The invitation data is the source of truth.

The editor modifies invitation data.

The template renders invitation data.

The database persists invitation data.

The public invitation renders the same invitation data.

Conceptually:

Invitation Data
→ Editor
→ Live Preview
→ Template Renderer
→ Public Invitation

Templates control presentation.

Invitation data controls content.

Never hardcode event-specific information inside templates.

---

# 5. Folder Structure

Use this general structure:

src/
├── app/
│   ├── App.tsx
│   ├── routes.tsx
│   └── providers.tsx
├── assets/
│   ├── images/
│   └── fonts/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── landing/
│   ├── templates/          gallery UI (cards, filters, preview dialog)
│   ├── editor/
│   │   ├── panels/
│   │   └── controls/
│   ├── invitation/         renderer, catalog, kit, layouts, templates
│   │   ├── kit/            shared decoration pieces
│   │   ├── layouts/        reusable layout primitives (planned)
│   │   └── templates/      <category>/<template-id>/ with index.tsx and meta.ts
│   ├── dashboard/
│   └── rsvp/
├── pages/
├── stores/
├── hooks/
├── lib/
├── types/
├── data/                   taxonomy, categories, palettes, font pairings
└── main.tsx

docs/
└── TEMPLATE_SYSTEM.md

Items marked "planned" are described in `docs/TEMPLATE_SYSTEM.md` and are not built yet.

Keep related functionality together.

Do not create unnecessary folders or abstractions.

---

# 6. Component Architecture

Components should have one clear responsibility.

Avoid giant components.

Do not build the entire editor in one file.

Prefer:

Editor
├── EditorHeader
├── EditorSidebar
│   ├── EventDetailsPanel
│   ├── MessagePanel
│   ├── PhotoPanel
│   ├── TypographyPanel
│   ├── ColorsPanel
│   ├── BackgroundPanel
│   ├── DecorationPanel
│   └── RSVPPanel
└── EditorPreview

Reuse components when appropriate.

Do not duplicate UI logic.

---

# 7. Invitation Data Model

Use TypeScript interfaces.

```ts
interface Invitation {
  id: string;
  userId: string;
  title: string;
  slug: string;
  category: InvitationCategory;
  templateId: string;
  content: InvitationContent;
  design: InvitationDesign;
  rsvp: RSVPSettings;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
}

interface InvitationContent {
  eventTitle: string;
  hostNames: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  message: string;
  additionalDetails?: string;
}

interface InvitationDesign {
  headingFont: string;
  bodyFont: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  backgroundImage?: string;
  borderStyle?: string;
  decorations?: string[];
}

interface RSVPSettings {
  enabled: boolean;
  deadline?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  maxGuests?: number;
}
```

Keep the model extensible.

The model above is the base. It grows through **optional** keys only, so saved invitations keep working:

- `InvitationCategory` comes from the taxonomy in `data/taxonomy.ts` (13 categories, see section 9) and is stored as plain text.
- `InvitationDesign` may gain optional keys such as `secondaryColor`, `scriptFont`, `frame`, `pattern`, `background`, `paletteId`, `fontPairingId` and `presetId`. See `docs/TEMPLATE_SYSTEM.md` section 3.6.
- Renderers use the resolved values (concrete colors and fonts). Palette, pairing and preset ids are editor hints only.
- Unknown keys and unknown ids are ignored, never an error.
- Never make an existing optional key required, and never rename a stored key.

---

# 8. Template Architecture

Templates must be independent from invitation data.

Use a template registry. A template is a component plus catalog metadata.

Implemented (Template System v2, steps T1 and T2; details in `docs/TEMPLATE_SYSTEM.md`):

- **Catalog metadata** (`templateCatalog.ts`): id, name, category, style tags, layout, tier, status, capabilities and presets. It is small and always loaded.
- **Components** (`templateLoader.ts`): lazy, one chunk per template. Each template lives in `templates/<category>/<id>/` with `index.tsx` and `meta.ts`.
- **Presets**: curated variations of one template (a complete resolved design each). `?preset=` selects one.
- **Capabilities**: what the editor may offer for a template (decorations, frames, patterns, washes, background image). Panels with nothing to offer are hidden.
- **The kit** (`components/invitation/kit/`): 51 shared SVG pieces (frames, botanicals, patterns, ornaments, shapes, backgrounds) that recolor from the design.
- **Validation**: `npm run check:templates` checks the catalog and kit against these rules.

Planned: illustrations in the kit, layout primitives, gallery collections and search.

Rules:

- Templates receive invitation data as props (`content` and `design`).
- Adding a template must not require changing the database, the editor or the renderer.
- A new layout is a new template. A new look on the same layout is a new preset.
- Template ids are permanent. Retire a template with `status: "retired"` instead of removing it, so existing invitations still render.
- Templates must have a distinct visual identity. They should not be recolors of each other.
- Templates are built from layouts and kit pieces where they exist.

---

# 9. Categories, Styles and Templates

## Categories

The product supports these categories. They are defined once in `data/taxonomy.ts`.

- Wedding (`wedding`)
- Birthday (`birthday`)
- Baby Shower (`baby-shower`)
- Bridal Shower (`bridal-shower`)
- Engagement (`engagement`)
- Anniversary (`anniversary`)
- Graduation (`graduation`)
- Baptism (`baptism`)
- Communion (`communion`)
- Retirement (`retirement`)
- Dinner Party (`dinner-party`)
- Corporate Event (`corporate-event`)
- General Party (`general-party`)

Category ids are permanent once used. `general-party` is the fallback for unknown values.

Each category supplies its own field labels, helper text, sample content and message suggestions through `data/categories.ts`, so the editor does not hardcode checks like `category === "birthday"`.

## Style tags

Elegant, Romantic, Floral, Modern, Minimal, Luxury, Vintage, Rustic, Botanical, Playful, Colorful, Traditional, Editorial.

A template has one to four style tags. Tags describe the look and power gallery filters.

## Current templates

Thirty-three templates exist today, with at least two primary templates in every category and three or more Looks (presets) each. The first four are the **reference templates** that proved the architecture. T5 added the Wedding and Birthday batch, T6 the Baby Shower batch and T7 to T13 the remaining categories. A template is also listed under every category in its `alsoSuits`:

Wedding:
- Elegant Wedding (elegant, traditional)
- Floral Wedding (floral, romantic, botanical)
- Minimal Wedding (minimal, modern)
- Luxury Wedding (luxury, elegant)

Birthday:
- Modern Birthday (modern, playful, colorful)
- Confetti Birthday (playful, colorful)
- Vintage Birthday (vintage, traditional)
- Editorial Birthday (editorial, modern)

Baby Shower:
- Botanical Baby Shower (botanical, romantic, minimal)
- Rainbow Baby Shower (playful, colorful)
- Moonlight Baby Shower (romantic, modern, minimal)

Graduation:
- Varsity Graduation (traditional, editorial, colorful)
- Golden Graduation (luxury, elegant, traditional) premium
- Chalkboard Graduation (playful, modern, colorful)

General Party:
- Ticket Party (playful, colorful, vintage)
- Garden Party (floral, botanical, rustic)
- Deco Party (luxury, vintage, elegant) premium

Bridal Shower:
- Bubbly Bridal Shower (modern, playful, colorful)
- Peony Bridal Shower (romantic, floral, elegant)

Engagement:
- Ring Engagement (minimal, modern, elegant)
- Olive Engagement (rustic, botanical, romantic)

Anniversary:
- Gilded Anniversary (luxury, traditional, elegant) premium
- Heart Anniversary (romantic, vintage, editorial)

Baptism:
- Blessing Baptism (traditional, elegant, minimal)
- Water Baptism (minimal, botanical, modern)

Communion:
- Lily Communion (floral, romantic, traditional)
- Radiant Communion (traditional, vintage, luxury) premium

Retirement:
- Sunset Retirement (modern, colorful, minimal)
- Distinguished Retirement (traditional, elegant, vintage)

Dinner Party:
- Supper Dinner Party (elegant, vintage, editorial)
- Plate Dinner Party (rustic, modern, colorful)

Corporate Event:
- Summit Corporate (modern, minimal, editorial)
- Gala Corporate (luxury, elegant, modern) premium

## Growing the catalog

Do not build many templates before the architecture is ready. Order of work:

1. Template System v2: taxonomy, category config, catalog/loader split, presets, migrating the four reference templates. **Done (T1).**
2. Kit v1: shared frames, botanicals, patterns, ornaments, shapes and backgrounds. **Done (T2).**
3. Palette and font-pairing libraries, plus capability-driven editor pickers. **Done (T3).**
4. Gallery upgrade: category tabs, style filters, sort, variations in the preview, lazy previews. **Done (T4).**
5. Template batches, one category at a time (about three to four per category), each tested in the gallery, editor and dashboard before the next. **Done: Wedding and Birthday have four templates each (T5), Baby Shower has three (T6), Graduation and General Party have three each (T7, T8), and Bridal Shower, Engagement, Anniversary, Baptism, Communion, Retirement, Dinner Party and Corporate Event have two each (T9 to T13).** Next: a third template for the two-template categories, and illustrations.

Quality is more important than quantity. Variety is important too: layouts, decoration, backgrounds and mood should differ across the catalog.

---

# 10. Invitation Renderer

Use a central InvitationRenderer.

Conceptually:

InvitationRenderer
→ Template Catalog
→ Selected Template
→ Rendered Invitation

The renderer draws in layers (see `docs/TEMPLATE_SYSTEM.md` section 3.7):

0. Background (color, gradient, texture or image)
1. Pattern
2. Frame (drawn by the renderer from `design.frame`)
3. Decorations behind the text
4. Content
5. Foreground ornaments

The renderer owns the canvas, the background, the pattern and the frame, all driven by `design`. The template owns the decorations, content and ornaments, built from kit pieces.

It fills the width it is given and scales through `cqw` units.

The renderer should be reusable by:

- Editor preview
- Public invitation page
- Dashboard and gallery thumbnails
- Future export functionality

Avoid separate preview and public rendering implementations.

---

# 11. Editor Architecture

Desktop layout:

Editor Header
Editor Sidebar | Invitation Preview | Design Controls

The invitation preview must remain the visual focus.

Editor panels:

- Event Details
- Message
- Photos
- Typography
- Colors
- Background
- Decorations
- RSVP

Use collapsible sections where appropriate.

Do not overwhelm users.

Implemented behavior (details in `docs/TEMPLATE_SYSTEM.md` section 2):

- Panels are **capability-driven**. They offer what the selected template supports and hide the rest.
- Labels, helper text and starter copy come from the category configuration.
- A "Looks" panel applies the template's presets, shown as thumbnails of the invitation.
- Typography shows curated font pairings as cards with a live sample, with individual fonts as an advanced option.
- Colors show curated palettes first, with custom colors as an advanced option.
- Frames, patterns and washes use thumbnails drawn with the invitation's colors.
- Applying a look, palette or pairing writes ordinary values into `design`. The invitation data stays the single source of truth.

---

# 12. State Management

Use Zustand.

Separate invitation state from temporary editor UI state.

invitationStore:
- template
- content
- design
- rsvp
- status

editorStore:
- activePanel
- zoom
- previewMode
- isSaving
- isDirty

Do not duplicate invitation state across components.

---

# 13. Live Preview

Changes must update immediately.

User input
→ Zustand state
→ InvitationRenderer
→ Preview

Do not require Save before preview updates.

---

# 14. Autosave

Use debounced autosave.

Recommended flow:

User changes content
→ Update local state immediately
→ Mark dirty
→ Wait approximately 800–1500ms
→ Save to Supabase
→ Mark saved

Display:

Saving...

or:

✓ Saved

Do not block the editor while saving.

---

# 15. Database Architecture

Use Supabase PostgreSQL.

Tables:

profiles
templates
invitations
rsvps

profiles:
- id
- email
- name
- avatar_url
- created_at

templates:
- id
- name
- slug
- category
- thumbnail_url
- preview_url
- is_premium
- configuration
- created_at

invitations:
- id
- user_id
- template_id
- title
- slug
- content
- design
- rsvp_settings
- status
- created_at
- updated_at

rsvps:
- id
- invitation_id
- guest_name
- guest_email
- attendance
- guest_count
- message
- created_at

Use JSON/JSONB for flexible invitation content and design configuration where appropriate.

The schema already supports the full category, style and template roadmap:

- `invitations.category` and `invitations.template_id` are plain text with no enum or foreign key, so new categories and templates need no migration.
- New design options are stored inside the `design` JSONB column.
- The in-app template catalog is the source of truth. The `templates` table is a read-only mirror, and its `configuration` JSONB may hold style tags and preset names if they are ever needed server-side.

Client code that validates stored rows must validate `category` against the taxonomy (with a safe fallback), not a hardcoded list.

---

# 16. Security

Supabase Row Level Security is required.

Users can manage only their own private invitations.

Public visitors can only retrieve published invitations.

RSVP submission may be public.

RSVP data must only be readable by the invitation owner.

Never expose service-role keys in frontend code.

Never put private secrets in client-side source code.

---

# 17. Authentication

Use Supabase Auth.

Public routes:

/
 /templates
 /templates/:category
 /invitation/:slug
 /pricing
 /login
 /register

Protected routes:

/dashboard
/dashboard/invitations
/dashboard/settings
/editor/new
/editor/:invitationId

Do not require authentication to browse templates or view published invitations.

---

# 18. Public Invitation

Example:

/invitation/john-and-maria

Flow:

1. Fetch invitation by slug.
2. Verify published status.
3. Load template.
4. Render invitation.
5. Provide RSVP if enabled.

The public page should feel like a finished digital invitation, not a dashboard.

---

# 19. RSVP

Guest:

Public Invitation
→ RSVP
→ RSVP Form
→ Validation
→ Supabase
→ rsvps

Owner:

Dashboard
→ Invitation
→ RSVPs
→ Statistics + Guest List

Useful statistics:
- Attending
- Not attending
- Total guests
- Guest names
- Messages

Never expose private RSVP information publicly.

---

# 20. Image Uploads

Use Supabase Storage.

User selects image
→ Validate
→ Upload
→ Store path/URL
→ Render

Validate file type, file size, and reasonable dimensions.

Do not store image binaries in PostgreSQL.

---

# 21. Validation

Use Zod or an equivalent schema validation approach.

Validate:
- Invitation title
- Event details
- Dates
- Email addresses
- RSVP information
- Uploaded files
- Slugs
- Categories and template ids (against the taxonomy and catalog, with safe fallbacks)

Use appropriate validation on client and server/database boundaries.

---

# 22. Responsive Design

Support:
- Desktop
- Tablet
- Mobile

Desktop can use a multi-panel editor.

Mobile should use a preview plus drawers/bottom controls.

The invitation must remain readable on small screens.

---

# 23. Visual Design Direction

The website should NOT look like a generic AI-generated SaaS website.

Two layers, two attitudes (details in `DESIGN.md`):

**Application UI: clean, warm, premium.**

- Calm, organized, easy to use.
- Warm neutrals, characterful serif headings, subtle atmosphere tints, generous imagery.
- Not plain and not busy.

**Invitations: expressive, decorative, varied.**

- Rich decoration, confident typography, strong mood.
- A wide range: luxury, playful, vintage, editorial, botanical, rustic, minimal and more.
- Real renderer output is the main imagery across the product.

Avoid (application UI):
- Excessive purple/blue gradients
- Giant gradient blobs
- Excessive glassmorphism
- Generic dashboard cards everywhere
- Excessive pill-shaped UI
- Excessive rounded corners
- Excessive animations
- AI visual clichés
- Huge unnecessary hero text

Prefer:
- Strong typography
- Editorial layouts
- Generous whitespace
- Subtle borders
- Restrained shadows
- High-quality imagery (the invitations themselves)
- Elegant spacing
- Serif/sans-serif combinations
- Subtle motion
- Clear hierarchy

The product should feel like a premium design tool and a stationery studio.

---

# 24. Accessibility

Use semantic HTML.

All interactive elements must be keyboard accessible.

Inputs must have labels.

Maintain reasonable color contrast, including inside invitations. Curated palettes must meet the contrast thresholds in `DESIGN.md` B11. Decorative SVG is hidden from assistive technology.

Do not rely on color alone to communicate state.

Use appropriate alt text.

Make dialogs and menus keyboard accessible.

---

# 25. Performance

Avoid unnecessary re-renders.

Optimize large images and expensive template previews.

Lazy-load large pages/assets when appropriate.

At catalog scale, keep template metadata small and eager, and lazy-load template components, kit pieces and fonts. Render gallery previews only when they are near the viewport. Decoration is inline SVG or CSS, never raster images.

Do not optimize prematurely.

---

# 26. Error Handling

Never expose raw database errors to users.

Prefer:

"We couldn't save your invitation. Please try again."

over raw technical errors.

Use useful development logging.

---

# 27. Loading States

Provide loading states for asynchronous operations:

- Loading invitation
- Saving
- Uploading image
- Publishing
- Submitting RSVP

Avoid blank screens.

---

# 28. Empty States

Create intentional empty states.

Example:

"You haven't created an invitation yet.

Create your first invitation and make your next celebration memorable."

[Create Invitation]

---

# 29. Notifications

Use unobtrusive toast notifications for:

- Invitation saved
- Invitation published
- Invitation unpublished
- RSVP submitted
- Image uploaded
- Invitation deleted

Do not overuse notifications.

---

# 30. Slugs

Published invitations should use human-readable unique slugs.

Example:

/invitation/john-and-maria

If a slug already exists, generate a safe unique variant.

Validate and sanitize user-provided slugs.

---

# 31. AI Features

AI is an enhancement, not the core product.

A future feature can be:

"Help me write this invitation"

The user provides a description and can receive:
- Formal version
- Romantic version
- Warm version
- Simple version

The user must remain in control and be able to edit generated text.

Do not make AI mandatory.

---

# 32. Export

Implement later:
- PNG
- PDF
- HD export

The export system should reuse the invitation renderer where practical.

---

# 33. Monetization

Implement after the core product is stable.

Free:
- Basic templates
- Create invitations
- Publish invitation
- Basic RSVP

Premium:
- Premium templates
- HD export
- PDF export
- No watermark
- Advanced customization
- Premium decorations

Do not add payments before the core flow works.

---

# 34. Development Phases

Phase 1: Foundation
- Project configuration
- Folder structure
- Routing
- Design system
- Base UI components

Phase 2: Landing Page
- Navigation
- Hero
- Template showcase
- How it works
- Features
- CTA
- Footer

Phase 3: Template Gallery
- Categories
- Filters
- Cards
- Previews
- Template selection

Phase 4: Invitation Renderer
- Data model
- Template registry
- Renderer
- Initial templates

Phase 5: Editor
- Layout
- Event details
- Message
- Typography
- Colors
- Background
- Decorations
- RSVP
- Live preview

Phase 6: Authentication
- Register
- Login
- Logout
- Session handling
- Protected routes

Phase 7: Supabase
- Database
- Storage
- RLS
- Persistence

Phase 8: Dashboard
- List
- Create
- Edit
- Delete
- Publish/unpublish

Phase 9: Public Invitations
- Public URL
- Invitation rendering
- Sharing
- RSVP

Phase 10: RSVP
- Form
- Validation
- Database
- Dashboard
- Statistics

Phase 11: Export
- PNG
- PDF
- HD

Phase 12: AI
- Optional invitation-writing assistance

Phase 13: Monetization
- Premium templates
- Premium features
- Payments

---

## Template expansion track

Template work runs alongside the numbered phases. See `docs/TEMPLATE_SYSTEM.md` section 11.

T1: Template System v2 (taxonomy, category config, catalog/loader split, presets). Done.
T2: Kit v1 (frames, botanicals, patterns, ornaments, shapes, backgrounds). Done.
T3: Palette and font-pairing libraries, capability-driven editor pickers. Done.
T4: Gallery upgrade (style filters, sort, variations, lazy previews, landing occasions). Done.
T5: First template batch, Wedding and Birthday to four templates each. Done.
T6: Baby Shower, three templates. Done.
T7: Graduation, three templates. Done.
T8: General Party, three templates. Done.
T9 to T13: Bridal Shower and Engagement; Anniversary; Baptism and Communion; Retirement, Dinner Party and Corporate Event, two templates each. Done.
Next: third templates for two-template categories, illustrations in the kit, layout primitives, gallery collections and search.

T1 to T4 are in place, so Phase 9 (public invitations) and Phase 11 (export) render the richer templates from the start.

---

# 35. Development Workflow

For every task:

1. Inspect the existing project.
2. Understand the current architecture.
3. Identify reusable components.
4. State which files will be affected.
5. Make the smallest appropriate change.
6. Keep types accurate.
7. Test affected functionality.
8. Check responsive behavior.
9. Check for console errors.
10. Verify existing functionality still works.

Do not rewrite unrelated code.

Do not create duplicate components.

---

# 36. Code Quality

Use TypeScript strictly.

Avoid `any` unless justified.

Prefer explicit types.

Use meaningful names.

Avoid duplicated business logic.

Avoid deeply nested conditional logic.

Keep database access centralized.

Keep business logic out of presentation components where practical.

---

# 37. What Not To Do

Do not:
- Build the entire application in one component.
- Hardcode invitation data into templates.
- Store files in PostgreSQL.
- Expose service-role keys.
- Disable RLS just to make development easier.
- Put secrets in client-side code.
- Add unnecessary dependencies.
- Build dozens of templates before the template system (taxonomy, presets, kit) is ready.
- Ship a template that is only a recolor of another. Recolors are presets.
- Hardcode category checks (like `category === "birthday"`) in the editor. Use the category configuration.
- Rename or reuse a template id, a category id or a stored design key.
- Add raster images to the bundle for decoration. Use SVG and CSS.
- Use decoration assets without a license that allows commercial use.
- Build AI before the core invitation experience.
- Build payments before the core product.
- Use excessive animations.
- Replace working architecture without a reason.
- Rewrite unrelated files.

---

# 38. Definition of Done

A feature is complete when:

- TypeScript has no relevant errors.
- No obvious console errors exist.
- Desktop works.
- Mobile works.
- Loading states exist.
- Error states exist.
- Empty states exist where appropriate.
- Accessibility has been considered.
- Validation exists.
- Security has been considered.
- Existing functionality still works.

---

# 39. MVP

The first complete version should contain:

- Landing page
- Template gallery
- 3–4 templates
- Invitation editor
- Live preview
- Event details
- Typography customization
- Color customization
- Basic background customization
- Authentication
- Dashboard
- Save invitation
- Publish invitation
- Public invitation URL
- Basic RSVP

Do not prioritize:
- Complex AI generation
- Payments
- Advanced analytics
- Dozens of templates
- Complex animation systems
- Enterprise features

The MVP goal:

Create
→ Customize
→ Save
→ Publish
→ Share
→ RSVP

---

# 40. Primary Architectural Principle

Always preserve:

INVITATION DATA
├── EDITOR
├── DATABASE
└── PUBLIC PAGE

All three use the same underlying invitation data.

Templates control presentation.

The editor modifies data.

The database persists data.

The public page renders data.

Keep this architecture intact as the application grows.

---

# 41. Instructions for Claude

Before implementing any major feature:

1. Read this file.
2. Inspect the existing code.
3. Briefly explain the implementation approach.
4. Identify affected files.
5. Reuse existing architecture.
6. Implement the feature.
7. Verify existing functionality.
8. Report changes and remaining limitations.

Do not ask unnecessary questions when the architecture already provides enough information.

When multiple approaches are valid, prefer the simplest maintainable solution.

Do not over-engineer.

Build incrementally.

Keep the code clean.

Keep the design intentional.

Keep the invitation creation experience at the center of every decision.

When working on templates, read `docs/TEMPLATE_SYSTEM.md` and `DESIGN.md` Part B first. When working on application screens, read `DESIGN.md` Part A.
