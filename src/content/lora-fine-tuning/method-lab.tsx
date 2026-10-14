"use client";

import { useState } from "react";

/**
 * Our measured results, baked into the page. Nothing here calls a model. Every value traces to a raw result file
 * listed in brief.md; "not run" means no measured result exists for that method on that job.
 */

type Method = "Untrained" | "Full fine-tuning" | "LoRA" | "QLoRA" | "Large hosted model";

type Row = { method: Method; detail?: string; value: number | null };
type Test = { id: string; label: string; metric: string; rows: Row[]; note?: string };
type Cost = { method: Method; detail: string };
type Job = { id: string; label: string; intro: string; tests: Test[]; costs: Cost[]; caveat?: string };

const JOBS: Job[] = [
  {
    id: "sql",
    label: "Database questions",
    intro: "Turn a plain-English question into a database query. A 3-billion-part model, about 20,000 practice examples.",
    tests: [
      {
        id: "familiar",
        label: "Familiar",
        metric: "Questions answered right, out of 1,000 like the practice ones",
        rows: [
          { method: "Untrained", value: 51.6 },
          { method: "Full fine-tuning", value: null },
          { method: "LoRA", value: 77.2 },
          { method: "QLoRA", value: 77.8 },
        ],
      },
      {
        id: "harder",
        label: "Harder",
        metric: "Questions answered right, out of 200 harder ones",
        rows: [
          { method: "Untrained", value: 24.5 },
          { method: "Full fine-tuning", value: null },
          { method: "LoRA", value: 50.0 },
          { method: "QLoRA", value: 48.0 },
        ],
      },
      {
        id: "unfamiliar",
        label: "Unfamiliar",
        metric: "Questions answered right, out of 500 about real databases it had never seen",
        rows: [
          { method: "Untrained", value: 23.8 },
          { method: "Full fine-tuning", value: null },
          { method: "LoRA", value: 17.0 },
          { method: "QLoRA", value: 16.0 },
          { method: "Large hosted model", detail: "shown 3 examples, no training", value: 41.6 },
        ],
        note: "Both trained versions got worse than the untrained model here.",
      },
      {
        id: "general",
        label: "General knowledge",
        metric: "A 500-question general-knowledge quiz: did training make it forget?",
        rows: [
          { method: "Untrained", value: 57.8 },
          { method: "Full fine-tuning", value: null },
          { method: "LoRA", value: 57.8 },
          { method: "QLoRA", value: 56.4 },
        ],
        note: "Almost no forgetting.",
      },
    ],
    costs: [
      { method: "LoRA", detail: "8.5 GB of graphics-card memory · about 1 h 55 min" },
      { method: "QLoRA", detail: "3.6 GB of graphics-card memory · about 1 h 56 min" },
    ],
  },
  {
    id: "mood",
    label: "Tweet mood",
    intro: "Read a tweet and say whether it is negative, neutral or positive. Small models of 110 to 125 million parts.",
    tests: [
      {
        id: "tweets",
        label: "12,284 tweets",
        metric: "Score from 0 to 100, balanced across the three moods",
        rows: [
          { method: "Untrained", detail: "BERT, asked without training", value: 16.7 },
          { method: "Full fine-tuning", detail: "BERT", value: 69.17 },
          { method: "Full fine-tuning", detail: "RoBERTa", value: 71.23 },
          { method: "Full fine-tuning", detail: "RoBERTa trained on tweets", value: 71.89 },
          { method: "LoRA", value: null },
          { method: "QLoRA", value: null },
        ],
      },
    ],
    costs: [{ method: "Full fine-tuning", detail: "BERT: 3.9 GB of graphics-card memory · about 27 min" }],
  },
  {
    id: "mac",
    label: "Mac commands",
    intro: "Turn a typed request (“mute the sound”) into the right action on a Mac, out of 56. Tested on 106 hand-written commands.",
    tests: [
      {
        id: "golden",
        label: "106 commands",
        metric: "Picked the right action",
        rows: [
          { method: "Untrained", value: null },
          { method: "Full fine-tuning", detail: "a 270-million-part model built for actions", value: 91.5 },
          { method: "LoRA", detail: "a general 1-billion-part model", value: 79.2 },
          { method: "QLoRA", value: null },
        ],
      },
    ],
    costs: [
      { method: "Full fine-tuning", detail: "about 2.0 seconds per command on a laptop" },
      { method: "LoRA", detail: "about 6.8 seconds per command on a laptop" },
    ],
    caveat: "The two used different starting models, so this compares two whole setups, not only the method.",
  },
  {
    id: "spam",
    label: "Spam filter",
    intro: "Flag spam emails. A 149-million-part model, trained on public email collections.",
    tests: [
      {
        id: "familiar",
        label: "Familiar emails",
        metric: "Emails labelled right, from the same collections it trained on",
        rows: [
          { method: "Untrained", value: null },
          { method: "Full fine-tuning", value: 99.1 },
          { method: "LoRA", value: null },
          { method: "QLoRA", value: null },
        ],
      },
      {
        id: "unseen",
        label: "Unseen collection",
        metric: "Spam caught, from an email collection kept out of training (about 2 in 1,000 good emails wrongly flagged)",
        rows: [
          { method: "Untrained", value: null },
          { method: "Full fine-tuning", value: 79.5 },
          { method: "LoRA", value: null },
          { method: "QLoRA", value: null },
        ],
        note: "The same pattern as the database job: less sure-footed on unfamiliar data.",
      },
    ],
    costs: [],
  },
  {
    id: "voice",
    label: "Character voice",
    intro: "Answer in the voice of a TV character. A 1-billion-part model, 300 practice steps.",
    tests: [
      {
        id: "judge",
        label: "Blind judge",
        metric: "Which answer a blind AI judge preferred, over 24 head-to-head pairs",
        rows: [
          { method: "Untrained", value: null },
          { method: "Full fine-tuning", value: null },
          { method: "LoRA", value: (13 / 24) * 100 },
          { method: "QLoRA", value: (11 / 24) * 100 },
        ],
        note: "13 against 11: too close to call.",
      },
    ],
    costs: [
      { method: "LoRA", detail: "3.0 GB of graphics-card memory · about 6 min" },
      { method: "QLoRA", detail: "1.7 GB of graphics-card memory · about 7 min" },
    ],
  },
];

const fmt = (v: number) => (Number.isInteger(v) ? `${v}%` : `${Math.round(v)}%`);

function Pills<T extends { id: string; label: string }>({
  items,
  active,
  onSelect,
  label,
  small = false,
}: {
  items: T[];
  active: string;
  onSelect: (id: string) => void;
  label: string;
  small?: boolean;
}) {
  return (
    <div role="tablist" aria-label={label} className="flex flex-wrap gap-2">
      {items.map((item) => {
        const selected = item.id === active;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onSelect(item.id)}
            className={`rounded-full font-medium transition-[background-color,color,transform] duration-200 active:scale-[0.98] active:duration-100 ${
              small ? "px-3 py-1 text-[0.8125rem]" : "px-4 py-1.5 text-sm"
            } ${selected ? "bg-accent text-page" : small ? "bg-page text-ink" : "bg-surface text-ink"}`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export function MethodLab() {
  const [jobId, setJobId] = useState(JOBS[0].id);
  const [testIds, setTestIds] = useState<Record<string, string>>({});
  const job = JOBS.find((j) => j.id === jobId) ?? JOBS[0];
  const test = job.tests.find((t) => t.id === testIds[job.id]) ?? job.tests[0];
  const best = Math.max(...test.rows.map((row) => row.value ?? 0));

  return (
    <div className="flex flex-col gap-5">
      <Pills items={JOBS} active={job.id} onSelect={setJobId} label="Job" />

      <section aria-labelledby="lab-job" className="flex flex-col gap-4 rounded-[20px] bg-surface p-4 md:p-6">
        <div className="flex flex-col gap-1 px-1">
          <h3 id="lab-job" className="text-[1.0625rem] tracking-[-0.01em]">
            {job.label}
          </h3>
          <p className="text-sm text-muted">{job.intro}</p>
        </div>

        {job.tests.length > 1 ? (
          <Pills
            items={job.tests}
            active={test.id}
            onSelect={(id) => setTestIds((current) => ({ ...current, [job.id]: id }))}
            label="Test"
            small
          />
        ) : null}

        <div aria-live="polite" className="flex flex-col gap-3 rounded-2xl bg-page p-4">
          <p className="text-sm font-semibold">{test.metric}</p>
          <ul className="flex flex-col gap-3">
            {test.rows.map((row, i) => {
              const ran = row.value !== null;
              const strong = ran && row.value === best;
              return (
                <li key={`${row.method}-${i}`} className="grid grid-cols-[minmax(0,9rem)_minmax(0,1fr)_3rem] items-center gap-3 text-sm sm:grid-cols-[minmax(0,13rem)_minmax(0,1fr)_3rem]">
                  <span className="flex flex-col leading-tight">
                    <span className={ran ? (strong ? "font-semibold" : "") : "text-muted"}>{row.method}</span>
                    {row.detail ? <span className="text-xs text-muted">{row.detail}</span> : null}
                  </span>
                  {ran ? (
                    <span className="h-2.5 overflow-hidden rounded-full bg-fill" aria-hidden="true">
                      <span
                        className={`block h-full rounded-full transition-[width] duration-500 ease-apple motion-reduce:transition-none ${
                          strong ? "bg-accent" : "bg-accent/45"
                        }`}
                        style={{ width: `${row.value}%` }}
                      />
                    </span>
                  ) : (
                    <span className="text-xs text-muted">not run</span>
                  )}
                  <span className="text-right tabular-nums">{ran ? fmt(row.value as number) : "–"}</span>
                </li>
              );
            })}
          </ul>
          {test.note ? <p className="text-xs text-muted">{test.note}</p> : null}
        </div>

        {job.costs.length ? (
          <div className="flex flex-col gap-1.5 px-1">
            <p className="text-xs font-semibold text-muted">What training took</p>
            {job.costs.map((cost) => (
              <p key={cost.method + cost.detail} className="text-sm">
                <span className="font-semibold">{cost.method}: </span>
                <span className="text-muted">{cost.detail}</span>
              </p>
            ))}
          </div>
        ) : null}
        {job.caveat ? <p className="px-1 text-sm text-muted">{job.caveat}</p> : null}
      </section>

      <p className="max-w-[68ch] px-1 text-sm text-muted">
        These are our measured results from July and August 2026, built into the page; nothing here calls a model.
        &ldquo;Not run&rdquo; means we have no measured result for that method on that job.
      </p>
    </div>
  );
}
