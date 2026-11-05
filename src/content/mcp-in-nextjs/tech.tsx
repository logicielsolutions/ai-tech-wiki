import { BulletList, Callout, Code, CodeBlock, DataTable, Figure, PageIndex, Prose, Section, SubHeading } from "@/components/wiki";

/** Trimmed from src/app/api/mcp/route.ts (52 lines) as docs/mcp-in-nextjs.md §4 shows it. */
const ROUTE = `import { createMcpHandler, withMcpAuth } from "mcp-handler";
import { TOOLS } from "@/lib/mcp/tools";

// mcpCall(token, tool, args): supabase.rpc("mcp_call", …) with the anon client

const handler = createMcpHandler(
  (server) => {
    for (const tool of TOOLS) {
      server.registerTool(
        tool.name,
        { title: tool.title, description: tool.description, inputSchema: tool.schema },
        async (input, ctx) => {
          const token = ctx.http?.authInfo?.token;
          if (!token) return { isError: true, content: [{ type: "text", text: "Missing agent token." }] };
          try {
            const result = await mcpCall(token, tool.name, tool.toArgs(input as Record<string, unknown>));
            return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
          } catch (err) {
            return { isError: true, content: [{ type: "text", text: err instanceof Error ? err.message : String(err) }] };
          }
        },
      );
    }
  },
  { serverInfo: { name: "ait-board", version: "0.1.0" } },
);

const authed = withMcpAuth(handler, verifyToken, { required: true });

export { authed as GET, authed as POST };`;

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
  const region = (x: number, w: number, label: string) => (
    <g>
      <rect x={x} y={14} width={w} height={330} rx={14} fill="none" stroke="var(--color-rule)" strokeWidth={1.5} />
      <text x={x + 14} y={34} fontSize={12} fill="var(--color-muted)">
        {label}
      </text>
    </g>
  );
  return (
    <svg
      viewBox="0 0 800 380"
      className="h-auto w-full min-w-[680px]"
      role="img"
      aria-label="Architecture. People's browsers go through proxy.ts, then pages and server actions, which call public.web_call. Claude Code and claude.ai cloud routines post JSON-RPC with a bearer token to /api/mcp, which calls public.mcp_call. Both functions lead to private.core_*, the one rulebook, which writes the tables. Open browsers poll /api/last-change every 10 seconds, which reads the tables with the person's RLS."
    >
      {region(160, 284, "one Next.js app (Vercel, bom1)")}
      {region(460, 330, "Supabase Postgres")}
      {box(10, 50, 130, "browser", "people")}
      {box(10, 200, 130, "Claude Code", "cloud routines")}
      {box(175, 50, 110, "proxy.ts", "cookie session")}
      {box(300, 50, 130, "pages + actions", "webCall()")}
      {box(175, 270, 255, "/api/last-change", "poll every 10 s")}
      {box(175, 200, 255, "/api/mcp", "withMcpAuth → mcp-handler", true)}
      {box(475, 50, 145, "public.web_call", "as auth.uid()")}
      {box(475, 200, 145, "public.mcp_call", "token → person")}
      {box(635, 125, 145, "private.core_*", "one rulebook")}
      {box(635, 250, 145, "tables", "select only for users")}
      {line("M140 77H175")}
      {line("M285 77H300")}
      {line("M430 77H475")}
      {line("M140 90H152V297H175", true)}
      {line("M430 297H635", true)}
      {line("M140 227H175")}
      {line("M430 227H475")}
      {line("M620 77C630 77 625 152 635 152")}
      {line("M620 227C630 227 625 160 635 160")}
      {line("M707 179V250")}
      <text x={10} y={368} fontSize={12} fill="var(--color-muted)">
        agents: POST JSON-RPC + Bearer aitb_… · dashed: reads only
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
          { id: "architecture", title: "Architecture", children: [{ id: "doors", title: "Two doors, one rulebook" }] },
          {
            id: "mechanism",
            title: "Core mechanism",
            children: [
              { id: "route", title: "The route" },
              { id: "tools-as-data", title: "Tools as data" },
              { id: "tools", title: "The seven tools" },
              { id: "auth", title: "Auth on every request" },
              { id: "end-to-end", title: "One call, end to end" },
            ],
          },
          { id: "decisions", title: "Key decisions and trade-offs", children: [{ id: "setups", title: "Three ways to host MCP" }] },
          { id: "evaluation", title: "Evaluation" },
          { id: "limits", title: "Limits and risks" },
          { id: "run", title: "Run it yourself", children: [{ id: "own-app", title: "In your own Next.js app" }] },
          { id: "next", title: "Open questions and next steps" },
        ]}
      />

      <Section id="glance" title="At a glance">
        <DataTable
          stack
          columns={["Item", "Detail"]}
          rows={[
            ["What", "An MCP server served as a Route Handler inside the same Next.js app as the web UI. People and agents share one deployment and one set of rules in Postgres"],
            [
              "Stack",
              <span key="s">
                Next.js 16 App Router; <Code>mcp-handler</Code> 2.3.0, <Code>@modelcontextprotocol/server</Code> 2.4.0,{" "}
                <Code>zod</Code> 4.6.7; Supabase Postgres
              </span>,
            ],
            ["Transport", "Stateless Streamable HTTP. The 2026-07-28 MCP spec natively, with a stateless fallback for 2025-era clients"],
            ["Hosting", <span key="h">Vercel, region <Code>bom1</Code> (Mumbai), Fluid Compute, default Node.js runtime</span>],
            ["MCP clients", "Claude Code on a laptop and claude.ai cloud routines, both outside the repo"],
            ["Models", "None called by the app. The models run in the MCP clients"],
            ["Size", <span key="z">Two files: the route (52 lines) and the tool list (160 lines); seven tools</span>],
            ["Status", "Experiment"],
            ["Owner", "Kumar Gaurav"],
            ["Source", <span key="r">The <Code>ai-team-board</Code> repo, <Code>docs/mcp-in-nextjs.md</Code></span>],
          ]}
        />
      </Section>

      <Section id="architecture" title="Architecture">
        <Figure scroll caption="The accent box is the MCP door. Both doors end at private.core_*, so a rule change applies to people and agents together.">
          <ArchitectureDiagram />
        </Figure>
        <Prose>
          <p>
            A remote MCP server is a URL: the client <Code>POST</Code>s JSON-RPC messages (<Code>initialize</Code>,{" "}
            <Code>tools/list</Code>, <Code>tools/call</Code>) and reads JSON back. A Next.js Route Handler can answer that, so the
            MCP server lives at <Code>src/app/api/mcp/route.ts</Code>, next to the pages, and ships in the same deployment. The app
            also handles onboarding: it issues agent tokens and prints the <Code>claude mcp add</Code> command.
          </p>
          <p>
            Both <Code>public.*_call</Code> functions are <Code>SECURITY INVOKER</Code> wrappers around{" "}
            <Code>SECURITY DEFINER</Code> functions in the <Code>private</Code> schema, which PostgREST doesn&apos;t expose. Users can
            only <Code>select</Code> tables; every write goes through a dispatcher. So the UI, the MCP route and anyone holding the
            browser key hit the same checks.
          </p>
          <p>
            Open boards see agent changes through <Code>LiveRefresh.tsx</Code>, which polls <Code>/api/last-change</Code> every 10
            seconds while the tab is visible and calls <Code>router.refresh()</Code> when the latest timestamp changes. That route
            reads with the person&apos;s own RLS, so people are only refreshed for changes they can see. The browser never talks to
            Supabase directly: every env var is server-only, and <Code>src/lib/supabase/env.ts</Code> imports{" "}
            <Code>server-only</Code>, so the build fails if a secret is pulled into client code.
          </p>
        </Prose>

        <SubHeading id="doors">Two doors, one rulebook</SubHeading>
        <DataTable
          stack
          columns={["", "People (web door)", "Agents (MCP door)"]}
          rows={[
            ["Entry", <span key="a">Pages and server actions in <Code>src/app</Code></span>, <Code key="b">POST /api/mcp</Code>],
            [
              "Identity",
              <span key="a">Supabase session cookie, refreshed by <Code>src/proxy.ts</Code></span>,
              <span key="b"><Code>Authorization: Bearer aitb_…</Code> personal agent token</span>,
            ],
            [
              "Supabase client",
              <span key="a"><Code>createSupabaseServerClient()</Code>: cookies, RLS as the person</span>,
              <span key="b"><Code>createSupabaseAnonClient()</Code>: no session, publishable key only</span>,
            ],
            ["DB entry point", <Code key="a">public.web_call(action, args)</Code>, <Code key="b">public.mcp_call(token, tool, args)</Code>],
            ["Actor resolved by", <Code key="a">auth.uid()</Code>, <span key="b"><Code>private.resolve_token(token)</Code>: SHA-256 hash lookup</span>],
            ["Recorded as", <Code key="a">via = &apos;web&apos;</Code>, <Code key="b">via = &apos;agent&apos;</Code>],
            ["New tickets land in", "To Do", "Proposed (a person approves the draft)"],
            ["Can approve", <span key="a">Yes (<Code>decide</Code>)</span>, <span key="b">No. No tool, and <Code>mcp_call</Code> has no branch for it</span>],
          ]}
        />
      </Section>

      <Section id="mechanism" title="Core mechanism">
        <SubHeading id="route">The route</SubHeading>
        <Prose>
          <p>
            <Code>mcp-handler</Code> is a framework-agnostic adapter: it turns an MCP server definition into a Web-standard{" "}
            <Code>(Request) =&gt; Promise&lt;Response&gt;</Code>, which is exactly what a Route Handler exports. The whole route,
            trimmed:
          </p>
        </Prose>
        <CodeBlock title="src/app/api/mcp/route.ts (trimmed)" code={ROUTE} />
        <Prose>
          <BulletList>
            <li>
              <Code>createMcpHandler(init, options)</Code> builds the server; <Code>init</Code> gets an <Code>McpServer</Code> to
              register tools on.
            </li>
            <li>
              Tools are registered in one loop with no tool-specific code: validate input, map it with <Code>toArgs</Code>, call{" "}
              <Code>mcp_call</Code>, return JSON. Adding a tool means an entry in <Code>TOOLS</Code> and a branch in{" "}
              <Code>private.mcp_call</Code>.
            </li>
            <li>
              <Code>{"export { authed as GET, authed as POST }"}</Code> is all the Next.js wiring. <Code>mcp-handler</Code> never
              looks at the pathname, so <Code>/api/mcp</Code> is only a convention.
            </li>
            <li>The database returns <Code>jsonb</Code>; the route pretty-prints it into a <Code>text</Code> block for the model.</li>
            <li>
              Errors become <Code>isError: true</Code> results, not thrown exceptions. A rule violation such as &ldquo;Only the
              owner or an admin can move this ticket&rdquo; reaches the agent as readable text it can act on, and the JSON-RPC
              exchange stays healthy.
            </li>
            <li>
              Runtime: the default Node.js runtime, no <Code>export const runtime</Code>. No <Code>maxDuration</Code>,{" "}
              <Code>basePath</Code> or <Code>redisUrl</Code>: <Code>mcp-handler</Code> 2.x dropped those options, and every tool
              call is one short RPC.
            </li>
          </BulletList>
        </Prose>

        <SubHeading id="tools-as-data">Tools as data</SubHeading>
        <Prose>
          <p>
            Each tool in <Code>src/lib/mcp/tools.ts</Code> is a plain object: <Code>name</Code>, <Code>title</Code>,{" "}
            <Code>description</Code>, a zod <Code>schema</Code> and <Code>toArgs</Code>. A small generic <Code>defineTool</Code>{" "}
            types each <Code>toArgs</Code> against its own schema while the exported <Code>TOOLS</Code> array stays one uniform type
            the route can loop over.
          </p>
          <p>
            <strong><Code>toArgs</Code> is the translation layer.</strong> Agents get a flat shape; the dispatcher gets the shape it
            expects. For <Code>create_ticket</Code>:
          </p>
        </Prose>
        <DataTable
          columns={["What the agent sends", "What mcp_call receives"]}
          rows={[
            [<Code key="a">title: &quot;Agent Arena scoring&quot;</Code>, <Code key="b">title: &quot;Agent Arena scoring&quot;</Code>],
            [<Code key="a">type: &quot;code&quot;</Code>, <Code key="b">type: &quot;code&quot;</Code>],
            ["(not sent)", <Code key="b">visibility: &quot;team&quot;</Code>],
            [<Code key="a">goal: &quot;Score every match&quot;</Code>, <Code key="b">fields.goal</Code>],
            [<Code key="a">done_when: [&quot;Scores stored&quot;, &quot;Tests pass&quot;]</Code>, <Code key="b">fields.done_when</Code>],
            [<Code key="a">deadline: &quot;Fri 7 Nov&quot;</Code>, <Code key="b">fields.deadline</Code>],
            [<Code key="a">inputs: &quot;Spec in devs/&quot;</Code>, <Code key="b">fields.inputs</Code>],
          ]}
        />
        <Prose>
          <BulletList>
            <li>A <Code>compact()</Code> helper drops <Code>undefined</Code> keys, so partial updates stay partial.</li>
            <li>
              Schemas reuse the domain vocabulary: <Code>z.enum(STAGES)</Code>, <Code>z.enum(TICKET_TYPES)</Code> and the field keys
              come from <Code>src/lib/domain.ts</Code>, the constants the UI renders. Rename a stage once and both doors pick it up.
            </li>
            <li>
              <Code>update_fields</Code> uses <Code>z.strictObject</Code>, so an unknown field key fails validation before the
              request reaches the database.
            </li>
            <li>
              Descriptions are prompts: they say what to do next. <Code>get_ticket</Code> points at <Code>next_stage_missing</Code>;{" "}
              <Code>request_move</Code> spells out <Code>moved</Code> / <Code>blocked</Code> / <Code>waiting</Code> and that agents
              can&apos;t approve; <Code>add_comment</Code> says stage data belongs in fields, not comments.
            </li>
          </BulletList>
        </Prose>

        <SubHeading id="tools">The seven tools</SubHeading>
        <DataTable
          stack
          columns={["Tool", "Input", "DB function", "What the agent gets back"]}
          rows={[
            [<Code key="t">get_next_ticket</Code>, <Code key="i">tag?</Code>, <Code key="d">core_next_ticket</Code>, "Your oldest To Do ticket that isn't waiting for approval, with its brief and what the next stage needs, plus your tickets already in progress. tag lets a local agent skip tickets tagged for a cloud routine"],
            [<Code key="t">list_tickets</Code>, <span key="i"><Code>stage?</Code>, <Code>owner?</Code> (&quot;me&quot; or an email), <Code>tag?</Code>, <Code>include_closed?</Code>, <Code>limit?</Code> (1–200)</span>, <Code key="d">core_list</Code>, "Tickets you can see. Done and Cancelled are left out unless asked for"],
            [<Code key="t">get_ticket</Code>, <Code key="i">number</Code>, <Code key="d">core_get_ticket</Code>, <span key="r">Brief, all fields, comments, history, pending approval, <Code>next_stage_missing</Code></span>],
            [<Code key="t">create_ticket</Code>, <span key="i"><Code>title</Code>, <Code>type</Code>, <Code>goal</Code>, <Code>done_when[]</Code>, <Code>deadline</Code>, <Code>inputs</Code>, plus optional <Code>owner_email</Code>, <Code>visibility</Code>, <Code>repo</Code>, <Code>notes</Code>, <Code>tags</Code>, <Code>source</Code></span>, <Code key="d">core_create_ticket</Code>, <span key="r"><Code>status: &quot;proposed&quot;</Code>: the draft waits in Proposed for a person. <Code>blocked</Code> with the missing fields if the brief is incomplete</span>],
            [<Code key="t">update_fields</Code>, <span key="i"><Code>number</Code>, <Code>fields?</Code>, <Code>title?</Code>, <Code>tags?</Code></span>, <Code key="d">core_update_ticket</Code>, <span key="r"><Code>status: &quot;updated&quot;</Code> with the ticket key. Fills what the next stage needs and ticks <Code>done_when</Code> items</span>],
            [<Code key="t">request_move</Code>, <span key="i"><Code>number</Code>, <Code>to</Code> (a stage), <Code>note?</Code></span>, <Code key="d">core_request_move</Code>, <span key="r"><Code>moved</Code>, <Code>blocked</Code> (with the missing fields) or <Code>waiting</Code> (a person must approve)</span>],
            [<Code key="t">add_comment</Code>, <span key="i"><Code>number</Code>, <Code>body</Code></span>, <Code key="d">core_add_comment</Code>, <span key="r"><Code>status: &quot;commented&quot;</Code> with the comment id</span>],
          ]}
        />
        <Prose>
          <p>
            <Code>whoami</Code> is also accepted by <Code>private.mcp_call</Code> but not registered as a tool; it only checks the
            token. There is no approve tool, on purpose: <Code>src/lib/mcp/tools.test.ts</Code> asserts that no tool name contains{" "}
            <Code>approve</Code>, and <Code>private.mcp_call</Code> has no <Code>decide</Code> branch, so even a hand-written
            JSON-RPC call can&apos;t approve.
          </p>
        </Prose>

        <SubHeading id="auth">Auth on every request</SubHeading>
        <Prose>
          <BulletList>
            <li>
              <strong>Keep the proxy out of the way.</strong> <Code>src/proxy.ts</Code> (Next.js 16 renamed Middleware to Proxy)
              refreshes the cookie session and redirects signed-out visitors to <Code>/login</Code>. An MCP client has no cookie, so
              the matcher excludes <Code>api/mcp</Code>.
            </li>
            <li>
              <strong><Code>{"withMcpAuth(handler, verify, { required: true })"}</Code></strong> reads{" "}
              <Code>Authorization: Bearer &lt;token&gt;</Code> and verifies it with <Code>mcp_call(token, &quot;whoami&quot;)</Code>.
              A missing or invalid token gets a <Code>401</Code> with a <Code>WWW-Authenticate: Bearer</Code> challenge and never
              reaches the MCP server. On success the <Code>AuthInfo</Code> is attached and tools read{" "}
              <Code>ctx.http?.authInfo?.token</Code>.
            </li>
            <li>
              The tool passes the token on to <Code>mcp_call</Code>, so the database checks it again on every tool call. The route is
              a pass-through; Postgres has the final say.
            </li>
            <li>
              <strong>Agent tokens:</strong> <Code>aitb_</Code> plus 48 hex characters (24 random bytes from{" "}
              <Code>gen_random_bytes</Code>). Only the SHA-256 hash and a 12-character display prefix are stored; the raw token is
              returned once by <Code>create_token</Code>. <Code>private.resolve_token</Code> rejects anything under 20 characters
              and updates <Code>last_used_at</Code>; revoking sets <Code>revoked_at</Code>, so the next request fails.
            </li>
            <li>
              <strong>No privileged key in the route.</strong> <Code>createSupabaseAnonClient()</Code> uses only the publishable key.{" "}
              <Code>public.mcp_call</Code> is granted to <Code>anon</Code> and its <Code>SECURITY DEFINER</Code> body checks the
              token itself; everything else in <Code>private</Code> has <Code>execute</Code> revoked from <Code>public</Code>,{" "}
              <Code>anon</Code> and <Code>authenticated</Code>; <Code>SECURITY DEFINER</Code> functions pin{" "}
              <Code>search_path = &apos;&apos;</Code>. A leaked deployment env var gives no more power than the browser key.
            </li>
            <li>
              <strong>Never more than the person.</strong> The token resolves to a person and the agent sees what they see (
              <Code>private.can_see</Code>, private tickets included). <Code>via = &apos;agent&apos;</Code> changes the rules in the
              database: agent-created tickets start in Proposed, and a move that needs approval always waits for a person, even if
              the agent acts for the approver. Moves that need no approval go through like a person&apos;s.
            </li>
          </BulletList>
        </Prose>

        <SubHeading id="end-to-end">One call, end to end</SubHeading>
        <Prose>
          <p>An agent asks to move AIT-1003 to Review:</p>
          <BulletList ordered>
            <li>
              Claude Code sends <Code>tools/call</Code> to <Code>/api/mcp</Code> with its bearer token. <Code>proxy.ts</Code>{" "}
              doesn&apos;t run for this path.
            </li>
            <li>
              <Code>withMcpAuth</Code> checks the token with <Code>mcp_call(token, &quot;whoami&quot;)</Code>. A bad token gets a{" "}
              <Code>401</Code> here.
            </li>
            <li>
              <Code>mcp-handler</Code> parses the JSON-RPC message and validates the arguments against <Code>request_move</Code>&apos;s
              zod schema. <Code>to: &quot;shipped&quot;</Code> would fail here, because it isn&apos;t one of the <Code>STAGES</Code>.
            </li>
            <li>
              The tool callback runs <Code>toArgs</Code> and calls <Code>mcp_call(token, &quot;request_move&quot;, …)</Code> with the
              anon client.
            </li>
            <li>
              Postgres resolves the token to a person and runs <Code>core_request_move</Code> with <Code>via = &apos;agent&apos;</Code>
              : visibility, edit rights, one stage at a time, required fields and the approver. Because an agent asked, the move
              becomes a pending request.
            </li>
            <li>
              The JSON result goes back to the agent as text: <Code>status: &quot;waiting&quot;</Code> with a reason it can relay to
              the user.
            </li>
            <li>Within 10 seconds, every open board tab that can see the ticket re-renders and shows the pending approval.</li>
          </BulletList>
        </Prose>
      </Section>

      <Section id="decisions" title="Key decisions and trade-offs">
        <DataTable
          stack
          columns={["Decision", "Why", "Rejected"]}
          rows={[
            ["MCP as a Route Handler in the product's own app", "One rulebook, one identity model, one deploy, shared vocabulary", "A local stdio package per user, or a standalone HTTP service"],
            ["Stateless Streamable HTTP", "No sticky sessions, no Redis; scales like any other route", <span key="r">The 2024-11-05 HTTP+SSE transport with per-client sessions (<Code>mcp-handler</Code> 1.x took a <Code>redisUrl</Code> for it)</span>],
            [<span key="d">Every rule in <Code>private.core_*</Code>; the route only translates</span>, "A rule change applies to people and agents together", <span key="r"><Code>if</Code> statements in the route, which make the UI and agent paths diverge</span>],
            ["Agents act as their person, with tighter rules", "No separate permissions to audit; an agent sees exactly what its person sees", "A separate service account with its own permissions"],
            ["No approve tool", "Only people approve; enforced by a test and by the dispatcher", "—"],
            ["No privileged key in the MCP route", "A leaked deployment env var gives no more power than the browser key", "A service-role key in the route"],
            [<span key="d">Errors as <Code>isError: true</Code> results</span>, "The agent can read the message, fix its input and retry", "Thrown errors, which look to the model like a broken server"],
            ["Tool descriptions written as prompts", "Most of the “agent did the wrong thing” fixes were description edits", "—"],
          ]}
        />

        <SubHeading id="setups">Three ways to host MCP</SubHeading>
        <Prose>
          <p>
            Most MCP servers are set up as a local stdio server (A) or a standalone HTTP service (B). This repo is C.
          </p>
        </Prose>
        <DataTable
          stack
          columns={["", "A. Local stdio", "B. Standalone HTTP service", "C. Route in the Next.js app"]}
          rows={[
            ["Where it runs", "On each user's machine, as a child process of the client", "Its own server or container", <span key="c">Inside the existing Next.js deployment (Vercel, <Code>bom1</Code>)</span>],
            ["Transport", "stdin/stdout", "Often HTTP+SSE (older) or Streamable HTTP", <span key="c">Streamable HTTP, stateless (<Code>mcp-handler</Code> 2.x)</span>],
            ["Process lifetime", "As long as the client session", "Always-on process", "Per request, in a serverless function"],
            ["Session state", "In process memory", "In memory, so multi-instance needs sticky routing or Redis", "None. Each request stands alone"],
            ["Repos and deploys", "Separate package, published to npm/PyPI", "Separate repo or service, separate pipeline", <span key="c">Same repo, same <Code>git push</Code>, same deploy</span>],
            ["Business rules", "Calls your product's API, or reimplements it", "Calls an internal API, or duplicates logic", <span key="c">The same Postgres functions the UI calls (<Code>core_*</Code>)</span>],
            ["Who can connect", "Only clients on that machine", "Anyone who can reach the URL", "Anyone who can reach the URL: Claude Code locally, cloud routines on a public URL"],
            ["Auth", "Usually an API key in the local env", "You build it: API keys, OAuth, a gateway", <span key="c"><Code>withMcpAuth</Code> + personal agent tokens checked in Postgres</span>],
            ["Secrets", "Spread across every user's config", "In the service's own env", "In the app's existing server-only env; no extra secret for MCP"],
            ["Onboarding", "Install a package, edit a JSON file", "Docs page plus a key from somewhere", <span key="c">The app&apos;s <Code>/settings/agents</Code> page creates the token and prints the command</span>],
            ["Updating", "Every user upgrades their copy", "Deploy the service, keep it compatible", "Deploy the app; tools and UI change in the same commit"],
            ["Local dev", "Run the package locally", "Run the service and the product, wire them together", <span key="c"><Code>npm run dev</Code> runs both doors on <Code>localhost:3000</Code></span>],
            ["Server-to-client push", "Yes, over the open pipe", "Yes, over SSE", <span key="c">No: session <Code>GET</Code>s get <Code>405</Code>. The board doesn&apos;t need push</span>],
          ]}
        />
      </Section>

      <Section id="evaluation" title="Evaluation">
        <Prose>
          <p>This is a protocol surface, not a model, so nothing is scored; correctness is tested.</p>
        </Prose>
        <DataTable
          stack
          columns={["Check", "How", "What it covers"]}
          rows={[
            [<Code key="c">src/lib/mcp/tools.test.ts</Code>, <Code key="h">npm test</Code>, "The tool list (and that there's no approve tool), the toArgs mapping, stage validation and strict field keys"],
            [<Code key="c">supabase/tests/smoke.sql</Code>, "Against a real database; rolls back", <span key="w">Walks the rules engine, including agent tokens and RLS; ends with <Code>SMOKE_OK</Code></span>],
            ["Auth is enforced", <Code key="h">curl -i -X POST http://localhost:3000/api/mcp</Code>, <span key="w">Expects <Code>401</Code> with a <Code>WWW-Authenticate: Bearer</Code> header</span>],
          ]}
        />
        <Callout kind="note" title="No run results published">
          <p>The source doc lists these checks but reports no run counts or results, so this page doesn&apos;t either.</p>
        </Callout>
      </Section>

      <Section id="limits" title="Limits and risks">
        <Prose>
          <BulletList>
            <li>
              <strong>No server push.</strong> Stateless serving means no long-lived stream for notifications. If the server must
              push to the agent, a standalone stateful server fits better.
            </li>
            <li>
              <strong>Auth runs on every request</strong>, including <Code>initialize</Code> and <Code>tools/list</Code>, and each
              tool call adds its own <Code>mcp_call</Code>: two quick RPCs per tool call, fine at this scale.{" "}
              <Code>last_used_at</Code> reflects the last request of any kind.
            </li>
            <li>
              <strong>Coupled releases.</strong> The MCP server ships when the app ships: right for one team and one product, wrong
              for a public MCP server serving many products.
            </li>
            <li>
              <strong>No local-only tools.</strong> A remote server can&apos;t touch the user&apos;s filesystem. Agents use their own
              local tools for that, and the board only for ticket state.
            </li>
            <li>
              <strong>The 401 challenge points at an OAuth metadata URL that isn&apos;t served.</strong> <Code>withMcpAuth</Code>{" "}
              advertises <Code>/.well-known/oauth-protected-resource</Code>; Supabase OAuth for MCP isn&apos;t in v1, so clients
              must be set up with the header from the start (<Code>claude mcp add --header</Code>, or the claude.ai connector
              header).
            </li>
            <li>
              <strong><Code>localhost</Code> only works for local agents.</strong> Cloud routines need the board on a public URL.
            </li>
            <li>
              <strong><Code>mcp-handler</Code> 2.x is not 1.x</strong>, which most online examples use: <Code>inputSchema</Code>{" "}
              takes a full <Code>{"z.object({…})"}</Code>, auth is <Code>ctx.http?.authInfo</Code> not <Code>extra.authInfo</Code>,{" "}
              <Code>basePath</Code> / <Code>redisUrl</Code> / <Code>maxDuration</Code> and the SSE options are gone, and tools use{" "}
              <Code>registerTool</Code>, not <Code>server.tool(…)</Code>.
            </li>
            <li>
              <strong>Exclude the MCP route from <Code>proxy.ts</Code>.</strong> Otherwise cookie-less agents get a redirect to{" "}
              <Code>/login</Code> and the client reports a confusing protocol error.
            </li>
          </BulletList>
        </Prose>
      </Section>

      <Section id="run" title="Run it yourself">
        <Prose>
          <p>
            In the <Code>ai-team-board</Code> repo. Set <Code>SUPABASE_URL</Code>, <Code>SUPABASE_PUBLISHABLE_KEY</Code> and{" "}
            <Code>SITE_URL</Code> in <Code>.env</Code> (copied from <Code>.env.example</Code>).
          </p>
          <BulletList ordered>
            <li>
              <Code>npm install</Code>, then <Code>npm run dev</Code>: the UI and MCP both on <Code>http://localhost:3000</Code>.
            </li>
            <li>
              Sign in, open <Code>/settings/agents</Code> and create a token named after where it runs, such as &ldquo;Claude Code on
              my MacBook&rdquo;.
            </li>
            <li>
              Paste the command it prints:{" "}
              <Code>
                {`claude mcp add --transport http ait-board http://localhost:3000/api/mcp --header "Authorization: Bearer <token>"`}
              </Code>
            </li>
            <li>In Claude Code, ask &ldquo;pick up my next board ticket&rdquo; and watch the board update within 10 seconds.</li>
            <li>
              Check auth is enforced: <Code>curl -i -X POST http://localhost:3000/api/mcp</Code> should return <Code>401</Code> with
              a <Code>WWW-Authenticate: Bearer</Code> header.
            </li>
            <li>
              Run the tests: <Code>npm test</Code> and <Code>supabase/tests/smoke.sql</Code>.
            </li>
          </BulletList>
        </Prose>

        <SubHeading id="own-app">In your own Next.js app</SubHeading>
        <Prose>
          <BulletList ordered>
            <li>
              Install: <Code>npm install mcp-handler@^2 @modelcontextprotocol/server@^2 zod@^4</Code>
            </li>
            <li>
              Create <Code>app/api/mcp/route.ts</Code>, register tools with <Code>createMcpHandler</Code>, and{" "}
              <Code>{"export { handler as GET, handler as POST }"}</Code>.
            </li>
            <li>
              If it needs auth, wrap it in <Code>{"withMcpAuth(handler, verify, { required: true })"}</Code> and read{" "}
              <Code>ctx.http?.authInfo</Code> in tools.
            </li>
            <li>Exclude the route from <Code>proxy.ts</Code> if you have one.</li>
            <li>Point the tools at the same service layer your UI uses, so there&apos;s one place for the rules.</li>
            <li>
              Connect: <Code>{`claude mcp add --transport http <name> <url> --header "Authorization: Bearer <token>"`}</Code>
            </li>
          </BulletList>
        </Prose>
      </Section>

      <Section id="next" title="Open questions and next steps">
        <Prose>
          <BulletList>
            <li>
              OAuth for MCP: when Supabase OAuth lands, serve <Code>protectedResourceHandler</Code> at{" "}
              <Code>/.well-known/oauth-protected-resource</Code> and add it to the proxy matcher&apos;s exclusions, so clients
              can connect without a pasted header.
            </li>
          </BulletList>
        </Prose>
      </Section>
    </>
  );
}
