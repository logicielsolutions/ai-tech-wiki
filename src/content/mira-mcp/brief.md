# Mira's MCP server

Source shorthand used below:
- `[SPEC]` ~/Projects/mira/docs/superpowers/specs/2026-08-14-mcp-server-design.md
- `[PLAN]` ~/Projects/mira/docs/superpowers/plans/2026-08-14-mcp-server.md (3,506 lines)
- `[CONNECT]` ~/Projects/mira/docs/connect-mcp.md (the user-facing guide)
- `[RUN]` ~/Projects/mira/docs/runbooks/mcp-server.md (the operator runbook)
- `[CODE]` ~/Projects/mira/apps/api/src/mcp/{server.ts,format.ts}, apps/api/src/lib/callQueries.ts
- `[LOG]` git log of the MCP paths in ~/Projects/mira

## Identity
- Slug: mira-mcp
- Title (2–5 words, the idea not the repo): Mira's MCP server (asked: 14 Oct 2026) — the person chose the plain name over the idea-shaped options, so the explainer's first job is to say what MCP is
- One-line pitch (≤ 90 chars, for a non-tech reader): Ask your AI assistant about any meeting you were in — without copy-pasting a thing. (asked: 14 Oct 2026)
- Tags (1–3): mcp, llms — decided from the work itself (asked: 14 Oct 2026), person delegated the call. A new `mcp` tag is added to the shared TAGS set because none of the five fit; `llms` because the surface exists to serve LLM clients. Deliberately NOT `agents`: nothing here is an agent, it is a read-only data surface.
- Status: production — `MCP_ENABLED=1` in `infra/deploy/ecs/mira-prod-api.base.json`, and `https://api.mira.logiciel.io/.well-known/oauth-protected-resource` returns 200 (verified 14 Oct 2026) [RUN, live check]
- Owner: Harpreet (asked: 14 Oct 2026) — [RUN] names only "Infra owner / on-call", no individual
- Source: ~/Projects/mira — MCP server in `apps/api`, OAuth authorization server in `apps/web`
- Last updated: 16 Sep 2026 (last MCP-path commit: user-facing connect guide) [LOG]

## Readers
- Non-tech reader we picture: any colleague at Logiciel with no AI background — finance, HR, ops; the same reader as the other two entries, and also the person who would actually connect Mira to their own AI client (asked: 14 Oct 2026)
- What they should be able to say after the explainer: three things, in this order of emphasis (decided by Claude, delegated 14 Oct 2026): (1) it cannot see more than I can — the AI sees exactly the calls I could already open, and nothing else, not even that they exist; (2) it can only read, never change anything; (3) I can disconnect it whenever I want. "I can connect it myself with one URL" is carried by the how-it-works steps rather than argued as a takeaway.
- Engineer we picture: a Logiciel developer who wants to expose their own product's data to AI clients (decided by Claude, delegated 14 Oct 2026) — [SPEC]'s own framing
- What they should be able to decide after the tech page: how to expose their own product this way — the two-audience token trick, self-gating queries, neutral failures, the two independent kill switches (decided by Claude, delegated 14 Oct 2026). Connecting a client is covered factually in "Run it yourself" rather than argued as a decision.

## The idea
- Problem it solves, as a situation: everything Mira knows about a call — summary, diarized transcript, who was there and when — was reachable only through the web app. Working with it in an AI client meant copy-pasting by hand, one call at a time. The most valuable question, "what did we decide about X?" across months of calls, was the hardest to ask, because it meant opening calls one by one to find the one that mattered. [SPEC §Problem]
- How it works, in 3–6 plain steps: (1) you add one URL to your AI client; (2) the client is turned away without a token and told where to ask; (3) your browser opens on Mira, you sign in with Google and see a consent screen naming who is asking; (4) you approve, and the client gets a one-hour key that works only on Mira's MCP door; (5) from then on the client can use four read-only tools, and sees exactly the calls you could already open. (decided by Claude, delegated 14 Oct 2026) [SPEC §Discovery and authorization flow, CONNECT]
- Visual metaphor (the everyday objects that stand for the parts): a standard power socket — Mira wires one socket, and Claude Code, Claude Desktop and Cursor all plug in unchanged, no adapter each. Carries the spec's "expose the data once and every client gets it". (asked: 14 Oct 2026) Known gap: the socket says nothing about permissions, so the access-control section needs a figure of its own that the socket does not supply.
- Worked example for "See it in action": "What did we decide about the Acme migration?" — decided (asked: 14 Oct 2026), person delegated the call. Chosen because [SPEC §Problem] names this exact shape as both the most valuable question and the hardest to ask, and it is the one that shows cross-call `search_transcript`, the highest-value tool in the set. The alternative (action items from a standup) only shows the cheap `list_calls` → `get_call` path.
- Interactive figure? (yes / no; example values only, never a live API call): yes — a "what can this person see?" toggle over four example calls and three example viewers (host / invited participant / uninvolved colleague), rows appearing and vanishing as you switch (decided by Claude, delegated 14 Oct 2026). All values hard-coded in the page and labelled as examples; no request ever leaves it. Precedent: both existing entries ship a client-side lab (`decisions-api/answer-sheet-lab.tsx`, `evals/grading-lab.tsx`).
- The one code snippet for the tech page (what it shows): the `401` + `WWW-Authenticate: Bearer resource_metadata="…"` challenge, paired with the protected-resource metadata JSON it points at — decided (asked: 14 Oct 2026), person delegated the call. Chosen because it is the whole design in three lines: how a client holding no token learns where to ask, why nothing needs pre-registering on Mira's side, and the one thing an engineer copying this pattern must get right.

## The facts
- Stack and models: TypeScript monorepo (pnpm + Turbo). API: Fastify, `@modelcontextprotocol/server` SDK, streamable HTTP transport. Web: Next.js with NextAuth Google SSO. Postgres via Drizzle, Redis for authorization codes. No model is called by this surface — it is a data surface, the model lives in the client. [SPEC, CODE]
- Architecture / data flow: split across the existing seam — the OAuth 2.1 **authorization server** lives in `apps/web` (it needs a browser session and a consent UI, and already has Google SSO); the MCP **resource server** (`POST /mcp`) lives in `apps/api` (it already has the DB, the RBAC helpers and the JWT verifier). RFC 9728 explicitly supports a resource server pointing at a separate authorization server, so this is the idiomatic shape, not a workaround. `apps/web` stores nothing itself: all OAuth state goes through `/internal/oauth/*` on the api. [SPEC §Architecture, RUN]
- Core mechanism (API, algorithm, request/response shape): one endpoint, `POST /mcp`, **stateless** — one transport per request, no server-side MCP session, so it scales horizontally behind the existing ALB. Four read-only tools, all executing as the authenticated user:
  - `list_calls` — find calls: `query` (full text over transcript bodies), `from`/`to` ISO dates, `project`, `host_email`, `participant_email`, `limit` (default 20, max 50), `cursor`. Returns compact rows only — id, title, date, duration, host, participant names, project, and whether a summary and transcript exist — because this is the "which call?" step and must stay cheap enough to run speculatively.
  - `get_call` — one call's metadata, participants with join/leave windows, project, tags, and the stored summary JSON verbatim (agenda, key notes, decisions, action items). Answers most questions at a fraction of a transcript's tokens.
  - `get_transcript` — speaker-labelled text paged **by time, not row offset**: `start_ms` / optional `end_ms`, bounded by a ~25k-character budget, and the response itself tells the model how to fetch the next page. A time cursor is legible to a model in a way `offset=500` is not, and matches how people refer to moments in a call.
  - `search_transcript` — `query`, **optional** `call_id`, `limit`. Without `call_id` it searches every call the viewer can read and returns snippets carrying call title, date, timestamp and speaker. Same Postgres `tsv` index that backs `GET /calls?q=`, ANDed with the visibility predicate. [SPEC §Tools, CODE]
- Key decisions (decision, reason, rejected alternative):
  1. **Act as the user, never as a service account.** Call access in Mira is per-user and grant-based (`apps/api/src/lib/rbac.ts`): you can read a call iff you are the host, an org admin, a joined participant, a calendar/manual invitee, or hold an unrevoked `access_grants` row — project membership deliberately does not grant access. A server running as a service account, or one that reimplements any part of that predicate, leaks calls. Rejected: both. [SPEC §Problem]
  2. **Two audiences, one keypair.** MCP access tokens are the same RS256 JWTs the web app already mints, with `aud` set to the MCP resource URL instead of the API audience, plus a `scope` claim. `POST /mcp` accepts only the MCP audience; every REST route accepts only the API audience. So an MCP token cannot be replayed against the REST API and a leaked web session token cannot drive MCP — token-audience binding satisfied with no new trust root and no second keypair to rotate. Rejected: a separate keypair. [SPEC §Token model]
  3. **Read-only in v1.** No launching Mira, no tagging, sharing or project assignment. Writes need scope gating, confirmation semantics and agent-attributed audit rows, none of which are free; they get their own design once the read surface has been used in anger. [SPEC §Non-goals]
  4. **No MCP resources or prompts in v1.** Access here is search-driven, not browse-driven — a flat picker of hundreds of calls is worse than a query — and client support for resources is uneven while tools work everywhere. [SPEC §Non-goals]
  5. **No client allowlist.** Client ID Metadata Documents let any HTTPS-hosting party appear at the consent screen, but the screen names them and the resulting token reaches only what that user could already open. An allowlist would add operational friction without narrowing the blast radius. [SPEC §Non-goals]
  6. **Don't rewrite the REST handlers.** The spec originally called for the existing routes to be rebuilt on the new query layer; during planning that was reversed. The stated benefit — one implementation of call-read RBAC — was already banked, since both surfaces call the same `rbac.ts` helpers. Rewriting ~1,600 lines of working handlers adds regression risk without adding safety. `callQueries.ts` is additive. [SPEC §Shared query layer, revised 2026-08-14]
  7. **Self-gating queries.** Each of the four functions in `callQueries.ts` takes `(db, viewerUserId, params)` and performs its own access check internally, so a caller cannot invoke one and forget the gate. Nothing in that file may accept a pre-computed "allowed" flag from its caller. [SPEC, CODE]
  8. **Neutral failures.** "No access" and "nonexistent call" return the identical sentence — distinguishing them would let tool output probe which calls exist. A call with no transcript reports *why* (still processing / failed / bot never joined) rather than returning empty text, so a model doesn't conclude the meeting was silent. Tool errors are readable prose, never stack traces or SQL. [SPEC §Failure behaviour]
  9. **Two kill switches, not one.** `MCP_ENABLED` is set independently on the api (gates `/mcp` and its `.well-known` routes) and the web (gates the OAuth routes and `/oauth/authorize`), because the two services deploy independently and each must be able to fail closed on its own. [RUN §Kill switch]
- Evaluation (what was measured, how, results): no eval numbers — this is a protocol surface, not a model, so correctness is tested rather than scored. 10 test files: 8 OAuth suites in `apps/web/test/unit/` (metadata, token, kill switch, revoke, register, client metadata, authorize actions) plus `apps/api/test/unit/mcp_format.test.ts` and `apps/api/test/integration/mcp_tools.test.ts`. The cases the design names as mandatory: PKCE verifier mismatch rejected; authorization code replay rejected; code bound to its `redirect_uri`, `client_id` and `resource`; refresh rotation invalidates the previous token and a rotated-token replay is *detectable* rather than merely rejected; revoked grant rejects both refresh and access-token minting; CIMD whose `client_id` doesn't equal its own URL rejected; audience crossing rejected in both directions; and the privacy case — a user with no access path to a call gets nothing from any of the four tools, including the fact that it exists (not even a `search_transcript` snippet when the query matches its text exactly). [SPEC §Testing, repo]
- Cost: no model call happens on this path — the model is in the reader's own client, so Mira pays only the existing API and database cost of serving the rows. No source quantifies it, so the page states this qualitatively and publishes no number (decided by Claude, delegated 14 Oct 2026).
- Limits and risks:
  - **Access tokens are not revocable mid-life.** Disconnect stops anything new from being issued, but a client holding a valid access token can keep using it for up to an hour, because tokens are verified by signature rather than looked up per request. A genuinely compromised client is an incident, handled with the kill switch, not with the Disconnect button. [CONNECT, RUN]
  - The display name on the consent screen is self-reported — anyone can claim any name. The raw `client_id` URL is the only honest identifier of who is asking, which is why the screen shows it verbatim and the guide tells people to read it. [SPEC, CONNECT]
  - `logiciel.io` SSO users only; external share-token recipients are deliberately excluded. [SPEC §Non-goals]
  - Refresh token lifetime starts at 30 days to match the external share token default, and is explicitly flagged for revisiting once real re-authorization frequency is known. [SPEC §Open questions]
  - **A wrong-but-present config value fails differently from a missing one** — the runbook was amended during review to make this explicit, and it belongs on the tech page as an operational gotcha (decided by Claude, delegated 14 Oct 2026): the surface fails closed on a missing `MCP_*` variable, but a present-and-wrong `MCP_RESOURCE_URL` yields tokens minted for an audience `/mcp` then rejects them, which reads as a client bug rather than a config bug. [LOG, RUN]
- How to run it: nothing to install. `claude mcp add --transport http mira https://api.mira.logiciel.io/mcp`, then ask it something that needs Mira; the first tool call opens the browser for approval. Claude Desktop: Settings → Connectors → Add custom connector → paste the URL. Cursor: Settings → MCP → Add new MCP server, transport http, same URL. Any MCP client supporting remote servers over streamable HTTP with OAuth works — nothing needs pre-registering on Mira's side. Staging: `https://api-staging.mira.logiciel.io/mcp`. Revoke in Settings → Connected apps. [CONNECT]
- Open questions / next steps: (1) write tools — launching Mira on a Meet link is the most-requested plausible next step, and needs scope gating plus agent-attributed audit rows; (2) refresh token lifetime, to be adjusted once re-authorization frequency is observed. [SPEC §Open questions]
- Sources and links: [SPEC], [PLAN], [CONNECT], [RUN], [CODE]; modelcontextprotocol.io; RFC 9728 (protected resource metadata), RFC 7591 (DCR), RFC 7009 (revocation); the 2026-07-28 MCP spec revision that made Client ID Metadata Documents primary and deprecated DCR

## Off the page
- Never read or quote: `~/Projects/mira/.env`, `.env.bak.*`, `.env.example` values. Configuration is referred to by variable name only (`MCP_ENABLED`, `MCP_RESOURCE_URL`, `MCP_AUTHORIZATION_SERVER`, `JWT_PUBLIC_KEY`, `ACCESS_TOKEN_TTL_SECONDS`). Observed in this session's research: no secret values were read.
- Nothing from the source is off-limits: hostnames, AWS account number, region, `#mira` and the connect-guide examples may all appear. (asked: 14 Oct 2026) The wiki is internal. Secrets remain excluded regardless — see the line above; that is a repo rule, not a judgement call.

## Outline

> Deviation approved 14 Oct 2026. VOICE.md's explainer order has 7 sections; this adds an 8th,
> **"Who can see what"**, between "How it works" and "See it in action". Reason: the socket metaphor
> carries "one door, every client" well and says nothing at all about permissions, which is the
> thing the reader most needs to believe. Folding it into "See it in action" would put two visuals
> and two ideas in one section, against the one-idea-one-visual rule. Tech view follows VOICE order
> exactly, 9 sections, nothing added.

### Explainer — metaphor: a standard power socket
1. **One socket, every assistant** (`idea`) — hero: a wall socket wired once, three different plugs (Claude Code, Claude Desktop, Cursor) fitting it unchanged. Pitch underneath. *Figure: hero socket + three plugs.*
2. **The notes were shut in one window** (`why`) — the situation: everything Mira knows about a call lived only in the web app, so working with it in an AI assistant meant copy-pasting one call at a time, and "what did we decide about X?" across months meant opening calls one by one. *Figure: a person copying from one window into another, one call at a time.*
3. **How it works** (`how`) — 5 steps, each a `Step` with a figure:
   1. *You add one address* — a single URL into the assistant you already use; no key, no password, nothing to install. *Figure: URL being pasted into a client.*
   2. *The assistant is turned away — politely* — with no pass it gets refused, and the refusal itself says where to go and ask. *Figure: closed door with a note pinned to it.*
   3. *You sign in and see who's asking* — your browser opens on Mira, you sign in with your Logiciel Google account, and a screen names the client and shows its address in full. *Figure: consent screen, the address highlighted.*
   4. *You get a pass that expires* — approve, and the assistant gets a pass good for an hour, which fits only Mira's socket and no other door. *Figure: a pass with an hour glass, next to the one socket it fits.*
   5. *Now it can ask four things* — find calls, read one call and its summary, read a transcript, search what was said. Read-only: nothing can change, share or delete anything. *Figure: four labelled tools, each with a "read" icon and no "write".*
4. **Who can see what** (`access`) — *the interactive lab.* Four example calls, three example viewers; switch viewer and watch rows appear and vanish. Plain-words rule underneath: the assistant sees exactly the calls you could already open, and a call you can't see doesn't come back as "forbidden", it comes back as "not found" — so nobody can use it to work out which calls exist. Labelled as made-up examples. *Figure: the lab itself.*
5. **See it in action** (`try`) — "What did we decide about the Acme migration?" followed end to end: the question goes in, Mira searches across months of calls instead of opening them one by one, and three short quotes come back, each with its date, its speaker and the moment it was said. *Figure: question → three dated snippets → answer.*
6. **What it can't do** (`limits`) — read-only, so it can never start, tag, share or delete; Logiciel accounts only, not external guests; a disconnected assistant can still use its pass until the hour runs out, which is why a genuinely stolen pass is an incident and not a button; the name on the consent screen is self-reported, so the address beneath it is the part to read. Closes with a `Callout` on where a person stays in charge. *Figure: the hour-glass pass expiring.*
7. **In one breath** (`summary`) — 2–3 sentences.
8. **Going deeper** (`deeper`) — link to the tech view.

### Tech — VOICE order, 9 sections
1. **At a glance** (`glance`) — `DataTable`: endpoint `POST /mcp`; transport streamable HTTP, stateless; scope `mira:read`; four read-only tools; auth OAuth 2.1 + PKCE S256 + CIMD (DCR fallback); stack Fastify / `@modelcontextprotocol/server` / Next.js + NextAuth / Postgres + Drizzle / Redis; no model on this path; status production, `MCP_ENABLED=1`; owner Harpreet; source `~/Projects/mira`.
2. **Architecture** (`architecture`) — diagram of the split: authorization server in `apps/web` (needs the browser session and consent UI, already a Google SSO app), resource server in `apps/api` (already holds the DB, the RBAC helpers and the JWT verifier), RFC 9728 blessing the split, `apps/web` storing nothing itself and going through `/internal/oauth/*`. Stateless transport, one per request, horizontally scalable behind the existing ALB.
3. **Core mechanism** (`mechanism`) — the discovery handshake, with **the one `CodeBlock`**: the `401` + `WWW-Authenticate: Bearer resource_metadata="…"` challenge and the protected-resource metadata JSON it points at. Then the two-audiences-one-keypair token model (`aud` = MCP resource URL vs API audience, rejected in both directions, 1h TTL, rotating hashed refresh tokens); then the four tools with their parameters and what each returns, including why `get_transcript` pages by `start_ms` rather than row offset and why `search_transcript` without a `call_id` is the highest-value call in the set.
4. **Key decisions and trade-offs** (`decisions`) — the nine from the brief, each with its rejected alternative: act as the user not a service account; two audiences one keypair; read-only v1; no resources or prompts; no client allowlist; don't rewrite the REST handlers (the spec's own reversal, with the ~1,600-line reason); self-gating queries that cannot accept a pre-computed allow flag; neutral failures; two independent kill switches.
5. **Evaluation** (`evaluation`) — states plainly that there are no eval metrics and why: this is a protocol surface, not a model, so correctness is tested rather than scored. Then what is actually tested — 10 suites, 8 OAuth + format + integration — and the specific cases the design names as mandatory, ending on the privacy case: a user with no access path gets nothing from any of the four tools, including a `search_transcript` snippet when the query matches that call's text exactly.
6. **Limits and risks** (`limits`) — access tokens verified by signature, so revocation is not instant (up to an hour); self-reported `client_name` vs the honest `client_id`; SSO users only; 30-day refresh lifetime chosen to match the external share default and explicitly provisional; the wrong-but-present config value failing differently from a missing one.
7. **Run it yourself** (`run`) — the connect URL, the three client recipes (`claude mcp add --transport http mira …`, Claude Desktop connector, Cursor), staging URL, the `MCP_*` variables by name only, the migration `0023_mcp_oauth.sql` and its three tables, and the kill switch needing both services.
8. **Open questions and next steps** (`next`) — write tools (scope gating + agent-attributed audit rows) and refresh-token lifetime.


## As built (14 Oct 2026)

Three things changed during the build, each because the first version was wrong rather than merely improvable:

1. **The lab renders only the calls a person can read.** The first version drew an unreadable call as a
   dashed placeholder row. That taught the opposite of the section it sits in: the point is that such a
   call is *absent* from the answer, not withheld behind a lock, and a placeholder says "something is
   here you may not have". The full set of four is now shown separately and labelled as a view no single
   person has. Rationale is recorded in the file's header comment so it is not "simplified" back.
2. **The architecture diagram was factually wrong and is fixed.** It drew `apps/web` writing straight to
   Postgres, contradicting both [SPEC §Architecture] and the figure's own caption. `apps/web` persists
   nothing: it writes OAuth state through `/internal/oauth/*` on the api, and only the api touches
   Postgres and Redis. The arrows now say that.
3. **`Code` in `src/components/wiki/code-block.tsx` now breaks long tokens**
   (`[overflow-wrap:anywhere]`). Long unbroken tokens — `apps/api/test/integration/mcp_tools.test.ts`,
   the `claude mcp add` line — pushed the tech page to 399px at a 375px viewport, breaking the brand's
   no-horizontal-scroll rule in sections `evaluation` and `run`. Fixed in the shared component so every
   entry inherits it; re-checked both existing tech pages for regressions, neither overflows.

Step 2's figure was also redrawn: the door was too small to read as a door, so it gained a frame and a
dashed barrier, and the plug is no longer dimmed.

Verification run: `npm run lint` and `npm run build` clean; all seven routes 200; `/`, `/wiki/mira-mcp`
and `/wiki/mira-mcp/tech` checked at 375px and 1200px in light and dark, with the lab driven through all
three viewers; no horizontal scroll on any page at 375px.
