import type { ReactNode } from "react";

/** One idea per section: a heading, prose, and (on the explainer) one visual. */
export function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="flex scroll-mt-20 flex-col gap-6">
      <h2 id={`${id}-title`} className="max-w-[68ch] text-[1.75rem] leading-[1.15] tracking-[-0.02em]">
        {title}
      </h2>
      {children}
    </section>
  );
}

/** The 68ch reading column. */
export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="flex max-w-[68ch] flex-col gap-4 [&_a]:text-accent [&_a:hover]:underline [&_strong]:font-semibold">
      {children}
    </div>
  );
}

/** A sub-heading inside a long section (tech view), with its own anchor. */
export function SubHeading({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h3 id={id} className="mt-6 max-w-[68ch] scroll-mt-20 text-[1.25rem] leading-snug tracking-[-0.01em]">
      {children}
    </h3>
  );
}

/** A plain bulleted list, for use inside Prose. */
export function BulletList({ children }: { children: ReactNode }) {
  return <ul className="flex list-disc flex-col gap-2 pl-5">{children}</ul>;
}
