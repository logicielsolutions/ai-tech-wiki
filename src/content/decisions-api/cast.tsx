/**
 * The entry's cast, drawn once and reused by the card, the hero and every step figure:
 * a resume, Luna (a rounded square with an accent core), the answer sheet with odds bars,
 * a writing model, and the person who decides.
 */

const LINE = { stroke: "var(--color-muted)", strokeWidth: 2, strokeLinecap: "round" } as const;

export function Resume({ x, y, w = 100, h = 132 }: { x: number; y: number; w?: number; h?: number }) {
  const pad = w * 0.16;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={12} fill="var(--color-page)" />
      <circle cx={x + pad + 9} cy={y + pad + 9} r={9} fill="var(--color-fill)" />
      <path d={`M${x + pad + 26} ${y + pad + 5}h${w * 0.32}`} {...LINE} />
      <path d={`M${x + pad + 26} ${y + pad + 14}h${w * 0.2}`} {...LINE} strokeWidth={1.5} />
      {[0.42, 0.56, 0.7, 0.84].map((t, i) => (
        <path key={t} d={`M${x + pad} ${y + h * t}h${(w - pad * 2) * (i % 2 ? 0.7 : 1)}`} {...LINE} strokeWidth={1.5} />
      ))}
    </g>
  );
}

/** Luna: the one thing the entry is about, so its core is the solid accent. */
export function Luna({ cx, cy, size = 64 }: { cx: number; cy: number; size?: number }) {
  return (
    <g>
      <rect x={cx - size / 2} y={cy - size / 2} width={size} height={size} rx={size * 0.26} fill="var(--color-ink)" />
      <circle cx={cx} cy={cy} r={size * 0.2} fill="var(--color-accent)" />
    </g>
  );
}

/** A model that writes: same shape as Luna, no accent, with lines of text inside. */
export function Writer({ cx, cy, size = 64 }: { cx: number; cy: number; size?: number }) {
  const s = size / 2;
  return (
    <g>
      <rect x={cx - s} y={cy - s} width={size} height={size} rx={size * 0.26} fill="var(--color-fill)" />
      {[-0.3, 0, 0.3].map((t, i) => (
        <path key={t} d={`M${cx - s * 0.5} ${cy + s * t}h${s * (i === 2 ? 0.6 : 1)}`} {...LINE} stroke="var(--color-ink)" />
      ))}
    </g>
  );
}

/** One row of the answer sheet: a track, and an accent fill for how likely the answer is. */
export function OddsRow({ x, y, w, p, faded = false }: { x: number; y: number; w: number; p: number; faded?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={8} rx={4} fill="var(--color-fill)" />
      <rect x={x} y={y} width={Math.max(8, w * p)} height={8} rx={4} fill="var(--color-accent)" opacity={faded ? 0.45 : 1} />
    </g>
  );
}

/** The answer sheet: a page with question groups, each a short prompt line and odds rows. */
export function Sheet({
  x,
  y,
  w,
  h,
  groups,
  blank = false,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  /** Odds per group; the largest in each group is drawn solid. */
  groups: number[][];
  blank?: boolean;
}) {
  const pad = 16;
  const inner = w - pad * 2;
  const groupHeight = (odds: number[]) => 14 + odds.length * 14 + 10;
  const tops = groups.map((_, g) => y + pad + 4 + groups.slice(0, g).reduce((sum, odds) => sum + groupHeight(odds), 0));
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={14} fill="var(--color-page)" />
      {groups.map((odds, g) => {
        const top = tops[g];
        const best = Math.max(...odds);
        return (
          <g key={g}>
            <path d={`M${x + pad} ${top}h${inner * 0.55}`} {...LINE} stroke="var(--color-ink)" />
            {odds.map((p, i) =>
              blank ? (
                <rect key={i} x={x + pad} y={top + 10 + i * 14} width={inner} height={8} rx={4} fill="var(--color-fill)" />
              ) : (
                <OddsRow key={i} x={x + pad} y={top + 10 + i * 14} w={inner} p={p} faded={p !== best} />
              ),
            )}
          </g>
        );
      })}
    </g>
  );
}

export function Person({ cx, cy, good = false }: { cx: number; cy: number; good?: boolean }) {
  return (
    <g>
      <circle cx={cx} cy={cy - 26} r={16} fill="var(--color-fill)" />
      <path d={`M${cx - 30} ${cy + 30}a30 30 0 0 1 60 0z`} fill="var(--color-fill)" />
      {good ? (
        <g>
          <circle cx={cx + 26} cy={cy - 34} r={12} fill="var(--color-good)" />
          <path
            d={`M${cx + 20} ${cy - 34}l4 4l8 -8`}
            fill="none"
            stroke="var(--color-page)"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      ) : null}
    </g>
  );
}

export function Arrow({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  return (
    <path
      d={`M${x1} ${y}H${x2}m-7 -6l7 6l-7 6`}
      fill="none"
      stroke="var(--color-muted)"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

export function Label({
  x,
  y,
  children,
  muted = false,
  anchor = "middle",
  size = 20,
}: {
  x: number;
  y: number;
  children: string;
  muted?: boolean;
  anchor?: "start" | "middle" | "end";
  size?: number;
}) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={500} fill={muted ? "var(--color-muted)" : "var(--color-ink)"}>
      {children}
    </text>
  );
}
