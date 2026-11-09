import { BulletList, Callout, Code, CodeBlock, DataTable, Figure, PageIndex, Prose, Section, SubHeading } from "@/components/wiki";

/** Trimmed from build() in src/arena/agents/graph_langgraph.py: the shared node bodies (g.*) wired with LangGraph primitives. */
const SNIPPET = `sub = StateGraph(CandidateState, output_schema=CandidateOutput)   # fix-and-test, one per candidate
sub.add_node("fix", candidate_node("fix", g.fix))
sub.add_node("test", candidate_node("test", g.test))
sub.add_node("finish", lambda s: {"candidates": [g.finish(s)]})       # reducer: operator.add
sub.add_edge(START, "fix"); sub.add_edge("fix", "test")
sub.add_conditional_edges("test", lambda s: "fix" if g.after_test(s) == "fix" else "finish")  # retry <= 3
fix_and_test = sub.compile()

def router(decide):                        # the shared routing decision, LangGraph's way
    def route(state):
        dst = decide(state)
        if dst == "fix":                   # fan out: one Send per candidate, width is data
            return [Send("fix_and_test", {**c, "candidates": []}) for c in g.candidate_inputs(state)]
        return END if dst == "END" else dst
    return route

graph = StateGraph(GraphState)
...                                        # gather, triage, plan, select, apply, review, human, approve
graph.add_node("fix_and_test", fix_and_test)                  # a compiled subgraph as a node
graph.add_conditional_edges("triage", router(g.after_triage), ["plan", "fix_and_test", END])
graph.add_edge("fix_and_test", "select")
graph.add_conditional_edges("select", router(g.after_select), ["approve", "apply", "human", END])
graph.add_conditional_edges("review", router(g.after_review), ["fix_and_test", END])
app = graph.compile(checkpointer=Saver(conn, g))             # a SqliteSaver: resume and time travel come with it`;

const BUILD_ROWS = [
  ["plain", "loop", "A hand-written tool loop over the OpenAI SDK", "openai 2.54.0"],
  ["langchain", "loop", <span key="a">LangChain v1 <Code>create_agent</Code> + middleware</span>, "langchain 1.4.8, langchain-openai 1.7.3"],
  ["langgraph", "loop", <span key="b">Prebuilt <Code>create_react_agent</Code> (deprecated since 1.0, still shipped)</span>, "langgraph 1.2.19 (prebuilt 1.1.1)"],
  ["crewai", "loop", "One Agent, one Task, one Crew (sequential)", "crewai 1.15.34"],
  ["graph-plain", "graph", "The graph as a hand-written state machine", "none"],
  ["graph-langgraph", "graph", <span key="c"><Code>StateGraph</Code>, subgraph, <Code>Send</Code>, <Code>interrupt</Code></span>, "langgraph 1.2.19"],
  ["graph-crewai", "graph", <span key="d">CrewAI Flows: <Code>@start</Code>, <Code>@listen</Code>, <Code>@router</Code>, <Code>@human_feedback</Code></span>, "crewai 1.15.34"],
];

const STOP_ROWS = [
  ["success", "hand-built", <span key="a">hand-built in <Code>before_model</Code>, <Code>jump_to: end</Code></span>, <span key="b">hand-built in <Code>pre_model_hook</Code>; it can only raise</span>, <span key="c">hand-built in <Code>before_llm_call</Code> (raises <Code>HookAborted</Code>)</span>],
  ["step_limit", "hand-built", <span key="d">native <Code>ModelCallLimitMiddleware</Code></span>, <span key="e">native <Code>recursion_limit</Code> (3 supersteps per call)</span>, <span key="f">native <Code>max_iter</Code> (+1 forced final call)</span>],
  ["time_budget", "hand-built", "hand-built", "hand-built", <span key="g">native <Code>max_execution_time</Code> + hand-built</span>],
  ["cost_cap", "hand-built", "hand-built", "hand-built", "hand-built"],
  ["no_progress", "hand-built", "hand-built", "hand-built", "hand-built"],
  ["nudge before agent_done", "2 nudges", <span key="h">2 nudges via <Code>after_model</Code> + <Code>jump_to: model</Code></span>, "not possible: any reply without a tool call ends the graph", "not possible: such a reply is the final answer"],
];

const DECISION_ROWS = [
  ["Same prompts, tools, sandbox, transport, budgets and event log in every build", "Only the orchestration may differ, or the numbers compare setups, not frameworks", "Each framework's own quick-start defaults"],
  [<span key="a">Graph node bodies and prompts shared (<Code>agents/graph_common.py</Code>); each build only wires them</span>, "The three graph builds then differ only in their primitives; they emit the same node and route events", "Writing each graph natively from scratch"],
  ["Hand-built tool timeout in all builds (120 s, never past the budget)", <span key="b">LangChain and CrewAI have none; LangGraph&apos;s <Code>step_timeout</Code> bounds a whole superstep and can&apos;t stop the hung thread</span>, "Each framework's own timeouts"],
  [<span key="c">One metered httpx transport (<Code>MeteredTransport</Code>) for every model request; SDK retries off</span>, "One place counts tokens and cost and enforces the budget; SDK back-off ignores the time budget. The transport retries 429/502/503/504/524 and dropped connections up to 3 times", "Per-framework callbacks for metering; SDK retries"],
  ["Ask the endpoint to stream, fold it back into a normal response", "Cloudflare-style tunnels drop a response silent for 120 s, which qwen3's long thinking replies are", "Non-streamed requests"],
  ["Solved = the harness's own final pytest run passes the full count and no protected file changed (sha256 before and after)", "An agent's \"done\" proves nothing; editing tests must not count as a fix", "Trusting the agent's stop reason"],
  ["Endpoint errors counted apart, left out of rates and medians", "A dropped tunnel says nothing about the model or the build", "Counting them as failures"],
  [<span key="d">An <Code>@label</Code> on model ids (<Code>compat/qwen3:32b@vllm-fp8</Code>), not sent to the endpoint</span>, "The same model name served differently (Ollama Q4 vs vLLM FP8) is scored apart", "Mixing them under one name"],
  ["The run clock stops while waiting for a human approval; no answer in 20 min = not applied", "A slow human must not use up the agent's time budget", "Counting the wait against the 600 s"],
];

const LOOP_GRAPH_ROWS = [
  ["plain", "loop", "44/45", "14/15", "81 s", "438 s", "3169/3707", "success 43, time_budget 2"],
  ["langgraph", "loop", "41/45", "11/15", "64 s", "192 s", "2511/2948", "success 39, time_budget 3, agent_done 3"],
  ["langchain", "loop", "39/45", "10/15", "78 s", "602 s", "2873/3434", "success 39, time_budget 5, no_progress 1"],
  ["crewai", "loop", "31/45", "5/15", "67 s", "219 s", "2767/3231", "agent_done 29, success 15, time_budget 1"],
  ["graph-langgraph", "graph", "45/45", "15/15", "131 s", "602 s", "6368/5547", "success 43, needs_human 2"],
  ["graph-plain", "graph", "44/45", "14/15", "96 s", "510 s", "6380/4470", "success 42, needs_human 3"],
  ["graph-crewai", "graph", "44/45", "14/15", "133 s", "602 s", "6356/4934", "success 43, time_budget 1, needs_human 1"],
];

const MODEL_ROWS = [
  ["plain", "7/10 · 330 s", "30/30 · 54 s", "30/30 · 6 s"],
  ["langchain", "–", "29/30 · 48 s", "30/30 · 6 s"],
  ["langgraph", "–", "30/30 · 48 s", "30/30 · 6 s"],
  ["crewai", "–", "26/30 · 47 s", "28/30 · 12 s"],
  ["graph-plain", "9/10 · 470 s", "30/30 · 75 s", "30/30 · 9 s"],
  ["graph-langgraph", "7/10 · 603 s", "30/30 · 102 s", "30/30 · 9 s"],
  ["graph-crewai", "10/10 · 555 s", "30/30 · 99 s", "30/30 · 10 s"],
];

const COST_ROWS = [
  ["plain", "30/30", "393", "2814/238", "$0.0879", "$0.0029"],
  ["langchain", "30/30", "393", "2810/235", "$0.0887", "$0.0030"],
  ["langgraph", "30/30", "393", "2780/235", "$0.0855", "$0.0029"],
  ["crewai", "28/30", "458", "3000/227", "$0.0901", "$0.0032"],
  ["graph-plain", "30/30", "840", "4220/478", "$0.1432", "$0.0048"],
  ["graph-langgraph", "30/30", "840", "4324/476", "$0.1457", "$0.0049"],
  ["graph-crewai", "30/30", "840", "4382/512", "$0.1469", "$0.0049"],
];

const FEATURE_ROWS = [
  ["Routing (simple vs complex)", "hand-built (table of decision functions)", "built-in conditional edges", <span key="a">built-in <Code>@router</Code> labels + <Code>@listen</Code></span>],
  ["Retry counter (fix → test → fix, max 3)", "hand-built", <span key="b">hand-built state field; the cycle is a built-in edge (<Code>RetryPolicy</Code> retries exceptions only)</span>, "hand-built field; the cycle is a built-in label"],
  ["Subgraph", "hand-built (a function)", <span key="c">built-in: a compiled <Code>StateGraph</Code> as a node</span>, <span key="d">hand-built: a second <Code>Flow</Code> kicked off inside a method</span>],
  ["Parallel candidates", "hand-built (thread pool)", <span key="e">built-in <Code>Send</Code> × N (width is data)</span>, <span key="f">built-in but static: 3 <Code>@listen</Code> methods + <Code>and_()</Code></span>],
  ["Human approval", "hand-built (a function call)", <span key="g">built-in <Code>interrupt()</Code>, resumed with <Code>Command(resume=…)</Code></span>, <span key="h">built-in <Code>@human_feedback</Code></span>],
  ["Resume after SIGKILL", "hand-built (a JSON line per node, about 60 lines)", <span key="i">built-in <Code>SqliteSaver</Code>; <Code>invoke(None)</Code> continues</span>, <span key="j">built-in state (<Code>@persist</Code>) + hand-built position: <Code>kickoff</Code> reruns from <Code>@start</Code>, an <Code>entry</Code> router jumps ahead</span>],
  ["Time travel (rewind, change, replay)", "hand-built (snapshot per node)", <span key="k">built-in: <Code>get_state_history</Code> → <Code>update_state(…, as_node=…)</Code></span>, "hand-built on built-in storage"],
  ["Drawing", "hand-built (ascii, Mermaid)", <span key="l">built-in <Code>draw_mermaid()</Code></span>, <span key="m">built-in <Code>Flow.plot()</Code></span>],
];

function box(x: number, y: number, w: number, label: string, sub?: string, strong = false) {
  return (
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
}

function line(d: string, dashed = false) {
  return <path d={d} fill="none" stroke="var(--color-muted)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dashed ? "4 5" : undefined} />;
}

function ArchitectureDiagram() {
  return (
    <svg
      viewBox="0 0 800 300"
      className="h-auto w-full min-w-[680px]"
      role="img"
      aria-label="Architecture. The arena CLI starts a run: one Docker container per run, or per graph candidate. The chosen build (one of seven) calls the four shared tools inside the container, and every model request goes through one metered transport to the model endpoint. Every event goes to the run's JSONL log, which feeds arena score, the dashboard, the web UI and Langfuse."
    >
      {box(20, 40, 130, "arena run", "CLI · sweeps")}
      {line("M150 67H200")}
      {box(200, 40, 200, "build (1 of 7)", "loop or graph", true)}
      {line("M400 67H450")}
      {box(450, 40, 160, "MeteredTransport", "budget · retries")}
      {line("M610 67H650")}
      {box(650, 40, 130, "model", "Ollama · vLLM · OpenAI")}
      {line("M300 94V140")}
      {box(200, 140, 200, "4 tools", "list · read · write · test")}
      {line("M400 167H450")}
      {box(450, 140, 330, "Docker sandbox per run / candidate", "--network none · 512 MB · 1 CPU")}
      {line("M300 194V240H200", true)}
      {line("M530 94V120H300", true)}
      {box(20, 220, 180, "runs/<run_id>.jsonl")}
      {box(450, 230, 330, "arena score · dashboard · ui · Langfuse")}
      {line("M200 240H450", true)}
      <text x={20} y={200} fontSize={12} fill="var(--color-muted)">
        dashed: every event
      </text>
    </svg>
  );
}

function GraphDiagram() {
  return (
    <svg
      viewBox="0 0 800 260"
      className="h-auto w-full min-w-[680px]"
      role="img"
      aria-label="The bug-fixing graph. gather, then triage. Simple goes straight to the fan-out, complex goes through plan first. The fan-out runs three fix-and-test candidates, each up to three attempts in its own sandbox. select picks the winner, then an optional approve, then apply, then review. review can reject back to the fan-out. If no candidate passed, human gives a hint and the fan-out runs again."
    >
      {box(10, 100, 80, "gather")}
      {line("M90 120H115")}
      {box(115, 100, 80, "triage")}
      {line("M195 120H250")}
      {line("M155 100V40H200")}
      {box(200, 20, 70, "plan")}
      {line("M270 40H300V100")}
      {box(250, 100, 170, "fix ⇄ test × 3", "3 candidates, ≤ 3 tries", true)}
      {line("M420 127H445")}
      {box(445, 100, 70, "select")}
      {line("M515 120H540")}
      {box(540, 100, 80, "[approve]")}
      {line("M620 120H640")}
      {box(640, 100, 60, "apply")}
      {line("M700 120H715")}
      {box(715, 100, 75, "review")}
      {line("M752 140V200H335V154", true)}
      <text x={540} y={218} fontSize={12} fill="var(--color-muted)">
        reject → one more round
      </text>
      {line("M480 140V180")}
      {box(430, 180, 100, "human")}
      {line("M430 200H380V154", true)}
      <text x={10} y={218} fontSize={12} fill="var(--color-muted)">
        none passed → human (hint) or stop needs_human
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
              { id: "graph", title: "The graph" },
              { id: "stop-rules", title: "Stop rules" },
            ],
          },
          { id: "decisions", title: "Key decisions and trade-offs" },
          {
            id: "evaluation",
            title: "Evaluation",
            children: [
              { id: "loops-vs-graphs", title: "Loops vs graphs on qwen3:32b" },
              { id: "three-models", title: "The same bugs on three models" },
              { id: "cost", title: "Cost and tokens" },
              { id: "speed", title: "Speed: GPU vs laptop" },
              { id: "features", title: "What each framework gives you" },
              { id: "failures", title: "Failure modes" },
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
            ["What", "A test bench that runs the same bug-fixing agent built seven ways (four tool loops, one graph three ways) on the same bugs, model, tools, sandbox, budgets and event log, and scores them. Built 2–6 Nov 2026"],
            ["Result", "On qwen3:32b, all 15 bugs × 3: loops 31–44/45, graphs 44–45/45 (hard bugs: loops 5–14/15, graphs 14–15/15). On gpt-5.4-mini, bugs 001–010 × 3: 208/210, every build ≥ 28/30; graphs ~65% more per solved bug"],
            ["Runs", "799 runs on real models (686 sweep runs, 44 race, 64 chaos, 5 replay), counted from the run logs on 9 Nov 2026"],
            ["Stack", <span key="s">Python, <Code>uv</Code>, Docker (python:3.12-slim + pytest), openai 2.54.0, langchain 1.4.8, langgraph 1.2.19, crewai 1.15.34; optional self-hosted Langfuse v4.72.0</span>],
            ["Models", <span key="m"><Code>qwen2.5:3b</Code> and <Code>qwen3:4b</Code> on local Ollama; <Code>qwen3:32b</Code> on a Colab GPU (Ollama Q4_K_M, thinking on; a vLLM FP8 server with thinking off for demo runs only); <Code>openai/gpt-5.4-mini</Code></span>],
            ["Budgets per run", "20 model calls, 600 s, $0.50 cost cap, no-progress 3"],
            ["Cost", "$0 on local and Colab models; $0.79 for the 210 gpt-5.4-mini runs"],
            ["Status", "Experiment, parked as a reusable bench for new frameworks or models"],
            ["Owner", "Gurjeet Singh Saini, AI Practice"],
            ["Source", <span key="r">The <Code>agent-arena</Code> repo: <Code>src/arena/</Code>, <Code>reports/model-comparison.md</Code>, <Code>reports/final-openai-gpt-5.4-mini.md</Code>, <Code>reports/pattern-grid.md</Code></span>],
          ]}
        />
      </Section>

      <Section id="architecture" title="Architecture">
        <Figure scroll caption="The accent box is the only part that changes between builds. Everything else is shared.">
          <ArchitectureDiagram />
        </Figure>
        <Prose>
          <p>
            <Code>arena run</Code> starts a sweep: one run per (bug, repeat), each in a fresh Docker container with only that
            bug&apos;s folder copied to <Code>/work</Code> (<Code>--network none</Code>, 512 MB, 1 CPU, 256 pids, non-root). The
            build gets the four tools, <Code>list_files</Code>, <Code>read_file</Code>, <Code>write_file</Code> and{" "}
            <Code>run_tests</Code> (<Code>pytest -q</Code>, 60 s), with output cut to 8,000 characters.
          </p>
          <p>
            Every model request of every build goes through one httpx transport: plain through its OpenAI client, LangChain and
            LangGraph through <Code>ChatOpenAI(http_client=…)</Code>, CrewAI by swapping the metered client into its LLM. It logs
            each call, refuses a request once the cost cap or time budget is used up, and cuts a request at the budget. Every run
            writes <Code>runs/&lt;run_id&gt;.jsonl</Code>; <Code>arena score</Code>, the dashboard, the web UI and Langfuse all read
            that one log.
          </p>
        </Prose>
        <DataTable columns={["Build", "Shape", "What", "Versions"]} rows={BUILD_ROWS} stack />
      </Section>

      <Section id="mechanism" title="Core mechanism">
        <SubHeading id="graph">The graph</SubHeading>
        <Figure scroll caption="The accent box is the fan-out: three candidates, each a fix-and-test subgraph in its own container.">
          <GraphDiagram />
        </Figure>
        <BulletList>
          <li><Code>gather</Code> (no model call): lists and reads every file and runs the tests; files and failing output go into the state.</li>
          <li><Code>triage</Code> (1 call, JSON): simple or complex. Complex goes through <Code>plan</Code> (1 call, no code) first.</li>
          <li>Fan-out: 3 candidates at once, each in its own container: <Code>fix</Code> (up to 3 calls with the tools, until it writes), then <Code>test</Code> by the harness, back to <Code>fix</Code> with the failure, at most 3 attempts.</li>
          <li><Code>select</Code>: tests pass and no test file touched, then smallest diff, then lowest number. <Code>apply</Code> writes the winner into the run&apos;s workspace and reruns the tests.</li>
          <li><Code>review</Code> (1 call, the checker prompt): reject sends feedback into one more fan-out round; the earlier passing fix is kept if nothing better comes.</li>
          <li><Code>human</Code> when no candidate passed: stop with <Code>needs_human</Code>, or with <Code>--human</Code> take a hint and run again (at most 2). <Code>approve</Code> (with <Code>--approve slack|stdin</Code>) sits before <Code>apply</Code>.</li>
        </BulletList>
        <Prose>
          <p>
            Node bodies, prompts and routing decisions are shared (<Code>agents/graph_common.py</Code>); each build only wires them.
            <Code>--max-steps</Code> counts every model call of the run, so the fan-out shares the 20 calls and the 600 s. Here is
            the LangGraph wiring:
          </p>
        </Prose>
        <CodeBlock title="graph-langgraph: build() (trimmed)" code={SNIPPET} />
        <SubHeading id="stop-rules">Stop rules</SubHeading>
        <Prose>
          <p>
            The hand-built rules live in one place, <Code>RunContext.stop_reason()</Code> in <Code>agents/common.py</Code>, called
            from each build&apos;s pre-model-call hook. The transport is a backstop: no request past the cost cap, the time budget
            or <Code>max_steps + 2</Code>. Every stop writes a <Code>stop</Code> event with <Code>reason</Code> and{" "}
            <Code>by</Code> (<Code>guard</Code>, <Code>native</Code>, <Code>transport</Code>, <Code>agent</Code>). The stop reason
            is the agent&apos;s view; the harness&apos;s final test run decides <Code>solved</Code>.
          </p>
        </Prose>
        <DataTable columns={["Rule", "plain", "langchain", "langgraph", "crewai"]} rows={STOP_ROWS} stack />
        <Prose>
          <p>
            <Code>no_progress</Code> fires when the last 3 tool calls repeat exactly, the last 3 test runs after a write fail the
            same tests, or one tool errors 3 times in a row. Measured with a scripted model and <Code>max_steps</Code> 5: plain,
            langchain and langgraph stop after 5 calls, crewai after 6 (its forced final-answer call).
          </p>
        </Prose>
      </Section>

      <Section id="decisions" title="Key decisions and trade-offs">
        <DataTable columns={["Decision", "Reason", "Rejected"]} rows={DECISION_ROWS} stack />
      </Section>

      <Section id="evaluation" title="Evaluation">
        <Prose>
          <p>
            <Code>solved</Code> is x/n over completed runs; runs that errored on the endpoint are counted apart and left out of
            rates and medians. Times are medians per run.
          </p>
        </Prose>
        <SubHeading id="loops-vs-graphs">Loops vs graphs on qwen3:32b</SubHeading>
        <DataTable
          caption="All 15 bugs × 3, qwen3:32b on Colab (Ollama Q4_K_M, thinking on), 2–4 Nov 2026"
          columns={["Build", "Shape", "Solved", "Hard", "Med time", "p90 time", "Med tok in/out", "Stop reasons"]}
          rows={LOOP_GRAPH_ROWS}
          numeric={[2, 3, 4, 5]}
          stack
        />
        <Prose>
          <p>
            The loops spread 31–44/45 because each framework&apos;s own loop decides when the agent is done: CrewAI ended 29 of
            45 runs on <Code>agent_done</Code> (a reply without a tool call is its final answer), and the prebuilt LangGraph loop
            ends on any such reply, so neither can nudge. Built as the same graph, all three frameworks solve 44–45/45. The graphs
            are slower (96–133 s median vs 64–81 s) and use about twice the input tokens.
          </p>
        </Prose>
        <SubHeading id="three-models">The same bugs on three models</SubHeading>
        <DataTable
          caption="Bugs 001–010; solved and median time per run"
          columns={["Build", "qwen3:4b local, × 1", "qwen3:32b Colab, × 3", "gpt-5.4-mini, × 3"]}
          rows={MODEL_ROWS}
          stack
        />
        <Prose>
          <p>
            A strong model hides the shape: on gpt-5.4-mini six builds are 30/30 and crewai 28/30. On local qwen3:4b runs take
            5–10 minutes and miss; on bugs 008 and 012, <Code>qwen2.5:3b</Code> solved none of its race runs.
          </p>
        </Prose>
        <SubHeading id="cost">Cost and tokens</SubHeading>
        <DataTable
          caption="gpt-5.4-mini, bugs 001–010 × 3, 5 Nov 2026; $0.79 in total"
          columns={["Build", "Solved", "1st call in", "Med tok in/out", "Total", "Per solved run"]}
          rows={COST_ROWS}
          numeric={[2, 4, 5]}
          stack
        />
        <Prose>
          <p>
            Loops cost about $0.003 a run, graphs about $0.005: three candidates plus triage and review mean about 1.6× the input
            tokens, so on a model that solves everything the graph costs about 65% more per solved bug for nothing extra. Framework
            overhead is small: crewai&apos;s loop sends 458 first-call tokens against 393 for the others, and in the graph builds
            the first request is the same size in all three, because the shared nodes build the prompts.
          </p>
        </Prose>
        <SubHeading id="speed">Speed: GPU vs laptop</SubHeading>
        <Prose>
          <p>
            Bug 002, graph-langgraph, 5 Nov 2026: <Code>qwen3:32b</Code> on vLLM FP8 (Colab) solved in 27 s, first token 0.8 s
            median; <Code>qwen3:4b</Code> on local Ollama solved in 586 s, first token 19 s median (queueing). One request decodes
            at about the same speed on both (41 vs 40 tokens/s); three at once, vLLM gives 81 tokens/s aggregate in 3.6 s, Ollama
            36 tokens/s in 8.0 s, because it queues them. Most of the speed-up is thinking off: about 90 output tokens per call
            instead of about 740. On one local GPU use <Code>--parallel 1</Code>.
          </p>
        </Prose>
        <SubHeading id="features">What each framework gives you</SubHeading>
        <DataTable columns={["Pattern", "graph-plain", "graph-langgraph", "graph-crewai"]} rows={FEATURE_ROWS} stack />
        <Prose>
          <p>
            The Docker workspace is outside every framework, so resume and replay rebuild it by hand in all three: the main
            workspace from what <Code>apply</Code> wrote, an interrupted candidate&apos;s sandbox by replaying its saved{" "}
            <Code>write_file</Code> calls. Resume after <Code>SIGKILL</Code> was shown on real models in all three graph builds;
            finished candidates were not rerun. Approval in Slack: approved after 122 s, with the run clock at 13.7 s.
          </p>
        </Prose>
        <SubHeading id="failures">Failure modes</SubHeading>
        <BulletList>
          <li>
            <strong>CrewAI stall after parallel tool calls.</strong> The two crewai misses on gpt-5.4-mini: the model asked for
            three <Code>read_file</Code> calls in one reply, the results came back in about 4 s, and CrewAI never made the next
            model call until its own <Code>max_execution_time</Code> fired at about 600 s. Our guard runs before a model call, so it
            can&apos;t help when none comes.
          </li>
          <li>
            <strong>CrewAI&apos;s <Code>max_execution_time</Code> can&apos;t stop a hung tool.</strong> With our tool timeout off, a
            hung <Code>run_tests</Code> ended the run at 631 s against a 240 s limit.
          </li>
          <li>
            <strong>Chaos.</strong> With a tool made to fail, return stale results or hang, every build stopped in every
            scenario.
          </li>
          <li>
            <strong>Long silent replies.</strong> qwen3&apos;s thinking replies sent no bytes for over 120 s and the tunnel dropped
            them, until requests were streamed.
          </li>
        </BulletList>
      </Section>

      <Section id="limits" title="Limits and risks">
        <BulletList>
          <li>The bugs are tiny Python packages with planted mutations; the results describe the shapes on small tasks, not agents on large repos.</li>
          <li>gpt-5.4-mini solves bugs 001–010 in every build, so the frameworks only separate on weaker models and the hard bugs.</li>
          <li>qwen3:4b and qwen2.5:3b are slow or fail at this task; one laptop GPU serves one request at a time.</li>
          <li>The Colab model sits behind a temporary Cloudflare tunnel whose URL changes when the notebook restarts.</li>
          <li>A request in flight at a kill isn&apos;t in the log (no tokens, no cost) but a paid API may bill it; it is redone after the resume.</li>
          <li>The approval and demo runs used a different server (vLLM FP8, thinking off) and are kept out of the comparison tables.</li>
        </BulletList>
        <Callout kind="warning" title="Reusing a framework's agent loop">
          <p>
            Check how it decides the agent is done. Both CrewAI&apos;s crew and LangGraph&apos;s prebuilt agent end on any reply
            without a tool call, and neither has a tool timeout that can stop a hung tool.
          </p>
        </Callout>
      </Section>

      <Section id="run" title="Run it yourself">
        <Prose>
          <p>Needs <Code>uv</Code>, Docker and a model endpoint (local Ollama is the default and costs $0).</p>
        </Prose>
        <BulletList ordered>
          <li><Code>uv sync</Code>, then optionally copy <Code>.env.example</Code> to <Code>.env</Code> and set <Code>ARENA_MODEL</Code>.</li>
          <li><Code>ollama pull qwen2.5:3b</Code> and <Code>uv run arena generate</Code> (builds and verifies every bug in Docker).</li>
          <li>One run: <Code>uv run arena run --bug 008 --agent graph-langgraph</Code>.</li>
          <li>All builds on one bug at once: <Code>uv run arena race --bug 006 --markdown</Code>.</li>
          <li>A sweep and its score: <Code>uv run arena run --all --repeat 3 --parallel 2</Code>, then <Code>uv run arena score --latest</Code>.</li>
          <li>Pick the model per run with <Code>--model</Code>: <Code>ollama/…</Code>, <Code>lmstudio/…</Code>, <Code>openai/…</Code> (needs <Code>OPENAI_API_KEY</Code>) or <Code>compat/…</Code> (<Code>ARENA_BASE_URL</Code>, <Code>ARENA_API_KEY</Code>, <Code>ARENA_PRICE</Code>).</li>
          <li>The local web UI: <Code>uv run arena ui</Code> (127.0.0.1:8765).</li>
        </BulletList>
      </Section>

      <Section id="next" title="Open questions and next steps">
        <BulletList>
          <li>Parked as a reusable bench: a new framework is one more build over the same tools, transport and event log.</li>
          <li>Tokens of model calls that time out are lost; this matters only for paid models.</li>
        </BulletList>
      </Section>
    </>
  );
}
