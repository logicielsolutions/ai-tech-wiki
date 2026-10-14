# Voice and formatting

The wiki speaks like a patient, sharp colleague: plain words, short sentences, specific numbers, no hype. US English. Sentence-case headings. No emoji, no exclamation marks. Dates written absolute (`12 Oct 2026`).

## Explainer view: for anyone

The reader is smart but has no AI or tech background. Picture a colleague from finance or HR. They finish the page able to explain the idea to someone else.

- **Analogy first.** Open each concept with an everyday comparison, then show the real thing. Reuse the entry's visual metaphor throughout.
- **One idea per section, one visual per section.** If a section has no figure, it is either two sections or prose that belongs in the tech view.
- **Jargon gets translated at first use** with `Term` (e.g. "a *probability*, meaning how sure it is, from 0 to 100%"). If a word needs a paragraph to explain, it moves to the tech view.
- **No code, no API names, no config.** Model names appear only as names ("a model called Luna").
- **Numbers in human terms.** "About 8 in 10 resumes" beats "83.3%"; "less than a cent for a thousand calls" beats "$0.10 per 1M tokens".
- **Honest limits.** Every explainer has a "What it can't do" section in plain words.

Section order (rename headings to fit the entry, keep the order):

1. **The one-line idea**: hero figure + pitch.
2. **Why it matters**: the problem, told as a situation the reader recognises.
3. **How it works**: 3–6 steps, each a `Step` with a figure.
4. **See it in action**: a worked example or interactive figure.
5. **What it can't do**: limits and where a human stays in charge.
6. **In one breath**: a 2–3 sentence summary.
7. **Going deeper**: link to the tech view.

## Tech view: for engineers

The reader is an engineer deciding whether to use, extend or copy this. Be exact and dense; skip the analogies.

- Real names: endpoints, models, packages, env var names (never values), file paths in the source repo.
- Show shapes: request and response examples in `CodeBlock`, data flow as a diagram.
- Every claim about quality cites a measured number and how it was measured.
- Decisions get their reason and the alternative that was rejected.

Section order:

1. **At a glance**: a `DataTable` of stack, models, cost, status, owner, source repo.
2. **On this page**: a `PageIndex` placed right after At a glance, listing every section below it in page order, each linking to that section's anchor on the same page (`#<section id>`). Titles match the section headings word for word. A long section with `SubHeading`s lists them as `children`. It is a navigation block, not a `Section`, so it has no heading of its own beyond "On this page".
3. **Architecture**: diagram + walkthrough of the data flow.
4. **Core mechanism**: the API or algorithm in detail, with request/response.
5. **Key decisions and trade-offs**: decision, reason, rejected alternative.
6. **Evaluation**: what was measured, results table, known failure modes.
7. **Limits and risks**: technical, cost, safety, policy.
8. **Run it yourself**: prerequisites and commands.
9. **Open questions / next steps**.
10. **Sources**: links to docs, repo files, reports.

When a section is added, renamed or removed, update the `PageIndex` items in the same change, so every link lands on a heading that exists.

## List card

- Title: 2–5 words, the name of the idea, not the repo (`How Luna decides`, not `decision-api-resume`).
- Pitch: one line, ≤ 90 characters, written for the explainer reader.
- Tags: 1–3 lowercase topic tags from the shared set in `src/content/index.ts`; add a new tag only when none fit.
