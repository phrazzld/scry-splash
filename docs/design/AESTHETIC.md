# AESTHETIC.md

## Scry Design Language: High Modernism

Scry's aesthetic embodies **high modernism**: clean, modular, and quietly powerful. It reflects the app's purpose — to serve as an intelligent, frictionless cognitive extension of the user. The design should be invisible when it needs to be, and clearly informative when called upon. Think of Scry not as an app, but as an ambient **instrument** of clarity.

---

## 1. Design Philosophy

- **Clarity above all** — every element exists to enhance understanding, interaction, or recall. No aesthetic flourishes without function.
- **Form is function** — the structure _is_ the style. Aesthetic elegance arises from systematized layout, consistent rhythm, and efficient feedback.
- **Trust the grid** — symmetry, alignment, and typographic hierarchy create cognitive ease.
- **Visual silence** — whitespace is not emptiness; it is compositional breath.

---

## 2. Color System

### Primary Palette (Display P3-compatible)

- **Ink Black**: `#121212` — primary text and interface outlines
- **Chalk White**: `#FAFAFA` — main background, neutral and soft
- **Cobalt Blue**: `#0047AB` — action highlights, active state indicators
- **Slate Gray**: `#757575` — secondary text and interface metadata
- **Silver Gray**: `#E0E0E0` — dividers, card outlines, inactive borders

### Accent Variants (used sparingly)

- **Signal Green**: `#00A676` — correct answer confirmation, growth metrics
- **Warm Amber**: `#F2A900` — warnings, expiring memory alerts

### Use Rules

- One dominant hue per screen. Never use more than one accent per view.
- Gradients are discouraged except in data visualizations. Flat, high-contrast surfaces are preferred.
- Color must **reinforce function** — never decorative.

---

## 3. Typography

### Typefaces

- **Primary UI Font**: IBM Plex Sans or Inter
  - Grotesque, clean, highly legible at small sizes
- **Body/Content Font**: Plex Sans or Literata (for extended reading)
  - Optimized for long-form reading where applicable
- **Monospaced**: IBM Plex Mono or Recursive Mono
  - Used only in structured outputs or technical content

### Typographic Rhythm

- Adhere to a **4pt base scale**, ideally using modular scales (1.125 or 1.25 ratio)
- Font weight hierarchy: Regular / Medium / Bold — never Light or Black
- Tracking should be tight and consistent; avoid letterspacing for UI labels
- Use line height to reinforce vertical rhythm and ensure visual flow

---

## 4. Layout & Spacing

- **Grid System**: 8pt base grid with 4pt nudge support
- **Content Widths**:
  - Full-width padding: 24pt (mobile), 64pt (desktop)
  - Text content max-width: 72 characters
- **Whitespace**: Generous. Think Tufte — space is a carrier of meaning
- **Card Design**: Flat surfaces with minimal borders. Subtle shadows permitted for elevation, but use sparingly
- **Visual Grouping**: Use consistent margin/padding patterns to signal structure. Avoid unnecessary dividers

---

## 5. Motion & Interaction

### Principles

- **Feedback, not flair** — motion must signal state or reinforce mental model
- **Easing**: Use `ease-out` for transitions, `ease-in-out` for modals
- **Duration**: 150–250ms typical; 300ms max for major view changes

### Motion Examples

- **Flashcard flip**: horizontal axis rotate with fade
- **Knowledge graph zoom**: smooth scale + semantic focus expansion
- **Toast notification**: fade + slight slide from top or bottom, disappearing without interaction
- **Interaction affordance**: hover states with subtle luminance shift, not bounce

---

## 6. Iconography & Visual Language

- **Icon Style**: Line-based, pixel-aligned, 2px stroke max
- **Size System**: 16 / 24 / 32 / 48 px depending on context
- **Consistency**: Use grid-aligned vector sets only; avoid hand-drawn or glyph-style icons
- **Visual Metaphors**:
  - Eye or mirror: reflection, perception
  - Nodes/edges: connection, synthesis
  - Compass or orbit lines: navigable insight space

---

## 7. Interface Components

- **Cards**: unified info unit — used for concepts, questions, insights, etc.
- **Timeline/Feed**: reverse chronological or event-driven review log
- **Graph View**: zoomable, semantic relationships
- **Floating Controls**: minimal, monochrome, dismissible
- **Search/Command**: universal palette for recall, not discovery

---

## 8. Tone & Microcopy

- **Tone**: precise, calm, confident — like an expert tutor, not a cheerleader
- Avoid exclamation points unless absolutely justified
- **Default voice**: declarative, minimal, intentional
  - e.g., "Ready to review." / "Nothing scheduled. Reflect instead."
- **Empty states**: elegant, thoughtful prompts
  - "You’ve remembered well. Come back when you’re at risk of forgetting."

---

## 9. Ambient Data Visualization

- Favor clarity over cleverness — every chart or diagram must be immediately legible
- Use consistent shapes for node types
- Label directly whenever possible; tooltips should enrich, not replace
- Avoid chartjunk; remove gridlines and legends unless necessary
- Knowledge graph should evoke exploration, not overwhelm

---

## 10. Overall Mood

Scry should feel like:

- A clean desk in a well-lit study
- A freshly calibrated instrument
- A trusted, quiet intelligence at your side

It should never feel crowded, gamified, busy, over-animated, or twee. It is a tool for people who _care about their minds_ — and it should respect that seriousness with elegance.

---

### Design References

- Things 3
- Linear.app
- Vercel dashboard
- Readwise Reader
- IBM Design Language
- Edward Tufte (for data/space principles)

---

Scry's aesthetic should _disappear into utility_ when working, and _emerge as elegant clarity_ when observed. This document is the North Star. Revisit it often to stay aligned with our principles of modernist intelligence, quiet power, and the beautiful utility of remembered knowledge.
