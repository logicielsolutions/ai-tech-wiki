/**
 * The entry's cast, drawn once and reused by the card, the hero and every step figure:
 * a hotel front desk's guest card file. A guest card is the memory (the one accent object); the card box is
 * the store, one section per guest; a black marker is the checker that cuts details before filing; a stamp
 * marks an old card "no longer true"; a shredder handles forget requests; a phone is the guest calling.
 */

export { Arrow, Label, Mark, Person } from "@/components/wiki/art-kit";

const WIDTHS = [0.72, 0.56, 0.66, 0.48];

/**
 * A guest card. `redact` lists lines blacked out, `strike` lines crossed out. `plain` greys the top band (a card
 * not yet checked or no longer used); `stamped` adds a "no longer true" stamp; `badge` draws what the card wrongly holds.
 */
export function Card({
  x,
  y,
  w = 140,
  lines = 3,
  redact = [],
  strike = [],
  plain = false,
  stamped = false,
  faded = false,
  badge,
}: {
  x: number;
  y: number;
  w?: number;
  lines?: number;
  redact?: number[];
  strike?: number[];
  plain?: boolean;
  stamped?: boolean;
  faded?: boolean;
  badge?: "bank" | "everyone" | "nut";
}) {
  const h = w * 0.66;
  const r = Math.min(10, w * 0.07);
  const bh = h * 0.2;
  const th = Math.max(5, h * 0.07);
  const s = w * 0.12;
  const bx = x + w * 0.82;
  const by = y + h * 0.72;
  return (
    <g opacity={faded ? 0.6 : 1}>
      <rect x={x} y={y} width={w} height={h} rx={r} fill="var(--color-page)" />
      <path d={`M${x} ${y + bh}V${y + r}Q${x} ${y} ${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + bh}Z`} fill={plain ? "var(--color-muted)" : "var(--color-accent)"} />
      {Array.from({ length: lines }, (_, i) => {
        const ly = y + bh + ((h - bh) * (i + 1)) / (lines + 1);
        const lx = x + w * 0.1;
        const lw = w * WIDTHS[i % WIDTHS.length];
        if (redact.includes(i)) {
          return <rect key={i} x={lx} y={ly - th * 0.9} width={lw} height={th * 1.8} rx={2} fill="var(--color-ink)" />;
        }
        return (
          <g key={i}>
            <rect x={lx} y={ly - th / 2} width={lw} height={th} rx={th / 2} fill="var(--color-fill)" />
            {strike.includes(i) ? <path d={`M${lx - 4} ${ly}H${lx + lw + 4}`} stroke="var(--color-ink)" strokeWidth={2.5} strokeLinecap="round" /> : null}
          </g>
        );
      })}
      {badge === "bank" ? (
        <g>
          <rect x={bx - s * 0.8} y={by - s * 0.5} width={s * 1.6} height={s} rx={3} fill="var(--color-ink)" />
          <rect x={bx - s * 0.8} y={by - s * 0.25} width={s * 1.6} height={s * 0.2} fill="var(--color-page)" />
        </g>
      ) : null}
      {badge === "everyone"
        ? [-1, 0, 1].map((k) => <circle key={k} cx={bx + k * s * 0.55} cy={by} r={s * 0.24} fill="var(--color-ink)" />)
        : null}
      {badge === "nut" ? (
        <g fill="var(--color-ink)">
          <circle cx={bx - s * 0.28} cy={by - s * 0.12} r={s * 0.36} />
          <circle cx={bx + s * 0.28} cy={by + s * 0.12} r={s * 0.36} />
        </g>
      ) : null}
      {stamped ? (
        <g transform={`rotate(-14 ${x + w * 0.55} ${y + h * 0.6})`}>
          <rect x={x + w * 0.24} y={y + h * 0.45} width={w * 0.62} height={h * 0.3} rx={4} fill="none" stroke="var(--color-ink)" strokeWidth={3} />
          <path d={`M${x + w * 0.32} ${y + h * 0.6}H${x + w * 0.78}`} stroke="var(--color-ink)" strokeWidth={3} strokeLinecap="round" />
        </g>
      ) : null}
    </g>
  );
}

/** The card box (the store): a drawer with card tops showing, one per guest. `lit` raises one card and colours its tab. */
export function CardBox({ x, y, w, cards = 5, lit }: { x: number; y: number; w: number; cards?: number; lit?: number }) {
  const h = w * 0.42;
  const tabW = w * 0.14;
  const top = (i: number) => y - 34 + i * 6 - (i === lit ? 26 : 0);
  const tabX = (i: number) => x + w * 0.1 + (i * (w * 0.8 - tabW)) / Math.max(1, cards - 1);
  /** Back to front, with the raised card last so it sits in front. Each tab sits above its own card's top. */
  const order = [...Array.from({ length: cards }, (_, i) => i).filter((i) => i !== lit), ...(lit === undefined ? [] : [lit])];
  return (
    <g>
      {order.map((i) => (
        <g key={i}>
          <rect x={x + w * 0.07} y={top(i)} width={w * 0.86} height={50} rx={6} fill="var(--color-page)" />
          <rect x={tabX(i)} y={top(i) - 10} width={tabW} height={14} rx={4} fill={i === lit ? "var(--color-accent)" : "var(--color-muted)"} />
        </g>
      ))}
      <rect x={x} y={y} width={w} height={h} rx={12} fill="var(--color-fill)" />
      <rect x={x + w * 0.38} y={y + h * 0.4} width={w * 0.24} height={10} rx={5} fill="var(--color-muted)" />
    </g>
  );
}

/** The checker's black marker, tip at (x, y). A negative `angle` leans the tip to the left. */
export function Marker({ x, y, angle = -30, len = 100 }: { x: number; y: number; angle?: number; len?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <path d={`M-7 ${len * 0.16}L-3 0H3L7 ${len * 0.16}Z`} fill="var(--color-ink)" />
      <rect x={-10} y={len * 0.16} width={20} height={len * 0.84} rx={6} fill="var(--color-ink)" />
      <rect x={-10} y={len * 0.32} width={20} height={6} fill="var(--color-muted)" />
    </g>
  );
}

/** The shredder (forget). Accent strips below it are a card that has been shredded. */
export function Shredder({ cx, y, w = 180, strips = true }: { cx: number; y: number; w?: number; strips?: boolean }) {
  const h = w * 0.4;
  const n = 9;
  return (
    <g>
      {strips
        ? Array.from({ length: n }, (_, i) => {
            const sx = cx - w * 0.3 + (i * w * 0.6) / (n - 1);
            const len = 40 + ((i * 37) % 5) * 9;
            return <path key={i} d={`M${sx} ${y + h}v${len}`} stroke="var(--color-accent)" strokeWidth={5} strokeLinecap="round" />;
          })
        : null}
      <rect x={cx - w / 2} y={y} width={w} height={h} rx={14} fill="var(--color-fill)" />
      <rect x={cx - w * 0.38} y={y + 12} width={w * 0.76} height={6} rx={3} fill="var(--color-ink)" />
      <circle cx={cx + w * 0.36} cy={y + h * 0.66} r={6} fill="var(--color-muted)" />
    </g>
  );
}

/** A mobile phone (the guest calling). `ringing` adds two arcs. */
export function Phone({ cx, cy, ringing = false }: { cx: number; cy: number; ringing?: boolean }) {
  return (
    <g>
      <rect x={cx - 24} y={cy - 42} width={48} height={84} rx={10} fill="var(--color-ink)" />
      <rect x={cx - 18} y={cy - 32} width={36} height={58} rx={4} fill="var(--color-fill)" />
      {ringing ? (
        <g fill="none" stroke="var(--color-muted)" strokeWidth={3} strokeLinecap="round">
          <path d={`M${cx + 34} ${cy - 20}a26 26 0 0 1 0 40`} />
          <path d={`M${cx + 46} ${cy - 32}a40 40 0 0 1 0 64`} />
        </g>
      ) : null}
    </g>
  );
}

/** A clock (a lookup that takes too long). */
export function Clock({ cx, cy, r = 40 }: { cx: number; cy: number; r?: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="var(--color-page)" stroke="var(--color-muted)" strokeWidth={4} />
      <path d={`M${cx} ${cy}V${cy - r * 0.62}M${cx} ${cy}L${cx + r * 0.45} ${cy + r * 0.2}`} stroke="var(--color-ink)" strokeWidth={4} strokeLinecap="round" />
    </g>
  );
}
