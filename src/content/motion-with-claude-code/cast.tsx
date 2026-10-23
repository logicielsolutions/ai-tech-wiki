/**
 * The entry's cast, drawn once and reused by the card, the hero and every step figure. The metaphor is a flipbook:
 * Claude writes the rules for every page (the video as code; the accent), the renderer draws each page from those
 * rules and flips through them, and the motion comes out as a video. Same rules, same pages, every time.
 */

export { Arrow, Label, Person } from "@/components/wiki/art-kit";

const LINE = { stroke: "var(--color-muted)", strokeWidth: 1.5, strokeLinecap: "round" } as const;

/** Lengths of the text line on each rule row, fixed so every rule sheet looks the same. */
const ROW_LENGTHS = [0.82, 0.6, 0.74, 0.52, 0.68];

/**
 * The rules: a sheet where each row starts with an accent time chip ("at 0s", "at 3s") followed by a line of text.
 * `highlight` tints one row (0-based) to show "this is the rule that changed".
 */
export function RuleSheet({ x, y, w, h, rows = 4, highlight }: { x: number; y: number; w: number; h: number; rows?: number; highlight?: number }) {
  const pad = Math.max(12, w * 0.08);
  const rowH = (h - pad * 2) / rows;
  const chipW = w * 0.18;
  const chipH = Math.min(14, rowH * 0.42);
  const lineStart = x + pad + chipW + 10;
  const lineMax = x + w - pad - lineStart;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={14} fill="var(--color-page)" />
      {Array.from({ length: rows }, (_, i) => {
        const cy = y + pad + rowH * (i + 0.5);
        return (
          <g key={i}>
            {highlight === i ? (
              <rect x={x + pad * 0.5} y={cy - rowH * 0.42} width={w - pad} height={rowH * 0.84} rx={8} fill="var(--color-accent-tint)" />
            ) : null}
            <rect x={x + pad} y={cy - chipH / 2} width={chipW} height={chipH} rx={chipH / 2} fill="var(--color-accent)" />
            <path d={`M${lineStart} ${cy}H${lineStart + lineMax * ROW_LENGTHS[i % ROW_LENGTHS.length]}`} stroke="var(--color-muted)" strokeWidth={Math.max(2.5, chipH * 0.32)} strokeLinecap="round" />
          </g>
        );
      })}
    </g>
  );
}

/**
 * One flipbook page: a paper page with a small drawing. `t` (0..1) is how far into the video the page sits: the title
 * grows, the bar fills and the dot travels left to right, so a row of pages reads as motion.
 */
export function Page({ x, y, w, h, t, mark = false }: { x: number; y: number; w: number; h: number; t: number; mark?: boolean }) {
  const inner = w - 16;
  const r = Math.min(w, h) * 0.09;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill="var(--color-page)" />
      <rect x={x + 8} y={y + h * 0.2} width={inner * (0.3 + 0.5 * Math.min(1, t * 1.6))} height={h * 0.11} rx={3} fill="var(--color-ink)" opacity={Math.min(1, 0.25 + t * 1.4)} />
      <rect x={x + 8} y={y + h * 0.44} width={inner * t} height={h * 0.1} rx={3} fill="var(--color-accent)" />
      <circle cx={x + 8 + r + (inner - r * 2) * t} cy={y + h * 0.74} r={r} fill="var(--color-fill)" />
      {mark ? <circle cx={x + w - 9} cy={y + 9} r={4} fill="var(--color-good)" /> : null}
    </g>
  );
}

/** A row of flipbook pages laid out side by side: the video, page by page. */
export function PageRow({ x, y, w, h, count = 4, mark = false, faded = false }: { x: number; y: number; w: number; h: number; count?: number; mark?: boolean; faded?: boolean }) {
  const gap = 8;
  const pw = (w - gap * (count - 1)) / count;
  return (
    <g opacity={faded ? 0.55 : 1}>
      {Array.from({ length: count }, (_, i) => (
        <Page key={i} x={x + i * (pw + gap)} y={y} w={pw} h={h} t={faded ? [0.7, 0.2, 0.9, 0.4][i % 4] : (i + 1) / count} mark={mark && i === count - 1} />
      ))}
    </g>
  );
}

/** The flipbook: a stack of pages bound on the left, the top pages fanned up as they flip, with two motion lines. */
export function Flipbook({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const bind = w * 0.12;
  const px = x + bind;
  const pw = w - bind;
  return (
    <g>
      {[3, 2, 1].map((i) => (
        <rect key={i} x={px + i * 3} y={y + i * 4} width={pw - i * 3} height={h - i * 2} rx={8} fill="var(--color-fill)" />
      ))}
      <g transform={`rotate(-24 ${px} ${y + h})`}>
        <rect x={px} y={y} width={pw} height={h} rx={8} fill="var(--color-fill)" />
      </g>
      <g transform={`rotate(-12 ${px} ${y + h})`}>
        <rect x={px - 1} y={y - 1} width={pw + 2} height={h + 2} rx={9} fill="var(--color-fill)" />
        <Page x={px} y={y} w={pw} h={h} t={0.3} />
      </g>
      <rect x={px - 1} y={y - 1} width={pw + 2} height={h + 2} rx={9} fill="var(--color-fill)" />
      <Page x={px} y={y} w={pw} h={h} t={0.6} />
      <rect x={x} y={y - 2} width={bind + 4} height={h + 10} rx={6} fill="var(--color-ink)" />
      {[0, 1].map((i) => (
        <path
          key={i}
          d={`M${x + w + 10 + i * 10} ${y + h * 0.15}a${h * 0.4} ${h * 0.4} 0 0 1 0 ${h * 0.5}`}
          fill="none"
          {...LINE}
          strokeWidth={2}
        />
      ))}
    </g>
  );
}

/** A stack of hand-drawn pages with scribbled-out drawings and a pencil: redrawing every page by hand. */
export function RedrawStack({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      {[2, 1].map((i) => (
        <rect key={i} x={x + i * 10} y={y - i * 10} width={w} height={h} rx={10} fill="var(--color-fill)" />
      ))}
      <rect x={x} y={y} width={w} height={h} rx={10} fill="var(--color-page)" />
      <path
        d={`M${x + w * 0.15} ${y + h * 0.3}l${w * 0.12} ${h * 0.2}l${w * 0.12} ${-h * 0.2}l${w * 0.12} ${h * 0.2}l${w * 0.12} ${-h * 0.2}l${w * 0.12} ${h * 0.2}`}
        fill="none"
        {...LINE}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <path d={`M${x + w * 0.15} ${y + h * 0.72}H${x + w * 0.6}`} {...LINE} strokeWidth={2} />
      <g transform={`rotate(35 ${x + w * 0.8} ${y + h * 0.7})`}>
        <rect x={x + w * 0.8 - 7} y={y + h * 0.7 - h * 0.6} width={14} height={h * 0.6} rx={3} fill="var(--color-muted)" />
        <path d={`M${x + w * 0.8 - 7} ${y + h * 0.7}l7 14l7 -14z`} fill="var(--color-ink)" />
      </g>
    </g>
  );
}

/** A speech bubble with a few text lines and a row of time ticks: the request you give Claude. */
export function Request({ x, y, w, h, ticks = true, vague = false }: { x: number; y: number; w: number; h: number; ticks?: boolean; vague?: boolean }) {
  const lines = vague ? [0.55] : [0.8, 0.62, 0.72];
  return (
    <g>
      <path d={`M${x + 14} ${y}H${x + w - 14}a14 14 0 0 1 14 14V${y + h - 14}a14 14 0 0 1 -14 14H${x + 46}l-18 16v-16H${x + 14}a14 14 0 0 1 -14 -14V${y + 14}a14 14 0 0 1 14 -14z`} fill="var(--color-page)" />
      {lines.map((f, i) => (
        <path key={i} d={`M${x + 18} ${y + 24 + i * 16}H${x + 18 + (w - 36) * f}`} stroke="var(--color-muted)" strokeWidth={3} strokeLinecap="round" />
      ))}
      {ticks && !vague ? (
        <g>
          <path d={`M${x + 18} ${y + h - 18}H${x + w - 18}`} {...LINE} />
          {[0, 0.38, 0.62, 1].map((f) => (
            <circle key={f} cx={x + 18 + (w - 36) * f} cy={y + h - 18} r={4} fill="var(--color-accent)" />
          ))}
        </g>
      ) : null}
    </g>
  );
}

/** A preview screen showing one page of the video and a timeline; `pin` (0..1) drops a comment marker on the timeline. */
export function Preview({ x, y, w, h, pin }: { x: number; y: number; w: number; h: number; pin?: number }) {
  const sh = h - 34;
  const tl = { x1: x + 14, x2: x + w - 14, y: y + h - 14 };
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={14} fill="var(--color-fill)" />
      <Page x={x + 10} y={y + 10} w={w - 20} h={sh - 10} t={0.55} />
      <path d={`M${tl.x1} ${tl.y}H${tl.x2}`} stroke="var(--color-page)" strokeWidth={4} strokeLinecap="round" />
      <path d={`M${tl.x1} ${tl.y}H${tl.x1 + (tl.x2 - tl.x1) * 0.55}`} stroke="var(--color-muted)" strokeWidth={4} strokeLinecap="round" />
      {pin !== undefined ? (
        <g>
          <circle cx={tl.x1 + (tl.x2 - tl.x1) * pin} cy={tl.y} r={7} fill="var(--color-accent)" />
          <path d={`M${tl.x1 + (tl.x2 - tl.x1) * pin} ${tl.y - 7}V${tl.y - 22}`} stroke="var(--color-accent)" strokeWidth={2} strokeLinecap="round" />
        </g>
      ) : null}
    </g>
  );
}

/** A finished video file: a page with a folded corner and a play triangle. */
export function VideoFile({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const w = 56 * s;
  const h = 70 * s;
  const f = 14 * s;
  return (
    <g>
      <path d={`M${x + 10 * s} ${y}H${x + w - f}L${x + w} ${y + f}V${y + h - 10 * s}a${10 * s} ${10 * s} 0 0 1 ${-10 * s} ${10 * s}H${x + 10 * s}a${10 * s} ${10 * s} 0 0 1 ${-10 * s} ${-10 * s}V${y + 10 * s}a${10 * s} ${10 * s} 0 0 1 ${10 * s} ${-10 * s}z`} fill="var(--color-fill)" />
      <path d={`M${x + w * 0.38} ${y + h * 0.36}L${x + w * 0.68} ${y + h * 0.52}L${x + w * 0.38} ${y + h * 0.68}z`} fill="var(--color-ink)" strokeLinejoin="round" />
    </g>
  );
}

/** A green check mark in a circle: "matches" / "approved". */
export function Check({ cx, cy, r = 12 }: { cx: number; cy: number; r?: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="var(--color-good)" />
      <path d={`M${cx - r * 0.45} ${cy}l${r * 0.32} ${r * 0.32}l${r * 0.62} ${-r * 0.62}`} fill="none" stroke="var(--color-page)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

/** A link chip: two chain loops, for "a shareable link". */
export function LinkChip({ x, y, w = 120 }: { x: number; y: number; w?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={36} rx={18} fill="var(--color-page)" />
      <rect x={x + 14} y={y + 12} width={20} height={12} rx={6} fill="none" stroke="var(--color-ink)" strokeWidth={2} />
      <rect x={x + 26} y={y + 12} width={20} height={12} rx={6} fill="none" stroke="var(--color-ink)" strokeWidth={2} />
      <path d={`M${x + 56} ${y + 18}H${x + w - 16}`} stroke="var(--color-muted)" strokeWidth={3} strokeLinecap="round" />
    </g>
  );
}
