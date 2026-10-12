@AGENTS.md

# AI Tech Wiki

An internal wiki that explains AI experiments and projects at two depths: one any reader can follow (no AI or tech background), and one for engineers. Each **entry** starts from a source project or report (e.g. `~/Documents/Repo/experiment/decision-api-resume`) and becomes three views.

## The three views

| Route | View | Reader | Job |
|---|---|---|---|
| `/` | **List** | Everyone | A grid of entry cards, each with its own illustration and a one-line pitch |
| `/wiki/<slug>` | **Explainer** | Non-tech readers | Full visual explanation of how the thing works, analogy first, every section carries a visual, zero code |
| `/wiki/<slug>/tech` | **Tech** | Engineers only | Architecture, API shapes, decisions and trade-offs, eval numbers, limits, how to run it |

The explainer links down to the tech page; the tech page links back up. A reader on the explainer never needs the tech page to understand the idea.

## Where things live

- `src/content/<slug>/`: one folder per entry: `brief.md` (the interview-backed facts, source of truth for the entry), `meta.ts`, `art.tsx`, `explainer.tsx`, `tech.tsx`.
- `src/content/index.ts`: the registry the list page and routes read from.
- `src/components/wiki/`: shared building blocks for entries. An entry composes these; a new pattern becomes a shared component here, never one-off styling inside an entry.

## Skills: use them, every time

- **wiki-entry** (`.claude/skills/wiki-entry/`): adding or updating an entry from a report or repo. It interviews the person for missing details before any page is written.
- **wiki-brand** (`.claude/skills/wiki-brand/`): the fixed design system, illustration style and writing voice. Load it before touching any UI, illustration or copy. Brand changes happen only when the owner asks, and land in that skill first.

## Rules

- Source repos may hold `.env` files and keys. Never read, copy or quote them; entries describe configuration by variable name only.
- Package manager: npm. Check with `npm run lint` and `npm run build`.
- Owner: Kumar Gaurav (Engineering Manager, AI Practice, Logiciel).
