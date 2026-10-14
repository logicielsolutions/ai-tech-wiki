# The Paperclip software factory

Draft brief, skill step 1 (14 Oct 2026). Every fact cites a file in the source repo by its repo-relative path. Judgement calls and gaps are `TODO(ask)`, with draft options from the source so the interview can close them quickly.

## Identity
- Slug: paperclip-factory (source: the source repo's own name for the work, "Paperclip software factory", `factory-template/README.md` title)
- Title (2–5 words, the idea not the repo): A factory with one gate (asked: 14 Oct 2026)
- One-line pitch (≤ 90 chars, for a non-tech reader): TODO(ask). The first three drafts were declined; the person asked for the Luna entry's style ("doesn't X. It Y.", two short plain sentences) (asked: 14 Oct 2026). Drafts in that style:
  - "An AI team that doesn't need a supervisor. It works inside a contract you sign once." (84)
  - "An AI team that doesn't ask at every step. It works only inside what the client signed." (87)
  - "An AI software team that doesn't need watching. It stops when it steps outside the deal." (88)
- Tags (1–3): agents (from the shared set in `src/content/index.ts`); TODO(ask) whether to add a new `governance` tag (none of the existing five covers it)
- Status: TODO(ask). Source facts: "testing phase" on one machine (D-27); enforcement built and tested but switched off on the live instance (D-34, D-39, D-47); rollout paused since 14 Oct 2026 until the exported developer template is tested (D-52, `factory-rollout` branch of the PRD); a two-developer pilot is the next phase (`docs/2026-10-14-22-template-handover-plan.md` §7). Likely `experiment` or `pilot`
- Owner: Gurjeet Singh Saini, operator of the rollout (source: PRD header, `docs/2026-09-28-10-factory-rollout-prd.md`). Wiki owner Kumar Gaurav. TODO(ask) how to credit (operator only, or operator plus the manager who asked the research questions in docs 16, 18, 19)
- Source: the `paperclip` operations repo (local only, no git remote, `docs/2026-10-14-22-template-handover-plan.md` §2.3) and its `factory-template/` folder
- Last updated: 14 Oct 2026 (source: last commit `762dcda` on branch `handover/phase-2`, 14 Oct 2026; PRD D-52 on `factory-rollout`, 14 Oct 2026)

## Readers
- Non-tech reader we picture: leadership and managers at Logiciel (asked: 14 Oct 2026); the same audience as the source's manager briefings (`docs/briefing/2026-09-30-paperclip-factory-briefing.html`, `docs/briefing/2026-10-07-paperclip-for-non-technical-roles.html`)
- What they should be able to say after the explainer: draft from source, to confirm in the outline step: (1) a person agrees what to build and signs it once, and that signed contract is the only human gate; (2) after that, AI agents build, test and hand over the work on their own; (3) anything outside the contract is refused, stops the work and calls a person once, and only a person in the factory can restart it; (4) a person still merges the result, and it is in a testing phase, not yet used with a real client (PRD §2; non-tech briefing §1, §3, §7; briefing 2026-09-30 §1)
- Engineer we picture: a Logiciel developer or tech lead deciding whether to adopt the factory template for client work (asked: 14 Oct 2026; template is for Logiciel internal teams only, D-23; developer guide in doc 22 §6)
- What they should be able to decide after the tech page: whether the template fits their client work now or after the release gate (testing phase only, test repositories and credentials until the mandatory fixes close, D-27); what each governance layer actually stops and what it doesn't; which module switches to turn on and what that needs (Rust for the sandbox, a Slack webhook, GitHub Apps); and what is still open before production: authenticated mode, real GitHub, a real client pilot (source: doc 22 §6.3; briefing 2026-09-30 §5.1, §9; `docs/2026-09-28-14-mandatory-fixes-before-production.md`)

## The idea
- Problem it solves, as a situation: Paperclip runs a "company" of AI agents (analyst, project manager, developers, QA) that can build software, but out of the box any program on the machine could act as the boss, agents ran with the operator's own passwords and keys in reach, every permission prompt was approved automatically, and nothing stopped work when an agent did something it shouldn't (source: `docs/2026-09-28-02-security-and-governance-findings.md` F-01, F-03, F-06, F-13; 19 findings, 2 Critical, 7 High). The owner wanted full automation after planning, with no "ask a human" steps, yet nothing allowed that wasn't agreed (source: `docs/2026-09-28-03-governance-design.md` §1, owner quote). TODO(ask): confirm this framing for the non-tech reader
- How it works, in 3–6 plain steps (source: PRD §1–§2; briefing 2026-09-30 §1, §3, §4; non-tech briefing §3):
  1. **Agree and sign.** An AI business analyst asks the client rounds of questions and writes requirements with testable acceptance criteria. The client signs off one version of an **execution contract**: what "done" means, which code repositories, which tools and operations, which websites and data destinations, spend limits, and the end point (an open pull request). Changing the contract cancels the sign-off.
  2. **The team works on its own.** A PM agent splits the work into about one-day tickets; senior and junior developer agents build; a QA agent checks every acceptance criterion and sends failures back to the developer. No person is asked anything along the way.
  3. **Each agent works in a sealed room.** Every agent process runs inside a sandbox: it can't read the machine's passwords, keys or Paperclip's own data, can write only in its own work folder, and can reach only a short list of websites.
  4. **Outside the contract means refused, never "ask".** Anything the contract doesn't allow is denied automatically with a reason. A real rule break stops the work: the run is cancelled, the agent paused, the ticket tree held, and exactly one alert goes to a private Slack channel. A person fixes the cause in Paperclip; a Slack reply can never restart work. The work resumes only after a re-check, and the refused action is not replayed.
  5. **Hand-over by pull request.** The factory pushes a branch and opens a pull request through its own GitHub App. Only people can merge (tested against a mock GitHub; real GitHub not yet).
  6. **(Optional) talk from a chat app.** In a lab, the client can answer the analyst's questions, open new requests and sign off from Buzz, a chat workspace, with a signed reaction that the factory verifies and stores as evidence (docs 20, 21). TODO(ask) whether this belongs in the explainer's steps
- Visual metaphor (the everyday objects that stand for the parts): a workshop with a signed work order (asked: 14 Oct 2026). The signed work order is the contract, the fenced yard is the sandbox, a gatekeeper checks each tool, one bell rings in the office, and only a person opens the loading door (the merge). Detail: the client signs a work order at the front desk; inside a fenced yard the workers do whatever the order covers; a gatekeeper checks every tool against the order; reaching for something not on it turns a stop light red and rings one bell in the manager's office; only the office can turn the light green again, not someone shouting over the fence (Slack). The finished job leaves through a loading door that only a person can open (the merge)
- Worked example for "See it in action": TODO(ask). Source-backed candidates:
  - **The to-do app and the forbidden push** (recommended): the example contract is a small to-do web app with five plain acceptance criteria (`factory-template/contract/example.contract.json`). A developer finishes a ticket, QA fails it, the developer fixes it, QA passes it, with no person involved (demo DEM-2: 3 min 26 s, 4 runs, no alert; briefing 2026-09-30 §6a). Then a developer tries to force-push straight to the main branch: denied, the work stops 13 s after the wake with exactly one alert, a person resolves it in Paperclip, and the agent resumes with one wake while the push is never retried (PRD task 3.8; briefing §6b)
  - **A contract change**: the client edits the contract mid-way; the guard holds the work within about 0.1 s with one "Contract changed" alert; resolving before the new sign-off is refused (demo scenario 3; briefing §6c)
  - **The client in Buzz**: the client answers the analyst's numbered questions in a chat thread and signs off with a ✅ reaction (doc 20 §1)
- Interactive figure? TODO(ask). Draft: yes, a "what happens if an agent tries…" picker on example values baked into the page (run the tests, push a branch, read the SSH keys, force-push to main, use a tool not in the contract, edit its own settings), each showing allowed / refused and whether the work stops and alerts; labelled as examples; no API call (outcomes from PRD tasks 2.7, 3.8, 4.7 and D-43)
- The one code snippet for the tech page: TODO(ask). Drafts:
  - **The execution contract's machine block** (recommended), trimmed from `factory-template/contract/example.contract.json`: acceptance criteria, repository with protected branch, operations, data destinations, spend, `delivery.endpoint: "open_pr"`
  - The module switches in `config/factory.example.json` (`agentSandbox`, `contractPermissions`, `guardPlugin`, `githubDelivery`, `buzzNotifier`, `buzzBridge`, `claudeLogin`)
  - The developer setup commands (`bin/setup --config … --apply`, doc 22 §6.2)

## The facts
- Stack and models (source: briefing 2026-09-30 §2.1, §4; `factory-template/README.md` Parts and Requirements; PRD D-1, D-19, D-51):
  - Paperclip 2026.916.1, self-hosted (Node server, embedded PostgreSQL), pinned; the bootstrap refuses any other version
  - Agents: Claude Code through Paperclip's `claude_local` adapter on the ACP engine; Chief of staff, Business Analyst, Project Manager, Senior and Junior Developer, QA, plus Paperclip's built-in Summarizer and Reflection Coach (8 agents)
  - Model: Claude Opus 5 with thinking effort medium (D-51); Claude access through the company-provided Claude Code subscription on HIT (D-1); for developers, each person's own subscription (H-5)
  - Sandbox: Anthropic's `srt` (sandbox-runtime) 0.0.77, pinned, beta; Seatbelt on macOS, Bubblewrap on Linux; no Docker (D-19)
  - gov-shim: the in-house governance kit (Rust, Cedar policies) copied into the template, built from source at install, run as Claude hooks in deny-only mode (D-32, D-37)
  - The template: zero-dependency Node 24.11+ scripts (`bin/bootstrap`, `bin/setup`, `bin/sandbox`, `bin/contract`, `bin/snapshot`, `bin/secret-scan` and others), a company package, three Paperclip plugins (`factory-guard`, `buzz-notifier`, `buzz-bridge`), a Slack app manifest, 361 tests (doc 22 §10)
  - Alerts: a notify-only Slack app with one incoming webhook bound to one private channel (D-20)
  - Delivery: two GitHub Apps of the factory's own (agents; provisioner), rulesets and CI with tests, gitleaks, Semgrep and OSV-Scanner (D-46, D-49)
  - Buzz (Block, open source, a Nostr relay plus desktop app); the template signs Nostr events itself with no dependencies (commit `e5bb63c`)
- Architecture / data flow (source: briefing 2026-09-30 §5, Figure 1; doc 12 §4):
  - The template applies everything to Paperclip through its REST API (`bin/bootstrap`: desired state, dry run by default, one module per setting, re-run until it plans 0 changes) and installs the agent runtime.
  - Each agent run nests three layers: the wrapper (set as `CLAUDE_CODE_EXECUTABLE`), the `srt` sandbox, and Claude Code with the factory settings (`--settings`, `--strict-mcp-config`) and gov-shim hooks.
  - Controls and where they run: srt (OS sandbox around the Claude process); factory settings, 38 deny rules (Claude Code); gov-shim hooks (inside the sandbox); Tool Gateway policies generated from the contract (Paperclip server); factory guard (Paperclip plugin, server side); GitHub rulesets (GitHub); Paperclip built-ins (hire approval, run limits, isolated worktrees, review stage, audited skills).
  - The stop can't come from inside the agent: gov-shim denies, ends the turn (`continue: false`) and reports; the guard, outside the agent, records the exception, cancels the run, pauses the agent, holds the issue tree and sends one alert (doc 12 §4; tasks 3.6, 3.7).
  - Buzz: the `buzz-notifier` plugin posts signed status messages to a status channel; the `buzz-bridge` plugin polls the client channel every minute and relays allow-listed client messages into Paperclip as the client's own comments (docs 17, 20).
- Core mechanism (source: `factory-template/contract/SPEC.md`; PRD D-3, D-40, D-41; tasks 3.2, 3.4, 3.7):
  - The contract is a markdown issue document `contract` on the requirement, with exactly one machine block. Sign-off is a `human_only` `request_confirmation` card bound to one document revision and the contract's sha256 hash. It is in force only when the card is accepted, targets the latest revision, and the hash matches; any edit makes it stale.
  - Contract → permissions: per project a rate limit, one allow policy per role and app with the contract's exact tools (no wildcards), then a block; a tool a connection gains later is refused until the contract changes. The per-role base matrix (D-3) intersects with the contract's 12 named operations; nobody gets `pr.merge` or `deploy.*`.
  - Exception lifecycle: running → policy-stopped → notified → resolved → revalidated → resumed. Causes: `permission`, `credential`, `requirement`, `limit`, `waiting`, `repo_missing`. One record and one alert per dedupe key; only a board user in Paperclip resolves; a Slack actor is refused in code (D-41).
  - Agents changing an agent's own configuration is treated as a `permission` exception (D-43), found by the lifecycle tests.
- Key decisions (decision, reason, rejected alternative) (source: PRD §13; docs 03, 04, 11, 12, 13, 16, 18, 19, 22):
  - **One human gate, deny-only, never "ask"** (PRD §2; doc 03 §1). Reason: the owner wanted full automation after planning; Paperclip's ACP engine approves every prompt, and its "ask first" makes the agent end its run. Rejected: a 10-layer design built on human approvals.
  - **Sign-off is a versioned execution contract** (D-17, D-40). Reason: an adversarial review by another model, verified claim by claim, showed a plain approval card wasn't tied to what agents may do. Rejected: a company-wide allow-all tool profile.
  - **Isolation with `srt`, no Docker** (D-19; doc 13). Rejected: one Docker container, two containers, Docker Sandboxes, E2B Runtime (needs Linux with KVM), E2B cloud (client code leaves the machine). Fallback: a dedicated OS user; production guidance: a dedicated host.
  - **Keep the in-house gov-shim as the deny layer** (D-13, D-32). Rejected: Microsoft's Agent Governance Toolkit plugin (missed `rm -fr` variants, never scans tool output, its review defaults stall headless agents; "borrow ideas, not code") and `hookify` (regex only).
  - **Paperclip's own Tool Gateway for MCP** (D-13). Rejected for now: external MCP gateways (agentgateway, ToolHive, Docker MCP Gateway, IBM ContextForge, Obot and others); ToolHive preferred only for MCP outside Paperclip.
  - **Own notify-only guard plugin + Slack webhook** (D-20). Rejected: the community Slack plugin (it has approve, override and command features, so a chat message could act) and Paperclip's Slack connector (an agent tool that needs HTTPS).
  - **Template-first** (D-18): every change ships in `factory-template/` and is re-runnable on a fresh Paperclip; nothing configured by hand. Rejected: hand configuration on one machine.
  - **The factory's own GitHub Apps** (D-46, D-48). Rejected: Paperclip's GitHub connection (runs through Paperclip Cloud with a person's token, no limits), the operator's personal `gh` login, a fine-grained personal token.
  - **Endpoint is an open pull request** (D-21). Rejected: merge and deploy (out of scope).
  - **Reuse before building** (D-11 to D-15): about half the rollout switches on Paperclip built-ins; skills from Paperclip's catalog; the PRD stays in git, not mirrored in Paperclip.
  - **Buzz as the "room", Paperclip as the "ledger"** (doc 16). No Buzz plugin existed; both are ACP clients so neither can drive the other. Built: option A (one-way notifier), then the two-way bridge with signed sign-off behind a switch (docs 17, 20). Rejected: Buzz running the agents (it would replace Paperclip's orchestration).
  - **Orca not recommended for contract work** (doc 18 §7): feasible through a community adapter, but its agents run outside the sandbox, gov-shim, the gateway and cost tracking.
  - **CopilotKit OpenBot, OpenDots, OpenMuse: adopt none** (doc 19): none is a software factory or can replace Paperclip; only OpenBot could partly stand in for Buzz and needs a paid CopilotKit service; borrow OpenBot's governance ideas (fail-closed policy, append-only audit with who started a run).
  - **Claude login: a 1-year `claude setup-token` token for developers** (doc 22 §4, spike B). Reason: Paperclip keeps only the short-lived access token, which can expire about 1.3 h after a reconnect. Interim: an hourly reconnect job (default on HIT). Rejected for laptops: an API key (pay per token; fine for a shared server).
  - **Developer hand-over as a private git bundle without the lab tools** (H-1, H-6); one shared team Buzz relay (H-2); sandbox on for the pilot (H-4).
- Evaluation (what was measured, how, results) (source: briefing 2026-09-30 §8; PRD tasks 1.9, 2.7, 3.2, 3.8, 4.7; doc 22 §10):
  | Test | What was tried | Result |
  |---|---|---|
  | Trust boundary (2.7) | Read host secrets and Paperclip data; reach other ports; egress to non-allowlisted hosts; tamper with gov-shim or settings; escapes (`open`, Apple Events, `launchctl`, rc files, git hooks); an unmanaged `.mcp.json` | 98 of 98 probes refused at the srt layer; real agent runs refused by deny rules and gov-shim; normal work (commit, npm, temp) still works |
  | Lifecycle (3.8) | A forbidden force push; retries through 20 Bash forms, `gh`, the direct API, an unmanaged MCP server; resume; Slack | Stopped 13 s after the wake with exactly one alert; 9 of 10 direct-API retries refused, the 10th (self-config) found, fixed (D-43) and re-tested; resume woke once and repeated nothing; nothing from Slack reached Paperclip |
  | Delivery (4.7, mock GitHub) | Push to main in many forms, merge, self-approve, change rulesets, satisfy a check, rewrite CI, reach another repo | 27 of 27 probes refused at the srt layer; 7 of 8 refused at the Claude layer, the 8th a mock bug, fixed with a regression test; main never moved |
  | Contract permissions (3.2) | Paperclip's own policy dry run, every agent × tool | 100 of 100 decisions matched the contract |
  | Fresh install (1.9, phase 2) | A new Paperclip, company import, bootstrap | 0 planned changes after four runs; `bin/setup` to a plan of 0 in 167 s (fake Claude token) |
  | Bridge attacks (doc 20) | Unknown key, forged signature, look-alike request, stale revision, replay, edited request, control verbs, injection text | All refused live (11 attack tests) |
  | Template tests | `npm test` | 361 pass, 0 fail (338 inside the developer bundle) |
  - Not measured yet: a real client conversation (PRD 5.10), real GitHub (4.2–4.4 blocked on the operator), a real run through `bin/setup` with a real token, the Linux sandbox. TODO(ask) which one or two numbers to feature for a non-tech reader
- Cost: TODO(ask). Source facts: runs use a Claude subscription, and Paperclip records subscription runs as $0, so budget stops can't fire (F-08); run limits instead: 3600 s timeout, 50 runs a day per agent (D-9); the built-ins have 1000 cents a month each (task 1.7); the lab and bridge work used no LLM. No per-ticket or per-project cost has been measured
- Limits and risks (source: `docs/2026-09-28-14-mandatory-fixes-before-production.md` MF-01 to MF-11, R-1 to R-8; non-tech briefing §5–§6):
  - The live instance runs in `local_trusted` mode: any local program is the board (MF-01, authenticated mode, before production).
  - On the live instance the sandbox, contract permissions, guard and GitHub delivery are built and tested but switched off during testing (D-34, D-39, D-47).
  - Residual sandbox gaps: launchd reachable over XPC from an interpreter; an agent can truncate its own run log; `srt` is a beta; the Linux sandbox has never run (MF-10).
  - A Buzz sign-off proves nothing extra until authenticated mode; bridge and client key custody open (MF-11).
  - Budgets can't stop subscription runs (F-08); Paperclip changes fast and has a single lead developer (version pin, MF-06).
  - Agents can produce work that looks right but is wrong; a person merges every pull request.
  - Test repositories and test credentials only until the release gate (D-27).
- How to run it (source: doc 22 §6; `factory-template/BUNDLE-README.md`; `factory-template/README.md`):
  - Prerequisites: macOS or Linux with systemd; Node 24.11+; Paperclip exactly 2026.916.1; Claude Code CLI; own Claude subscription; git; the Buzz app and a key on the team relay; optional Rust for the sandbox, a Slack webhook, the GitHub Apps
  - Commands: `npm test`; `cp config/factory.example.json config/factory.json`; `bin/setup --config config/factory.json` (dry run) then `--apply`, re-run until it plans 0; `bin/bootstrap` plans 0
  - Names only, never values: the agent env var `CLAUDE_CODE_OAUTH_TOKEN` (a company secret reference), `CLAUDE_CODE_EXECUTABLE`; company secrets `buzz-notifier-key`, `buzz-bridge-key`, `GITHUB_TOKEN`; config `modules.agentSandbox`, `modules.contractPermissions`, `modules.guardPlugin`, `modules.githubDelivery`, `modules.buzzNotifier`, `modules.buzzBridge`, `modules.claudeLogin`, `modules.agentPermissions`
- Open questions / next steps (source: PRD D-52 and §10–§12; doc 22 §7, §10):
  - Rollout paused since 14 Oct 2026 until the exported template is tested (D-52)
  - Hand-over: phase 3 shared team Buzz relay; phase 4 private bundle; phase 5 pilot with one developer on macOS and one on Linux; phase 5b pre-built gov-shim so developers need no Rust (H-7)
  - PRD Step 4: the operator's GitHub App setup (4.2–4.4); Step 5: the real client channel and a pilot; Step 6: release gate 6.8 (all mandatory fixes) and template release
  - The operator still has to review the decisions agents took under D-35
- Sources and links: TODO(ask) which are safe to publish. The source repo has no remote, so cite by repo-relative path: the PRD, docs 02–04, 11–14, 16–22, `docs/briefing/`, `factory-template/README.md`, `factory-template/contract/SPEC.md`. External: Paperclip (`github.com/paperclipai/paperclip`), `srt` (`github.com/anthropic-experimental/sandbox-runtime`), Buzz (`github.com/block/buzz`)

## Off the page
- Anything to leave out: TODO(ask). Already kept out of this brief by rule: ids, tokens, keys, npubs, local paths and ports on the operator's machine, the operator's personal GitHub account and test repo names, the live company's full name. Candidates to confirm: the live instance's name (HIT); Paperclip's public security flaws (non-tech briefing §5); public production stories about Paperclip; competitor or vendor comparisons (TypeSafe AI's Jev, CopilotKit, Orca, Microsoft AGT); the manager's questions quoted in docs 16, 18, 19

## Outline
Draft only; confirmed in skill step 3 after the interview.
### Explainer
1. **The one-line idea**: hero in the chosen metaphor; pitch.
2. **Why it matters**: an AI team that can build software, but with nobody checking what it may touch.
3. **How it works**: the steps above, each with a figure reusing the metaphor.
4. **See it in action**: the chosen worked example and the "what if an agent tries…" picker.
5. **What it can't do**: testing phase only; switched off on the live instance; a person merges; wrong-but-plausible work; not yet tried with a real client.
6. **In one breath**.
7. **Going deeper**: link to the tech view.
### Tech
1. **At a glance**: DataTable of stack, model, status, owner, source.
2. **Architecture**: the layers diagram and data flow; where each control runs.
3. **Core mechanism**: the contract and sign-off rule, contract → permissions, the exception lifecycle, the one code snippet.
4. **Key decisions and trade-offs**: including the alternatives researched (isolation, governance kits, MCP gateways, Slack, GitHub, Buzz, Orca, CopilotKit, Claude login).
5. **Evaluation**: attack, lifecycle, delivery and install tests.
6. **Limits and risks**: mandatory fixes and testing-phase relaxations.
7. **Run it yourself**: developer setup.
8. **Open questions / next steps**.
9. **Sources**.
