# MCP inside a Next.js app

Source: `[DOC]` ~/Documents/Repo/ai-team-board/docs/mcp-in-nextjs.md (502 lines). The entry is confined to this one doc (asked: 5 Nov 2026): every fact below comes from it or from the person's answers. Section numbers refer to the doc's own `§1`–`§12`.

## Identity
- Slug: mcp-in-nextjs
- Title (2–5 words, the idea not the repo): MCP inside a Next.js app (asked: 5 Nov 2026)
- One-line pitch (≤ 90 chars, for a non-tech reader): People and AI agents share one board through two doors, with one set of rules. (asked: 5 Nov 2026)
- Tags (1–3): mcp, agents (asked: 5 Nov 2026)
- Status: experiment (asked: 5 Nov 2026)
- Owner: Kumar Gaurav (asked: 5 Nov 2026)
- Source: ~/Documents/Repo/ai-team-board/docs/mcp-in-nextjs.md
- Last updated: 5 Nov 2026 (entry written; the doc carries no date of its own)

## Readers
- Non-tech reader we picture: any colleague with no tech background, e.g. finance, HR or ops; the same reader as the other entries (asked: 5 Nov 2026)
- What they should be able to say after the explainer (drafted from [DOC] TL;DR, confirmed with the outline): (1) people and AI assistants use the same board through two different doors; (2) both doors lead to one rulebook, so an assistant can never do more than the person it works for; (3) assistants can draft and ask, but only a person approves.
- Engineer we picture: a Next.js developer who wants AI agents to use their product and assumes that needs a separate MCP server, the picture the doc opens with [DOC §1]
- What they should be able to decide after the tech page: whether to serve MCP as a route in their existing app (setup C) instead of a local stdio package (A) or a standalone HTTP service (B), and what that costs: no server push, auth on every request, coupled releases, no local-only tools [DOC §2]

## The idea
- Problem it solves, as a situation: the AI team wants its AI agents (Claude Code on a laptop, claude.ai cloud routines) to pick up, draft and move tickets on the same board people use [DOC TL;DR, §1]. The usual picture is a separate MCP server with its own repo, deploy and config [DOC §1]; when the MCP service and the product are separate they drift apart: "a validation rule lands in one and not the other" [DOC §2 "What we gain"].
- How it works, in plain steps:
  1. A person creates a personal agent token on the board's `/settings/agents` page; the raw token is shown once, inside a ready-to-paste connect command [DOC §6.1].
  2. The agent sends every request to `/api/mcp` with that token; a missing or invalid token gets a `401` and never reaches the MCP server [DOC §7.2].
  3. The agent picks from seven tools, e.g. "move ticket 1003 to Review"; there is no approve tool [DOC §5].
  4. Both doors hand the request to the same rules in the database, which resolve the token to a person and check it as that person, with stricter rules because an agent asked: agent-created tickets start in Proposed, and a move that needs approval always waits for a person [DOC §3, §7.5].
  5. Every open board tab that can see the ticket refreshes within 10 seconds [DOC §6.3, §8].
- Visual metaphor (asked: 5 Nov 2026): **one restaurant kitchen with a dining-room door and a delivery window.** People order in the dining room (the web UI); AI assistants order at the delivery window (the MCP route, `/api/mcp`). Each delivery rider shows an order pass the restaurant issued for one diner (the personal agent token). Both doors feed one kitchen with one rulebook (`private.core_*`) and one order rail over the pass (the board, tickets moving along it). Only a person holds the approval stamp. MCP itself is the standard delivery order slip every delivery app can fill in. The usual setup is a second, separate delivery-only kitchen with its own copy of the rulebook. The accent marks the delivery window, the thing the entry is about.
- Worked example for "See it in action": an agent asks to move ticket 1003 to Review; the rules answer `waiting` because an agent asked; within 10 seconds the board shows "waiting for approval" [DOC §8]. Example ticket numbers are fine to publish (asked: 5 Nov 2026: only emails, passwords and tokens are off the page).
- Interactive figure? yes (asked: 5 Nov 2026): pick who is asking (a person or their AI assistant) and an action; see the kitchen's answer. Example values only, built on the shared `OutcomePicker`. Outcomes, all from the doc:
  - Draft a new ticket: person → lands in To Do [DOC §3 table]; agent → lands in Proposed, waits for a person to approve the draft [DOC §3 table, §5].
  - Move a ticket a stage on, no sign-off needed: both → goes through, an agent's "like a person's would" [DOC §7.5].
  - Move a ticket to a stage that needs sign-off: person → the rules decide as for any person, and a person who can approve can then approve it (`decide`) [DOC §3 table, §6.2]; agent → always waits for a person, even if the agent acts for the approver [DOC §7.5].
  - Approve a waiting move: person → can approve [DOC §3 table "Can approve: Yes"]; agent → not possible: no tool, and the rules have no branch for it [DOC §3 table, §5].
  - Move to a stage that doesn't exist (`"shipped"`): both → refused before it reaches the rules (agent: zod schema [DOC §8 step 3]). Person path for this one is not in the doc, so the lab shows it for the agent only, or leaves it out.
- The one code snippet for the tech page (asked: 5 Nov 2026): `src/app/api/mcp/route.ts` trimmed to its shape: `createMcpHandler` + one loop over `TOOLS` + `withMcpAuth` + `export { authed as GET, authed as POST }` [DOC §4].

## The facts
- Stack and models: Next.js 16 App Router (`proxy.ts`, "Next.js 16 renamed Middleware to Proxy") [DOC §6, §7.1]; Supabase Postgres [DOC §1 table]; `@modelcontextprotocol/server` `2.4.0`, `mcp-handler` `2.3.0`, `zod` `4.6.7` [DOC §4]; Vercel, region `bom1` (Mumbai), Fluid Compute, default Node.js runtime [DOC §4 Runtime]. No model is called by the app; the models live in the MCP clients, Claude Code on a laptop or a claude.ai cloud routine, which run outside the repo [DOC §1 table].
- Architecture / data flow: one Next.js app, two doors [DOC §3]:
  - People: browser → `proxy.ts` (cookie session) → pages and server actions (`src/app/(board)`, `actions.ts`) → `webCall()` with `createSupabaseServerClient()` → `public.web_call(action, args)` as `auth.uid()`, recorded `via = 'web'`.
  - Agents: Claude Code / cloud routine → `POST /api/mcp` + `Authorization: Bearer aitb_…` → `withMcpAuth` → `mcp-handler` → `mcpCall()` with `createSupabaseAnonClient()` (publishable key, no session) → `public.mcp_call(token, tool, args)` → `private.resolve_token` (SHA-256 hash lookup), recorded `via = 'agent'`.
  - Both `public.*_call` are `SECURITY INVOKER` wrappers around `SECURITY DEFINER` functions in `private`, which PostgREST doesn't expose; both end at `private.core_*` ("stage rules"). Users can only `select` tables; every write goes through a dispatcher.
  - Live refresh: `LiveRefresh.tsx` polls `/api/last-change` every 10 s while the tab is visible and calls `router.refresh()` when the latest timestamp changes; `/api/last-change` reads with the person's RLS [DOC §6.3].
  - The browser never talks to Supabase directly; all env vars are server-only, and `src/lib/supabase/env.ts` imports `server-only` so the build fails if a secret is pulled into client code [DOC §6.3].
- Core mechanism [DOC §1, §4, §5, §7, §8]:
  - A remote MCP server is a URL: the client `POST`s JSON-RPC (`initialize`, `tools/list`, `tools/call`) and reads JSON back, so a Next.js Route Handler can serve it.
  - `mcp-handler` turns an MCP server definition into a Web-standard `(Request) => Promise<Response>`. 2.x speaks the 2026-07-28 MCP spec natively (stateless, no sessions) and falls back to stateless Streamable HTTP for 2025-era clients. The `/api/mcp` path is a convention; `mcp-handler` never looks at the pathname.
  - The route registers every tool in one loop with no tool-specific code: validate input, `toArgs` maps the agent's flat shape to the dispatcher's shape, call `mcp_call`, return the `jsonb` pretty-printed in a `text` block. Errors come back as `isError: true` results with a readable message, not thrown exceptions.
  - The whole MCP layer is two files: route 52 lines, tool list 160 lines [DOC TL;DR].
  - `toArgs` example: the agent sends `goal`, `done_when`, `deadline`, `inputs` at the top level; `mcp_call` receives them nested under `fields`, plus `visibility: "team"`. A `compact()` helper drops `undefined` keys so partial updates stay partial.
  - Schemas reuse `STAGES`, `TICKET_TYPES` and the field keys (`EDITABLE_FIELDS`) from `src/lib/domain.ts`, the same constants the UI renders; `update_fields` uses `z.strictObject`.
  - Tools (seven): `get_next_ticket` (`tag?`), `list_tickets` (`stage?`, `owner?`, `tag?`, `include_closed?`, `limit?` 1–200), `get_ticket` (`number`), `create_ticket` (`title`, `type`, `goal`, `done_when[]`, `deadline`, `inputs` + optional `owner_email`, `visibility`, `repo`, `notes`, `tags`, `source`; returns `proposed` or `blocked`), `update_fields` (`number`, `fields?`, `title?`, `tags?`), `request_move` (`number`, `to`, `note?`; returns `moved`, `blocked` or `waiting`), `add_comment` (`number`, `body`). Each maps to a `core_*` function. `whoami` is accepted by `mcp_call` but not registered; it only checks the token.
  - Auth: `proxy.ts`'s matcher excludes `api/mcp`. `withMcpAuth(handler, verify, { required: true })` reads the bearer token and verifies it with `mcp_call(token, "whoami")`; missing or invalid → `401` with `WWW-Authenticate: Bearer`. On success `AuthInfo` is attached and tools read `ctx.http?.authInfo?.token`; the tool passes the token to `mcp_call`, so the database checks it again on every tool call.
  - Agent tokens: `aitb_` + 48 hex characters (24 random bytes); only the SHA-256 hash and a 12-character display prefix are stored; the raw token is returned once; `resolve_token` rejects anything under 20 characters and updates `last_used_at`; revoke sets `revoked_at` [DOC §7.3]. (Format only; no token value appears on any page.)
  - One call end to end: the seven steps of [DOC §8], from `tools/call request_move` to the board showing "waiting for approval".
- Key decisions (decision, reason, rejected alternative) [DOC §2, §4, §7, §9]:
  1. **MCP as a Route Handler in the product's own app** (setup C): one rulebook, one identity model, one deploy, shared vocabulary. Rejected: A, a local stdio package each user runs (only clients on that machine, credentials in every user's config, every user upgrades); B, a standalone HTTP service (separate repo and pipeline, rules drift, often stateful).
  2. **Stateless Streamable HTTP**: no sticky sessions, no Redis, scales like any route. Rejected: the 2024-11-05 HTTP+SSE transport with per-client sessions (`mcp-handler` 1.x took a `redisUrl` for this). Cost: no server push; session `GET`s get `405`.
  3. **Rules out of the route**: the route only translates; every rule lives in `private.core_*`. Rejected: `if` statements in the route, which make the UI and agent paths diverge.
  4. **Agents act as their person, with tighter rules** (`via = 'agent'`). Rejected: a separate service account with its own permissions to audit.
  5. **No approve tool**: `tools.test.ts` asserts no tool name contains `approve`; `private.mcp_call` has no `decide` branch.
  6. **No privileged key in the route**: publishable key only, "no session and no service-role key" [DOC §7.4]; `public.mcp_call` granted to `anon` and checks the token itself; everything else in `private` has `execute` revoked from `public`, `anon`, `authenticated`; `SECURITY DEFINER` functions pin `search_path = ''`. A leaked deployment env var gives no more power than the browser key.
  7. **Errors as results**: the agent can read the message, fix its input and retry; a thrown error looks like a broken server.
  8. **Tool descriptions are prompts**: "Most of the 'agent did the wrong thing' fixes were description edits."
  - The doc's A / B / C comparison table [DOC §2 "Side by side"] goes on the tech page as a table.
- Evaluation: no scores; correctness is tested [DOC §10]. `npm test` runs `src/lib/mcp/tools.test.ts` (tool list, no approve tool, `toArgs` mapping, stage validation, strict field keys). `supabase/tests/smoke.sql` walks the rules engine against a real database, including agent tokens and RLS, rolls back and ends with `SMOKE_OK`. Manual: `curl -i -X POST …/api/mcp` expects `401` with `WWW-Authenticate: Bearer`. The doc reports no run results or counts, so the page publishes none.
- Cost: no model call on this path; the doc gives no cost figure. Two quick RPCs per tool call (`whoami` + the tool's `mcp_call`), "fine at this scale" [DOC §9.3]. No number to publish.
- Limits and risks [DOC §2 "What we give up", §9]:
  - No server push.
  - Auth on every request, including `initialize` and `tools/list`; `last_used_at` reflects the last request of any kind.
  - Coupled releases: the MCP server ships when the app ships; a public MCP server for many products would want its own lifecycle.
  - No local-only tools: a remote server can't touch the user's filesystem; agents use their own tools for that and the board only for ticket state.
  - The 401 challenge advertises `/.well-known/oauth-protected-resource`, which isn't served (Supabase OAuth for MCP isn't in v1), so clients must be set up with the header from the start.
  - `localhost` works only for local agents; cloud routines need the board on a public URL.
  - `mcp-handler` 2.x is not the 1.x most online examples use: full `z.object` for `inputSchema`, `ctx.http?.authInfo` not `extra.authInfo`, no `basePath` / `redisUrl` / `maxDuration` / SSE options, `registerTool` not `server.tool(…)`.
  - Exclude the MCP route from `proxy.ts`, or cookie-less agents get redirected to `/login` and the client reports a confusing protocol error.
- How to run it [DOC §10, §11]: env var names `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SITE_URL`; `npm install`; `npm run dev` (UI and MCP on `http://localhost:3000`); create a token at `/settings/agents`; `claude mcp add --transport http ait-board http://localhost:3000/api/mcp --header "Authorization: Bearer <token>"`; ask Claude Code "pick up my next board ticket"; check the `401`; run `npm test` and `smoke.sql`. In your own app: the six steps of [DOC §11].
- Open questions / next steps: only the doc's item (asked: 5 Nov 2026: "confined doc", nothing added): OAuth for MCP via Supabase: serve `protectedResourceHandler` at `/.well-known/oauth-protected-resource` and add it to the proxy matcher's exclusions [DOC §9.7].
- Sources and links (brief only): [DOC]; `mcp-handler` repo link given in [DOC §4].

## Off the page
- No sensitive values: no email addresses, passwords or tokens (asked: 5 Nov 2026). Tokens appear only as the doc's `aitb_…` / `<token>` placeholders. No production URL (the doc has none; it uses `https://<site>` and `localhost`).

## Related entries
- Stands alone; no cross-link to `mira-mcp` (asked: 5 Nov 2026). The explainer explains MCP itself.

## Outline
Approved 5 Nov 2026 (the person asked to see the built pages, taken as approval).

### Explainer (VOICE.md order, each section with its figure)
1. **The one-line idea** — hero: one kitchen, a dining-room door with a person and a delivery window (accent) with an AI assistant rider, both arrows meeting at one rulebook and one order rail.
2. **Why it matters** — the usual way is a second, delivery-only kitchen with its own copy of the rulebook, and the copies drift. Figure: two kitchens side by side, one rule changed in one book only. Terms: *AI assistant / agent*, *MCP* (the standard order slip every delivery app can fill in).
3. **How it works** — five `Step`s, each with a figure from the cast:
   1. Get a pass: a person makes a pass for their assistant on the board's settings page (person hands pass to rider).
   2. Show the pass at the window: no pass, no service (rider at window, pass checked).
   3. Order from a short menu: seven things to ask for; approving isn't one of them (menu card; the stamp stays in a person's hand).
   4. One rulebook checks every order, as if the person asked, a little stricter for assistants: new tickets wait as drafts, sign-off moves wait for a person (both doors' arrows into one book).
   5. Everyone sees it: the order rail on every screen updates within 10 seconds (rail with a ticket moving, a 10-second clock).
4. **See it in action** — worked example: an assistant asks to move ticket 1003 to Review → waits for a person → board shows it within 10 seconds (small three-panel figure), then the lab: pick who's asking and what; see done / waits for a person / not possible.
5. **What it can't do** — the kitchen can't call the rider back (no push); it only handles the board, not files on your computer; cloud assistants need the board online; passes are pasted in by hand for now; a person always approves. Figure: the window with orders in and answers out, nothing going out unasked; the stamp in a person's hand.
6. **In one breath** — 2–3 sentences.
7. **Going deeper** — link to the tech view.

### Tech (VOICE.md order)
0. **On this page** — `PageIndex`: At a glance, then every section and sub-heading below.
1. **At a glance** — `DataTable`: framework (Next.js 16 App Router), MCP packages + versions, transport (stateless Streamable HTTP; 2026-07-28 spec, 2025-era fallback), database (Supabase Postgres), hosting (Vercel `bom1`, Fluid Compute, Node.js runtime), MCP clients (Claude Code, claude.ai cloud routines), models (none called by the app), size (route 52 lines, tools 160 lines), status experiment, owner Kumar Gaurav, source `ai-team-board/docs/mcp-in-nextjs.md`.
2. **Architecture** — boxes-and-arrows diagram of both doors → `web_call` / `mcp_call` → `private.core_*` → tables, plus the live-refresh poll. Sub-heading "Two doors, one rulebook": the doc's §3 table (entry, identity, Supabase client, DB entry point, actor, recorded as, new tickets land in, can approve).
3. **Core mechanism** — sub-headings: "The route" (the one `CodeBlock` + what each piece does), "Tools as data" (`toArgs` as a sends-vs-receives table, shared vocabulary, strict fields, descriptions as prompts), "Tools" (the seven-tool table), "Auth on every request" (proxy exclusion, `withMcpAuth`, token format and storage, no privileged key), "One call, end to end" (the seven steps of §8 as a numbered list).
4. **Key decisions and trade-offs** — decision / reason / rejected table (the eight above), then sub-heading "Three ways to host MCP": the A / B / C comparison table.
5. **Evaluation** — what's tested and how (unit tests, SQL smoke test, manual 401); states plainly that the doc reports no run counts.
6. **Limits and risks** — the eight items above.
7. **Run it yourself** — env var names, commands, connect, verify; then "In your own Next.js app" (six steps).
8. **Open questions / next steps** — OAuth for MCP only.
