# Motion with Claude Code

How to make motion graphics and short videos with Claude, using HyperFrames (local, open source) and Claude Motion (claude.ai). The page teaches install and prompting; no custom skill is needed.

Source shorthand used below:
- `[SRC-nn]` the motion wiki brief handoff, file `nn` (00-README to 10-learn-more), written 22 Oct 2026 against HyperFrames plugin v0.8.181.
- `[HF]` checked against the HyperFrames plugin v0.8.181 install (README, docs/, skills/, CLI source) on 22 Oct 2026.

## Identity
- Slug: motion-with-claude-code
- Title (2–5 words, the idea not the repo): Motion with Claude Code [SRC-00]
- One-line pitch (≤ 90 chars, for a non-tech reader): Describe a short video in plain words; Claude builds it and a renderer films it. (asked: 22 Oct 2026)
- Tags (1–3): video, agents
- Status: experiment (asked: 22 Oct 2026)
- Owner: AI Practice team (asked: 22 Oct 2026)
- Source: Motion wiki brief handoff, Oct 2026 [SRC-00]
- Last updated: 22 Oct 2026

## Readers
- Non-tech reader we picture: same as the other entries: PMs, team leads, marketing colleagues, clients; no AI or tech background. Two views as usual: visual explainer for them, engineering view for engineers. (asked: 22 Oct 2026)
- What they should be able to say after the explainer: Claude can make a video by writing it as code; a renderer turns that code into frames, the same every time; pick HyperFrames for a file to ship, Claude Motion for a quick shareable link; prompt with timestamps, exact words and one change per round. [SRC-01, 04, 06]
- Engineer we picture: engineers and technical folks comfortable in a terminal [SRC-00] (asked: 22 Oct 2026)
- What they should be able to decide after the tech page: which of the two tools to use, how to install it, how to write a prompt that lands, how to debug a broken render.

## The idea
- Problem it solves, as a situation: a short launch or explainer video usually means a motion designer and editing software, and changing one word means re-editing by hand. Code-based video is editable text: change one word, render again, identical result. [SRC-01]
- How it works, in plain steps [SRC-03, 09]:
  1. You describe the video: length, shape, what happens when, the exact words.
  2. Claude writes it as a web page with animation, scene by scene.
  3. You watch a live preview and give notes, one change at a time.
  4. When you approve, the renderer plays the page frame by frame in a hidden browser and saves an MP4.
  5. The code stays, so you can change one word and render again, with the same result.
- Visual metaphor: a flipbook. Claude writes the rules for every page (the composition: a timed rule per element), the renderer draws each page from the rules and flips them into a video; same rules, same pages, every time; change one rule and flip again. Accent goes on the rules. (asked: 22 Oct 2026, replaced sheet music, which the user didn't like)
- Worked example for "See it in action": a playable 8-second mini video built into the page (a title, a number counting up, a tagline), with play and scrub controls and a feel switch (smooth, snappy, bouncy, dreamy) showing one word changing the motion. Labelled as an example. Stands in for the sample videos. (asked: 22 Oct 2026)
- Interactive figure? yes: the mini video lab, example values only, no API call. (asked: 22 Oct 2026)
- The one code snippet for the tech page: the six-part prompt skeleton [SRC-04]

## The facts
- Stack and models:
  - Claude Code with the HyperFrames plugin; Claude Motion artifact type on claude.ai (Beta). [SRC-01]
  - HyperFrames: open-source framework by HeyGen, Apache-2.0. Claude writes HTML compositions with seekable animations; renders to MP4 with headless Chrome + FFmpeg. [SRC-01] [HF plugin.json: license Apache-2.0]
  - Plugin ships 21 skills: a router (`/hyperframes:hyperframes`) plus workflows and domain skills. [SRC-00] [HF: 21 skill folders]
  - Claude Motion: Claude writes the film as code inside a hosted player. [SRC-01]
- Comparison [SRC-01]:
  - Where it runs: HyperFrames on your machine (or cloud render); Claude Motion on claude.ai (desktop, web, or from Claude Code via artifacts).
  - Setup: plugin + Node 22+ + FFmpeg vs none.
  - Best for: launches, explainers, captions on footage, talking-head recuts, voice + music, 9:16 reels vs quick explainers and demos shared as a link for comments.
  - Your footage: yes (captions, recuts, overlays, audio kept) vs images and muted clips as picture only.
  - Audio: TTS voiceover, music library, SFX, mixing vs a generated wordless score + effects.
  - Output: editable project folder (plain HTML) + MP4/MOV/WebM vs shareable link, scrub + comment on moments, MP4 export.
  - Determinism: same frames every time, both.
  - Rule of thumb: file to ship, footage, narration or vertical reel → HyperFrames; quick animated explainer for team feedback → Claude Motion.
- Why code-based video: editable text, diffable, reusable as a template, change one word and re-render, identical output. Generative video models can't do that but are better at photoreal footage; these tools are for motion graphics, type, UI and data. [SRC-01]
- Core decision: no custom skill needed. HyperFrames ships an official plugin; Claude Motion is built into claude.ai. A team brand skill or brand file can come later if people keep making Logiciel-branded videos. [SRC-00]
- Setup [SRC-02] [HF README]:
  - `claude plugin marketplace add heygen-com/hyperframes`, `claude plugin install hyperframes@hyperframes`, restart Claude Code.
  - Requirements: Node.js 22+, FFmpeg (`brew install ffmpeg`); Chrome handled by the renderer.
  - `npx hyperframes doctor` checks the machine.
  - Other agents (Cursor, Copilot, Gemini CLI, Codex): `npx skills add heygen-com/hyperframes`, pick Core Skills.
  - Optional auto-update in `/plugin` → Marketplaces.
  - Claude Motion: claude.ai → Artifacts → Make something new → Motion, or ask Claude Code for an animation.
- First video flow [SRC-03]: empty folder; `/hyperframes:hyperframes make a 10-second product intro for https://example.com`; router picks a workflow, proposes a direction, asks only for what's missing; scaffolds, builds, runs `lint`/`check`, opens a live preview; you give notes and approve; it renders (rendering waits for your OK by design).
- CLI commands [SRC-03] [HF]: `init`, `preview`, `lint`, `check`, `render`, `add <block>`, `tts`, `transcribe`, `doctor`.
- Workflows [SRC-03] [HF skills/]: product-launch-video, faceless-explainer, motion-graphics, embedded-captions, talking-head-recut, pr-to-video, music-to-video, slideshow, general-video.
- `lint` and `check` passing means well-formed, not good; always watch the preview. [SRC-03]
- Prompting [SRC-04] [HF docs/prompting]:
  - Six-part skeleton: route, spec, beats, copy, technique, negatives.
  - Default 1920×1080 at 30fps; 1080×1920 for reels.
  - Beat formula: element · motion · layout · style · timing.
  - Spec dial: mood words → style tokens → full visual spec.
  - Pin real 3D ("Three.js via the adapter") and sequencing ("fades out fully by 4.2s; at 4.2s READY stamps in").
  - Vocabulary: smooth power2.out, snappy power4.out, bouncy back.out, springy elastic.out, dramatic expo.out, dreamy sine.inOut. Timing: 0.2s energy, 0.4s professional, 0.6s luxury, 1–2s cinematic.
  - Rewrites: "holds" → ambient idle; match beats to length; quote taglines; "counts up to $4.2M".
  - Claude Motion: subject, audience and length in one or two lines; it asks style, colors, length with a quick form.
- References [SRC-05] [HF docs]: 2–4 refs sharing one look; files beat links; brand colors/fonts/logo count; say what to take from each. Frame-by-frame description gets about 75% first try; feeding converged numbers back gets about 80–90% on a fresh build; last ~10% doesn't close from text. Percentages are HyperFrames' own observed results, not guarantees. Don't recreate another company's brand, UI or characters.
- Iterating [SRC-06]: one change per round; absolute targets; freeze what works; layer up; strip and re-layer; timecode notes; draft renders while iterating. Claude Motion: comment on a moment or range in the timeline.
- Audio [SRC-07] [HF docs/prompting/media-and-audio]: TTS engine order HeyGen Starfish (if configured) → ElevenLabs (if key) → local Kokoro (free, no key); Gemini TTS by explicit choice. Kokoro voices: af_heart, af_nova (product demo); am_adam, bf_emma (tutorial); af_sky, am_michael (marketing). Music: mood and loudness ("ducked ~12 dB under the voice"). SFX cued to moments. "Elements land on their spoken cues" works because narration gets per-word timestamps. Captions: embedded-captions; titles over talking head: talking-head-recut.
- Rendering [SRC-08] [HF CLI render.ts]:
  - Quality: `draft` for iterating; `looks` is the CLI default (standard preset, CRF 16); `delivery` (= `high`) for the final. (The source said the default is `standard`; the CLI v0.8.181 default is `looks`.)
  - Transparent MOV = ProRes 4444 with alpha; transparent WebM = small, alpha in browsers; PNG sequence for compositing. Transparency only for overlays.
  - Default MP4 1920×1080 30fps; don't ask 4K/60 for social.
  - Cloud render (Lambda, Cloud Run, HeyGen cloud) only for long or 4K jobs.
- Rules that prevent broken renders [SRC-08]: timelines on `window.__timelines`; no `Math.random()`; build timelines synchronously; `class="clip"` + `data-start`, `data-duration`, `data-track-index`; footage audio on `<video>` with `data-has-audio="true"`; every scene gets an entrance and transitions; hidden-at-start elements set outside the timeline (render workers seek out of order). Symptoms: invisible in render → cold-seek hidden state; visible at frame 0 → `fromTo` back-rendering; centered element jumps → CSS translate vs GSAP x/y.
- Claude Motion workflow [SRC-09]: ask; quick picks (style, colors, length); writes scene by scene; scrub (sound starts muted); revise by commenting on a moment or range; export MP4, share link (private until shared). Best with your own material. Clips play muted; score generated and wordless. Typical 10–30 s, max 300 s. One aspect ratio per film. No recreating other companies' designs, logos or known songs.
- Evaluation: none measured by us; only HyperFrames' own 75% / 80–90% reference-match figures [SRC-05].
- Cost: HyperFrames free; local rendering uses no HeyGen credits; optional hosted voice/media providers cost extra. Claude Motion: included in the normal Claude plan usage, no separate price (asked: 22 Oct 2026).
- Limits and risks: not photoreal; lint/check ≠ good; last ~10% of a reference look doesn't close from text; CLI moves fast; Claude Motion clips muted, one aspect ratio, max 300 s; copyright limits on references. [SRC-01, 03, 05, 08, 09]
- How to run it: see Setup and First video.
- Open questions / next steps: a team brand skill or brand file if Logiciel-branded videos become common [SRC-00]; sample videos to be added by the author [SRC-00].
- Sources and links (brief only): https://hyperframes.heygen.com, https://hyperframes.heygen.com/prompting/overview, https://hyperframes.heygen.com/catalog/blocks/data-chart, https://hyperframes.heygen.com/showcase, https://www.hyperframes.dev/, https://github.com/heygen-com/hyperframes [SRC-10]

## Off the page
- Excluded by the source: Google Flow, flow-mcp, `/reel`, local Qwen/aiden TTS, personal folder paths, the third-party skills `editorial-film-edit` / `paper-collage-film`. [SRC-00]
- Names allowed: tools, voice engines, voice IDs, and the Claude model (Opus 5.5) as the source gives it (asked: 22 Oct 2026).
- Media placeholders: none on the pages; the author wants a finished page. The mini video lab and the SVG figures replace [VIDEO]/[SCREENSHOT] spots (asked: 22 Oct 2026).

## Outline
### Explainer
1. **Claude writes the rules, the renderer flips the pages** (idea): hero: a sheet of timed rules (accent) → a flipbook → a video file. Pitch + two lines.
2. **Why it matters**: a short video means a designer and editing software; one word change = re-edit by hand. Analogy: a hand-drawn flipbook vs one written as rules. Figure: a stack of pages being redrawn vs a rule sheet with one rule changed.
3. **How it works** (5 steps, each a figure):
   1. You describe the piece (request card with timings and exact words)
   2. Claude writes the rules (a rule sheet with times)
   3. You watch a rehearsal and give notes (preview with one note pinned)
   4. The renderer flips the pages (rules → row of pages → MP4)
   5. Change one rule, flip again (one rule highlighted, two identical rows of pages)
4. **See it in action**: the playable mini video lab (`flipbook-lab.tsx`: play, scrub, feel switch).
5. **Two tools to choose from**: Tiles: HyperFrames (a file to ship) vs Claude Motion (a link to share). Figure: flipbook → file vs browser → link.
6. **How to ask for a good video**: five habits in plain words. Figure: a vague request gives jumbled pages, a timed one gives pages in order.
7. **What it can't do**: not lifelike footage; checks pass ≠ good; last bit of a look doesn't come from words; no copying other brands; Motion: muted clips, one shape per film. Callout: a person approves before the final render.
8. **In one breath**.
9. **Going deeper**: link to tech.

### Tech
0. On this page
1. At a glance: stack, model (Claude Code with Opus 5.5), tools, license, requirements, cost, status, owner, source.
2. Architecture: diagram prompt → Claude Code + plugin router → workflow skill → composition (HTML + GSAP timelines) → lint/check → preview → render (headless Chrome + FFmpeg) → MP4/MOV/WebM. Comparison table HyperFrames vs Claude Motion.
3. Core mechanism: the six-part prompt skeleton (the one CodeBlock), beat formula, spec dial, vocabulary table, common rewrites. SubHeadings.
4. Key decisions and trade-offs: no custom skill (vs team skill); code-based vs generative video; HyperFrames vs Motion; local vs cloud render.
5. Evaluation: only HyperFrames' own reference-match figures (75%, 80–90%); not measured by us; lint/check ≠ good.
6. Limits and risks: rules that prevent broken renders + symptom table; Motion limits; copyright; CLI moves fast.
7. Run it yourself: setup, first video, CLI commands table, workflows table, references, iterating, audio, export table. SubHeadings.
8. Open questions / next steps: brand skill, sample library, re-check commands.
