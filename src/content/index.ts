import type { Entry } from "./types";
import { meta as decisionsApiMeta } from "./decisions-api/meta";
import DecisionsApiArt from "./decisions-api/art";
import DecisionsApiExplainer from "./decisions-api/explainer";
import DecisionsApiTech from "./decisions-api/tech";
import { meta as evalsMeta } from "./evals/meta";
import EvalsArt from "./evals/art";
import EvalsExplainer from "./evals/explainer";
import EvalsTech from "./evals/tech";
import { meta as miraMcpMeta } from "./mira-mcp/meta";
import MiraMcpArt from "./mira-mcp/art";
import MiraMcpExplainer from "./mira-mcp/explainer";
import MiraMcpTech from "./mira-mcp/tech";

/** The shared tag set. Add a tag only when none of these fit. */
export const TAGS = ["decisions", "evals", "llms", "rag", "agents", "mcp"] as const;

export const entries: Entry[] = [
  { meta: decisionsApiMeta, Art: DecisionsApiArt, Explainer: DecisionsApiExplainer, Tech: DecisionsApiTech },
  { meta: evalsMeta, Art: EvalsArt, Explainer: EvalsExplainer, Tech: EvalsTech },
  { meta: miraMcpMeta, Art: MiraMcpArt, Explainer: MiraMcpExplainer, Tech: MiraMcpTech },
];

export function getEntry(slug: string): Entry | undefined {
  return entries.find((entry) => entry.meta.slug === slug);
}
