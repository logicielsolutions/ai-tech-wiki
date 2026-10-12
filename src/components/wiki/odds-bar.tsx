/** One answer and how likely it is: a label, a track, and a fill whose width is the probability. */
export function OddsBar({ label, probability, strong = false }: { label: string; probability: number; strong?: boolean }) {
  const percent = Math.round(probability * 100);
  return (
    <div className="grid grid-cols-[6.5rem_minmax(0,1fr)_2.75rem] items-center gap-3 text-sm">
      <span className={strong ? "font-semibold" : "text-muted"}>{label}</span>
      <span className="h-2.5 overflow-hidden rounded-full bg-fill" aria-hidden="true">
        <span
          className={`block h-full rounded-full transition-[width] duration-500 ease-apple ${strong ? "bg-accent" : "bg-accent/45"}`}
          style={{ width: `${percent}%` }}
        />
      </span>
      <span className="text-right tabular-nums">{percent}%</span>
    </div>
  );
}
