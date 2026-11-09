"use client";

import { useState } from "react";

type Result = { build: string; solved: number | null; of: number; time: string };

type Setup = {
  id: string;
  label: string;
  bugs: string;
  note: string;
  loops: Result[];
  graphs: Result[];
};

/** Recorded results, 2–5 Nov 2026 (agent-arena reports/model-comparison.md). Medians per run. */
const SETUPS: Setup[] = [
  {
    id: "laptop",
    label: "A small model on a laptop",
    bugs: "Practice faults 1 to 10, once each",
    note: "Slow and unreliable: one laptop answers one question at a time. Three of the loop builds weren't run on it.",
    loops: [
      { build: "Plain code", solved: 7, of: 10, time: "about 5 minutes" },
      { build: "LangChain", solved: null, of: 10, time: "" },
      { build: "LangGraph", solved: null, of: 10, time: "" },
      { build: "CrewAI", solved: null, of: 10, time: "" },
    ],
    graphs: [
      { build: "Plain code", solved: 9, of: 10, time: "about 8 minutes" },
      { build: "LangGraph", solved: 7, of: 10, time: "about 10 minutes" },
      { build: "CrewAI", solved: 10, of: 10, time: "about 9 minutes" },
    ],
  },
  {
    id: "gpu",
    label: "A big model on a rented graphics card",
    bugs: "Practice faults 1 to 10, three times each",
    note: "On the easier faults nearly every build gets there.",
    loops: [
      { build: "Plain code", solved: 30, of: 30, time: "under a minute" },
      { build: "LangChain", solved: 29, of: 30, time: "under a minute" },
      { build: "LangGraph", solved: 30, of: 30, time: "under a minute" },
      { build: "CrewAI", solved: 26, of: 30, time: "under a minute" },
    ],
    graphs: [
      { build: "Plain code", solved: 30, of: 30, time: "about 1 minute" },
      { build: "LangGraph", solved: 30, of: 30, time: "under 2 minutes" },
      { build: "CrewAI", solved: 30, of: 30, time: "under 2 minutes" },
    ],
  },
  {
    id: "hard",
    label: "The same big model, hard faults only",
    bugs: "The 5 hard faults, three times each",
    note: "Here the shape shows: the loops spread widely, every planned build fixes nearly all of them.",
    loops: [
      { build: "Plain code", solved: 14, of: 15, time: "" },
      { build: "LangChain", solved: 10, of: 15, time: "" },
      { build: "LangGraph", solved: 11, of: 15, time: "" },
      { build: "CrewAI", solved: 5, of: 15, time: "" },
    ],
    graphs: [
      { build: "Plain code", solved: 14, of: 15, time: "" },
      { build: "LangGraph", solved: 15, of: 15, time: "" },
      { build: "CrewAI", solved: 14, of: 15, time: "" },
    ],
  },
  {
    id: "openai",
    label: "OpenAI's small paid model",
    bugs: "Practice faults 1 to 10, three times each",
    note: "A strong model hides the difference: 208 of 210 runs fixed, for 79 cents in total.",
    loops: [
      { build: "Plain code", solved: 30, of: 30, time: "6 seconds" },
      { build: "LangChain", solved: 30, of: 30, time: "6 seconds" },
      { build: "LangGraph", solved: 30, of: 30, time: "6 seconds" },
      { build: "CrewAI", solved: 28, of: 30, time: "12 seconds" },
    ],
    graphs: [
      { build: "Plain code", solved: 30, of: 30, time: "9 seconds" },
      { build: "LangGraph", solved: 30, of: 30, time: "9 seconds" },
      { build: "CrewAI", solved: 30, of: 30, time: "10 seconds" },
    ],
  },
];

function Bar({ r, accent }: { r: Result; accent?: boolean }) {
  const pct = r.solved === null ? 0 : (100 * r.solved) / r.of;
  return (
    <li className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3 text-[0.9375rem]">
        <span className="font-medium">{r.build}</span>
        <span className="tabular-nums text-muted">
          {r.solved === null ? "not run" : `${r.solved} of ${r.of}`}
          {r.time ? ` · ${r.time}` : ""}
        </span>
      </div>
      <div className="h-3 w-full rounded-full bg-fill" aria-hidden="true">
        <div
          className={`h-3 rounded-full transition-[width] duration-500 motion-reduce:transition-none ${accent ? "bg-accent" : "bg-muted"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </li>
  );
}

function Group({ title, results, accent }: { title: string; results: Result[]; accent?: boolean }) {
  return (
    <div className="flex flex-col gap-3 rounded-[20px] bg-surface p-5 md:p-6">
      <p className={`text-sm font-semibold ${accent ? "text-accent" : "text-muted"}`}>{title}</p>
      <ul className="flex flex-col gap-3">
        {results.map((r) => (
          <Bar key={r.build} r={r} accent={accent} />
        ))}
      </ul>
    </div>
  );
}

/** Pick a model and see how many faults each build fixed. Recorded results only: it never runs anything. */
export function ModelLab() {
  const [selected, setSelected] = useState(SETUPS[1].id);
  const s = SETUPS.find((x) => x.id === selected) ?? SETUPS[1];
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-[20px] bg-surface p-4 md:p-5">
        <h3 className="px-1 text-[1.0625rem] tracking-[-0.01em]">Pick a model</h3>
        <p className="px-1 pb-3 text-sm text-muted">The builds, the faults and the limits stay the same; only the AI model changes.</p>
        <ul className="grid gap-1.5 md:grid-cols-2">
          {SETUPS.map((x) => {
            const active = x.id === s.id;
            return (
              <li key={x.id}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelected(x.id)}
                  className={`w-full rounded-2xl px-4 py-3 text-left text-[0.9375rem] transition-[background-color,transform] duration-200 active:scale-[0.98] active:duration-100 ${
                    active ? "bg-page font-semibold" : "bg-transparent text-muted hover:bg-page/60"
                  }`}
                >
                  {x.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <div aria-live="polite" className="flex flex-col gap-3">
        <p className="px-1 text-[1.0625rem]">
          <strong>{s.bugs}.</strong> {s.note}
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <Group title="One mechanic (a loop)" results={s.loops} />
          <Group title="A workshop with a plan (a graph)" results={s.graphs} accent />
        </div>
      </div>
      <p className="max-w-[68ch] px-1 text-sm text-muted">
        Recorded results from 2 to 5 Nov 2026: faults fixed out of runs, and the typical time per run. Each build had the same
        limits: 20 tries, 10 minutes and 50 cents per run.
      </p>
    </div>
  );
}
