# An AI that coaches itself

A 10-day POC (13–22 Oct 2026): an AI agent that writes unit tests for TypeScript code, plus a loop that tries to make the agent better by rewriting its own instructions from its failures, judged on a sealed exam.

Source shorthand used below:
- `[FR]` Final report, second brain `attachments/agentic-pipelines-2026-10-22/final-report-2026-10-22.html` (22 Oct 2026)
- `[README]` `~/Documents/Logiciel-Projects/test-writer-agent/README.md`
- `[CON]` `docs/contracts.md` in the harness repo
- `[GATE]` `agent/gate.py` and `config/gate.yaml` in the harness repo
- `[SD]` System design doc, https://claude.ai/artifact/1eG8Ku1beT3tMAjSFD2F7Q (for the brief only)

## Identity
- Slug: self-improving-agent (from the title, 23 Oct 2026)
- Title (2–5 words, the idea not the repo): An AI that coaches itself (asked: 23 Oct 2026)
- One-line pitch (≤ 90 chars, for a non-tech reader): We let an AI rewrite its own instructions, then gave it a sealed exam. (asked: 23 Oct 2026)
- Tags (1–3): agents, evals (from shared TAGS)
- Status: experiment (POC; the loop "should stay a measurement tool"; the agent is "ready for draft PRs on pilot repos after the go-live steps", none done) [FR §9, §7]
- Owner: AI Practice; no individual names on the pages (asked: 23 Oct 2026)
- Source: the `test-writer-agent` harness repo (GitHub `logicielsolutions/test-writer-agent`, private) and its final report [FR §10]
- Last updated: 23 Oct 2026

## Readers
- Non-tech reader we picture: leadership and managers (and clients) who hear "self-improving AI" and need to judge the claim (asked: 23 Oct 2026)
- What they should be able to say after the explainer: an AI can write tests that catch planted bugs; we tried letting it rewrite its own instructions to get better; a sealed exam on code it never saw showed none of the rewrites beat the hand-written starting point; and the testing caught every rewrite that only looked better.
- Engineer we picture: an engineer considering a self-improving agent (GEPA, ACE or similar) or reusing the harness (task set, gates, paired gate, ledger) for another agent
- What they should be able to decide after the tech page: whether self-improvement is worth trying for their agent, at what budget and with what scoring; and which parts of the harness to reuse

## The idea
- Problem it solves, as a situation: writing unit tests is slow and often skipped. An agent can write them, but is it good enough, and can it learn from its own mistakes instead of a person tuning its instructions by hand? And how would we know it really got better, not just lucky? [FR §1]
- How it works, in plain steps (draft):
  1. Pick real code modules and split them: practice (14), mock exam (6), sealed final exam (10), with tests hidden. [FR §2]
  2. The agent writes a test file for a module in a locked sandbox. [FR §2]
  3. Score it: the file must pass strict checks (style, types, no cheating, passes 3 times in a row) or it scores 0; then fake bugs are planted in the code (mutants) and the score is the share of them the tests catch. [FR §1 note]
  4. Self-improvement: a stronger model reads the agent's failures on practice modules and rewrites its instructions (GEPA), or keeps a short list of lessons (ACE). [FR §2, §5]
  5. A gate compares a new version with the champion on the same modules, with a confidence range; only a clear win (≥ +0.10, range above 0) on the sealed exam, plus a person's approval, can promote. [GATE], [FR §1 note]
- Visual metaphor: a smoke-alarm installer. Code modules = buildings; tests = smoke alarms; planted bugs (mutants) = fake fires we light to see which alarms go off; the strict checks = an alarm that is wired wrong or goes off by itself fails the building (scores 0); the agent's instructions = the installer's handbook; self-improvement = the installer rewrites their own handbook from the buildings that went wrong, helped by a senior coach; practice / mock / sealed buildings = train / val / held-out; the gate = an inspector who compares two handbooks on the same new buildings and needs a clear win plus a person's sign-off. Accent = the handbook (the thing being improved). (asked: 23 Oct 2026)
- Worked example for "See it in action": the sealed exam itself: the hand-written handbook vs every rewrite on the 10 new buildings (real measured scores), then the four "looked better, wasn't" cases, then the clean practice town (hire-rules) giving the same answer (proposed in outline, 23 Oct 2026)
- Interactive figure?: yes. "Lucky practice score": the reader picks a handbook and sees its mock-exam score next to its sealed-exam score, with the inspector's verdict; values are the POC's measured results, baked in and labelled (proposed in outline, 23 Oct 2026)
- The one code snippet for the tech page: the gate rules from `config/gate.yaml` (min paired modules, min lift, CI, resamples, gate pass slack, violations), cost line left out per Off the page (proposed in outline, 23 Oct 2026). Alternatives considered: the gate's `decide` rules (paired lift, bootstrap CI lower bound > 0, gate pass, violations, cost ratio) [GATE]; the `tw-write pr` command flow [README]

## The facts

### Stack and models
- Task model `gpt-5.4-mini`; reflection model `gpt-6.1-sol`; judge `gpt-6-luna` (Decisions API) [FR §2]
- Durable agent on LangGraph with Postgres checkpoints; E2B sandboxes with no network; Vitest, TypeScript `tsc`, Prettier, a TypeScript lint, Stryker mutation testing, v8 coverage [FR §2]
- Optimisers: GEPA 0.1.4 (`tw-gepa`) and an ACE playbook (`tw-ace`: Generator, Reflector, Curator) [FR §2]
- LangGraph Studio for demos (local server only); OpenTelemetry traces (metadata only); MCP servers `tw-mcp`, `tw-write-mcp` [FR §2], [README]
- Python harness, `uv`; Node 24, pnpm [README]

### Architecture / data flow [FR §2]
- Task set `tw-tasks`: 30 Interview Buddy modules (14 train, 6 val, 10 held-out), hidden human tests, labelled mutants (1,588 type-valid), frozen and hashed. Val and held-out tests are deleted in every sandbox.
- Agent graph: `setup → llm → record → tools → … → finish → score`; kill-and-resume 10/10. Caps: 25 steps, 120k input tokens, $0.15 per run.
- Versioned artifacts: each version (prompt, SKILL.md, tools, playbook, settings) is immutable and loaded by hash; a champion pointer with history; rollback in one call.
- Graders: diagnosis text per run; the judge weighs 5% (only its behaviour question met the calibration target); `tw-eval`, cached by version hash.
- Gate `tw-gate`; production path `tw-write` (module or PR mode), `tw-write-mcp`, a GitHub Action (written, not installed), `tw-harvest` stub.
- Second target: `TW_TARGET=hire-rules` selects a 24-module benchmark library with 882 reference tests (mean reference score 0.982). [FR §2, §4]

- Task-set filters: 50–300 lines, at least 2 functions and 3 branches, existing direct line coverage ≤ 0.6, runtime I/O imports denied (drizzle-orm, postgres, next, next-auth …), `.tsx`/route/actions/hooks/schema excluded (source: `evals/config.yaml`).
- Studio: state contains the agent's messages (target repo code), so no `--tunnel` and don't share the server; local server only [README].
- GEPA's default reflection template asks for "all niche and domain specific factual information"; ours asks for general rules and forbids module and file names (source: second brain `day-05-gepa-round-1-system-prompt.md`, key idea 5).
- day6/c003 lost its minibatch (1.65 → 0.87) yet was the best on val; v007's ACE playbook had 10 bullets [FR §5, §3].

### Core mechanism
- Score = type-valid mutants the tests kill / type-valid mutants. A run that fails a hard gate (lint, type check, pass 3 times in a row) scores 0. Macro = mean of per-module means. [FR §1 note]
- Gate rules [GATE `config/gate.yaml`]: min_paired_modules 5; min_lift 0.10; 90% two-sided paired bootstrap CI, 10,000 resamples, lower bound > 0; gate pass rate not lower than the champion's; 0 violations; cost per run ≤ 1.10× the champion's. Promotion only on the held-out exam (`--split heldout --exam --promote --approved-by NAME`).
- GEPA: accepts a rewrite when it beats its parent on a 3-module train minibatch (1 run each), then scores it on val; reflection sees train diagnoses only; a name guard forbids module names. [FR §5], [CON §7]
- ACE: a playbook of short lessons, delta edits with helpful/harmful counters, 1,500-token budget, train-only reflection. [CON §9]
- Production PR mode: git diff base…head → changed `.ts` files under `src/` → changed functions → one agent run per module in E2B, head source overlaid on the frozen template → the gates plus coverage → a draft PR body. A test failing the same way three times is flagged as a "possible bug". Idempotent per repo + head SHA. [FR §7], [README]

### Key decisions (decision, reason, rejected alternative)
- Sealed held-out exam used once per version, never by an optimiser; promotion only on it with a named approver. Reason: val winners are inflated by picking the best of noisy candidates (v006: val 0.584, exam 0.422). Rejected: promote on val. [FR §3, §6]
- Paired bootstrap CI over modules, not a raw mean difference. Reason: module difficulty dominates; pairing keeps a module's two scores together. [GATE]
- All-or-nothing gates (a failing file scores 0). Reason: a test file that fails lint, types or flakes is unusable. Cost: most of the score is gate luck; partial credit is recommended but untested. [FR §5, §9]
- Reflection on train only, name guard. Reason: keep val and exam honest; stop memorising. [FR §2]
- GEPA's evaluation cache turned off (`cache_evaluation=False`). Reason: it keyed results by position and mixed train and val scores (c003 reported 0.742; measured 0.336). [FR §6]
- Built a clean benchmark (`hire-rules`) with a pre-registered rule before any paid run. Reason: test the "no room to improve" explanation. [FR §4]
- Tool set v3 (edit tool, tolerant `run_tests`) kept as a new version rather than editing v2. Reason: old scores must describe the code that produced them. Result: tool errors 0.92 → 0.08 per run but proven worse, −0.330. [FR §3, §6]

### Evaluation [FR §3, §4]
- Interview Buddy exam (10 held-out modules, macro): v001 hand-written seed 0.714 (2 runs, gate pass 80%); v009 naive 3-line seed 0.557; v007 ACE playbook 0.504; naive/c002 GEPA skill on the naive seed 0.480; v008 GEPA + ACE 0.442 (1 run); v006 GEPA best + 200k cap 0.422 (1 run). Every challenger rejected.
- Val scoreboard (6 modules, 2 runs, micro): v001 0.445; v002 0.443; v003 deliberately worse (lift −0.172, proven worse); day5/c003 0.336 (GEPA said 0.742); v004 0.139; v005 0.441; v006 0.584.
- hire-rules (8 held-out modules × 2 runs, macro): human reference tests 0.968; v010 neutral seed 0.726 (gate pass 81%); bench1/c005 GEPA 0.501 (56%), lift −0.225, CI [−0.353, −0.099], proven worse; v011 = v010 + require_green 0.769, +0.044, CI [−0.124, +0.250], reject. The rule never fired in 16 runs, so v011 vs v010 is an A/A test: noise about ±0.15.
- Where hire-rules' loss came from: every failed run failed pass ×3 (wrong expected values); c005's longer, more ambitious prompt (486 → 760 words) gave 7 failed runs vs the seed's 3.
- What the measurement caught [FR §6]: the cache collision (0.742); a repeated-minibatch bug; the tool fix that improved a proxy and lost on score; the val leader that lost on the exam; minibatch accepts up to +0.99 that later lost; the naive seed mocking the module under test (MOCK_TARGET); a Day 1 held-out leak (agents read a held-out test as a style example; fixed by deleting val and held-out tests in every sandbox).
- Optimisers also wrote plausible but wrong advice a person had to spot (a tool description misreading the pass-3-times rule; skill text asking for commands the tools don't have; playbook bullets shaped by one train module). [FR §6]
- Model check: `gpt-6.1-sol` micro 0.973 on 5 train modules (1 run each) vs `gpt-5.4-mini` 0.157 on the same modules; $0.107 vs about $0.043 per run. [FR §9]
- Demo PR (local only): branch `demo/tw-feature-1`; the agent found both changed functions, wrote 11 tests (186 lines) in 6 steps; lint, whole-project tsc and pass ×3 all passed; 100% of lines and 97% of branches of the module (v8, approximate); $0.0247 model + about $0.002 sandbox. [FR §7]

### Lab values (macro, from the dashboard datasets built from `reports/evaluations/*.json` and `reports/gates/*.json`, 22 Oct 2026)
- Interview Buddy, mock = val (6 modules × 2 runs), sealed = held-out (10 modules):
  - v001 hand-written: val 0.654, exam 0.714 (2 runs, gate pass 80%): champion
  - v009 naive 3-line seed: val 0.695 (best val macro), exam 0.557 (2 runs): vs v001 −0.157, CI [−0.366, +0.038], no proven difference
  - naive/c002 GEPA skill on the naive seed: val 0.625, exam 0.480 (2 runs): vs v001 −0.234, CI [−0.418, −0.046], proven worse
  - v007 ACE playbook: val 0.570, exam 0.504 (2 runs): −0.210, CI [−0.326, −0.094], proven worse
  - v006 GEPA best + 200k: val 0.546 (val micro 0.584, best of the POC), exam 0.422 (1 run): −0.193, CI [−0.459, +0.070], reject (interim)
  - v008 GEPA + ACE: val not measured, exam 0.442 (1 run): −0.173, CI [−0.359, +0.008], reject (interim)
- hire-rules, mock = val (4 modules × 2), sealed = held-out (8 modules × 2):
  - human reference tests: val 0.989, exam 0.968
  - v010 neutral seed: val 0.924, exam 0.726
  - bench1/c005 GEPA: val 0.810, exam 0.501: −0.225, CI [−0.353, −0.099], proven worse

- ACE playbook content: its 10 bullets were mostly about killing more mutants; the failures were type errors and the token cap on service modules; the Reflector never marked a bullet harmful (source: second brain `day-07-ace-playbook-and-held-out-arms.md`, "What Day 7 taught us"). c005 failed 7 of 16 exam runs vs v010's 3 [FR §4].

- Run-to-run swings: service modules flip between 0 and about 0.9 from run to run (source: second brain `day-05-gepa-round-1-system-prompt.md`, "What Day 5 taught us"); v001 exam macro 0.616 after run 1, 0.714 over both runs [FR §3].

### Why self-improvement didn't help here [FR §5]
- Strong seeds (measured): a 3-line prompt was level with the expert one on val; the hire-rules seed scored 0.924 on val against a 0.989 ceiling.
- All-or-nothing scoring (measured).
- Selection on noise (measured): 3 modules × 1 run minibatches; A/A noise about ±0.15.
- The cheap model follows long, ambitious prompts poorly (interpretation, supported by 7 vs 3 failures).
- The token cap (measured): 8 of 9 v002 service and I/O-edge runs stopped at 120k.
- Budget limited rollouts (measured): rounds stopped after 3–7 iterations.
- What it does not show: that GEPA or ACE can't work for test writing; a real lift under about 0.15 would be invisible at 10 modules × 2 runs.

### Cost [FR §8]
- $22.88 of OpenAI over the POC (ledger, 5,215 rows), under the $25 limit; agent runs $22.17 (97%), reflection $0.54, judge $0.17. E2B sandbox time extra and small (cents per day). About $0.045 per agent run.

### Limits and risks [FR §7, §9]
- `--open-pr` has never run against GitHub; no real PR has been through it; no reviewer verdicts (the plan asked for 5–10).
- Staging deploy and runbook not done.
- The agent tests the whole module, not only the changed functions; the repo's own ESLint and build are not run on the test file.
- A PR that changes dependencies is refused until the sandbox template is rebuilt.
- v001 never run on hire-rules: whether it transfers is unknown.
- Keys stay in the host process, never in a sandbox, prompt, transcript or log [README]. Config by name: `OPENAI_API_KEY`, `E2B_API_KEY`, `TW_APP_ID`, `TW_APP_PRIVATE_KEY`, `TW_TARGET`.

### How to run it [README]
- `uv sync`, `(cd evals/harness/ts && corepack pnpm install)`, `uv run pytest`; `uv run python -m evals.harness.sanity` (no keys)
- `docker compose -f infra/docker-compose.yml up -d`; `uv run tw-run --task <id> --version v001 --model gpt-5.4-mini`
- `scripts/studio.sh`, then Studio in Chrome
- `uv run tw-write module <path>`, `uv run tw-write pr --base <ref> --head <ref> --dry-run`

### Open questions / next steps [FR §9]
- More budget per decision (more held-out modules, more runs, bigger minibatches; a 5× GEPA round about $7).
- A stronger task model (test `gpt-6.1-sol` on the exam).
- Partial-credit scoring (suggestion, untested).
- Harness rules over prompt text (require_green built, off by default; pre-register each).
- Local models (Ollama) gap analysis, deferred.
- Reuse the harness for other agents (`TW_TARGET` already runs a second repo).
- Go-live steps: push the demo branch and run `--open-pr` once; secrets and a GitHub App; copy the workflow; collect verdicts on 5–10 real PRs.

## Off the page
- Remove costing completely: no dollar figures, spend totals, per-run costs, budget caps in dollars, or the gate's cost rule on either page (asked: 23 Oct 2026). Budget limits are described without money ("rounds stopped after 3–7 iterations").
- No individual people's names (asked: 23 Oct 2026). Interview Buddy, hire-rules and model names may appear.

## Outline
### Explainer (VOICE.md order, each section with its figure idea)
1. **An AI that coaches itself** (hero): the installer with the handbook (accent), a building with alarms, a fake fire, and the inspector holding a sealed envelope of new buildings.
2. **Why it matters**: tests are the smoke alarms of software; installing them is slow, so it's often skipped. An AI can install them, and the big promise is that it learns from its mistakes on its own. But "it got better" is easy to believe by luck. Figure: one building with few alarms and a fire nobody noticed, next to one with alarms going off.
3. **How it works** (5 steps):
   1. Three sets of buildings: practice (14), mock exam (6), sealed final (10). Figure: three groups of houses, the sealed group inside an envelope.
   2. The installer puts alarms in a building, alone in a locked room. Figure: installer, building, alarms.
   3. The strict check: we light fake fires and count how many alarms go off. One faulty alarm and the whole building scores zero. Figure: fires, alarms ringing, one building crossed out.
   4. Coaching itself: a senior coach reads what went wrong in the practice buildings and rewrites the handbook, or adds short lesson notes. Figure: handbook with crossed-out and new lines.
   5. The inspector's rule: the new handbook and the old one are tested on the same sealed buildings. Only a clear win, and a person's sign-off, replaces the old handbook. Figure: two bars with a range and the "clear win" line.
4. **What happened**: the hand-written handbook caught about 7 in 10 fake fires on the sealed buildings; every rewrite caught fewer (about 4 to 6 in 10). Interactive lab "Lucky practice score": pick a handbook, see its mock score and sealed score and the inspector's verdict. Then "Looked better, wasn't": four cards (a scoring mix-up that said 74%; fewer tool slips but a lower score; the mock-exam leader that lost the final; big wins on three practice buildings that vanished). Then "A fair practice town" (hire-rules): we built a simpler town where a better handbook should show; the rewrite was clearly worse. And "The installer itself works": on a real code change it put in 11 alarms that all worked.
5. **What it can't do**: it didn't get better here; a person has to read every rewrite (some advice was plausible and wrong); scores swing a lot from one try to the next, so small gains are invisible; it hasn't been used on a real team's change yet; a person signs off every promotion. Figure: person with a stamp beside the handbook.
6. **In one breath**: 2–3 sentences.
7. **Going deeper**: link to the tech view.

### Tech (VOICE.md order)
0. On this page (index at the top: At a glance, then every section)
1. At a glance: status, models, stack, targets, task set, result, owner, source repo (no cost row).
2. Architecture: box diagram (task set → E2B sandbox agent graph → gates → score → `tw-eval` → `tw-gate` → champion pointer; optimiser loop `tw-gepa` / `tw-ace` from train diagnoses; production path `tw-write`) + walkthrough.
3. Core mechanism: SubHeadings for the score, the gate (the one CodeBlock: `config/gate.yaml` rules), the optimisers (GEPA, ACE), PR mode.
4. Key decisions and trade-offs: DataTable decision / reason / rejected alternative.
5. Evaluation: SubHeadings for the Interview Buddy exam and val tables, the hire-rules benchmark table, what the measurement caught, why self-improvement didn't help, the model check (scores only).
6. Limits and risks.
7. Run it yourself: prerequisites and commands, keys by name.
8. Open questions / next steps.
