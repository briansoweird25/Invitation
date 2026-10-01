# Invitation Generator

A web application for creating, customizing, publishing, and sharing beautiful digital invitations.

## Product Goal

Make it possible for someone without design experience to create a polished invitation in minutes.

The application is clean, warm and easy to use. The invitations are expressive, decorative and varied: luxury, playful, vintage, editorial, floral, botanical, rustic, minimal and more, across weddings, birthdays, baby showers, graduations and other occasions.

Core flow:

```text
Choose Template
      ↓
Enter Details
      ↓
Customize
      ↓
Preview
      ↓
Save
      ↓
Publish
      ↓
Share
      ↓
RSVP
```

---

# Tech Stack

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

- PostgreSQL

## Authentication

- Supabase Auth

## Storage

- Supabase Storage

## Deployment

- Netlify

---

# Features

## MVP

- Landing page
- Template gallery
- Wedding templates
- Birthday templates
- Invitation editor
- Live preview
- Event details
- Typography customization
- Color customization
- Background customization
- Authentication
- Dashboard
- Save invitations
- Publish invitations
- Public invitation URLs
- RSVP

## Template library (growing)

Thirty-three templates exist today across all 13 categories (at least two per category), each with three or more presets, built on a shared decoration kit of 51 pieces. The template system supports:

- 13 categories: Wedding, Birthday, Baby Shower, Bridal Shower, Engagement, Anniversary, Graduation, Baptism, Communion, Retirement, Dinner Party, Corporate Event, General Party
- 13 style tags: Elegant, Romantic, Floral, Modern, Minimal, Luxury, Vintage, Rustic, Botanical, Playful, Colorful, Traditional, Editorial
- Variations (presets) of each template
- A shared decoration kit: frames, botanicals, patterns, ornaments, shapes and illustrations
- 21 curated color palettes and 18 typography pairings, with thumbnail pickers in the editor
- A gallery with style filters, sorting, variations and lazy previews. A template is listed in every category it suits (`alsoSuits`) and never duplicated.
- A fitted layout region (`FitBox`) so long names, titles and messages shrink to fit instead of overlapping frames

See `docs/TEMPLATE_SYSTEM.md` and `DESIGN.md` (Part B).

## Future

- AI invitation writing
- PNG export
- PDF export
- HD export
- QR codes
- Premium templates
- Payments
- Advanced RSVP analytics
- Email invitations
- Guest management

---

# Architecture

The application is data-driven.

```text
Invitation Data
       │
       ├── Editor
       │
       ├── Database
       │
       └── Public Invitation
                │
                ▼
        Template Renderer
```

The invitation data is the source of truth.

Templates control presentation.

The editor modifies invitation data.

The database persists invitation data.

The public invitation renders invitation data.

---

# Project Structure

```text
src/
├── app/
├── assets/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── landing/
│   ├── templates/
│   ├── editor/
│   ├── invitation/
│   ├── dashboard/
│   └── rsvp/
├── pages/
├── stores/
├── hooks/
├── lib/
├── types/
├── data/
└── main.tsx

docs/          architecture documents (TEMPLATE_SYSTEM.md)
supabase/      database migrations
```

See `CLAUDE.md` for detailed development architecture and rules.

See `DESIGN.md` for visual design rules (application UI in Part A, invitation design in Part B).

See `docs/TEMPLATE_SYSTEM.md` for the template architecture and how to add templates.

---

# Main Routes

```text
/
 /templates
 /templates/:category

 /login
 /register

 /dashboard
 /dashboard/invitations
 /dashboard/settings

 /editor/new
 /editor/:invitationId

 /invitation/:slug

 /pricing
```

---

# Database

Initial Supabase tables:

```text
profiles
templates
invitations
rsvps
```

Invitation content and design can use JSON/JSONB fields for flexibility.

Row Level Security must be enabled.

Users must only be able to access their own private invitation data.

Public users may view published invitations.

---

# Testing

```bash
npm run check:templates   # validates the catalog, kit, palettes, pairings and contrast
npm run test              # unit tests (vitest): taxonomy, filters, catalog, formatting, render of every template
npm run test:e2e          # browser tests (Playwright) against a build with a mocked Supabase
npm run test:all          # all of the above
```

Browser tests never contact Supabase. They use an in-memory mock (`tests/e2e/helpers/mockSupabase.ts`), so they say nothing about the real project's tables, policies or storage. `npm run dev` also serves a visual contact sheet of every template and Look at `/dev/templates` (development only, see `docs/TEMPLATE_SYSTEM.md`).

# Development Phases

## Phase 1

Foundation:
- Project setup
- Routing
- Design system
- UI primitives

## Phase 2

Landing page.

## Phase 3

Template gallery.

## Phase 4

Invitation renderer and templates.

## Phase 5

Invitation editor.

## Phase 6

Authentication.

## Phase 7

Supabase persistence and storage.

## Phase 8

Dashboard.

## Phase 9

Public invitations. **Done.** `/invitation/:slug` loads a published invitation by slug through `getPublishedInvitation` (only the columns a guest needs, filtered to `status = 'published'`, in addition to the database policy), renders it with the same `InvitationRenderer`, and offers copy link and the device share sheet. When RSVP is on it shows the reply deadline and the host's contact details. Drafts, unknown and malformed slugs all show the same "not available" page; a failed load shows a friendly message with a retry. The page asks search engines not to index it. Link previews: the app is a single-page app, so shared links show the site's generic title and image; per-invitation previews need server-side rendering or a Netlify edge function and are a later improvement. The RSVP reply form is Phase 10.

## Phase 10

RSVP. **Done.**

- **Guest form** (public invitation page, no account): name, will you come, number of guests (only when attending and the host allows more than one), optional email and note. Validated with Zod (`lib/rsvp.ts`): name 1 to 120 characters, optional valid email, whole guest count up to the host's limit (10 when unset, never above 50), note up to 1000 characters. A decline always stores one guest. A hidden trap field quietly drops bot submissions. After the reply-by date the form is replaced by a "replies closed" note.
- **Storage:** `submitRsvp` inserts into `rsvps` (`lib/rsvpApi.ts`). Guests can only insert; they cannot read replies. The existing row level security lets anyone reply only to a published invitation with RSVPs on. Migration `20260101000300_rsvp_limits.sql` additionally makes the database enforce the deadline (one day of grace for time zones) and the maximum guests per reply, so a hand-made request cannot get around the form. It replaces the insert policy and **has not been run against a live database from the development sandbox**: apply it to a staging project and send a test reply before relying on it.
- **Owner dashboard:** invitations with RSVPs on get an "RSVPs" button. `/dashboard/invitations/:invitationId/rsvps` shows Attending, Not attending, Total guests (seats from attending replies only) and Replies, then the guest list with names, answer, guest count, email, note and time, filterable by answer. Only the owner can read replies (row level security).
- Not included: deleting or exporting replies, email notifications, one reply per guest (replies are anonymous, so duplicates are possible), analytics.

## Phase 11

Export. **Done** for PNG and PDF. The "HD" option is not separate: every export is already high resolution.

- **Where:** an **Export** menu in the editor header (what is on screen, saved or not) and **Download PNG / Download PDF** in each dashboard card's menu (saved invitations, drafts included). Only signed-in owners reach either. Exports run in the browser from data the owner has already loaded; there is no export URL and the public page has no export button.
- **How:** `lib/exportInvitation.ts` lays the real `InvitationRenderer` out 1200 CSS px wide in an off-screen box, waits for the template chunk, fonts and fitted text to settle, and rasterises it with `html-to-image`. It is the only new dependency (small, no dependencies of its own) and is loaded only when someone exports. There is no second renderer, so every template, Look, frame, pattern, decoration and long-content fit matches the screen.
- **Output:** PNG at 2400 x 3000 px. PDF is a single 8 x 10 inch page (300 dpi) holding the same picture, written by a small built-in PDF writer (`lib/pdf.ts`, lossless; JPEG at 95% only on browsers without `CompressionStream`). The text in a PDF is part of the picture, not selectable. File names come from the invitation name: "Ava & Noah's Wedding" becomes `ava-and-noah-s-wedding.png`.
- **Images:** a linked background image is fetched and embedded for the export only (the saved invitation is not changed). If the image host does not allow the browser to read it, or the link is dead, the export stops with a clear message instead of producing a file without the picture. Uploaded images (Supabase Storage public URLs) work when the bucket allows cross-origin reads.
- **States:** the button shows "Preparing PNG…" and is disabled while one export runs; failures show a friendly toast. A very large canvas that fails on a small device is retried at 1200 x 1500.
- **Tests:** unit tests for the PDF writer and file names; browser tests check dimensions and file contents, compare the exported picture pixel by pixel with the public page for 18 template and Look combinations, long content, a pre-frames legacy invitation, linked images (success, slow, no cross-origin permission, 404), all 33 templates, the dashboard, and a phone-sized screen.
- **Not included:** transparent PNG, other sizes, selectable-text or vector PDF, print bleed, exporting from the public page, batch export. Safari's first SVG-based capture can be blank, so Safari gets a throwaway first pass; it is untested in this environment (only Chromium is available).

## Phase 12

AI features.

## Phase 13

Monetization.

---

# Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.
3. Apply the SQL files in `supabase/migrations/` (see `supabase/README.md`).

---

# Development Commands

The exact commands depend on the project setup.

Typical Vite commands:

```bash
npm install
npm run dev
npm run build
npm run preview
npm run check:templates   # validates the template catalog and decoration kit
```

Check `package.json` for the project's actual scripts before running commands.

---

# Development Rules

Before implementing a feature:

1. Inspect the existing code.
2. Read `CLAUDE.md`.
3. Read relevant sections of `DESIGN.md`.
4. Reuse existing components.
5. Keep changes focused.
6. Test the affected functionality.
7. Check responsive behavior.
8. Check for console errors.

Do not rewrite unrelated code.

Do not add unnecessary dependencies.

Do not disable security rules for convenience.

---

# MVP Definition

The MVP is complete when a user can:

1. Register.
2. Log in.
3. Browse templates.
4. Choose a template.
5. Enter event information.
6. Customize the invitation.
7. See the invitation update live.
8. Save the invitation.
9. Publish it.
10. Open a public invitation URL.
11. Share the URL.
12. Submit an RSVP.
13. View RSVP responses from the dashboard.

The experience from creation to RSVP should be polished before adding advanced features.
