import type { ReactNode } from "react";
import {
  BulletList as List,
  Callout,
  Code,
  CodeBlock,
  DataTable,
  Figure,
  KeyNumber,
  KeyNumbers,
  PageIndex,
  Prose,
  Section,
  SubHeading as Sub,
} from "@/components/wiki";

const SNIPPET = `{
  "shot": "macro to medium, slow 180° orbit, 100mm macro lens, shallow depth of field",
  "subject": "matte black stainless water bottle, brushed steel cap, condensation beads on the surface",
  "action": "droplets slide down the bottle; at 5s a hand enters and twists the cap open, a puff of cold vapor escapes",
  "setting": "wet black slate surface, dark studio, thin layer of low fog",
  "lighting": "single overhead softbox key, two cool blue rim lights from behind, a specular highlight travels across the steel",
  "style": "premium commercial, high contrast, crisp product film",
  "palette": ["black", "graphite", "ice blue"],
  "audio": {
    "sfx": "soft droplet ticks, metallic cap twist, short hiss of vapor",
    "music": "minimal deep synth pulse",
    "dialogue": "none"
  },
  "constraints": "no text, no logos other than on the bottle, no people except one hand",
  "duration_s": 8,
  "aspect_ratio": "9:16"
}`;

function Ext({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
      {children}
    </a>
  );
}

/** Horizontal score bar for the leaderboard tables, scaled between 1000 and 1160. */
function Score({ value }: { value: number }) {
  const pct = Math.max(4, ((value - 1000) / 160) * 100);
  return (
    <span className="flex items-center justify-end gap-2">
      <span className="hidden h-2 w-24 overflow-hidden rounded-full bg-fill sm:block" aria-hidden="true">
        <span className="block h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
      </span>
      <span className="tabular-nums">{value}</span>
    </span>
  );
}

function PipelineDiagram() {
  const box = (x: number, w: number, label: string, sub: string, strong = false) => (
    <g key={label}>
      <rect x={x} y={70} width={w} height={64} rx={10} fill={strong ? "var(--color-accent-tint)" : "var(--color-page)"} />
      <text x={x + w / 2} y={97} textAnchor="middle" fontSize={13} fontFamily="var(--font-mono)" fill={strong ? "var(--color-accent)" : "var(--color-ink)"}>
        {label}
      </text>
      <text x={x + w / 2} y={118} textAnchor="middle" fontSize={12} fill="var(--color-muted)">
        {sub}
      </text>
    </g>
  );
  const arrow = (x1: number, x2: number) => (
    <path d={`M${x1} 102H${x2}m-6 -5l6 5l-6 5`} fill="none" stroke="var(--color-muted)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  );
  return (
    <svg
      viewBox="0 0 800 220"
      className="h-auto w-full min-w-[680px]"
      role="img"
      aria-label="Generation pipeline. Prompt and optional reference images go to a text encoder. Sampling starts from random noise in a compressed latent space. A diffusion transformer removes noise over 20 to 50 steps, conditioned on the encoded prompt. A VAE decoder expands the clean latent into frames. Out comes a 5 to 30 second clip, often with synchronized audio."
    >
      <text x={10} y={40} fontSize={13} fontWeight={600} fill="var(--color-muted)">
        Inside one generation call
      </text>
      {box(10, 130, "text encoder", "prompt → embeddings")}
      {arrow(140, 168)}
      {box(168, 130, "latent noise", "~8× smaller than pixels")}
      {arrow(298, 326)}
      {box(326, 170, "diffusion transformer", "× 20–50 denoising steps", true)}
      {arrow(496, 524)}
      {box(524, 120, "VAE decoder", "latent → frames")}
      {arrow(644, 672)}
      {box(672, 118, "clip + audio", "5–30 s")}
      <path d="M75 134V172H411V138" fill="none" stroke="var(--color-accent)" strokeWidth={1.5} strokeLinecap="round" strokeDasharray="4 5" />
      <text x={243} y={192} textAnchor="middle" fontSize={12} fill="var(--color-accent)">
        prompt conditions every step
      </text>
      <path d="M380 70C380 40 442 40 442 66" fill="none" stroke="var(--color-muted)" strokeWidth={1.5} strokeLinecap="round" />
      <text x={411} y={36} textAnchor="middle" fontSize={12} fill="var(--color-muted)">
        repeat
      </text>
    </svg>
  );
}

export default function Tech() {
  return (
    <>
      <Section id="glance" title="At a glance">
        <Prose>
          <p>
            This page is the working reference for AI video generation as of <strong>14 Oct 2026</strong>: how the models
            work, which model to use for which job, what it costs per second, and how to prompt. It recommends; it doesn&apos;t
            survey everything. Rankings and prices move monthly, so every price links to the vendor&apos;s own page.
          </p>
          <p>
            Short version: <strong>image-to-video beats text-to-video</strong> for anything that has to look like a specific
            product or person; <strong>pick the model per shot type</strong>, not per project; <strong>draft on a cheap model
            and re-render winners on a premium one</strong>; and <strong>add text and logos in post</strong>, always.
          </p>
        </Prose>
        <KeyNumbers>
          <KeyNumber value="5–15 s" label="Typical clip length; longer videos are stitched shots" />
          <KeyNumber value="3–10×" label="Generations per usable clip (tries per keeper)" />
          <KeyNumber value="2.5–60¢" label="Per second of output, cheap API to 4K premium" />
          <KeyNumber value="20–50" label="Denoising steps per generation" />
        </KeyNumbers>
        <DataTable
          stack
          columns={["", ""]}
          rows={[
            ["Covers", "Text-to-video, image-to-video, video-to-video, avatar (talking-head) tools, aggregator APIs"],
            ["Top text-to-video", "Wan 3.0, Seedance 2.5, MiniMax H3 (blind-vote leaderboard)"],
            ["Top image-to-video", "MiniMax H3, Gemini Omni Flash, Vidu Q4, Seedance 2.5"],
            ["Best open model", "LTX-2.3 (Apache 2.0, self-hostable, LoRA-trainable)"],
            ["Avatars / spokesperson", "HeyGen; Synthesia for corporate training"],
            ["Cheapest API access", "fal.ai pay-per-second, from $0.025/s (MiniMax H3 Turbo)"],
            ["Status", "Production guide, in use"],
            ["Owner", "AI Practice team"],
            ["Source", "AI Video Field Guide research, compiled 13 Oct 2026 from vendor pricing pages, the Artificial Analysis Video Arena and official prompting guides"],
          ]}
        />
      </Section>

      <PageIndex
        items={[
          { id: "architecture", title: "Architecture: what happens in one generation" },
          {
            id: "mechanism",
            title: "Core mechanism: inputs and prompts",
            children: [
              { id: "modes", title: "Generation modes" },
              { id: "anatomy", title: "Prompt anatomy" },
              { id: "i2v", title: "Image-to-video: describe motion, not the picture" },
              { id: "audio", title: "Native audio" },
              { id: "consistency", title: "Consistency across shots" },
              { id: "quirks", title: "Model quirks" },
              { id: "json", title: "JSON prompts" },
            ],
          },
          {
            id: "decisions",
            title: "Key decisions and trade-offs",
            children: [
              { id: "per-use-case", title: "Best model per use case" },
              { id: "tradeoffs", title: "Decisions" },
            ],
          },
          {
            id: "evaluation",
            title: "Evaluation: how the rankings are measured",
            children: [{ id: "failures", title: "Known failure modes" }],
          },
          { id: "limits", title: "Limits and risks" },
          {
            id: "run",
            title: "Run it yourself",
            children: [
              { id: "pricing", title: "Pricing" },
              { id: "setups", title: "Recommended setups" },
              { id: "workflow", title: "Workflow: brief to posted ad" },
              { id: "budget", title: "What a 30-second ad costs" },
            ],
          },
          { id: "next", title: "Open questions" },
          { id: "sources", title: "Sources" },
        ]}
      />

      <Section id="architecture" title="Architecture: what happens in one generation">
        <Figure caption="Every current video model follows this shape: encode the prompt, start from noise in a compressed latent space, denoise with a transformer over many steps, decode to frames." scroll>
          <PipelineDiagram />
        </Figure>
        <Prose>
          <ol className="flex list-decimal flex-col gap-2 pl-5">
            <li>
              <strong>Text encoder.</strong> A language model turns the prompt into embeddings the denoiser is conditioned on.
              Reference images (product shots, character sheets) are encoded alongside it on models that accept them.
            </li>
            <li>
              <strong>Latent noise.</strong> Sampling starts from pure Gaussian noise in a compressed latent grid, about 8×
              smaller than the real video. Working in latent space is what makes video affordable at all.
            </li>
            <li>
              <strong>Diffusion transformer (DiT).</strong> Removes a little noise per step, 20–50 steps. The video is cut into
              space-time patches, and every patch attends to every other patch across space <em>and</em> time, which is what
              keeps objects consistent through the clip. Early steps fix composition and motion; late steps add texture and
              detail. That&apos;s why the camera move and shot type in a prompt change everything, while style words only
              touch the finish.
            </li>
            <li>
              <strong>VAE decoder.</strong> Expands the clean latent back to full-resolution frames. Most outputs are 720p or
              1080p; many &ldquo;4K&rdquo; outputs are a separate upscale pass.
            </li>
            <li>
              <strong>Clip + audio.</strong> Most top models now generate dialogue, sound effects and music in the same pass,
              already in sync.
            </li>
          </ol>
        </Prose>
        <Callout kind="note" title="Why clips are short">
          <p>
            Attention cost grows with the square of the number of patches. Double the duration and compute roughly
            quadruples. That&apos;s why most clips are 5–15 seconds and the longest single generations top out around 30
            seconds (Wan 3.0, Seedance 2.5). Plan every piece as a shot list of 3–8 second shots and stitch in an editor.
          </p>
        </Callout>
      </Section>

      <Section id="mechanism" title="Core mechanism: inputs and prompts">
        <Sub id="modes">Generation modes</Sub>
        <DataTable
          stack
          columns={["Mode", "You give it", "Use it when"]}
          rows={[
            ["Text-to-video (T2V)", "A prompt", "Fast exploration; mood pieces. Least control."],
            ["Image-to-video (I2V)", "A first frame + a motion prompt", "The professional default: you control the look, the model adds motion."],
            ["First / last frame", "Start and end images", "You need a precise outcome (a pour that ends full, a door that ends open)."],
            ["Reference images", "Photos of a character, product or style", "Consistency across shots. Called Ingredients (Veo), Elements (Kling), @Image (Seedance)."],
            ["Video-to-video (V2V)", "An existing clip + a prompt", "Restyle real footage while keeping its motion (Runway Aleph, Luma Modify, Gemini Omni)."],
            ["Native audio", "Dialogue / SFX / music lines in the prompt", "Talking shots and sound-designed b-roll in one pass."],
            ["Motion brush", "A painted region + an arrow", "Only one part of the frame should move (Kling, Runway)."],
            ["Extend", "A finished clip", "Continue from the last frames. Quality degrades with each extension."],
            ["LoRA", "A small add-on trained on your images", "Open models only: lock a product or character on LTX-2.3 or Wan 2.2."],
          ]}
        />

        <Sub id="anatomy">Prompt anatomy</Sub>
        <Prose>
          <p>
            Every official guide (Google&apos;s Veo 3.1 guide, OpenAI&apos;s video cookbook, Kling, Runway, Luma) converges on
            the same slots. Write a shot list, not a poem: physical facts about camera, subject and light. In the order
            Google recommends for Veo:
          </p>
          <ol className="flex list-decimal flex-col gap-1 pl-5">
            <li>Shot size + angle</li>
            <li>Camera move + pace (one move)</li>
            <li>Lens / focus</li>
            <li>Subject, with 3–5 fixed traits</li>
            <li>Action, in beats</li>
            <li>Setting textures</li>
            <li>Light sources (where light comes from, not &ldquo;beautiful lighting&rdquo;)</li>
            <li>Palette, 3–5 colors</li>
            <li>Style / film stock</li>
            <li>Dialogue</li>
            <li>SFX · Ambient · Music</li>
          </ol>
          <p>
            Aim for <strong>60–150 words</strong>. Kling and Luma both report that focused prompts beat maxed-out ones, and
            some tools cap length (Runway 1,000 characters, Kling 2,500).
          </p>
        </Prose>
        <DataTable
          stack
          columns={["Slot", "Words that work"]}
          rows={[
            ["Shot size", "extreme close-up · close-up · medium close-up · wide · establishing · over-the-shoulder · POV · insert"],
            ["Camera move", "static tripod (say it, or models add drift) · dolly in/out · truck · pan/tilt · orbit · crane · tracking · handheld · FPV drone · rack focus · crash zoom"],
            ["Lens", "14–24mm wide · 35mm storytelling default · 50mm natural · 85mm portrait bokeh · macro · anamorphic"],
            ["Lighting", "golden hour · blue hour · softbox key · rim light · hard light · low-key · high-key · practicals · volumetric haze"],
            ["Film look", "35mm grain · 16mm · Kodak Portra 400 · CineStill 800T · teal & orange · bleach bypass"],
          ]}
        />

        <Sub id="i2v">Image-to-video: describe motion, not the picture</Sub>
        <Prose>
          <List>
            <li>The image already fixes subject, light and style. Delete every sentence that describes what&apos;s visible (Runway&apos;s rule).</li>
            <li>Lead with motion and camera: &ldquo;she turns toward the window, slow push-in, hair lifting in the breeze&rdquo;.</li>
            <li>Say what holds still: &ldquo;camera stays locked while steam rises&rdquo;.</li>
            <li>Only ask for motion the frame supports: no full-body dance from a headshot.</li>
            <li>First/last frame: describe only what changes between the two.</li>
          </List>
        </Prose>

        <Sub id="audio">Native audio</Sub>
        <Prose>
          <List>
            <li>One line per layer: <Code>Dialogue</Code>, <Code>SFX:</Code>, <Code>Ambient:</Code>, <Code>Music:</Code>.</li>
            <li>About 2.5 spoken words per second of clip. An 8 s clip fits one or two short lines.</li>
            <li>Name the speaker the same way every time so the line lands on the right mouth; give delivery (&ldquo;whispers, nervous&rdquo;).</li>
            <li>
              Write dialogue after a colon without quotes, followed by &ldquo;(no subtitles)&rdquo;. Quotes can make Veo burn
              the line in as captions. Google&apos;s own examples use quotes, so test both.
            </li>
            <li>Music by genre and instrument, never a real song or artist. Adding your own track later? <Code>Music: none</Code>.</li>
          </List>
        </Prose>

        <Sub id="consistency">Consistency across shots</Sub>
        <Prose>
          <List>
            <li><strong>Character bible:</strong> one fixed descriptor string per character, pasted word for word into every shot. Paraphrasing gives you a new face.</li>
            <li><strong>Reference sheet:</strong> front, 3/4 and profile on a neutral background, attached to every shot.</li>
            <li><strong>Fixed palette:</strong> the same 3–5 colors named in every shot.</li>
            <li><strong>Seeds:</strong> lock the seed while you tweak wording. A seed does not carry a character across different prompts.</li>
            <li><strong>One change per retry</strong>, so you know what fixed it.</li>
            <li><strong>Negatives:</strong> Kling has a negative field (&ldquo;camera drift, facial warping, extra fingers, subtitles&rdquo;). Elsewhere, phrase positively: &ldquo;no X&rdquo; in the main prompt can summon X.</li>
          </List>
        </Prose>

        <Sub id="quirks">Model quirks</Sub>
        <DataTable
          stack
          columns={["Model", "What to know"]}
          rows={[
            ["Veo 3.1", "Best all-round prompt adherence. Supports [00:00-00:02] timestamped shots in one prompt, first/last frame, Ingredients (3 refs) and Extend. Clips are 4, 6 or 8 s. Prone to burned-in subtitles on dialogue."],
            ["Kling 3.0", "Energetic by default and drifts unless constrained: use the negative field. Built-in multi-shot storyboard and motion brush. 2,500-character cap."],
            ["Seedance 2.x", "Takes many references (images, video, audio). Give every @Image1 an explicit role (\"@Image1 is the product\"). Number shots \"Shot 1 / Shot 2\"."],
            ["Runway Gen-4.5", "Strong image-to-video and camera control. Positive phrasing, explicit move names. 1,000-character cap."],
            ["Luma Ray 3.x", "Positive-only, present tense, ~100 words. \"Vibrant\" or \"hyper-realistic\" can make output worse."],
          ]}
        />

        <Sub id="json">JSON prompts</Sub>
        <Prose>
          <p>
            A JSON prompt is the shot description written as an object (<Code>shot</Code>, <Code>subject</Code>,{" "}
            <Code>action</Code>, <Code>audio</Code>…) and pasted into the prompt box as text. There is no evidence models parse
            it as structure: neither Google nor OpenAI documents a schema, and both guides say write prose. It still earns its
            place because separate fields force specificity, an empty field shows what you forgot, a <Code>subject</Code>{" "}
            block can be pasted into every shot, one field can change per retry, and prompts can be generated from a sheet or
            an LLM. Keep JSON as your source of truth, test it against an LLM-flattened prose version on your model, and keep
            whichever wins. Watch character caps: braces cost characters.
          </p>
        </Prose>
        <CodeBlock title="product-hero.json: one 8 s image-to-video shot" code={SNIPPET} />
      </Section>

      <Section id="decisions" title="Key decisions and trade-offs">
        <Sub id="per-use-case">Best model per use case</Sub>
        <DataTable
          stack
          columns={["Use case", "Pick", "Runner-up", "How"]}
          rows={[
            ["Realistic people / faces", "Seedance 2.5 or MiniMax H3", "Veo 3.1 (film look); Vidu Q4 (subtle facial acting)", "Still of the person first, then I2V; keep motion modest"],
            ["Talking with dialogue", "Vidu Q4 or Kling 3.0 Turbo", "Veo 3.1; HeyGen past ~15 s", "~2.5 words/s; same speaker name every time"],
            ["Product shots", "Seedance 2.5", "Veo 3.1 for hero beauty shots", "Always I2V from a real product photo; logo and label in post"],
            ["Anime / 2D", "Seedance 2.0 / 2.5", "Kling 3.0, Midjourney", "Lock a style frame + character turnaround first; keeps anime frame timing"],
            ["3D / Pixar look", "Kling 3.0 or Seedance (I2V)", "Luma Ray 3.14; Gemini Omni for claymation", "Start from a 3D-style still; T2V drifts to photoreal"],
            ["Action / physics", "Veo 3.1", "Wan 3.0, Seedance 2.5", "Simplify the action, pin the last frame, cut at impact"],
            ["Same character across shots", "Seedance 2.5 (up to 50 refs)", "Kling 3.0 multi-shot, Vidu Q4 (15 refs), Veo Ingredients (3)", "Character sheet + verbatim descriptor in every shot"],
            ["Longest single clip", "Wan 3.0 (30 s)", "Seedance 2.5 (30 s)", "Wan also takes slides, PDFs and web pages as input"],
            ["Cheapest decent", "Vidu Q4 or MiniMax H3", "Wan 3.0 at 480p, Kling 3.0 Turbo", "Draft cheap, re-render winners on premium"],
            ["Self-host / open source", "LTX-2.3 (Apache 2.0)", "Wan 2.2 (runs on 8 GB VRAM)", "ComfyUI; train a LoRA on the product or character"],
            ["Spokesperson / translation", "HeyGen", "Synthesia (training, internal comms)", "Script + photo → minutes of lip-synced video; 175+ languages"],
            ["UGC-style ad variants", "Arcads", "Creatify (from a product URL)", "Test many hooks fast; disclose AI actors"],
            ["Lowest legal risk", "Adobe Firefly", "", "Licensed training data, enterprise IP indemnity"],
            ["Text on screen", "Add it in post", "", "Every model still garbles typography"],
          ]}
        />
        <Sub id="tradeoffs">Decisions</Sub>
        <DataTable
          stack
          columns={["Decision", "Reason", "Rejected alternative"]}
          rows={[
            ["Generate stills first, then animate (I2V)", "Stills are 10–50× cheaper to iterate; the approved frame pins product, face and style", "Text-to-video straight from the brief: cheaper per step, but the look drifts and retries are costly"],
            ["Draft on fast/cheap models, final on premium", "Most generations are thrown away; pay premium only for keepers", "Premium for every take: same keepers, several times the bill"],
            ["Pick the model per shot, keep a fallback", "The #1 spot on the blind leaderboard changed hands three times between Jul and Oct 2026", "One vendor for everything: simpler billing, weaker shots"],
            ["Pay-per-second API (fal.ai) for engineering; subscriptions for the creative team", "API: no seat cost, all models, new releases fast. Subscriptions: a UI and editing tools", "API only for marketers (no UI); subscriptions only for engineers (credits expire monthly)"],
            ["Avatar tool for talking heads over ~15 s", "Generalist clips cap at 8–30 s; avatar tools do minutes with lip sync and translation", "Stitching generalist dialogue clips: faces and voice drift between shots"],
            ["Text, logos and UI composited in the edit", "Every model garbles glyphs; latent compression wipes out fine detail", "Prompting for exact text: random failures, can't ship"],
            ["Open model (LTX-2.3) only when self-hosting or LoRA is required", "Apache 2.0 and trainable, but below closed models on realism", "Open by default: more control, worse shots"],
          ]}
        />
      </Section>

      <Section id="evaluation" title="Evaluation: how the rankings are measured">
        <Prose>
          <p>
            Rankings come from the{" "}
            <Ext href="https://artificialanalysis.ai/video/leaderboard/text-to-video">Artificial Analysis Video Arena</Ext>{" "}
            (v2.0): people are shown two clips from the same prompt, without model names, and vote for the better one. Votes
            become Elo-style scores, pinned so <strong>Kling 3.0 = 1000</strong>. A 30-point gap is a clear preference; a few
            points is noise. Snapshot from 13 Oct 2026; text-to-video scores are with audio.
          </p>
        </Prose>
        <div className="grid gap-6 md:grid-cols-2">
          <DataTable
            caption="Text-to-video"
            columns={["Model", "Maker", "Score"]}
            numeric={[2]}
            rows={[
              ["Wan 3.0", "Alibaba", <Score key="w" value={1156} />],
              ["Seedance 2.5", "ByteDance", <Score key="s" value={1143} />],
              ["MiniMax H3", "MiniMax", <Score key="m" value={1140} />],
              ["FLUX 3", "Black Forest Labs", <Score key="f" value={1129} />],
              ["Seedance 2.0", "ByteDance", <Score key="s2" value={1120} />],
              ["Gemini Omni Flash", "Google", <Score key="g" value={1113} />],
            ]}
          />
          <DataTable
            caption="Image-to-video"
            columns={["Model", "Maker", "Score"]}
            numeric={[2]}
            rows={[
              ["MiniMax H3", "MiniMax", <Score key="m" value={1131} />],
              ["Gemini Omni Flash", "Google", <Score key="g" value={1130} />],
              ["Vidu Q4", "ShengShu", <Score key="v" value={1130} />],
              ["Seedance 2.5", "ByteDance", <Score key="s" value={1125} />],
              ["Wan 3.0", "Alibaba", <Score key="w" value={1118} />],
              ["Seedance 2.0", "ByteDance", <Score key="s2" value={1114} />],
            ]}
          />
        </div>
        <Prose>
          <p>
            Arena scores measure general preference on generic prompts. They don&apos;t measure your use case: prompt
            adherence, a specific product&apos;s accuracy, or anime frame timing. That&apos;s why the per-use-case table above
            doesn&apos;t simply follow the leaderboard (Veo 3.1 isn&apos;t top-ranked but is still the pick for physics and
            cinematic realism). Before committing, run 5–10 of your own shots through the top two candidates and count tries
            per keeper.
          </p>
        </Prose>
        <Sub id="failures">Known failure modes</Sub>
        <DataTable
          stack
          columns={["Problem", "Why", "Workaround"]}
          rows={[
            ["Hands", "Small, complex, often occluded", "Frame them out or keep them still; more takes; inpaint"],
            ["Text and logos", "Latent compression wipes out fine glyph detail", "Composite in post. Always."],
            ["Physics", "Learns how things look, not how they behave", "Simplify the action, pin the end frame, cut away at impact"],
            ["Face changes between shots", "Each shot is generated independently", "Reference images every shot; I2V from a locked still"],
            ["Morphing in fast motion", "Large inter-frame motion is under-constrained", "Slower, explicitly named camera moves; motion brush"],
            ["Prompt ignored", "Weak conditioning or an overlong prompt", "60–150 words, structured slots, prefer I2V"],
            ["Flicker, background \"boiling\"", "Detail re-sampled frame to frame", "Simpler backgrounds, static camera, upscale pass to clean up"],
          ]}
        />
      </Section>

      <Section id="limits" title="Limits and risks">
        <Prose>
          <List>
            <li>
              <strong>Cost multiplier.</strong> Budget about 4–5× the raw per-second price once retries are counted, and
              generate 1.5–2× the footage you need. Most time goes into picking and editing, not generating.
            </li>
            <li>
              <strong>Commercial-use terms.</strong> Kling&apos;s free tier and Pika&apos;s free and Starter tiers forbid
              commercial use. Most free tiers watermark. Credits on Runway, Kling, Krea, Pika and Firefly reset monthly with no
              rollover. Save a dated copy of the terms for every tool in the chain.
            </li>
            <li>
              <strong>Open-weight licences differ.</strong> LTX-2.3 is Apache 2.0. MiniMax H3&apos;s open weights (768p) carry
              a licence that bans local use in the US, EU, UK and South Korea; use its API instead.
            </li>
            <li>
              <strong>Volatility.</strong> The leaderboard leader changed three times in four months and prices change
              monthly. Wrap generation behind one internal interface so the model is a config change, not a rewrite.
            </li>
            <li>
              <strong>Resolution.</strong> Most outputs are 720p–1080p; plan an upscale pass for 4K delivery.
            </li>
          </List>
        </Prose>
        <Callout kind="warning" title="Before anything ships">
          <p>
            Label realistic AI people as AI-made on every platform, use real people&apos;s likeness or voice only with signed
            consent, composite real logos rather than generating them, and check with legal before paid use.
          </p>
        </Callout>
      </Section>

      <Section id="run" title="Run it yourself">
        <Sub id="pricing">Pricing</Sub>
        <Prose>
          <p>
            List prices per month unless noted; API prices are per second of output. Budget about 4× the per-clip price for
            retries.
          </p>
        </Prose>
        <DataTable
          stack
          columns={["Tool", "Best for", "Plans (list price, per month)", "API / per second", "Official page"]}
          rows={[
            ["Google Veo 3.1", "Cinematic realism, physics, dialogue", "Google AI Pro $19.99, Ultra from $99.99", "$0.05 (Lite, 720p) – $0.60 (4K)", <Ext key="veo" href="https://ai.google.dev/gemini-api/docs/pricing">Gemini API pricing</Ext>],
            ["Seedance (ByteDance)", "Product, anime, many references", "Dreamina plans, roughly $15–85 †", "BytePlus ModelArk API †", <Ext key="sd" href="https://dreamina.capcut.com/ai-tool/pricing">Dreamina pricing</Ext>],
            ["MiniMax H3 / Hailuo", "Best quality per dollar; #1 image-to-video", "Free, Standard $14.99, Pro $54.99, Ultra $124.99", "$0.025–0.05 on fal", <Ext key="mm" href="https://platform.minimax.io/docs/guides/pricing">MiniMax API pricing</Ext>],
            ["Kling 3.0", "Value, human motion, multi-shot", "Free daily credits, Standard ~$8.80, Pro ~$32.56 †", "$0.07–0.14 on fal", <Ext key="kl" href="https://kling.ai/membership/membership-plan">Kling plans</Ext>],
            ["Wan 3.0 (Alibaba)", "Longest clips (30 s)", "API only", "$0.05 (480p) – $0.20 (1080p), currently discounted", <Ext key="wan" href="https://www.alibabacloud.com/help/en/model-studio/model-pricing">Model Studio pricing</Ext>],
            ["Vidu Q4", "Facial acting, very cheap", "Web plans + API", "Among the cheapest †", <Ext key="vidu" href="https://platform.vidu.com/docs/pricing">Vidu API pricing</Ext>],
            ["Runway", "Director control, restyling footage", "Free 125 credits; Standard $15, Pro $35, Max $95 ($12 / $28 / $76 billed yearly)", "", <Ext key="rw" href="https://runway.com/pricing">Runway pricing</Ext>],
            ["Luma", "HDR cinematic, video-to-video", "Plus $30, Pro $90, Ultra $300", "", <Ext key="luma" href="https://lumalabs.ai/pricing">Luma pricing</Ext>],
            ["LTX-2.3", "Open source, self-host, LoRA", "Free to self-host (Apache 2.0)", "$0.03–0.34 official API", <Ext key="ltx" href="https://docs.ltx.io/pricing">LTX API pricing</Ext>],
            ["Adobe Firefly", "Lowest legal risk (IP indemnity)", "Standard $9.99, Pro $19.99, Pro Plus $49.99, Premium $199.99", "", <Ext key="ff" href="https://www.adobe.com/products/firefly/plans.html">Firefly plans</Ext>],
            ["Midjourney", "Animating aesthetic stills", "Basic $10, Standard $30, Pro $60", "No API", <Ext key="mj" href="https://docs.midjourney.com/hc/en-us/articles/27870484040333-Comparing-Midjourney-Plans">Midjourney plans</Ext>],
            ["HeyGen", "Spokesperson, translation", "Free, Creator $29, Pro $49, Business $149", "API priced separately †", <Ext key="hg" href="https://www.heygen.com/pricing">HeyGen pricing</Ext>],
            ["Synthesia", "Training, internal comms", "Starter $29 ($18 yearly), Pro $89 ($64 yearly)", "", <Ext key="sy" href="https://www.synthesia.io/pricing">Synthesia pricing</Ext>],
            ["Arcads", "UGC-style ad variants", "Not published on an official page †", "", <Ext key="ar" href="https://www.arcads.ai">Arcads</Ext>],
            ["fal.ai", "One API for most models", "Pay per second, no plan", "$0.025–0.14 by model", <Ext key="fal" href="https://fal.ai/pricing">fal.ai pricing</Ext>],
            ["Replicate", "Hosting open-weight models", "Pay per second, no plan", "~$0.09–0.25", <Ext key="rep" href="https://replicate.com/pricing">Replicate pricing</Ext>],
            ["Krea", "Trying many models in one UI", "Free, Basic $9, Pro $35, Max $105", "", <Ext key="kr" href="https://www.krea.ai/pricing">Krea pricing</Ext>],
          ]}
        />
        <Prose>
          <p className="text-sm text-muted">
            Checked against each vendor&apos;s page on 14 Oct 2026. † The vendor page loads its prices in the browser or
            doesn&apos;t publish them, so the figure couldn&apos;t be confirmed; open the link before quoting it. Several vendors
            run temporary promotions below these list prices.
          </p>
        </Prose>

        <Sub id="setups">Recommended setups</Sub>
        <div className="grid gap-3 md:grid-cols-3">
          <Callout kind="note" title="Experiment for under $20">
            <p>
              Start on free tiers (Krea, Kling daily credits, HeyGen). Then put $10–20 on fal.ai and run the same prompt
              through MiniMax H3 Turbo ($0.025/s), LTX-2.3 Fast ($0.04/s) and Veo 3.1 Lite ($0.05/s): $0.25–0.50 per 10 s clip,
              no subscription.
            </p>
          </Callout>
          <Callout kind="note" title="Marketing team">
            <p>
              Google AI Pro/Ultra (Veo in Flow) for hero shots and b-roll, HeyGen for spokesperson and translated videos, and
              Kling 3.0 or Arcads for high-volume ad variants. Adobe Firefly where legal risk matters most.
            </p>
          </Callout>
          <Callout kind="note" title="Engineering integration">
            <p>
              fal.ai (or Replicate) behind one internal interface: model id, prompt, reference images, duration, aspect ratio
              in; clip URL out. Swap models by config as the rankings move. Self-host LTX-2.3 in ComfyUI only if you need a
              LoRA or on-prem.
            </p>
          </Callout>
        </div>

        <Sub id="workflow">Workflow: brief to posted ad</Sub>
        <DataTable
          stack
          columns={["Stage", "Tools", "Notes"]}
          rows={[
            ["Brief", "Doc template + an LLM", "Audience, one message, CTA, platform, length, mandatory brand assets. A loose brief is the top cause of wasted generations."],
            ["Script", "LLM, then a human edit", "Hook in the first 1–3 s. Voiceover ~2.5 words/s, so ~70–75 words for 30 s."],
            ["Shot list", "LLM, one row per shot", "Subject, action, camera move, lens, light, duration; shots 3–8 s. Each row becomes one prompt."],
            ["Keyframes", "Nano Banana Pro, Midjourney, GPT Image, Flux", "Lock the look on cheap stills before paying for motion."],
            ["Image-to-video", "Veo 3.1, Kling 3.0, Seedance, MiniMax H3", "Animate approved frames. Draft fast/cheap, re-render winners on premium."],
            ["Voice + music", "ElevenLabs, ElevenLabs Music", "Stock voices or consented clones; music trained on licensed data."],
            ["Lip sync", "Sync Labs, HeyGen", "Skip when native dialogue is good enough."],
            ["Edit", "CapCut, Premiere, DaVinci Resolve", "Pacing, sound and the cut are human work. Text and logos go on here."],
            ["Upscale", "Topaz", "720p/1080p → 4K, also cleans AI softness."],
            ["Captions + export", "CapCut, Descript, editor presets", "Most people watch muted. Master 9:16, reframe to 4:5, 1:1, 16:9."],
          ]}
        />

        <Sub id="budget">What a 30-second ad costs</Sub>
        <DataTable
          columns={["Scenario", "Tries per keeper", "Generation cost", "People time"]}
          numeric={[1, 2]}
          rows={[
            ["Simple product spot (~6 shots from one photo)", "~3 : 1", "$15–40", "0.5–1 day"],
            ["Branded social ad with VO and music", "5–10 : 1", "$50–200", "1–2 days"],
            ["Traditional 30 s production, for comparison", "n/a", "$2k–50k+", "2–6 weeks"],
          ]}
        />
        <Prose>
          <p>
            Iterate efficiently: lock the keyframe before any video generation, batch 3–4 variations per shot, change one
            variable per retry, and cap at about 8 retries per shot. Still failing? Rewrite the shot or cover it with a
            cutaway.
          </p>
        </Prose>
      </Section>

      <Section id="next" title="Open questions">
        <Prose>
          <List>
            <li>Rankings and prices shift monthly. This page needs a re-check each quarter, or whenever a major model ships.</li>
            <li>JSON vs prose prompts: nobody has published a controlled comparison. Worth testing on our own shots.</li>
            <li>We have no in-house tries-per-keeper numbers yet; the ratios above come from published workflows.</li>
            <li>Prices marked † in the pricing table couldn&apos;t be confirmed on the vendor&apos;s own page.</li>
          </List>
        </Prose>
      </Section>

      <Section id="sources" title="Sources">
        <Prose>
          <List>
            <li><Ext href="https://artificialanalysis.ai/video/leaderboard/text-to-video">Artificial Analysis video leaderboard</Ext></li>
            <li><Ext href="https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-veo-3-1">Google Cloud: Ultimate prompting guide for Veo 3.1</Ext></li>
            <li><Ext href="https://lumalabs.ai/learning-center">Luma learning center</Ext></li>
            <li><Ext href="https://ai.google.dev/gemini-api/docs/pricing">Gemini API pricing (Veo)</Ext></li>
            <li><Ext href="https://runway.com/pricing">Runway pricing</Ext></li>
            <li><Ext href="https://fal.ai/pricing">fal.ai pricing</Ext></li>
            <li>Vendor pages linked in the pricing table above</li>
          </List>
        </Prose>
      </Section>
    </>
  );
}
