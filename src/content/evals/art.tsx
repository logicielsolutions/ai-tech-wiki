import { AnswerKey, Paper, Recorder } from "./cast";

/** Card art: an exam paper graded against an answer key, one trick question correctly refused, and a flight recorder for after launch. */
export default function Art({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" className={className} aria-hidden="true">
      <AnswerKey x={40} y={70} w={120} h={150} />
      <Paper x={140} y={44} w={150} h={212} marks={["pass", "pass", "refused", "fail", "pass"]} />
      <Recorder x={276} y={196} w={92} h={60} />
    </svg>
  );
}
