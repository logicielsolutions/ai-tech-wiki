import { BulletList, Callout, Code, CodeBlock, DataTable, Figure, PageIndex, Prose, Section, SubHeading } from "@/components/wiki";

const SNIPPET = `# config/gate.yaml (excerpt), read by agent/gate.py (uv run tw-gate)
# Lift, CI and gate pass rate are computed over the modules both versions
# have results for, paired by task id. Promotion only on the held-out exam:
#   tw-gate --split heldout --exam --promote --approved-by NAME
min_paired_modules: 5       # val has 6, held-out 10
min_lift: 0.10              # mean over modules of (candidate - champion) mean final_score
ci: 0.90                    # two-sided paired bootstrap CI; its lower bound must be > 0
resamples: 10000            # each resample draws the modules with replacement
seed: 20261016              # same evaluations, same CI
gate_pass_rate_slack: 0.0   # candidate gate pass rate >= champion's (never lower)
violations_max: 0           # cheating violations over all the candidate's runs`;

function ArchitectureDiagram() {
  const box = (x: number, y: number, w: number, label: string, sub?: string, strong = false) => (
    <g key={label + x + y}>
      <rect x={x} y={y} width={w} height={sub ? 54 : 40} rx={10} fill={strong ? "var(--color-accent-tint)" : "var(--color-page)"} />
      <text x={x + w / 2} y={y + (sub ? 23 : 25)} textAnchor="middle" fontSize={13} fontFamily="var(--font-mono)" fill={strong ? "var(--color-accent)" : "var(--color-ink)"}>
        {label}
      </text>
      {sub ? (
        <text x={x + w / 2} y={y + 41} textAnchor="middle" fontSize={12} fill="var(--color-muted)">
          {sub}
        </text>
      ) : null}
    </g>
  );
  const line = (d: string, dashed = false) => (
    <path d={d} fill="none" stroke="var(--color-muted)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dashed ? "4 5" : undefined} />
  );
  return (
    <svg
      viewBox="0 0 800 370"
      className="h-auto w-full min-w-[680px]"
      role="img"
      aria-label="Architecture. tw-tasks builds a frozen task set split into train, val and held-out. artifacts holds immutable agent versions. The LangGraph agent runs in an E2B sandbox, then the scoring gates and Stryker produce a score. tw-eval aggregates scores per version; tw-gate compares a candidate with the champion and moves the champion pointer only on the held-out exam with an approver. tw-gepa and tw-ace read train diagnoses and write new candidate versions. tw-write runs the champion on a pull request's changed modules."
    >
      {box(20, 20, 160, "tw-tasks", "train 14 · val 6 · held 10")}
      {box(20, 110, 160, "artifacts/", "vNNN · candidates", true)}
      {box(230, 60, 180, "agent graph", "LangGraph · E2B sandbox")}
      {line("M180 47C205 47 205 87 230 87")}
      {line("M180 137C205 137 205 87 230 87")}
      {box(460, 60, 150, "gates + Stryker", "lint · tsc · pass ×3")}
      {line("M410 87H460")}
      {box(650, 60, 130, "tw-eval", "per version")}
      {line("M610 87H650")}
      {box(650, 160, 130, "tw-gate", "paired CI")}
      {line("M715 114V160")}
      {box(650, 260, 130, "champion.json", "pointer + history", true)}
      {line("M715 214V260")}
      {box(330, 190, 180, "tw-gepa / tw-ace", "reflect on train only", true)}
      {line("M650 100C580 100 560 217 510 217", true)}
      {line("M330 217C260 217 240 137 180 137", true)}
      {box(330, 290, 180, "tw-write", "module | pr → draft PR")}
      {line("M650 287H510")}
      <text x={20} y={232} fontSize={12} fill="var(--color-muted)">
        dashed: the optimisation loop
      </text>
      <text x={20} y={250} fontSize={12} fill="var(--color-muted)">
        (diagnoses → new candidates)
      </text>
      <text x={20} y={330} fontSize={12} fill="var(--color-muted)">
        held-out runs only via --exam;
      </text>
      <text x={20} y={348} fontSize={12} fill="var(--color-muted)">
        never fed to an optimiser
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
          { id: "architecture", title: "Architecture" },
          {
            id: "mechanism",
            title: "Core mechanism",
            children: [
              { id: "score", title: "The score" },
              { id: "gate", title: "The promotion gate" },
              { id: "optimisers", title: "The optimisers" },
              { id: "pr-mode", title: "Production: PR mode" },
            ],
          },
          { id: "decisions", title: "Key decisions and trade-offs" },
          {
            id: "evaluation",
            title: "Evaluation",
            children: [
              { id: "ib-results", title: "Interview Buddy: every version" },
              { id: "hire-rules", title: "The hire-rules benchmark" },
              { id: "caught", title: "What the measurement caught" },
              { id: "why", title: "Why self-improvement didn't help" },
              { id: "model-check", title: "Model check and demo PR" },
            ],
          },
          { id: "limits", title: "Limits and risks" },
          { id: "run", title: "Run it yourself" },
          { id: "next", title: "Open questions and next steps" },
        ]}
      />

      <Section id="glance" title="At a glance">
        <DataTable
          stack
          columns={["Item", "Detail"]}
          rows={[
            ["What", "A test-writing agent for TypeScript modules plus a self-improvement loop (GEPA, ACE) judged on a sealed held-out exam. 10-day POC, 13–22 Oct 2026"],
            ["Result", "No self-improved version beat the hand-written seed on held-out modules, on Interview Buddy (v001 exam macro 0.714) or on the hire-rules benchmark (GEPA candidate proven worse, −0.225)"],
            ["Models", <span key="m">Task <Code>gpt-5.4-mini</Code>; reflection <Code>gpt-6.1-sol</Code>; judge <Code>gpt-6-luna</Code> (Decisions API)</span>],
            ["Stack", "Python harness (uv), LangGraph with a Postgres checkpointer, E2B sandboxes with no network, Vitest, tsc, Prettier, a TypeScript lint, Stryker, v8 coverage, GEPA 0.1.4, OpenTelemetry (metadata only), MCP, LangGraph Studio"],
            ["Targets", <span key="t">Interview Buddy clone <Code>logicielsolutions/interview-buddy-tw</Code> at tag <Code>tw-freeze-harness</Code>; benchmark <Code>hire-rules</Code> (local, tag <Code>tw-freeze-bench</Code>), selected with <Code>TW_TARGET</Code></span>],
            ["Task set", "30 Interview Buddy modules (14 train, 6 val, 10 held-out), 1,588 type-valid mutants; hire-rules 24 modules (12 / 4 / 8), 2,236 type-valid mutants, 882 reference tests"],
            ["Status", "Experiment. The agent is ready for draft PRs on pilot repos after the go-live steps (none done); the loop stays a measurement tool"],
            ["Owner", "AI Practice"],
            ["Source", <span key="s"><Code>logicielsolutions/test-writer-agent</Code> (private): <Code>README.md</Code>, <Code>docs/contracts.md</Code> §1–11, <Code>reports/</Code></span>],
          ]}
        />
      </Section>

      <Section id="architecture" title="Architecture">
        <Figure scroll caption="Accent boxes hold versioned state: agent versions, the optimisers' candidates and the champion pointer. The dashed path is the optimisation loop.">
          <ArchitectureDiagram />
        </Figure>
        <Prose>
          <p>
            <strong>Task set.</strong> <Code>tw-tasks</Code> selects modules (50–300 lines, at least 2 functions and 3 branches,
            low existing coverage, no I/O-heavy imports), hides their human tests, labels mutants and freezes the set with a hash.
            Val and held-out human tests are deleted in every sandbox; that rule came from a Day 1 leak, when smoke-run agents
            read a held-out test as a style example.
          </p>
          <p>
            <strong>Agent.</strong> A LangGraph graph, <Code>setup → llm → record → tools → … → finish → score</Code>, with
            Postgres checkpoints (kill-and-resume passed 10 of 10). Caps: 25 steps and 120k input tokens per run. Tool sets v1–v3
            (<Code>read_module</Code>, <Code>read_types</Code>, <Code>edit_test_file</Code>, <Code>run_tests</Code> …), context
            compaction and a prompt cache key.
          </p>
          <p>
            <strong>Versions.</strong> Each version (system prompt, <Code>SKILL.md</Code>, tool set, playbook, settings in{" "}
            <Code>agent.json</Code>) is immutable under <Code>artifacts/vNNN</Code> or{" "}
            <Code>artifacts/candidates/&lt;round&gt;/cNNN</Code> and loaded by manifest hash. <Code>champion.json</Code> is a
            pointer with history; rollback is one call (drilled v001 → v002 → v001 on Day 8).
          </p>
          <p>
            <strong>Evaluation.</strong> Each run gets a diagnosis text (first type errors, failing tests, surviving mutants,
            wasted steps). A <Code>gpt-6-luna</Code> judge scores behaviour; only that one question met the calibration target, so
            it weighs 5%. <Code>tw-eval</Code> aggregates per version and caches by version hash.
          </p>
        </Prose>
      </Section>

      <Section id="mechanism" title="Core mechanism">
        <SubHeading id="score">The score</SubHeading>
        <Prose>
          <p>
            Score = type-valid mutants the tests kill / type-valid mutants. A run that fails a hard gate scores 0. The gates:
            Prettier, an edit check (only the test file changed), a TypeScript lint (no mocking the module under test, no skips, no
            snapshots), <Code>tsc</Code>, and the file passing 3 times in a row. Micro pools all mutants; macro is the mean of
            per-module means.
          </p>
        </Prose>

        <SubHeading id="gate">The promotion gate</SubHeading>
        <Prose>
          <p>
            <Code>tw-gate</Code> compares a candidate with the champion on the modules both have results for. Lift is the macro
            difference, paired by module; the CI is a 10,000-resample paired bootstrap, so a module&apos;s two scores always move
            together. On val the decision is a rehearsal; only the held-out exam, with a named approver, can promote.
          </p>
        </Prose>
        <CodeBlock title="The promotion rules" code={SNIPPET} />

        <SubHeading id="optimisers">The optimisers</SubHeading>
        <DataTable
          stack
          columns={["Optimiser", "What it edits", "How"]}
          rows={[
            [
              <Code key="g">tw-gepa</Code>,
              "System prompt (Day 5); tool descriptions and SKILL.md, round-robin (Day 6); the skill on a naive seed (Day 8); prompt and skill on hire-rules",
              "GEPA 0.1.4. A rewrite is accepted when it beats its parent on a 3-module train minibatch (1 run each), then scored on val. Reflection on gpt-6.1-sol sees train diagnoses only; the template forbids module and file names",
            ],
            [
              <Code key="a">tw-ace</Code>,
              "A playbook appended to the context (Day 7)",
              "Generator, Reflector, Curator. Delta edits to bullets with helpful / harmful counters, a 1,500-token budget, train-only reflection",
            ],
          ]}
        />

        <SubHeading id="pr-mode">Production: PR mode</SubHeading>
        <Prose>
          <p>
            <Code>tw-write pr --base &lt;ref&gt; --head &lt;ref&gt;</Code> runs the champion by its manifest hash:{" "}
            <Code>git diff -U0 base...head</Code> → changed <Code>.ts</Code> files under <Code>src/</Code> (the eval&apos;s file
            filters apply) → changed functions (TS scan of the head) → one agent run per module in E2B, with the head&apos;s source
            overlaid on the frozen template → the gates plus coverage → a draft PR body. A test that fails the same way three times
            is listed as a possible bug. Results are idempotent per repo and head SHA.
          </p>
          <p>
            Entry points: the CLI, the MCP tool <Code>write_tests</Code> (<Code>tw-write-mcp</Code>; never opens PRs) and the
            GitHub Action <Code>deploy/github/write-tests.yml</Code> (written, not installed). <Code>tw-harvest</Code> (a stub)
            stages rejected or heavily edited draft PRs as new train or val tasks, never held-out.
          </p>
        </Prose>
      </Section>

      <Section id="decisions" title="Key decisions and trade-offs">
        <DataTable
          stack
          columns={["Decision", "Reason", "Rejected alternative"]}
          rows={[
            ["Promote only on a sealed held-out exam, with a named approver", "Val winners are inflated by picking the best of noisy candidates: v006 led val (micro 0.584) and scored 0.422 on the exam", "Promote on val"],
            ["Paired bootstrap CI over modules", "Module difficulty dominates the variance; pairing keeps a module's two scores together", "A raw difference of means"],
            ["All-or-nothing hard gates", "A test file that fails lint, types or flakes is unusable in a real repo", "Partial credit (recommended now, untested): most of the score became gate luck"],
            ["Reflection on train only, with a name guard", "Keeps val and the exam honest estimates and stops memorising module details", "GEPA's default template, which asks for niche domain facts"],
            [<span key="c">GEPA <Code>cache_evaluation=False</Code></span>, "The cache keys results by example position, so train and val scores mixed: c003 reported val 0.742, measured micro 0.336", "Trust the library's cache"],
            ["New tool set v3 as a new version, not an edit of v2", "Old scores must describe the code that produced them", "Edit v2 in place"],
            ["A second, clean target with a pre-registered rule", "Test the \"no room to improve\" explanation with the win condition fixed before any paid run", "More rounds on Interview Buddy"],
          ]}
        />
      </Section>

      <Section id="evaluation" title="Evaluation">
        <SubHeading id="ib-results">Interview Buddy: every version</SubHeading>
        <DataTable
          stack
          numeric={[2, 3]}
          columns={["Version", "What changed", "Val (6 × 2)", "Exam macro (10)", "Gate decision"]}
          rows={[
            [<Code key="1">v001</Code>, "Hand-written seed, tool set v1", "micro 0.445, macro 0.654", "0.714 (2 runs, pass 80%)", "Champion throughout"],
            [<Code key="2">v002</Code>, "Tool set v2, compaction, cache key", "micro 0.443, macro 0.570", "–", "Not better; seed for Days 5–6"],
            [<Code key="3">v003</Code>, "\"One assert is enough\" (deliberately worse)", "lift −0.172", "–", "Proven worse, CI [−0.327, −0.048]: the gate proof"],
            [<Code key="4">day5/c003</Code>, "GEPA rewrite of the system prompt", "micro 0.336 (GEPA said 0.742)", "–", "vs v002 −0.001, CI [−0.171, +0.167]"],
            [<Code key="5">v004</Code>, "Tool set v3 (edit tool, tolerant run_tests)", "micro 0.139, macro 0.240", "–", "Proven worse: vs v002 −0.330, CI [−0.577, −0.083]"],
            [<Code key="6">day6/c001–c003</Code>, "GEPA on tool descriptions and skill", "micro 0.322 / 0.359 / 0.363", "–", "All reject; best vs v002 −0.004"],
            [<Code key="7">v005</Code>, "v002 with a 200k token cap", "micro 0.441, macro 0.647", "–", "vs v002 +0.077, CI [−0.012, +0.244]"],
            [<Code key="8">v006</Code>, "day6/c003 + 200k", "micro 0.584, macro 0.546", "0.422 (1 run)", "Interim −0.193, CI [−0.459, +0.070]"],
            [<Code key="9">v007</Code>, "v005 + ACE playbook (10 bullets)", "micro 0.369, macro 0.570", "0.504 (2 runs, 60%)", "Proven worse: −0.210, CI [−0.326, −0.094]"],
            [<Code key="10">v008</Code>, "v006 + playbook", "not measured", "0.442 (1 run)", "Interim −0.173, CI [−0.359, +0.008]"],
            [<Code key="11">v009</Code>, "Naive 3-line seed, empty skill", "micro 0.561, macro 0.695", "0.557 (2 runs, 70%)", "vs v001 −0.157, CI [−0.366, +0.038]; 1 violation (mocked the target)"],
            [<Code key="12">naive/c002</Code>, "GEPA skill on the naive seed (921 words)", "micro 0.572, macro 0.625", "0.480 (2 runs, 55%)", "vs v001 −0.234, CI [−0.418, −0.046]: worse"],
          ]}
        />
        <Prose>
          <p>
            Noise: v001&apos;s exam macro moved from 0.616 after run 1 to 0.714 over both runs. On the first exam run, 5 of the 10
            modules flipped between 0 and about 0.9 across arms, every time because of a gate failure.
          </p>
        </Prose>

        <SubHeading id="hire-rules">The hire-rules benchmark</SubHeading>
        <Prose>
          <p>
            24 rule modules (scoring, eligibility, scheduling, validation, text, workflow, money), 82–154 lines each, no database
            or network, an injected clock. Seed <Code>v010</Code> is v001&apos;s general prompt with the Interview Buddy references
            removed, plus a 228-word generic skill, written before any hire-rules run. The pre-registered rule: promote only if
            held-out lift ≥ +0.10 with the 90% CI above 0, 2 runs per module, gate pass rate not lower, 0 violations.
          </p>
        </Prose>
        <DataTable
          numeric={[1, 2, 3]}
          columns={["Version", "Val macro (4 × 2)", "Exam macro (8 × 2)", "Exam gate pass", "Decision"]}
          rows={[
            ["Human reference tests", "0.989", "0.968", "100%", "The ceiling"],
            [<Code key="a">v010</Code>, "0.924", "0.726", "81%", "Reference point"],
            [<Code key="b">bench1/c005</Code>, "0.810", "0.501", "56%", "Proven worse: −0.225, CI [−0.353, −0.099]"],
            [<Code key="c">v011</Code>, "–", "0.769", "88%", "Reject: +0.044, CI [−0.124, +0.250]"],
          ]}
        />
        <Prose>
          <p>
            Every failed run, for both versions, failed pass ×3: tests asserting a wrong expected value. c005&apos;s prompt grew
            from 486 to 760 words and asked for a bigger first file, giving 7 failed runs against the seed&apos;s 3.{" "}
            <Code>v011</Code> adds <Code>require_green</Code> (nudge the agent if it stops after a red test run); it never fired in
            16 runs, so v011 vs v010 is an A/A test: noise of about ±0.15 at 8 modules × 2 runs.
          </p>
        </Prose>

        <SubHeading id="caught">What the measurement caught</SubHeading>
        <DataTable
          stack
          columns={["Case", "What looked good", "What it was", "Caught by"]}
          rows={[
            ["Cache collision (Day 5)", "c003 at val 0.742 vs the seed's 0.486", "2 of 6 val scores were train scores; measured micro 0.336", "Re-running val through tw-eval; fixed with a regression test"],
            ["Repeated minibatch", "–", "GEPA pads an epoch's last minibatch with a repeat: duplicate run ids", "Ledger check; the evaluator runs each module once per batch"],
            ["Tool fix (Day 6)", "Tool errors 0.92 → 0.08 per run, output tokens −27%", "One edit per step meant more steps on the whole context: lift −0.330", "The gate on the end score, not the proxy"],
            ["Val leader (Day 7)", "v006 best val micro (0.584 vs 0.445)", "Exam 0.422 vs v001's 0.616 on run 1: the winner's curse", "The sealed exam"],
            ["Minibatch accepts", "Up to +0.99 over the parent on a minibatch", "Lost on val or the exam", "Val with 2 runs, then the exam"],
            ["Cheating", "A file that passes", "The naive seed mocked the module under test once (MOCK_TARGET)", "The lint gate and the violation rule"],
            ["Held-out leak (Day 1)", "–", "Agents read a held-out test as a style example", "Transcript review; val and held-out tests now deleted in every sandbox"],
          ]}
        />
        <Prose>
          <p>
            Optimisers also wrote plausible, wrong advice: a tool description that read the pass-3-times rule as an agent action,
            a skill asking for lint and type-check commands the tools don&apos;t have, and playbook bullets each shaped by one train
            module. A person has to read every diff.
          </p>
        </Prose>

        <SubHeading id="why">Why self-improvement didn&apos;t help</SubHeading>
        <BulletList>
          <li>
            <strong>Strong seeds (measured).</strong> A 3-line prompt scored val macro 0.695, level with v001&apos;s 0.654; the
            hire-rules seed scored 0.924 on val against a 0.989 ceiling.
          </li>
          <li>
            <strong>All-or-nothing scoring (measured).</strong> Most of the score is whether a module passes the gates (0 vs about
            0.9), not assert strength.
          </li>
          <li>
            <strong>Selection on noise (measured).</strong> Minibatches of 3 modules × 1 run; A/A noise about ±0.15; day6/c003 lost
            its minibatch (1.65 → 0.87) yet led val.
          </li>
          <li>
            <strong>Long prompts on a cheap model (interpretation).</strong> Rewrites grew the text and asked for more coverage;
            more attempted asserts meant more wrong ones. Supported by c005&apos;s 7 vs 3 failures.
          </li>
          <li>
            <strong>The token cap (measured).</strong> 8 of 9 v002 service and I/O-edge runs stopped at 120k input tokens; at 200k
            the two hardest val modules still scored 0 in every run.
          </li>
          <li>
            <strong>Too few rollouts (measured).</strong> Rounds stopped after 3–7 iterations; each iteration pays parent and
            child minibatches plus a val pass.
          </li>
        </BulletList>
        <Callout kind="limit" title="What this does not show">
          <p>
            It does not show that GEPA or ACE can&apos;t work for test writing. It shows they didn&apos;t at this model, this
            scoring and this number of runs. A real lift under about 0.15 would be invisible at 10 modules × 2 runs.
          </p>
        </Callout>

        <SubHeading id="model-check">Model check and demo PR</SubHeading>
        <Prose>
          <p>
            Day 2 model check: <Code>gpt-6.1-sol</Code> as the task model scored micro 0.973 on 5 train modules (1 run each) where{" "}
            <Code>gpt-5.4-mini</Code> scored 0.157 on the same modules. The model was the biggest lever we measured.
          </p>
          <p>
            Demo PR (local only): branch <Code>demo/tw-feature-1</Code> changed <Code>live-transcript.ts</Code> (skip empty deltas,
            add <Code>transcriptWordCount</Code>). The agent found both changed functions and wrote{" "}
            <Code>live-transcript.tw.test.ts</Code> (186 lines, 11 tests) in 6 steps. Lint, whole-project <Code>tsc</Code> and pass
            ×3 (11/11 three times) passed; coverage of the module 100% of lines and 97% of branches (v8, approximate).
          </p>
        </Prose>
      </Section>

      <Section id="limits" title="Limits and risks">
        <BulletList>
          <li><Code>--open-pr</Code> is built and unit-tested with a fake runner but has never run against GitHub. No real PR has been through it, so there are no reviewer verdicts (the plan asked for 5–10).</li>
          <li>No staging deploy or runbook; the path runs locally and as a ready-to-install Action.</li>
          <li>The agent tests the whole module, not only the changed functions; the repo&apos;s own ESLint and build are not run on the test file.</li>
          <li>A head that changes <Code>package.json</Code>, <Code>pnpm-lock.yaml</Code>, <Code>pnpm-workspace.yaml</Code> or <Code>.npmrc</Code> is refused until the E2B template is rebuilt.</li>
          <li>v001 was never run on hire-rules, so whether the Interview Buddy prompt transfers is unknown.</li>
          <li>Studio state contains the agent&apos;s messages (target repo code): local server only, no <Code>--tunnel</Code>.</li>
          <li>Keys stay in the host process: never passed into a sandbox, a prompt, a transcript or a log.</li>
        </BulletList>
      </Section>

      <Section id="run" title="Run it yourself">
        <Prose>
          <p>
            Prerequisites: Node 24, <Code>corepack</Code>, <Code>uv</Code>, Docker for the local Postgres, and read access to{" "}
            <Code>logicielsolutions/interview-buddy-tw</Code>. Agent runs need <Code>OPENAI_API_KEY</Code> and{" "}
            <Code>E2B_API_KEY</Code> (environment, a git-ignored <Code>.env</Code>, or macOS Keychain; check with{" "}
            <Code>uv run python scripts/check_keys.py</Code>). The GitHub Action also needs <Code>TW_APP_ID</Code> and{" "}
            <Code>TW_APP_PRIVATE_KEY</Code>.
          </p>
        </Prose>
        <DataTable
          stack
          columns={["Step", "Command"]}
          rows={[
            ["Install and test", <Code key="1">uv sync; (cd evals/harness/ts &amp;&amp; corepack pnpm install); uv run pytest</Code>],
            ["Grader check (no keys)", <Code key="2">uv run python -m evals.harness.sanity</Code>],
            ["Postgres for durable runs", <Code key="3">docker compose -f infra/docker-compose.yml up -d</Code>],
            ["One agent run", <Code key="4">uv run tw-run --task ib__server.ai.redact --version v001 --model gpt-5.4-mini</Code>],
            ["Evaluate and gate", <Code key="5">uv run tw-eval …; uv run tw-gate …</Code>],
            ["Studio (demos)", <Code key="6">scripts/studio.sh</Code>],
            ["Tests for a module", <Code key="7">uv run tw-write module src/lib/proctoring/recording.ts</Code>],
            ["Tests for a PR (dry run)", <Code key="8">uv run tw-write pr --base &lt;ref&gt; --head &lt;ref&gt; --dry-run</Code>],
            ["The benchmark target", <Code key="9">TW_TARGET=hire-rules uv run …</Code>],
          ]}
        />
      </Section>

      <Section id="next" title="Open questions and next steps">
        <BulletList>
          <li><strong>More runs per decision.</strong> More held-out modules, more runs per module and bigger minibatches with several runs each, so a +0.10 lift is visible above ±0.15 noise.</li>
          <li><strong>A stronger task model.</strong> Run <Code>gpt-6.1-sol</Code> on the exam; test whether an optimised mini ever matches it.</li>
          <li><strong>Partial-credit scoring.</strong> Score the passing tests, quarantine failing ones, keep lint violations as hard zeros (a suggestion, untested).</li>
          <li><strong>Harness rules over prompt text.</strong> <Code>require_green</Code> (built, off by default), a forced final test run before the token cap, batched edits; pre-register each.</li>
          <li><strong>Local models.</strong> A gap analysis with a local model (Ollama) is planned; the harness treats it as another task model.</li>
          <li><strong>Reuse the harness.</strong> The task builder, gates, evaluator, paired gate and optimisers are generic; <Code>TW_TARGET</Code> already runs a second repo.</li>
          <li><strong>Go live.</strong> Push the demo branch and run <Code>--open-pr</Code> once; add secrets and a GitHub App; copy the workflow; collect verdicts on 5–10 real PRs.</li>
        </BulletList>
      </Section>
    </>
  );
}
