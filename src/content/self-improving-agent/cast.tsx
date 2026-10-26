/**
 * The entry's cast, drawn once and reused by the card, the hero and every step figure:
 * a smoke-alarm installer (the AI agent) and their handbook (its instructions: the one accent object,
 * because the handbook is what the loop tries to improve), buildings (code modules), smoke alarms (tests),
 * fake fires we light (planted bugs), a sealed envelope of new buildings (the held-out exam) and the
 * inspector who compares two handbooks (the promotion gate).
 */

import { Person } from "@/components/wiki/art-kit";

/** A small building: a pitched roof, a body and two windows. `crossed` greys it out: it scored zero. */
export function Building({ cx, cy, w = 120, crossed = false }: { cx: number; cy: number; w?: number; crossed?: boolean }) {
  const h = w * 0.72;
  const top = cy - h / 2;
  const roofH = w * 0.24;
  const win = w * 0.18;
  return (
    <g opacity={crossed ? 0.4 : 1}>
      <path
        d={`M${cx - w * 0.56} ${top + 2}L${cx} ${top - roofH}L${cx + w * 0.56} ${top + 2}Z`}
        fill="var(--color-muted)"
        stroke="var(--color-muted)"
        strokeWidth={w * 0.03}
        strokeLinejoin="round"
      />
      <rect x={cx - w / 2} y={top} width={w} height={h} rx={w * 0.08} fill="var(--color-fill)" />
      <rect x={cx - w * 0.32} y={top + h * 0.22} width={win} height={win} rx={win * 0.22} fill="var(--color-page)" />
      <rect x={cx + w * 0.14} y={top + h * 0.22} width={win} height={win} rx={win * 0.22} fill="var(--color-page)" />
      <rect x={cx - w * 0.1} y={top + h * 0.52} width={w * 0.2} height={h * 0.48} rx={w * 0.05} fill="var(--color-page)" />
    </g>
  );
}

export type AlarmState = "idle" | "ringing" | "faulty";

/** A ceiling smoke alarm. Ringing alarms caught a fake fire; a faulty one is wired wrong or goes off by itself. */
export function Alarm({ cx, cy, r = 14, state = "idle" }: { cx: number; cy: number; r?: number; state?: AlarmState }) {
  const wave = (k: number) =>
    `M${cx - r * k} ${cy - r * k * 0.55}a${r * k} ${r * k} 0 0 1 ${r * k * 2} 0`;
  return (
    <g>
      {state === "ringing" ? (
        <g fill="none" stroke="var(--color-good)" strokeWidth={Math.max(1.5, r * 0.14)} strokeLinecap="round">
          <path d={wave(1.45)} />
          <path d={wave(1.9)} opacity={0.6} />
        </g>
      ) : null}
      <circle cx={cx} cy={cy} r={r} fill={state === "ringing" ? "var(--color-good)" : state === "faulty" ? "var(--color-fill)" : "var(--color-page)"} />
      {state === "faulty" ? null : <circle cx={cx} cy={cy} r={r * 0.42} fill={state === "ringing" ? "var(--color-page)" : "var(--color-muted)"} />}
      {state === "faulty" ? (
        <path
          d={`M${cx - r * 0.45} ${cy - r * 0.45}l${r * 0.9} ${r * 0.9}m0 ${-r * 0.9}l${-r * 0.9} ${r * 0.9}`}
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth={Math.max(2, r * 0.24)}
          strokeLinecap="round"
        />
      ) : null}
    </g>
  );
}

/** A fake fire we light on purpose to see whether an alarm catches it (a planted bug). */
export function Fire({ cx, cy, s = 22 }: { cx: number; cy: number; s?: number }) {
  return (
    <g>
      <path
        d={`M${cx} ${cy - s}C${cx + s * 0.75} ${cy - s * 0.35} ${cx + s * 0.62} ${cy + s * 0.5} ${cx} ${cy + s * 0.5}C${cx - s * 0.62} ${cy + s * 0.5} ${cx - s * 0.75} ${cy - s * 0.2} ${cx - s * 0.2} ${cy - s * 0.48}C${cx - s * 0.12} ${cy - s * 0.2} ${cx + s * 0.05} ${cy - s * 0.5} ${cx} ${cy - s}Z`}
        fill="var(--color-muted)"
      />
      <path
        d={`M${cx} ${cy - s * 0.28}C${cx + s * 0.32} ${cy} ${cx + s * 0.26} ${cy + s * 0.36} ${cx} ${cy + s * 0.36}C${cx - s * 0.26} ${cy + s * 0.36} ${cx - s * 0.3} ${cy + s * 0.04} ${cx} ${cy - s * 0.28}Z`}
        fill="var(--color-fill)"
      />
    </g>
  );
}

/** The installer's handbook: the agent's instructions, the thing the loop tries to improve. `edited` shows a rewrite. */
export function Handbook({ x, y, w = 90, edited = false, faded = false }: { x: number; y: number; w?: number; edited?: boolean; faded?: boolean }) {
  const h = w * 1.25;
  const spine = w * 0.14;
  const line = (i: number, len: number) => (
    <path
      key={i}
      d={`M${x + spine + w * 0.14} ${y + h * (0.3 + i * 0.13)}h${(w - spine - w * 0.28) * len}`}
      stroke="var(--color-accent)"
      strokeWidth={Math.max(1.5, w * 0.035)}
      strokeLinecap="round"
      opacity={0.55}
    />
  );
  return (
    <g opacity={faded ? 0.45 : 1}>
      <rect x={x} y={y} width={w} height={h} rx={w * 0.12} fill="var(--color-accent)" />
      <rect x={x + spine} y={y + w * 0.08} width={w - spine - w * 0.08} height={h - w * 0.16} rx={w * 0.08} fill="var(--color-page)" />
      {[1, 0.8, 0.9, 0.6].map((len, i) => line(i, len))}
      {edited ? (
        <g>
          <path
            d={`M${x + spine + w * 0.1} ${y + h * 0.43}h${(w - spine - w * 0.24) * 0.85}`}
            stroke="var(--color-ink)"
            strokeWidth={Math.max(1.5, w * 0.03)}
            strokeLinecap="round"
          />
          <path
            d={`M${x + w * 0.62} ${y + h * 0.86}l${w * 0.3} ${-w * 0.3}l${w * 0.1} ${w * 0.1}l${-w * 0.3} ${w * 0.3}h${-w * 0.1}z`}
            fill="var(--color-ink)"
          />
        </g>
      ) : null}
    </g>
  );
}

/** A sealed envelope: the new buildings nobody has seen, opened only for the final test. */
export function Envelope({ cx, cy, w = 120 }: { cx: number; cy: number; w?: number }) {
  const h = w * 0.66;
  const x = cx - w / 2;
  const y = cy - h / 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={w * 0.08} fill="var(--color-fill)" />
      <path
        d={`M${x + w * 0.06} ${y + h * 0.1}L${cx} ${y + h * 0.58}L${x + w * 0.94} ${y + h * 0.1}`}
        fill="none"
        stroke="var(--color-muted)"
        strokeWidth={Math.max(1.5, w * 0.025)}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={cx} cy={y + h * 0.58} r={w * 0.08} fill="var(--color-ink)" />
    </g>
  );
}

/** The installer: a person carrying the handbook. */
export function Installer({ cx, cy, edited = false }: { cx: number; cy: number; edited?: boolean }) {
  return (
    <g>
      <Person cx={cx} cy={cy} />
      <Handbook x={cx + 18} y={cy - 6} w={34} edited={edited} />
    </g>
  );
}

/** The inspector: a person with a clipboard. `stamp` adds the sign-off tick. */
export function Inspector({ cx, cy, stamp = false }: { cx: number; cy: number; stamp?: boolean }) {
  return (
    <g>
      <Person cx={cx} cy={cy} good={stamp} />
      <rect x={cx - 48} y={cy - 6} width={30} height={38} rx={5} fill="var(--color-page)" />
      <rect x={cx - 40} y={cy - 10} width={14} height={7} rx={3} fill="var(--color-muted)" />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${cx - 42} ${cy + 6 + i * 8}h18`} stroke="var(--color-muted)" strokeWidth={1.5} strokeLinecap="round" />
      ))}
    </g>
  );
}

/** A small tick (yes) or cross (no) badge. */
export function Mark({ cx, cy, good, r = 10 }: { cx: number; cy: number; good: boolean; r?: number }) {
  const s = r * 0.45;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={good ? "var(--color-good)" : "var(--color-fill)"} />
      <path
        d={good ? `M${cx - s} ${cy}l${s * 0.7} ${s * 0.7}l${s * 1.3} ${-s * 1.3}` : `M${cx - s * 0.75} ${cy - s * 0.75}l${s * 1.5} ${s * 1.5}m0 ${-s * 1.5}l${-s * 1.5} ${s * 1.5}`}
        fill="none"
        stroke={good ? "var(--color-page)" : "var(--color-ink)"}
        strokeWidth={Math.max(1.5, r * 0.22)}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

/** A horizontal score bar on a track. `strong` = the hand-written handbook; the rest are faded. */
export function Bar({ x, y, w, value, strong = false, h = 14 }: { x: number; y: number; w: number; value: number; strong?: boolean; h?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={h / 2} fill="var(--color-fill)" />
      <rect x={x} y={y} width={Math.max(h, w * value)} height={h} rx={h / 2} fill="var(--color-accent)" opacity={strong ? 1 : 0.45} />
    </g>
  );
}

export { Arrow, Label, Person } from "@/components/wiki/art-kit";
