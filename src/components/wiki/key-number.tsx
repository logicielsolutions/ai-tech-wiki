import type { ReactNode } from "react";

export function KeyNumbers({ children }: { children: ReactNode }) {
  return <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{children}</dl>;
}

/** One headline number with a short label. */
export function KeyNumber({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col-reverse gap-1 rounded-[20px] bg-surface px-5 py-4">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-[2rem] font-semibold leading-none tracking-[-0.025em] text-accent tabular-nums">{value}</dd>
    </div>
  );
}
