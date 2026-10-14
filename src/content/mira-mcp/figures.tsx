import { Arrow, DoorWithNote, Label, Pass, Plug, Snippet, Socket, ToolChip, Window } from "./cast";

/** Hero: one socket wired once; three assistants, one shape of plug, no adapters. */
export function HeroFigure() {
  return (
    <svg
      viewBox="0 0 800 400"
      className="w-full"
      role="img"
      aria-label="Three different AI assistants, each with the same shape of plug, all fitting one socket that Mira wired once."
    >
      <Plug x={70} y={66} />
      <Plug x={70} y={171} />
      <Plug x={70} y={276} />
      <Label x={70} y={52} anchor="start" muted>
        Claude Code
      </Label>
      <Label x={70} y={157} anchor="start" muted>
        Claude Desktop
      </Label>
      <Label x={70} y={262} anchor="start" muted>
        Cursor
      </Label>
      <Arrow x1={210} x2={300} y={95} />
      <Arrow x1={210} x2={300} y={200} />
      <Arrow x1={210} x2={300} y={305} />
      <Socket x={330} y={140} w={130} h={130} />
      <Label x={395} y={300} muted>
        One socket
      </Label>
      <Arrow x1={490} x2={560} y={200} />
      <Window x={580} y={132} w={170} h={136} lines={4} />
      <Label x={665} y={300} muted>
        Your calls
      </Label>
    </svg>
  );
}

/** Why: the notes were shut in one window, so working with them meant copying one call at a time. */
export function WhyFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className="w-full"
      role="img"
      aria-label="A person copying one call at a time out of the Mira web app and into their AI assistant."
    >
      <rect x={0} y={0} width={640} height={320} rx={20} fill="transparent" />
      <Window x={40} y={60} w={210} h={200} lines={5} />
      <Label x={145} y={40} muted>
        Mira, in a browser
      </Label>
      <Arrow x1={272} x2={368} y={160} />
      <Label x={320} y={140} muted>
        one at a time
      </Label>
      <Window x={390} y={60} w={210} h={200} lines={2} />
      <Label x={495} y={40} muted>
        Your assistant
      </Label>
    </svg>
  );
}

/** Step 1: one address, pasted into the assistant you already use. */
export function AddressFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className="w-full"
      role="img"
      aria-label="A single web address being pasted into an AI assistant's settings. No key and no password."
    >
      <Window x={120} y={80} w={400} h={160} lines={2} accentBar />
      <rect x={154} y={91} width={332} height={14} rx={7} fill="var(--color-accent)" opacity={0.25} />
      <rect x={168} y={95} width={210} height={6} rx={3} fill="var(--color-accent)" />
      <Label x={320} y={272} muted>
        One address
      </Label>
    </svg>
  );
}

/** Step 2: refused without a pass, and the refusal itself says where to ask. */
export function TurnedAwayFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className="w-full"
      role="img"
      aria-label="A plug stopped at a closed door. A note on the door says where to go and ask for a pass."
    >
      <Plug x={76} y={126} w={120} h={72} />
      <path
        d="M248 160h34"
        fill="none"
        stroke="var(--color-muted)"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <path
        d="M318 118v84"
        fill="none"
        stroke="var(--color-muted)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeDasharray="7 7"
      />
      <DoorWithNote x={370} y={56} />
      <Label x={445} y={298} muted>
        Where to ask
      </Label>
    </svg>
  );
}

/** Step 3: you sign in, and the screen names who is asking — with the address spelled out. */
export function ConsentFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className="w-full"
      role="img"
      aria-label="Mira's approval screen, naming the assistant that is asking and showing its full address underneath."
    >
      <rect x={140} y={62} width={360} height={196} rx={18} fill="var(--color-page)" />
      <rect x={172} y={92} width={150} height={9} rx={4.5} fill="var(--color-ink)" opacity={0.75} />
      <rect x={172} y={120} width={296} height={30} rx={8} fill="var(--color-accent-tint)" />
      <rect x={186} y={131} width={210} height={8} rx={4} fill="var(--color-accent)" />
      <Label x={320} y={178} muted>
        Read this part
      </Label>
      <rect x={172} y={198} width={120} height={34} rx={17} fill="var(--color-accent)" />
      <rect x={200} y={212} width={64} height={7} rx={3.5} fill="var(--color-page)" />
      <rect x={312} y={198} width={120} height={34} rx={17} fill="var(--color-fill)" />
    </svg>
  );
}

/** Step 4: a pass that expires, and fits only this socket. */
export function PassFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className="w-full"
      role="img"
      aria-label="A pass marked with a clock, good for one hour, next to the single socket it fits."
    >
      <Pass x={70} y={112} w={200} h={110} />
      <Label x={170} y={252} muted>
        Good for an hour
      </Label>
      <Arrow x1={296} x2={376} y={167} />
      <Socket x={400} y={107} w={120} h={120} />
      <Label x={460} y={252} muted>
        This socket only
      </Label>
    </svg>
  );
}

/** Step 5: four things it can ask for, all of them reading. */
export function FourToolsFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className="w-full"
      role="img"
      aria-label="Four read-only tools: find calls, read one call, read its transcript, and search what was said."
    >
      <ToolChip x={60} y={70} w={240} />
      <ToolChip x={340} y={70} w={240} />
      <ToolChip x={60} y={150} w={240} />
      <ToolChip x={340} y={150} w={240} />
      <Label x={320} y={266} muted>
        Reading only
      </Label>
    </svg>
  );
}

/** See it in action: one question, searched across months of calls, answered in three dated quotes. */
export function ActionFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className="w-full"
      role="img"
      aria-label="One question goes in; Mira searches every call you can see and returns three short quotes, each with its speaker and the moment it was said."
    >
      <rect x={36} y={122} width={150} height={62} rx={16} fill="var(--color-accent-tint)" />
      <rect x={58} y={142} width={106} height={8} rx={4} fill="var(--color-accent)" />
      <rect x={58} y={158} width={66} height={8} rx={4} fill="var(--color-accent)" opacity={0.5} />
      <Arrow x1={200} x2={248} y={153} />
      <Socket x={262} y={113} w={82} h={82} />
      <Arrow x1={360} x2={408} y={153} />
      <Snippet x={420} y={58} w={190} />
      <Snippet x={420} y={131} w={190} />
      <Snippet x={420} y={204} w={190} />
      <Label x={515} y={286} muted>
        Three quotes, dated
      </Label>
    </svg>
  );
}

/** Limits: disconnecting stops the next pass, not the one already in a hand. */
export function ExpiringPassFigure() {
  return (
    <svg
      viewBox="0 0 640 320"
      className="w-full"
      role="img"
      aria-label="A pass already issued keeps working until its hour is up. Disconnecting stops the next one from being handed out."
    >
      <Pass x={60} y={112} w={200} h={110} />
      <Label x={160} y={252} muted>
        Still works
      </Label>
      <Arrow x1={286} x2={346} y={167} />
      <Pass x={370} y={112} w={200} h={110} spent />
      <path
        d="M400 142l140 50m0 -50l-140 50"
        fill="none"
        stroke="var(--color-muted)"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Label x={470} y={252} muted>
        No new ones
      </Label>
    </svg>
  );
}

/** Tech: the two halves and where a request goes. Monospace labels, boxes and arrows. */
export function ArchitectureFigure() {
  const box = (x: number, y: number, w: number, h: number, accent = false) => (
    <rect x={x} y={y} width={w} height={h} rx={14} fill={accent ? "var(--color-accent-tint)" : "var(--color-page)"} />
  );
  const mono = (x: number, y: number, text: string, muted = false) => (
    <text
      x={x}
      y={y}
      fontSize={13}
      fontFamily="ui-monospace, 'SF Mono', Menlo, monospace"
      fill={muted ? "var(--color-muted)" : "var(--color-ink)"}
    >
      {text}
    </text>
  );
  const flow = (d: string) => (
    <path d={d} fill="none" stroke="var(--color-muted)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  );

  return (
    <svg
      viewBox="0 0 800 330"
      className="w-full min-w-[640px]"
      role="img"
      aria-label="The AI client talks to apps/api for MCP, and opens apps/web in a browser to sign in. apps/web persists nothing itself: it writes OAuth state back through /internal/oauth/* on the api, and only the api touches Postgres and Redis."
    >
      {box(24, 32, 152, 72)}
      {mono(44, 64, "AI client")}
      {mono(44, 84, "MCP over HTTP", true)}

      {box(300, 24, 220, 88, true)}
      {mono(320, 54, "apps/api")}
      {mono(320, 74, "POST /mcp", true)}
      {mono(320, 94, "4 read-only tools", true)}

      {box(300, 212, 220, 88)}
      {mono(320, 242, "apps/web")}
      {mono(320, 262, "/oauth/authorize", true)}
      {mono(320, 282, "consent, Google SSO", true)}

      {box(610, 24, 166, 62)}
      {mono(630, 52, "Postgres")}
      {mono(630, 70, "grants, tokens", true)}

      {box(610, 108, 166, 62)}
      {mono(630, 136, "Redis")}
      {mono(630, 154, "auth codes, 60s", true)}

      {/* client -> api */}
      {flow("M184 68h104m-7 -6l7 6l-7 6")}

      {/* client -> web, in a browser */}
      {flow("M100 112v144h188m-7 -6l7 6l-7 6")}
      {mono(118, 248, "browser sign-in", true)}

      {/* web -> api: the web stores nothing of its own */}
      {flow("M410 208V124m-6 7l6 -7l6 7")}
      {mono(424, 172, "/internal/oauth/*", true)}

      {/* api -> Postgres, api -> Redis: only the api touches storage */}
      {flow("M528 55h74m-7 -6l7 6l-7 6")}
      {flow("M528 90h40v49h34m-7 -6l7 6l-7 6")}
    </svg>
  );
}
