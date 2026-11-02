import { Artist, Net, Trapeze } from "./cast";

/** Card art: a trapeze artist on the bar, with the accent safety net stretched below. */
export default function Art({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" className={className} aria-hidden="true">
      <Trapeze cx={200} top={10} len={70} w={76} />
      <Artist cx={200} barY={80} />
      <Net x={60} y={222} w={280} sag={14} />
    </svg>
  );
}
