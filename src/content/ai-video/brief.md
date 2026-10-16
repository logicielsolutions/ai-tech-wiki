# How AI makes video

A practical guide to AI video generation for engineers and the marketing team: how the models work, which one to pick for each job, what it costs, and how to prompt it. Recommendations only; the page says what is best now, not what has shut down or fallen behind.

Source shorthand used below:
- `[SRC]` AI Video Field Guide artifact (https://claude.ai/artifact/XyveCzoKR9DsVarFP6nssk), research compiled 13 Oct 2026 from vendor pricing pages, the Artificial Analysis Video Arena, Google's Veo 3.1 prompting guide, OpenAI's Sora 2 cookbook, Luma and Kling guides.
- `[USER]` the request that opened this entry (14 Oct 2026).

## Identity
- Slug: ai-video
- Title (2–5 words, the idea not the repo): Making video with AI (asked: 14 Oct 2026)
- One-line pitch (≤ 90 chars, for a non-tech reader): Which AI video tool to use for each job, what it costs, and how to prompt it. (asked: 14 Oct 2026)
- Tags (1–3): video (new shared tag) (asked: 14 Oct 2026)
- Status: production: a guide in use now (asked: 14 Oct 2026)
- Owner: AI Practice team (as on the evals entry)
- Source: AI Video Field Guide artifact [SRC]
- Last updated: 14 Oct 2026

## Readers
- Non-tech reader we picture: same readers as the previous entries: PMs, team leads, clients and marketing colleagues; no AI background (asked: 14 Oct 2026)
- What they should be able to say after the explainer: AI video starts from static and cleans it up step by step, guided by the prompt; pick the model by the job; start from a still image; write prompts like a shot list. [SRC]
- Engineer we picture: an engineer choosing a model and provider to build on or to support marketing. [USER]
- What they should be able to decide after the tech page: which model and which way to buy it (vendor plan vs pay-per-second API) for a given use case, roughly what it will cost, and how to structure prompts. [USER]

## The idea
- Problem it solves, as a situation: a shot that used to need a crew now takes a prompt, but there are dozens of tools, the best one changes every few months, and a vague prompt burns money on unusable clips (3–10 tries per keeper). [SRC]
- How it works, in plain steps [SRC]:
  1. The prompt is turned into numbers the model can read (text encoder).
  2. It starts from pure random static, in a compressed form about 8× smaller than the real video.
  3. It removes a little noise per step, 20–50 steps; early steps set composition and motion, later steps add detail. Every patch looks at every other patch across space and time, which keeps objects consistent.
  4. A decoder expands the clean result back into full frames.
  5. Out comes a 5–30 second clip, usually with sound. Longer videos are stitched shots.
- Why clips are short: compute grows with the square of the number of video patches; double the length, roughly 4× the compute. [SRC]
- Visual metaphor: a film set. You are the director, the prompt is your shot list, the model is the crew that films it. The denoising steps are the crew bringing a foggy set into focus, take by take. (asked: 14 Oct 2026)
- Worked example for "See it in action": denoising slider, 0→30 steps; a scene comes out of static. A toggle between two example prompts shows the same static resolving into a different shot. Labels: early steps set layout and motion, late steps add detail. Example drawing, labelled as an example. (asked: 14 Oct 2026)
- Interactive figure: yes. Denoising slider, example image drawn in the page, no API call. [USER]
- The one code snippet for the tech page: a structured (JSON) shot prompt, e.g. the product hero example. [SRC]

## The facts

### Best model per use case (recommendations, Oct 2026) [SRC]
| Use case | Pick | Runner-up | How |
|---|---|---|---|
| Realistic people / faces | Seedance 2.5 or MiniMax H3 | Veo 3.1 for the film look; Vidu Q4 for subtle facial acting | Make a still of the person first, then image-to-video; keep motion modest |
| Talking with dialogue | Vidu Q4 or Kling 3.0 Turbo | Veo 3.1; avatar tool (HeyGen) for anything over ~15s | ~2.5 words per second of clip; name the speaker the same way each time |
| Product shots | Seedance 2.5 | Veo 3.1 for hero beauty shots | Always image-to-video from a real product photo; add logo and packaging text in the edit |
| Anime / 2D | Seedance 2.0 / 2.5 | Kling 3.0, Midjourney | Lock a style frame and character turnaround first; Seedance keeps anime frame timing |
| 3D / Pixar look | Kling 3.0 or Seedance (image-to-video) | Luma Ray 3.14; Gemini Omni for claymation | Start from a 3D-style still; text-to-video drifts to photoreal |
| Action / physics | Veo 3.1 | Wan 3.0, Seedance 2.5 | Simplify the action, pin the last frame, cut away at impact |
| Text on screen | Add it in the edit | Google models if you must (unverified) | Every model garbles typography |
| Same character across shots | Seedance 2.5 (up to 50 references) | Kling 3.0 multi-shot, Vidu Q4 (15 refs), Veo Ingredients (3 refs) | Character sheet (front, 3/4, profile) in every shot; paste the same descriptor word for word |
| Longest single clip | Wan 3.0 (30s) | Seedance 2.5 (30s) | Can also take slides, PDFs and webpages as input |
| Cheapest decent | Vidu Q4 or MiniMax H3 | Wan 3.0 at 480p, Kling 3.0 Turbo | Draft cheap, re-render winners on a premium model |
| Self-host / open source | LTX-2.3 (Apache 2.0) | Wan 2.2 (runs on 8 GB VRAM) | Run in ComfyUI; train a LoRA on your product or character |
| Spokesperson / translation | HeyGen | Synthesia (corporate training) | Script + photo in, minutes of lip-synced video out; 175+ languages |
| UGC-style ad variants | Arcads | Captions, Creatify (from a product URL) | Test many hooks fast; disclose AI actors |
| Legally safest | Adobe Firefly | | Licensed training data, enterprise IP indemnity |

### Leaderboard (Artificial Analysis Video Arena v2.0, blind votes, Kling 3.0 pinned at 1000) [SRC]
Text-to-video: Wan 3.0 1156, Seedance 2.5 1143, MiniMax H3 1140, FLUX 3 1129, Seedance 2.0 1120, Gemini Omni Flash 1113.
Image-to-video: MiniMax H3 1131, Gemini Omni Flash 1130, Vidu Q4 1130, Seedance 2.5 1125, Wan 3.0 1118, Seedance 2.0 1114.
The #1 spot changed hands three times between Jul and Oct 2026: pick by use case and keep a fallback.

### Pricing (as of 13 Oct 2026; budget ~4× the per-clip price for retries) [SRC]
| Tool | Plans | Per second (API) | Official page |
|---|---|---|---|
| Google Veo 3.1 | AI Pro $19.99/mo, Ultra $99.99+ | $0.05–0.60/s (Lite → 4K) | https://ai.google.dev/gemini-api/docs/pricing |
| Kling 3.0 | Free daily credits, Std $8.80, Pro $32.56 | $0.07–0.14/s on fal | https://klingai.com |
| Seedance (Dreamina) | $18–84/mo | $0.02–0.25/s via hosts | https://dreamina.capcut.com |
| MiniMax / Hailuo | Free, Std $14.99, Pro $54.99 | $0.025–0.05/s on fal | https://hailuoai.video |
| Wan (Alibaba Model Studio) | API | $0.05 (480p) – $0.20/s (1080p) | https://www.alibabacloud.com/product/model-studio |
| Vidu Q4 | Web plans + API | from $0.014/s | https://www.vidu.com |
| Runway | Free 125 credits, Std $12, Pro $28, Max $76 | ~$0.29/s on Standard | https://runway.com/pricing |
| Luma | Plus $30, Pro $90, Ultra $300 | (unverified) | https://lumalabs.ai |
| LTX-2.3 | Free to self-host | $0.04/s fast on fal | https://ltx.video |
| Adobe Firefly | Free 25 credits, Std $9.99, Premium $199.99 | ~$0.10/s on Standard | https://www.adobe.com/products/firefly.html |
| Midjourney | Basic $10, Std $30, Pro $60 | ~$0.13–0.20 per 9s clip | https://www.midjourney.com |
| HeyGen | Free, Creator $29, Pro $99, Business $149 | API $0.05–0.10/s | https://www.heygen.com |
| Synthesia | Starter ~$168/yr, Creator ~$708/yr | ~$1.40–2/min | https://www.synthesia.io |
| Arcads | Lite $29, Starter $110 | ~$11 per finished ad | https://www.arcads.ai |
| fal.ai (aggregator) | Pay per second | $0.025 – $0.14/s | https://fal.ai/pricing |
| Replicate (aggregator) | Pay per second | ~$0.07–0.25/s | https://replicate.com |
| Krea (aggregator UI) | Free 100/day, Basic $9, Pro $35 | | https://www.krea.ai |
- Cheapest way to experiment: free tiers (Krea, Kling daily, HeyGen), then $10–20 on fal.ai running the same prompt through MiniMax H3 Turbo, LTX-2.3 Fast, Veo 3.1 Lite: $0.25–0.50 per 10-second clip. [SRC]
- Best setup for a marketing team: Google AI Pro/Ultra (Veo in Flow) for hero shots and b-roll, HeyGen for spokesperson and translated video, Kling 3.0 or Arcads for high-volume ad variants; Adobe Firefly where legal risk matters most. [SRC]
- Commercial-use traps: Kling Free and Pika Free/Starter forbid commercial use; most free tiers watermark; credits reset monthly with no rollover. [SRC]
- What a 30s ad costs: simple product spot ~3 tries per keeper, $15–40; branded social ad with VO and music 5–10 : 1, $50–200; traditional 30s production $2k–50k+. [SRC]

### Pricing check against official pages (14 Oct 2026, verification pass) — supersedes the table above where they differ
- Matches: Veo (ai.google.dev/gemini-api/docs/pricing; Lite 720p $0.05 – 4K $0.60/s); MiniMax/Hailuo (Std $14.99, Pro $54.99, Ultra $124.99; platform.minimax.io/docs/guides/pricing); Wan ($0.05–0.20/s, marked discounted; alibabacloud.com/help/en/model-studio/model-pricing); Luma ($30/$90/$300; lumalabs.ai/pricing); Firefly (Std $9.99, Pro $19.99, Pro Plus $49.99, Premium $199.99; adobe.com/products/firefly/plans.html); Midjourney ($10/$30/$60; docs.midjourney.com plan comparison); fal.ai ($0.025–0.14/s); Krea (Free/$9/$35/Max $105; krea.ai/pricing).
- Corrected: Runway $15/$35/$95 monthly ($12/$28/$76 billed yearly); LTX official API $0.03–0.34/s (docs.ltx.io/pricing); HeyGen Pro is $49 (heygen.com/pricing); Synthesia Starter $29 ($18 yearly), Pro $89 ($64 yearly), no "Creator" plan (synthesia.io/pricing); Replicate video $0.09–0.25/s (replicate.com/pricing).
- Not confirmable on an official page (marked † on the tech page): Kling plans (kling.ai/membership/membership-plan), Dreamina/Seedance plans (dreamina.capcut.com/ai-tool/pricing), Vidu API ($0.014/s not found; platform.vidu.com/docs/pricing), HeyGen API, Arcads (no official pricing page).
- Luma field guide URL returns 404; source link replaced with lumalabs.ai/learning-center.

### Prompting [SRC]
- Write a shot list, not a poem: physical facts of the shot (where the camera is, how it moves, where light comes from). "Epic", "8K masterpiece" do almost nothing.
- Anatomy, in the order Google recommends for Veo: shot + angle → camera move + pace → lens/focus → subject (3–5 fixed traits) → action in beats → setting textures → light sources → palette (3–5 colours) → style / film stock → dialogue → SFX / ambient / music. 60–150 words.
- Image-to-video: describe motion, not the picture; say what holds still; only ask for motion the frame supports; first/last frame: describe only what changes.
- Sound: one line per layer (Dialogue, SFX, Ambient, Music); ~2.5 spoken words per second; give delivery; music by genre and instrument, never a real song; dialogue after a colon with "(no subtitles)" to avoid burned-in captions.
- Consistency: character bible pasted word for word; reference sheet; fixed palette; lock the seed while tweaking; one change per retry; negative field on Kling, positive-only phrasing on Luma and Runway.
- Mistakes: adjectives instead of facts; three camera moves in one clip; re-describing the image; a whole story in 8 seconds; asking for text or logos; "no X" in the main prompt.
- Pro habits: lead with shot type; one camera move with its pace; mid-action verbs plus secondary motion (hair, fabric, dust); name a film stock; "static tripod shot" for stillness; prototype short and low-res; 3–4 variations per prompt.
- JSON prompts: no evidence models parse JSON; official guides say prose. They help because separate fields force you to be specific, are reusable and diffable. Keep JSON as source of truth, test it against a prose version.
- Model quirks: Veo 3.1 supports [00:00-00:02] timestamp shots, 4/6/8s clips, prone to burned-in subtitles; Kling 3.0 energetic by default, use the negative field, 2,500-char cap; Seedance: give every @Image1 an explicit role, number shots; Runway: explicit move names, 1,000-char cap; Luma: positive-only, present tense, ~100 words.
- Cinematography vocabulary: shot sizes, angles, camera moves, lenses, lighting, film looks (cheat sheet in [SRC]).

### Workflow [SRC]
Images first, then video: stills are 10–50× cheaper to iterate. Brief → script → shot list → keyframes (stills) → image-to-video → voiceover → music → lip sync → edit (text and logos here) → upscale → captions → export (master 9:16, reframe).

### Limits and risks [SRC]
- Known failure modes: hands; text and logos; physics; face changes between shots; morphing in fast motion; ignored prompts.
- Disclosure law: EU AI Act Art. 50 (since 2 Aug 2026), New York GBL §396-b synthetic performers in ads (since 9 Jun 2026); FTC bans AI people posing as real customers.
- Platform labels: Meta "AI Info", TikTok AIGC label, YouTube "Altered or synthetic".
- Copyright: purely AI-generated output can't be copyrighted in the US; protect the human work (script, edit, VO).
- Likeness: consent for custom avatars and voice clones.
- Prices and rankings change monthly.

### Excluded on request [USER]
Shut-down tools (Sora), "fallen behind" commentary, and 2026 "what changed" news cards stay off the page. Recommend what is best.

- Sources and links: vendor pricing pages above; Artificial Analysis video leaderboard https://artificialanalysis.ai/video/leaderboard/text-to-video; Google Veo 3.1 prompting guide https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-veo-3-1; Luma field guide https://lumalabs.ai/learning-center/articles/luma-video-models-field-guide. [SRC]

## Off the page
- Anything to leave out (asked: 14 Oct 2026): keep it as safe as possible. No real project or brand examples (drop the Kalshi ad breakdown and any brand-campaign stories); example products in prompts stay generic. Legal gets a very small mention only: one short callout (label AI people in ads, get consent for real likenesses, add real logos in the edit, check with legal), no law names, dates or fines. No shut-down tools or "fallen behind" commentary.
- Model names: this entry names models and vendors on both pages, an explicit exception to the "roles not model names" rule, because the entry's job is to recommend models [USER].

## Outline
### Explainer (reader: PMs, leads, clients, marketing; metaphor: film set)
1. **The one-line idea**: hero: a director's chair and clapperboard in front of a screen where a frame is half static, half sharp. Pitch underneath.
2. **Why it matters**: a shot that needed a crew now needs a paragraph, but dozens of tools, the best one changes every few months, and a vague request burns money: you throw away 3 to 10 tries for every clip you keep. Figure: a row of discarded takes and one kept take.
3. **How it works** (Steps, film-set metaphor):
   1. You hand over a shot list (the prompt): the model turns your words into numbers it can follow. Figure: shot-list card → crew.
   2. It starts from pure static, like a set covered in fog. Figure: static frame.
   3. It clears the fog a little at a time, 20 to 50 passes; first the layout and movement, then the detail. Figure: three frames, rough → sharp.
   4. It looks at the whole clip at once, so things stay the same from frame to frame; that's also why clips are short (double the length, about four times the work). Figure: frame strip with links, and a 5–15 second clip length bar.
   5. Out comes a short clip with sound; longer videos are short shots edited together. Figure: shots on a timeline.
4. **See it in action**: the denoising slider with two example prompts (example values only).
5. **Pick the right crew for the job**: use-case picker (faces, talking, product, anime, 3D, action, same character, cheapest, avatars), each with the pick in plain words. Approved addition for this entry; figure: the picker. (Kept on the explainer because the request asks for recommendations a marketing reader can use.)
6. **How to ask for a good shot**: shot list, not a poem; the slots in order; start from a still image; one camera move; say what stays still; a before/after prompt. Figure: weak prompt vs strong prompt side by side.
7. **What it can't do**: hands, readable text and logos, real physics, the same face across shots without help, long single takes; a person still picks takes and edits. Plus the tiny legal callout. Figure: a frame with the common flaws circled.
8. **In one breath**.
9. **Going deeper**: link to the tech view.

### Tech (reader: engineers)
0. **On this page**: PageIndex at the very top, before At a glance, listing At a glance and every section, with sub-headings as children (updated 14 Oct 2026 to follow the wiki-entry skill change in PR #8).
1. **At a glance**: DataTable: what it covers, top picks, typical clip length, typical cost, tries per keeper, status, owner, source.
2. **Architecture**: pipeline diagram (text encoder → latent noise → diffusion transformer ×20–50 → VAE decoder → clip + audio) and walkthrough; why clips are short (quadratic attention).
3. **Core mechanism**: generation modes (T2V, I2V, V2V, first/last frame, references, native audio, extend, upscale, LoRA); prompting anatomy; image-to-video rules; audio; consistency; model quirks table; JSON prompts and the one CodeBlock (product hero JSON).
4. **Key decisions and trade-offs**: best model per use case table (pick / runner-up / how) and leaderboard; decisions (image-first workflow, draft cheap + finals premium, API vs subscription, open vs closed).
5. **Evaluation**: leaderboard scores and how they're measured; known failure modes table with workarounds.
6. **Limits and risks**: failure modes, cost multiplier, commercial-use traps, prices change monthly, tiny legal note.
7. **Run it yourself**: pricing table with official links; cheapest way to experiment; recommended team setup; workflow from brief to export.
8. **Open questions / next steps**: rankings shift monthly, JSON vs prose untested, re-check prices before buying.
9. **Sources**: official vendor pages and guides.
