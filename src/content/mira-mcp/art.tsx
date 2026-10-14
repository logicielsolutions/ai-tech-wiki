import { Arrow, Plug, Socket } from "./cast";

/** Card art: three different assistants' plugs, one socket wired once, every plug fitting it unchanged. */
export default function Art({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" className={className} aria-hidden="true">
      <Plug x={44} y={42} />
      <Plug x={44} y={121} />
      <Plug x={44} y={200} />
      <Arrow x1={176} x2={224} y={70} />
      <Arrow x1={176} x2={224} y={150} />
      <Arrow x1={176} x2={224} y={229} />
      <Socket x={240} y={90} />
    </svg>
  );
}
