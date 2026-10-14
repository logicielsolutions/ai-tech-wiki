export type PageIndexItem = {
  /** The id of a `Section` (or `SubHeading`) on the same page. */
  id: string;
  title: string;
  /** Optional sub-sections, for long sections with `SubHeading`s. */
  children?: { id: string; title: string }[];
};

/**
 * "On this page": the tech view's index, placed right after At a glance. Every entry links to an anchor on the
 * same page; sections and sub-headings already carry `scroll-mt` so the target clears the sticky top bar.
 */
export function PageIndex({ items }: { items: PageIndexItem[] }) {
  return (
    <nav aria-labelledby="page-index-title" className="rounded-[20px] bg-surface px-6 py-5">
      <h2 id="page-index-title" className="mb-3 text-sm font-semibold text-muted">
        On this page
      </h2>
      <ol className="gap-x-8 text-[0.9375rem] md:columns-2">
        {items.map((item, i) => (
          <li key={item.id} className="flex break-inside-avoid flex-col py-0.5">
            <a
              href={`#${item.id}`}
              className="flex items-baseline gap-3 rounded-xl px-2 py-1.5 transition-[background-color,transform] duration-200 hover:bg-page active:scale-[0.98] active:duration-100"
            >
              <span className="w-5 shrink-0 text-right text-sm text-muted tabular-nums">{i + 1}</span>
              <span className="font-medium text-accent">{item.title}</span>
            </a>
            {item.children?.length ? (
              <ol className="mb-1 flex flex-col pl-10">
                {item.children.map((child) => (
                  <li key={child.id}>
                    <a
                      href={`#${child.id}`}
                      className="block rounded-lg px-2 py-1 text-sm text-muted transition-[background-color,color] duration-200 hover:bg-page hover:text-ink"
                    >
                      {child.title}
                    </a>
                  </li>
                ))}
              </ol>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
