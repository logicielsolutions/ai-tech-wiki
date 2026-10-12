import Link from "next/link";
import type { Entry } from "@/content/types";
import { Tag } from "./tag";

/** A tile on the list page: art, title, pitch, tags. */
export function EntryCard({ entry }: { entry: Entry }) {
  const { meta, Art } = entry;
  return (
    <Link
      href={`/wiki/${meta.slug}`}
      className="group flex flex-col overflow-hidden rounded-[20px] bg-surface transition-transform duration-300 ease-apple hover:scale-[1.015] active:scale-[0.98] active:duration-100"
    >
      <div className="aspect-[4/3]">
        <Art className="h-full w-full" />
      </div>
      <div className="flex flex-col gap-2 px-5 pb-5 pt-1">
        <h3 className="text-[1.25rem] leading-snug tracking-[-0.01em]">{meta.title}</h3>
        <p className="text-[0.9375rem] text-muted">{meta.pitch}</p>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {meta.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      </div>
    </Link>
  );
}
