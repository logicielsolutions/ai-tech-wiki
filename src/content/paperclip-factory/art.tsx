import { Arrow } from "@/components/wiki/art-kit";
import { Crate, Fence, LoadingDoor, WorkOrder, Worker } from "./cast";

/** Card art: a signed work order goes into a fenced yard of workers; finished work waits at the loading door. */
export default function Art({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" className={className} aria-hidden="true">
      <WorkOrder x={30} y={100} s={0.86} />
      <Arrow x1={112} x2={134} y={150} />
      <Fence x={146} y={72} w={140} h={156} />
      <Worker cx={186} cy={140} s={0.82} />
      <Worker cx={248} cy={176} s={0.82} />
      <LoadingDoor x={300} y={104} s={0.74} />
      <Crate x={318} y={190} s={0.8} />
    </svg>
  );
}
