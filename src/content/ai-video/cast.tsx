/**
 * The entry's cast, drawn once and reused by the card, the hero and every step figure. The metaphor is a film set:
 * you are the director, the prompt is the shot list on a clapperboard, the model is the camera crew (the accent), and
 * the shot comes out of fog (static) one pass at a time.
 */

export { Arrow, Label } from "@/components/wiki/art-kit";

const LINE = { stroke: "var(--color-muted)", strokeWidth: 2, strokeLinecap: "round" } as const;

/** A small deterministic random generator, so the static looks the same on the server and in the browser. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const STATIC_FILLS = ["var(--color-fill)", "var(--color-muted)", "var(--color-page)", "var(--color-rule)"];

/** A patch of TV static made of small squares in token colors. */
export function Static({ x, y, w, h, cell = 8, seed = 7 }: { x: number; y: number; w: number; h: number; cell?: number; seed?: number }) {
  const rand = seeded(seed);
  const cells = [];
  for (let cy = 0; cy < h; cy += cell) {
    for (let cx = 0; cx < w; cx += cell) {
      cells.push(
        <rect
          key={`${cx}-${cy}`}
          x={x + cx}
          y={y + cy}
          width={Math.min(cell, w - cx)}
          height={Math.min(cell, h - cy)}
          fill={STATIC_FILLS[Math.floor(rand() * STATIC_FILLS.length)]}
        />
      );
    }
  }
  return <g>{cells}</g>;
}

/** The example scene the crew is filming: a lighthouse on a hill at dusk. Drawn inside a w×h box. */
export function Scene({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const px = (f: number) => x + f * w;
  const py = (f: number) => y + f * h;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="var(--color-accent-tint)" />
      <circle cx={px(0.72)} cy={py(0.42)} r={Math.min(w, h) * 0.12} fill="var(--color-muted)" />
      <path
        d={`M${x} ${py(0.78)}Q${px(0.3)} ${py(0.55)} ${px(0.55)} ${py(0.74)}T${x + w} ${py(0.7)}V${y + h}H${x}Z`}
        fill="var(--color-fill)"
      />
      <path d={`M${px(0.27)} ${py(0.66)}L${px(0.31)} ${py(0.3)}H${px(0.35)}L${px(0.39)} ${py(0.66)}Z`} fill="var(--color-ink)" />
      <rect x={px(0.295)} y={py(0.22)} width={w * 0.07} height={h * 0.08} rx={2} fill="var(--color-accent)" />
    </g>
  );
}

/** A screen: a rounded frame showing static, the scene, or static clearing from the left (clear = 0..1). */
export function Screen({
  x,
  y,
  w,
  h,
  clear = 1,
  seed = 7,
  cell = 8,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  clear?: number;
  seed?: number;
  cell?: number;
}) {
  const id = `screen-${x}-${y}-${w}-${h}-${seed}`;
  const cut = Math.round((w * clear) / cell) * cell;
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <rect x={x} y={y} width={w} height={h} rx={12} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <Scene x={x} y={y} w={w} h={h} />
        {clear < 1 ? <Static x={x + cut} y={y} w={w - cut} h={h} seed={seed} cell={cell} /> : null}
      </g>
    </g>
  );
}

/** The shot list: a clapperboard with a striped top and a few written lines. */
export function Clapper({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const top = h * 0.22;
  const stripes = [];
  for (let i = 0; i < 5; i++) {
    const sx = x + 10 + i * ((w - 20) / 5);
    stripes.push(
      <path key={i} d={`M${sx} ${y + top - 4}l${(w - 20) / 10} ${-(top - 8)}h${(w - 20) / 10}l${-(w - 20) / 10} ${top - 8}z`} fill="var(--color-page)" />
    );
  }
  return (
    <g>
      <rect x={x} y={y} width={w} height={top} rx={6} fill="var(--color-ink)" />
      {stripes}
      <rect x={x} y={y + top + 4} width={w} height={h - top - 4} rx={10} fill="var(--color-ink)" />
      {[0.42, 0.6, 0.78].map((f, i) => (
        <path key={f} d={`M${x + 14} ${y + h * f}H${x + w - 14 - i * 16}`} stroke="var(--color-page)" strokeWidth={3} strokeLinecap="round" opacity={0.7} />
      ))}
    </g>
  );
}

/** The model: a film camera. The one accent object in every figure. */
export function Camera({ cx, cy, s = 1 }: { cx: number; cy: number; s?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s})`}>
      <circle cx={-22} cy={-38} r={16} fill="var(--color-accent)" />
      <circle cx={14} cy={-38} r={16} fill="var(--color-accent)" />
      <circle cx={-22} cy={-38} r={6} fill="var(--color-page)" />
      <circle cx={14} cy={-38} r={6} fill="var(--color-page)" />
      <rect x={-42} y={-20} width={74} height={46} rx={10} fill="var(--color-accent)" />
      <path d="M32 -6l22 -12v42l-22 -12z" fill="var(--color-accent)" />
      <path d="M-6 26l-14 30M-6 26l14 30M-6 26v30" {...LINE} />
    </g>
  );
}

/** The director's chair. */
export function Chair({ cx, cy, s = 1 }: { cx: number; cy: number; s?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s})`}>
      <rect x={-34} y={-58} width={68} height={26} rx={6} fill="var(--color-ink)" />
      <rect x={-36} y={-6} width={72} height={12} rx={6} fill="var(--color-ink)" />
      <path d="M-30 -32V54M30 -32V54M-28 6L28 54M28 6L-28 54" stroke="var(--color-muted)" strokeWidth={4} strokeLinecap="round" />
    </g>
  );
}

/** A strip of film frames; `kinds` marks each frame as the scene, static, or a rejected take. */
export function FilmStrip({
  x,
  y,
  frameW,
  frameH,
  kinds,
  gap = 12,
}: {
  x: number;
  y: number;
  frameW: number;
  frameH: number;
  kinds: ("scene" | "static" | "reject")[];
  gap?: number;
}) {
  const w = kinds.length * (frameW + gap) + gap;
  const h = frameH + 32;
  const holes = [];
  for (let hx = x + 10; hx < x + w - 10; hx += 22) {
    holes.push(<rect key={`t${hx}`} x={hx} y={y + 5} width={10} height={6} rx={2} fill="var(--color-page)" />);
    holes.push(<rect key={`b${hx}`} x={hx} y={y + h - 11} width={10} height={6} rx={2} fill="var(--color-page)" />);
  }
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} fill="var(--color-ink)" />
      {holes}
      {kinds.map((kind, i) => {
        const fx = x + gap + i * (frameW + gap);
        const fy = y + 16;
        return (
          <g key={i} opacity={kind === "reject" ? 0.45 : 1}>
            <Screen x={fx} y={fy} w={frameW} h={frameH} clear={kind === "static" ? 0 : 1} seed={i + 3} cell={6} />
          </g>
        );
      })}
    </g>
  );
}

/** A plain cross over a rejected take. */
export function Cross({ cx, cy, r = 14 }: { cx: number; cy: number; r?: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="var(--color-fill)" />
      <path d={`M${cx - r * 0.38} ${cy - r * 0.38}l${r * 0.76} ${r * 0.76}m0 ${-r * 0.76}l${-r * 0.76} ${r * 0.76}`} stroke="var(--color-ink)" strokeWidth={2.4} strokeLinecap="round" />
    </g>
  );
}

/** A green tick on the kept take. */
export function Tick({ cx, cy, r = 14 }: { cx: number; cy: number; r?: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="var(--color-good)" />
      <path d={`M${cx - r * 0.42} ${cy}l${r * 0.3} ${r * 0.3}l${r * 0.56} ${-r * 0.62}`} fill="none" stroke="var(--color-page)" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}
