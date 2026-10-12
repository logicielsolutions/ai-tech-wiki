import type { ReactNode } from "react";

type Side = { title: string; children: ReactNode };

/** Two things side by side; stacks on mobile. */
export function Compare({ left, right }: { left: Side; right: Side }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {[left, right].map((side) => (
        <div key={side.title} className="flex flex-col gap-2 rounded-[20px] bg-surface px-6 py-5">
          <h3 className="text-[1.0625rem] tracking-[-0.01em]">{side.title}</h3>
          <div className="flex flex-col gap-3 text-muted">{side.children}</div>
        </div>
      ))}
    </div>
  );
}
