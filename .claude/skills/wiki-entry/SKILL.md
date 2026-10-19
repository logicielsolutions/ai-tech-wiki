---
name: wiki-entry
description: Add or update an AI Tech Wiki entry from a report, handoff doc or project repo. Use when someone hands over a report or repo path to put in the wiki, or asks to revise, correct or extend an existing entry.
---

# Wiki entry

Turns a source (a report, a handoff doc, a repo path) into one wiki entry: a list card, an explainer for non-tech readers, and a tech page for engineers. The **brief** is the spine: every fact on the pages traces to the source or to the person's answers recorded in it.

**Load the wiki-brand skill before step 1**; it governs every pixel and word, and steps 1–3 already need it. Its files sit in `.claude/skills/wiki-brand/`, not in this folder:

- [wiki-brand/SKILL.md](../wiki-brand/SKILL.md): tokens, layout, the shared components, and the brand **Done when** list.
- [wiki-brand/VOICE.md](../wiki-brand/VOICE.md): title, pitch and tag rules (step 1), both section orders (step 3), the copy rules (step 4).
- [wiki-brand/ILLUSTRATION.md](../wiki-brand/ILLUSTRATION.md): the visual metaphor (step 2) and the art (step 4).

Work through the steps in order. Each ends on its completion criterion; move on only when it holds. To change an entry that already exists, follow [Updating an entry](#updating-an-entry) instead.

## 1. Read the source

Read everything the person handed over. For a repo: README, any HANDOFF / PLAN / docs folder, eval reports, the main entry points of the code, and the git log for the story of how it was built. Skip `.env*`, keys and credentials entirely; refer to config by variable name only. Skip `node_modules`, build output and lockfiles.

Draft `src/content/<slug>/brief.md` from [BRIEF-TEMPLATE.md](BRIEF-TEMPLATE.md), filling every field the source answers and marking the rest `TODO(ask)`. Copy names, versions and numbers exactly as the source gives them; never round a model name up to its family or a count up to a nicer number.

**Done when** every brief field is either filled with a fact you can point to in the source, or marked `TODO(ask)`.

## 2. Interview the person

Close the `TODO(ask)` gaps and confirm the judgement calls by asking the person, using the question bank in [INTERVIEW.md](INTERVIEW.md). Ask with `AskUserQuestion`, up to 4 questions per round, most important first; offer concrete options drafted from the source so answering is quick, with your recommended option first. Ask only what the source leaves open, plus the **always-ask** questions. Record each answer in the brief as the person gave it.

**Done when** the brief has zero `TODO(ask)` markers, every always-ask question has an answer, and the person has confirmed the visual metaphor and the one-line pitch.

## 3. Confirm the outline

Write both page outlines into the brief, each in VOICE.md's section order: the explainer sections each with its figure idea, and the tech sections (On this page, then At a glance, then the rest) each with its content. Show the outline to the person in a short message and wait for a yes or for edits.

**Done when** the person has approved the outline.

## 4. Build the entry

Create the entry folder `src/content/<slug>/`:

| File | Contents |
|---|---|
| `brief.md` | The completed brief (already written) |
| `meta.ts` | `slug`, `title`, `pitch`, `tags`, `status`, `updated` (absolute date), `source` |
| `cast.tsx` | The metaphor's objects as small SVG components, drawn once per ILLUSTRATION.md; the card, the hero and every explainer figure use them |
| `art.tsx` | Card art per ILLUSTRATION.md, built from the cast |
| `figures.tsx` | The explainer's hero and step figures, built from the cast. Tech diagrams are plain boxes and arrows with no metaphor; they go in `tech.tsx`, or here when they reuse the cast's shapes (ILLUSTRATION.md) |
| `<name>-lab.tsx` | Only when the brief says yes to an interactive figure: a client component on example values |
| `explainer.tsx` | The explainer view, composed from `src/components/wiki/` |
| `tech.tsx` | The tech view, composed from `src/components/wiki/` |

The tech view opens with a `PageIndex` ("On this page") at the very top, before At a glance. It lists At a glance first, then every section in page order, each linking to its anchor, per VOICE.md. Neither view has a Sources or References section.

Register the entry in `src/content/index.ts`: import its `meta`, `Art`, `Explainer` and `Tech`, and add one line to `entries`. When a page needs a pattern no shared component covers, build it in `src/components/wiki/` from brand tokens, so the next entry inherits it; check the component list in wiki-brand first.

The wiki holds information, not the source project: never copy the source's code, dependencies or runtime into this repo, and never call an API from a page. Interactive figures on the explainer are fine when they run on example values baked into the page and labelled as examples. The tech page carries **one** code snippet at most, shown in a `CodeBlock`, that captures the core idea (e.g. the single API call); it is displayed, not run.

**Done when** every file in the table exists (the lab only when the brief asks for one), the entry is registered, the tech view's `PageIndex` sits at the top and lists every section, At a glance first, with ids that match, and every fact on both pages traces to a line in the brief.

## 5. Verify

1. **Build**: `npm run lint` and `npm run build` pass.
2. **Facts**: go through both pages and `meta.ts` line by line against the brief. Every number, model or product name, version, count, date, status and claim about quality or safety has a brief line with its `(source: …)` or `(asked: …)`, and the page says no more than that line does. Watch for the usual drift: a model named by its family instead of the exact one, a vague label where the source names the thing, a count with no source, a word like "safely", "proven" or "in use" that the source doesn't support. Cut anything that fails, or ask the person.
3. **Browser**: run `npm run dev` and open `/`, `/wiki/<slug>` and `/wiki/<slug>/tech` at 375px and desktop width, in light and dark, using the session's browser tool (e.g. the `claude-in-chrome` skill). Screenshot each. If no browser tool is available, tell the person this check was not run; never report it as passed.
4. **Brand and order**: walk the wiki-brand **Done when** list and the VOICE.md section order for both views. On the tech view, click every "On this page" link and check it lands on its heading, clear of the top bar, and that its title matches the heading word for word.
5. **Reader**: reread the explainer as the non-tech reader named in the brief: every term translated, every section has a visual, no code.

**Done when** all five checks pass, with screenshots shown to the person and any failures fixed and rechecked.

## Updating an entry

For a correction, a new fact, a review finding, or a section added or removed on an entry that already exists:

1. **Brief first.** Change `brief.md` before any page: add or correct the fact with its `(source: …)` or `(asked: <date>)`, and delete what is withdrawn. When the change needs a fact the source doesn't give, ask the person as in step 2.
2. **Every place it appears.** Search the entry folder for the old wording or number and change each occurrence: explainer, tech, figures, labs, `meta.ts`. When a tech section is added, renamed or removed, change the `PageIndex` items in the same edit.
3. **Date.** Set `updated` in `meta.ts` to today when facts on the pages change.
4. **Verify.** Run step 5's build, facts and brand checks on the changed pages, and the browser check when layout or figures changed.
5. **Rules for every entry.** When the person asks for a change that applies to all entries (a section dropped, a new standard block), apply it to every entry and update this skill and wiki-brand in the same change, so new entries follow it.

**Done when** the brief and both pages agree, no stale copy of the old fact is left in the entry folder, and the checks pass.
