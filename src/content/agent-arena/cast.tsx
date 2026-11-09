/**
 * The entry's cast, drawn once and reused by the card, the hero and every step figure:
 * a car repair shop. The broken car is the bug; the repair bay is the locked sandbox; the toolbox is the four
 * tools; the clock and the coin are the budget; a mechanic is an agent; a looping arrow is the loop (one mechanic
 * trying again and again); the foreman picks the best of several fixes; the chequered flag is the test drive that
 * decides. The job board (a clipboard with a planned route) carries the accent, because the plan, the shape of the
 * work, is what this entry is about; the route arrows of a planned job are accent too.
 */

import { Person } from "@/components/wiki/art-kit";

export { Arrow, Label, Mark, Person } from "@/components/wiki/art-kit";

/** The car (the bug to fix). `broken` lights a fault badge on the bonnet; `fixed` shows a green check instead. */
export function Car({ cx, cy, w = 160, broken = false, fixed = false }: { cx: number; cy: number; w?: number; broken?: boolean; fixed?: boolean }) {
  const h = w * 0.3;
  const x = cx - w / 2;
  const wheelR = w * 0.1;
  return (
    <g>
      <path
        d={`M${x + w * 0.22} ${cy - h / 2}L${x + w * 0.34} ${cy - h * 1.15}H${x + w * 0.68}L${x + w * 0.8} ${cy - h / 2}Z`}
        fill="var(--color-fill)"
      />
      <path d={`M${x + w * 0.38} ${cy - h * 0.6}L${x + w * 0.42} ${cy - h * 0.98}H${x + w * 0.5}V${cy - h * 0.6}Z`} fill="var(--color-page)" />
      <path d={`M${x + w * 0.55} ${cy - h * 0.6}V${cy - h * 0.98}H${x + w * 0.64}L${x + w * 0.71} ${cy - h * 0.6}Z`} fill="var(--color-page)" />
      <rect x={x} y={cy - h / 2} width={w} height={h} rx={h * 0.35} fill="var(--color-fill)" />
      <circle cx={x + w * 0.24} cy={cy + h / 2} r={wheelR} fill="var(--color-ink)" />
      <circle cx={x + w * 0.76} cy={cy + h / 2} r={wheelR} fill="var(--color-ink)" />
      <circle cx={x + w * 0.24} cy={cy + h / 2} r={wheelR * 0.4} fill="var(--color-page)" />
      <circle cx={x + w * 0.76} cy={cy + h / 2} r={wheelR * 0.4} fill="var(--color-page)" />
      {broken ? (
        <g>
          <circle cx={x + w * 0.9} cy={cy - h * 0.9} r={w * 0.075} fill="var(--color-ink)" />
          <path
            d={`M${x + w * 0.9} ${cy - h * 1.08}V${cy - h * 0.92}M${x + w * 0.9} ${cy - h * 0.76}v0.5`}
            stroke="var(--color-page)"
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        </g>
      ) : null}
      {fixed ? <MarkAt cx={x + w * 0.9} cy={cy - h * 0.9} r={w * 0.075} /> : null}
    </g>
  );
}

function MarkAt({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="var(--color-good)" />
      <path d={`M${cx - r * 0.45} ${cy}l${r * 0.32} ${r * 0.32}l${r * 0.6} ${-r * 0.62}`} fill="none" stroke="var(--color-page)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

/** A repair bay (the locked sandbox): a page-coloured room, with a roof line unless `roof` is false (small bays). */
export function Bay({ x, y, w, h, roof = true }: { x: number; y: number; w: number; h: number; roof?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={14} fill="var(--color-page)" />
      {roof ? <path d={`M${x + 10} ${y + 14}H${x + w - 10}`} stroke="var(--color-muted)" strokeWidth={2} strokeLinecap="round" /> : null}
    </g>
  );
}

/** The toolbox (the four tools). */
export function Toolbox({ cx, cy, w = 70 }: { cx: number; cy: number; w?: number }) {
  const h = w * 0.55;
  return (
    <g>
      <path d={`M${cx - w * 0.2} ${cy - h / 2}V${cy - h * 0.85}H${cx + w * 0.2}V${cy - h / 2}`} fill="none" stroke="var(--color-ink)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={8} fill="var(--color-fill)" />
      <path d={`M${cx - w / 2} ${cy - h * 0.1}H${cx + w / 2}`} stroke="var(--color-muted)" strokeWidth={1.5} />
      <rect x={cx - w * 0.08} y={cy - h * 0.2} width={w * 0.16} height={h * 0.2} rx={2} fill="var(--color-ink)" />
    </g>
  );
}

/** The clock (the time budget). `level` from 0 to 1 sweeps the used part of the face. */
export function Clock({ cx, cy, r = 30, level = 0.3 }: { cx: number; cy: number; r?: number; level?: number }) {
  const a = 2 * Math.PI * level - Math.PI / 2;
  const ex = cx + Math.cos(a) * r;
  const ey = cy + Math.sin(a) * r;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="var(--color-fill)" />
      {level > 0 ? <path d={`M${cx} ${cy}V${cy - r}A${r} ${r} 0 ${level > 0.5 ? 1 : 0} 1 ${ex} ${ey}Z`} fill="var(--color-muted)" opacity={0.35} /> : null}
      <path d={`M${cx} ${cy}V${cy - r * 0.6}M${cx} ${cy}L${cx + r * 0.42} ${cy + r * 0.2}`} stroke="var(--color-ink)" strokeWidth={3} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={3.5} fill="var(--color-ink)" />
    </g>
  );
}

/** A coin (the money budget). */
export function Coin({ cx, cy, r = 20 }: { cx: number; cy: number; r?: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="var(--color-fill)" />
      <circle cx={cx} cy={cy} r={r * 0.68} fill="none" stroke="var(--color-muted)" strokeWidth={1.5} />
    </g>
  );
}

/** A mechanic (an agent): a person holding a wrench. `good` adds the shared green check; `s` scales around (cx, cy). */
export function Mechanic({ cx, cy, good = false, s = 1 }: { cx: number; cy: number; good?: boolean; s?: number }) {
  return (
    <g transform={s === 1 ? undefined : `translate(${cx} ${cy}) scale(${s}) translate(${-cx} ${-cy})`}>
      <Person cx={cx} cy={cy} good={good} />
      <path d={`M${cx + 22} ${cy + 14}L${cx + 40} ${cy - 6}`} stroke="var(--color-ink)" strokeWidth={4} strokeLinecap="round" />
      <path d={`M${cx + 36} ${cy - 14}a7 7 0 1 0 10 8`} fill="none" stroke="var(--color-ink)" strokeWidth={4} strokeLinecap="round" />
    </g>
  );
}

/** The foreman, who picks the best of several fixes: a person in a flat cap. */
export function Foreman({ cx, cy, good = false }: { cx: number; cy: number; good?: boolean }) {
  return (
    <g>
      <Person cx={cx} cy={cy} good={good} />
      <path d={`M${cx - 18} ${cy - 36}a18 14 0 0 1 36 0h8a3 3 0 0 1 0 6h-44z`} fill="var(--color-ink)" />
    </g>
  );
}

/** The job board (accent): a clipboard with a planned route of steps, the shape of the work. */
export function JobBoard({ cx, cy, w = 90 }: { cx: number; cy: number; w?: number }) {
  const h = w * 1.25;
  const x = cx - w / 2;
  const y = cy - h / 2;
  const dots = [0.32, 0.55, 0.78].map((t) => y + h * t);
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={w * 0.14} fill="var(--color-accent-tint)" />
      <rect x={cx - w * 0.22} y={y - w * 0.07} width={w * 0.44} height={w * 0.16} rx={w * 0.06} fill="var(--color-accent)" />
      <path d={`M${x + w * 0.28} ${dots[0]}V${dots[2]}`} stroke="var(--color-accent)" strokeWidth={2} strokeLinecap="round" />
      {dots.map((dy) => (
        <g key={dy}>
          <circle cx={x + w * 0.28} cy={dy} r={w * 0.07} fill="var(--color-accent)" />
          <path d={`M${x + w * 0.45} ${dy}H${x + w * 0.78}`} stroke="var(--color-accent)" strokeWidth={2} strokeLinecap="round" opacity={0.7} />
        </g>
      ))}
    </g>
  );
}

/** A route arrow on the planned job (accent), from (x1, y1) to (x2, y2), gently curved when the ends differ in height. */
export function Route({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const mx = (x1 + x2) / 2;
  const d = y1 === y2 ? `M${x1} ${y1}H${x2}` : `M${x1} ${y1}C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`;
  return (
    <g fill="none" stroke="var(--color-accent)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
      <path d={`M${x2 - 7} ${y2 - 6}l7 6l-7 6`} />
    </g>
  );
}

/** A looping arrow (the loop: the same mechanic trying again and again). */
export function Loop({ cx, cy, r = 26 }: { cx: number; cy: number; r?: number }) {
  return (
    <g fill="none" stroke="var(--color-ink)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <path d={`M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx + r * 0.3} ${cy - r * 0.95}`} />
      <path d={`M${cx + r * 0.3 - 2} ${cy - r * 0.95 - 9}l10 9l-12 5`} />
    </g>
  );
}

/** The chequered flag (the test drive that decides). */
export function Flag({ cx, cy, s = 48 }: { cx: number; cy: number; s?: number }) {
  const x = cx - s / 2;
  const y = cy - s;
  const cell = s / 4;
  const cells = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 4; c++) {
      if ((r + c) % 2 === 0) cells.push(<rect key={`${r}-${c}`} x={x + c * cell} y={y + r * cell} width={cell} height={cell} fill="var(--color-ink)" />);
    }
  }
  return (
    <g>
      <rect x={x} y={y} width={s} height={cell * 3} rx={3} fill="var(--color-fill)" />
      {cells}
      <path d={`M${x} ${y - 4}V${cy + s * 0.9}`} stroke="var(--color-muted)" strokeWidth={3} strokeLinecap="round" />
    </g>
  );
}
