---
name: wiki-entry
description: Add or update an AI Tech Wiki entry from a report, handoff doc or project repo. Use when someone hands over a report or repo path to put in the wiki, or asks to revise an existing entry.
---

# Wiki entry

Turns a source (a report, a handoff doc, a repo path) into one wiki entry: a list card, an explainer for non-tech readers, and a tech page for engineers. The **brief** is the spine: every fact on the pages traces to the source or to the person's answers recorded in it. Load the **wiki-brand** skill before step 4; it governs every pixel and word.

Work through the steps in order. Each ends on its completion criterion; move on only when it holds.

## 1. Read the source

Read everything the person handed over. For a repo: README, any HANDOFF / PLAN / docs folder, eval reports, the main entry points of the code, and the git log for the story of how it was built. Skip `.env*`, keys and credentials entirely; refer to config by variable name only. Skip `node_modules`, build output and lockfiles.

Draft `src/content/<slug>/brief.md` from [BRIEF-TEMPLATE.md](BRIEF-TEMPLATE.md), filling every field the source answers and marking the rest `TODO(ask)`.

**Done when** every brief field is either filled with a fact you can point to in the source, or marked `TODO(ask)`.

## 2. Interview the person

Close the `TODO(ask)` gaps and confirm the judgement calls by asking the person, using the question bank in [INTERVIEW.md](INTERVIEW.md). Ask with `AskUserQuestion`, up to 4 questions per round, most important first; offer concrete options drafted from the source so answering is quick, with your recommended option first. Ask only what the source leaves open, plus the **always-ask** questions. Record each answer in the brief as the person gave it.

**Done when** the brief has zero `TODO(ask)` markers, every always-ask question has an answer, and the person has confirmed the visual metaphor and the one-line pitch.

## 3. Confirm the outline

Write both page outlines into the brief: explainer sections (from VOICE.md) each with its figure idea, and tech sections each with its content. Show the outline to the person in a short message and wait for a yes or for edits.

**Done when** the person has approved the outline.

## 4. Build the entry

Create the entry folder `src/content/<slug>/`:

| File | Contents |
|---|---|
| `brief.md` | The completed brief (already written) |
| `meta.ts` | `slug`, `title`, `pitch`, `tags`, `status`, `updated` (absolute date), `source` |
| `art.tsx` | Card art per ILLUSTRATION.md |
| `explainer.tsx` | The explainer view, composed from `src/components/wiki/` |
| `tech.tsx` | The tech view, composed from `src/components/wiki/` |

The tech view opens with At a glance followed immediately by a `PageIndex` ("On this page") that links to every later section by its anchor, per VOICE.md. Register the entry in `src/content/index.ts`. When a page needs a pattern no shared component covers, build it in `src/components/wiki/` from brand tokens, so the next entry inherits it. The wiki holds information, not the source project: never copy the source's code, dependencies or runtime into this repo, and never call an API from a page. Interactive figures on the explainer are fine when they run on example values baked into the page and labelled as examples. The tech page may carry **one** code snippet, shown in a `CodeBlock`, that captures the core idea (e.g. the single API call); it is displayed, not run.

**Done when** all five files exist, the entry is registered, the tech view's `PageIndex` lists every section after At a glance with ids that match, and every fact on both pages traces to a line in the brief.

## 5. Verify

1. `npm run lint` and `npm run build` pass.
2. Open `/`, `/wiki/<slug>` and `/wiki/<slug>/tech` in a browser at 375px and desktop width, in light and dark. Screenshot each.
3. Walk the wiki-brand **Done when** list and the VOICE.md section order for both views. On the tech view, click every "On this page" link and check it lands on its heading, clear of the top bar.
4. Reread the explainer as the non-tech reader named in the brief: every term translated, every section has a visual, no code.

**Done when** all four checks pass, with screenshots shown to the person and any failures fixed and rechecked.
