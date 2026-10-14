/**
 * The entry's cast, drawn once and reused by the card, the hero and every step figure. The metaphor is a
 * standard power socket: Mira wires one socket, and every assistant's plug fits it unchanged. The accent is
 * the socket itself — the one thing this entry is about. Passes expire, doors can be closed, and a call row
 * is either visible to you or it is not there at all.
 */

export { Arrow, Label, Person } from "@/components/wiki/art-kit";

const LINE = { strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const THIN = { strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

/** The socket Mira wires once: a face plate with two slots and an earth hole. Accent — this is the subject. */
export function Socket({ x, y, w = 120, h = 120, live = true }: { x: number; y: number; w?: number; h?: number; live?: boolean }) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  const s = w / 120;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={16 * s} fill={live ? "var(--color-accent)" : "var(--color-fill)"} />
      <rect x={cx - 20 * s} y={cy - 26 * s} width={9 * s} height={26 * s} rx={4.5 * s} fill="var(--color-page)" />
      <rect x={cx + 11 * s} y={cy - 26 * s} width={9 * s} height={26 * s} rx={4.5 * s} fill="var(--color-page)" />
      <circle cx={cx} cy={cy + 22 * s} r={7 * s} fill="var(--color-page)" />
    </g>
  );
}

/** An assistant's plug: a body, two prongs facing right, and a cable trailing left. */
export function Plug({ x, y, w = 92, h = 58, dim = false }: { x: number; y: number; w?: number; h?: number; dim?: boolean }) {
  const body = w - 22;
  const cy = y + h / 2;
  const fill = dim ? "var(--color-fill)" : "var(--color-ink)";
  return (
    <g opacity={dim ? 0.55 : 1}>
      <path
        d={`M${x - 26} ${cy}q-14 0 -14 -16`}
        fill="none"
        stroke="var(--color-muted)"
        {...LINE}
      />
      <rect x={x - 26} y={cy - 5} width={30} height={10} rx={5} fill="var(--color-muted)" />
      <rect x={x} y={y} width={body} height={h} rx={14} fill={fill} />
      <rect x={x + body} y={cy - 19} width={24} height={9} rx={4.5} fill={fill} />
      <rect x={x + body} y={cy + 10} width={24} height={9} rx={4.5} fill={fill} />
    </g>
  );
}

/** A window: the web app, or an assistant. Rounded rect, title bar dot, and text lines. */
export function Window({
  x,
  y,
  w,
  h,
  lines = 3,
  accentBar = false,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  lines?: number;
  accentBar?: boolean;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={16} fill="var(--color-page)" />
      <circle cx={x + 18} cy={y + 18} r={5} fill="var(--color-fill)" />
      {accentBar ? <rect x={x + 34} y={y + 11} width={w - 54} height={14} rx={7} fill="var(--color-accent-tint)" /> : null}
      {Array.from({ length: lines }, (_, i) => (
        <rect
          key={i}
          x={x + 18}
          y={y + 42 + i * 18}
          width={(w - 36) * (i % 3 === 2 ? 0.55 : i % 2 ? 0.82 : 1)}
          height={7}
          rx={3.5}
          fill="var(--color-fill)"
        />
      ))}
    </g>
  );
}

/** A closed door with a note pinned to it: the refusal that says where to go and ask. */
export function DoorWithNote({ x, y, w = 150, h = 216 }: { x: number; y: number; w?: number; h?: number }) {
  const noteW = w - 40;
  return (
    <g>
      {/* frame, so it reads as a doorway rather than a card */}
      <rect x={x - 12} y={y - 12} width={w + 24} height={h + 12} rx={16} fill="var(--color-fill)" />
      <rect x={x} y={y} width={w} height={h} rx={10} fill="var(--color-surface)" />
      <rect x={x + 6} y={y + 6} width={w - 12} height={h - 12} rx={6} fill="var(--color-page)" />
      <circle cx={x + w - 18} cy={y + h / 2} r={6} fill="var(--color-muted)" />
      {/* the note: an accent line that says where to ask, and a second, quieter one */}
      <g>
        <rect x={x + 20} y={y + 40} width={noteW} height={74} rx={10} fill="var(--color-accent-tint)" />
        <circle cx={x + 20 + noteW / 2} cy={y + 40} r={5} fill="var(--color-accent)" />
        <rect x={x + 34} y={y + 62} width={noteW - 28} height={8} rx={4} fill="var(--color-accent)" />
        <rect x={x + 34} y={y + 80} width={(noteW - 28) * 0.64} height={8} rx={4} fill="var(--color-accent)" opacity={0.45} />
      </g>
    </g>
  );
}

/** A pass with a clock face: good for an hour, and only for the one socket it fits. */
export function Pass({ x, y, w = 150, h = 96, spent = false }: { x: number; y: number; w?: number; h?: number; spent?: boolean }) {
  return (
    <g opacity={spent ? 0.5 : 1}>
      <rect x={x} y={y} width={w} height={h} rx={14} fill={spent ? "var(--color-fill)" : "var(--color-accent-tint)"} />
      <circle cx={x + 30} cy={y + h / 2} r={17} fill="var(--color-page)" />
      <circle cx={x + 30} cy={y + h / 2} r={17} fill="none" stroke="var(--color-accent)" {...THIN} />
      <path
        d={`M${x + 30} ${y + h / 2 - 10}V${y + h / 2}h8`}
        fill="none"
        stroke="var(--color-accent)"
        {...THIN}
      />
      <rect x={x + 60} y={y + h / 2 - 15} width={w - 82} height={8} rx={4} fill="var(--color-accent)" />
      <rect x={x + 60} y={y + h / 2 + 3} width={(w - 82) * 0.6} height={8} rx={4} fill="var(--color-page)" />
    </g>
  );
}

/** A read-only tool: a rounded chip with an eye mark, never a pencil. */
export function ToolChip({ x, y, w = 132, h = 52 }: { x: number; y: number; w?: number; h?: number }) {
  const cy = y + h / 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={12} fill="var(--color-page)" />
      <path
        d={`M${x + 18} ${cy}q10 -11 20 0q-10 11 -20 0z`}
        fill="none"
        stroke="var(--color-accent)"
        {...THIN}
      />
      <circle cx={x + 28} cy={cy} r={3.5} fill="var(--color-accent)" />
      <rect x={x + 48} y={cy - 9} width={w - 68} height={7} rx={3.5} fill="var(--color-fill)" />
      <rect x={x + 48} y={cy + 2} width={(w - 68) * 0.6} height={7} rx={3.5} fill="var(--color-fill)" />
    </g>
  );
}

/** A quote pulled out of a call: speaker dot, a line of words, and the moment it was said. */
export function Snippet({ x, y, w, h = 58 }: { x: number; y: number; w: number; h?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={12} fill="var(--color-page)" />
      <rect x={x + 16} y={y + 14} width={6} height={h - 28} rx={3} fill="var(--color-accent)" />
      <rect x={x + 32} y={y + 16} width={(w - 52) * 0.86} height={7} rx={3.5} fill="var(--color-ink)" opacity={0.75} />
      <rect x={x + 32} y={y + 30} width={(w - 52) * 0.52} height={7} rx={3.5} fill="var(--color-fill)" />
    </g>
  );
}
