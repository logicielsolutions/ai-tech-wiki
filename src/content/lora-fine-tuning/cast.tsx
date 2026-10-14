/**
 * The entry's cast, drawn once and reused by the card, the hero and every step figure:
 * a camera (the frozen model), the clip-on lens (LoRA, the one accent object), a compact camera
 * (QLoRA: the same lens on a compressed model), an opened camera (full fine-tuning), a rented
 * studio camera (a large hosted model) and the photos each one takes (answers).
 */

type CameraProps = {
  cx: number;
  cy: number;
  /** Body width; height follows. */
  w?: number;
  /** Clip the accent lens on. */
  lens?: boolean;
  /** Show a small lock: the camera itself stays as it is. */
  locked?: boolean;
  /** Muted body, for the rented studio camera or a camera that isn't the subject. */
  faded?: boolean;
};

export function Camera({ cx, cy, w = 160, lens = false, locked = false, faded = false }: CameraProps) {
  const h = w * 0.62;
  const top = cy - h / 2;
  const mountY = cy + h * 0.04;
  const r = h * 0.34;
  return (
    <g opacity={faded ? 0.55 : 1}>
      <rect x={cx - w * 0.36} y={top - w * 0.09} width={w * 0.24} height={w * 0.13} rx={w * 0.04} fill="var(--color-fill)" />
      <rect x={cx + w * 0.22} y={top - w * 0.05} width={w * 0.13} height={w * 0.08} rx={w * 0.03} fill="var(--color-muted)" />
      <rect x={cx - w / 2} y={top} width={w} height={h} rx={w * 0.11} fill="var(--color-fill)" />
      <rect x={cx + w * 0.3} y={top + h * 0.16} width={w * 0.1} height={w * 0.06} rx={w * 0.02} fill="var(--color-page)" />
      {lens ? (
        <g>
          <circle cx={cx} cy={mountY} r={r * 1.28} fill="var(--color-accent)" />
          <circle cx={cx} cy={mountY} r={r * 0.96} fill="var(--color-page)" />
        </g>
      ) : (
        <circle cx={cx} cy={mountY} r={r} fill="var(--color-page)" />
      )}
      <circle cx={cx} cy={mountY} r={r * 0.64} fill="var(--color-ink)" />
      <circle cx={cx - r * 0.22} cy={mountY - r * 0.22} r={r * 0.14} fill="var(--color-page)" opacity={0.6} />
      {locked ? <Lock cx={cx - w * 0.36} cy={top + h * 0.2} size={w * 0.13} /> : null}
    </g>
  );
}

/** The lens on its own, off the camera: the add-on that learns. */
export function Lens({ cx, cy, r = 30 }: { cx: number; cy: number; r?: number }) {
  return (
    <g>
      <rect x={cx - r * 1.05} y={cy - r * 0.42} width={r * 2.1} height={r * 0.84} rx={r * 0.3} fill="var(--color-accent)" />
      <circle cx={cx} cy={cy} r={r} fill="var(--color-accent)" />
      <circle cx={cx} cy={cy} r={r * 0.72} fill="var(--color-page)" />
      <circle cx={cx} cy={cy} r={r * 0.4} fill="var(--color-accent-tint)" />
    </g>
  );
}

/** A small padlock: this part does not change. */
export function Lock({ cx, cy, size = 22 }: { cx: number; cy: number; size?: number }) {
  const s = size;
  return (
    <g>
      <path
        d={`M${cx - s * 0.28} ${cy}v${-s * 0.22}a${s * 0.28} ${s * 0.28} 0 0 1 ${s * 0.56} 0v${s * 0.22}`}
        fill="none"
        stroke="var(--color-muted)"
        strokeWidth={Math.max(1.5, s * 0.1)}
        strokeLinecap="round"
      />
      <rect x={cx - s * 0.42} y={cy - s * 0.02} width={s * 0.84} height={s * 0.62} rx={s * 0.14} fill="var(--color-muted)" />
    </g>
  );
}

/** The camera opened up: every part inside is highlighted, because in full fine-tuning every part learns. */
export function OpenCamera({ cx, cy, w = 160 }: { cx: number; cy: number; w?: number }) {
  const h = w * 0.62;
  const top = cy - h / 2;
  const inset = w * 0.08;
  const cols = 4;
  const rows = 2;
  const innerW = w - inset * 2;
  const innerH = h - inset * 2;
  const gap = w * 0.035;
  const partW = (innerW - gap * (cols + 1)) / cols;
  const partH = (innerH - gap * (rows + 1)) / rows;
  return (
    <g>
      <rect x={cx - w * 0.36} y={top - w * 0.09} width={w * 0.24} height={w * 0.13} rx={w * 0.04} fill="var(--color-fill)" />
      <rect x={cx - w / 2} y={top} width={w} height={h} rx={w * 0.11} fill="var(--color-fill)" />
      <rect x={cx - w / 2 + inset} y={top + inset} width={innerW} height={innerH} rx={w * 0.06} fill="var(--color-page)" />
      {Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => (
          <rect
            key={`${row}-${col}`}
            x={cx - w / 2 + inset + gap + col * (partW + gap)}
            y={top + inset + gap + row * (partH + gap)}
            width={partW}
            height={partH}
            rx={Math.min(partW, partH) * 0.25}
            fill="var(--color-accent-tint)"
          />
        )),
      )}
      {/* The front panel, set aside. */}
      <rect
        x={cx + w * 0.56}
        y={top + h * 0.1}
        width={w * 0.3}
        height={h * 0.8}
        rx={w * 0.06}
        fill="var(--color-fill)"
        transform={`rotate(12 ${cx + w * 0.71} ${top + h * 0.5})`}
      />
    </g>
  );
}

/** The rented studio camera on a tripod: a large hosted model you pay per use. */
export function StudioCamera({ cx, cy, w = 190 }: { cx: number; cy: number; w?: number }) {
  const h = w * 0.62;
  const legTop = cy + h / 2;
  const line = { stroke: "var(--color-muted)", strokeWidth: 3, strokeLinecap: "round" } as const;
  return (
    <g>
      <path d={`M${cx} ${legTop}L${cx - w * 0.3} ${legTop + h * 0.85}`} {...line} />
      <path d={`M${cx} ${legTop}L${cx + w * 0.3} ${legTop + h * 0.85}`} {...line} />
      <path d={`M${cx} ${legTop}V${legTop + h * 0.9}`} {...line} />
      <Camera cx={cx} cy={cy} w={w} faded />
    </g>
  );
}

/** One photo: a small landscape. Sharp photos read clearly; blurry ones are washed out. */
export function Photo({
  x,
  y,
  w = 70,
  sharp = true,
  mark,
}: {
  x: number;
  y: number;
  w?: number;
  sharp?: boolean;
  mark?: "good" | "bad";
}) {
  const h = w * 0.8;
  const pad = w * 0.09;
  const ix = x + pad;
  const iy = y + pad;
  const iw = w - pad * 2;
  const ih = h - pad * 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={w * 0.12} fill="var(--color-page)" />
      <g opacity={sharp ? 1 : 0.35}>
        <rect x={ix} y={iy} width={iw} height={ih} rx={w * 0.06} fill="var(--color-fill)" />
        <circle cx={ix + iw * 0.74} cy={iy + ih * 0.3} r={iw * 0.1} fill="var(--color-page)" />
        <path
          d={`M${ix} ${iy + ih}L${ix + iw * 0.36} ${iy + ih * 0.42}L${ix + iw * 0.56} ${iy + ih * 0.7}L${ix + iw * 0.7} ${iy + ih * 0.55}L${ix + iw} ${iy + ih}Z`}
          fill="var(--color-muted)"
        />
      </g>
      {!sharp ? (
        <path
          d={`M${ix + iw * 0.1} ${iy + ih * 0.5}q${iw * 0.2} ${-ih * 0.12} ${iw * 0.4} 0t${iw * 0.4} 0`}
          fill="none"
          stroke="var(--color-muted)"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      ) : null}
      {mark ? <Mark cx={x + w - 2} cy={y + 2} good={mark === "good"} r={w * 0.13} /> : null}
    </g>
  );
}

/** A small tick (right) or cross (wrong) badge. */
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

/** A horizontal bar on a track, labelled; used for memory and scores in figures. */
export function Bar({ x, y, w, value, max, strong = false }: { x: number; y: number; w: number; value: number; max: number; strong?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={12} rx={6} fill="var(--color-fill)" />
      <rect x={x} y={y} width={Math.max(12, (w * value) / max)} height={12} rx={6} fill="var(--color-accent)" opacity={strong ? 1 : 0.45} />
    </g>
  );
}

export { Arrow, Label } from "@/components/wiki/art-kit";
