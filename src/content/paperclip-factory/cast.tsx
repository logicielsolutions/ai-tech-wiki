/**
 * The entry's cast, drawn once and reused by the card, the hero and every figure (ILLUSTRATION.md).
 * The metaphor (brief.md): a workshop with a signed work order. The work order is the contract and the
 * one accent object; the fenced yard is the sandbox; the gatekeeper checks each tool; one bell rings in
 * the office; only a person opens the loading door (the merge). Agents have square heads, people round ones.
 */

import type { ReactNode } from "react";

const LINE = {
  stroke: "var(--color-muted)",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  vectorEffect: "non-scaling-stroke",
  fill: "none",
} as const;

/** Place a piece drawn at its own origin: translate, then scale. */
function At({ x, y, s = 1, children }: { x: number; y: number; s?: number; children: ReactNode }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>{children}</g>;
}

/** The contract: a sheet with an accent header and a signature. 80 × 104 at scale 1. */
export function WorkOrder({ x, y, s = 1, signed = true, torn = false }: { x: number; y: number; s?: number; signed?: boolean; torn?: boolean }) {
  return (
    <At x={x} y={y} s={s}>
      <rect width={80} height={104} rx={10} fill="var(--color-page)" />
      <rect width={80} height={20} rx={10} fill="var(--color-accent)" />
      <rect y={10} width={80} height={10} fill="var(--color-accent)" />
      {[34, 46, 58].map((ly, i) => (
        <path key={ly} d={`M12 ${ly}h${i === 2 ? 34 : 56}`} {...LINE} strokeWidth={1.5} />
      ))}
      {signed ? <path d="M12 86q5 -12 10 0t10 0t10 -3t12 2" {...LINE} stroke="var(--color-ink)" /> : null}
      <path d="M12 94h56" {...LINE} stroke="var(--color-rule)" strokeWidth={1.5} />
      {torn ? <path d="M-4 30l20 12l16 -10l18 14l16 -8l18 12" fill="none" stroke="var(--color-surface)" strokeWidth={7} strokeLinejoin="round" /> : null}
    </At>
  );
}

/** An agent: a square head with a visor, on a rounded body. Centred on (cx, cy), about 44 × 64 at scale 1. */
export function Worker({ cx, cy, s = 1 }: { cx: number; cy: number; s?: number }) {
  return (
    <At x={cx} y={cy} s={s}>
      <rect x={-14} y={-34} width={28} height={28} rx={8} fill="var(--color-ink)" />
      <rect x={-9} y={-24} width={18} height={6} rx={3} fill="var(--color-page)" />
      <rect x={-22} y={-2} width={44} height={32} rx={14} fill="var(--color-rule)" />
    </At>
  );
}

/** A person: a round head on a rounded body. Same footprint as a worker. */
export function Human({ cx, cy, s = 1 }: { cx: number; cy: number; s?: number }) {
  return (
    <At x={cx} y={cy} s={s}>
      <circle cy={-20} r={14} fill="var(--color-rule)" />
      <rect x={-22} y={2} width={44} height={28} rx={14} fill="var(--color-rule)" />
    </At>
  );
}

/** The fenced yard: a dashed outline. `off` draws it faint: built, but not switched on. */
export function Fence({ x, y, w, h, off = false }: { x: number; y: number; w: number; h: number; off?: boolean }) {
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={22}
      fill="none"
      stroke="var(--color-muted)"
      strokeWidth={3}
      strokeDasharray={off ? "3 11" : "14 8"}
      strokeLinecap="round"
      opacity={off ? 0.55 : 1}
    />
  );
}

/** The gatekeeper: a booth with an agent inside and a barrier arm, down (closed) or up. About 96 × 70. */
export function Gatekeeper({ x, y, s = 1, open = false }: { x: number; y: number; s?: number; open?: boolean }) {
  return (
    <At x={x} y={y} s={s}>
      <rect x={0} y={4} width={46} height={66} rx={8} fill="var(--color-fill)" />
      <rect x={-3} y={0} width={52} height={9} rx={4.5} fill="var(--color-muted)" />
      <rect x={8} y={18} width={30} height={26} rx={6} fill="var(--color-page)" />
      <rect x={16} y={24} width={14} height={14} rx={4} fill="var(--color-ink)" />
      <rect x={19} y={29} width={8} height={3} rx={1.5} fill="var(--color-page)" />
      <g transform={open ? "rotate(-70 48 50)" : undefined}>
        <rect x={46} y={46} width={52} height={8} rx={4} fill="var(--color-ink)" />
      </g>
    </At>
  );
}

/** One bell; `ringing` adds two arcs either side. About 40 × 40. */
export function Bell({ cx, cy, s = 1, ringing = false }: { cx: number; cy: number; s?: number; ringing?: boolean }) {
  return (
    <At x={cx} y={cy} s={s}>
      <path d="M-14 8c0-6 2-8 2-14a12 12 0 0 1 24 0c0 6 2 8 2 14z" fill="var(--color-ink)" />
      <circle cy={12} r={4} fill="var(--color-ink)" />
      {ringing ? (
        <g>
          <path d="M-20 -14a22 22 0 0 0 -2 16" {...LINE} />
          <path d="M20 -14a22 22 0 0 1 2 16" {...LINE} />
        </g>
      ) : null}
    </At>
  );
}

/** The office: a building with a window and a person at it. 120 × 100. */
export function Office({ x, y, s = 1, children }: { x: number; y: number; s?: number; children?: ReactNode }) {
  return (
    <At x={x} y={y} s={s}>
      <rect width={120} height={100} rx={14} fill="var(--color-fill)" />
      <rect x={16} y={26} width={58} height={56} rx={8} fill="var(--color-page)" />
      <Human cx={45} cy={62} s={0.62} />
      {children}
    </At>
  );
}

/** The safe that holds passwords and keys. `open` draws it standing open with keys spilling out. 48 × 48. */
export function Safe({ x, y, s = 1, open = false }: { x: number; y: number; s?: number; open?: boolean }) {
  return (
    <At x={x} y={y} s={s}>
      <rect width={48} height={48} rx={9} fill="var(--color-ink)" />
      {open ? (
        <g>
          <rect x={6} y={6} width={36} height={36} rx={6} fill="var(--color-page)" />
          <path d="M6 24h36" {...LINE} strokeWidth={1.5} />
          <path d="M48 4l18 -8v56l-18 -4z" fill="var(--color-ink)" />
          <circle cx={58} cy={22} r={4} fill="var(--color-page)" />
          {[0, 1].map((k) => (
            <g key={k} transform={`translate(${14 + k * 12} ${15 + k * 18})`}>
              <circle r={4} fill="none" stroke="var(--color-ink)" strokeWidth={2} vectorEffect="non-scaling-stroke" />
              <path d="M4 0h8m-3 0v3" {...LINE} stroke="var(--color-ink)" />
            </g>
          ))}
        </g>
      ) : (
        <g>
          <circle cx={24} cy={24} r={9} fill="var(--color-page)" />
          <path d="M24 17v7" {...LINE} stroke="var(--color-ink)" />
        </g>
      )}
    </At>
  );
}

/** The loading door: a roller door, closed (slats) or rolled up. 96 × 104. */
export function LoadingDoor({ x, y, s = 1, open = false }: { x: number; y: number; s?: number; open?: boolean }) {
  const slats = open ? [14] : [14, 30, 46, 62, 78, 94];
  return (
    <At x={x} y={y} s={s}>
      <rect width={96} height={104} rx={12} fill="var(--color-fill)" />
      {open ? <rect x={8} y={22} width={80} height={82} rx={6} fill="var(--color-page)" /> : null}
      {slats.map((ly) => (
        <path key={ly} d={`M12 ${ly}h72`} {...LINE} strokeWidth={1.5} />
      ))}
    </At>
  );
}

/** A crate of finished work, waiting to leave. 44 × 36. */
export function Crate({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <At x={x} y={y} s={s}>
      <rect width={44} height={36} rx={7} fill="var(--color-accent-tint)" />
      <path d="M0 12h44M22 0v36" {...LINE} strokeWidth={1.5} />
    </At>
  );
}

/** A job card: a small page with two lines. 28 × 34. */
export function Card({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <At x={x} y={y} s={s}>
      <rect width={28} height={34} rx={6} fill="var(--color-page)" />
      <path d="M7 11h14M7 19h9" {...LINE} strokeWidth={1.5} />
    </At>
  );
}

/** A work bench. 76 × 30. */
export function Bench({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <At x={x} y={y} s={s}>
      <rect width={76} height={12} rx={5} fill="var(--color-fill)" />
      <path d="M10 12v18M66 12v18" {...LINE} />
    </At>
  );
}

/** A speech bubble with two lines; the tail points down-left (or down-right with `right`). 64 × 46. */
export function Bubble({ x, y, s = 1, right = false }: { x: number; y: number; s?: number; right?: boolean }) {
  return (
    <At x={x} y={y} s={s}>
      <rect width={64} height={36} rx={12} fill="var(--color-page)" />
      <path d={right ? "M44 36l10 10l-2 -10z" : "M12 36l-2 10l10 -10z"} fill="var(--color-page)" />
      <path d="M12 13h40M12 23h26" {...LINE} strokeWidth={1.5} />
    </At>
  );
}

/** A phone showing a chat thread; the last message carries a green tick. 72 × 132. */
export function Phone({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <At x={x} y={y} s={s}>
      <rect width={72} height={132} rx={16} fill="var(--color-ink)" />
      <rect x={6} y={8} width={60} height={116} rx={11} fill="var(--color-page)" />
      <rect x={12} y={20} width={38} height={14} rx={7} fill="var(--color-fill)" />
      <rect x={22} y={42} width={38} height={14} rx={7} fill="var(--color-fill)" />
      <rect x={12} y={64} width={30} height={14} rx={7} fill="var(--color-fill)" />
      <Tick cx={46} cy={100} r={13} />
    </At>
  );
}

/** A green "yes" badge. */
export function Tick({ cx, cy, r = 12 }: { cx: number; cy: number; r?: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="var(--color-good)" />
      <path
        d={`M${cx - r * 0.42} ${cy}l${r * 0.3} ${r * 0.3}l${r * 0.55} -${r * 0.6}`}
        fill="none"
        stroke="var(--color-page)"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

/** A "no" badge: an ink disc with a cross. */
export function Cross({ cx, cy, r = 12 }: { cx: number; cy: number; r?: number }) {
  const d = r * 0.38;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="var(--color-ink)" />
      <path d={`M${cx - d} ${cy - d}l${2 * d} ${2 * d}M${cx + d} ${cy - d}l-${2 * d} ${2 * d}`} {...LINE} stroke="var(--color-page)" strokeWidth={2.5} />
    </g>
  );
}

/** A curved arrow from (x1, y1) to (x2, y2), bending by `bend`. */
export function CurveArrow({ x1, y1, x2, y2, bend = -30 }: { x1: number; y1: number; x2: number; y2: number; bend?: number }) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 + bend;
  const angle = Math.atan2(y2 - my, x2 - mx);
  const head = (a: number) => `${x2 - 8 * Math.cos(angle + a)} ${y2 - 8 * Math.sin(angle + a)}`;
  return (
    <g>
      <path d={`M${x1} ${y1}Q${mx} ${my} ${x2} ${y2}`} {...LINE} />
      <path d={`M${head(0.5)}L${x2} ${y2}L${head(-0.5)}`} {...LINE} />
    </g>
  );
}
