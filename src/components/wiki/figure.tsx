import type { ReactNode } from "react";

/** A visual plus its visible caption. SVG children carry their own role="img" and aria-label. */
export function Figure({
  children,
  caption,
  scroll = false,
}: {
  children: ReactNode;
  caption: ReactNode;
  /** Let a wide diagram scroll sideways inside its tile on narrow screens instead of shrinking. */
  scroll?: boolean;
}) {
  return (
    <figure className="flex flex-col gap-3">
      <div className={`${scroll ? "overflow-x-auto" : "overflow-hidden"} rounded-[20px] bg-surface p-2 sm:p-4 md:p-8`}>{children}</div>
      <figcaption className="max-w-[68ch] px-1 text-sm tracking-[0.01em] text-muted">{caption}</figcaption>
    </figure>
  );
}
