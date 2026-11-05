/**
 * The entry's cast, drawn once and reused by the card, the hero and every figure: one restaurant kitchen with two
 * ways in. The dining-room door is the web app people use; the delivery window is the MCP route agents use (the one
 * accent object, because the window is what this entry is about). The rulebook is the database rules both doors share;
 * the order rail is the board, with tickets hanging on it; the pass is a personal agent token; the menu is the tool
 * list; the stamp is approval, which only people hold. The AI assistant is a small robot, people are the shared Person.
 */

export { Arrow, Label, Mark, Person } from "@/components/wiki/art-kit";

/** The kitchen: a plain room. Doors and windows are drawn on its walls. */
export function Room({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return <rect x={x} y={y} width={w} height={h} rx={20} fill="var(--color-page)" />;
}

/** The dining-room door (the web app people use), standing on the floor at `y + h`. */
export function Door({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={Math.min(w / 2, 14)} fill="var(--color-fill)" />
      <circle cx={x + w - 11} cy={y + h * 0.55} r={3.5} fill="var(--color-muted)" />
    </g>
  );
}

/** The delivery window (the MCP route, accent): a takeaway hatch under a scalloped awning, with a sill for orders. */
export function Window({ x, y, w }: { x: number; y: number; w: number }) {
  const h = w * 0.95;
  const top = h * 0.3;
  const n = 4;
  const sw = (w + 12) / n;
  return (
    <g>
      <rect x={x} y={y + top + 4} width={w} height={h - top - 4} rx={8} fill="var(--color-accent-tint)" />
      <rect x={x - 4} y={y + h - 4} width={w + 8} height={8} rx={4} fill="var(--color-accent)" />
      <rect x={x - 6} y={y} width={w + 12} height={top} rx={6} fill="var(--color-accent)" />
      {Array.from({ length: n }, (_, i) => (
        <circle key={i} cx={x - 6 + (i + 0.5) * sw} cy={y + top} r={sw / 2} fill="var(--color-accent)" />
      ))}
      {Array.from({ length: n - 1 }, (_, i) => (
        <path key={i} d={`M${x - 6 + (i + 1) * sw} ${y + 4}V${y + top - 2}`} stroke="var(--color-accent-tint)" strokeWidth={2} strokeLinecap="round" />
      ))}
    </g>
  );
}

/** The rulebook (the database rules), open. `odd` draws one rule differently: a copy that has drifted. */
export function Book({ cx, cy, w, odd = false }: { cx: number; cy: number; w: number; odd?: boolean }) {
  const h = w * 0.62;
  const page = w / 2 - 3;
  const lines = (px: number) =>
    [0.28, 0.5, 0.72].map((t, i) => (
      <path
        key={`${px}-${t}`}
        d={`M${px + page * 0.18} ${cy - h / 2 + h * t}H${px + page * (i === 2 ? 0.6 : 0.82)}`}
        stroke="var(--color-muted)"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    ));
  return (
    <g>
      <rect x={cx - w / 2 - 6} y={cy - h / 2 - 6} width={w + 12} height={h + 12} rx={10} fill="var(--color-muted)" />
      <rect x={cx - w / 2} y={cy - h / 2} width={page} height={h} rx={6} fill="var(--color-fill)" />
      <rect x={cx + 3} y={cy - h / 2} width={page} height={h} rx={6} fill="var(--color-fill)" />
      {lines(cx - w / 2)}
      {odd ? (
        <g>
          {[0.28, 0.72].map((t) => (
            <path key={t} d={`M${cx + 3 + page * 0.18} ${cy - h / 2 + h * t}H${cx + 3 + page * 0.82}`} stroke="var(--color-muted)" strokeWidth={1.5} strokeLinecap="round" />
          ))}
          <path d={`M${cx + 3 + page * 0.18} ${cy}H${cx + 3 + page * 0.82}`} stroke="var(--color-ink)" strokeWidth={4} strokeLinecap="round" />
        </g>
      ) : (
        lines(cx + 3)
      )}
    </g>
  );
}

/** One order ticket. `tint` highlights it (the one that changes). */
export function Ticket({ cx, cy, s = 1, tint = false }: { cx: number; cy: number; s?: number; tint?: boolean }) {
  const w = 30 * s;
  const h = 40 * s;
  return (
    <g>
      <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={5 * s} fill={tint ? "var(--color-accent-tint)" : "var(--color-fill)"} />
      <path
        d={`M${cx - w * 0.28} ${cy - h * 0.12}H${cx + w * 0.28}M${cx - w * 0.28} ${cy + h * 0.12}H${cx + w * 0.12}`}
        stroke={tint ? "var(--color-accent)" : "var(--color-muted)"}
        strokeWidth={1.5 * Math.min(1, s)}
        strokeLinecap="round"
      />
    </g>
  );
}

/** The order rail (the board): a bar with tickets hanging from it. `tint` marks one ticket. */
export function Rail({ x, y, w, n = 4, s = 1, tint }: { x: number; y: number; w: number; n?: number; s?: number; tint?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={6 * s} rx={3 * s} fill="var(--color-ink)" />
      {Array.from({ length: n }, (_, i) => (
        <Ticket key={i} cx={x + ((i + 0.5) * w) / n} cy={y + 6 * s + 22 * s} s={s} tint={i === tint} />
      ))}
    </g>
  );
}

/** An AI assistant: a small robot, the same build as a Person so the two read as a pair. */
export function Bot({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <path d={`M${cx} ${cy - 44}V${cy - 54}`} stroke="var(--color-muted)" strokeWidth={2} strokeLinecap="round" />
      <circle cx={cx} cy={cy - 57} r={3.5} fill="var(--color-muted)" />
      <rect x={cx - 18} y={cy - 44} width={36} height={30} rx={10} fill="var(--color-fill)" />
      <circle cx={cx - 7} cy={cy - 29} r={3} fill="var(--color-ink)" />
      <circle cx={cx + 7} cy={cy - 29} r={3} fill="var(--color-ink)" />
      <path d={`M${cx - 30} ${cy + 30}a30 30 0 0 1 60 0z`} fill="var(--color-fill)" />
    </g>
  );
}

/** The pass (a personal agent token): a small dark card. */
export function Pass({ cx, cy, w }: { cx: number; cy: number; w: number }) {
  const h = w * 0.64;
  return (
    <g>
      <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={w * 0.12} fill="var(--color-ink)" />
      <rect x={cx - w * 0.36} y={cy - h * 0.22} width={w * 0.36} height={h * 0.16} rx={h * 0.08} fill="var(--color-page)" />
      <circle cx={cx + w * 0.26} cy={cy + h * 0.16} r={w * 0.09} fill="var(--color-muted)" />
    </g>
  );
}

/** The menu (the tool list): a card with one short line per item. */
export function Menu({ x, y, w, items }: { x: number; y: number; w: number; items: string[] }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={items.length * 36 + 26} rx={14} fill="var(--color-page)" />
      {items.map((item, i) => (
        <g key={item}>
          <circle cx={x + 24} cy={y + 38 + i * 36 - 7} r={4} fill="var(--color-muted)" />
          <text x={x + 40} y={y + 38 + i * 36} fontSize={21} fontWeight={500} fill="var(--color-ink)">
            {item}
          </text>
        </g>
      ))}
    </g>
  );
}

/** The approval stamp, which only people hold. */
export function Stamp({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy - 30} r={9} fill="var(--color-ink)" />
      <rect x={cx - 4} y={cy - 24} width={8} height={18} fill="var(--color-ink)" />
      <rect x={cx - 22} y={cy - 8} width={44} height={14} rx={5} fill="var(--color-ink)" />
    </g>
  );
}

/** A clock face: the board's 10-second check, or a wait. */
export function Clock({ cx, cy, r = 20 }: { cx: number; cy: number; r?: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="var(--color-fill)" />
      <path d={`M${cx} ${cy}V${cy - r * 0.6}M${cx} ${cy}H${cx + r * 0.45}`} stroke="var(--color-ink)" strokeWidth={2.5} strokeLinecap="round" />
    </g>
  );
}

/** A screen showing the board: a small rail inside a frame. */
export function Screen({ x, y, w, h, tint }: { x: number; y: number; w: number; h: number; tint?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={12} fill="var(--color-page)" />
      <Rail x={x + 14} y={y + 16} w={w - 28} n={3} s={0.8} tint={tint} />
    </g>
  );
}

/** An arrow at any angle, from (x1, y1) to (x2, y2). */
export function ArrowTo({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const head = (da: number) => `${(x2 - 9 * Math.cos(a + da)).toFixed(1)} ${(y2 - 9 * Math.sin(a + da)).toFixed(1)}`;
  return (
    <path
      d={`M${x1} ${y1}L${x2} ${y2}M${head(-0.5)}L${x2} ${y2}L${head(0.5)}`}
      fill="none"
      stroke="var(--color-muted)"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}
