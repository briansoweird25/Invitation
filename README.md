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

Public invitations.

## Phase 10

RSVP.

## Phase 11

Export.

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
