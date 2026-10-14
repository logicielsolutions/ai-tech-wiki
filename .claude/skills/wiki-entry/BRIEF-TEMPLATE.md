# Brief template

Copy into `src/content/<slug>/brief.md`. Each field holds a fact plus where it came from: `(source: README.md)` or `(asked: 12 Oct 2026)`. Unknowns stay `TODO(ask)` until the interview closes them.

```markdown
# <Title>

## Identity
- Slug:
- Title (2–5 words, the idea not the repo):
- One-line pitch (≤ 90 chars, for a non-tech reader):
- Tags (1–3):
- Status: experiment | pilot | production | retired
- Owner:
- Source: <repo path or report>
- Last updated:

## Readers
- Non-tech reader we picture:
- What they should be able to say after the explainer:
- Engineer we picture:
- What they should be able to decide after the tech page:

## The idea
- Problem it solves, as a situation:
- How it works, in 3–6 plain steps:
- Visual metaphor (the everyday objects that stand for the parts):
- Worked example for "See it in action":
- Interactive figure? (yes / no; example values only, never a live API call):
- The one code snippet for the tech page (what it shows):

## The facts
- Stack and models:
- Architecture / data flow:
- Core mechanism (API, algorithm, request/response shape):
- Key decisions (decision, reason, rejected alternative):
- Evaluation (what was measured, how, results):
- Cost:
- Limits and risks:
- How to run it:
- Open questions / next steps:
- Sources and links:

## Off the page
- Anything to leave out (names, clients, internal numbers):

## Outline
### Explainer
1. ...
### Tech
0. On this page (index at the top: At a glance, then every section)
1. At a glance
2. ...
```
