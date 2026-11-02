/**
 * The entry's cast, drawn once and reused by the card, the hero and every step figure:
 * a trapeze act with a safety net below. The trapeze artist is the agent; the net is the safety net
 * (the one accent object, because the net is what this entry is about); a looping arrow is an agent
 * repeating itself; a snapped bar is a failing tool; a meter is the budget; a folded note passed up to
 * the artist is a tool result that may hide instructions; the ringmaster gives the go-ahead before a
 * dangerous trick (human approval).
 */

import { Person } from "@/components/wiki/art-kit";

export { Arrow, Label, Person } from "@/components/wiki/art-kit";

/** The trapeze: two ropes from the top and a bar. `broken` snaps the bar in the middle (a failing tool). */
export function Trapeze({ cx, top, len = 120, w = 90, broken = false }: { cx: number; top: number; len?: number; w?: number; broken?: boolean }) {
  const y = top + len;
  return (
    <g stroke="var(--color-muted)" strokeWidth={2} strokeLinecap="round" fill="none">
      <path d={`M${cx - w / 2} ${top}V${y}M${cx + w / 2} ${top}V${y}`} />
      {broken ? (
        <g stroke="var(--color-ink)" strokeWidth={6}>
          <path d={`M${cx - w / 2 - 6} ${y}L${cx - 8} ${y + 4}`} />
          <path d={`M${cx + 8} ${y + 12}L${cx + w / 2 + 6} ${y}`} />
        </g>
      ) : (
        <path d={`M${cx - w / 2 - 6} ${y}H${cx + w / 2 + 6}`} stroke="var(--color-ink)" strokeWidth={6} />
      )}
    </g>
  );
}

/** The trapeze artist (the agent), hanging by the hands from a bar at height `barY`. */
export function Artist({ cx, barY, falling = false }: { cx: number; barY: number; falling?: boolean }) {
  if (falling) {
    return (
      <g transform={`rotate(-24 ${cx} ${barY + 70})`}>
        <Person cx={cx} cy={barY + 70} />
        <path d={`M${cx - 22} ${barY + 70}l-14 -26M${cx + 22} ${barY + 70}l14 -26`} stroke="var(--color-fill)" strokeWidth={9} strokeLinecap="round" />
      </g>
    );
  }
  return (
    <g>
      <path d={`M${cx - 14} ${barY + 2}L${cx - 18} ${barY + 40}M${cx + 14} ${barY + 2}L${cx + 18} ${barY + 40}`} stroke="var(--color-fill)" strokeWidth={9} strokeLinecap="round" />
      <Person cx={cx} cy={barY + 70} />
    </g>
  );
}

/**
 * The safety net (accent): a sagging net with a mesh, between two posts. `sections` splits it into labelled
 * parts; `lit` highlights one part (the catch that fires). `gap` leaves a hole in the mesh at that x (what slips through).
 */
export function Net({ x, y, w, sag = 26, lit, sections = 4, gap }: { x: number; y: number; w: number; sag?: number; lit?: number; sections?: number; gap?: number }) {
  const curve = (dy: number) => `M${x} ${y + dy}Q${x + w / 2} ${y + sag * 2 + dy} ${x + w} ${y + dy}`;
  const depth = 22;
  const sectionW = w / sections;
  const verticals = Array.from({ length: Math.round(w / 22) + 1 }, (_, i) => x + (i * w) / Math.round(w / 22));
  const at = (px: number) => {
    const t = (px - x) / w;
    return y + 2 * sag * 2 * t * (1 - t) * 0.5 * 2;
  };
  return (
    <g>
      {lit !== undefined ? (
        <path
          d={`M${x + lit * sectionW} ${at(x + lit * sectionW) - 6}L${x + (lit + 1) * sectionW} ${at(x + (lit + 1) * sectionW) - 6}L${x + (lit + 1) * sectionW} ${at(x + (lit + 1) * sectionW) + depth + 6}L${x + lit * sectionW} ${at(x + lit * sectionW) + depth + 6}Z`}
          fill="var(--color-accent-tint)"
        />
      ) : null}
      <path d={curve(0)} fill="none" stroke="var(--color-accent)" strokeWidth={4} strokeLinecap="round" />
      <path d={curve(depth)} fill="none" stroke="var(--color-accent)" strokeWidth={2} strokeLinecap="round" opacity={0.7} />
      {verticals
        .filter((vx) => gap === undefined || Math.abs(vx - gap) > 14)
        .map((vx) => (
          <path key={vx} d={`M${vx} ${at(vx)}V${at(vx) + depth}`} stroke="var(--color-accent)" strokeWidth={1.5} opacity={0.7} />
        ))}
      <path d={`M${x} ${y - 30}V${y + depth + 30}M${x + w} ${y - 30}V${y + depth + 30}`} stroke="var(--color-muted)" strokeWidth={4} strokeLinecap="round" />
    </g>
  );
}

/** A looping arrow: the same move again and again (an agent repeating itself). */
export function Loop({ cx, cy, r = 26 }: { cx: number; cy: number; r?: number }) {
  return (
    <g fill="none" stroke="var(--color-ink)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <path d={`M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx + r * 0.3} ${cy - r * 0.95}`} />
      <path d={`M${cx + r * 0.3 - 2} ${cy - r * 0.95 - 9}l10 9l-12 5`} />
    </g>
  );
}

/** A meter (the budget): a dial with a needle; `level` from 0 to 1. Past 0.8 the dial's end turns ink. */
export function Meter({ cx, cy, r = 30, level = 0.4 }: { cx: number; cy: number; r?: number; level?: number }) {
  const angle = Math.PI * (1 - level);
  const nx = cx + Math.cos(angle) * r * 0.78;
  const ny = cy - Math.sin(angle) * r * 0.78;
  return (
    <g>
      <path d={`M${cx - r} ${cy}A${r} ${r} 0 0 1 ${cx + r} ${cy}Z`} fill="var(--color-fill)" />
      <path d={`M${cx + r * Math.cos(Math.PI * 0.2)} ${cy - r * Math.sin(Math.PI * 0.2)}A${r} ${r} 0 0 1 ${cx + r} ${cy}L${cx} ${cy}Z`} fill={level > 0.8 ? "var(--color-ink)" : "var(--color-muted)"} opacity={0.6} />
      <path d={`M${cx} ${cy}L${nx} ${ny}`} stroke="var(--color-ink)" strokeWidth={3} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={4} fill="var(--color-ink)" />
    </g>
  );
}

/** A folded note passed up to the artist (a tool result). `blocked` crosses it out; `hidden` adds a small mark for a hidden order. */
export function Note({ cx, cy, w = 44, blocked = false, hidden = false }: { cx: number; cy: number; w?: number; blocked?: boolean; hidden?: boolean }) {
  const h = w * 0.78;
  return (
    <g opacity={blocked ? 0.55 : 1}>
      <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={w * 0.12} fill="var(--color-page)" />
      <path
        d={`M${cx - w * 0.3} ${cy - h * 0.18}H${cx + w * 0.3}M${cx - w * 0.3} ${cy + h * 0.02}H${cx + w * 0.22}M${cx - w * 0.3} ${cy + h * 0.22}H${cx + w * 0.1}`}
        stroke="var(--color-muted)"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      {hidden ? <circle cx={cx + w * 0.3} cy={cy + h * 0.24} r={w * 0.09} fill="var(--color-ink)" /> : null}
      {blocked ? (
        <path d={`M${cx - w * 0.42} ${cy - h * 0.42}L${cx + w * 0.42} ${cy + h * 0.42}`} stroke="var(--color-ink)" strokeWidth={3} strokeLinecap="round" />
      ) : null}
    </g>
  );
}

/** The ringmaster (the human who approves): a person in a top hat. `nod` shows a yes, `stop` a raised hand. */
export function Ringmaster({ cx, cy, nod = false, stop = false }: { cx: number; cy: number; nod?: boolean; stop?: boolean }) {
  return (
    <g>
      <Person cx={cx} cy={cy} good={nod} />
      <rect x={cx - 16} y={cy - 70} width={32} height={26} rx={4} fill="var(--color-ink)" />
      <rect x={cx - 24} y={cy - 46} width={48} height={6} rx={3} fill="var(--color-ink)" />
      {stop ? (
        <g>
          <path d={`M${cx + 28} ${cy + 8}L${cx + 46} ${cy - 20}`} stroke="var(--color-fill)" strokeWidth={9} strokeLinecap="round" />
          <circle cx={cx + 50} cy={cy - 30} r={11} fill="var(--color-ink)" />
        </g>
      ) : null}
    </g>
  );
}

/** A small check (yes) or cross (no) badge. */
export function Mark({ cx, cy, ok, r = 12 }: { cx: number; cy: number; ok: boolean; r?: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={ok ? "var(--color-good)" : "var(--color-ink)"} />
      {ok ? (
        <path d={`M${cx - r * 0.45} ${cy}l${r * 0.32} ${r * 0.32}l${r * 0.6} ${-r * 0.62}`} fill="none" stroke="var(--color-page)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d={`M${cx - r * 0.4} ${cy - r * 0.4}l${r * 0.8} ${r * 0.8}m0 ${-r * 0.8}l${-r * 0.8} ${r * 0.8}`} stroke="var(--color-page)" strokeWidth={2.5} strokeLinecap="round" />
      )}
    </g>
  );
}
