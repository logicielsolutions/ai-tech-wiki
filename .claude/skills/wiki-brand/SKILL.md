---
name: wiki-brand
description: AI Tech Wiki design system, illustration style and writing voice. Load before writing or changing any page, component, illustration, color, font or copy in this repo.
---

# Wiki brand

The wiki's look is **Apple-style**: clean white (or true black) pages, the system font, one blue accent, big confident headlines with tight tracking, soft rounded tiles instead of boxed cards, generous whitespace, and quick, physical feedback. Every page across every entry looks like it came from one hand. This file is the spec; it changes only when the owner asks, and the change lands here before it lands in code.

Decisions so far (add each new one here, dated):

- 12 Oct 2026: Apple-style design replaced the earlier editorial look, per the `apple-design` skill.
- 14 Oct 2026: every tech view opens with an "On this page" index at the very top, listing At a glance and every section after it (VOICE.md; PR #8).
- 16 Oct 2026: no Sources or References section on either view, and none in the index (VOICE.md; PR #10).

Two companion references in this folder, read when the branch applies:

- [ILLUSTRATION.md](ILLUSTRATION.md): drawing card art or explainer visuals (SVG).
- [VOICE.md](VOICE.md): writing any copy, explainer or tech, and both views' section order.

For motion, materials and interaction feel, also load the `apple-design` skill.

## Color tokens

Defined once as CSS variables in `src/app/globals.css` (Tailwind `@theme static`, names `--color-<token>`), overridden for dark under `prefers-color-scheme: dark`. Components use the token names, never raw hex. If the table and `globals.css` disagree, fix whichever one drifted from the owner's last decision, and change both together.

| Token | Light | Dark | Use |
|---|---|---|---|
| `page` | `#FFFFFF` | `#000000` | Page background |
| `surface` | `#F5F5F7` | `#1C1C1E` | Tiles, figures, code blocks |
| `ink` | `#1D1D1F` | `#F5F5F7` | Body text, headings, illustration detail |
| `muted` | `#6E6E73` | `#A1A1A6` | Secondary text, captions, metadata |
| `rule` | `#D2D2D7` | `#38383A` | Hairlines, table rules, chart gridlines |
| `accent` | `#0071E3` | `#2997FF` | The one accent: links, key numbers, the "thing being explained" in art |
| `accent-tint` | `#E8F1FC` | `#0B2643` | Accent fills, highlights, callout backgrounds |
| `fill` | `#E8E8ED` | `#2C2C2E` | Illustration support fill, bar tracks |
| `good` | `#28A745` | `#30D158` | Illustration "yes / pass / good" only |

One accent per view. `good` is the only secondary hue, and it is for illustrations and good/bad pairs in diagrams, never for UI chrome. Light and dark follow the system; both must read correctly.

## Typography

The **system font**, no web fonts: SF Pro on Apple devices, the platform UI font elsewhere.

| Role | Stack | Notes |
|---|---|---|
| Display + headings | `system-ui, -apple-system, "Segoe UI", sans-serif` | Weight 600–700; tracking tightens with size |
| Body + UI | same stack | 400 body, 500–600 labels |
| Code + numbers in tech tables | `ui-monospace, "SF Mono", Menlo, monospace` | Tech view only, plus inline `name` tokens |

Scale (rem) with size-specific tracking: display 3.5 (`clamp(2.5rem, 6vw, 3.5rem)`, −0.03em, leading 1.05) / h1 2.5 (−0.025em) / h2 1.75 (−0.02em, leading 1.15) / h3 1.25 (−0.01em) / body 1.0625 on explainer, 1 on tech (0, leading 1.55) / small 0.875 (+0.01em). Prose column max width `68ch`; figures may break out to `60rem`.

Headings are sentence case. Numerals in tables are tabular (`font-variant-numeric: tabular-nums`). Emphasise with weight, not color.

## Layout

- Page gutter 20px on mobile, 48px from `md`. No horizontal scroll at 375px.
- Vertical rhythm on an 8px grid; sections on the explainer separate by 112px, on tech by 72px.
- Tiles and figures: `surface` background, **no border**, radius 20px (12px for small chips and code blocks), no drop shadow at rest.
- Pills and buttons are fully rounded.
- Top bar: sticky, translucent material (`page` at 72% opacity, `backdrop-filter: blur(20px) saturate(180%)`), a hairline `rule` bottom edge. Solid under `prefers-reduced-transparency`.
- The list page is a responsive grid: 1 column → 2 at `md` → 3 at `lg`. Each tile: art (4:3) on top, then title (h3), pitch (one line, `muted`), tags.
- Every entry page has the same header: breadcrumb (`Wiki / <Title>` or `Wiki / <Title> / Tech`), title, one-line pitch, a pill showing the view (`Explainer` or `For engineers`), and the switch link to the other view.

## Motion

Quick and physical, never decorative.

- Feedback on press, not release: tappable tiles, pills and toggles scale to 0.98 on `:active` within 100ms.
- Hover on a tile: scale 1.015 over 300ms with `cubic-bezier(0.25, 1, 0.5, 1)` (critically damped feel, no overshoot). Nothing else moves.
- Figures that change state animate from their current value (CSS transitions on `transform`, `opacity`, width/height of bars), 300–500ms, no bounce.
- Respect `prefers-reduced-motion` by showing the final state with no movement; color and opacity changes may stay.

## Components

Entries are composed from `src/components/wiki/`, imported from `@/components/wiki`. Reach for an existing component first; when a new pattern is needed, add it there, styled from these tokens, export it from `index.ts`, and add it to this list, so the next entry inherits it.

| Component | Use |
|---|---|
| `Section` | One section: `id` (the anchor) and `title` (the h2) |
| `SubHeading` | An anchored h3 inside a long tech section; listed as `children` in the `PageIndex` |
| `Prose`, `BulletList` | The 68ch reading column, and a plain list inside it |
| `Figure` | A visual plus its visible caption; `scroll` lets a wide diagram scroll sideways on mobile |
| `Steps` / `Step` | The explainer's "How it works": numbered, words beside the figure from `md` |
| `Analogy` | The everyday comparison that opens a concept ("Think of it like this") |
| `Term` | A word with its plain-word definition on hover, focus or tap |
| `Callout` | A note, limit or warning |
| `KeyNumber` / `KeyNumbers` | Headline numbers in tiles |
| `Compare`, `Tiles` | Two things side by side; two to four options side by side |
| `OddsBar` | A label and a probability bar |
| `OutcomePicker` | Pick an action, see its outcome (allowed, refused, stopped); example values only |
| `CodeBlock` | The tech view's one code snippet |
| `Code` | An inline name: API, env var, path. Breaks mid-token so it never forces horizontal scroll |
| `DataTable` | Hairline table; `numeric` right-aligns number columns, `stack` turns wordy rows into cards below `md` |
| `PageIndex` | The tech view's "On this page" index: a `surface` tile, numbered accent links, two columns from `md`; anchors glide into place with smooth scrolling unless reduced motion is on |
| `Person`, `Arrow`, `Label` | Shared art primitives (`art-kit.tsx`) for casts and figures |
| `PageShell`, `Article`, `EntryHeader`, `EntryCard`, `ViewSwitch`, `Tag` | Page frame, header, list tile and view switch; the routes render these, so entries never do |

## Done when

A page passes the brand when every item holds:

- Only token colors appear; exactly one accent hue in view.
- System font stack everywhere; monospace only for code and tech-table numbers; tracking tightens on large headings.
- Tiles have no borders; press feedback on everything tappable.
- Renders cleanly in light and dark, at 375px and at desktop width.
- Every illustration follows ILLUSTRATION.md; every line of copy follows VOICE.md.
