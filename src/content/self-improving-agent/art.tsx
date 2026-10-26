import { Alarm, Building, Envelope, Fire, Handbook } from "./cast";

/** Card art: the accent handbook beside a building whose alarm catches a fake fire, and the sealed envelope of new buildings. */
export default function Art({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" className={className} aria-hidden="true">
      <Handbook x={52} y={96} w={84} edited />
      <Building cx={232} cy={176} w={124} />
      <Alarm cx={232} cy={148} r={11} state="ringing" />
      <Fire cx={268} cy={206} s={20} />
      <Envelope cx={334} cy={92} w={72} />
    </svg>
  );
}
