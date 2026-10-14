import Link from "next/link";
import { BulletList, Callout, Code, CodeBlock, DataTable, Figure, PageIndex, Prose, Section, SubHeading } from "@/components/wiki";
import { ArchitectureFigure } from "./figures";

const CHALLENGE = `# 1. The client knocks with nothing.
POST /mcp  ->  401 Unauthorized
WWW-Authenticate: Bearer resource_metadata=
  "https://api.mira.logiciel.io/.well-known/oauth-protected-resource"

# 2. It follows that pointer, and learns where to get a token.
GET /.well-known/oauth-protected-resource  ->  200
{
  "resource": "https://api.mira.logiciel.io/mcp",
  "authorization_servers": ["https://mira.logiciel.io"],
  "scopes_supported": ["mira:read"]
}`;

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
              { id: "handshake", title: "The handshake that needs no pre-registration" },
              { id: "audiences", title: "Two audiences, one keypair" },
              { id: "tools", title: "The four tools" },
            ],
          },
          { id: "decisions", title: "Key decisions and trade-offs" },
          {
            id: "evaluation",
            title: "Evaluation",
            children: [{ id: "cases", title: "The cases the design names as mandatory" }],
          },
          { id: "limits", title: "Limits and risks" },
          { id: "run", title: "Run it yourself" },
          { id: "next", title: "Open questions and next steps" },
          { id: "sources", title: "Sources" },
        ]}
      />

      <Section id="glance" title="At a glance">
        <DataTable
          stack
          columns={["", ""]}
          rows={[
            ["Endpoint", <Code key="e">POST /mcp</Code>],
            ["Transport", "Streamable HTTP, stateless — one transport per request, no server-side MCP session"],
            ["Tools", "Four, all read-only: list_calls, get_call, get_transcript, search_transcript"],
            ["Scope", <Code key="s">mira:read</Code>],
            ["Auth", "OAuth 2.1, mandatory PKCE (S256), Client ID Metadata Documents with a DCR fallback"],
            ["Stack", "Fastify + @modelcontextprotocol/server (api); Next.js + NextAuth Google SSO (web); Postgres via Drizzle; Redis"],
            ["Models", "None on this path — the model lives in the caller's client; this is a data surface"],
            ["Status", "Production. MCP_ENABLED=1 on both services"],
            ["Owner", "Harpreet"],
            ["Source", "~/Projects/mira — apps/api/src/mcp, apps/web /oauth, apps/api/src/lib/callQueries.ts"],
          ]}
        />
        <Prose>
          <p>
            Everything Mira knows about a call was reachable only through the web app. This exposes it once, over a
            protocol AI clients already speak, under the access rules that already existed — without a service account
            and without a second copy of the authorization logic.
          </p>
        </Prose>
      </Section>

      <Section id="architecture" title="Architecture">
        <Prose>
          <p>
            The work splits along a seam that was already there, and each half landed where the capability already
            lived. The OAuth authorization server went into <Code>apps/web</Code>, which is already a Google SSO app and
            where <Code>/authorize</Code> needs a browser session and a consent UI. The MCP resource server went into{" "}
            <Code>apps/api</Code>, which already had the database, the RBAC helpers and the JWT verifier.
          </p>
          <p>
            RFC 9728 explicitly supports a resource server pointing at a separate authorization server, so this split is
            the idiomatic shape rather than a workaround. <Code>apps/web</Code> stores nothing itself: all OAuth state
            goes back through <Code>/internal/oauth/*</Code> on the api.
          </p>
        </Prose>
        <Figure
          scroll
          caption="Two halves, one trust root. The api owns the data and the token audience; the web owns the browser session and the consent screen, and persists nothing of its own."
        >
          <ArchitectureFigure />
        </Figure>
        <Prose>
          <p>
            The transport is deliberately <strong>stateless</strong> — one transport per request, no server-side MCP
            session — because every request carries its own bearer token and every tool call resolves the viewer from
            it. That keeps <Code>POST /mcp</Code> horizontally scalable behind the existing ALB and in line with the
            stateless-container invariant the rest of the api already holds to.
          </p>
        </Prose>
      </Section>

      <Section id="mechanism" title="Core mechanism">
        <SubHeading id="handshake">The handshake that needs no pre-registration</SubHeading>
        <Prose>
          <p>
            Nothing is registered on Mira&apos;s side before a client connects. The whole bootstrap is the refusal, and
            the pointer inside it:
          </p>
        </Prose>
        <CodeBlock title="The 401 that starts everything (apps/api/src/routes/mcp.ts)" code={CHALLENGE} />
        <Prose>
          <p>
            From there the client fetches{" "}
            <Code>/.well-known/oauth-authorization-server</Code> from <Code>apps/web</Code>, which advertises the
            authorize / token / revoke / register endpoints,{" "}
            <Code>code_challenge_methods_supported: [&quot;S256&quot;]</Code> and{" "}
            <Code>client_id_metadata_document_supported: true</Code>; opens <Code>/oauth/authorize</Code> in a browser
            with PKCE and the <Code>resource</Code> parameter; and exchanges a 60-second, single-use authorization code
            (held in Redis, bound to user, client, redirect URI, challenge and resource) for a token.
          </p>
          <p>
            Client identity comes from <strong>Client ID Metadata Documents</strong> — a URL-shaped{" "}
            <Code>client_id</Code> is fetched and validated (it must equal its own URL, and must list the requested
            redirect URI), then cached per its HTTP cache headers. The 2026-07-28 spec revision made CIMD primary and
            deprecated Dynamic Client Registration; <Code>/oauth/register</Code> is implemented anyway, because clients
            predating CIMD still rely on it.
          </p>

        </Prose>

        <SubHeading id="audiences">Two audiences, one keypair</SubHeading>
        <Prose>
          <p>
            MCP access tokens are not a new kind of credential. They are the same RS256 JWTs{" "}
            <Code>apps/web</Code> already mints, with <Code>aud</Code> set to the MCP resource URL instead of the API
            audience, plus a <Code>scope</Code> claim. <Code>POST /mcp</Code> accepts only the MCP audience; every REST
            route accepts only the API audience.
          </p>
          <p>
            So an MCP token cannot be replayed against the REST API, and a leaked web session token cannot drive MCP —
            the spec&apos;s token-audience binding, satisfied with no new trust root and no second keypair to rotate.
            Access tokens last an hour; refresh tokens are opaque, rotating, and stored hashed, with rotation writing a
            new row and stamping the old one, so a replayed refresh token is <em>detectable</em> rather than merely
            rejected.
          </p>

        </Prose>

        <SubHeading id="tools">The four tools</SubHeading>
        <DataTable
          stack
          columns={["Tool", "Parameters", "Returns"]}
          rows={[
            [
              <Code key="t">list_calls</Code>,
              "query (full text over transcript bodies), from / to (ISO dates), project, host_email, participant_email, limit (default 20, max 50), cursor",
              "Compact rows only: id, title, date, duration, host, participant names, project, and whether a summary and transcript exist",
            ],
            [
              <Code key="t">get_call</Code>,
              "call_id",
              "Metadata, participants with join/leave windows, project, tags, and the stored summary JSON verbatim — agenda, key notes, decisions, action items",
            ],
            [
              <Code key="t">get_transcript</Code>,
              "call_id, start_ms (default 0), end_ms (optional)",
              "Speaker-labelled text within a ~25k-character budget, plus the start_ms to pass for the next page",
            ],
            [
              <Code key="t">search_transcript</Code>,
              "query, call_id (optional), limit",
              "Snippets carrying call title, date, timestamp and speaker — across every readable call when call_id is omitted",
            ],
          ]}
        />
        <Prose>
          <p>
            Two shapes here were chosen rather than inherited. <Code>list_calls</Code> returns compact rows and not full
            call objects because it is the &ldquo;which call?&rdquo; step and has to stay cheap enough for a model to run
            speculatively. And <Code>get_transcript</Code> pages <strong>by time, not by row offset</strong>: a time
            cursor is legible to a model in a way <Code>offset=500</Code> is not, it matches how people refer to moments
            in a call, and it degrades a long call into more pages instead of one context-destroying response.
          </p>
          <p>
            <Code>search_transcript</Code> without a <Code>call_id</Code> is the highest-value call in the set — it is
            the same Postgres <Code>tsv</Code> index that backs <Code>GET /calls?q=</Code>, ANDed with the visibility
            predicate, and it answers &ldquo;what did we decide about X?&rdquo; in a few hundred tokens instead of three
            full transcript fetches.
          </p>
        </Prose>
      </Section>

      <Section id="decisions" title="Key decisions and trade-offs">
        <DataTable
          stack
          columns={["Decision", "Why", "Rejected"]}
          rows={[
            [
              "Act as the authenticated user",
              "Call access is per-user and grant-based in rbac.ts: host, org admin, joined participant, calendar/manual invitee, or an unrevoked access_grants row. Project membership deliberately grants nothing.",
              "A service account, and any re-implementation of the predicate — either one leaks calls",
            ],
            [
              "Two audiences, one keypair",
              "Audience binding with no new trust root and nothing extra to rotate",
              "A separate keypair for MCP",
            ],
            [
              "Read-only in v1",
              "Writes need scope gating, confirmation semantics and agent-attributed audit rows, none of which are free",
              "Shipping a launch or tag tool alongside the reads",
            ],
            [
              "Tools only — no resources or prompts",
              "Access here is search-driven, not browse-driven; a flat picker of hundreds of calls is worse than a query, and client support for resources is uneven while tools work everywhere",
              "MCP resources in v1 (they can reuse the same query functions later)",
            ],
            [
              "No client allowlist",
              "The consent screen names the client and shows its client_id, and the resulting token reaches only what that user could already open",
              "An allowlist — operational friction without a narrower blast radius",
            ],
            [
              "Leave the REST handlers alone",
              "The design originally called for rewriting them on the new query layer; that was reversed during planning. Both surfaces already call the same rbac.ts helpers, so the one-implementation benefit was banked — rewriting ~1,600 lines of working handlers adds regression risk without adding safety.",
              "The rewrite the spec itself first asked for",
            ],
            [
              "Self-gating query functions",
              "Each takes (db, viewerUserId, params) and runs its own access check inside, so a caller cannot invoke one and forget the gate. Nothing in callQueries.ts may accept a pre-computed allowed flag.",
              "A check-then-query split, where the check is the caller's job",
            ],
            [
              "Neutral failures",
              "No access and nonexistent return the identical sentence; distinguishing them would let tool output probe which calls exist. A call with no transcript reports why — still processing, failed, bot never joined — so a model doesn't conclude the meeting was silent.",
              "403 vs 404, and empty text for a missing transcript",
            ],
            [
              "Two kill switches",
              "The api and web deploy independently, so each must be able to fail closed on its own",
              "A single MCP_ENABLED flag",
            ],
          ]}
        />
      </Section>

      <Section id="evaluation" title="Evaluation">
        <Prose>
          <p>
            <strong>There are no eval numbers on this page, and that is the honest answer.</strong> This is a protocol
            surface, not a model: there is no output quality to score, no sampling variance, and nothing a recall figure
            would describe. Correctness here is a property you test, so it was tested rather than measured.
          </p>
          <p>
            Ten suites — eight covering the authorization server in <Code>apps/web/test/unit/</Code> (metadata, token,
            kill switch, revoke, register, client metadata, authorize actions), plus{" "}
            <Code>apps/api/test/unit/mcp_format.test.ts</Code> and{" "}
            <Code>apps/api/test/integration/mcp_tools.test.ts</Code>. The authorization server carries most of them
            because that is where the bugs would be.
          </p>
        </Prose>
        <SubHeading id="cases">The cases the design names as mandatory</SubHeading>
        <Prose>
          <BulletList>
            <li>PKCE verifier mismatch rejected; authorization code replay rejected (single use enforced).</li>
            <li>
              The code bound to its <Code>redirect_uri</Code>, <Code>client_id</Code> and <Code>resource</Code> — any
              mismatch rejected.
            </li>
            <li>Refresh rotation invalidates the previous token, and replaying a rotated token is detected.</li>
            <li>A revoked grant rejects both refresh and any further access-token minting.</li>
            <li>
              A CIMD whose <Code>client_id</Code> does not equal its own URL rejected; one whose{" "}
              <Code>redirect_uris</Code> omit the requested URI rejected.
            </li>
            <li>Audience crossing rejected in both directions: MCP token on a REST route, API token on /mcp.</li>
          </BulletList>
          <p>
            And the privacy case that actually matters: a user with no access path to a call gets nothing from{" "}
            <em>any</em> of the four tools, including the fact that it exists. <Code>list_calls</Code> omits it,{" "}
            <Code>get_call</Code> and <Code>get_transcript</Code> return the not-found-or-no-access text, and{" "}
            <Code>search_transcript</Code> with no <Code>call_id</Code> never surfaces a snippet from it — not even when
            the query matches its text exactly.
          </p>
        </Prose>
        <Callout kind="limit" title="What the tests don't tell you">
          <p>
            They cover the protocol and the gate, not how useful the tools are in practice. Whether a model picks{" "}
            <Code>search_transcript</Code> over three <Code>get_transcript</Code> calls depends on the tool descriptions,
            and nothing here measures that — the descriptions were written to steer it, and then dogfooded, not scored.
          </p>
        </Callout>
      </Section>

      <Section id="limits" title="Limits and risks">
        <Prose>
          <BulletList>
            <li>
              <strong>Revocation is not instant.</strong> Access tokens are verified by signature, not looked up per
              request, so a client holding a valid one keeps working for up to an hour after Disconnect. Disconnect
              stops issuance; a genuinely compromised client is an incident and takes the kill switch.
            </li>
            <li>
              <strong><Code>client_name</Code> is self-reported.</strong> CIMD lets any HTTPS-hosting party appear at the
              consent screen under any name. The <Code>client_id</Code> URL is the only honest identifier, which is why
              the screen shows it verbatim and the user-facing guide tells people to read it.
            </li>
            <li>
              <strong>A wrong config value fails differently from a missing one.</strong> The surface fails closed when
              an <Code>MCP_*</Code> variable is absent, but a present-and-wrong <Code>MCP_RESOURCE_URL</Code> mints
              tokens for an audience <Code>/mcp</Code> then rejects — which presents as a client bug. The runbook was
              amended during review to call this out.
            </li>
            <li>
              <strong>SSO users only.</strong> External share-token recipients are deliberately excluded; they keep
              using <Code>external_share_tokens</Code>.
            </li>
            <li>
              <strong>The 30-day refresh lifetime is provisional.</strong> It was chosen to match the external share
              token default in <Code>org_settings</Code>, not from evidence, and is explicitly flagged for revisiting
              once re-authorization frequency is known.
            </li>
            <li>
              <strong>Cost is not measured.</strong> No model call happens on this path, so the marginal cost is the
              existing API and database serving rows. Nothing quantifies it, so no number is published here.
            </li>
          </BulletList>
        </Prose>
      </Section>

      <Section id="run" title="Run it yourself">
        <Prose>
          <p>
            Nothing needs installing, and nothing needs registering on Mira&apos;s side. Production endpoint:{" "}
            <Code>https://api.mira.logiciel.io/mcp</Code>; staging{" "}
            <Code>https://api-staging.mira.logiciel.io/mcp</Code>.
          </p>
          <BulletList>
            <li>
              Claude Code: <Code>claude mcp add --transport http mira https://api.mira.logiciel.io/mcp</Code>, then ask
              it something that needs Mira — the first tool call opens the browser.
            </li>
            <li>Claude Desktop: Settings → Connectors → Add custom connector, paste the URL, Connect.</li>
            <li>Cursor: Settings → MCP → Add new MCP server, transport http, same URL.</li>
            <li>Anything else that speaks streamable HTTP with OAuth: give it the URL.</li>
          </BulletList>
          <p>
            Operating it: the surface sits behind <Code>MCP_ENABLED</Code>, set independently on the api (gating{" "}
            <Code>/mcp</Code> and its <Code>.well-known</Code> routes) and the web (gating the OAuth routes and{" "}
            <Code>/oauth/authorize</Code>) — flipping one no longer disables the surface. Other variables, by name:{" "}
            <Code>MCP_RESOURCE_URL</Code>, <Code>MCP_AUTHORIZATION_SERVER</Code>, <Code>JWT_PUBLIC_KEY</Code>,{" "}
            <Code>ACCESS_TOKEN_TTL_SECONDS</Code>. Schema comes from{" "}
            <Code>packages/db/drizzle/0023_mcp_oauth.sql</Code>: <Code>oauth_clients</Code>, <Code>oauth_grants</Code>,{" "}
            <Code>oauth_refresh_tokens</Code>. Authorization codes live in Redis, not Postgres — 60s TTL, single use, no
            value in durability.
          </p>
        </Prose>
      </Section>

      <Section id="next" title="Open questions and next steps">
        <Prose>
          <BulletList>
            <li>
              <strong>Write tools.</strong> Launching Mira on a Meet link is the most-requested plausible next step. It
              needs scope gating, confirmation semantics and agent-attributed audit rows before any of it ships.
            </li>
            <li>
              <strong>Refresh token lifetime.</strong> Thirty days was a borrowed default. Adjust once real
              re-authorization frequency is visible in the grants table.
            </li>
            <li>
              <strong>MCP resources.</strong> Left out on purpose, and cheap to add later — they would reuse the same
              four query functions.
            </li>
          </BulletList>
        </Prose>
      </Section>

      <Section id="sources" title="Sources">
        <Prose>
          <BulletList>
            <li>
              <Code>docs/superpowers/specs/2026-08-14-mcp-server-design.md</Code> — the design, including the shared
              query layer revision made during planning
            </li>
            <li>
              <Code>docs/superpowers/plans/2026-08-14-mcp-server.md</Code> — the implementation plan
            </li>
            <li>
              <Code>docs/connect-mcp.md</Code> (for everyone) and <Code>docs/runbooks/mcp-server.md</Code> (operators:
              kill switch, revokes, incident diagnosis)
            </li>
            <li>
              <Code>apps/api/src/mcp/server.ts</Code>, <Code>apps/api/src/mcp/format.ts</Code>,{" "}
              <Code>apps/api/src/lib/callQueries.ts</Code>, <Code>apps/api/src/lib/rbac.ts</Code>
            </li>
            <li>
              <a href="https://modelcontextprotocol.io">modelcontextprotocol.io</a> — the protocol, and the 2026-07-28
              revision that made Client ID Metadata Documents primary
            </li>
            <li>RFC 9728 (protected resource metadata), RFC 7591 (DCR), RFC 7009 (revocation)</li>
          </BulletList>
          <p>
            <Link href="/wiki/mira-mcp">Back to the explainer</Link>.
          </p>
        </Prose>
      </Section>
    </>
  );
}
