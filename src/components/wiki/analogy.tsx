import type { ReactNode } from "react";

/** The everyday comparison that opens a concept. */
export function Analogy({ children }: { children: ReactNode }) {
  return (
    <aside className="max-w-[68ch] rounded-[20px] bg-accent-tint px-6 py-5">
      <p className="mb-1 text-sm font-semibold text-accent">Think of it like this</p>
      <div className="flex flex-col gap-3">{children}</div>
    </aside>
  );
}
