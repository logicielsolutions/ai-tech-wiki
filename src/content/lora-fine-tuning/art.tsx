import { Camera, Photo } from "./cast";

/** Card art: a camera with the accent lens clipped on, and the sharp photo it takes. */
export default function Art({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" className={className} aria-hidden="true">
      <Camera cx={160} cy={158} w={200} lens />
      <Photo x={282} y={176} w={86} mark="good" />
    </svg>
  );
}
