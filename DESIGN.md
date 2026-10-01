# Invitation Generator Design System

## Design Goal

Create a premium invitation creation platform that feels like a carefully designed product, not a generic SaaS dashboard and not an AI-generated website.

The visual identity should combine:

- Premium stationery
- Editorial design
- Modern SaaS usability
- Elegant typography
- Calm interfaces
- Strong visual hierarchy

The invitation itself should always be the visual hero.

---

# 1. Design Principles

## Elegant

Use typography, whitespace, proportion, and imagery instead of excessive decoration.

## Simple

Users should immediately understand what to do.

## Premium

Details matter:
- spacing
- alignment
- typography
- image quality
- borders
- subtle motion

## Human

Avoid repetitive, predictable AI-generated UI patterns.

## Functional

Beauty must never interfere with usability.

---

# 2. Avoid Generic AI UI

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

Do not use decoration simply because it looks impressive in a screenshot.

Every visual element should have a purpose.

---

# 3. Base Application Palette

Use a restrained neutral palette.

Suggested starting point:

```text
Background:
#FAF9F6

Primary Text:
#1D1D1B

Secondary Text:
#6F6C65

Muted:
#9B978F

Border:
#E7E3DC

Surface:
#FFFFFF

Accent:
#8A7352
```

These are starting values, not rigid requirements.

Individual invitation templates may use completely different palettes.

---

# 4. Typography

The application UI should primarily use a clean sans-serif font.

Recommended:

- Inter
- Geist
- DM Sans

Invitation templates may use:

- Playfair Display
- Cormorant Garamond
- Libre Baskerville
- Lora
- DM Serif Display
- Elegant script fonts where appropriate

Do not use decorative fonts for normal UI controls.

Typography should create hierarchy without relying on excessive font sizes.

---

# 5. Type Hierarchy

Landing page:

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

# 6. Spacing

Use consistent spacing.

Prefer a small set of spacing values rather than arbitrary values everywhere.

Example scale:

```text
4
8
12
16
20
24
32
40
48
64
80
96
```

Use larger spacing between major sections.

Use smaller spacing inside controls.

Whitespace is an important part of the visual identity.

---

# 7. Borders

Use subtle borders.

Default:

```text
1px solid #E7E3DC
```

Avoid heavy borders unless they are intentionally part of a template.

---

# 8. Border Radius

Use moderate radius values.

Application UI can use:

```text
6px
8px
10px
12px
```

Do not make every element extremely rounded.

Invitation templates may use their own visual language.

---

# 9. Shadows

Use shadows sparingly.

Prefer subtle elevation:

```text
0 4px 20px rgba(...)
```

Do not make every card float.

The interface should feel grounded.

---

# 10. Buttons

Primary buttons should be visually clear.

Examples:

```text
Create Invitation
Use Template
Publish
Save
RSVP
```

Secondary actions should be quieter.

Avoid making every button visually dominant.

---

# 11. Landing Page

The landing page should immediately communicate:

1. What the product does.
2. What the invitations look like.
3. How easy it is to use.
4. Why users should try it.

Suggested structure:

```text
Navbar

Hero
    Headline
    Supporting text
    CTA
    Invitation preview

Template Showcase

How It Works

Event Categories

Feature Showcase

Example Invitations

Pricing

FAQ

CTA

Footer
```

The hero should show actual invitation designs rather than generic abstract graphics.

---

# 12. Hero

Possible visual direction:

Left:

```text
Create an invitation
worth remembering.

Beautiful digital invitations
for life's special moments.

[Create an Invitation]
[Browse Templates]
```

Right:

A polished invitation preview.

Avoid huge empty hero sections.

---

# 13. Template Gallery

The gallery should feel like a design marketplace.

Use:

```text
Category Filters
        ↓
Template Grid
```

Template cards should prioritize the actual invitation preview.

Card information:

- Preview
- Name
- Category
- Free/Premium
- Use Template

Avoid clutter.

---

# 14. Invitation Editor

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

The preview should remain prominent.

---

# 15. Editor Controls

Use clear grouped sections:

```text
Event Details
Message
Photos
Typography
Colors
Background
Decorations
RSVP
```

Use accordions or tabs when necessary.

Do not display dozens of controls simultaneously.

---

# 16. Mobile Editor

Mobile should prioritize the invitation preview.

Suggested structure:

```text
Header
Invitation Preview
Bottom Toolbar
Control Drawer
```

Possible toolbar:

```text
Event
Design
Photos
RSVP
More
```

Do not simply squeeze the desktop editor into a phone.

---

# 17. Invitation Preview

The invitation preview should look like a real finished invitation.

Use:

- High-quality typography
- Intentional spacing
- Proper hierarchy
- Decorative elements
- Balanced margins
- Strong alignment

Avoid making templates look like web forms.

---

# 18. Template Design Principles

Each template should have a distinct identity.

Example:

### Elegant Wedding

- Serif typography
- Large names
- Thin borders
- Neutral palette
- Minimal decoration

### Floral Wedding

- Botanical decoration
- Softer typography
- Natural palette
- Asymmetric composition

### Minimal Wedding

- Large whitespace
- Modern typography
- Minimal decoration
- Strong grid

### Modern Birthday

- Strong display typography
- More energetic composition
- Bold accent color
- Modern shapes

Templates should not simply change colors.

They should have genuinely different layouts.

---

# 19. Public Invitation

The public invitation should feel immersive.

Avoid dashboard navigation.

The page should focus entirely on the event.

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

# 20. RSVP UI

The RSVP form should be simple.

Example:

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

Keep the form visually consistent with the invitation.

---

# 21. Dashboard

The dashboard should be simpler than the editor.

Avoid turning it into a dense enterprise dashboard.

Suggested structure:

```text
Welcome back

[Create Invitation]

Your Invitations

Invitation Cards
```

Cards can show:

- Thumbnail
- Event name
- Date
- Status
- Edit
- View
- More

---

# 22. Motion

Motion should be subtle.

Good uses:

- Page transitions
- Panel opening
- Modal appearance
- Button feedback
- Preview changes
- Template hover

Avoid:

- Constant floating animations
- Excessive parallax
- Large bouncing elements
- Animations that slow down creation

Animation should support hierarchy, not compete with it.

---

# 23. Imagery

Use real, high-quality visual assets.

Avoid generic stock imagery whenever possible.

Template thumbnails should accurately represent the actual templates.

Do not use placeholder images in production UI.

---

# 24. Icons

Use Lucide icons consistently.

Icons should:

- Have consistent stroke weight
- Be appropriately sized
- Support the label rather than replace it unnecessarily

Avoid mixing multiple icon styles.

---

# 25. Forms

Forms should feel calm and simple.

Labels should be visible.

Placeholder text should not replace labels.

Use helper text only when useful.

Error messages should appear close to the relevant field.

---

# 26. Empty States

Empty states should be helpful and visually calm.

Example:

```text
No invitations yet

Create your first invitation
and start designing something beautiful.

[Create Invitation]
```

---

# 27. Responsive Behavior

Every important screen must be tested at:

- 375px
- 768px
- 1024px
- 1440px

The layout should adapt rather than simply shrink.

---

# 28. Visual Quality Checklist

Before considering a page complete, check:

- Is the hierarchy obvious?
- Is there enough whitespace?
- Are elements aligned?
- Are fonts consistent?
- Are buttons appropriately weighted?
- Are borders subtle?
- Is there unnecessary decoration?
- Does it look good on mobile?
- Does it look like a real product?
- Does it look different from generic AI-generated websites?

---

# 29. Core Design Principle

The application UI should be quiet.

The invitation designs should be expressive.

In other words:

```text
APPLICATION
Calm
Minimal
Professional
Functional

INVITATION
Expressive
Beautiful
Personal
Decorative
```

Do not make the application compete with the invitations.
