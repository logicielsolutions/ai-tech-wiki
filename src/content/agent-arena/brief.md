# Agent Arena: loops vs graphs

## Identity
- Slug: agent-arena
- Title (2–5 words, the idea not the repo): Loops vs graphs for agents (asked: 9 Nov 2026)
- One-line pitch (≤ 90 chars, for a non-tech reader): How you plan an AI agent's work matters more than which framework you build it with (asked: 9 Nov 2026)
- Tags (1–3): agents, evals, llms
- Status: experiment (source: README.md "Status (Day 5)"; a one-week project, 2 Nov to 6 Nov 2026)
- Owner: Gurjeet Singh (source: AI Team Board AIT-1030; repo author)
- Source: the agent-arena repo, its `reports/` and `docs/demo-script.md`; pages say "the agent-arena repo" and never name or link the GitHub repo (asked: 9 Nov 2026)
- Last updated: 9 Nov 2026

## Readers
- Non-tech reader we picture: any colleague, e.g. someone from finance or HR (asked: 9 Nov 2026)
- What they should be able to say after the explainer: "How you lay out an AI agent's work (one loop, or a planned graph with checks) matters more than which framework you pick; a stronger model hides the difference, and the frameworks differ in what they give you for running it, not in results."
- Engineer we picture: someone about to build an agent and choosing between plain Python, LangChain, LangGraph and CrewAI, or between a tool loop and an explicit graph.
- What they should be able to decide after the tech page: which framework (or none) and which shape (loop or graph) to use, which stop rules and operational features they must hand-build in each, and what a graph costs over a loop.

## The idea
- Problem it solves, as a situation: every framework claims to be the best way to build agents, but each demo uses a different task, model and setup, so nobody can compare them. Agent Arena gives seven builds of the same bug-fixing agent the same bugs, model, tools, sandbox, budgets and log, and counts the results (source: README.md intro).
- How it works, in 3–6 plain steps:
  1. Plant a small bug in working code whose tests then fail (15 bugs: 5 simple, 5 complex, 5 hard) (source: README.md "Bug set").
  2. Give each agent build the same broken code in its own locked box (a Docker container, no network), the same four tools (list, read, write a file, run the tests) and the same limits: 20 model calls, 600 s, $0.50 (source: README.md "Sandbox and tools", final report).
  3. Loop builds: one agent repeats "think, use a tool" until the tests pass or a stop rule fires (source: README.md "Builds", "Stop rules").
  4. Graph builds: a planned route: look at everything, sort the bug (simple or complex), plan if complex, three fixers try at once with tests between attempts (up to 3 each), pick the best, a reviewer checks it, optionally a human approves (source: README.md "Graph builds").
  5. The referee: after the agent stops, the harness runs the tests itself; solved = they all pass and no test file was touched (source: README.md "Solved").
  6. Every step is logged the same way, so runs are scored and compared on numbers (source: README.md "Event log", "Scoring").
- Visual metaphor (the everyday objects that stand for the parts): a car repair shop. The bug is a broken car; the sandbox is the repair bay; the four tools are the toolbox; a test drive is the referee (tests pass). Loop = one mechanic who keeps tinkering until the car runs or the shift ends. Graph = a workshop with a job plan: inspect, sort the job (simple or complex), plan if complex, three mechanics try fixes in their own bays, the foreman picks the best, a second mechanic checks it, the customer may sign off first. The accent goes on the fix (the repaired part / the plan that produces it) (asked: 9 Nov 2026)
- Worked example for "See it in action": the model switch lab (below) on the measured solve rates; plus the 15 hard bugs x3 on qwen3:32b, where loops solved 5 to 14 of 15 and graphs 14 to 15 of 15 (asked: 9 Nov 2026)
- Interactive figure? yes: a model switch (`model-lab.tsx`). Four choices: a small model on a laptop (qwen3:4b, bugs 001-010 x1), a big model on a rented GPU (qwen3:32b Ollama Q4, bugs 001-010 x3), the same big model on the 5 hard bugs x3 (hard solved per build), OpenAI's small paid model (gpt-5.4-mini, bugs 001-010 x3); each build's solved bar and median time, from model-comparison.md, labelled as recorded results (asked: 9 Nov 2026)
- The one code snippet for the tech page (what it shows): the graph wiring in LangGraph (`build()` in `agents/graph_langgraph.py`): the fix-and-test subgraph, the router that returns `Send` x3, and the conditional edges, trimmed (asked: 9 Nov 2026)

## The facts
- Stack and models: Python, `uv`, Docker sandbox (python:3.12-slim + pytest; `--network none`, 512 MB, 1 CPU, 256 pids, non-root). Frameworks: openai 2.54.0, langchain 1.4.8 + langchain-openai 1.7.3, langgraph 1.2.19 (prebuilt 1.1.1, langgraph-checkpoint-sqlite 3.1.3), crewai 1.15.34 (source: README.md "Builds", pattern-grid.md). Models: qwen2.5:3b and qwen3:4b on local Ollama; qwen3:32b on a Colab GPU (Ollama Q4_K_M, thinking on, Day 2–3; vLLM Qwen/Qwen3-32B-FP8, thinking off, Day 4 demo only); openai/gpt-5.4-mini (source: model-comparison.md, demo-script.md). Optional tracing: self-hosted Langfuse v4.72.0 (source: README.md "Tracing").
- Architecture / data flow: CLI `arena` → runner → one Docker container per run (or per graph candidate) → the build's agent → every model request through one metered httpx transport (`MeteredTransport`) shared by all builds → event log `runs/<run_id>.jsonl` → `arena score` / `arena dashboard` / `arena ui` / Langfuse (source: README.md "Models", "Event log", "Tracing", "Web UI").
- Seven builds (source: README.md "Builds"): `plain` (hand-written loop over the OpenAI SDK), `langchain` (`create_agent` + middleware), `langgraph` (prebuilt `create_react_agent`), `crewai` (one Agent, one Task, one Crew), and the graph three ways: `graph-plain` (hand-written state machine), `graph-langgraph` (`StateGraph`, subgraph, `Send`, `interrupt`), `graph-crewai` (Flows: `@start`/`@listen`/`@router`, `@human_feedback`).
- Graph shape (source: README.md "Graph builds"): gather (no model call) → triage (simple/complex) → plan (complex only) → fan-out: 3 candidates, each a fix-and-test subgraph in its own container, up to 3 attempts → select (tests pass, no test file touched, smallest diff) → [approve] → apply → review (reject → one more fan-out round with feedback) → end; no candidate passed → human (hint) or stop `needs_human`.
- Core mechanism: stop rules `success`, `step_limit`, `time_budget`, `cost_cap`, `no_progress` (repeat, same_failures, tool_errors; N=3), `agent_done` (after 2 nudges where possible), `needs_human`, `not_approved`/`approval_timeout`, `error`; hand-built rules live in one place, `RunContext.stop_reason()`, called at each build's pre-model-call hook; the shared transport is a backstop (no request past the cost cap, time budget or `max_steps + 2`) (source: README.md "Stop rules").
- Key decisions (decision, reason, rejected alternative):
  - Same prompts, tools, sandbox, transport, budgets and log for all builds, so only orchestration differs (source: README.md intro, pattern-grid.md).
  - Graph node bodies and prompts shared (`agents/graph_common.py`); each build only wires them with its own primitives (source: README.md "Graph builds").
  - Tool timeout hand-built for all builds (120 s, never past the budget): LangChain and CrewAI have none, LangGraph's `step_timeout` bounds a whole superstep and can't stop the hung thread (source: README.md "Sandbox and tools").
  - SDK retries off in every build (their back-off ignores the time budget); the transport retries gateway errors and dropped connections up to 3 times instead (source: README.md "Models").
  - Streaming forced and folded back, because Cloudflare-style tunnels drop a response silent for 120 s (qwen3's long thinking) (source: README.md "Models").
  - Solved is decided by the harness's own final test run plus sha256 of protected files, not by the agent saying it's done (source: README.md "Solved").
  - Endpoint errors are counted apart and left out of solve rates, because they say nothing about the model (source: README.md "Scoring").
  - Approval run clock stops while waiting for a human; no answer in 20 min = not applied (source: agent-arena hub Decisions, 5 Nov 2026).
  - `@label` on model ids so the same model served differently is scored apart (source: agent-arena hub Decisions, 5 Nov 2026).
- Evaluation (source: reports):
  - Runs logged: 799 with a real model (686 sweep runs, 44 race, 64 chaos, 5 replay), counted from `runs/*.jsonl` on 9 Nov 2026 (mock-model and experiment runs excluded). The ticket and meeting call it "700 runs".
  - qwen3:32b (Colab, Ollama Q4), all 15 bugs x3 (model-comparison.md): loops plain 44/45, langgraph 41/45, langchain 39/45, crewai 31/45 (hard bugs 14, 11, 10, 5 of 15); graphs graph-langgraph 45/45, graph-plain 44/45, graph-crewai 44/45 (hard 15, 14, 14 of 15). CrewAI loop stop reasons: agent_done 29, success 15, time_budget 1 (a stop reason is the agent's view; it still solved 31/45, so some agent_done runs were fixed). Median time loops 64–81 s, graphs 96–133 s.
  - gpt-5.4-mini, bugs 001–010 x3, all seven builds (final-openai-gpt-5.4-mini.md): 208/210 solved; six builds 30/30, crewai 28/30. Total cost $0.79 for 210 runs (plus a $0.0043 smoke run). Loops ~$0.003 per run, graphs ~$0.005; graph ~65% more per solved bug; graph ~1.6x the input tokens. Median time loops 6 s (crewai 12 s), graphs 9–10 s. The two CrewAI misses: after three parallel `read_file` calls CrewAI never made the next model call, until its own `max_execution_time` fired at ~600 s (a framework stall, not the model).
  - qwen3:4b local, bugs 001–010 x1: plain 7/10 (med 330 s), graph-plain 9/10 (470 s), graph-langgraph 7/10 (603 s), graph-crewai 10/10 (555 s) (model-comparison.md). qwen2.5:3b solved 0/8 in the race runs on bugs 008 and 012 (model-comparison.md race table: 0/2 per loop build).
  - Prompt overhead: in the graph builds the first request is the same 1,033–1,034 tokens in plain, LangGraph and CrewAI, since our nodes build the prompts (source: UI takeaways in `src/arena/ui/static/app.js`). Loop builds on gpt-5.4-mini: first call 393 tokens (plain, langchain, langgraph) vs 458 (crewai) (model-comparison.md).
  - Chaos (a tool made to fail, return stale results, or hang): every build stopped in every scenario (weekly report, 2026-11-05).
  - Speed, 5 Nov 2026, bug 002, LangGraph graph: Colab vLLM 27 s solved, first token 0.8 s median; local qwen3:4b 586 s solved, first token 19 s median. One request decodes at about the same speed (vLLM 41 tok/s, local 40 tok/s); three at once: vLLM 81 tok/s aggregate in 3.6 s, local Ollama 36 tok/s in 8.0 s (it queues). Most of the speed-up is thinking off (~90 output tokens per call instead of ~740) (source: docs/demo-script.md, UI takeaways).
  - Plain Python hand-builds each operational feature in about 60 lines, because the node bodies are shared (source: UI takeaways in `src/arena/ui/static/app.js`; pattern-grid.md: graph-plain resume about 60 lines).
  - Operations (pattern-grid.md): LangGraph gives checkpoints, resume after a kill, time travel and pause built in; CrewAI Flows give persisted state and human feedback, resume position and time travel were hand-built; plain Python hand-builds everything (about 60 lines for resume in graph-plain). Resume after SIGKILL shown in all three graph builds on real models; approval in Slack approved after 122 s with the run clock at 13.7 s.
- Cost: $0 on local and Colab models; $0.79 for the 210 gpt-5.4-mini runs (source: final report).
- Limits and risks:
  - Bugs are tiny Python packages with one planted mutation each; results don't prove anything about large real repos (source: README.md "Bug set").
  - A strong model (gpt-5.4-mini) solves almost everything in every build, so the frameworks no longer separate on bugs 001–010 (source: final report notes).
  - Small local models (qwen2.5:3b, qwen3:4b) are slow or fail; one laptop GPU serves one request at a time (source: README.md, model-comparison.md).
  - qwen3:32b on Colab runs through a temporary Cloudflare tunnel whose URL changes when the notebook restarts (source: agent-arena hub).
  - A request in flight at a kill is not logged but may be billed by a paid API (source: pattern-grid.md caveat).
  - CrewAI's `max_execution_time` can't stop a hung tool (631 s vs 240 s) (source: README.md).
- How to run it: `uv sync`, `ollama pull qwen2.5:3b`, `uv run arena generate`, `uv run arena run --bug 008 --agent plain`, `uv run arena race --bug 006 --markdown`, `uv run arena score --latest`, `uv run arena ui` (source: README.md "Setup", "CLI").
- Open questions / next steps: parked as a reusable bench for testing new frameworks or models (asked: 9 Nov 2026); count tokens of model calls that time out (source: agent-arena hub Next actions).
- Sources and links (for the brief only): agent-arena README.md, reports/model-comparison.md, reports/final-openai-gpt-5.4-mini.md, reports/pattern-grid.md, docs/demo-script.md, AIT-1030.

## Off the page
- Anything to leave out (names, clients, internal numbers): the GitHub repo name and link (asked: 9 Nov 2026). Never on the page: the Colab tunnel URL, the Slack channel id, keys, endpoint URLs.

## Outline
### Explainer (VOICE.md order, each section with its figure idea)
1. The one-line idea: hero, a repair shop with one mechanic looping on a car (left) and a workshop with a job board, three bays and a foreman (right).
2. Why it matters: every framework says it is the best way to build an agent, but each demo uses a different car; figure: three shops each with a different car, no way to compare.
3. How it works (steps):
   1. The same broken car for everyone: 15 planted bugs, tests that fail. Figure: car with a fault light, a test-drive flag.
   2. The same bay, toolbox and clock: locked box, 4 tools, 20 tries, 10 minutes, 50 cents. Figure: bay with toolbox and clock.
   3. One mechanic who keeps trying (the loop). Figure: mechanic with a circular arrow.
   4. A workshop with a plan (the graph): inspect, sort, three bays, foreman picks, checker. Figure: the job route left to right.
   5. The test drive decides: the shop runs the tests itself, and touching the tests doesn't count. Figure: test-drive flag with a good mark.
4. See it in action: model switch lab (recorded results, bugs 001-010) + key numbers on the hard bugs (loops 5-14 of 15, graphs 14-15 of 15, about 800 runs, 79 cents for 210 runs).
4b. Where the frameworks really differ: Tiles (LangGraph most built in; CrewAI some; plain code everything by hand, about 60 lines each). Follows the safety-net entry's precedent of an extra explainer section before the limits.
5. What it can't do: tiny practice bugs, not a real codebase; a strong model hides the difference; small laptop models are slow; frameworks differ in running features (pause, resume, rewind), which needed hand work outside LangGraph; a human stays in charge through approval. Figure: Compare tile.
6. In one breath.
7. Going deeper: link to the tech view.
### Tech (VOICE.md order)
0. On this page (At a glance, then every section)
1. At a glance: DataTable (builds, frameworks + versions, models, sandbox, budgets, runs, cost, status, owner, source).
2. Architecture: boxes-and-arrows diagram (CLI → runner → container → build → metered transport → model; event log → score/dashboard/UI/Langfuse) + the seven builds table.
3. Core mechanism: SubHeadings "The graph" (shape diagram + walkthrough + LangGraph CodeBlock) and "Stop rules" (DataTable: rule, plain/langchain/langgraph/crewai native vs hand-built).
4. Key decisions and trade-offs: DataTable (decision, reason, rejected alternative).
5. Evaluation: SubHeadings "Loops vs graphs on qwen3:32b", "The same bugs on three models", "Cost and tokens", "Speed: GPU vs laptop", "What each framework gives you" (pattern grid for the three graph builds), "Failure modes" (CrewAI stall after parallel tool calls; max_execution_time vs hung tool; chaos; long silent replies).
6. Limits and risks.
7. Run it yourself.
8. Open questions and next steps.
