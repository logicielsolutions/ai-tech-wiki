import type { Entry } from "./types";
import { meta as decisionsApiMeta } from "./decisions-api/meta";
import DecisionsApiArt from "./decisions-api/art";
import DecisionsApiExplainer from "./decisions-api/explainer";
import DecisionsApiTech from "./decisions-api/tech";

/** The shared tag set. Add a tag only when none of these fit. */
export const TAGS = ["decisions", "evals", "llms", "rag", "agents"] as const;

export const entries: Entry[] = [
  { meta: decisionsApiMeta, Art: DecisionsApiArt, Explainer: DecisionsApiExplainer, Tech: DecisionsApiTech },
];

export function getEntry(slug: string): Entry | undefined {
  return entries.find((entry) => entry.meta.slug === slug);
}
