import Link from "next/link";
import type { EntryMeta } from "@/content/types";
import type { View } from "./article";
import { ViewSwitch } from "./view-switch";

/** The same header on every entry page: breadcrumb, title, pitch, view pill, switch link. */
export function EntryHeader({ meta, view }: { meta: EntryMeta; view: View }) {
  const base = `/wiki/${meta.slug}`;
  return (
    <header className="flex flex-col gap-5 pb-16 pt-12 md:pb-20 md:pt-16">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-ink">
              Wiki
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            {view === "tech" ? (
              <Link href={base} className="hover:text-ink">
                {meta.title}
              </Link>
            ) : (
              <span aria-current="page">{meta.title}</span>
            )}
          </li>
          {view === "tech" ? (
            <>
              <li aria-hidden="true">/</li>
              <li aria-current="page">Tech</li>
            </>
          ) : null}
        </ol>
      </nav>
      <span className="w-fit rounded-full bg-accent-tint px-3 py-1 text-xs font-semibold text-accent">
        {view === "explainer" ? "Explainer" : "For engineers"}
      </span>
      <h1 className="max-w-[20ch] text-[clamp(2.5rem,6vw,3.5rem)] leading-[1.05] tracking-[-0.03em]">{meta.title}</h1>
      <p className="max-w-[40ch] text-[1.25rem] leading-snug tracking-[-0.01em] text-muted">{meta.pitch}</p>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
        {view === "explainer" ? (
          <ViewSwitch href={`${base}/tech`} label="Read the engineering view" />
        ) : (
          <ViewSwitch href={base} label="Back to the explainer" back />
        )}
        <span>Updated {meta.updated}</span>
      </div>
    </header>
  );
}
