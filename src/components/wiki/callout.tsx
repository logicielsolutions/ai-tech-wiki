import type { ReactNode } from "react";

const LABELS = { note: "Note", limit: "Limit", warning: "Watch out" } as const;

/** A note, limit or warning set apart from the prose. */
export function Callout({ kind = "note", title, children }: { kind?: keyof typeof LABELS; title?: string; children: ReactNode }) {
  return (
    <aside className="max-w-[68ch] rounded-[20px] bg-surface px-6 py-5">
      <p className={`mb-1 text-sm font-semibold ${kind === "warning" ? "text-accent" : "text-muted"}`}>
        {title ?? LABELS[kind]}
      </p>
      <div className="flex flex-col gap-3">{children}</div>
    </aside>
  );
}
