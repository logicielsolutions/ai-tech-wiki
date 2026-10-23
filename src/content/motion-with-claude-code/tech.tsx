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

const SNIPPET = `[route]      /motion-graphics
[spec]       8-second 1080x1920 video.
[beats]      Beat 1 (0-3s): ...  Beat 2 (3-5s): ...  Beat 3 (5-8s): ...
[copy]       the exact on-screen text, quoted
[technique]  Adapt the \`code-typing\` registry block.
[negatives]  No narration, no image or media files.`;

function Ext({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
      {children}
    </a>
  );
}

function PipelineDiagram() {
  const box = (x: number, y: number, w: number, label: string, sub: string, strong = false) => (
    <g key={label}>
      <rect x={x} y={y} width={w} height={64} rx={10} fill={strong ? "var(--color-accent-tint)" : "var(--color-page)"} />
      <text x={x + w / 2} y={y + 27} textAnchor="middle" fontSize={13} fontFamily="var(--font-mono)" fill={strong ? "var(--color-accent)" : "var(--color-ink)"}>
        {label}
      </text>
      <text x={x + w / 2} y={y + 48} textAnchor="middle" fontSize={12} fill="var(--color-muted)">
        {sub}
      </text>
    </g>
  );
  const arrow = (x1: number, x2: number, y: number) => (
    <path d={`M${x1} ${y}H${x2}m-6 -5l6 5l-6 5`} fill="none" stroke="var(--color-muted)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  );
  return (
    <svg
      viewBox="0 0 800 300"
      className="h-auto w-full min-w-[680px]"
      role="img"
      aria-label="HyperFrames pipeline. A prompt goes to the plugin router in Claude Code, which picks a workflow skill. The workflow writes a composition: HTML with seekable GSAP timelines. Lint and check validate it, a live preview runs it, and after your approval the renderer seeks every frame in headless Chrome and encodes with FFmpeg to MP4, MOV or WebM. Notes loop back from the preview to the composition."
    >
      <text x={10} y={30} fontSize={13} fontWeight={600} fill="var(--color-muted)">
        One HyperFrames job in Claude Code
      </text>
      {box(10, 50, 130, "prompt", "beats, copy, spec")}
      {arrow(140, 166, 82)}
      {box(166, 50, 150, "/hyperframes", "router picks a workflow")}
      {arrow(316, 342, 82)}
      {box(342, 50, 170, "composition", "HTML + GSAP timelines", true)}
      {arrow(512, 538, 82)}
      {box(538, 50, 120, "lint / check", "structure, runtime")}
      {arrow(658, 684, 82)}
      {box(684, 50, 106, "preview", "same runtime")}
      <path d="M737 114V150" fill="none" stroke="var(--color-muted)" strokeWidth={1.5} strokeLinecap="round" />
      <path d="M737 150m-5 -6l5 6l5 -6" fill="none" stroke="var(--color-muted)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <text x={746} y={138} fontSize={12} fill="var(--color-muted)">
        approve
      </text>
      {box(560, 156, 230, "render", "headless Chrome seeks each frame")}
      <path d="M560 188H534" fill="none" stroke="var(--color-muted)" strokeWidth={1.5} strokeLinecap="round" />
      <path d="M534 188m6 -5l-6 5l6 5" fill="none" stroke="var(--color-muted)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      {box(364, 156, 170, "FFmpeg", "MP4 · MOV · WebM · PNG")}
      <path d="M720 50C720 18 427 18 427 46" fill="none" stroke="var(--color-accent)" strokeWidth={1.5} strokeLinecap="round" strokeDasharray="4 5" />
      <text x={574} y={16} textAnchor="middle" fontSize={12} fill="var(--color-accent)">
        notes, one change per round
      </text>
      <text x={10} y={262} fontSize={12} fill="var(--color-muted)">
        Deterministic: every frame is a function of time, so the same composition renders the same frames every run.
      </text>
    </svg>
  );
}

export default function Tech() {
  return (
    <>
      <PageIndex
        items={[
          { id: "glance", title: "At a glance" },
          { id: "architecture", title: "Architecture: from prompt to MP4" },
          {
            id: "mechanism",
            title: "Core mechanism: the prompt",
            children: [
              { id: "skeleton", title: "The six-part skeleton" },
              { id: "beats", title: "The beat formula" },
              { id: "dial", title: "The specification dial" },
              { id: "vocabulary", title: "Words that map to settings" },
              { id: "rewrites", title: "Common rewrites" },
              { id: "motion-prompts", title: "Prompting Claude Motion" },
            ],
          },
          { id: "decisions", title: "Key decisions and trade-offs" },
          { id: "evaluation", title: "Evaluation: matching a reference" },
          {
            id: "limits",
            title: "Limits and risks",
            children: [
              { id: "rules", title: "Rules that prevent broken renders" },
              { id: "symptoms", title: "Symptom to cause" },
            ],
          },
          {
            id: "run",
            title: "Run it yourself",
            children: [
              { id: "setup", title: "Setup" },
              { id: "first", title: "Your first video" },
              { id: "cli", title: "CLI commands" },
              { id: "workflows", title: "Workflows" },
              { id: "references", title: "References" },
              { id: "iterating", title: "Iterating" },
              { id: "audio", title: "Voiceover, music, captions" },
              { id: "export", title: "Export" },
              { id: "claude-motion", title: "Claude Motion workflow" },
            ],
          },
          { id: "next", title: "Open questions" },
        ]}
      />

      <Section id="glance" title="At a glance">
        <Prose>
          <p>
            Claude can make motion graphics and short videos by writing code: HTML, CSS and animation that a renderer turns
            into frames. Two ways to do it: <strong>HyperFrames</strong>, an open-source framework with an official Claude
            Code plugin, and <strong>Claude Motion</strong>, an artifact type built into claude.ai.
          </p>
          <p>
            <strong>No custom skill is needed.</strong> The HyperFrames plugin ships 21 skills (a router plus workflows),
            and Claude Motion needs no setup. This page teaches install and prompting. Checked against HyperFrames plugin
            v0.8.181 on 22 Oct 2026.
          </p>
        </Prose>
        <DataTable
          columns={["", "Detail"]}
          rows={[
            ["Agent", "Claude Code with Opus 5.5"],
            ["Tools", <>HyperFrames (HeyGen, Apache-2.0) via the <Code>hyperframes@hyperframes</Code> plugin; Claude Motion (claude.ai artifact type, Beta)</>],
            ["Render stack", "HTML compositions with seekable GSAP timelines, rendered by headless Chrome + FFmpeg"],
            ["Requirements", "Node.js 22+, FFmpeg; Claude Motion needs nothing"],
            ["Cost", "HyperFrames is free and local rendering uses no HeyGen credits; optional hosted voice and media providers cost extra. Claude Motion is included in normal Claude plan usage."],
            ["Output", "HyperFrames: editable project folder + MP4 / MOV / WebM / PNG sequence. Claude Motion: shareable link + MP4 export"],
            ["Status", "Experiment"],
            ["Owner", "AI Practice team"],
          ]}
        />
        <KeyNumbers>
          <KeyNumber value="21" label="skills in the HyperFrames plugin" />
          <KeyNumber value="9" label="workflows the router can pick" />
          <KeyNumber value="1920×1080" label="default output, at 30fps" />
          <KeyNumber value="300 s" label="longest Claude Motion film" />
        </KeyNumbers>
      </Section>

      <Section id="architecture" title="Architecture: from prompt to MP4">
        <Figure scroll caption="One HyperFrames job. Rendering waits for your approval by design; notes from the preview go back into the same composition.">
          <PipelineDiagram />
        </Figure>
        <Prose>
          <p>
            The router (<Code>/hyperframes:hyperframes</Code>) reads the request, picks a workflow, proposes a direction and
            asks only for what&apos;s missing. The workflow scaffolds a project and writes the composition: plain HTML where
            each timed element is a clip with a start, a duration and a track, animated by GSAP timelines registered on{" "}
            <Code>window.__timelines</Code>. Because every frame is a pure function of time, the renderer can seek to any
            frame, out of order and in parallel workers, and get the same pixels.
          </p>
          <p>
            Claude Motion does the same thing inside a hosted player on claude.ai: Claude writes the film as code scene by
            scene, the player shows it filling in, and reviewers comment on a moment or a time range.
          </p>
        </Prose>
        <DataTable
          stack
          columns={["", "HyperFrames", "Claude Motion"]}
          rows={[
            ["Where it runs", "Your machine (or cloud render if you set it up)", "claude.ai: desktop app, web, or from Claude Code via artifacts"],
            ["Setup", "Claude Code plugin + Node 22+ + FFmpeg", "None"],
            ["Best for", "Product launches, explainers, captions on footage, talking-head recuts, anything with voice + music, 9:16 reels", "Quick explainers and demos shared as a link for comments"],
            ["Your footage", "Yes: captions, recuts, overlays, audio kept", "Images and muted clips, as picture only"],
            ["Audio", "Voiceover (TTS), music library, SFX, mixing", "A generated wordless score + effects"],
            ["Output", "Editable project folder (plain HTML, version-controllable) + MP4 / MOV / WebM", "Shareable link, scrub + comment on moments, MP4 export"],
            ["Determinism", "Same composition renders the same frames every time", "Same: everything is a function of time"],
          ]}
        />
      </Section>

      <Section id="mechanism" title="Core mechanism: the prompt">
        <Prose>
          <p>
            The agent is good at building; what it can&apos;t do is guess what you pictured. Prompt structure is the main
            lever. Everything here follows the HyperFrames{" "}
            <Ext href="https://hyperframes.heygen.com/prompting/overview">Prompt Guide</Ext>.
          </p>
        </Prose>

        <Sub id="skeleton">The six-part skeleton</Sub>
        <CodeBlock title="prompt skeleton" code={SNIPPET} />
        <DataTable
          stack
          columns={["Part", "What to write"]}
          rows={[
            ["Route", "A workflow slash command. Loads the right rules."],
            ["Spec", "Duration and resolution first. Default 1920×1080 at 30fps; say 1080×1920 for reels and shorts."],
            ["Beats", "Timestamps on everything. Include breathing room (“then hold on the cursor”) or it gets skipped."],
            ["Copy", "Quote it exactly; / for line breaks. Unquoted text gets paraphrased."],
            ["Technique", "Name catalog blocks exactly as the catalog lists them, to pin a technique."],
            ["Negatives", "Precise. “No narration” is not “no audio”. Say “no image or media files”, not “no external assets”."],
          ]}
        />

        <Sub id="beats">The beat formula</Sub>
        <Prose>
          <p>
            Inside each beat, describe each element with five slots: <strong>element · motion · layout · style · timing</strong>.
            For example: &ldquo;a giant number counts up to $4.2M with an odometer roll, easing out as it lands, centered,
            green on dark navy&rdquo;. Undescribed elements get designed by the agent: fine if you trust its taste, drift
            risk if you don&apos;t.
          </p>
        </Prose>

        <Sub id="dial">The specification dial</Sub>
        <DataTable
          stack
          columns={["Level", "You give", "Use when"]}
          rows={[
            ["1. Mood words", "“warm, minimal logo sting”", "Fastest; the agent owns the look"],
            ["2. Style tokens", "Exact hex colors, named textures (“halftone-dot”, “paper-cut matte”), type direction (“condensed caps”)", "Cheap precision, no downside"],
            ["3. Full visual spec", "Shape + color + position + timing per element", "Recreating a specific look"],
          ]}
        />
        <Prose>
          <p>
            Always pin two things. Real 3D: &ldquo;Three.js via the adapter&rdquo;. Sequencing: &ldquo;fades out fully by
            4.2s; at 4.2s READY stamps in&rdquo;, never &ldquo;at 4s X fades and Y appears&rdquo;.
          </p>
        </Prose>

        <Sub id="vocabulary">Words that map to settings</Sub>
        <DataTable
          columns={["Say", "Gets", "Feels"]}
          rows={[
            ["smooth", <Code key="e">power2.out</Code>, "natural deceleration"],
            ["snappy", <Code key="e">power4.out</Code>, "quick, decisive"],
            ["bouncy", <Code key="e">back.out</Code>, "overshoot then settle"],
            ["springy", <Code key="e">elastic.out</Code>, "oscillates in"],
            ["dramatic", <Code key="e">expo.out</Code>, "fast start, long glide"],
            ["dreamy", <Code key="e">sine.inOut</Code>, "slow, symmetrical"],
          ]}
        />
        <Prose>
          <p>
            Timing shorthand: fast 0.2s reads as energy, medium 0.4s as professional, slow 0.6s as luxury, 1–2s as cinematic.
          </p>
        </Prose>

        <Sub id="rewrites">Common rewrites</Sub>
        <DataTable
          stack
          columns={["Instead of", "Write"]}
          rows={[
            ["“then everything holds”", "“then settles into a gentle ambient idle (breathing scale, slow drift)”. A literal hold renders a frozen frame."],
            ["A 12-second ask with 5 seconds of beats", "Say what the tail does, or shorten it."],
            ["“show a tagline about shipping faster”", <Code key="c">tagline: &quot;Ship faster.&quot;</Code>],
            ["“counts from $0 to $4.2M”", "“counts up to $4.2M”"],
          ]}
        />

        <Sub id="motion-prompts">Prompting Claude Motion</Sub>
        <Prose>
          <p>
            Simpler: say the subject, audience and length in one or two lines. It asks for style, colors and length with a
            quick form, then builds. Name what&apos;s on screen and the order of scenes if you care; it fills the rest.
          </p>
        </Prose>
      </Section>

      <Section id="decisions" title="Key decisions and trade-offs">
        <DataTable
          stack
          columns={["Decision", "Reason", "Rejected alternative"]}
          rows={[
            [
              "No custom skill; install the official plugin",
              "HyperFrames ships 21 maintained skills and Claude Motion is built in. The wiki teaches install and prompting.",
              "A team-written video skill. Revisit as a brand skill or brand file if people keep making Logiciel-branded videos.",
            ],
            [
              "Code-based video for motion graphics",
              "Editable text: diffable, reusable as a template, change one word and re-render, identical output each time.",
              "Generative video models (Veo, Sora etc.). Better at photoreal footage, but not editable or repeatable. See the Making video with AI entry.",
            ],
            [
              "HyperFrames for files, Claude Motion for links",
              "File to ship, footage, narration or a vertical reel needs HyperFrames; a quick explainer for team feedback is faster in Claude Motion.",
              "One tool for everything.",
            ],
            [
              "Render locally",
              "Local is faster for iteration and uses no credits.",
              "Cloud render (Lambda, Cloud Run, HeyGen cloud): only for long or 4K jobs.",
            ],
          ]}
        />
      </Section>

      <Section id="evaluation" title="Evaluation: matching a reference">
        <Prose>
          <p>
            We haven&apos;t measured these tools ourselves. The only numbers are HyperFrames&apos; own observed results for
            recreating a reference video, from its docs. They are not guarantees.
          </p>
        </Prose>
        <KeyNumbers>
          <KeyNumber value="~75%" label="of the reference on the first try, from a frame-by-frame description" />
          <KeyNumber value="80–90%" label="on a fresh build, once converged numbers go back into the prompt" />
        </KeyNumbers>
        <Prose>
          <p>
            Structure and the motion arc land first. The last ~10% (glow falloff, material feel) doesn&apos;t close from text;
            if pixel-exact matters, keep the composition file, which re-renders identically.
          </p>
          <p>
            Quality gate: <Code>lint</Code> and <Code>check</Code> passing means well-formed, not good. Always watch the
            preview.
          </p>
        </Prose>
      </Section>

      <Section id="limits" title="Limits and risks">
        <Prose>
          <List>
            <li>Motion graphics, type, UI and data only. Not photoreal footage.</li>
            <li>Claude Motion: video clips play muted, the score is generated and wordless, typical length 10–30 s and max 300 s, one aspect ratio per film (a vertical version is a second film).</li>
            <li>Copyright: use references for style and pacing. Don&apos;t recreate another company&apos;s brand, UI or characters unless you work there. Claude Motion won&apos;t recreate other companies&apos; designs, logos or known songs.</li>
            <li>The HyperFrames CLI moves fast. Recheck commands against the docs when the plugin updates.</li>
            <li>Optional hosted voice and media providers have their own costs.</li>
          </List>
        </Prose>

        <Sub id="rules">Rules that prevent broken renders</Sub>
        <Prose>
          <p>The skills enforce these; know them for debugging.</p>
          <ol className="flex list-decimal flex-col gap-2 pl-5">
            <li>Every timeline registers on <Code>window.__timelines</Code>, or the renderer can&apos;t seek it.</li>
            <li>No <Code>Math.random()</Code>; use a seeded generator.</li>
            <li>Build timelines synchronously (no async or fetch during setup).</li>
            <li>Timed elements need <Code>class=&quot;clip&quot;</Code> + <Code>data-start</Code>, <Code>data-duration</Code>, <Code>data-track-index</Code>.</li>
            <li>Footage with sound: keep audio on the <Code>&lt;video&gt;</Code> with <Code>data-has-audio=&quot;true&quot;</Code>.</li>
            <li>Every scene gets an entrance; scenes get transitions (no accidental jump cuts).</li>
            <li>Hidden-at-start elements: set the hidden state outside the timeline and state the visible end value explicitly. Render workers seek out of order, so the preview can look right while the render is wrong.</li>
          </ol>
        </Prose>

        <Sub id="symptoms">Symptom to cause</Sub>
        <DataTable
          stack
          columns={["Symptom", "Likely cause"]}
          rows={[
            ["Element invisible in the render but fine in preview", "Cold-seek hidden state (rule 7)"],
            ["Element visible at frame 0 before its cue", <>A <Code>fromTo</Code> back-rendering its start pose</>],
            ["Centered element jumps on its first tween", <>CSS <Code>translate(-50%,-50%)</Code> fighting GSAP <Code>x/y</Code>; center with flex or grid</>],
          ]}
        />
      </Section>

      <Section id="run" title="Run it yourself">
        <Sub id="setup">Setup</Sub>
        <Prose>
          <p>
            HyperFrames needs Node.js 22+ and FFmpeg (<Code>brew install ffmpeg</Code> on macOS); the renderer handles
            Chrome. Install the plugin, restart Claude Code, then check the machine:
          </p>
        </Prose>
        <DataTable
          columns={["Step", "Command"]}
          rows={[
            ["Add the marketplace", <Code key="c">claude plugin marketplace add heygen-com/hyperframes</Code>],
            ["Install the plugin", <Code key="c">claude plugin install hyperframes@hyperframes</Code>],
            ["Check the machine", <Code key="c">npx hyperframes doctor</Code>],
            ["Other agents (Cursor, Copilot, Gemini CLI, Codex)", <><Code>npx skills add heygen-com/hyperframes</Code>, pick Core Skills</>],
          ]}
        />
        <Prose>
          <p>
            The entry point is <Code>/hyperframes:hyperframes</Code>. Optionally enable auto-update for the hyperframes
            marketplace in <Code>/plugin</Code> → Marketplaces. Claude Motion needs nothing: claude.ai → Artifacts → Make
            something new → Motion, or ask Claude Code for an animation and it creates a Motion artifact.
          </p>
        </Prose>

        <Sub id="first">Your first video</Sub>
        <Prose>
          <ol className="flex list-decimal flex-col gap-2 pl-5">
            <li>Open Claude Code in an empty folder.</li>
            <li>
              Prompt: <Code>/hyperframes:hyperframes make a 10-second product intro for https://example.com</Code>
            </li>
            <li>The router picks a workflow, proposes a direction and asks only for what&apos;s missing. No spec needed.</li>
            <li>It scaffolds a project, builds the composition, runs <Code>lint</Code> / <Code>check</Code>, and opens a live preview.</li>
            <li>Watch it, give notes, approve.</li>
            <li>It renders the MP4. Rendering waits for your OK by design.</li>
          </ol>
        </Prose>

        <Sub id="cli">CLI commands</Sub>
        <Prose>
          <p>The agent runs these; good to know.</p>
        </Prose>
        <DataTable
          columns={["Command", "Does"]}
          rows={[
            [<Code key="c">npx hyperframes init my-video</Code>, "Scaffold a project"],
            [<Code key="c">npx hyperframes preview</Code>, "Live preview in the browser (same runtime as the render)"],
            [<Code key="c">npx hyperframes lint</Code>, "Structure checks"],
            [<Code key="c">npx hyperframes check</Code>, "Headless runtime checks: layout collisions, contrast, motion problems"],
            [<Code key="c">npx hyperframes render</Code>, "Render the video"],
            [<Code key="c">npx hyperframes add &lt;block&gt;</Code>, "Install a catalog block (charts, code typing, transitions)"],
            [<Code key="c">npx hyperframes tts</Code>, "Voiceover"],
            [<Code key="c">npx hyperframes transcribe</Code>, "Word timings"],
            [<Code key="c">npx hyperframes doctor</Code>, "Environment check"],
          ]}
        />

        <Sub id="workflows">Workflows</Sub>
        <Prose>
          <p>Name one directly to skip routing.</p>
        </Prose>
        <DataTable
          columns={["Workflow", "Input → output"]}
          rows={[
            [<Code key="c">product-launch-video</Code>, "URL, brief or script → launch or promo video"],
            [<Code key="c">faceless-explainer</Code>, "Text → explainer with invented visuals (type, diagrams, data-viz)"],
            [<Code key="c">motion-graphics</Code>, "Kinetic type, logo stings, motion pieces"],
            [<Code key="c">embedded-captions</Code>, "Talking-head video → same footage with captions"],
            [<Code key="c">talking-head-recut</Code>, "Talking-head video → footage + synced kinetic titles, lower-thirds, PiP"],
            [<Code key="c">pr-to-video</Code>, "GitHub PR → code-change explainer"],
            [<Code key="c">music-to-video</Code>, "A track → video cut to it"],
            [<Code key="c">slideshow</Code>, "Images or a deck → video"],
            [<Code key="c">general-video</Code>, "Anything else: multi-scene pieces, reels, montages"],
          ]}
        />

        <Sub id="references">References</Sub>
        <Prose>
          <List>
            <li><strong>2 to 4 references</strong> that share one clear look. More and the style averages out.</li>
            <li><strong>Files beat links.</strong> Download clips and screenshots and attach them; Instagram and TikTok links often can&apos;t be opened by the agent.</li>
            <li>A brand&apos;s colors, fonts and logo files count as references; pass them every time.</li>
            <li>Say what to take from each: &ldquo;the pacing from ref A, the type from ref B&rdquo;. Otherwise everything blends.</li>
            <li>For a close match, watch the reference frame by frame and write down: exact duration, the camera path, what each element does with timestamps, how entrances overlap, which layers are blurred, sampled hex colors.</li>
            <li>Closing the gap: compare render and reference frame by frame, fix one axis at a time, use absolute targets (&ldquo;dot radius = 25% of row spacing&rdquo;, never &ldquo;2x finer&rdquo;), then copy the final numbers back into the prompt.</li>
          </List>
        </Prose>

        <Sub id="iterating">Iterating</Sub>
        <Prose>
          <p>Talk to the agent like a video editor. Don&apos;t re-prompt from scratch: it already has the composition open.</p>
          <ol className="flex list-decimal flex-col gap-2 pl-5">
            <li><strong>One change per round.</strong> &ldquo;Bigger title, warmer colors, faster cuts&rdquo; in one go hides what helped.</li>
            <li><strong>Absolute targets.</strong> &ldquo;Glow at ~35% peak opacity&rdquo; lands; &ldquo;glow too strong&rdquo; oscillates.</li>
            <li><strong>Freeze what works.</strong> &ldquo;Framing and motion are right, don&apos;t touch them; only change the dot size.&rdquo;</li>
            <li><strong>Layer up.</strong> Subject and its motion first, then camera, then background motion, then style. One layer per pass.</li>
            <li><strong>Strip, then re-layer</strong> when a scene keeps misfiring.</li>
            <li><strong>Timecode your notes.</strong> &ldquo;0:03 text too small&rdquo;, &ldquo;music lands late on the cut at 0:07&rdquo;.</li>
            <li><strong>Draft renders while iterating</strong>, one high-quality render at the end.</li>
          </ol>
          <p>Claude Motion: same habits. Click a moment or a range on the timeline and comment there; the comment carries the timestamp.</p>
        </Prose>

        <Sub id="audio">Voiceover, music, captions</Sub>
        <Prose>
          <List>
            <li>
              <strong>Voiceover engine order:</strong> HeyGen Starfish (if configured) → ElevenLabs (if a key is set) → local
              Kokoro, free, no API key. Gemini TTS is available as an explicit choice.
            </li>
            <li>
              <strong>Describe the voice.</strong> Not &ldquo;add a voice&rdquo; but &ldquo;warm, unhurried female narration
              of the quoted script&rdquo;.
            </li>
            <li>
              <strong>Kokoro voices by use:</strong> <Code>af_heart</Code>, <Code>af_nova</Code> (product demo) ·{" "}
              <Code>am_adam</Code>, <Code>bf_emma</Code> (tutorial) · <Code>af_sky</Code>, <Code>am_michael</Code> (marketing).
            </li>
            <li>
              <strong>Music needs mood and loudness:</strong> &ldquo;subtle background music, ducked ~12 dB under the
              voice&rdquo;. &ldquo;Add background music&rdquo; gets a full-volume track fighting the voice.
            </li>
            <li><strong>Sound effects</strong> are cued to moments (a transition, a stamp-in), not sprinkled.</li>
            <li>
              <strong>Sync to the voice:</strong> &ldquo;on-screen elements land on their spoken cues&rdquo;. Narration is
              transcribed with per-word timestamps, so this is executable.
            </li>
            <li>
              <strong>Captions:</strong> footage in → <Code>embedded-captions</Code>. Kinetic titles, lower-thirds or PiP over
              a talking head → <Code>talking-head-recut</Code>.
            </li>
          </List>
        </Prose>

        <Sub id="export">Export</Sub>
        <DataTable
          stack
          columns={["Say", "Gets"]}
          rows={[
            ["“draft” / “quick render”", <><Code>--quality draft</Code>: fast, for checking timing</>],
            ["nothing", <><Code>looks</Code>, the CLI default: the standard preset at CRF 16</>],
            ["“final” / “high quality”", <><Code>delivery</Code> (same as <Code>high</Code>): the delivery master</>],
            ["“transparent MOV”", "ProRes 4444 with alpha, for editors"],
            ["“transparent WebM”", "Small; alpha only works in browsers"],
            ["“PNG sequence”", "Lossless frames for compositing"],
          ]}
        />
        <Prose>
          <List>
            <li>Default: MP4, 1920×1080, 30fps. For social, don&apos;t ask for 4K or 60fps; platforms transcode it down.</li>
            <li>Transparency only makes sense for overlays (lower thirds, logo stings), not full-frame scenes.</li>
            <li>Cloud render (Lambda, Cloud Run, HeyGen cloud) only for long or 4K jobs; local is faster for iteration.</li>
          </List>
        </Prose>

        <Sub id="claude-motion">Claude Motion workflow</Sub>
        <Prose>
          <ol className="flex list-decimal flex-col gap-2 pl-5">
            <li>Ask: &ldquo;Make a 20-second animated explainer of how our onboarding works&rdquo; (claude.ai Motion artifact, or ask Claude Code).</li>
            <li>Answer the quick picks: style (3–4 looks made for your subject), colors (palettes, or your design system), length.</li>
            <li>It writes the film scene by scene as code; the player shows it filling in.</li>
            <li>Scrub it. Sound starts muted (speaker button).</li>
            <li>Revise by commenting on a moment or a time range in the timeline, or describe the change in chat.</li>
            <li>Export MP4 from the page. Share the link; artifacts are private until you share them.</li>
          </ol>
          <p>Works best with your own material: screenshots, logo, brand colors, UI code to recreate.</p>
        </Prose>
        <Callout kind="note" title="Learn more">
          <p>
            <Ext href="https://hyperframes.heygen.com">HyperFrames docs</Ext> (Quickstart, Workflows), the{" "}
            <Ext href="https://hyperframes.heygen.com/prompting/overview">Prompt Guide</Ext> (7 levels, first video to
            capstone), the <Ext href="https://hyperframes.heygen.com/catalog/blocks/data-chart">block catalog</Ext>, the{" "}
            <Ext href="https://hyperframes.heygen.com/showcase">showcase</Ext>, the browser{" "}
            <Ext href="https://www.hyperframes.dev/">playground</Ext>, and the{" "}
            <Ext href="https://github.com/heygen-com/hyperframes">repo</Ext> (<Code>examples/</Code>, <Code>skills/</Code>).
            Porting from Remotion: docs → Prompting → Remotion migration.
          </p>
        </Callout>
      </Section>

      <Section id="next" title="Open questions">
        <Prose>
          <List>
            <li>A team brand skill or brand file, if people keep making Logiciel-branded videos.</li>
            <li>Sample videos made with each tool, to add to this page.</li>
            <li>Recheck commands and versions when the plugin updates; this page was checked against v0.8.181.</li>
          </List>
        </Prose>
      </Section>
    </>
  );
}
