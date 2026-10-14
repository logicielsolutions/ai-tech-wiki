/**
 * Illustration primitives shared by every entry's art: a person, an arrow and a short label.
 * Token colors only, per the wiki-brand illustration rules.
 */

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
