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
import { meta as loraFineTuningMeta } from "./lora-fine-tuning/meta";
import LoraFineTuningArt from "./lora-fine-tuning/art";
import LoraFineTuningExplainer from "./lora-fine-tuning/explainer";
import LoraFineTuningTech from "./lora-fine-tuning/tech";
import { meta as paperclipFactoryMeta } from "./paperclip-factory/meta";
import PaperclipFactoryArt from "./paperclip-factory/art";
import PaperclipFactoryExplainer from "./paperclip-factory/explainer";
import PaperclipFactoryTech from "./paperclip-factory/tech";
import { meta as aiVideoMeta } from "./ai-video/meta";
import AiVideoArt from "./ai-video/art";
import AiVideoExplainer from "./ai-video/explainer";
import AiVideoTech from "./ai-video/tech";

/** The shared tag set. Add a tag only when none of these fit. */
export const TAGS = ["decisions", "evals", "llms", "rag", "agents", "mcp", "fine-tuning", "governance", "video"] as const;

export const entries: Entry[] = [
  { meta: decisionsApiMeta, Art: DecisionsApiArt, Explainer: DecisionsApiExplainer, Tech: DecisionsApiTech },
  { meta: evalsMeta, Art: EvalsArt, Explainer: EvalsExplainer, Tech: EvalsTech },
  { meta: miraMcpMeta, Art: MiraMcpArt, Explainer: MiraMcpExplainer, Tech: MiraMcpTech },
  { meta: loraFineTuningMeta, Art: LoraFineTuningArt, Explainer: LoraFineTuningExplainer, Tech: LoraFineTuningTech },
  { meta: paperclipFactoryMeta, Art: PaperclipFactoryArt, Explainer: PaperclipFactoryExplainer, Tech: PaperclipFactoryTech },
  { meta: aiVideoMeta, Art: AiVideoArt, Explainer: AiVideoExplainer, Tech: AiVideoTech },
];

export function getEntry(slug: string): Entry | undefined {
  return entries.find((entry) => entry.meta.slug === slug);
}
