import { EntryCard, PageShell } from "@/components/wiki";
import { entries } from "@/content";

export default function Home() {
  return (
    <PageShell>
      <header className="flex flex-col gap-4 pb-14 pt-16 md:pb-16 md:pt-24">
        <h1 className="text-[clamp(2.5rem,6vw,3.5rem)] leading-[1.05] tracking-[-0.03em]">AI Tech Wiki</h1>
        <p className="max-w-[44ch] text-[1.25rem] leading-snug tracking-[-0.01em] text-muted">
          Our AI experiments and projects, explained twice: once for anyone, once for engineers.
        </p>
      </header>
      <ul className="grid gap-5 pb-24 md:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry) => (
          <li key={entry.meta.slug} className="flex">
            <EntryCard entry={entry} />
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
