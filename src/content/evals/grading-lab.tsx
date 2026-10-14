"use client";

import { useState } from "react";

/**
 * Example answers to a made-up shop assistant, graded the way the real pipeline does it: a stricter AI marks the
 * answer against the key, and four scores combine into one overall score by harmonic mean, so the weakest score
 * drags the rest down. Every number here is an example baked into the page; nothing calls a model.
 */

type ScoreKey = "madeUp" | "sticks" | "useful" | "found";

const SCORES: { key: ScoreKey; label: string; hint: string }[] = [
  { key: "madeUp", label: "Nothing made up", hint: "Every claim can be found in what it read." },
  { key: "sticks", label: "Sticks to the pages", hint: "How much of the answer the pages it read actually support." },
  { key: "useful", label: "Only useful pages", hint: "How much of what it read was needed for this answer." },
  { key: "found", label: "Found the right pages", hint: "How much of what the answer needed was in what it read." },
];

type Example = {
  id: string;
  tab: string;
  question: string;
  answer: string;
  key: string;
  verdict: "Pass" | "Fail";
  reason: string;
  /** null when the four scores don't apply: a correct refusal has no claims to check. */
  scores: Record<ScoreKey, number> | null;
};

const EXAMPLES: Example[] = [
  {
    id: "right",
    tab: "A correct answer",
    question: "Can I return headphones after a month?",
    answer: "Yes. You have 45 days to return them with the receipt. After that, you can get store credit instead.",
    key: "Returns within 45 days with a receipt. After 45 days: store credit only.",
    verdict: "Pass",
    reason: "Mentions both facts on the key and adds nothing that isn't in the policy.",
    scores: { madeUp: 1, sticks: 0.95, useful: 0.85, found: 0.9 },
  },
  {
    id: "invented",
    tab: "One invented detail",
    question: "Can I return headphones after a month?",
    answer: "Yes. You have 45 days to return them with the receipt, and we'll cover the return shipping too.",
    key: "Returns within 45 days with a receipt. After 45 days: store credit only.",
    verdict: "Fail",
    reason: "Free return shipping isn't in the policy. It sounds helpful, and it's made up.",
    scores: { madeUp: 0.45, sticks: 0.6, useful: 0.85, found: 0.9 },
  },
  {
    id: "refusal",
    tab: "A trick question",
    question: "What will the weather be in Paris tomorrow?",
    answer: "I can only help with questions about the shop's policies, so I can't answer that one.",
    key: "Out of scope. The right answer is to decline.",
    verdict: "Pass",
    reason: "Declined a question it has no pages for. Answering confidently would have failed, even with a correct forecast.",
    scores: null,
  },
];

/** The same rule as the real code: harmonic mean; any score at 0 makes the whole thing 0. */
function overall(scores: Record<ScoreKey, number>) {
  const values = SCORES.map(({ key }) => scores[key]);
  if (values.some((v) => v <= 0)) return 0;
  return values.length / values.reduce((sum, v) => sum + 1 / v, 0);
}

function average(scores: Record<ScoreKey, number>) {
  const values = SCORES.map(({ key }) => scores[key]);
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

const pct = (v: number) => Math.round(v * 100);

export function GradingLab() {
  const [exampleId, setExampleId] = useState(EXAMPLES[0].id);
  const [overrides, setOverrides] = useState<Record<string, Record<ScoreKey, number>>>({});
  const example = EXAMPLES.find((e) => e.id === exampleId) ?? EXAMPLES[0];
  const scores = example.scores ? (overrides[example.id] ?? example.scores) : null;
  const weakest = scores ? SCORES.reduce((low, s) => (scores[s.key] < scores[low.key] ? s : low), SCORES[0]).key : null;

  function setScore(key: ScoreKey, value: number) {
    if (!scores) return;
    setOverrides((current) => ({ ...current, [example.id]: { ...scores, [key]: value } }));
  }

  return (
    <div className="flex flex-col gap-6">
      <div role="tablist" aria-label="Example answers" className="flex flex-wrap gap-2">
        {EXAMPLES.map((e) => {
          const active = e.id === example.id;
          return (
            <button
              key={e.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setExampleId(e.id)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-[background-color,color,transform] duration-200 active:scale-[0.98] active:duration-100 ${
                active ? "bg-accent text-page" : "bg-surface text-ink"
              }`}
            >
              {e.tab}
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
        <section aria-labelledby="lab-paper" className="flex flex-col gap-3 rounded-[20px] bg-surface p-4 md:p-5">
          <h3 id="lab-paper" className="px-1 text-[1.0625rem] tracking-[-0.01em]">
            The exam row
          </h3>
          <div className="flex flex-col gap-1 rounded-2xl bg-page p-4">
            <p className="text-xs font-semibold text-muted">Question</p>
            <p className="text-[0.9375rem] leading-snug">{example.question}</p>
          </div>
          <div className="flex flex-col gap-1 rounded-2xl bg-page p-4">
            <p className="text-xs font-semibold text-muted">The AI&apos;s answer</p>
            <p className="text-[0.9375rem] leading-snug">{example.answer}</p>
          </div>
          <div className="flex flex-col gap-1 rounded-2xl bg-page p-4">
            <p className="text-xs font-semibold text-muted">Answer key</p>
            <p className="text-[0.9375rem] leading-snug">{example.key}</p>
          </div>
          <div aria-live="polite" className="flex items-start gap-3 rounded-2xl bg-page p-4">
            <span
              className={`mt-0.5 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                example.verdict === "Pass" ? "bg-accent-tint text-accent" : "bg-fill text-ink"
              }`}
            >
              {example.verdict}
            </span>
            <p className="text-[0.9375rem] leading-snug text-muted">
              <span className="font-semibold text-ink">Grader: </span>
              {example.reason}
            </p>
          </div>
        </section>

        <section aria-labelledby="lab-scores" className="flex flex-col gap-4 rounded-[20px] bg-surface p-4 md:p-5">
          <h3 id="lab-scores" className="px-1 text-[1.0625rem] tracking-[-0.01em]">
            The four scores
          </h3>
          {scores ? (
            <>
              <p className="px-1 text-sm text-muted">Drag any score and watch the overall score follow the weakest one.</p>
              <div className="flex flex-col gap-3 rounded-2xl bg-page p-4">
                {SCORES.map((s) => (
                  <label key={s.key} className="flex flex-col gap-1.5">
                    <span className="flex items-baseline justify-between gap-3 text-sm">
                      <span className={s.key === weakest ? "font-semibold" : ""}>
                        {s.label}
                        {s.key === weakest ? <span className="font-normal text-muted"> · weakest</span> : null}
                      </span>
                      <span className="tabular-nums">{pct(scores[s.key])}</span>
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={pct(scores[s.key])}
                      onChange={(event) => setScore(s.key, Number(event.target.value) / 100)}
                      aria-describedby={`hint-${s.key}`}
                      className="w-full accent-[var(--color-accent)]"
                    />
                    <span id={`hint-${s.key}`} className="text-xs text-muted">
                      {s.hint}
                    </span>
                  </label>
                ))}
              </div>
              <div aria-live="polite" className="flex flex-col gap-2 rounded-2xl bg-page p-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-semibold">Overall score</span>
                  <span className="text-[2rem] font-semibold leading-none tracking-[-0.025em] text-accent tabular-nums">
                    {pct(overall(scores))}
                  </span>
                </div>
                <span className="h-2.5 overflow-hidden rounded-full bg-fill" aria-hidden="true">
                  <span
                    className="block h-full rounded-full bg-accent transition-[width] duration-500 ease-apple motion-reduce:transition-none"
                    style={{ width: `${pct(overall(scores))}%` }}
                  />
                </span>
                <p className="text-xs text-muted">
                  A plain average would say {pct(average(scores))}. The overall score is pulled toward the weakest of the four,
                  so one bad score can&apos;t hide behind three good ones.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOverrides((current) => ({ ...current, [example.id]: example.scores! }))}
                className="w-fit rounded-full bg-page px-4 py-1.5 text-sm font-medium transition-transform duration-100 active:scale-[0.98]"
              >
                Reset this example
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 rounded-2xl bg-page p-4">
              <p className="text-sm font-semibold">Not scored this way</p>
              <p className="text-[0.9375rem] leading-snug text-muted">
                A refusal makes no claims, so there is nothing for these four scores to check. Scoring it anyway would drag
                the average down for doing the right thing. Trick questions are graded on one thing only: did it decline?
              </p>
            </div>
          )}
        </section>
      </div>
      <p className="max-w-[68ch] px-1 text-sm text-muted">
        These are made-up answers and example scores worked out on this page to show the idea. No AI is called. The real
        numbers from our projects are on the engineering page.
      </p>
    </div>
  );
}
