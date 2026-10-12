import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Article, EntryHeader, PageShell } from "@/components/wiki";
import { entries, getEntry } from "@/content";

export function generateStaticParams() {
  return entries.map((entry) => ({ slug: entry.meta.slug }));
}

export async function generateMetadata({ params }: PageProps<"/wiki/[slug]/tech">): Promise<Metadata> {
  const entry = getEntry((await params).slug);
  return entry ? { title: `${entry.meta.title}: for engineers`, description: entry.meta.pitch } : {};
}

/**
 * Every known slug is prerendered, so these pages are static. Reading params at the top (allowed to block)
 * keeps a real 404 status for unknown slugs instead of a soft 404 streamed after a 200.
 */
export const instant = false;

export default async function TechPage({ params }: PageProps<"/wiki/[slug]/tech">) {
  const entry = getEntry((await params).slug);
  if (!entry) notFound();
  const { Tech: Body } = entry;
  return (
    <PageShell>
      <EntryHeader meta={entry.meta} view="tech" />
      <Article view="tech">
        <Body />
      </Article>
    </PageShell>
  );
}
