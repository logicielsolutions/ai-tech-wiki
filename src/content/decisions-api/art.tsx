import { Arrow, Luna, Resume, Sheet } from "./cast";

/** Card art: a resume goes into Luna, which hands back an answer sheet shaded with odds. */
export default function Art({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" className={className} aria-hidden="true">
      <Resume x={34} y={84} w={96} h={132} />
      <Arrow x1={142} x2={164} y={150} />
      <Luna cx={202} cy={150} size={56} />
      <Arrow x1={240} x2={262} y={150} />
      <Sheet x={272} y={54} w={100} h={192} groups={[[0.88, 0.12], [0.2, 0.68, 0.12], [0.3, 0.7]]} />
    </svg>
  );
}
