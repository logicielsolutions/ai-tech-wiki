# Illustration style

All art is hand-built inline SVG in React, so it themes with the page and never drifts. One style for every entry: **flat, soft and rounded**, like Apple's product diagrams and SF Symbols: filled shapes, few lines, lots of air.

## The rules

- **Palette**: only the brand tokens, referenced as `var(--color-ink)`, `var(--color-muted)`, `var(--color-accent)`, `var(--color-accent-tint)`, `var(--color-fill)`, `var(--color-good)`, `var(--color-surface)`, `var(--color-page)`. No hex in SVG. This is what makes dark mode work for free.
- **Fills first**: shapes are flat fills (`fill` and `page`/`surface` for objects, `accent-tint` for highlighted areas, `good` for a "yes" state); solid `accent` is reserved for the **one thing the entry is about** (e.g. the model, the decision, the signal). No gradients, shadows, textures or 3D.
- **Lines**: used sparingly for detail (text lines on a document, arrows): 2px at card size, 1.5px for small details, `muted` or `ink`, `stroke-linecap="round"`, `stroke-linejoin="round"`. No outline around every shape.
- **Shapes**: simple primitives with generous rounding (rects r=10–16, circles, straight or gently curved paths). Recognisable objects are built from these: a document is a rounded rect with three lines; a model is a rounded square with an accent core; a question is a speech bubble.
- **Text in art**: card art carries none. Explainer figures may use short labels (≤3 words) in the system font, 13–14px, weight 500, `ink` or `muted`.
- **Composition**: one clear subject, generous empty space around it, left-to-right reading flow for anything that shows a process.
- **Accessibility**: decorative card art gets `aria-hidden="true"`; explainer figures get `role="img"` and an `aria-label` that states what the figure shows, plus a visible caption via `Figure`.

## Sizes

| Use | viewBox | Notes |
|---|---|---|
| List card art | `0 0 400 300` | One metaphor for the whole idea, readable at 280px wide |
| Explainer hero | `0 0 800 400` | The same metaphor as the card, expanded with more context |
| Explainer step figure | `0 0 640 320` | One idea per figure; reuse the hero's objects so readers recognise them |
| Tech diagram | `0 0 800 auto` | Boxes and arrows allowed, labels in the monospace stack, 12–13px |

## The metaphor comes first

Before drawing, write down the entry's **visual metaphor** in `brief.md`: one sentence naming the everyday objects that stand for the system's parts (e.g. "a resume goes into a scale; the scale shows odds instead of a verdict"). The card, the hero and every step figure reuse those same objects, so the reader learns the cast once. Interactive figures (toggles, sliders, step-through) are welcome on the explainer when they make the mechanism visible.

## Where art lives

- Card art: `src/content/<slug>/art.tsx`, default export, no props besides `className`.
- Explainer and tech figures: inside the entry folder, or promoted to `src/components/wiki/` once a second entry wants the same shape.
