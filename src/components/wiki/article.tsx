import type { ReactNode } from "react";

export type View = "explainer" | "tech";

/** The body of an entry page: section spacing and body size differ per view. */
export function Article({ view, children }: { view: View; children: ReactNode }) {
  return (
    <article
      className={
        view === "explainer"
          ? "flex flex-col gap-28 pb-28 text-[1.0625rem]"
          : "flex flex-col gap-[4.5rem] pb-24 text-base"
      }
    >
      {children}
    </article>
  );
}
