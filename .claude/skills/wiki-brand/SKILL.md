---
name: wiki-brand
description: AI Tech Wiki design system, illustration style and writing voice. Load before writing or changing any page, component, illustration, color, font or copy in this repo.
---

# Wiki brand

The wiki's look is **editorial and calm**: a well-made explainer magazine. Warm paper, ink-dark text, one accent, serif headlines, generous whitespace. Every page across every entry looks like it came from one hand. This file is the spec; it changes only when the owner asks, and the change lands here before it lands in code.

Two companion references, read when the branch applies:

- [ILLUSTRATION.md](ILLUSTRATION.md): drawing card art or explainer visuals (SVG).
- [VOICE.md](VOICE.md): writing any copy, explainer or tech.

## Color tokens

Defined once as CSS variables in `src/app/globals.css` and exposed to Tailwind via `@theme`. Components use the token names, never raw hex. If the table and `globals.css` disagree, fix whichever one drifted from the owner's last decision, and change both together.

| Token | Light | Dark | Use |
|---|---|---|---|
| `paper` | `#FAF7F0` | `#171614` | Page background |
| `surface` | `#FFFFFF` | `#201E1B` | Cards, figures, code blocks |
| `ink` | `#1D1B18` | `#EDE8DF` | Body text, illustration strokes |
| `muted` | `#6B6559` | `#A39C8F` | Secondary text, captions, metadata |
| `rule` | `#E5DFD3` | `#34312C` | Borders, dividers, chart gridlines |
| `accent` | `#B4532A` | `#E0855A` | The one accent: links, key numbers, the "thing being explained" in art |
| `accent-tint` | `#F3E2D8` | `#3A2A21` | Accent fills, highlights, callout backgrounds |
| `sand` | `#E9DFC9` | `#3B362D` | Illustration support fill |
| `sage` | `#8C9A7E` | `#7F8D72` | Illustration second fill; "yes / pass / good" in diagrams |

One accent per view. `sage` is the only secondary hue, and it is for illustrations and good/bad pairs in diagrams, never for UI chrome. Light and dark follow the system (`prefers-color-scheme`); both must read correctly.

## Typography

Loaded with `next/font/google` in `src/app/layout.tsx`.

| Role | Font | Notes |
|---|---|---|
| Display + headings | **Fraunces** (variable, opsz) | Weight 500–600, tight tracking on large sizes |
| Body + UI | **IBM Plex Sans** | 400 body, 500 labels |
| Code + numbers in tech tables | **IBM Plex Mono** | Tech view only, plus inline `name` tokens |

Scale (rem): display 3.25 / h1 2.5 / h2 1.75 / h3 1.25 / body 1.125 on explainer, 1 on tech / small 0.875. Line height 1.6 for body, 1.15 for display. Prose column max width `68ch`; figures may break out to `56rem`.

Headings are sentence case. Numerals in tables are tabular (`font-variant-numeric: tabular-nums`).

## Layout

- Page gutter 24px on mobile, 48px from `md`. No horizontal scroll at 375px.
- Vertical rhythm on an 8px grid; sections on the explainer separate by 96px, on tech by 64px.
- Cards and figures: `surface` background, 1px `rule` border, radius 12px, no drop shadows. Hover on a card lifts the border to `ink` and nudges art 2px; nothing more.
- The list page is a responsive grid: 1 column → 2 at `md` → 3 at `lg`. Each card: art (4:3) on top, then title (Fraunces h3), pitch (one line, `muted`), tags.
- Every entry page has the same header: breadcrumb (`Wiki / <Title>` or `Wiki / <Title> / Tech`), title, one-line pitch, a pill showing the view (`Explainer` or `For engineers`), and the switch link to the other view.

## Motion

Quiet. 150–250ms ease-out on hover and reveal; diagrams may step through states on click. Respect `prefers-reduced-motion` by showing the final state with no animation.

## Components

Entries are composed from `src/components/wiki/`. Reach for an existing component first; when a new pattern is needed, add it there, styled from these tokens, so the next entry inherits it. Expected building blocks: `EntryCard`, `EntryHeader`, `Section`, `Figure` (visual + caption), `Steps` / `Step`, `Analogy`, `Term` (plain-word definition on hover/tap), `Callout` (note / limit / warning), `KeyNumber`, `Compare` (side-by-side), `CodeBlock`, `DataTable`, `ViewSwitch`.

## Done when

A page passes the brand when every item holds:

- Only token colors appear; exactly one accent hue in view.
- Headings in Fraunces, body in Plex Sans, code only in Plex Mono.
- Renders cleanly in light and dark, at 375px and at desktop width.
- Every illustration follows ILLUSTRATION.md; every line of copy follows VOICE.md.
