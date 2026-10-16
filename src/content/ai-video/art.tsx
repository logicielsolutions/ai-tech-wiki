import { Camera, Clapper, Screen } from "./cast";

/** Card art: a shot list handed to a camera (the model), filming a frame that is half static, half a clear shot. */
export default function Art({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" className={className} aria-hidden="true">
      <Clapper x={34} y={112} w={92} h={84} />
      <Camera cx={186} cy={160} s={0.95} />
      <Screen x={240} y={92} w={136} h={112} clear={0.5} cell={8} />
    </svg>
  );
}
