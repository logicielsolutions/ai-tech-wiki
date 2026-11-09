import { Car, JobBoard, Mechanic, Route } from "./cast";

/** Card art: the accent job board plans the work; its route leads to a mechanic and the broken car. */
export default function Art({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" className={className} aria-hidden="true">
      <JobBoard cx={84} cy={150} w={88} />
      <Route x1={138} y1={150} x2={172} y2={150} />
      <Mechanic cx={208} cy={150} />
      <Car cx={298} cy={238} w={150} broken />
    </svg>
  );
}
