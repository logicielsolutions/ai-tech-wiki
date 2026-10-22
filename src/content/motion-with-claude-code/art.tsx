import { Flipbook, RuleSheet } from "./cast";

/** Card art: the rules (the video as code) on the left, the flipbook they turn into on the right. */
export default function Art({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" className={className} aria-hidden="true">
      <RuleSheet x={24} y={74} w={150} h={152} rows={4} />
      <Flipbook x={206} y={92} w={146} h={116} />
    </svg>
  );
}
