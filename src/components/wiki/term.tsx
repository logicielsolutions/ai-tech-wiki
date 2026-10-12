import { useId, type ReactNode } from "react";

/** A word with a plain-language definition on hover, focus or tap. */
export function Term({ children, def }: { children: ReactNode; def: string }) {
  const id = useId();
  return (
    <span className="group relative inline-block">
      <button
        type="button"
        aria-describedby={id}
        className="cursor-help underline decoration-muted decoration-dotted decoration-1 underline-offset-4"
      >
        {children}
      </button>
      <span
        id={id}
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-0 z-10 mb-2 hidden w-64 max-w-[80vw] rounded-xl bg-ink px-3 py-2 text-sm leading-snug font-normal text-page group-focus-within:block group-hover:block"
      >
        {def}
      </span>
    </span>
  );
}
