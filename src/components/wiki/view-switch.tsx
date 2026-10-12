import Link from "next/link";

/** The link between an entry's explainer and its tech page. */
export function ViewSwitch({ href, label, back = false }: { href: string; label: string; back?: boolean }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-page transition-transform duration-100 active:scale-[0.97]"
    >
      {back ? <span aria-hidden="true">‹</span> : null}
      {label}
      {back ? null : <span aria-hidden="true">›</span>}
    </Link>
  );
}
