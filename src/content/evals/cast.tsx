/**
 * The entry's cast, drawn once and reused by the card, the hero and every step figure. The metaphor is a school
 * exam: an answer key, an exam paper, a teacher who grades, an open book (the pages the AI read), a report card,
 * and a flight recorder once the AI is live. The accent is the grading itself: the marks and the scores.
 */

export { Arrow, Label, Person } from "@/components/wiki/art-kit";

const LINE = { stroke: "var(--color-muted)", strokeWidth: 2, strokeLinecap: "round" } as const;

export type MarkKind = "pass" | "fail" | "refused" | "blank";

/** A grade mark: a green tick for pass, a plain cross for fail, an accent ring with a dash for a correct refusal. */
export function Mark({ cx, cy, kind, r = 11 }: { cx: number; cy: number; kind: MarkKind; r?: number }) {
  const s = r / 11;
  if (kind === "blank") return <circle cx={cx} cy={cy} r={r} fill="var(--color-fill)" />;
  if (kind === "pass")
    return (
      <g>
        <circle cx={cx} cy={cy} r={r} fill="var(--color-good)" />
        <path
          d={`M${cx - 5 * s} ${cy}l${3.5 * s} ${3.5 * s}l${6.5 * s} ${-7 * s}`}
          fill="none"
          stroke="var(--color-page)"
          strokeWidth={2.5 * Math.min(1.2, s)}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    );
  if (kind === "fail")
    return (
      <g>
        <circle cx={cx} cy={cy} r={r} fill="var(--color-fill)" />
        <path
          d={`M${cx - 4 * s} ${cy - 4 * s}l${8 * s} ${8 * s}m0 ${-8 * s}l${-8 * s} ${8 * s}`}
          stroke="var(--color-ink)"
          strokeWidth={2.2 * Math.min(1.2, s)}
          strokeLinecap="round"
        />
      </g>
    );
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="var(--color-accent-tint)" />
      <circle cx={cx} cy={cy} r={r - 1.5 * s} fill="none" stroke="var(--color-accent)" strokeWidth={2 * Math.min(1.2, s)} />
      <path d={`M${cx - 4.5 * s} ${cy}h${9 * s}`} stroke="var(--color-accent)" strokeWidth={2.5 * Math.min(1.2, s)} strokeLinecap="round" />
    </g>
  );
}

/** The exam paper: a page of answered questions, one row each, with a grade mark at the right. */
export function Paper({ x, y, w, h, marks }: { x: number; y: number; w: number; h: number; marks: MarkKind[] }) {
  const pad = 18;
  const rowH = (h - pad * 2 - 18) / marks.length;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={14} fill="var(--color-page)" />
      <path d={`M${x + pad} ${y + pad + 4}h${w * 0.36}`} {...LINE} stroke="var(--color-ink)" />
      {marks.map((kind, i) => {
        const top = y + pad + 22 + i * rowH;
        return (
          <g key={i}>
            <path d={`M${x + pad} ${top + rowH * 0.32}h${(w - pad * 2 - 34) * 0.9}`} {...LINE} strokeWidth={1.5} />
            <path d={`M${x + pad} ${top + rowH * 0.62}h${(w - pad * 2 - 34) * (i % 2 ? 0.55 : 0.75)}`} {...LINE} strokeWidth={1.5} />
            <Mark cx={x + w - pad - 10} cy={top + rowH * 0.47} kind={kind} r={Math.min(11, rowH * 0.32)} />
          </g>
        );
      })}
    </g>
  );
}

/** The answer key: a card with a key glyph and the facts a good answer must mention. */
export function AnswerKey({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const pad = 16;
  const rows = Math.max(2, Math.floor((h - 52) / 18));
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={14} fill="var(--color-fill)" />
      <circle cx={x + pad + 8} cy={y + pad + 8} r={7} fill="none" stroke="var(--color-ink)" strokeWidth={2} />
      <path d={`M${x + pad + 15} ${y + pad + 8}h${16}m-5 0v5m-5 -5v4`} stroke="var(--color-ink)" strokeWidth={2} strokeLinecap="round" fill="none" />
      {Array.from({ length: rows }, (_, i) => (
        <g key={i}>
          <circle cx={x + pad + 3} cy={y + 46 + i * 18} r={3} fill="var(--color-muted)" />
          <path d={`M${x + pad + 13} ${y + 46 + i * 18}h${(w - pad * 2 - 13) * (i % 3 === 2 ? 0.55 : 0.85)}`} {...LINE} strokeWidth={1.5} />
        </g>
      ))}
    </g>
  );
}

/** The teacher who grades: a person holding an accent pen. */
export function Teacher({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy - 26} r={16} fill="var(--color-fill)" />
      <path d={`M${cx - 30} ${cy + 30}a30 30 0 0 1 60 0z`} fill="var(--color-fill)" />
      <rect x={cx + 22} y={cy - 22} width={8} height={40} rx={4} fill="var(--color-accent)" transform={`rotate(32 ${cx + 26} ${cy - 2})`} />
    </g>
  );
}

/** An open book: two pages of lines; `highlight` marks the passage the AI used. */
export function Book({ x, y, w, h, highlight = true }: { x: number; y: number; w: number; h: number; highlight?: boolean }) {
  const half = w / 2;
  const pad = 14;
  return (
    <g>
      <rect x={x} y={y} width={half - 2} height={h} rx={12} fill="var(--color-page)" />
      <rect x={x + half + 2} y={y} width={half - 2} height={h} rx={12} fill="var(--color-page)" />
      {highlight ? <rect x={x + half + 8} y={y + h * 0.4 - 8} width={half - 16} height={30} rx={6} fill="var(--color-accent-tint)" /> : null}
      {[0.18, 0.32, 0.46, 0.6, 0.74].map((t, i) => (
        <g key={t}>
          <path d={`M${x + pad} ${y + h * t}h${(half - pad * 2) * (i % 2 ? 0.7 : 1)}`} {...LINE} strokeWidth={1.5} />
          <path d={`M${x + half + pad} ${y + h * t}h${(half - pad * 2) * (i % 2 ? 0.8 : 1)}`} {...LINE} strokeWidth={1.5} />
        </g>
      ))}
    </g>
  );
}

/** A speech bubble with lines of text: what the AI says. */
export function Bubble({ x, y, w, h, lines = 3 }: { x: number; y: number; w: number; h: number; lines?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={16} fill="var(--color-page)" />
      <path d={`M${x + 28} ${y + h}l-6 14l18 -14z`} fill="var(--color-page)" />
      {Array.from({ length: lines }, (_, i) => (
        <path
          key={i}
          d={`M${x + 18} ${y + 22 + i * ((h - 36) / Math.max(1, lines - 1))}h${(w - 36) * (i === lines - 1 ? 0.6 : 1)}`}
          {...LINE}
          strokeWidth={1.5}
        />
      ))}
    </g>
  );
}

/** A horizontal score bar: a track and a fill. `faded` draws the fill lighter. */
export function ScoreBar({ x, y, w, value, h = 10, faded = false, tone = "accent" }: { x: number; y: number; w: number; value: number; h?: number; faded?: boolean; tone?: "accent" | "muted" }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={h / 2} fill="var(--color-fill)" />
      <rect
        x={x}
        y={y}
        width={Math.max(h, w * value)}
        height={h}
        rx={h / 2}
        fill={tone === "accent" ? "var(--color-accent)" : "var(--color-muted)"}
        opacity={faded ? 0.45 : 1}
      />
    </g>
  );
}

/** The flight recorder: a rounded box with a trace line and an accent "recording" dot. */
export function Recorder({ x, y, w = 96, h = 64 }: { x: number; y: number; w?: number; h?: number }) {
  const mid = y + h / 2 + 4;
  const step = (w - 32) / 8;
  const wave = [0, -8, 6, -12, 10, -4, 8, -6, 0].map((dy, i) => `${i ? "L" : "M"}${x + 16 + i * step} ${mid + dy}`).join(" ");
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={14} fill="var(--color-ink)" />
      <circle cx={x + w - 14} cy={y + 13} r={4.5} fill="var(--color-accent)" />
      <path d={wave} fill="none" stroke="var(--color-page)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" opacity={0.85} />
    </g>
  );
}
