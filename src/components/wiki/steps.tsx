import type { ReactNode } from "react";

export function Steps({ children }: { children: ReactNode }) {
  return <ol className="flex flex-col gap-14">{children}</ol>;
}

/** A numbered step: the words on one side, its figure on the other from md up. */
export function Step({ n, title, children, figure }: { n: number; title: string; children: ReactNode; figure: ReactNode }) {
  return (
    <li className="grid items-center gap-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-10">
      <div className="flex flex-col gap-3">
        <span
          aria-hidden="true"
          className="flex size-8 items-center justify-center rounded-full bg-accent text-sm font-semibold text-page"
        >
          {n}
        </span>
        <h3 className="text-[1.25rem] leading-snug tracking-[-0.01em]">
          <span className="sr-only">Step {n}: </span>
          {title}
        </h3>
        <div className="flex flex-col gap-3 text-muted [&_strong]:font-semibold [&_strong]:text-ink">{children}</div>
      </div>
      <div className="overflow-hidden rounded-[20px] bg-surface p-2 sm:p-4 md:p-6">{figure}</div>
    </li>
  );
}
