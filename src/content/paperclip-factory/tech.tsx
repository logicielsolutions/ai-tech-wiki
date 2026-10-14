import { Callout, Code, CodeBlock, DataTable, Figure, KeyNumber, KeyNumbers, PageIndex, Prose, Section } from "@/components/wiki";

/** The machine block of the source's example contract (factory-template/contract/example.contract.json), trimmed. */
const CONTRACT = `{
  "contractVersion": 1,
  "requirement": { "issue": "LAB-1", "title": "To-do list web app: add, complete and delete items" },
  "acceptanceCriteria": [
    { "id": "AC-1", "text": "Typing a non-empty item and pressing Enter adds it to the bottom of the list." },
    { "id": "AC-2", "text": "An empty or whitespace-only item is not added, and the input shows 'Item can't be empty'." },
    // AC-3 to AC-5: complete and undo, delete keeping order, survive a reload
  ],
  "repositories": [
    {
      "name": "todo-app",
      "url": "https://github.com/example-org/todo-app.git",
      "defaultBranch": "main",
      "access": "write",
      "protectedBranches": ["main"],
      "provision": { "create": true, "owner": "example-org", "visibility": "private" }
    }
  ],
  "apps": [],
  "operations": ["code.read", "code.change", "tests.run", "packages.install", "git.commit",
                 "git.push.branch", "pr.open", "issues.manage", "client.ask"],
  "network": { "domains": [] },
  "dataDestinations": [
    { "kind": "paperclip" },
    { "kind": "repository", "target": "github.com/example-org/todo-app" },
    { "kind": "package-registry", "target": "registry.npmjs.org" }
  ],
  "spend": { "maxRunsPerAgentPerDay": 50, "timeoutSec": 3600, "monthlyBudgetCents": null },
  "delivery": { "endpoint": "open_pr" }
}`;

function ArchitectureDiagram() {
  const box = (x: number, y: number, w: number, label: string, sub?: string, strong = false) => (
    <g key={label}>
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
  const line = (d: string) => <path d={d} fill="none" stroke="var(--color-muted)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />;
  const note = (x: number, y: number, text: string, anchor: "start" | "middle" | "end" = "middle") => (
    <text x={x} y={y} textAnchor={anchor} fontSize={12} fill="var(--color-muted)">
      {text}
    </text>
  );
  return (
    <svg
      viewBox="0 0 800 440"
      className="h-auto w-full min-w-[680px]"
      role="img"
      aria-label="Architecture. The factory template applies desired state to the Paperclip server over its REST API. Paperclip holds issues, the contract and runs, the Tool Gateway with contract policies, the factory guard plugin and the two Buzz plugins. Each agent run is nested: a wrapper, inside it the srt sandbox, inside that Claude Code with the factory settings and gov-shim hooks. gov-shim reports denials to the guard. The guard sends one Slack alert and brokers GitHub access; the Buzz plugins talk to a Buzz relay."
    >
      {box(20, 40, 170, "factory-template", "bootstrap · setup · sandbox")}
      {line("M190 67H250")}
      {note(220, 58, "REST")}
      {box(20, 192, 170, "Buzz relay", "client · status channels")}
      {line("M190 219H250")}

      {box(250, 40, 240, "Paperclip 2026.916.1", "issues · contract · runs")}
      {box(250, 116, 240, "Tool Gateway", "contract → allow, then block")}
      {box(250, 192, 240, "buzz-notifier · buzz-bridge", "status · client thread")}
      {box(250, 268, 240, "factory-guard plugin", "stop · one alert · resume", true)}

      <rect x={540} y={40} width={240} height={262} rx={14} fill="var(--color-fill)" />
      <text x={556} y={62} fontSize={12} fontFamily="var(--font-mono)" fill="var(--color-ink)">
        wrapper
      </text>
      <text x={556} y={292} fontSize={11} fontFamily="var(--font-mono)" fill="var(--color-muted)">
        CLAUDE_CODE_EXECUTABLE
      </text>
      <rect x={556} y={76} width={208} height={198} rx={12} fill="var(--color-surface)" />
      <text x={572} y={98} fontSize={12} fontFamily="var(--font-mono)" fill="var(--color-ink)">
        srt sandbox
      </text>
      {box(572, 112, 176, "Claude Code", "--settings · strict MCP")}
      {box(572, 196, 176, "gov-shim hooks", "deny-only · ends turn")}

      {line("M490 67H540")}
      {note(515, 58, "runs")}
      {line("M572 139C530 139 530 143 490 143")}
      {note(531, 132, "MCP")}
      {line("M572 223C528 223 528 295 490 295")}
      {note(512, 318, "reports")}

      {box(250, 370, 110, "Slack", "one webhook")}
      {box(380, 370, 110, "GitHub", "Apps · rulesets")}
      {line("M305 322V370")}
      {line("M435 322V370")}
      {note(20, 300, "Off on the live instance", "start")}
      {note(20, 318, "during testing: sandbox,", "start")}
      {note(20, 336, "contract policies, guard,", "start")}
      {note(20, 354, "GitHub delivery.", "start")}
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
          { id: "mechanism", title: "Core mechanism" },
          { id: "decisions", title: "Key decisions and trade-offs" },
          { id: "evaluation", title: "Evaluation" },
          { id: "limits", title: "Limits and risks" },
          { id: "run", title: "Run it yourself" },
          { id: "next", title: "Open questions and next steps" },
          { id: "sources", title: "Sources" },
        ]}
      />

      <Section id="glance" title="At a glance">
        <DataTable
          columns={["Item", "Detail"]}
          rows={[
            ["What", "A governed software factory on Paperclip, shipped as a template: one human sign-off of a versioned execution contract, then BA → PM → developers → QA → pull request, deny-only outside the contract"],
            ["Platform", <span key="p">Paperclip <Code>2026.916.1</Code>, self-hosted, pinned (the bootstrap refuses any other version)</span>],
            ["Agents", <span key="a">Chief of staff, Business Analyst, Project Manager, Senior and Junior Developer, QA, plus the built-in Summarizer and Reflection Coach; Claude Code via <Code>claude_local</Code> on the ACP engine</span>],
            ["Model", "Claude Opus 5, thinking effort medium"],
            ["Claude access", <span key="c">The company Claude Code subscription on the live instance; each developer&apos;s own subscription through a 1-year <Code>claude setup-token</Code> token</span>],
            ["Isolation", <span key="i"><Code>srt</Code> (Anthropic sandbox-runtime) 0.0.77, pinned, beta; Seatbelt on macOS, Bubblewrap on Linux; no Docker</span>],
            ["Governance", "38 Claude deny rules, gov-shim (Rust, Cedar) in deny-only mode, Tool Gateway policies from the contract, the factory-guard plugin, GitHub rulesets"],
            ["Template", <span key="t">Zero-dependency Node 24.11+ scripts, a company package, three plugins (<Code>factory-guard</Code>, <Code>buzz-notifier</Code>, <Code>buzz-bridge</Code>), a Slack manifest; 366 tests</span>],
            ["Cost", "Claude subscription: Paperclip records runs as $0, so budgets can't stop them; capped instead at 3600 s per run and 50 runs a day per agent. No per-project cost measured yet"],
            ["Status", "Experiment. Testing phase on one machine; enforcement off on the live instance; rollout paused since 14 Oct 2026 until the exported template is tested"],
            ["Owner", "Gurjeet Singh Saini, operator"],
            ["Source", <span key="s">The <Code>paperclip</Code> operations repo (local only) and its <Code>factory-template/</Code> folder</span>],
          ]}
        />
      </Section>

      <Section id="architecture" title="Architecture">
        <Figure scroll caption="The template applies everything over Paperclip's REST API and installs the agent runtime. Each run nests three layers. The decision to stop is carried out on the server side, by the guard.">
          <ArchitectureDiagram />
        </Figure>
        <Prose>
          <p>
            <Code>bin/bootstrap</Code> holds the factory&apos;s desired state as one module per setting: dry run by default,
            idempotent, re-run until it plans 0 changes. Nothing is configured by hand, and every module has an on/off switch
            per instance, so the same template drives the live instance (enforcement off while testing) and the disposable
            labs (everything on).
          </p>
          <p>
            <strong>The stop can&apos;t come from inside the agent.</strong> gov-shim runs inside the agent&apos;s process
            with the agent&apos;s own token, and agent tokens can&apos;t pause agents or hold issue trees; giving gov-shim a
            board credential would put it where the agent can read it. So gov-shim denies, ends the turn with{" "}
            <Code>continue: false</Code> and reports; the guard, in the Paperclip server, records the exception, cancels the
            run, pauses the agent, holds the tree and sends the single alert.
          </p>
        </Prose>
        <DataTable
          caption="Where each control runs"
          columns={["Control", "Stops or does", "Runs in", "Live instance"]}
          rows={[
            ["srt sandbox", "Reads of secrets and Paperclip data, writes outside the worktree, egress off the allowlist, escapes (open, Apple Events, launchctl, rc files, git hooks)", "OS sandbox around the Claude process", "Off"],
            ["Factory settings", <span key="fs">38 deny rules with a clear refusal; MCP only from Paperclip&apos;s gateway (<Code>--strict-mcp-config</Code>)</span>, "Claude Code", "Off"],
            ["gov-shim hooks", "Parses shell: secret reads, force pushes to protected branches, config tampering; reports each deny and ends the turn", "Claude hooks inside the sandbox", "Off"],
            ["Tool Gateway policies", "MCP and app tools outside the contract, including tools a connection gains later; rate limits", "Paperclip server", "Off"],
            ["factory-guard", "Exceptions, hold, pause, cancel, one alert, revalidate, resume; GitHub broker; stops agent-made config changes", "Paperclip plugin", "Off"],
            ["GitHub rulesets", "Pushes to main, merges by the agents' App, checks satisfied by anything but GitHub Actions", "GitHub", "Mock only"],
            ["Paperclip built-ins", "Hire approval, run limits, isolated worktrees, review stage, audited skills", "Paperclip", "On"],
          ]}
        />
      </Section>

      <Section id="mechanism" title="Core mechanism">
        <Prose>
          <p>
            The contract is one markdown issue document, <Code>contract</Code>, on the requirement issue. It holds a human
            summary and exactly one fenced <Code>json factory-contract</Code> block, the only part machines read. Every save is
            a new document revision. Sign-off is a <Code>request_confirmation</Code> card with{" "}
            <Code>resolverPolicy: &quot;human_only&quot;</Code>, bound to one revision and carrying the contract&apos;s sha256
            (canonical JSON, keys sorted).
          </p>
          <p>
            <strong>A contract is in force only when all three hold:</strong> the card is accepted, its target is the
            document&apos;s latest revision, and the hash in the card equals the hash of that revision. Any edit makes it
            stale and sends the flow back to the BA and the client.
          </p>
        </Prose>
        <CodeBlock title="The example contract's machine block (factory-template/contract/example.contract.json), trimmed" code={CONTRACT} />
        <Prose>
          <ul className="flex list-disc flex-col gap-2 pl-5">
            <li>
              <strong>Contract → permissions.</strong> Per contract project: a rate limit, one allow policy per role and app
              with the contract&apos;s exact tool names (no wildcards), then a block. A per-role base matrix intersects with
              the 12 named operations; no role gets <Code>pr.merge</Code> or <Code>deploy.*</Code>. On a lab, 100 of 100
              agent × tool decisions from Paperclip&apos;s policy dry run matched the contract.
            </li>
            <li>
              <strong>Never &ldquo;ask&rdquo;.</strong> Paperclip&apos;s ACP engine approves every permission prompt, and
              its <Code>require_approval</Code> makes the agent end its run, so the flow uses only deny rules, hooks and the
              sandbox.
            </li>
            <li>
              <strong>Exception lifecycle:</strong> running → policy-stopped → notified → resolved → revalidated → resumed.
              One record and one alert per dedupe key; one resolved follow-up; the denied action is never replayed.
            </li>
            <li>
              <strong>Self-changes.</strong> An agent key may change its own agent&apos;s config in Paperclip, which could
              drop the sandbox wrapper. The guard treats any agent-made config change as a <Code>permission</Code> exception
              until a board revert.
            </li>
            <li>
              <strong>Buzz sign-off (lab).</strong> The bridge posts a sign-off request it signs itself, ending in a line with
              the contract hash, revision, card and a nonce. A check-mark reaction from an allow-listed client key is checked, both
              signed events are stored on the issue, and only then is the card accepted as the client.
            </li>
          </ul>
        </Prose>
        <DataTable
          caption="Exception causes; only a board user in Paperclip resolves, and a Slack actor is refused in code"
          columns={["Cause", "Raised when", "Resolved by"]}
          rows={[
            [<Code key="p">permission</Code>, "An action outside the contract is refused; an agent changes an agent's config", "A signed-off contract revision, a board redirect, or a config revert"],
            [<Code key="c">credential</Code>, "A run fails on a login or AI connection", "Reconnected, and the credential check passes"],
            [<Code key="r">requirement</Code>, "A signed-off contract changes while its requirement has open work", "Signed off again"],
            [<Code key="l">limit</Code>, "The daily run cap or a budget incident", "Raised, or the window resets"],
            [<Code key="w">waiting</Code>, "A card or an escalation waits on a person (notify only)", "The person's answer in Paperclip"],
            [<Code key="m">repo_missing</Code>, "A contract repository is missing or lost", "Creation confirmed, or access fixed"],
          ]}
        />
      </Section>

      <Section id="decisions" title="Key decisions and trade-offs">
        <Prose>
          <p>Each choice came out of a written comparison in the source repo; the rejected options are the ones we looked at.</p>
        </Prose>
        <DataTable
          columns={["Decision", "Reason", "Rejected"]}
          rows={[
            ["One human gate (planning), deny-only, never ask", "Full automation after sign-off; ACP auto-approves prompts", "A 10-layer design built on human approvals and ask-first"],
            ["Sign-off is a versioned execution contract", "An adversarial review by another model, verified claim by claim, showed a plain card wasn't tied to what agents may do", "A company-wide allow-all tool profile"],
            ["srt around every agent process, no Docker", "No extra layer; same tool on macOS and Linux; a wrapper plus a policy file", "One or two Docker containers, Docker Sandboxes, E2B Runtime (needs Linux with KVM), E2B cloud (client code leaves the machine). Fallback: a dedicated OS user"],
            ["Keep the in-house gov-shim as the deny layer", "Parses shell properly; Cedar policies; 103 policy fixtures", "Microsoft's Agent Governance Toolkit plugin (missed rm -fr variants, never scans tool output, its review defaults stall headless agents); hookify (regex only)"],
            ["Paperclip's own Tool Gateway for MCP", "Already does per-agent entitlements, argument-level blocks, rate limits and audit", "External gateways (agentgateway, ToolHive, Docker MCP Gateway, IBM ContextForge, Obot); ToolHive kept for MCP outside Paperclip"],
            ["Own notify-only guard plugin and one Slack webhook", "Nothing in Slack can act on the factory", "The community Slack plugin (approve, override and command features); Paperclip's Slack connector (an agent tool that needs HTTPS)"],
            ["Template-first", "Every change re-runnable on a fresh Paperclip", "Hand configuration on one machine"],
            ["The factory's own two GitHub Apps", "Tokens narrowed to the one contract repository by the guard; people merge", "Paperclip's GitHub connection (a person's token through Paperclip Cloud, no limits); a personal gh login; a fine-grained personal token"],
            ["The endpoint is an open pull request", "A person reviews and merges", "Merge and deploy"],
            ["Reuse before building", "About half the rollout switches on Paperclip built-ins; skills from its catalog", "Building plugins for what Paperclip already ships"],
            ["Buzz as the room, Paperclip as the ledger", "No Buzz plugin existed and both are ACP clients, so a bridge plugin was built: a notifier, then a two-way bridge with signed sign-off behind a switch", "Buzz running the agents (it would replace Paperclip's orchestration)"],
            ["Not Orca for contract work", "Its agents would run outside the sandbox, gov-shim, the gateway and cost tracking", "Routing work through the community Orca adapter"],
            ["Adopt none of CopilotKit's OpenBot, OpenDots, OpenMuse", "None is a software factory; only OpenBot could partly stand in for Buzz, and it needs a paid CopilotKit service", "Replacing Paperclip or Buzz; borrowed OpenBot's fail-closed policy and append-only audit ideas instead"],
            ["Claude login: a 1-year setup-token for developers", "Paperclip keeps only the short-lived access token, which can expire about 1.3 h after a reconnect", "An hourly reconnect job (still the live instance's default); an API key (pay per token; fine for a shared server)"],
            ["Hand-over as a private git bundle without the lab tools", "No remote yet; developers get only what they need", "A public repo; shipping the lab scripts"],
          ]}
        />
      </Section>

      <Section id="evaluation" title="Evaluation">
        <Prose>
          <p>
            Every enforcement layer was tested on disposable Paperclip instances with its switch on, then the instance was
            deleted. GitHub tests ran against a mock GitHub.
          </p>
        </Prose>
        <KeyNumbers>
          <KeyNumber value="98/98" label="Sandbox probes refused" />
          <KeyNumber value="27/27" label="Delivery probes refused" />
          <KeyNumber value="100/100" label="Policy decisions match the contract" />
          <KeyNumber value="366" label="Template tests passing" />
        </KeyNumbers>
        <DataTable
          columns={["Test", "What was tried", "Result"]}
          rows={[
            ["Trust boundary", "Read host secrets and Paperclip data; reach other local ports; egress to hosts off the allowlist; tamper with gov-shim or the settings; escapes; an unmanaged .mcp.json", "98 of 98 refused at the srt layer; real agent runs refused by deny rules and gov-shim; commit, npm and temp files still work"],
            ["Lifecycle", "A forbidden force push; retries through 20 Bash forms, gh, the direct API, an unmanaged MCP server; resume; Slack", "Stopped 13 s after the wake with exactly one alert; 9 of 10 direct-API retries refused, the 10th (self-config) fixed and re-tested; resume woke once and repeated nothing; nothing from Slack reached Paperclip"],
            ["Delivery (mock GitHub)", "Push to main in many forms, merge, self-approve, change rulesets, satisfy a check, rewrite CI, reach another repo", "27 of 27 refused at the srt layer; 7 of 8 at the Claude layer, the 8th a mock bug fixed with a regression test; main never moved"],
            ["Contract permissions", "Paperclip's policy dry run, every agent × tool", "100 of 100 decisions matched the contract"],
            ["Fresh install", "A new Paperclip, company import, bootstrap; later bin/setup", "0 planned changes after four runs; bin/setup reached a plan of 0 in 167 s with a fake Claude token"],
            ["Buzz bridge", "Unknown key, forged signature, look-alike request, stale revision, replay, edited request, control verbs, injected text", "All refused live"],
            ["Template tests", "npm test", "366 pass in the ops repo; 343 pass inside a clean clone of the developer bundle"],
            ["Routine loop (demo)", "Developer → QA fails → fix → QA passes", "3 min 26 s, 4 runs, no alert"],
          ]}
        />
        <Callout kind="limit" title="Not measured yet">
          <p>
            A real client conversation, real GitHub (waiting on the operator&apos;s App setup), a real run through{" "}
            <Code>bin/setup</Code> with a real token, the Linux sandbox, and any cost per project.
          </p>
        </Callout>
      </Section>

      <Section id="limits" title="Limits and risks">
        <Prose>
          <ul className="flex list-disc flex-col gap-2 pl-5">
            <li>
              <strong>Unauthenticated control plane.</strong> The live instance runs in <Code>local_trusted</Code> mode, where
              any local request is the board. Authenticated mode, secrets strict mode and a board API key are mandatory
              before production.
            </li>
            <li>
              <strong>Enforcement off on the live instance.</strong> The sandbox, contract policies, guard and GitHub delivery
              are built and tested but switched off there during testing; test repositories and test credentials only.
            </li>
            <li>
              <strong>Sandbox residual gaps.</strong> launchd is reachable over XPC from an interpreter; an agent can truncate
              its own run&apos;s gov-shim log; <Code>srt</Code> is a beta; the Linux sandbox has never run.
            </li>
            <li>
              <strong>Buzz sign-off.</strong> Proves nothing extra until authenticated mode; the bridge key and client keys
              need custody, rotation and loss handling.
            </li>
            <li>
              <strong>Cost control.</strong> Subscription runs are recorded at $0, so Paperclip budgets can&apos;t stop them;
              run caps are the control for now.
            </li>
            <li>
              <strong>Platform churn.</strong> Paperclip ships breaking changes often; the template pins one version and
              refuses others.
            </li>
            <li>
              <strong>Output quality.</strong> Agents can produce plausible but wrong work; a person reviews and merges every
              pull request.
            </li>
          </ul>
        </Prose>
      </Section>

      <Section id="run" title="Run it yourself">
        <Prose>
          <p>
            Developers get a private <strong>git bundle</strong>, <Code>paperclip-factory-0.1.0.bundle</Code> with its{" "}
            <Code>.sha256</Code> (about 737 KB), clone it and follow its README. Each developer runs their own Paperclip with
            their own Claude account; nobody shares either.
          </p>
          <p>
            <strong>Needs:</strong> macOS, or Linux with systemd; Node 24.11+; Paperclip exactly 2026.916.1 (its own instance
            if one already runs); Claude Code and a paid Claude plan; git; Rust for the sandbox build; the Buzz app and a key
            admitted to the team relay. Optional: a Slack webhook for alerts, the factory&apos;s GitHub Apps.
          </p>
        </Prose>
        <DataTable
          columns={["Step", "Command", "Does"]}
          rows={[
            ["1", <Code key="1">shasum -a 256 -c paperclip-factory-0.1.0.bundle.sha256</Code>, "Checks the bundle"],
            ["2", <Code key="2">git clone -b main paperclip-factory-0.1.0.bundle paperclip-factory</Code>, "One-commit clone, no lab tools"],
            ["3", <Code key="3">npm test</Code>, "343 tests; no npm install needed"],
            ["4", <Code key="4">cp config/factory.example.json config/factory.json</Code>, "Your config; it never holds a secret"],
            ["5", <Code key="5">claude setup-token</Code>, "A 1-year token for your own subscription"],
            ["6", <Code key="6">bin/claude-token</Code>, "Stores it in Paperclip at a hidden prompt (or let bin/setup ask)"],
            ["7", <Code key="7">bin/setup</Code>, "Dry run: every step, its status and exact commands"],
            ["8", <Code key="8">bin/setup --apply</Code>, "Imports the company, labels, project, Buzz bot keys, sandbox, bootstrap; y/N before installs and credentials; re-run until done"],
          ]}
        />
        <Prose>
          <p>
            The first sandbox install builds gov-shim from source, about 14 minutes once; later releases will ship it
            pre-built. <Code>bin/setup</Code> also writes a Buzz access request holding public keys only; the relay admin
            admits it with <Code>bin/buzz-admit</Code>. When it&apos;s done, <Code>bin/bootstrap</Code> plans 0 changes.
          </p>
        </Prose>
        <DataTable
          caption="Module switches for a developer (config/factory.json, names only)"
          columns={["Module", "Value", "Why"]}
          rows={[
            [<Code key="cl">modules.claudeLogin</Code>, "setup-token", "No reconnect job; the token is a company secret"],
            [<Code key="sb">modules.agentSandbox</Code>, "on", "Required for the pilot and for production"],
            [<span key="bz"><Code>modules.buzzNotifier</Code>, <Code>modules.buzzBridge</Code></span>, "on", "Status channel and the client thread"],
            [<span key="cp"><Code>modules.contractPermissions</Code>, <Code>modules.guardPlugin</Code></span>, "on once a Slack webhook exists", "Same as the release gate"],
            [<Code key="gh">modules.githubDelivery</Code>, "off, or the mock", "Real GitHub isn't verified yet"],
            [<Code key="ap">modules.agentPermissions</Code>, "set per agent", "An import otherwise lets every agent create agents and skills"],
          ]}
        />
        <Prose>
          <p>
            Other names, never values: the agent env vars <Code>CLAUDE_CODE_OAUTH_TOKEN</Code> (a company secret reference)
            and <Code>CLAUDE_CODE_EXECUTABLE</Code> (the sandbox wrapper); the company secrets <Code>buzz-notifier-key</Code>,{" "}
            <Code>buzz-bridge-key</Code> and <Code>GITHUB_TOKEN</Code>.
          </p>
        </Prose>
      </Section>

      <Section id="next" title="Open questions and next steps">
        <Prose>
          <ul className="flex list-disc flex-col gap-2 pl-5">
            <li>The rollout is paused since 14 Oct 2026 until the exported template is tested.</li>
            <li>Hand-over: a shared team Buzz relay, then a pilot with one developer on macOS and one on Linux, then gov-shim shipped pre-built so nobody needs Rust.</li>
            <li>GitHub delivery: the operator&apos;s App setup, then one real run.</li>
            <li>A real client channel and a pilot from conversation to pull request, with one staged rule break.</li>
            <li>The release gate: authenticated mode and every other mandatory fix, enforcement switched on for the live instance, then the template release.</li>
            <li>The operator reviews the decisions agents took on their own during the testing phase.</li>
          </ul>
        </Prose>
      </Section>

      <Section id="sources" title="Sources">
        <Prose>
          <p>In the source repo, which is local only:</p>
          <ul className="flex list-disc flex-col gap-2 pl-5">
            <li><Code>docs/2026-09-28-10-factory-rollout-prd.md</Code>: principles, steps, decisions register</li>
            <li><Code>docs/2026-09-28-02-security-and-governance-findings.md</Code>, <Code>-03-governance-design.md</Code>, <Code>-04-governance-tooling-evaluation.md</Code></li>
            <li><Code>docs/2026-09-28-11-plugins-and-alternatives-review.md</Code>, <Code>-12-review-verification-and-template-decision.md</Code>, <Code>-13-agent-isolation-srt-decision.md</Code></li>
            <li><Code>docs/2026-09-28-14-mandatory-fixes-before-production.md</Code></li>
            <li>Docs 16 to 21: Buzz research, the notifier and two-way bridge labs, Orca and CopilotKit comparisons</li>
            <li><Code>docs/2026-10-14-22-template-handover-plan.md</Code> and <Code>docs/evidence/handover-phase-2/report.md</Code></li>
            <li><Code>docs/briefing/</Code>: the manager briefings</li>
            <li><Code>factory-template/README.md</Code>, <Code>factory-template/BUNDLE-README.md</Code>, <Code>factory-template/contract/SPEC.md</Code></li>
          </ul>
          <p>Public projects:</p>
          <ul className="flex list-disc flex-col gap-2 pl-5">
            <li><a href="https://github.com/paperclipai/paperclip">Paperclip</a></li>
            <li><a href="https://github.com/anthropic-experimental/sandbox-runtime">srt, Anthropic sandbox-runtime</a></li>
            <li><a href="https://github.com/block/buzz">Buzz</a></li>
          </ul>
        </Prose>
      </Section>
    </>
  );
}
